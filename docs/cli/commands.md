---
title: CLI Command Reference
description: Overview of the TokenScript CLI commands and options.
sidebar_label: Commands
---

# CLI Command Reference

Install the CLI globally or via `npx`:

```bash
npm install -g @tokens-studio/tokenscript-interpreter
# or
npx tokenscript --help
```

The CLI is built with Commander (`src/cli.ts`) and ships the following commands:

## `tokenscript interactive`

| Option | Description |
| --- | --- |
| *(none)* | Starts an interactive REPL session. |

- Use `set_variables` to inject references.
- Exit with `exit` or `quit`.
- Ideal for quick experimentation or debugging expressions.

## `tokenscript parse_tokenset`

| Option | Description |
| --- | --- |
| `--tokenset <path>` | Path to a ZIP archive containing DTCG token sets. |
| `--output <path>` | Output file for resolved tokens (`output.json` default). |

Unzips the token set, resolves tokens using `TokenSetResolver`, and writes the result.

## `tokenscript permutate_tokenset`

| Option | Description |
| --- | --- |
| `--tokenset <path>` | Path to the token set ZIP. |
| `--permutate-on <themes...>` | Theme groups to permute (space separated). |
| `--permutate-to <theme>` | Target theme group. |
| `--output <path>` | Output file for generated permutations (`permutations.json` default). |

Generates permutations across theme dimensions and resolves each variation.

## `tokenscript parse_json`

| Option | Description |
| --- | --- |
| `--json <path>` | Path to a DTCG JSON file. |
| `--output <path>` | Output file (`output.json` default). |

Resolves tokens directly from a JSON file without packaging into a ZIP.

## `tokenscript evaluate_standard_compliance`

| Option | Description |
| --- | --- |
| `--test-dir <path>` | Directory containing compliance JSON tests. |
| `--test-file <path>` | Single test file to run. |
| `--output <path>` | Output file for report (prints to console if omitted). |

Runs the TokenScript compliance suite and reports pass/fail counts.

## General Tips

- Combine commands with Node scripts or npm tasks (`package.json` exposes ready-made scripts: `compliance_test`, `cli:parse`, etc.).
- Use `--help` on any command to see real-time usage descriptions.
- For ESM environments, `node --loader ts-node/esm` can run `src/cli.ts` directly during development (`npm run cli`).
