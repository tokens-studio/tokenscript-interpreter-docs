---
title: Lexical Syntax
description: Tokenization rules, keywords, literals, and statement structure for TokenScript.
sidebar_label: Syntax
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Lexical Syntax

## Character Set & Identifiers

- Identifiers may include standard ASCII letters, digits, hyphens (`-`), underscores (`_`), and extended Unicode characters (e.g., emoji).
- Identifiers must begin with an alphabetic or non-ASCII character (numbers are not allowed in the first position).
- Identifiers are case-insensitive (`primaryColor` and `PrimaryColor` are treated equally).

## Whitespace & Newlines

- Whitespace is ignored except inside explicit strings. Newlines do not terminate statements automatically; use semicolons or block delimiters to separate statements.
- Multiple statements may appear on one line if separated by semicolons.

## Comments

- Single-line comments start with `//` and run to the end of the line. 

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
| Explicit Strings | `"quoted value"` or `'alternate quotes'` | Preserves whitespace and special characters. |
| Booleans | `true`, `false` | Reserved keywords mapped to `Boolean`. |
| Null | `null` | Reserved keyword mapped to `Null`. |
| Lists | `value1, value2, value3` | Comma-separated sequence; implicit lists use spaces when built by certain operations. |

## Implicit Strings and Lists

### Overview

TokenScript supports **implicit strings** - strings that don't require quotes. This is a fallback mechanism for when a string is not made explicit with quotes.

:::warning Recommendation: Use Explicit Strings
Implicit strings exist for backward compatibility and convenience, but they have confusing edge cases.

**Prefer to use quotes around strings (`"hello"`) instead of relying on implicit strings (`hello`).**
:::

### Basic Behavior

Implicit strings are recognized when the lexer/parser encounters text that:

1. Starts with a valid identifier character (letters, emoji, etc.)
2. Or starts with a number followed by text that is **not a recognized unit**

<TokenScriptCodeBlock mode="script">
{`Implicit strings supported`}
</TokenScriptCodeBlock>

<TokenScriptCodeBlock mode="script">
{`// Strings starting with numbers (not recognized units)
// ⚠️ GOTCHA: Space is added between number and text!
1unknown       // Output: ["1", "unknown"] (List) - not "1unknown"!
5test          // Output: ["5", "test"] (List) - not "5test"!
3D-Font        // Output: ["3", "D-Font"] (List) - not "3D-Font"!`}
</TokenScriptCodeBlock>

<TokenScriptCodeBlock mode="script">
{`1px
5rem
10%`}
</TokenScriptCodeBlock>

### Implicit Lists

When multiple values are combined without operators, they form **implicit lists**. 
<br />This allows natural composition of values:

<TokenScriptCodeBlock mode="script">
{`1px solid black`}
</TokenScriptCodeBlock>

### Edge Cases and Pitfalls

#### Arithmetic Operations with Implicit Strings

When you mix arithmetic operators with implicit strings, the behavior may surprise you:

<TokenScriptCodeBlock mode="script">
{`// ⚠️ This evaluates to "2 unknown" not an error!
// The arithmetic happens first: (1 + 1) = 2
// Then creates implicit list with result and string: "2 unknown"
1 + 1unknown`}
</TokenScriptCodeBlock>

##### Recommended usage

Use recognized units for arithmetic:

<TokenScriptCodeBlock mode="script">
{`1px + 1px`}
</TokenScriptCodeBlock>

Use explicit strings to avoid the edge cases:

<TokenScriptCodeBlock mode="script">
{`"1unknown"`}
</TokenScriptCodeBlock>

So the aforementioned example will now throw an error:

<TokenScriptCodeBlock mode="script">
{`1 + "1unknown"`}
</TokenScriptCodeBlock>

#### 2. Strings Starting with Numbers

Unlike CSS (which disallows unquoted identifiers starting with numbers), TokenScript allows them as implicit strings:

<TokenScriptCodeBlock mode="script">
{`3D Font`}
</TokenScriptCodeBlock>

<TokenScriptCodeBlock mode="script">
{`"3D Font"`}
</TokenScriptCodeBlock>

### Best Practices

:::warning Always Use Explicit Strings When Possible
While implicit strings are convenient, they can lead to confusion and errors.<br />**We recommend using explicit strings in most cases.**
:::

<TokenScriptCodeBlock mode="script">
{`// Use explicit strings (clear intent)
"3D Font", "some other font", "Font with emoji 😼";`}
</TokenScriptCodeBlock>

#### When Implicit Strings Are Acceptable

Implicit strings are mainly useful for:

1. **Simple identifiers without spaces or special characters**

<TokenScriptCodeBlock mode="script">
{`primary`}
</TokenScriptCodeBlock>

2. **CSS-like shorthand values**

<TokenScriptCodeBlock mode="script">
{`1px solid black`}
</TokenScriptCodeBlock>

3. **Backward compatibility** - Existing TokenScript code may rely on implicit strings

## Units

Numbers may be suffixed with units like `px`, `em`, `rem`, `vw`, `vh`, `pt`, `in`, `cm`, `mm`, `deg`, `%`.
<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable padding: NumberWithUnit = 1.5rem;
variable angle: NumberWithUnit = 45deg;`}
</TokenScriptCodeBlock>

## References

Wrap token paths in braces to read values from the references.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable primaryColor: Color = {colors.primary};
variable spacingLg: NumberWithUnit = {spacing.base} * 3;`}
</TokenScriptCodeBlock>

## Reserved Keywords

The following keywords cannot be used as identifiers:

| Keyword                 | Purpose                             |
|-------------------------|-------------------------------------|
| `variable`              | Starts a variable declaration.      |
| `if`, `elif`, `else`    | Control flow branches.              |
| `while`                 | Loop construct.                     |
| `return`                | Exits the current block/expression. |
| `true`, `false`, `null` | Literal values.                     |

## Statement Forms

### Variable Declarations

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable name: String = "example";
variable accent: Color.Hex = #FF9900;
variable ramp: List = accent, accent.to.oklch();`}
</TokenScriptCodeBlock>

- Type annotations are required (`Type` or `Type.SubType`).
- Initializers are optional; without an initializer, variables start with the type’s `empty()` value, which in most symbols is `null`
  - For [Dictionary](/language/types#dictionary), it's an empty dictionary.
  - For [List](/language/types#list), it's an empty list.

### Assignments & Reassignments

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable scale: Number = 1.5;
scale = scale + 0.5;

variable accent: Color = #FF9900;
variable accentValue: String = "#0066FF";`}
</TokenScriptCodeBlock>

### Blocks

- Statement blocks are wrapped in square brackets `[...]`. They can contain multiple statements separated by semicolons or newlines.
- Variable declaration in blocks are not allowed.

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
- Method chaining uses dots: `color.to.oklch().to_string()`.

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
