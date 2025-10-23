---
title: Authoring Unit Schemas
description: Extend TokenScript with custom measurement units and conversions.
sidebar_label: Unit Schemas
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Authoring Unit Schemas

Unit schemas define measurement keywords (e.g., `rem`, `%`) and conversion rules. The `UnitManager` (`src/interpreter/config/managers/unit/manager.ts`) consumes these specs and exposes conversions to arithmetic operators and built-in functions.

## Schema Structure

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
  "name": "root em",
  "type": "absolute",
  "keyword": "rem",
  "description": "A root em unit, relative to the root font size.",
  "conversions": [
    {
      "source": "$self",
      "target": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/px-unit/0/",
      "script": { "script": "return ({input} * 16)px;" },
      "description": "Convert rem to pixel based on a root font size of 16px."
    }
  ]
}`}
</TokenScriptCodeBlock>

- `name`: Human-readable label.
- `type`: `"absolute"` or `"relative"`.
- `keyword`: Value used in TokenScript literals (e.g., `16rem`).
- `conversions`: Optional array describing how to convert between units. Scripts are TokenScript snippets executed in the interpreter.
- `to_absolute`: Optional script used when combining relative units with absolute ones (e.g., percentages).

Specs are validated by `UnitSpecificationSchema` (`src/interpreter/config/managers/unit/schema.ts`).

## Registration

```ts
import { UnitManager } from "@tokens-studio/tokenscript-interpreter";
import customUnit from "./my-unit.json" assert { type: "json" };

const unitManager = new UnitManager();
unitManager.register("https://example.com/schema/my-unit/1.0.0/", customUnit);
```

- URIs follow the same versioning scheme as color schemas.
- `keyword` lookups are case-insensitive (`unitManager.getSpecByKeyword("%")`).

## Conversion Scripts

- `source`/`target`: URIs or `$self`.
- `{input}`: `NumberWithUnitSymbol` representing the value to convert.
- Scripts must return a `NumberWithUnitSymbol`. Use `NumberSymbol` only when immediately wrapped in a `NumberWithUnitSymbol`.
- Use `parseExpression`-compatible syntax for arithmetic (see defaults in `defaultUnitSpecs`).

## Relative Units

Relative units (type `"relative"`) require a `to_absolute` script:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`"to_absolute": {
  "script": "return {other_value} * ({relative_value} / 100);"
}`}
</TokenScriptCodeBlock>

- `{relative_value}`: Numeric percent (e.g., `50`).
- `{other_value}`: The absolute operand participating in the operation.
- Relative conversions currently support one relative operand paired with one absolute operand (enforced by `UnitManager`).

## Common Format Resolution

When evaluating math expressions, the `UnitManager` attempts to convert all operands to a common unit:

1. Collect candidate units from operands.
2. For each candidate, attempt to convert all inputs into that unit using registered conversions.
3. Select the unit yielding the largest magnitude to minimize precision loss.
4. If no conversion path exists, an `InterpreterError` is raised.

## Testing Units

1. Register the spec in a unit test (see `tests/interpreter/unit-manager.test.ts` for patterns).
2. Exercise arithmetic operations to confirm conversions behave as expected.
3. Validate percent or relative logic by combining relative and absolute operands.

## Best Practices

- Provide both forward and reverse conversions when possible.
- Document baseline assumptions (e.g., `rem` assumes `16px` base) in `description`.
- Keep conversion scripts small and deterministic for easier debugging.
- Reuse URIs when publishing updates; rely on semantic versioning to signal breaking changes.
