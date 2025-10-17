---
title: Language Recipes
description: Practical TokenScript snippets for common design token tasks.
sidebar_label: Language Recipes
---

# Language Recipes

These recipes demonstrate reusable patterns you can adapt for your own token workflows. Each snippet aligns with interpreter tests (`tests/interpreter/*.test.ts`) to ensure correctness.

## Generate a Spacing Scale

```tokenscript
variable base: NumberWithUnit = 4px;
variable scale: Number = 1.5;

variable ramp: List = base;
variable i: Number = 1;

while (i < 5) [
  ramp.append(base * pow(scale, i));
  i = i + 1;
];

return ramp.join(", ");
```

Produces `4px, 6px, 9px, 13.5px, 20.25px`.

## Build a Color Ramp in OKLCH

```tokenscript
variable seed: Color = #FF9900;
variable oklchRamp: List = oklchRamp(seed.to.oklch()).values();

variable hexValues: List;
variable idx: Number = 0;

while (idx < oklchRamp.length()) [
  hexValues.append(oklchRamp.get(idx).to.hex());
  idx = idx + 1;
];

return hexValues;
```

Requires schemas providing `oklch` conversions (see `data/specifications/colors/`).

## Normalize Design Token References

```tokenscript
variable spacingBase: NumberWithUnit = {spacing.base};
variable spacingSm: NumberWithUnit = spacingBase * 0.75;
variable spacingLg: NumberWithUnit = spacingBase * 1.5;

return spacingSm.to_string().concat(", ").concat(spacingLg.to_string());
```

Wrap this logic inside a token (`spacing.scale`) so `TokenSetResolver` outputs consistent values.

## Work with Dictionaries

```tokenscript
variable palette: Dictionary;

palette.set("primary", #FF6600);
palette.set("onPrimary", palette.get("primary").to.srgb());

return palette.get("onPrimary").r;
```

## Guard Against Null Values

```tokenscript
variable maybeToken: String = {optional_token};

if (maybeToken == null) [
  return "fallback";
] else [
  return maybeToken;
];
```

Comparisons with `null` remain safe thanks to dedicated `NullSymbol` semantics.

---

Looking for more inspiration? Browse:

- `tests/interpreter/complex-expressions.test.ts`
- `tests/interpreter/color-converter.test.ts`
- `examples/blog-articles/` for narrative walkthroughs.
