---
title: Core Concepts
description: Understand the fundamental concepts and terminology of TokenScript.
sidebar_label: Core Concepts
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Core Concepts

Before diving into TokenScript, let's establish the core concepts and terminology. Understanding these fundamentals will make everything else click into place.

## What Are Design Tokens?

**Design tokens** are the atomic values that define a design system:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "color.primary": "#0066FF",
    "spacing.base": "8px",
    "font.size.body": "16px",
    "border.radius.small": "4px"
}`}
</TokenScriptCodeBlock>

Think of them as the **design DNA** of your product - the single source of truth for colors, spacing, typography, and more.

### Why Design Tokens Matter

- **Consistency**: Same values everywhere (web, iOS, Android, etc.)
- **Maintainability**: Change once, update everywhere
- **Scalability**: Add new tokens without breaking existing ones
- **Collaboration**: Designers and developers speak the same language

---

## What Is TokenScript?

**TokenScript** is a programming language specifically designed for **logic and transformations on design tokens**.

### TokenScript is NOT...

- ❌ A replacement for JSON/CSS
- ❌ A design tool
- ❌ A token storage format
- ❌ A styling framework

### TokenScript IS...

- ✅ A language for **computing** token values
- ✅ A way to express **relationships** between tokens
- ✅ A tool for **transforming** tokens (colors, units, etc.)
- ✅ An **interpreter** that evaluates expressions

### Example: Static vs. Dynamic Tokens

**Static (plain JSON):**

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "spacing.small": "8px",
    "spacing.medium": "16px",  // must maintain manually
    "spacing.large": "24px"    // must maintain manually
}`}
</TokenScriptCodeBlock>

**Dynamic (with TokenScript):**

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "spacing.small": "8px",
    "spacing.medium": "{spacing.small} * 2",    // computed!
    "spacing.large": "{spacing.medium} * 1.5"   // computed!
}`}
</TokenScriptCodeBlock>

Change `spacing.small` → entire scale updates automatically.

---

## Key Terminology

### 1. **Interpreter**

The **interpreter** is the engine that executes TokenScript code. It:
- Reads TokenScript source code
- Parses it into an abstract syntax tree (AST)
- Evaluates expressions
- Returns computed values

Think of it like a calculator for design tokens.

**Example:**

<TokenScriptCodeBlock mode="script">
{`variable base: NumberWithUnit = 8px;
variable large: NumberWithUnit = base * 2;
return large;`}
</TokenScriptCodeBlock>

### 2. **Token Resolution**

**Token resolution** is the process of turning token definitions with references into concrete values.

<TokenScriptCodeBlock mode="json">
{`{
    "spacing.base": "8px",
    "spacing.large": "{spacing.base} * 2"
}`}
</TokenScriptCodeBlock>

The TokenScript interpreter resolves `{spacing.base}` and evaluates `* 2`.

### 3. **References**

**References** are placeholders that point to other values using curly brace syntax: `{name}`.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable primary: Color = {colors.brand};
variable light: Color = lighten(primary, 20);`}
</TokenScriptCodeBlock>

References let you:
- Reuse values
- Create dependencies between tokens
- Build dynamic systems

:::warning Interpreter Mode vs. Token Resolution Mode
References work differently depending on the mode:
- **Interpreter mode**: References are pre-resolved variables (simple names only)
- **Token resolution mode**: References can use dot notation (`{colors.primary}`)

