---
title: Control Flow & Execution Model
description: Statement execution order, branching, looping, and return semantics in TokenScript.
sidebar_label: Control Flow
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Control Flow & Execution Model

TokenScript executes statements sequentially within a single global scope. The interpreter maintains one `SymbolTable` (`src/interpreter/symbolTable.ts`), so variables declared in any block remain available globally unless reassigned later.

## Statement Evaluation

- Programs consist of a top-level list of statements. The interpreter walks the list and keeps the most recent non-null value as the block result.
- Expressions that produce a symbol value can appear as standalone statements; their result becomes the current block result.
- `return` raises an internal `ReturnSignal`, unwinding the current block (`src/interpreter/interpreter.ts`).

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable result: Number;
variable condition: Boolean = true;

if (condition) [
    result = 1;
] else [
    result = 0;
];

return result;`}
</TokenScriptCodeBlock>

## Branching

### `if` / `elif` / `else`

- Conditions must evaluate to `Boolean`.
- Branch bodies are enclosed in `[...]`.
- The first truthy condition executes; remaining branches are skipped.
- `else` is optional; omitted when not needed.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable size: String = "medium";
variable padding: NumberWithUnit;

if (size == "small") [
    padding = 8px;
] elif (size == "large") [
    padding = 24px;
] else [
    padding = 16px;
];`}
</TokenScriptCodeBlock>

### Truthiness

- Only expressions that result in `Boolean` values are accepted in conditions. Passing other types raises an `InterpreterError`.
- `Boolean` symbols wrapping `null` are treated as invalid.

## Loops

- TokenScript supports `while` loops:

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable i: Number = 0;
variable values: List = [];

while (i < 5) [
   values = values.append(i);
   i = i + 1;
];`}
</TokenScriptCodeBlock>

- Loop conditions re-evaluate at the start of each iteration.
- The interpreter enforces a guard `MAX_ITERATIONS` (default `1000`, configurable via `Config.languageOptions`) to prevent infinite loops. Exceeding the limit throws an `InterpreterError`.
- There are no `break` or `continue` keywords; implement early exits with `return` or condition checks.

## Returns

- `return expression;` ends the current block immediately and yields the evaluated expression.
- Using `return` at the top level short-circuits evaluation of remaining statements.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable palette: List = #FF0000, #00FF00, #0000FF;

return palette.length();

// Statements here will not execute.`}
</TokenScriptCodeBlock>

## Attribute Assignment

- Attributes are set using dotted identifiers (`color.value = "#112233"`).
- For colors, `ColorManager` validates attribute names against the active schema. Invalid assignments raise descriptive errors.
- Other types expose only the attributes documented in [Types and Symbols](types.md).

## Error Handling

- Syntax errors (unexpected tokens, missing brackets) are raised during parsing with annotated source snippets.
- Runtime errors (type mismatches, invalid method calls, excessive loop iterations) raise `InterpreterError` with the line number of the offending token.

Continue to [Built-in Functions](functions.md) for available runtime helpers and math utilities.
