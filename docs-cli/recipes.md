---
title: CLI Recipes
description: Practical command combinations for common TokenScript workflows.
sidebar_label: Recipes
---

# CLI Recipes

This chapter collects end-to-end examples that combine CLI commands into practical workflows.

## Resolve a Token Set ZIP

```bash
npx tokenscript parse_tokenset \
  --tokenset ./exports/design-tokens.zip \
  --output ./dist/tokens-resolved.json
```

Inspect `dist/tokens-resolved.json` to review tokens per theme.

## Generate Theme Permutations

```bash
npx tokenscript permutate_tokenset \
  --tokenset ./exports/design-tokens.zip \
  --permutate-on Mode Platform \
  --permutate-to Mode \
  --output ./dist/theme-permutations.json
```

- Permutes across the `Mode` and `Platform` groups.
- Produces a nested object describing available permutations and resolved tokens for each combination.
- Useful for previewing platform-specific bundles or testing theme matrices.

## Resolve Tokens from JSON

```bash
npx tokenscript parse_json \
  --json ./tokens/light.json \
  --output ./dist/light-resolved.json
```

- Works with flat or nested Tokenset JSON (without ZIPs).
- Ideal for CI runs where tokens are already available as JSON artifacts.

## Update Tokens and Preview Changes

Combine CLI commands with git hooks or npm scripts:

```json
{
  "scripts": {
    "tokens:build": "tokenscript parse_json --json ./tokens/index.json --output ./dist/tokens.json",
    "tokens:preview": "tokenscript interactive"
  }
}
```

- `npm run tokens:build` refreshes resolved tokens.
- `npm run tokens:preview` launches the REPL for interactive checks.

## Automation Checklist

- Set output directories in `.gitignore` to avoid committing generated files.
- Capture CLI logs in CI to aid debugging (`--output` plus artifact upload).
- Validate ZIP structure before running commands to avoid `Failed to open ZIP file` errors.
