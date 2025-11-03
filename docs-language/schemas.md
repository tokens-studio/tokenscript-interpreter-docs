---
title: Schemas
description: Schema definitions and validation in TokenScript.
sidebar_label: Schemas
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

# Schemas

Schemas are function like packages to extend tokenscript.

They allow you to ship **custom token logic** along with your **design token data** without having to modify source code.

Schemas use Tokenscript nested in a JSON specification to compute values against given input.

Using Schemas you can add:

**Custom types**

- **Color spaces** (rgb, oklch, etc)
- **Custom units** (px, rem, etc)

**Custom functions**

- **Functions** (brighten, darken, etc)

## Schema specification

### Color schemas

```jsonc
{
  // The name will be used to defined the type inside tokenscript -> Color.Srgb
  "name": "SRGB",
  "description": "SRGB color with three channels: red, green & blue.",

  "type": "color",

  // Input specification for the data properties stored in the color type.
  // In most cases this will store the values of your color channels.
  "schema": {
    "type": "object",
    // Order is used for the initializer function e.g.: rgb(r, g, b) and pretty printing of the symbol
    "order": ["r", "g", "b"],
    "required": ["r", "g", "b"],
    "properties": {
      "r": { "type": "number" },
      "g": { "type": "number" },
      "b": { "type": "number" }
    }
  },

  // Initializers allow to construct the color via a function call
  // E.g.: variable color: Color.Rgb = rgb(255, 255, 255);
  "initializers": [
    {
      "title": "function",
      "keyword": "srgb",
      "description": "Creates a RGB color from string",
      "script": {
        "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
        // The script to initialize the color, takes the properties defined in the input schema and stores them on the color symbol
        // Look for minified version below
        "script": "variable color_parts: List = {input}; \n variable output: Color.RGB;\n output.r = color_parts.get(0);\n output.g = color_parts.get(1);\n output.b = color_parts.get(2);\n return output;"
      }
    }
  ],


  // Conversions are used to define conversion to and from other color types
  // Tokenscript will automatically find a conversion path, so you dont have to define a conversion for every color type.
  // But to enable the a lossless conversion it is important to define the most similar color type for the conversion source and destination.
  "conversions": [
    {
      // The source schema URI for the 
      // This URI will be used as the id for the lookup in the ColorManager
      "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/hex-color/0/",
      // Target can reference it self with `$self`
      "target": "$self",
      "description": "Converts HEX to RGB",
      "lossless": true,
      "script": {
        "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
        // The script to convert from hex to rgb
        // In this case does splitting of the hex string to fill the `Color.Rgb` type.
        "script": "variable color_parts: List = {input}.to_string().split('#'); \n variable color: List = color_parts.get(1).split(); \n variable length: Number = color.length(); \n variable rgb: List = 0, 0, 0; \n if(length == 3) [ \n rgb.update(0, parse_int(color.get(0).concat(color.get(0)), 16)); \n rgb.update(1, parse_int(color.get(1).concat(color.get(1)), 16)); \n rgb.update(2, parse_int(color.get(2).concat(color.get(2)), 16)); \n ] else [ \n rgb.update(0, parse_int(color.get(0).concat(color.get(1)), 16)); \n rgb.update(1, parse_int(color.get(2).concat(color.get(3)), 16)); \n rgb.update(2, parse_int(color.get(4).concat(color.get(5)), 16)); \n ]; \n \n variable output: Color.RGB; \n output.r = rgb.get(0); \n output.g = rgb.get(1); \n output.b = rgb.get(2); \n \n return output; \n"
      }
    },
    // The Reverse of hex to rgb conversion
    {
      "source": "$self",
      "target": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/hex-color/0/",
      "description": "Converts RGB to HEX",
      "lossless": true,
      "script": {
        "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
        "script": "variable rgba: List = {input}.r, {input}.g, {input}.b;\n    variable hex: String = \"#\";\n    variable i: Number = 0;\n    variable value: Number = 0;\n    // Convert RGBA to Hex\n    while( i < min(rgba.length(), 3)) [\n        value = rgba.get(i);\n        if(value < 16) [\n            hex = hex.concat(\"0\").concat(value.to_string(16));\n        ] else [\n            hex = hex.concat(value.to_string(16));\n        ];\n        i = i + 1;\n    ];\n    \n    if (rgba.length() == 4) [\n        value = rgba.get(3) * 255; // Convert alpha to 0-255 range\n        if(value < 16) [\n            hex = hex.concat(\"0\").concat(value.to_string(16));\n        ] else [\n            hex = hex.concat(value.to_string(16));\n        ];\n    ];\n    \n    return hex;"
      }
    }
  ]
}
```

