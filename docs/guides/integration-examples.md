---
title: Integration Examples
description: Apply TokenScript in existing pipelines such as Style Dictionary, design tooling, and custom build scripts.
sidebar_label: Integration Examples
---

# Integration Examples

TokenScript plays well with existing design token workflows. This guide highlights integration patterns inspired by the examples under `examples/blog-articles/`.

## Style Dictionary Transform

Use TokenScript to implement precise transforms before Style Dictionary emits platform assets.

```ts
import StyleDictionary from "style-dictionary";
import { schemaToDictionaryTransform } from "tokenscript";
import { CssPx } from "tokenscript-schemas";

const pxToRem = schemaToDictionaryTransform({
  output: CssPx,
  config: { baseSize: "16px" },
});

StyleDictionary.registerTransform("tokenscript/pxToRem", pxToRem);
```

- Converts raw token values to the desired schema (e.g., px → rem).
- Chain multiple TokenScript-backed transforms for complex conversions.
- See `examples/blog-articles/using-tokenscript-with-styledictionary.mdx` for a longer walkthrough.

## Transform Pipelines

TokenScript symbols carry rich methods (`NumberWithUnit`, `Color`, `List`), simplifying data reshaping:

```ts
const cssBorderToObject = (input) => {
  const [width, style, color] = input;
  return {
    borderWidth: width.toString(),
    borderStyle: style.toString(),
    borderColor: color.to.rgb().toString(),
  };
};
```

- Read the full idea in `examples/blog-articles/transform-pipeline.mdx`.
- TokenScript handles parsing (`1px solid #F00` → `[NumberWithUnit, String, Color]`), so transforms can focus on mapping.

## Design Tool Integrations

- **Figma/DesignOps:** Use the CLI to preprocess tokens before exporting components.
- **Penpot or custom editors:** Feed interpreted tokens into plugin APIs; leverage color conversions and unit-aware math to align with tool requirements.

## Build Scripts

Embed TokenScript processing into existing build steps:

```ts
import { interpretTokens } from "@tokens-studio/tokenscript-interpreter";

export async function buildTokens() {
  const source = await fs.promises.readFile("./tokens/index.json", "utf8");
  const json = JSON.parse(source);
  const resolved = interpretTokens(json);
  await fs.promises.writeFile("./dist/tokens.json", JSON.stringify(resolved, null, 2));
}
```

- Combine with bundlers or static site generators to ship updated token artifacts.
- Use `PerformanceTracker` to audit throughput during builds.

## Web REPL / Playground

- The repository includes a web-based REPL under `examples/web-repl` (React/Vite setup). Use it as a starting point for embedding TokenScript experimentation into design portals or internal tools.
- Point the REPL at your custom schemas by bundling them with the client build or fetching them via HTTP using `fetchTokenScriptSchema`.

## Tips for Adoption

1. Start by replacing ad-hoc string manipulations with TokenScript evaluations.
2. Gradually externalize transformations into TokenScript files so designers can collaborate directly.
3. Keep CLI automation scripts in sync with code integrations to guarantee parity across environments.
