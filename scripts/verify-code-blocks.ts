#!/usr/bin/env node

/**
 * Script to extract and verify TokenScript code blocks
 * 
 * This script:
 * 1. Extracts TokenScript code blocks from markdown files
 * 2. Sets up the TokenScript interpreter with color schemas
 * 3. Runs each code block and reports success/failure
 */

import { Lexer, Parser, Interpreter, Config, ColorManager } from '@tokens-studio/tokenscript-interpreter';
import { extractAllCodeBlocks, type CodeBlock } from './extract-code-blocks.js';

interface SchemaInfo {
  id: string;
  name: string;
  version: string;
  url: string;
}

interface SchemaRegistryResponse {
  schemas: SchemaInfo[];
}

interface VerificationResult {
  block: CodeBlock;
  success: boolean;
  error?: string;
  result?: any;
  executionTime: number;
}

/**
 * Fetch available schemas from the TokenScript schema registry
 */
async function fetchSchemaRegistry(): Promise<SchemaInfo[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema?format=json', {
      signal: controller.signal
    });
    console.log("RESPO", response);
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch schema registry: ${response.statusText}`);
    }
    
    const data = await response.json() as SchemaRegistryResponse;
    return data || [];
  } catch (error) {
    console.warn('Warning: Could not fetch schema registry:', error instanceof Error ? error.message : error);
    console.log('Falling back to default schemas...');
  }
}

/**
 * Fetch a specific schema by URL
 */
async function fetchSchema(slug: string): Promise<any> {
  try {
    const controller = new AbortController();
    const url = `https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema/${slug}`

    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`${url}/latest?format=json`, { signal: controller.signal });
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const json = await response.json();
    
    return await [url, json];
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`  ⚠ Could not fetch schema: ${error.message}`);
    }
    return null;
  }
}

/**
 * Setup ColorManager with all available color schemas from the registry
 */
async function setupColorManager(): Promise<ColorManager> {
  const colorManager = new ColorManager();
  
  console.log('Fetching schema registry...');
  const schemas = await fetchSchemaRegistry();

  // Filter for color-related schemas
  const colorSchemas = schemas.filter(schema => schema.type === 'type');

  console.log(`Registering ${colorSchemas.length} color schemas...`);

  for (const schemaInfo of colorSchemas) {
    try {
      const [url, spec] = await fetchSchema(schemaInfo.slug);
      if (spec) {
        colorManager.register(`${url}/0`, spec.content);
        console.log(`  ✓ Registered: ${schemaInfo.slug}`);
      }
    } catch (error) {
      console.warn(`  ✗ Failed to register ${schemaInfo.slug}:`, error);
    }
  }
  
  return colorManager;
}

/**
 * Execute a TokenScript code block
 */
function executeTokenScript(
  code: string,
  colorManager: ColorManager,
  references?: any
): { result: any; error?: string } {
  try {
    const lexer = new Lexer(code);
    const parser = new Parser(lexer);
    const config = new Config({ colorManager });
    const interpreter = new Interpreter(parser, { config, references });
    const result = interpreter.interpret();
    
    return { result };
  } catch (error) {
    return {
      result: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Verify a single code block
 */
function verifyCodeBlock(
  block: CodeBlock,
  colorManager: ColorManager
): VerificationResult {
  const startTime = performance.now();
  
  const { result, error } = executeTokenScript(block.code, colorManager);
  
  const executionTime = performance.now() - startTime;
  
  return {
    block,
    success: !error,
    error,
    result,
    executionTime
  };
}

/**
 * Verify all TokenScript code blocks
 */
async function verifyAllBlocks(
  rootDir: string,
  options: {
    verbose?: boolean;
    stopOnError?: boolean;
  } = {}
): Promise<VerificationResult[]> {
  const { verbose = false, stopOnError = false } = options;
  
  // Extract all tokenscript blocks
  console.log('Extracting TokenScript code blocks...\n');
  const extraction = extractAllCodeBlocks(rootDir, {
    filterLanguages: ['tokenscript'],
  });
  
  const blocks = extraction.allBlocks;
  console.log(`Found ${blocks.length} TokenScript code blocks\n`);
  
  // Setup interpreter
  const colorManager = await setupColorManager();

  console.log('\nStarting verification...\n');
  
  // Verify each block
  const results: VerificationResult[] = [];
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockNum = i + 1;
    
    if (verbose) {
      console.log(`[${blockNum}/${blocks.length}] Verifying ${block.filePath}:${block.line}`);
    }
    
    const result = verifyCodeBlock(block, colorManager);
    results.push(result);
    
    if (result.success) {
      if (verbose) {
        console.log(`  ✓ Success (${result.executionTime.toFixed(2)}ms)`);
        if (result.result !== undefined && result.result !== null) {
          console.log(`    Result: ${JSON.stringify(result.result)}`);
        }
      } else {
        process.stdout.write('.');
      }
    } else {
      if (verbose) {
        console.log(`  ✗ Error: ${result.error}`);
      } else {
        process.stdout.write('F');
      }
      
      if (stopOnError) {
        console.log('\n\nStopping on first error.');
        break;
      }
    }
  }
  
  if (!verbose) {
    console.log('\n');
  }
  
  return results;
}

/**
 * Print verification summary
 */
function printSummary(results: VerificationResult[]): void {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total blocks: ${results.length}`);
  console.log(`Successful: ${successful.length} (${(successful.length / results.length * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failed.length} (${(failed.length / results.length * 100).toFixed(1)}%)`);
  
  if (successful.length > 0) {
    const avgTime = successful.reduce((sum, r) => sum + r.executionTime, 0) / successful.length;
    console.log(`Average execution time: ${avgTime.toFixed(2)}ms`);
  }
  
  if (failed.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('FAILED BLOCKS');
    console.log('='.repeat(60));
    
    for (let i = 0; i < failed.length; i++) {
      const result = failed[i];
      const block = result.block;
      
      console.log(`\n[${i + 1}/${failed.length}] ${block.filePath}:${block.line}`);
      console.log(`Error: ${result.error}`);
      console.log('\nCode:');
      console.log(block.code.split('\n').map((line, idx) => `  ${idx + 1} | ${line}`).join('\n'));
      console.log();
    }
  }
}

/**
 * Export results to JSON
 */
function exportResults(results: VerificationResult[]): void {
  const output = {
    summary: {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      timestamp: new Date().toISOString(),
    },
    results: results.map(r => ({
      file: r.block.filePath,
      line: r.block.line,
      success: r.success,
      error: r.error,
      executionTime: r.executionTime,
      codePreview: r.block.code.split('\n').slice(0, 3).join('\n'),
    })),
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('JSON OUTPUT');
  console.log('='.repeat(60));
  console.log(JSON.stringify(output, null, 2));
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const rootDir = args[0] || process.cwd();
  const verbose = args.includes('--verbose') || args.includes('-v');
  const stopOnError = args.includes('--stop-on-error');
  const json = args.includes('--json');
  
  console.log('TokenScript Code Block Verifier');
  console.log('='.repeat(60));
  console.log(`Scanning directory: ${rootDir}`);
  console.log(`Verbose mode: ${verbose}`);
  console.log(`Stop on error: ${stopOnError}`);
  console.log();
  
  try {
    const results = await verifyAllBlocks(rootDir, {
      verbose,
      stopOnError,
    });
    
    printSummary(results);
    
    if (json) {
      exportResults(results);
    }
    
    // Exit with error code if any blocks failed
    const failedCount = results.filter(r => !r.success).length;
    process.exit(failedCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('\nFatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { verifyAllBlocks, verifyCodeBlock, setupColorManager };