[Learn more in Syntax Reference](/language/syntax#references)
:::

### 4. **Types**

TokenScript is **statically typed** - every variable has a declared type.

**Core types:**
- `Number` - Numeric values: `42`, `3.14`
- `NumberWithUnit` - Numbers with units: `8px`, `1.5rem`, `45deg`
- `Color` - Colors in any space: `#FF0000`, `rgb(255, 0, 0)`, `hsl(0, 100, 50)`
- `String` - Text: `"hello"`, `'world'`
- `Boolean` - True/false: `true`, `false`
- `List` - Collections: `[1, 2, 3]`, `["red", "blue"]`
- `Dictionary` - Key-value pairs: `{name: "value"}`
- `Null` - No value: `null`

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable count: Number = 42;
variable spacing: NumberWithUnit = 16px;
variable brand: Color = #0066FF;
variable items: List = 1, 2, 3, 4, 5;`}
</TokenScriptCodeBlock>

### 5. **Expressions vs. Statements**

**Expressions** produce values:

<TokenScriptCodeBlock mode="script" showResult={false}>
{`8 * 2           // Expression: produces 16
variable base: NumberWithUnit = 8px;
variable offset: NumberWithUnit = 2px;
base + offset   // Expression: produces sum
variable color: Color = #0066FF;
lighten(color, 20)  // Expression: produces color`}
</TokenScriptCodeBlock>

**Statements** perform actions:

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable x: Number = 10;    // Statement: declares variable
if (x > 5) [
  return "greater";
]          // Statement: conditional
return x * 2;               // Statement: returns value`}
</TokenScriptCodeBlock>

### 6. **JSON**

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "spacing-base": {
      "$type": "dimension",
      "$value": "8px",
      "$description": "Base spacing unit"
    }
}`}
</TokenScriptCodeBlock>

TokenScript can:
- Read JSON
- Evaluate expressions in `$value` fields
- Preserve `$type`, `$description`, and other metadata

---

## Two Modes of Operation

TokenScript operates in two distinct modes:

### Mode 1: Interpreter Mode (Standalone)

**Use case:** Isolated functions, custom computations

In this mode, you write TokenScript to compute specific values:

<TokenScriptCodeBlock mode="script">
{`variable base: NumberWithUnit = 8px;
variable scale: Number = 1.5;
variable result: NumberWithUnit = base * scale;
return result;`}
</TokenScriptCodeBlock>

**Characteristics:**
- ✅ Full language features (variables, control flow, functions)
- ✅ Complete isolation (no access to external tokens)
- ✅ References are pre-resolved variables passed in
- ❌ No dot notation in references (they're already resolved)

**When to use:**
- Writing reusable functions
- Complex computations
- Custom transformations

### Mode 2: Token Resolution Mode

**Use case:** Resolving design token files

In this mode, TokenScript resolves expressions embedded in token definitions:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "spacing.base": "8px",
    "spacing.large": "{spacing.base} * 2"
}`}
</TokenScriptCodeBlock>

**Characteristics:**
- ✅ Resolves references with dot notation: `{spacing.base}`
- ✅ Evaluates expressions in `$value` fields
- ✅ Handles dependency graphs automatically
- ✅ Detects circular references
- 🟡 Limited to expressions (no multi-line scripts)

**When to use:**
- Processing JSON files
- Resolving token sets
- Build-time token generation

:::tip Which Mode Should I Use?
- **Need to process tokens.json?** → Token Resolution Mode (use `TokenSetResolver` or CLI)
- **Writing custom logic?** → Interpreter Mode (use `Interpreter` directly)
:::

---

## The TokenScript Workflow

### Typical Flow

```
1. Write token definitions (JSON or TokenScript)
   ↓
2. TokenScript resolves references and evaluates expressions
   ↓
3. Output platform-specific formats (CSS, iOS, Android, etc.)
   ↓
4. Use tokens in your app
```

### Example: End-to-End

**1. Define tokens** (`tokens.json`):

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "color.brand": "#0066FF",
    "color.brandLight": "lighten({color.brand}, 20)",
    "spacing.base": "8px",
    "spacing.large": "{spacing.base} * 2"
}`}
</TokenScriptCodeBlock>

**2. Resolve with TokenScript:**
```bash
tokenscript parse_json --json tokens.json --output tokens-resolved.json
```

**3. Output:**

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "color.brand": "#0066FF",
    "color.brandLight": "#4D94FF",    // Computed!
    "spacing.base": "8px",
    "spacing.large": "16px"            // Computed!
}`}
</TokenScriptCodeBlock>

**4. Use in CSS:**
```css
:root {
  --color-brand: #0066FF;
  --color-brand-light: #4D94FF;
  --spacing-base: 8px;
  --spacing-large: 16px;
}
```

---

