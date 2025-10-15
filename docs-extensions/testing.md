---
title: Testing Extensions
description: Strategies for validating custom color, unit, and function extensions.
sidebar_label: Testing
---

# Testing Extensions

Custom schemas and functions should ship with automated verification to prevent regressions. This chapter outlines recommended practices for each extension type.

## Baseline Setup

1. **Clone Managers:** Instantiate dedicated `ColorManager`, `UnitManager`, or `FunctionsManager` with your specs.
2. **Create Config:** Pass the managers into a `Config` and share it across interpreters or resolvers under test.
3. **Use Vitest Examples:** Follow established patterns in `tests/interpreter/color-manager.test.ts`, `unit-manager.test.ts`, and `config-color-registration.test.ts`.

## Color Schemas

- **Initializers:** Verify keyword constructors output expected component values.
- **Conversions:** Test both directions of conversions, ensuring round-trips when marked `lossless: true`.
- **Attributes:** Assert that attribute assignments validate schema types and produce meaningful errors on mismatch.
- **Formatting:** Use `ColorManager.formatColorMethod` to confirm consistent string output.

```ts
import { describe, expect, it } from "vitest";
import { ColorManager, Config, Interpreter, Lexer, Parser } from "@tokens-studio/tokenscript-interpreter";

describe("Custom color schema", () => {
  it("converts hex to custom space", () => {
    const colorManager = new ColorManager();
    colorManager.register("https://example.com/colors/custom/1.0.0/", customSpec);

    const config = new Config({ colorManager });
    const interpreter = new Interpreter(new Parser(new Lexer("return #FF6600.to.custom();")).parse(), { config });

    const result = interpreter.interpret();
    expect(result?.getTypeName()).toBe("Color.Custom");
  });
});
```

## Unit Schemas

- **Conversions:** Assert that arithmetic across units produces correct values.
- **Relative Units:** Test `to_absolute` paths by combining relative and absolute operands.
- **Error Cases:** Confirm clear errors on unsupported conversions.

```ts
const config = new Config({ unitManager });
const interpreter = new Interpreter(new Parser(new Lexer("return 1rem + 8px;")).parse(), { config });
expect(interpreter.interpret()?.toString()).toBe("24px");
```

## Function Specs

- Evaluate function calls with valid and invalid inputs to ensure error handling.
- Test interactions with built-in methods (`type`, color conversions) as needed.
- Keep scripts deterministic; avoid console output to maintain clean test logs.

## Compliance Suite

- For high confidence, mirror official compliance tests by adding custom JSON cases and running them via `evaluateStandardCompliance`.
- Group custom tests separately to avoid polluting upstream suites while still leveraging the same runner.

## Continuous Integration

- Add npm scripts to execute extension tests alongside `npm run test`.
- Optionally include performance benchmarks when conversions are heavy (see `tests/performance/benchmark.test.ts`).

## Debugging Failures

- Use the interactive CLI or REPL to reproduce expressions in isolation.
- Enable `PerformanceTracker` when diagnosing slow conversions or resolving large token sets.
- Log `error.originalMessage` when catching interpreter errors; it often includes the underlying cause from nested scripts.
