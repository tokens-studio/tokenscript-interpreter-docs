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

**Total time:** ~5 minutes

---

## Step 1: Install TokenScript

Install the CLI globally with npm:

```bash
npm install -g @tokens-studio/tokenscript-interpreter
```

Verify installation:

```bash
tokenscript --version
```

:::tip Alternative: npx
Don't want to install globally? Use `npx tokenscript` instead of `tokenscript` in all commands.
:::

---

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
      "primaryLight": {
        "$type": "color",
        "$value": "lighten({colors.primary}, 20)"
      }
    }
}`}
</TokenScriptCodeBlock>

Now resolve all the references and expressions:

```bash
tokenscript parse_json --json tokens.json --output tokens-resolved.json
```

**That's it!** Check `tokens-resolved.json`:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "spacing.base": "8px",
    "spacing.large": "16px",          // Computed: 8px * 2
    "spacing.xlarge": "24px",         // Computed: 16px * 1.5
    "colors.primary": "#0066FF",
    "colors.primaryLight": "#4D94FF"  // Computed: lightened version
}`}
</TokenScriptCodeBlock>

:::info What Just Happened?
TokenScript:
1. Resolved all `{references}`
2. Evaluated all expressions (`* 2`, `* 1.5`)
3. Executed functions (`lighten()`)
4. Output ready-to-use values
:::

---

## Step 3: Try the Interactive REPL

Want to experiment? Launch the interactive mode:

```bash
tokenscript interactive
```

Now try some expressions:

<TokenScriptCodeBlock mode="script">
{`variable base: NumberWithUnit = 8px;
base * 2`}
</TokenScriptCodeBlock>

<TokenScriptCodeBlock mode="script">
{`variable color: Color = #0066FF;
lighten(color, 20)`}
</TokenScriptCodeBlock>


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

**Congratulations!** 🎉 You just:
- Installed TokenScript
- Resolved design tokens
- Tried the interactive REPL
- Wrote and executed TokenScript code

---

## What's Next?

### Learn More

**Want to understand the language better?**
→ [Language Tutorial](/language/tutorial) - Step-by-step guide to TokenScript syntax

**Need more CLI commands?**
→ [CLI Reference](/cli/overview) - All commands and workflows

**Ready to integrate in your project?**
→ [API & Integration](/api/getting-started) - Embed the interpreter

**Want to see real examples?**
→ [Language Cookbook](/language/cookbook) - Common patterns and recipes

### Common Next Steps

#### 1. Resolve Your Own Tokens

Replace `tokens.json` with your actual JSON token file:

```bash
tokenscript parse_json --json ./your-tokens.json --output ./dist/resolved.json
```

#### 2. Add to Your Build Pipeline

```json
// package.json
{
  "scripts": {
    "tokens": "tokenscript parse_json --json tokens.json --output dist/tokens.json",
    "build": "npm run tokens && vite build"
  }
}
```

#### 3. Generate Theme Variations

Use permutations for multi-theme support:

```bash
tokenscript permutate_tokenset \
  --tokenset tokens.zip \
  --permutate-on theme \
  --permutate-to colors \
  --output themes.json
```

#### 4. Integrate with Your Tools

- **Webpack/Vite**: Create a plugin to process tokens at build time
- **Figma/Sketch**: Build a plugin to sync tokens
- **CI/CD**: Validate tokens in your pipeline
- **Documentation**: Auto-generate token docs

## Quick Reference

### Common Commands

```bash
# Resolve tokens from JSON
tokenscript parse_json --json tokens.json --output output.json

# Interactive REPL
tokenscript interactive

# Process token set (ZIP)
tokenscript parse_tokenset --tokenset tokens.zip --output output.json

# Run compliance tests
tokenscript evaluate_standard_compliance --test-dir ./tests
```

### Common TokenScript Patterns

<TokenScriptCodeBlock mode="script" showResult={false}>
{`// Variables with types
variable spacing: NumberWithUnit = 8px;
variable scale: Number = 1.5;

// Expressions
variable large: NumberWithUnit = spacing * scale;

// Functions
variable lighter: Color = lighten(#0066FF, 20);
variable rounded: Number = round(3.14159, 2);

// Lists
variable colors: List = #FF0000, #00FF00, #0000FF;

// Control flow
variable condition: Boolean = true;
if (condition) [
    return "yes";
] else [
    return "no";
]`}
</TokenScriptCodeBlock>

---

## Success! What Now?

You've got TokenScript working! Here are your next steps based on your goals:

<div class="card-grid">
  <div class="card">
    <h3>🎨 I want to write token scripts</h3>
    <p>Learn the language and write your own transformations</p>
    <a href="/language/tutorial">Start Language Tutorial →</a>
  </div>

  <div class="card">
    <h3>⚙️ I want to use the CLI</h3>
    <p>Master all CLI commands and workflows</p>
    <a href="/cli/overview">Explore CLI →</a>
  </div>

  <div class="card">
    <h3>🔧 I want to integrate in my app</h3>
    <p>Embed the interpreter programmatically</p>
    <a href="/api/getting-started">API Documentation →</a>
  </div>

  <div class="card">
    <h3>🧩 I want to extend TokenScript</h3>
    <p>Add custom color spaces, units, or functions</p>
    <a href="/extensions/overview">Extension Guide →</a>
  </div>
</div>

---

**You're all set!** Happy token scripting! 🚀

