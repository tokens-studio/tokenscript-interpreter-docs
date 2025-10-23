---
title: Registering Custom Functions
description: Extend TokenScript with project-specific functions via JSON specifications.
sidebar_label: Functions
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Registering Custom Functions

Custom functions enable higher-level abstractions without modifying the interpreter. The `FunctionsManager` consumes JSON specs validated by `FunctionSpecificationSchema` (`src/interpreter/config/managers/functions/schema.ts`) and exposes them as TokenScript functions.

## Specification Layout

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
  "name": "Linear Interpolation",
  "type": "function",
  "keyword": "lerp",
  "description": "Linearly interpolates between two numbers.",
  "script": {
    "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/implementation",
    "script": "return {start} + ({end} - {start}) * {t};"
  },
  "requirements": []
}`}
</TokenScriptCodeBlock>

- `name`: Friendly label.
- `keyword`: Call name inside TokenScript (`lerp(0, 10, 0.5)`).
- `script`: TokenScript source executed with parameters injected as references (`{start}`, `{end}`, etc.).
- `requirements`: Optional array of schema URIs the function depends on (for documentation or validation).

Specs can be authored by hand or generated programmatically, as long as they pass `FunctionSpecificationSchema`.

## Registration

```ts
import { FunctionsManager } from "@tokens-studio/tokenscript-interpreter";
import lerpSpec from "./lerp.json" assert { type: "json" };

const functionsManager = new FunctionsManager();
functionsManager.register("lerp", lerpSpec);
```

- The `register` method accepts either a JSON string or a parsed object.
- Returning the parsed spec allows further introspection (e.g., to populate documentation).

## Invocation Model

- All parameters appear as `{parameter}` references inside the script.
- Return values must be TokenScript symbols (e.g., `Number`, `Color`), not raw JavaScript primitives.
- You can leverage built-in functions and methods within the script, as it runs in the same interpreter context.

## Error Handling

- Runtime errors inside function scripts bubble up as `InterpreterError`. Validate arguments (e.g., ranges) within the script or with guard logic in the host code.
- If registration fails schema validation, `register` throws with Zod error details.

## Testing

1. Register the function in a test harness.
2. Evaluate representative TokenScript snippets using `Interpreter`.
3. Add compliance-style cases for regression coverage.

## Distribution Tips

- Namespace keywords to avoid collisions (e.g., `ts.lerp`).
- Document function behavior alongside schema docs so TokenScript authors know when to use them.
- Consider bundling functions in packages that export both JSON specs and helper registration utilities.
