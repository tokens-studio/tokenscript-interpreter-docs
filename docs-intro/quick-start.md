---
title: 5-Minute Quick Start
description: Get TokenScript running and resolve your first design tokens in 5 minutes.
sidebar_label: Quick Start
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# 5-Minute Quick Start

Get TokenScript up and running in 5 minutes. You'll install the CLI, resolve your first tokens, and understand the basics.

## What You'll Do

1. Install TokenScript
2. Resolve tokens with one command 
3. Try the interactive REPL
4. Write your first script

## Step 1: Install TokenScript

Install the CLI globally with npm:

```bash
npm install -g @tokens-studio/tokenscript-interpreter
```

Verify installation:

```bash
tokenscript --version
```

Or via `npx`

```bash
npx @tokens-studio/tokenscript-interpreter
```

## Step 2: Resolve Your First Tokens

Create a simple token file called `tokens.json`:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
  "spacing": {
    "base": {
      "$type": "dimension",
      "$value": "8px"
    },
    "large": {
      "$type": "dimension",
      "$value": "{spacing.base} * 2"
    },
    "xlarge": {
      "$type": "dimension",
      "$value": "{spacing.large} * 1.5"
    }
  },
  "colors": {
    "primary": {
      "$type": "color",
      "$value": "#0066FF"
    },
    "darkPrimary": {
      "$type": "color",
      "$value": "invert({colors.primary}).to.hex()"
    }
  }
}
`}
</TokenScriptCodeBlock>

Now resolve all the references and expressions:

```bash
tokenscript parse_json -- --json tokens.json \
  --schema "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0.1.0/" \
  --schema "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/invert/0/"
```

**That's it!** Check `tokens-resolved.json`:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "spacing.base": "8px",
    "spacing.large": "16px",
    "spacing.xlarge": "24px",
    "colors.primary": "#0066FF",
    "colors.darkPrimary": "#ff9900"
}`}
</TokenScriptCodeBlock>

:::info What Just Happened?

1. Resolved all `{references}`
2. Evaluated all expressions `* 2`, `* 1.5`
3. Executed functions `invert` and color conversions `to.hex` fetched from the schemas
4. Printed output tokens
:::


## Step 3: Try the Interactive REPL

Want to experiment? Launch the interactive mode:

```bash
tokenscript interactive
```

Now try some expressions:

<TokenScriptCodeBlock mode="script">
{`16px * 2`}
</TokenScriptCodeBlock>

For a more advanced repl visit the [web version of the repl](https://repl.tokenscript.dev.gcp.tokens.studio/).

## Step 4: Write Your First Script

Create a file `generate-spacing.ts`:

```typescript
import { Interpreter, Lexer, Parser } from '@tokens-studio/tokenscript-interpreter';

const script = `
  variable base: NumberWithUnit = 8px;
  variable scale: Number = 1.5;
  
  variable xs: NumberWithUnit = base;
  variable sm: NumberWithUnit = base * scale;
  variable md: NumberWithUnit = sm * scale;
  variable lg: NumberWithUnit = md * scale;
  variable xl: NumberWithUnit = lg * scale;
  
  return xs, sm, md, lg, xl;
`;

const lexer = new Lexer(script);
const parser = new Parser(lexer);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
const result = interpreter.interpret();

console.log(result?.toString());
// Output: "8px, 12px, 18px, 27px, 40.5px"
```

Or try it directly:

<TokenScriptCodeBlock mode="script">
{`variable base: NumberWithUnit = 8px;
variable scale: Number = 1.5;

variable xs: NumberWithUnit = base;
variable sm: NumberWithUnit = base * scale;
variable md: NumberWithUnit = sm * scale;
variable lg: NumberWithUnit = md * scale;
variable xl: NumberWithUnit = lg * scale;

return xs, sm, md, lg, xl;`}
</TokenScriptCodeBlock>

Run it:

```bash
npx tsx generate-spacing.ts
```
