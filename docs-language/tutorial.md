---
title: Your First TokenScript
description: Learn TokenScript by writing your first scripts - from hello world to real design system automation.
sidebar_label: Tutorial
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Your First TokenScript

Welcome! In this tutorial, you'll learn TokenScript by writing real code. We'll start simple and build up to practical design system automation.

**What you'll build:**
1. Hello TokenScript (variables and expressions)
2. Color transformations (functions)
3. Spacing scale generator (lists and loops)
4. Theme generator (real-world example)

**Prerequisites:**
- Basic understanding of programming (any language)
- [Installed TokenScript](/intro/quick-start)

**Time:** ~30 minutes

Let's go! 🚀

---

## Lesson 1: Hello TokenScript

### Your First Variable

Open the TokenScript REPL:
```bash
tokenscript interactive
```

Now type:
```tokenscript
variable message: String = "Hello, TokenScript!";
```

Press Enter. You just declared your first variable!

**What happened?**
- `variable` - keyword to declare a variable
- `message` - variable name
- `: String` - type annotation (this is text)
- `= "Hello, TokenScript!"` - the value

### Try It: Numbers

```tokenscript
variable count: Number = 42;
count
```

Output: `42`

```tokenscript
variable price: Number = 19.99;
price
```

Output: `19.99`

### Try It: Numbers with Units

```tokenscript
variable spacing: NumberWithUnit = 8px;
spacing
```

Output: `"8px"`

```tokenscript
variable angle: NumberWithUnit = 45deg;
angle
```

Output: `"45deg"`

:::tip Type Matters!
Notice how `Number` and `NumberWithUnit` are different types. TokenScript is **statically typed** - you declare types explicitly.
:::

---

## Lesson 2: Expressions and Math

Variables can use expressions:

```tokenscript
variable base: NumberWithUnit = 8px;
variable large: NumberWithUnit = base * 2;
large
```

Output: `"16px"`

### Math Operations


<TokenScriptCodeBlock
  mode="script"
  lines={{ end: 9 }}
>
{`variable x: Number = 10;
variable y: Number = 5;

variable sum: Number = x + y;
variable difference: Number = x - y;
variable product: Number = x * y;
variable quotient: Number = x / y;
variable power: Number = x ^ 2;

variable result: Dictionary;
result.set("sum", sum);
result.set("difference", difference);
result.set("product", difference);
result.set("quotient", difference);
result.set("power", difference);
result;
`}
</TokenScriptCodeBlock>

### Units Preserve Through Math

```tokenscript
variable base: NumberWithUnit = 4px;
variable result: NumberWithUnit = base * 3 + 2px;
result
```

Output: `"14px"`  (Math: 4 × 3 + 2 = 14)

### Try It Yourself

Create a spacing scale:
```tokenscript
variable base: NumberWithUnit = 8px;
variable sm: NumberWithUnit = base * 1.5;
variable md: NumberWithUnit = base * 2;
variable lg: NumberWithUnit = base * 3;
variable xl: NumberWithUnit = base * 4;

xl
```

Output: `"32px"`

---

## Lesson 3: Colors

Colors are first-class citizens in TokenScript!

### Creating Colors

```tokenscript
variable brand: Color = #0066FF;
brand
```

Output: `"#0066FF"`

```tokenscript
variable red: Color = rgb(255, 0, 0);
red
```

Output: `"#FF0000"` (converted to hex)

### Color Functions

TokenScript has powerful color functions:

```tokenscript
variable base: Color = #0066FF;
variable lighter: Color = lighten(base, 20);
lighter
```

Output: `"#4D94FF"` (lighter version)

```tokenscript
variable darker: Color = darken(base, 20);
darker
```

Output: `"#0042A6"` (darker version)

### Try It: Color Ramp

Create a full color ramp:

```tokenscript
variable brand: Color = #0066FF;

variable brand100: Color = lighten(brand, 40);
variable brand200: Color = lighten(brand, 30);
variable brand300: Color = lighten(brand, 20);
variable brand400: Color = lighten(brand, 10);
variable brand500: Color = brand;
variable brand600: Color = darken(brand, 10);
variable brand700: Color = darken(brand, 20);
variable brand800: Color = darken(brand, 30);
variable brand900: Color = darken(brand, 40);

brand100
```

Output: `"#99BBFF"` (lightest)

---

## Lesson 4: Lists and Collections

Lists hold multiple values:

```tokenscript
variable numbers: List = 1, 2, 3, 4, 5;
numbers
```

Output: `[1, 2, 3, 4, 5]`

### List Methods

```tokenscript
variable colors: List = #FF0000, #00FF00, #0000FF;

// Get length
variable count: Number = colors.length();
count
```

Output: `3`

```tokenscript
// Get item by index (0-based)
variable first: Color = colors.get(0);
first
```

Output: `"#FF0000"`

### Building Lists Dynamically

```tokenscript
variable items: List = [];
items = items.append(1);
items = items.append(2);
items = items.append(3);
items
```

Output: `[1, 2, 3]`

---

## Lesson 5: Control Flow

### If Statements

```tokenscript
variable isDark: Boolean = true;

if (isDark) [
  return "Use light text";
] else [
  return "Use dark text";
]
```

Output: `"Use light text"`

### Comparisons

```tokenscript
variable size: Number = 100;

if (size > 50) [
  return "large";
] else [
  return "small";
]
```

Output: `"large"`

### Try It: Conditional Colors

```tokenscript
variable bgColor: Color = #000000;
variable isLight: Boolean = lightness(bgColor) > 50;

if (isLight) [
  return #000000;  // dark text on light bg
] else [
  return #FFFFFF;  // light text on dark bg
]
```

Output: `"#FFFFFF"` (white text for dark background)

---

## Lesson 6: Real Example - Spacing Scale Generator

Let's build something real! Create a file `generate-spacing.ts`:

```typescript
import { Interpreter, Lexer, Parser } from '@tokens-studio/tokenscript-interpreter';

const script = `
  // Configuration
  variable base: NumberWithUnit = 4px;
  variable ratio: Number = 1.5;
  
  // Generate scale
  variable xs: NumberWithUnit = base;
  variable sm: NumberWithUnit = xs * ratio;
  variable md: NumberWithUnit = sm * ratio;
  variable lg: NumberWithUnit = md * ratio;
  variable xl: NumberWithUnit = lg * ratio;
  variable xxl: NumberWithUnit = xl * ratio;
  
  // Return as list
  return [xs, sm, md, lg, xl, xxl];
`;

const lexer = new Lexer(script);
const parser = new Parser(lexer);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
const result = interpreter.interpret();

console.log('Spacing Scale:');
const scale = result?.value as any[];
scale.forEach((value, index) => {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  console.log(`  ${sizes[index]}: ${value.toString()}`);
});
```

Run it:
```bash
npx tsx generate-spacing.ts
```

Output:
```
Spacing Scale:
  xs: 4px
  sm: 6px
  md: 9px
  lg: 13.5px
  xl: 20.25px
  xxl: 30.375px
```

**🎉 You just automated a spacing scale!**

---

## Lesson 7: Real Example - Theme Generator

Let's build an automatic theme generator that creates dark mode from light mode:

```typescript
import { Interpreter, Lexer, Parser } from '@tokens-studio/tokenscript-interpreter';

const script = `
  // Light theme (source of truth)
  variable lightBg: Color = #FFFFFF;
  variable lightSurface: Color = #F5F5F5;
  variable lightText: Color = #1A1A1A;
  variable lightTextSecondary: Color = #666666;
  variable lightBorder: Color = #E0E0E0;
  
  // Generate dark theme automatically
  variable darkBg: Color = invert(lightBg);
  variable darkSurface: Color = lighten(darkBg, 5);
  variable darkText: Color = invert(lightText);
  variable darkTextSecondary: Color = darken(darkText, 30);
  variable darkBorder: Color = lighten(darkBg, 10);
  
  // Return dark theme
  return [darkBg, darkSurface, darkText, darkTextSecondary, darkBorder];
