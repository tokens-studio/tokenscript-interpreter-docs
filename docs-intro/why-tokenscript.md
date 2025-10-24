---
title: Why TokenScript?
description: Understand the problems TokenScript solves and when to use it in your design system workflow.
sidebar_label: Why TokenScript
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Why TokenScript?

TokenScript is a domain-specific language for design tokens that brings logic, type safety, and automation to your design system. It solves the fundamental problem of **static tokens in dynamic systems**.

## The Problem: Static Tokens Aren't Enough

### Design tokens started simple...

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "color.primary": "#0066FF",
    "spacing.base": "8px",
    "spacing.large": "16px"
}`}
</TokenScriptCodeBlock>

But real design systems need more:

- **Computed values**: "Make the large spacing 2× the base"
- **Color transformations**: "Generate a lighter version of primary"
- **Conditional logic**: "Use light text on dark backgrounds"
- **Unit conversions**: "Convert rem to px for this context"
- **Theme variations**: "Generate dark mode from light mode"

### The current workarounds

**Option 1: Manual maintenance** 😫

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "spacing.base": "8px",
    "spacing.large": "16px",    // manually keep in sync
    "spacing.xlarge": "24px",   // hope nobody makes mistakes
    "spacing.xxlarge": "32px"   // pray this scales correctly
}`}
</TokenScriptCodeBlock>

**Problems:**
- ❌ Error-prone manual updates
- ❌ No single source of truth
- ❌ Scales poorly (100+ tokens = chaos)
- ❌ Hard to maintain consistency

**Option 2: Build-time scripts** 🤷
```javascript
// tokens-build.js
const tokens = require('./tokens.json');
tokens['spacing.large'] = parseInt(tokens['spacing.base']) * 2 + 'px';
// ... hundreds of lines of brittle code
```

**Problems:**
- ❌ Custom code for every project
- ❌ No type safety (easy to break)
- ❌ Hard to share/reuse
- ❌ Debugging is painful
- ❌ No standard format

**Option 3: CSS/SCSS variables** 🎨
```scss
$spacing-base: 8px;
$spacing-large: $spacing-base * 2;
```

**Problems:**
- ❌ Limited to CSS/SCSS ecosystems
- ❌ Can't use in JavaScript, native apps, etc.
- ❌ No color space conversions
- ❌ Poor tooling for design tokens

---

## The Solution: TokenScript

TokenScript is a **type-safe language for design token logic** that integrates seamlessly with token files.

### What makes TokenScript different?

#### 1. **Design-Native Types** 🎨

Colors, units, and design concepts are first-class citizens:

<TokenScriptCodeBlock mode="script" lines={{ end: 5 }}>
{`variable primary: Color = #0066FF;
variable lighter: Color.Hsl = lighten(primary, 20);
variable spacing: NumberWithUnit = 8px;
variable large: NumberWithUnit = spacing * 2;

variable output: Dictionary;
output.set("primary", primary);
output.set("lighter", lighter);
output.set("spacing", spacing);
output.set("large", large);
output;
`}
</TokenScriptCodeBlock>

No string parsing. No unit confusion. Just works.

#### 2. **Type Safety** ✅

Catch errors before they break your design:

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable base: NumberWithUnit = 8px;
variable scale: Number = 1.5;
variable result: NumberWithUnit = base * scale;  // ✅ Works! Result: 12px

variable broken: NumberWithUnit = base + "hello";  // ❌ Error at evaluation!`}
</TokenScriptCodeBlock>

#### 3. **Powerful Color Management** 🌈

Work in any color space with automatic conversions:

<TokenScriptCodeBlock mode="script" lines={{ end: 5 }}>
{`variable brand: Color = #667EEA;
variable lighter: Color.Hsl = lighten(brand, 20);
return lighter.to.oklch();
`}
</TokenScriptCodeBlock>

#### 4. **Standards-Based** 📋

<TokenScriptCodeBlock mode="json">
{`{
    "spacing.base": {
      "$type": "dimension",
      "$value": "8px"
    },
    "spacing.large": {
      "$type": "dimension",
      "$value": "{spacing.base} * 2"
    }
}`}
</TokenScriptCodeBlock>

## Real-World Use Cases

### Use Case 1: Automated Theme Generation

**Problem:** Manually maintaining light and dark themes is error-prone.

**Solution:** Generate dark theme from light theme automatically:

<TokenScriptCodeBlock mode="script" showResult={false}>
{`// Light theme (source of truth)
variable lightBg: Color = #FFFFFF;
variable lightText: Color = #000000;

// Auto-generate dark theme
variable darkBg: Color = invert(lightBg);
variable darkText: Color = invert(lightText);

// Ensure accessibility
if (contrast(darkText, darkBg) < 4.5) [
    darkText = lighten(darkText, 20);
]`}
</TokenScriptCodeBlock>

