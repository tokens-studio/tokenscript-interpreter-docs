---
title: Authoring Color Schemas
description: Define color specifications, initializers, and conversions for the TokenScript runtime.
sidebar_label: Colors
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Authoring Color Schemas

Color schemas dynamically implement color types in your tokenscript runtime. They are represented as JSON documents and define the data type itself as well as conversion path to multiple other color types. Colors are managed by the `ColorManager`.

## Schema Anatomy

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "name": "SRGB",
    "type": "color",
    "schema": {
      "type": "object",
      "order": ["r", "g", "b"],
      "required": ["r", "g", "b"],
      "properties": {
        "r": { "type": "number" },
        "g": { "type": "number" },
        "b": { "type": "number" }
      }
    },
    "initializers": [],
    "conversions": [],
    "description": "RGB color"
}`}
</TokenScriptCodeBlock>

- `name`: Human-readable identifier (also used as the subtype identifier, e.g., `Color.SRGB`).
- `schema`: JSON schema describing attributes exposed for structured colors. `order` controls property formatting.
- `initializers`: Functions that build a color from input values.
- `conversions`: Conversion scripts to/from other color schemas.

## Registering Schemas

```ts
import srgbSpec from "../data/specifications/colors/srgb.json" assert { type: "json" };
import { ColorManager } from "@tokens-studio/tokenscript-interpreter";

const colorManager = new ColorManager();

colorManager.register(
  "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0/",
  srgbSpec,
);
```

## Initializers

Initializers allow TokenScript users to initialize color objects from function calls. E.g. srgb(255, 0, 0) would then create a Color.SRGB object.

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
   "title": "function",
   "keyword": "srgb",
   "schema": { "type": "string", "pattern": "^rgb\\\\((\\\\d{1,3}),\\\\s*(\\\\d{1,3}),\\\\s*(\\\\d{1,3})\\\\)$" },
   "script": {
     "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
     "script": "variable color_parts: List = {input};\\nvariable output: Color.SRGB;\\noutput.r = color_parts.get(0);\\n..."
   }
}`}
</TokenScriptCodeBlock>

- `keyword` becomes the callable name in TokenScript.
- `{input}` resolves to either the parsed function argument list or a pre-validated value.
- Scripts run inside a dedicated interpreter with a cloned `Config`.

## Conversions

Conversions define `color.to.<Target_Identifier>()` methods:

<TokenScriptCodeBlock mode="json" showResult={false}>
{`{
    "description": "Converts HEX to RGB",
    "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/hex-color/0/",
    "target": "$self",
    "lossless": true,
    "script": {
      "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
      "script": "variable hex: String = {input};\\n..."
    }
}`}
</TokenScriptCodeBlock>

- `source`: URI of the input format. `$self` refers to the schema being registered.
- `target`: URI of the output format. `$self` indicates identity conversions.
- Scripts receive `{input}` as a `ColorSymbol`, and must return a `ColorSymbol`.
- `lossless` flags implies no data loss during conversion. Which means that if you convert back to the source format you will get the exact same value. During pathfinding the interpreter prefers lossless conversions.

## Attribute Access & Validation

- Attributes (`color.r`, `color.l`) map to schema properties. Setting an undefined attribute triggers an exception `ColorManagerError.MISSING_SCHEMA`. 

- Type mismatches raise `ColorManagerError.INVALID_ATTRIBUTE_TYPE`.
