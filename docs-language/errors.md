---
title: Error Handling
description: Parser and runtime error classes and typical failure scenarios.
sidebar_label: Errors
---

# Error Handling

TokenScript reports issues through a small set of error classes defined under `src/interpreter/errors.ts` and related modules. Each error carries the originating token (line, column) when available, making it easier to debug scripts or token sets.

## Parser Errors

- **`ParserError`** is raised when the parser encounters unexpected tokens, missing delimiters, or malformed type declarations.
- Error messages include a snippet of the surrounding source with a caret (`^`) pointing at the offending column.
- Examples:
  - `Expected token type ASSIGN but got RBLOCK`
  - `Invalid syntax` (with context showing the problematic line)

## Lexer Errors

- **`LexerError`** covers invalid characters, unterminated strings/references, or malformed numbers.
- Messages indicate the position and reason, e.g., `Invalid character '(' at position 12.`
- Unterminated references produce errors such as `Unterminated reference, missing '}'`.

## Interpreter Errors

- **`InterpreterError`** represents runtime issues while evaluating the AST. Common categories include:
  - Type mismatches (`Arithmetic operator + requires Number or NumberWithUnit operands`)
  - Method/attribute problems (`Method 'join' not found on 'Color'`)
  - Unit or color conversion failures (`Cannot mix units: px, rem`)
  - Loop guard violations (`Max iterations exceeded in while loop`)
  - Color schema validation errors (e.g., missing components when setting attributes)
- Errors include the original message, line number, and token for precise debugging.

## Specialized Errors

- Color schemas also emit `ColorManagerError` variants (see `src/interpreter/config/managers/color/errors.ts`) for issues like missing schemas or invalid attribute types.
- Compliance tooling wraps interpreter errors to report pass/fail status in the compliance suite (`src/compliance-suite.ts`).

## Handling Errors in Hosts

- CLI commands catch interpreter errors and print readable summaries.
- SDK consumers should catch `LexerError`, `ParserError`, and `InterpreterError` when calling `Interpreter.interpret()` or `TokenSetResolver.resolve()` to provide user feedback.
- For automated pipelines, prefer mapping messages to actionable tips (e.g., “Check for circular references”).

## Debugging Tips

1. Verify variable declarations include correct types.
2. Ensure units are compatible before performing arithmetic; convert explicitly if needed.
3. Use the interactive CLI (`tokenscript interactive`) or REPL to isolate failing expressions.
4. When loading custom schemas, validate them with the compliance suite or dedicated tests before shipping.

Return to the [Language Overview](overview.md) or continue to integrator-focused guides after the specification.
