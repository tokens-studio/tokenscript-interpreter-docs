---
title: Performance & Debugging
description: Instrument interpreters, capture throughput metrics, and troubleshoot runtime issues.
sidebar_label: Performance & Debugging
---

# Performance & Debugging

Large token sets and complex conversions benefit from instrumentation. TokenScript includes helpers for timing runs and diagnosing common pitfalls.

## PerformanceTracker

`PerformanceTracker` (`src/utils/performance-tracker.ts`) aggregates throughput metrics when resolving themes or token sets.

```ts
import { PerformanceTracker } from "@tokens-studio/tokenscript-interpreter";

const tracker = new PerformanceTracker();
tracker.startTracking();

for (const [themeName, tokens] of Object.entries(themes)) {
  const start = Date.now();
  const result = interpretTokens(tokens, config);
  const end = Date.now();

  tracker.addEntry(themeName, Object.keys(tokens).length, Object.keys(result).length, start, end);
}

tracker.displaySummary();
tracker.saveToFile("reports/performance.json");
```

- `displaySummary()` prints a formatted table highlighting fastest/slowest themes.
- `saveToFile()` persists JSON summaries for regression tracking.

`processThemes` in `src/tokenset-processor.ts` accepts `{ enablePerformanceTracking: true }` to enable the tracker automatically.

## Lightweight Timers

Use `trackPerformance` for one-off profiling:

```ts
import { trackPerformance } from "@tokens-studio/tokenscript-interpreter";

const { result, performanceData } = trackPerformance(
  () => interpretTokens(tokenSet, config),
  "resolve-theme",
  Object.keys(tokenSet).length,
);

console.log(performanceData.tokensPerSecond);
```

## Debugging Tips

1. **Enable verbose logging:** wrap interpreters with try/catch and log `error.originalMessage` (if available) for interpreter-specific context.
2. **Inspect ASTs:** the `Parser` retains `requiredReferences`; log them to understand dependency chains.
3. **Use CLI parsing:** `tokenscript parse_json --json file.json --output output.json` to reproduce issues outside your host application.
4. **Check schema registration:** conversion failures often stem from missing or mismatched URIs. Leverage `ColorManager.getSpecByType` to verify availability.
5. **Guard loops:** adjust `Config.languageOptions.MAX_ITERATIONS` for legitimate long-running loops, but investigate if you routinely hit the default ceiling.

## Common Warnings

- `Token 'foo' has a circular reference to itself.` — break self-referential expressions or provide default guards.
- `Not all tokens could be resolved.` — indicates unresolved dependencies after graph traversal.
- `Cannot mix units: px, %` — convert units explicitly or extend the `UnitManager` with appropriate conversion specs.

## Testing & Regression

- Leverage existing Vitest suites under `tests/interpreter/` as references for expected behavior.
- Add targeted tests when introducing custom specs or functions to catch regressions early.
- Combine `PerformanceTracker` output with tests to assert throughput thresholds in CI if needed.