`;

const lexer = new Lexer(script);
const parser = new Parser(lexer);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
const result = interpreter.interpret();

console.log('Dark Theme Generated:');
const theme = result?.value as any[];
const labels = ['Background', 'Surface', 'Text', 'Text Secondary', 'Border'];
theme.forEach((color, index) => {
  console.log(`  ${labels[index]}: ${color.toString()}`);
});
```

Run it:
```bash
npx tsx generate-theme.ts
```

Output:
```
Dark Theme Generated:
  Background: #000000
  Surface: #0D0D0D
  Text: #E5E5E5
  Text Secondary: #8C8C8C
  Border: #1A1A1A
```

**🎉 You just automated theme generation!**

---

## Lesson 8: Using References

References let you inject external values:

```typescript
import { Interpreter, Lexer, Parser } from '@tokens-studio/tokenscript-interpreter';

const script = `
  variable large: NumberWithUnit = {baseSpacing} * 2;
  variable xlarge: NumberWithUnit = {baseSpacing} * 3;
  
  return [large, xlarge];
`;

const lexer = new Lexer(script);
const parser = new Parser(lexer);
const ast = parser.parse();

// Provide reference values
const references = new Map();
references.set('baseSpacing', { type: 'NumberWithUnit', value: 8, unit: 'px' });

const interpreter = new Interpreter(ast, { references });
const result = interpreter.interpret();

console.log(result?.toString());  // "[16px, 24px]"
```

:::tip References in Different Modes
- **Interpreter mode** (like above): References are simple names: `{baseSpacing}`
- **Token resolution mode** (DTCG JSON): References can use dots: `{spacing.base}`

