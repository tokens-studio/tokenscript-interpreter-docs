---
title: Configuration Deep Dive
description: Customize color, unit, and function managers for the TokenScript runtime.
sidebar_label: Configuration
---

# Configuration Deep Dive

The `Config` class (`src/interpreter/config/config.ts`) wires together language options and runtime managers. Most host applications will customize at least one manager to support additional color spaces, measurement units, or helper functions.

## Creating a Config

```ts
import {
  Config,
  ColorManager,
  UnitManager,
  FunctionsManager,
} from "@tokens-studio/tokenscript-interpreter";

const config = new Config({
  languageOptions: { MAX_ITERATIONS: 2000 },
  colorManager: new ColorManager(),
  unitManager: new UnitManager(),
  functionsManager: new FunctionsManager(),
});
```

- Omitting options uses default managers (which already include a Hex color spec and math function set).
- Each manager holds a back-reference to the `Config` instance so that conversions can compose (e.g., function specs may invoke unit conversions).

## Loading Color Specifications

Color schemas describe component structures, initializers, and conversions. Specs can be loaded from JSON files (see `data/specifications/colors/*.json`):

```ts
import { Config, ColorManager } from "@tokens-studio/tokenscript-interpreter";
import srgbSpec from "../data/specifications/colors/srgb.json" assert { type: "json" };

const colorManager = new ColorManager();
colorManager.register(
  "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0/",
  srgbSpec,
);

const config = new Config({ colorManager });
```

- `register` accepts JSON strings or parsed objects. Zod schemas validate the structure.
- Initializers and conversions are written in TokenScript and executed via nested interpreters.
- Conversions are automatically exposed via `color.to.<Target>()`.

## Loading Unit Specifications

The `UnitManager` maintains measurement definitions and conversion graphs. While default specs cover CSS units, you can register additional ones:

```ts
import customUnits from "./custom-units.json" assert { type: "json" };

const unitManager = new UnitManager();
for (const spec of customUnits) {
  unitManager.register(spec.uri, spec);
}
```

- Conversion paths are resolved using BFS with semantic version awareness (see `BaseManager`).
- Relative units (percentages) are marked in the spec schema so operations like multiplication apply percentage semantics.

## Registering Functions

Extend the language with custom helpers through `FunctionsManager`:

```ts
const functionsManager = new FunctionsManager();

functionsManager.register("lerp", {
  name: "Linear Interpolation",
  keyword: "lerp",
  description: "Linearly interpolates between two numbers.",
  parameters: [
    { name: "start", type: "Number" },
    { name: "end", type: "Number" },
    { name: "t", type: "Number" },
  ],
  returns: { type: "Number" },
  implementation: {
    type: "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/implementation",
    script: `
      variable delta: Number = {end} - {start};
      return {start} + delta * {t};
    `,
  },
});
```

- Specs are validated with Zod (`FunctionSpecificationSchema`).
- Implementations run inside the interpreter with arguments exposed via `{parameter}` references.

## Sharing Configs

- Pass the same `Config` instance to multiple interpreters to reuse manager state.
- Clone configs with `config.clone()` when isolating conversions (managers are deep-cloned).

## Language Options

- `MAX_ITERATIONS`: guard against runaway `while` loops (default `1000`).
- Additional language options can be surfaced by extending `LanguageOptions` in future releases.

## Best Practices

1. Load specs at startup and reuse manager instances to avoid re-parsing scripts.
2. Validate custom specs with dedicated interpreter tests or the compliance suite.
3. When distributing specs, version URIs using the `/major.minor.patch/` convention so converters can resolve `latest` automatically.
4. Keep long-running conversions pure; side effects complicate caching and testing.
