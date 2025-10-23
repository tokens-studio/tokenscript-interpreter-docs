#!/usr/bin/env node

/**
 * Script to fetch TokenScript schemas at build time
 * 
 * This script:
 * 1. Fetches color and function schemas from the registry
 * 2. Writes them to a generated TypeScript file
 * 3. Can be imported by the TokenScriptCodeBlock component
 */

interface SchemaInfo {
  id: string;
  name: string;
  version: string;
  url: string;
  type: 'type' | 'function';
  slug: string;
}

interface SchemaRegistryResponse {
  schemas: SchemaInfo[];
}

/**
 * Fetch available schemas from the TokenScript schema registry
 */
async function fetchSchemaRegistry(): Promise<SchemaInfo[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch('https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema?format=json', {
      signal: controller.signal
    });
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch schema registry: ${response.statusText}`);
    }
    
    const data = await response.json() as SchemaRegistryResponse;
    return data.schemas || [];
  } catch (error) {
    console.error('Error fetching schema registry:', error);
    return [];
  }
}

/**
 * Fetch a specific schema by slug
 */
async function fetchSchema(slug: string): Promise<[string, any] | null> {
  try {
    const controller = new AbortController();
    const url = `https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/${slug}`;
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${url}/latest?format=json`, { signal: controller.signal });
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const json = await response.json();
    return [url, json.content];
  } catch (error) {
    console.warn(`  ⚠ Could not fetch schema ${slug}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Main function to fetch schemas and write to file
 */
async function main(): Promise<void> {
  console.log('Fetching TokenScript schemas...\n');
  
  // Essential schemas needed for the docs
  const essentialColorSchemas = [
    'hsl-color',
    'srgb-color',
    'rgba-color',
    'oklch-color',
  ];
  
  // Hardcoded CssColor schema (required for color conversions)
  const cssColorSchema = {
    "name": "CssColor",
    "type": "color",
    "description": "CSS color string representation",
    "schema": {
      "type": "object",
      "properties": {
        "value": {
          "type": "string"
        },
        "input": {
          "type": "color"
        }
      },
      "required": ["value", "input"],
      "order": ["value", "input"],
      "additionalProperties": false
    },
    "initializers": [],
    "conversions": [
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/hex-color/0/",
        "target": "$self",
        "description": "Converts Hex to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable output: Color.CssColor;\noutput.value = {input};\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/rgb-color/0.0.1/",
        "target": "$self",
        "description": "Converts RGB to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"rgb(\" {input}.r \", \" {input}.g \", \" {input}.b \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input}\n;\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0.1.0/",
        "target": "$self",
        "description": "Converts SRGB to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"rgb(\" {input}.r \", \" {input}.g \", \" {input}.b \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input}\n;\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/rgba-color/0.0.1/",
        "target": "$self",
        "description": "Converts RGBA to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"rgba(\" {input}.r \", \" {input}.g \", \" {input}.b \", \" {input}.a \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input}\n;\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/hsl-color/0.0.1/",
        "target": "$self",
        "description": "Converts HSL to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"hsl(\" {input}.h \", \" {input}.s \"%, \" {input}.l \"%)\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input};\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/lrgb-color/0.0.1/",
        "target": "$self",
        "description": "Converts LRGB to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable r: Number = {input}.r * 255;\nvariable g: Number = {input}.g * 255;\nvariable b: Number = {input}.b * 255;\nvariable outputs: List = \"rgb(\" r \", \" g \", \" b \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input}\n;\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/rgb-color/0/",
        "target": "$self",
        "description": "Converts RGB to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"rgb(\" {input}.r \", \" {input}.g \", \" {input}.b \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input}\n;\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0.1.0/",
        "target": "$self",
        "description": "Converts SRGB to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"rgb(\" {input}.r \", \" {input}.g \", \" {input}.b \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input}\n;\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/rgba-color/0.0.1/",
        "target": "$self",
        "description": "Converts RGBA to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"rgba(\" {input}.r \", \" {input}.g \", \" {input}.b \", \" {input}.a \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input}\n;\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/hsl-color/0/",
        "target": "$self",
        "description": "Converts HSL to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"hsl(\" {input}.h \", \" {input}.s \"%, \" {input}.l \"%)\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input};\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/lrgb-color/0/",
        "target": "$self",
        "description": "Converts LRGB to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable r: Number = {input}.r * 255;\nvariable g: Number = {input}.g * 255;\nvariable b: Number = {input}.b * 255;\nvariable outputs: List = \"rgb(\" r \", \" g \", \" b \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input}\n;\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/oklch-color/0.0.1/",
        "target": "$self",
        "description": "Converts OKLCH to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"oklch(\" {input}.l \" \" {input}.c \" \" {input}.h \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input};\nreturn output;"
        }
      },
      {
        "source": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/oklch-color/0/",
        "target": "$self",
        "description": "Converts OKLCH to CssColor",
        "lossless": true,
        "script": {
          "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
          "script": "variable outputs: List = \"oklch(\" {input}.l \" \" {input}.c \" \" {input}.h \")\";\nvariable output: Color.CssColor;\noutput.value = outputs.join();\noutput.input = {input};\nreturn output;"
        }
      }
    ]
  };
  
  // Fetch essential color schemas
  const colorSchemasMap = new Map<string, any>();
  console.log('Fetching color schemas:');
  for (const slug of essentialColorSchemas) {
    const result = await fetchSchema(slug);
    if (result) {
      const [url, spec] = result;
      colorSchemasMap.set(`${url}/0/`, spec);
      console.log(`  ✓ ${slug}`);
    }
  }
  
  // Add the hardcoded CssColor schema
  colorSchemasMap.set('https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/css-color/0/', cssColorSchema);
  console.log('  ✓ css-color (hardcoded)');
  
  // Function schemas for color manipulation
  const functionSchemasMap = new Map<string, any>();
  
  // Relative Darken function
  const relativeDarkenSchema = {
    "name": "Relative Darken",
    "type": "function",
    "input": {
      "type": "object",
      "properties": {
        "color": {
          "type": "color",
          "description": "The base color to darken."
        },
        "percentage": {
          "type": "number",
          "description": "The percentage amount to darken the color (0-100)."
        }
      }
    },
    "script": {
      "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
      "script": "variable input: List = {input};\nvariable baseColor: Color = input.get(0);\nvariable percentage: Number = input.get(1);\n\n// Convert to HSL for lightness manipulation\nvariable hslColor: Color.Hsl = baseColor.to.hsl();\n\n// Calculate new lightness (reduce by percentage)\nvariable currentLightness: Number = hslColor.l;\nvariable darkenAmount: Number = currentLightness * (percentage / 100);\nvariable newLightness: Number = currentLightness - darkenAmount;\n\n// Ensure lightness doesn't go below 0\nif (newLightness < 0) [\n    newLightness = 0;\n]\n\n// Create and return the darkened color\nvariable darkenedColor: Color.Hsl = hsl(hslColor.h, hslColor.s, newLightness);\nreturn darkenedColor;"
    },
    "keyword": "darken",
    "description": "Darkens a color by a relative percentage amount by reducing its lightness value.",
    "requirements": [
      "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/hsl-color/0.0.1/",
      "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0.0.1/"
    ]
  };
  
  // Relative Lighten function
  const relativeLightenSchema = {
    "name": "Relative Lighten",
    "type": "function",
    "input": {
      "type": "object",
      "properties": {
        "color": {
          "type": "color",
          "description": "The base color to lighten."
        },
        "percentage": {
          "type": "number",
          "description": "The percentage amount to lighten the color (0-100)."
        }
      }
    },
    "script": {
      "type": "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/core/tokenscript/0/",
      "script": "variable input: List = {input};\nvariable baseColor: Color = input.get(0);\nvariable percentage: Number = input.get(1);\n\n// Convert to HSL for lightness manipulation\nvariable hslColor: Color.Hsl = baseColor.to.hsl();\n\n// Calculate new lightness (increase by percentage)\nvariable currentLightness: Number = hslColor.l;\nvariable lightenAmount: Number = (100 - currentLightness) * (percentage / 100);\nvariable newLightness: Number = currentLightness + lightenAmount;\n\n// Ensure lightness doesn't go above 100\nif (newLightness > 100) [\n    newLightness = 100;\n]\n\n// Create and return the lightened color\nvariable output: Color.Hsl;\noutput.h = hslColor.h;\noutput.s = hslColor.s;\noutput.l = newLightness;\nreturn output;"
    },
    "keyword": "lighten",
    "description": "Lightens a color by a relative percentage amount by increasing its lightness value.",
    "requirements": [
      "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/hsl-color/0.0.1/",
      "https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/srgb-color/0.0.1/"
    ]
  };
  
  functionSchemasMap.set('https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/function/relative-darken/0/', relativeDarkenSchema);
  functionSchemasMap.set('https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/function/relative-lighten/0/', relativeLightenSchema);
  console.log('\nFunction schemas:');
  console.log('  ✓ relative-darken');
  console.log('  ✓ relative-lighten');
  
  // Generate TypeScript file content
  const fileContent = `// Auto-generated file - DO NOT EDIT
// Generated at: ${new Date().toISOString()}
// This file contains TokenScript schemas fetched at build time

export const COLOR_SCHEMAS = new Map<string, any>([
${Array.from(colorSchemasMap.entries())
  .map(([url, spec]) => `  ['${url}', ${JSON.stringify(spec)}]`)
  .join(',\n')}
]);

export const FUNCTION_SCHEMAS = new Map<string, any>([
${Array.from(functionSchemasMap.entries())
  .map(([url, spec]) => `  ['${url}', ${JSON.stringify(spec)}]`)
  .join(',\n')}
]);

export function getColorSchema(url: string): any | undefined {
  return COLOR_SCHEMAS.get(url);
}

export function getFunctionSchema(url: string): any | undefined {
  return FUNCTION_SCHEMAS.get(url);
}
`;
  
  // Write to file
  const fs = await import('fs');
  const path = await import('path');
  const outputDir = path.resolve(process.cwd(), 'src/lib');
  const outputPath = path.join(outputDir, 'schemas.generated.ts');
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  
  console.log(`\n✓ Schemas written to: ${outputPath}`);
  console.log(`  Color schemas: ${colorSchemasMap.size}`);
  console.log(`  Function schemas: ${functionSchemasMap.size}`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
