---
title: Extensions Overview
description: Extend TokenScript with custom color spaces, units, and functions.
sidebar_label: Overview
---

# Extensions Overview

TokenScript is designed to be extensible. You can add custom color spaces, units, and functions without modifying the core interpreter.

## What Can You Extend?

### Color Spaces
Add custom color spaces beyond the built-in ones (sRGB, P3, Oklch, etc.)

[→ Color Schemas Guide](./color-schemas)

### Units
Register custom units for your specific needs (design tokens, layout units, etc.)

[→ Unit Schemas Guide](./unit-schemas)

### Functions
Create custom functions that integrate seamlessly with TokenScript

[→ Functions Guide](./functions)

## Extension Architecture

All extensions are defined in **pure JSON** - no code compilation required. This makes them:
- ✅ Easy to share and distribute
- ✅ Safe to load at runtime
- ✅ Version-controllable
- ✅ Product-specific without forking

## Coming Soon

More detailed guides and examples are being added. Check back soon!