## Mental Model: Tokens as Variables

Think of design tokens as **variables in a design system program**:

<TokenScriptCodeBlock mode="script" showResult={false}>
{`// Variables (tokens)
variable baseColor: Color = #0066FF;
variable scale: Number = 1.5;

// Computed variables (derived tokens)
variable lightColor: Color = lighten(baseColor, 20);
variable largeSpacing: NumberWithUnit = 8px * scale;

// Functions (token transformations)
variable isDarkMode: Boolean = false;
if (isDarkMode) [
    return invert(baseColor);
] else [
    return baseColor;
]`}
</TokenScriptCodeBlock>

This is exactly what TokenScript does - it treats tokens as a **living system** with logic and relationships.

---

## Key Principles

### 1. **Single Source of Truth**
Define base values once, compute everything else.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable base: NumberWithUnit = 8px;  // Source of truth
variable sm: NumberWithUnit = base * 1.5;    // Derived
variable md: NumberWithUnit = base * 2;      // Derived
variable lg: NumberWithUnit = base * 3;      // Derived`}
</TokenScriptCodeBlock>

### 2. **Type Safety**
Catch errors before they break your design.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable spacing: NumberWithUnit = 8px;
variable scale: String = "large";
variable result: NumberWithUnit = spacing * scale;  // ❌ Error! Can't multiply by string`}
</TokenScriptCodeBlock>

### 3. **Explicitness Over Magic**
TokenScript is explicit - you declare types and write clear expressions.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`// ✅ Clear and explicit
variable base: NumberWithUnit = 8px;
variable large: NumberWithUnit = base * 2;

// ❌ Magic would be: large = base.double() (what does double mean?)`}
</TokenScriptCodeBlock>

### 4. **Composability**
Build complex systems from simple pieces.

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable base: Color = #0066FF;
variable light: Color = lighten(base, 20);
variable lighter: Color = lighten(light, 20);
variable lightest: Color = lighten(lighter, 20);`}
</TokenScriptCodeBlock>

---

## Common Misconceptions

### ❌ "TokenScript replaces JSON"
**Reality:** TokenScript **evaluates expressions in JSON**. You still use JSON for storage.

### ❌ "I need to learn a complex language"
**Reality:** TokenScript is simple. If you know basic math and variables, you're 80% there.

### ❌ "It's only for huge design systems"
**Reality:** Even small projects benefit from computed tokens and type safety.

### ❌ "I can't use my existing tokens"
**Reality:** TokenScript reads standard JSON. Your existing tokens work as-is.

---

## Next Steps

Now that you understand the core concepts, you're ready to:

### 1. **Try the Quick Start**
Get hands-on experience in 5 minutes.

[→ 5-Minute Quick Start](/intro/quick-start)

### 2. **Learn the Language**
Understand the syntax and write your first script.

[→ Language Tutorial](/language/tutorial)

### 3. **Explore Use Cases**
See how TokenScript solves real problems.

[→ Why TokenScript?](/intro/why-tokenscript)

---

## Quick Reference

### Core Concepts Summary

| Concept | What It Is | Example |
|---------|-----------|---------|
| **Token** | Atomic design value | `"#0066FF"`, `"8px"` |
| **Interpreter** | Engine that executes TokenScript | Runs your code |
| **Resolution** | Convert references to values | `{base}` → `"8px"` |
| **Reference** | Placeholder for another value | `{spacing.base}` |
| **Type** | Data category | `Number`, `Color`, `String` |
| **Expression** | Code that produces a value | `base * 2` |

### Two Modes

| Mode | Use Case | Example |
|------|----------|---------|
| **Interpreter** | Custom scripts | `variable x = 8px * 2;` |
| **Resolution** | Process token files | `tokens.json` → `resolved.json` |

---

**Ready to dig deeper?** Choose your path:

<div class="button-group">
  <a href="/intro/quick-start" class="button button--primary">Quick Start →</a>
  <a href="/language/tutorial" class="button button--secondary">Language Tutorial →</a>
  <a href="/cli/overview" class="button button--secondary">CLI Reference →</a>
</div>

