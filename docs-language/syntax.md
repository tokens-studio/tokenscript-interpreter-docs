---
title: Lexical Syntax
description: Tokenization rules, keywords, literals, and statement structure for TokenScript.
sidebar_label: Syntax
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Lexical Syntax

TokenScript uses a lightweight, whitespace-insensitive syntax optimized for expressing token derivations. This chapter outlines the lexical rules enforced by the lexer (`src/interpreter/lexer.ts`) and the structural expectations enforced by the parser (`src/interpreter/parser.ts`).

## Character Set & Identifiers

- Source code is UTF-8. Identifiers may include standard ASCII letters, digits, hyphen (`-`), underscore (`_`), and extended Unicode characters (e.g., emoji).
- Identifiers must begin with an alphabetic or non-ASCII character (numbers are not allowed in the first position).
- Identifiers are case-sensitive (`primaryColor` and `PrimaryColor` are distinct).

## Whitespace & Newlines

- Whitespace is ignored except inside explicit strings. Newlines do not terminate statements automatically; use semicolons or block delimiters to separate statements.
- Multiple statements may appear on one line if separated by semicolons.

## Comments

- Single-line comments start with `//` and run to the end of the line. Block comments are not currently supported.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`// A single-line comment
variable spacing: NumberWithUnit = 4px; // Trailing comments are allowed`}
</TokenScriptCodeBlock>

## Literals

| Literal | Syntax | Notes |
| --- | --- | --- |
| Numbers | `42`, `3.1415`, `.5` | Integers and decimals; leading zero added for `.5` style numbers by the lexer. |
| Hex Colors | `#FFAA00`, `#abc` | Interpreted as `Color.Hex`. |
| Strings | `identifierStyle` | Bare identifiers not bound in scope fall back to string literals. |
| Explicit Strings | `"quoted value"` or `'alternate quotes'` | Preserve whitespace and special characters. |
| Booleans | `true`, `false` | Reserved keywords mapped to `Boolean`. |
| Null | `null` | Reserved keyword mapped to `Null`. |
| Undefined | `undefined` | Reserved keyword; the interpreter currently treats it as a literal string when encountered. |
| Lists | `value1, value2, value3` | Comma-separated sequence; implicit lists use spaces when built by certain operations. |

## Units

Numbers may be suffixed with a unit from `src/types.ts#SupportedFormats`, including `px`, `em`, `rem`, `vw`, `vh`, `pt`, `in`, `cm`, `mm`, `deg`, `%`. The lexer emits a `FORMAT` token, which the parser combines with the preceding numeric literal to produce an `ElementWithUnitNode`. At runtime the interpreter constructs a `NumberWithUnitSymbol`.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable padding: NumberWithUnit = 1.5rem;
variable angle: NumberWithUnit = 45deg;`}
</TokenScriptCodeBlock>

## References

Wrap token names in braces to read values from the reference map provided to the interpreter or resolver:

// TODO: in interpreter mode you can't use dot notation

<TokenScriptCodeBlock mode="script" showResult={false}>
{`// Dot notation works in token resolution
variable primaryColor: Color = {colors.primary};
variable spacingLg: NumberWithUnit = {spacing.base} * 3;`}
</TokenScriptCodeBlock>

Nested references (e.g., `{theme.primary.color}`) are flattened during lexing.

## Reserved Keywords

The following keywords cannot be used as identifiers:

| Keyword | Purpose |
| --- | --- |
| `variable` | Starts a variable declaration. |
| `if`, `elif`, `else` | Control flow branches. |
| `while` | Loop construct. |
| `return` | Exits the current block/expression. |
| `true`, `false`, `null`, `undefined` | Literal values. |

## Statement Forms

### Variable Declarations

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable name: String = "example";
variable accent: Color.Hex = #FF9900;
variable ramp: List = accent, accent.to.oklch();`}
</TokenScriptCodeBlock>

- Type annotations are required (`Type` or `Type.SubType`).
- Initializers are optional; without an initializer, variables start with the type’s `empty()` value.

### Assignments & Reassignments

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable scale: Number = 1.5;
scale = scale + 0.5;

variable accent: Color = #FF9900;
variable accentValue: String = "#0066FF";`}
</TokenScriptCodeBlock>

- Reassignments may target variables or attributes (`accent.value`).
- Attribute chains (`foo.bar.baz`) are parsed as a single assignment target.

### Blocks

- Statement blocks are wrapped in square brackets `[...]`. They can contain multiple statements separated by semicolons or newlines.

<TokenScriptCodeBlock
  mode="script"
  lines={{ start: 3, end: 7 }}
>
{`variable condition: Boolean = true;

if (condition) [
   return 1;
] else [
   return 0;
]`}
</TokenScriptCodeBlock>

### Expressions

- Expression grammar supports binary operations (`+`, `-`, `*`, `/`, `^`), comparisons (`==`, `!=`, `>`, `<`, `>=`, `<=`), logical operators (`&&`, `||`, `!`), function calls, method calls, list literals, and attribute access.
- Method chaining uses dots: `color.to.oklch().values()`.

## Operator Precedence (High to Low)

1. Method calls, function calls, attribute access, list indexing
2. Unary `!` and unary `-`
3. Exponentiation `^`
4. Multiplication and division `*`, `/`
5. Addition and subtraction `+`, `-`
6. Comparison operators (`==`, `!=`, `>`, `>=`, `<`, `<=`)
7. Logical AND `&&`
8. Logical OR `||`

Parentheses `()` override precedence as expected.

## Error Reporting

The parser provides context-aware errors with line/column highlighting when encountering unexpected tokens, missing delimiters, or malformed type declarations. Runtime type mismatches and method resolution errors raise `InterpreterError` instances, reported with the source token metadata.

Proceed to [Types and Symbols](types.md) for a complete catalog of runtime types and their methods.