[Learn more about modes](/intro/concepts#two-modes-of-operation)
:::

---

## Lesson 9: Real Example - Color Accessibility

Let's build a function that ensures accessible text colors:

```typescript
import { Interpreter, Lexer, Parser } from '@tokens-studio/tokenscript-interpreter';

const script = `
  // Input colors
  variable bgColor: Color = {backgroundColor};
  variable textColor: Color = {textColor};
  
  // Check contrast ratio (WCAG AA requires 4.5:1)
  variable contrastRatio: Number = contrast(textColor, bgColor);
  
  // If not accessible, adjust text color
  if (contrastRatio < 4.5) [
    // If bg is light, use dark text
    if (lightness(bgColor) > 50) [
      textColor = #000000;
    ] else [
      textColor = #FFFFFF;
    ]
  ]
  
  return textColor;
`;

function ensureAccessibleText(bg: string, text: string): string {
  const lexer = new Lexer(script);
  const parser = new Parser(lexer);
  const ast = parser.parse();
  
  const references = new Map();
  references.set('backgroundColor', { type: 'Color', value: bg });
  references.set('textColor', { type: 'Color', value: text });
  
  const interpreter = new Interpreter(ast, { references });
  const result = interpreter.interpret();
  
  return result?.toString() || text;
}

// Test it
console.log('Accessible text colors:');
console.log(`  Light bg + gray text: ${ensureAccessibleText('#F0F0F0', '#CCCCCC')}`);
console.log(`  Dark bg + gray text: ${ensureAccessibleText('#1A1A1A', '#333333')}`);
console.log(`  White bg + yellow: ${ensureAccessibleText('#FFFFFF', '#FFFF00')}`);
```

Output:
```
Accessible text colors:
  Light bg + gray text: #000000  (adjusted!)
  Dark bg + gray text: #FFFFFF   (adjusted!)
  White bg + yellow: #000000     (adjusted!)
```

**🎉 You just automated accessibility!**

---

## Key Takeaways

### What You Learned

✅ **Variables and types** - How to declare typed variables  
✅ **Expressions** - Math, colors, and computations  
✅ **Functions** - Built-in functions like `lighten()`, `darken()`  
✅ **Lists** - Collections and methods  
✅ **Control flow** - `if/else` for logic  
✅ **References** - Injecting external values  
✅ **Real automation** - Spacing scales, themes, accessibility  

### TokenScript Strengths

- **Type safety** prevents errors
- **Color intelligence** with automatic conversions
- **Unit handling** preserves units through math
- **Composability** builds complex from simple
- **Real-world ready** solves actual design system problems

---

## Practice Exercises

Ready to practice? Try these challenges:

### Exercise 1: Typography Scale

Generate a typography scale using a modular scale:

```tokenscript
variable base: NumberWithUnit = 16px;
variable ratio: Number = 1.25;  // Major third

// Generate scale (smaller to larger)
variable xs: NumberWithUnit = base / (ratio ^ 2);
variable sm: NumberWithUnit = base / ratio;
variable md: NumberWithUnit = base;
variable lg: NumberWithUnit = base * ratio;
variable xl: NumberWithUnit = base * (ratio ^ 2);
variable xxl: NumberWithUnit = base * (ratio ^ 3);
```

### Exercise 2: Semantic Colors

Create semantic colors from brand colors:

```tokenscript
variable brand: Color = #0066FF;

variable success: Color = #22C55E;
variable error: Color = #EF4444;
variable warning: Color = #F59E0B;
variable info: Color = brand;

// Generate light versions for backgrounds
variable successBg: Color = lighten(success, 40);
variable errorBg: Color = lighten(error, 40);
variable warningBg: Color = lighten(warning, 40);
variable infoBg: Color = lighten(info, 40);
```

### Exercise 3: Responsive Breakpoints

Generate responsive spacing that scales with viewport:

```tokenscript
variable mobile: NumberWithUnit = 16px;
variable tablet: NumberWithUnit = mobile * 1.25;
variable desktop: NumberWithUnit = mobile * 1.5;
variable wide: NumberWithUnit = mobile * 1.75;
```

---

## What's Next?

### Level Up Your Skills

**Deep Dive into Language Features:**
- [Syntax Reference](/language/syntax) - Complete language grammar
- [Types](/language/types) - All types and their methods
- [Functions](/language/functions) - Built-in function catalog
- [Cookbook](/language/cookbook) - Common patterns and recipes

**Apply It:**
- [CLI Guide](/cli/overview) - Use TokenScript in your build pipeline
- [API Integration](/api/getting-started) - Embed in your tools
- [Extensions](/extensions/overview) - Add custom color spaces and units

### Real-World Projects

Try building these:

1. **Design Token Validator** - Check tokens for consistency
2. **Theme Generator** - Auto-generate color themes
3. **Documentation Generator** - Create token docs automatically
4. **Figma Plugin** - Sync tokens with Figma
5. **Build Plugin** - Integrate with webpack/vite

---

## Get Help

- **Questions?** Check the [Language Reference](/language/overview)
- **Stuck?** See [Common Errors](/language/errors)
- **Examples?** Browse the [Cookbook](/language/cookbook)
- **Bugs?** [Report on GitHub](https://github.com/tokens-studio/tokenscript)

---

## Congratulations! 🎉

You've completed the TokenScript tutorial! You now know:

- ✅ How to write TokenScript code
- ✅ Variables, types, and expressions
- ✅ Color transformations and functions
- ✅ Real-world automation patterns
- ✅ How to integrate TokenScript in projects

**Keep learning, keep building!** 🚀

<div class="button-group">
  <a href="/language/syntax" class="button button--primary">Language Reference →</a>
  <a href="/language/cookbook" class="button button--secondary">Cookbook →</a>
  <a href="/cli/overview" class="button button--secondary">CLI Guide →</a>
</div>

