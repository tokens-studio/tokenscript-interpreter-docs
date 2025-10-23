---
title: Automation Strategies
description: Integrate TokenScript CLI commands into build systems and CI pipelines.
sidebar_label: Automation
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Automation Strategies

TokenScript’s CLI commands are composable and script-friendly. This chapter outlines patterns for integrating them into continuous integration (CI) pipelines, build systems, and local developer tooling.

## npm Scripts

Define reusable tasks in `package.json`:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
  "scripts": {
    "tokens:resolve": "tokenscript parse_json --json ./tokens/index.json --output ./dist/tokens.json",
    "tokens:permutate": "tokenscript permutate_tokenset --tokenset ./exports/tokens.zip --permutate-on Mode --permutate-to Mode --output ./dist/permutations.json",
    "tokens:compliance": "tokenscript evaluate_standard_compliance --test-dir ./data/compliance-suite/tests"
  }
}`}
</TokenScriptCodeBlock>

- Developers can run `npm run tokens:resolve` before committing token changes.
- Pair with tools like `npm-run-all` or `turbo` to orchestrate multiple tasks.

## CI Pipelines

Example GitHub Actions step:

```yaml
- name: Install TokenScript CLI
  run: npm install --no-save @tokens-studio/tokenscript-interpreter

- name: Resolve tokens
  run: npx tokenscript parse_json --json ./tokens/index.json --output ./dist/tokens.json

- name: Upload artifacts
  uses: actions/upload-artifact@v4
  with:
    name: tokens-artifacts
    path: |
      dist/tokens.json
      reports/compliance.json
```

- Archive outputs for downstream inspection.
- Fail builds if compliance reports contain failures (parse JSON to enforce thresholds).

## Watch Mode

Combine the CLI with file watchers (e.g., `chokidar-cli`) to rebuild tokens on change:

```bash
npx chokidar "tokens/**/*.json" -c "tokenscript parse_json --json ./tokens/index.json --output ./dist/tokens.json"
```

## Custom Node Scripts

When complex orchestration is required, import helper functions directly:

```ts
import { interpretTokens, processThemes } from "@tokens-studio/tokenscript-interpreter";

async function buildTokens() {
  const designtokens = await loadJson("./tokens/index.json");
  const resolved = interpretTokens(designtokens);
  await fs.promises.writeFile("./dist/tokens.json", JSON.stringify(resolved, null, 2));
}
```

- Combine CLI and programmatic APIs for maximum flexibility.
- Share `Config` instances across CLI-derived workflows by exporting configs from a common module.

## Error Handling

- Non-zero exit codes indicate failures (e.g., invalid ZIP, malformed JSON, compliance failures).
- Capture stderr in CI to provide actionable diagnostics.

## Performance Audit

- Use `tokenscript parse_tokenset` with performance tracking enabled to gather throughput stats; include these in nightly jobs to detect regressions.
- Save reports via `PerformanceTracker.saveToFile` and upload them as artifacts.

## Security Considerations

- Treat input token files as untrusted; run CLI commands in sandboxed environments when processing third-party data.
- Avoid checking in generated outputs unless required for downstream tooling.
