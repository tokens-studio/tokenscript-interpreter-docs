---
title: Contributing to TokenScript
description: Guidelines for contributing code, tests, and documentation to the TokenScript project.
sidebar_label: Contributing
---

# Contributor Guide

## Running Compliance Tests

Every language feature must have corresponding compliance tests. Use the following npm scripts to run the full suite in the tokenscript-interpreter repository:

```bash
npm run compliance_test

# Filter failing cases (requires jq)
npm run compliance_test:failed
```

- `compliance_test` executes `tokenscript evaluate_standard_compliance` against the bundled suite.
- `compliance_test:failed` writes a report and extracts failing entries for quick triage.
