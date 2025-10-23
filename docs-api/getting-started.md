---
title: Getting Started
description: Install and run the TokenScript interpreter in a Node.js environment.
sidebar_label: Getting Started
---

# Getting Started (Integrator)

This guide walks through installing the TokenScript interpreter, evaluating simple expressions, and wiring references for token resolution.

## 1. Install the Package

```bash
npm install @tokens-studio/tokenscript-interpreter
```

## 2. Evaluate Expressions Programmatically

```ts
import { Interpreter, Lexer, Parser } from "@tokens-studio/tokenscript-interpreter";

const code = `
  variable base: NumberWithUnit = 8px;
  variable scale: Number = 1.5;
  return base * scale;
`;

const lexer = new Lexer(code);
const parser = new Parser(lexer);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
const result = interpreter.interpret();

console.log(result?.toString()); // "12px"
```

- `Interpreter` accepts either a `Parser`, an AST, or `null`.
- Results are TokenScript symbols (e.g., `NumberWithUnitSymbol`); call `toString()` or `value` accessor methods for host-friendly representations.

## 3. Provide References

References connect TokenScript scripts to external token values:

```ts
import type { ReferenceRecord } from "@tokens-studio/tokenscript-interpreter";

const references: ReferenceRecord = {
  spacing_base: "8px",
  colors_primary: "#FF6600",
};

const interpreter = new Interpreter(ast, { references });
```

- References can be plain objects or `Map<string, ISymbolType>`.
- When using `TokenSetResolver`, the resolver and interpreter share the same `Map`, so updates are immediately visible across dependent tokens (see below).

## 4. Use the Token Set Resolver

To resolve a flat map of tokens with references:

```ts
import { TokenSetResolver } from "@tokens-studio/tokenscript-interpreter";

const tokens = {
  "spacing.md": "{spacing.base} * 1.5",
  "spacing.lg": "{spacing.md} * 1.5",
};

const resolver = new TokenSetResolver(tokens, { "spacing.base": "8px" });
const { resolvedTokens, warnings } = resolver.resolve();

console.log(resolvedTokens["spacing.lg"].toString()); // "18px"
console.log(warnings); // [] (unless circular references are detected)
```

`TokenSetResolver` parses each token, builds a dependency graph, and iteratively evaluates expressions while caching ASTs for performance (`src/tokenset-processor.ts`).

## 5. Resolve Design Tokens

Use the high-level helper when working with your design tokens:

```ts
import { interpretTokens } from "@tokens-studio/tokenscript-interpreter";

const designTokens = await fs.readFile("tokens.json", "utf8").then(JSON.parse);
const resolved = interpretTokens(designTokens);
```

- When themes are present (`$themes` array), the helper processes each theme configuration automatically.

## 6. Next Steps

- Configure color/unit/function managers: see [Configuration Deep Dive](configuration.md).
- Run the compliance suite to validate behavior against the official spec: see [Compliance](compliance.md).