### Use Case 2: Responsive Spacing Scale

**Problem:** Spacing needs to scale proportionally across breakpoints.

**Solution:** Define once, compute everywhere:

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable baseSpacing: NumberWithUnit = 4px;
variable scale: Number = 1.5;

variable xs: NumberWithUnit = baseSpacing;
variable sm: NumberWithUnit = baseSpacing * scale;
variable md: NumberWithUnit = sm * scale;
variable lg: NumberWithUnit = md * scale;
variable xl: NumberWithUnit = lg * scale;`}
</TokenScriptCodeBlock>

Change `baseSpacing` once → entire scale updates automatically.

### Use Case 3: Color Ramps

**Problem:** Need 9 shades of each color, consistently.

**Solution:** Generate programmatically:

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable brand: Color = #0066FF;

variable brand50: Color = lighten(brand, 45);
variable brand100: Color = lighten(brand, 40);
variable brand200: Color = lighten(brand, 30);
// ... compute all 9 shades
variable brand900: Color = darken(brand, 40);`}
</TokenScriptCodeBlock>

Update brand color once → all shades regenerate.

### Use Case 4: Unit Conversion for Multi-Platform

**Problem:** iOS needs `pt`, Android needs `dp`, web needs `px`.

**Solution:** Convert automatically:

<TokenScriptCodeBlock mode="script" showResult={false}>
{`variable baseSpacing: NumberWithUnit = 16px;

// For iOS (1pt = 1px on 1x displays)
variable iosSpacing: NumberWithUnit = baseSpacing;  // 16pt

// For Android (1dp ≈ 1px on mdpi)
variable androidSpacing: NumberWithUnit = baseSpacing;  // 16dp

// Can also do explicit conversions
variable remSpacing: NumberWithUnit = baseSpacing.convertTo("rem", 16);  // 1rem`}
</TokenScriptCodeBlock>

---

## TokenScript vs. Alternatives

| Feature              | TokenScript      | Style Dictionary | Theo          | CSS Variables | Custom Scripts   |
|----------------------|------------------|------------------|---------------|---------------|------------------|
| **Type Safety**      | ✅ Built-in      | ❌ No            | ❌ No         | ❌ No         | 🟡 DIY           |
| **Color Spaces**     | ✅ Oklch, P3+    | 🟡 Basic         | 🟡 Basic      | 🟡 Limited    | 🟡 DIY           |
| **JSON**             | ✅ Native        | 🟡 Plugin        | ❌ No         | N/A           | 🟡 DIY           |
| **Logic/Conditions** | ✅ Full language | 🟡 Transforms    | 🟡 Limited    | ❌ No         | ✅ Yes (custom)  |
| **Embeddable**       | ✅ CLI + API     | 🟡 CLI mainly    | 🟡 CLI mainly | N/A           | 🟡 DIY           |
| **Learning Curve**   | 🟡 Moderate      | 🟡 Moderate      | 🟢 Easy       | 🟢 Easy       | 🔴 High (custom) |
| **Extensibility**    | ✅ JSON schemas  | 🟡 Transforms    | 🟡 Limited    | ❌ No         | ✅ Full (custom) |

---

## What Can You Build With TokenScript?

-  **Design token resolvers** - Turn JSON into platform-specific formats
-  **Theme generators** - Auto-generate theme variations
-  **Color tools** - Build color palette generators
-  **Design system validators** - Check token consistency
-  **Build plugins** - Integrate with webpack, vite, rollup
-  **Design tool plugins** - Use in Figma, Sketch, etc.
-  **CLI tools** - Automate token workflows
-  **Token documentation** - Auto-generate docs from tokens

---

## Getting Started

Ready to try TokenScript? Here's how:

### 1. **Quick Start (5 minutes)** 
```bash
npm install @tokens-studio/tokenscript-interpreter
```
[Follow the Quick Start Guide](/intro/quick-start)

### 2. **Learn the Language**
Write your first TokenScript and understand the syntax.

[Language Tutorial](/language/tutorial)

### 3. **Integrate in Your Project**
Embed the interpreter in your build pipeline.

[API & Integration Guide](/api/getting-started)

## Next Steps

<div class="button-group">
  <a href="/intro/quick-start" class="button button--primary button--lg">
    Try the 5-Minute Quick Start
  </a>
  <a href="/intro/installation" class="button button--secondary button--lg">
    Installation Guide
  </a>
</div>

---

**TokenScript**: Turn your design tokens into a living, type-safe system. 🚀

