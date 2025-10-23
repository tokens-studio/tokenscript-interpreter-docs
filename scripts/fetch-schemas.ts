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
    'hex-color',
    'srgb-color',
    'rgba-color',
  ];
  
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
  
  // Fetch function schemas (empty for now)
  const functionSchemasMap = new Map<string, any>();
  console.log('\nFunction schemas: 0 (none configured yet)');
  
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
