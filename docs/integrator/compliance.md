---
title: Compliance Suite Integration
description: Validate TokenScript behavior against the official compliance tests.
sidebar_label: Compliance
---

# Compliance Suite Integration

The TokenScript interpreter ships with tooling to run the [TokenScript Standard Compliance Test Suite](https://github.com/tokens-studio/tokenscript-compliance-suite). Use it to confirm that runtime changes or custom extensions honor the language specification.

## CLI Usage

Run the compliance suite via the bundled CLI:

```bash
npx tokenscript evaluate_standard_compliance \
  --test-dir ./data/compliance-suite/tests/ \
  --output compliance-report.json
```

- `--test-dir` points to the root of compliance JSON files (default matches the repository layout).
- `--test-file` runs a single test file.
- `--output` writes a JSON summary; omit to print results to stdout.

The command prints a summary with pass/fail counts and details for each test.

## Programmatic API

Use `evaluateStandardCompliance` (`src/compliance-suite.ts`) inside Node scripts or tests:

```ts
import { evaluateStandardCompliance } from "@tokens-studio/tokenscript-interpreter";

const report = await evaluateStandardCompliance({
  dir: "./data/compliance-suite/tests",
});

console.log(report.passed, report.failed);

for (const result of report.results) {
  if (result.status === "failed") {
    console.error(result.name, result.error);
  }
}
```

- Tests define input scripts, expected outputs, optional reference context, and schema URIs.
- When a test specifies `schemas`, the runner loads matching color specs before execution.

## Test Format Overview

Each JSON file contains either a single test object or an array of tests:

```json
{
  "name": "should convert hex to SRGB",
  "input": "return #FF6600.to.srgb().r",
  "expectedOutput": "255",
  "expectedOutputType": "Number",
  "inline": true,
  "schemas": [
    "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0/"
  ]
}
```

- `inline: true` instructs the parser to use inline mode (for single-expression tests).
- `context` injects references.
- Errors are reported with `actualOutputType: "Error"` and the interpreter’s message.

## Extending the Suite

- Store custom tests under a separate directory and pass it to `evaluateStandardCompliance`.
- Add tests when introducing new functions or schemas to guard behavior.
- Mirror examples in `data/compliance-suite/tests` for structure guidance.

## Automation Tips

- Integrate the CLI command into CI (see `package.json` script `compliance_test`).
- Use `compliance_test:failed` to filter failed cases using `jq`.
- Combine with unit tests (`tests/interpreter/*.test.ts`) for comprehensive coverage.
