---
title: Language Overview
description: High-level introduction to the TokenScript language and its design goals.
sidebar_label: Overview
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Language Overview

TokenScript is a statically typed domain-specific language (DSL) for manipulating design tokens. It brings rich color management, unit-aware math, and reference resolution directly into the language so that token operations remain deterministic and reproducible across platforms.

## Design Goals

- **Design-native types:** Colors, numbers with units, lists, dictionaries, and token references are first-class citizens.
- **Static safety:** Variable declarations capture explicit types, catching type mismatches at parse/interpret time.
- **Composable transformations:** Control flow, functions, and methods allow designers and engineers to derive new tokens procedurally.
- **Interop-first:** The interpreter consumes Design Token Community Group (DTCG) JSON and exposes hooks for custom schemas and conversions.
- **Extensible runtime:** Color, unit, and function catalogs are data-driven, enabling organizations to ship bespoke conversions without forking the runtime.

## Core Workflow

1. Parse TokenScript source with the lexer and parser to build an abstract syntax tree (AST).
2. Evaluate the AST with the interpreter, backed by configurable color/unit/function managers.
3. (Optional) Resolve token aliases across token sets using `TokenSetResolver`, reusing the interpreter for expression evaluation.

## Hello TokenScript

<TokenScriptCodeBlock mode="script">
{`variable baseSpacing: NumberWithUnit = 4px;
variable scale: Number = 1.5;

variable spacingRamp: List = baseSpacing, baseSpacing * scale, baseSpacing * scale * scale;

variable accent: Color = #44AAFF;
variable accentOklch: Color.Oklch = accent.to.oklch();

return spacingRamp.join(", ").concat(" / ").concat(accentOklch.to.hex());`}
</TokenScriptCodeBlock>

The interpreter enforces type compatibility (e.g., preventing unit mismatches) and offers methods on each symbol type (`join`, `to.hex`, etc.), making token derivations concise.

## Language Architecture

- **Lexer (`src/interpreter/lexer.ts`):** Tokenizes identifiers, literals, references (`{token_name}`), reserved keywords, control structures, and units.
- **Parser (`src/interpreter/parser.ts`):** Builds typed AST nodes for statements (variable declarations, reassignments, control flow) and expressions (binary operations, function calls, method chains).
- **Interpreter (`src/interpreter/interpreter.ts`):** Walks the AST, manages symbol tables, and invokes operations/methods as defined by the runtime.
- **Operations (`src/interpreter/operations.ts`):** Implements arithmetic, comparison, and logical operators with unit-aware math.
- **Symbols (`src/interpreter/symbols.ts`):** Defines runtime representations for each type, including supported methods and attribute access semantics.
- **Config Managers (`src/interpreter/config/managers/*`):** Load and execute color/unit/function specifications supplied as JSON schemas or TokenScript snippets.

Continue to the [Lexical Syntax](syntax.md) chapter for token-level rules and reserved words.
