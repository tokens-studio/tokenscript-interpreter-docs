---
title: Authoring Color Schemas
description: Define color specifications, initializers, and conversions for the TokenScript runtime.
sidebar_label: Color Schemas
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Authoring Color Schemas

Color schemas teach the interpreter how to instantiate, format, and convert color values. They are JSON documents validated by `ColorSpecificationSchema` (`src/interpreter/config/managers/color/schema.ts`) and executed by `ColorManager`.

## Schema Anatomy

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
  "name": "SRGB",
  "type": "color",
  "schema": {
    "type": "object",
    "order": ["r", "g", "b"],
    "required": ["r", "g", "b"],
    "properties": {
      "r": { "type": "number" },
      "g": { "type": "number" },
      "b": { "type": "number" }
    }
  },
  "initializers": [],
  "conversions": [],
  "description": "RGB color"
}`}
</TokenScriptCodeBlock>

- `name`: Human-readable identifier (also used as subtype label, e.g., `Color.SRGB`).
- `schema`: JSON schema describing attributes exposed for structured colors. `order` controls property formatting.
- `initializers`: Functions that build a color from input values.
- `conversions`: Conversion scripts to/from other color schemas.

## Registering Schemas

```ts
import srgbSpec from "../data/specifications/colors/srgb.json" assert { type: "json" };
import { ColorManager } from "@tokens-studio/tokenscript-interpreter";

const colorManager = new ColorManager();

colorManager.register(
  "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0/",
  srgbSpec,
);
```

- URIs must be unique and versioned (`/0/`, `/1.0.0/`, etc.). The manager resolves `/latest/` automatically.
- Registering executes `initializers` and `conversions`, compiling them into interpreter ASTs.

## Initializers

Initializers allow TokenScript users to call functions like `srgb(255, 0, 0)`:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
  "title": "function",
  "keyword": "srgb",
  "schema": { "type": "string", "pattern": "^rgb\\\\((\\\\d{1,3}),\\\\s*(\\\\d{1,3}),\\\\s*(\\\\d{1,3})\\\\)$" },
  "script": {
    "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
    "script": "variable color_parts: List = {input};\\nvariable output: Color.SRGB;\\noutput.r = color_parts.get(0);\\n..."
  }
}`}
</TokenScriptCodeBlock>

- `keyword` becomes the callable name in TokenScript.
- `{input}` resolves to either the parsed function argument list or a pre-validated value.
- Scripts run inside a dedicated interpreter with a cloned `Config`.

## Conversions

Conversions define `color.to.<Target>()` methods:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
  "description": "Converts HEX to RGB",
  "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/hex-color/0/",
  "target": "$self",
  "lossless": true,
  "script": {
    "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
    "script": "variable hex: String = {input};\\n..."
  }
}`}
</TokenScriptCodeBlock>

- `source`: URI of the input format. `$self` refers to the schema being registered.
- `target`: URI of the output format. `$self` indicates identity conversions.
- Scripts receive `{input}` as a `ColorSymbol`, and must return a `ColorSymbol`.
- `lossless` flags reversible conversions, informing downstream tooling.

## Attribute Access & Validation

- Attributes (`color.r`, `color.l`) map to schema properties. Setting an undefined attribute triggers `ColorManagerError.MISSING_SCHEMA`.
- Type mismatches raise `ColorManagerError.INVALID_ATTRIBUTE_TYPE`.

## Versioning & Resolution

- URIs may contain semantic versions (`/0.0.1/`). The manager downgrades gracefully (`0.0.1` → `0.0` → `0` → `latest`).
- Use `/latest/` aliases when distributing frequently updated specs, but always publish concrete versions for reproducibility.

## Testing Schemas

1. Load the schema into a custom `ColorManager`.
2. Run targeted interpreter tests similar to `tests/interpreter/color-manager.test.ts`.
3. Execute the compliance suite to ensure conversions and initializers behave consistently.

## Distribution Tips

- Store schema JSON alongside documentation (`docs/assets/`) or publish via HTTP(S) so they can be fetched dynamically (`fetchTokenScriptSchema` in `src/utils/schema-fetcher.ts`).
- Provide human-friendly docs explaining accepted ranges and initializers to help TokenScript authors adopt new color spaces.
