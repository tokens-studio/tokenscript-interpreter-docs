---
title: Example & Test Inventory
description: Reference map of repository examples and tests to support documentation and onboarding.
sidebar_label: Example Inventory
---

# Example & Test Inventory

Use this index to find canonical examples and tests when curating documentation, workshops, or demos.

## Interpreter Unit Tests (`tests/interpreter/`)

| File | Focus | Notes |
| --- | --- | --- |
| `lexer.test.ts` | Lexical tokens & error cases | Handy for showcasing identifier, unit, and reference parsing. |
| `parser.test.ts` | AST construction | Demonstrates grammar edge cases (comments, nested blocks). |
| `variables.test.ts` | Variable declarations & scope | Reinforces `variable` semantics and reassignments. |
| `control-structures.test.ts` | `if`/`while` behavior | Contains loop guard scenarios tied to `MAX_ITERATIONS`. |
| `lists.test.ts` | List methods | Supports docs on `append`, `join`, etc. |
| `string-methods.test.ts` | String API | Examples for `upper`, `split`, and concatenation. |
| `math-functions.test.ts` | Numeric helpers | Validates built-in functions (min, max, round). |
| `color-manager.test.ts` | Color schemas & conversions | Great for illustrating schema registration outcomes. |
| `color-converter.test.ts` | Complex color conversions | Covers multi-step conversion paths. |
| `color-attributes.test.ts` | Attribute validation | Shows error messaging for invalid color property assignments. |
| `unit-manager.test.ts` | Unit conversions | Provides assertions for px/rem/% interplay. |
| `dictionary.test.ts` | Dictionaries | Examples of `set`, `get`, `keys`, and attribute access. |
| `inline-method-calls.test.ts` | Chained methods | Useful when explaining method resolution. |
| `errors.test.ts` | Interpreter error messaging | Source of real error strings for troubleshooting sections. |
| `null-symbol.test.ts` | Null handling | Clarifies equality semantics and safeguards. |
| `complex-expressions.test.ts` | End-to-end expressions | Combine math, lists, methods—ideal for advanced examples. |
| `dtcg-format-compatibility.test.ts` | DTCG integration | Validates JSON parsing across edge cases. |
| `color-conversion-graph.test.ts` | Conversion paths | Highlights BFS resolution and fallbacks. |

## CLI & Utility Tests

| File | Focus |
| --- | --- |
| `tests/cli.test.ts` | CLI command coverage (`interactive`, `parse_json`, resolver flows). |
| `tests/performance/benchmark.test.ts` | Benchmark scenarios for resolver throughput. |
| `tests/utils/schema-fetcher.test.ts` | Schema fetching and validation. |

## Examples & Blog Drafts (`examples/`)

| Path | Highlights |
| --- | --- |
| `examples/blog-articles/transform-pipeline.mdx` | Narrative on transforming parsed symbols (e.g., CSS border). |
| `examples/blog-articles/using-tokenscript-with-styledictionary.mdx` | Style Dictionary integration outline. |
| `examples/web-repl/` | React playground showcasing real-time interpreter usage. |

## Data Assets (`data/`)

| Path | Purpose |
| --- | --- |
| `data/specifications/colors/*.json` | Source of schema examples for docs and tutorials. |
| `data/compliance-suite/tests/` | Official compliance cases—mirror structure for custom suites. |
| `data/examples/` | Sample token sets referenced by tests and CLI demos. |

## How to Use This Inventory

1. **Documentation Examples:** Pull code snippets directly from unit tests to guarantee alignment with runtime behavior.
2. **Workshops & Talks:** Use blog drafts and REPL presets as starting points for slides or live coding.
3. **Regression Suites:** Mirror compliance tests when adding custom specs or functions to maintain coverage parity.
4. **Support & Diagnostics:** Reference `errors.test.ts` and compliance reports when triaging user issues.
