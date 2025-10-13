---
title: Playground & REPL
description: Explore TokenScript interactively via the CLI and web playground.
sidebar_label: Playground
---

# Playground & REPL

TokenScript ships tooling for interactive experimentation—perfect for onboarding teammates or validating ideas before codifying them into token sets.

## CLI REPL

Launch the built-in REPL:

```bash
tokenscript interactive
```

- Enter TokenScript expressions and view results instantly.
- Use `set_variables` to add references (e.g., `base=8px`).
- Exit with `exit` or `quit`.

### Tips

- Keep the REPL running while editing TokenScript files to try snippets incrementally.
- Copy/paste expressions from documentation or tests to understand behavior.

## Web Playground

The repository includes a React-based playground under `examples/web-repl`. It features:

- Monaco editor with syntax highlighting.
- TokenScript mode and JSON mode (`interpretTokens`) with auto-run toggle.
- Built-in schema manager for loading additional color/function specs.
- Output panel showing evaluated results and timing.

### Run Locally

```bash
cd examples/web-repl
npm install
npm run dev:watch
```

- `dev:watch` rebuilds the interpreter from the repository root and starts Vite in parallel.
- Alternatively, use `npm run dev` if you only need the frontend (requires prebuilt interpreter in `dist/`).

### Build for Deployment

```bash
cd examples/web-repl
npm run build
npm run preview
```

This bundles the interpreter and playground UI, suitable for hosting on static platforms.

### Custom Schemas & Functions

- Drop schema JSON files into the playground via the Schema Manager panel or modify `DEFAULT_COLOR_SCHEMAS` (`examples/web-repl/src/utils/default-schemas.ts`).
- For advanced scenarios, wire custom endpoints using `fetchTokenScriptSchema`.

## Embedding in Documentation

- Use the playground as a starting point for internal docs or portals where designers can experiment with TokenScript.
- Combine with code snippets from the [Language Recipes](language-recipes.md) guide to accelerate learning.

## Troubleshooting

- If the playground fails to compile, ensure the root interpreter is built (`npm run build` at repo root).
- Clear session storage (`repl:*` keys) to reset editors when switching branches.
- Monitor browser console logs for schema registration errors.
