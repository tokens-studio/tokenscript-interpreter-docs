---
title: Token Set Resolution
description: Resolve interconnected design tokens using TokenSetResolver.
sidebar_label: Token Set Resolution
---

# Token Set Resolution

TokenScript resolves token aliases by interpreting TokenScript expressions embedded in design token files. The resolver lives in `src/tokenset-processor.ts` and powers both the SDK helpers and CLI commands.

## Flat Token Maps

At its core, the `TokenSetResolver` accepts a flat record of `{ tokenName: script }` pairs and an optional map of pre-resolved globals:

```ts
const resolver = new TokenSetResolver(
  {
    "color.primary": "#FF6600",
    "color.primary.surface": "{color.primary}.to.rgb()",
    "spacing.lg": "{spacing.md} * 1.5",
  },
  { "spacing.md": "8px" },
);

const { resolvedTokens, warnings, errors } = resolver.resolve();
```

- Each token is lexed and parsed exactly once; the resulting AST is cached in `parsers`.
- References are stored in a shared `Map`, so when a token resolves its value becomes available to dependents without re-registration.

## Dependency Graph

`TokenSetResolver` builds a graph to resolve tokens in topological order:

1. Parse each token. If parsing fails, the original value is preserved and a warning is emitted.
2. Track required references per token based on the parser’s `requiredReferences` set.
3. Initialize a queue with tokens that have no dependencies.
4. Iterate through the queue:
   - Interpret the token via the cached interpreter instance (`referenceCache`).
   - Propagate resolved values to dependents, removing edges until they can enter the queue.

If cycles remain (e.g., `a` depends on `b` and `b` depends on `a`), the resolver reports warnings listing unresolved tokens.


## Themes & Permutations

For advanced workflows, the `buildThemeTree` and `permutateTokensets` helpers:

- Assemble a nested tree of themes grouped by permutation dimensions.
- Generate combinations used by `interpretTokensets` to resolve permutations lazily.

These utilities back CLI commands such as `tokenscript permutate_tokenset`.

## Warnings & Errors

- **Warnings** cover parse/interpret failures, circular references, or unresolved dependencies.
- **Errors** array is reserved for future fatal conditions (currently unused).
- Always inspect the warnings list to surface diagnostics in tooling UIs.

## Performance Considerations

- AST caching eliminates redundant parsing.
- Reference sharing prevents cloning large objects; mutating the reference map updates the interpreter view.
- Enable `PerformanceTracker` (see [Performance & Debugging](performance-debugging.md)) when processing large token sets or themes to gather timing metrics.
