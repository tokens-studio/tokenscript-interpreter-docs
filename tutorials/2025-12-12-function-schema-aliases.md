---
title: "Creating a function schema: Function alias"
date: 2025-12-12
tags:
  - schema
  - function
  - math
---

import TokenScriptCodeBlock from '@site/src/components/TokenScriptCodeBlock';

How to create a simple function schema to alias another function.

<!--truncate-->

## Writing the schema

An alias schema wraps the original function, forwarding all calls to the new implementation. Here's the `roundTo` alias function for `round_to`:

<TokenScriptCodeBlock mode="script" showResult={false}>{
`variable input: List = {input};
variable value: Number = input.get(0);
variable hasPrecision: Boolean = input.length() > 1;
variable result: Number;

if (hasPrecision) [
    result = round_to(value, input.get(1));
] else [
    result = round_to(value);
];

return result;
`}</TokenScriptCodeBlock>

Which we wrap in this function schema:

export const SCHEMA = `{
  "name": "Round To (Alias)",
  "description": "Backwards compatibility alias for round_to. Rounds a number to a specified number of decimal places using banker's rounding (round half to even).",
  "type": "function",
  "keyword": "roundTo",
  "input": {
    "type": "object",
    "properties": {
      "value": {
        "type": "number",
        "description": "The number to round."
      },
      "precision": {
        "type": "number",
        "description": "The number of decimal places to round to. Defaults to 0 if not provided."
      }
    }
  },
  "script": {
    "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
    "script": "variable input: List = {input};\\nvariable value: Number = input.get(0);\\nvariable hasPrecision: Boolean = input.length() > 1;\\nvariable result: Number;\\n\\nif (hasPrecision) [\\n    result = round_to(value, input.get(1));\\n] else [\\n    result = round_to(value);\\n];\\n\\nreturn result;"
  },
  "requirements": []
}`;

<TokenScriptCodeBlock mode="json" showResult={false}>
{SCHEMA}
</TokenScriptCodeBlock>


## Using the Alias

Both function names work identically:

export const CUSTOM_FUNCTIONS = new Map([
  ['roundTo', JSON.parse(SCHEMA)]
]);

<TokenScriptCodeBlock mode="script" functionSchemas={CUSTOM_FUNCTIONS}>{
`variable x: Number = roundTo(3.14159, 2);
variable y: Number = round_to(3.14159, 2);

return x, x == y;`}
</TokenScriptCodeBlock>

And without the optional precision argument:

<TokenScriptCodeBlock mode="script" functionSchemas={CUSTOM_FUNCTIONS}>{
`variable x: Number = roundTo(3.14159);
variable y: Number = round_to(3.14159);

return x, x == y;`}
</TokenScriptCodeBlock>

## Learn More

For more information about function schemas, see the [Schema Documentation](/language/schemas).
