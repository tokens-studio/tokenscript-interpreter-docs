---
title: TokenScript Quickstart
description: Follow an end-to-end path from installation to resolved design tokens.
sidebar_label: Quickstart
---

# TokenScript Quickstart

This quickstart walks you through installing the interpreter, writing your first TokenScript snippet, and resolving a simple token set.

## Prerequisites

- Node.js ≥ 16
- npm or yarn

## 1. Install Dependencies

```bash
npm install @tokens-studio/tokenscript-interpreter
```

Optionally install the CLI globally:

```bash
npm install -g @tokens-studio/tokenscript-interpreter
```

## 2. Evaluate an Expression

Create `scripts/evaluate.ts`:

```ts
import { Interpreter, Lexer, Parser } from "@tokens-studio/tokenscript-interpreter";

const source = `
  variable base: NumberWithUnit = 8px;
  variable scale: Number = 1.5;
  return base * scale;
`;

const lexer = new Lexer(source);
const parser = new Parser(lexer);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
const result = interpreter.interpret();

console.log(result?.toString()); // => "12px"
```

Run with `node scripts/evaluate.ts` (ESM) or `tsx scripts/evaluate.ts`.

## 3. Resolve Tokens with References

```ts
import { TokenSetResolver } from "@tokens-studio/tokenscript-interpreter";

const tokens = {
  "spacing.base": "8px",
  "spacing.lg": "{spacing.base} * 1.5",
};

const resolver = new TokenSetResolver(tokens);
const { resolvedTokens } = resolver.resolve();

console.log(resolvedTokens["spacing.lg"]?.toString()); // "12px"
```

## 4. Use the CLI

```bash
tokenscript interactive
```

- Type expressions directly.
- Use `set_variables` to define references.

Resolve a JSON token file:

```bash
tokenscript parse_json --json ./tokens/light.json --output ./dist/light-resolved.json
```

## 5. Explore the Language

- Read the [Language Specification](/spec/overview) for syntax and type details.
- Try built-in functions: `round(3.1415, 2)`, `rgba(255, 128, 64, 0.5)`.
- Inspect examples under `examples/blog-articles/` for inspiration.

## 6. Next Steps

- Integrate with pipelines using the CLI recipes.
- Register custom schemas or functions for project-specific behavior.
- Run the compliance suite before shipping production builds.