#### Initializers

Initializers allow to construct a color via a function call.

<TokenScriptCodeBlock mode="script" showResult={true}>
{`srgb(255, 255, 255);`}
</TokenScriptCodeBlock>

This would call our initializer function with the input of `[255, 255, 255]`.

<TokenScriptCodeBlock mode="script" showResult={true} input={[255, 255, 255]}>
{`// Get the input reference
variable color_parts: List = {input}; 

// Set the channels to the values from the input list
variable output: Color.SRGB;
output.r = color_parts.get(0);
output.g = color_parts.get(1);
output.b = color_parts.get(2);

// Return the constructed color
return output; `}
</TokenScriptCodeBlock>

#### Conversions

Conversions are scripts to convert from a `source` schema type and to a `target` schema type.

Use `$self` to target the current schema.

A type can be converted via `x.to.typename()`

<TokenScriptCodeBlock mode="script" showResult={true} input={"#eb6fb0"}>
{`// Input #eb6fb0
  
  // Convert the input to a string and split the hex symbol
variable color_parts: List = {input}.to_string().split('#'); 

 // Split the hex string into channel parts
 variable color: List = color_parts.get(1).split(); 

 // Parse either 3 part or 6 part hex strings
 variable rgb: List; 
 if (color.length() == 3) [ 
   rgb = parse_int(color.get(0).concat(color.get(0)), 16), 
         parse_int(color.get(1).concat(color.get(1)), 16),
         parse_int(color.get(2).concat(color.get(2)), 16);
 ] else [ 
   rgb = parse_int(color.get(0).concat(color.get(1)), 16),
         parse_int(color.get(2).concat(color.get(3)), 16),
         parse_int(color.get(4).concat(color.get(5)), 16);
 ]; 
 
 // Assemble the output type
 variable output: Color.Srgb; 
 output.r = rgb.get(0); 
 output.g = rgb.get(1); 
 output.b = rgb.get(2); 
 
 return output; 
`}
</TokenScriptCodeBlock>

### Function schemas

```json
{
  "name": "Invert Color",
  "description": "Inverts a color by inverting each RGB channel (R' = 1 - R, G' = 1 - G, B' = 1 - B), preserving the alpha channel.",

  "type": "function",

  // The keyword by which the function can be called from: `invert(#333)`
  "keyword": "invert",

  // The input arguments with the specified type
  "input": {
    "type": "object",
    "properties": {
      "color": {
        "type": "color",
        "description": "The color to invert."
      }
    }
  },
  // Script that will be executed on call
  "script": {
    "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
    "script": "variable input: List = {input};\nvariable baseColor: Color = input.get(0);\n\nvariable rgbColor: Color.Srgb = baseColor.to.srgb();\n\nvariable invertedR: Number = 255 - rgbColor.r;\nvariable invertedG: Number = 255 - rgbColor.g;\nvariable invertedB: Number = 255 - rgbColor.b;\n\nvariable invertedColor: Color.Srgb = srgb(invertedR, invertedG, invertedB);\nreturn invertedColor;"
  },
  // Schema dependencies, these will have to be set up in the Configuration for the function to work.
  "requirements": [
    "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0.1.0/"
  ]
}
```

#### Script

<TokenScriptCodeBlock mode="script" showResult={true} input={["#FFF"]}>
{`// Input #FFF
variable input: List = {input};
variable baseColor: Color = input.get(0);

variable rgbColor: Color.Srgb = baseColor.to.srgb();

variable invertedR: Number = 255 - rgbColor.r;
variable invertedG: Number = 255 - rgbColor.g;
variable invertedB: Number = 255 - rgbColor.b;

variable invertedColor: Color.Srgb = srgb(invertedR, invertedG, invertedB);
return invertedColor;`}
</TokenScriptCodeBlock>
