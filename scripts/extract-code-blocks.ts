#!/usr/bin/env node
/**
 * Script to extract code blocks from markdown files
 *
 * This script uses unified/remark to properly parse markdown files
 * and extract code blocks, particularly those marked as 'tokenscript'.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import type { Code } from 'mdast';

interface CodeBlock {
  lang: string | null;
  code: string;
  filePath: string;
  line: number;
  meta: string | null;
}

interface ExtractionResult {
  totalFiles: number;
  totalBlocks: number;
  blocksByLanguage: Map<string, CodeBlock[]>;
  allBlocks: CodeBlock[];
}

function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  const items = readdirSync(dir);

  for (const item of items) {
    // Skip node_modules and hidden directories
    if (item === 'node_modules' || item.startsWith('.')) {
      continue;
    }

    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractCodeBlocks(filePath: string, content: string): CodeBlock[] {
  const codeBlocks: CodeBlock[] = [];

  try {
    const tree = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .parse(content);

    visit(tree, 'code', (node: Code) => {
      codeBlocks.push({
        lang: node.lang || null,
        code: node.value,
        filePath,
        line: node.position?.start.line || 0,
        meta: node.meta || null,
      });
    });
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
  }

  return codeBlocks;
}

function collectTokenscriptBlocks(
  rootDir: string,
  options: {
    /** Only extract blocks with these languages (e.g., ['tokenscript']) */
    filterLanguages?: string[];
    /** Include blocks with no language specified */
    includeUnlabeled?: boolean;
  } = {}
): ExtractionResult {
  const { filterLanguages = [], includeUnlabeled = false } = options;

  const markdownFiles = findMarkdownFiles(rootDir);
  const blocksByLanguage = new Map<string, CodeBlock[]>();
  const allBlocks: CodeBlock[] = [];
  let totalBlocks = 0;

  for (const file of markdownFiles) {
    const content = readFileSync(file, 'utf-8');
    const blocks = extractCodeBlocks(file, content);

    for (const block of blocks) {
      // Apply language filter
      if (filterLanguages.length > 0) {
        if (!block.lang) {
          if (!includeUnlabeled) continue;
        } else if (!filterLanguages.includes(block.lang)) {
          continue;
        }
      }

      // Group by language
      const lang = block.lang || 'unlabeled';
      if (!blocksByLanguage.has(lang)) {
        blocksByLanguage.set(lang, []);
      }
      blocksByLanguage.get(lang)!.push(block);
      allBlocks.push(block);
      totalBlocks++;
    }
  }

  return {
    totalFiles: markdownFiles.length,
    totalBlocks,
    blocksByLanguage,
    allBlocks,
  };
}

/**
 * Print extraction results
 */
function printResults(result: ExtractionResult, rootDir: string): void {
  console.log('='.repeat(60));
  console.log('CODE BLOCK EXTRACTION RESULTS');
  console.log('='.repeat(60));
  console.log(`Total markdown files: ${result.totalFiles}`);
  console.log(`Total code blocks: ${result.totalBlocks}\n`);

  // Print summary by language
  console.log('Blocks by language:');
  const sortedLanguages = Array.from(result.blocksByLanguage.entries())
    .sort((a, b) => b[1].length - a[1].length);

  for (const [lang, blocks] of sortedLanguages) {
    console.log(`  ${lang}: ${blocks.length}`);
  }
  console.log();

  // Print detailed info for each block
  for (const [lang, blocks] of sortedLanguages) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Language: ${lang} (${blocks.length} blocks)`);
    console.log('='.repeat(60));

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const relPath = relative(rootDir, block.filePath);

      console.log(`\n[${i + 1}/${blocks.length}] ${relPath}:${block.line}`);
      if (block.meta) {
        console.log(`Meta: ${block.meta}`);
      }
      console.log(`Length: ${block.code.length} chars, ${block.code.split('\n').length} lines`);

      // Show a preview of the code (first 3 lines)
      const preview = block.code.split('\n').slice(0, 3).join('\n');
      console.log('Preview:');
      console.log(preview);
      if (block.code.split('\n').length > 3) {
        console.log('...');
      }
    }
  }
}

/**
 * Main entry point
 */
function main(): void {
  const args = process.argv.slice(2);

  // Parse command line arguments
  const rootDir = args[0] || process.cwd();
  const filterLanguages = args.includes('--lang')
    ? args[args.indexOf('--lang') + 1]?.split(',') || []
    : [];
  const includeUnlabeled = args.includes('--include-unlabeled');

  console.log(`Scanning directory: ${rootDir}`);
  if (filterLanguages.length > 0) {
    console.log(`Filtering for languages: ${filterLanguages.join(', ')}`);
  }
  console.log();

  const result = collectTokenscriptBlocks(rootDir, {
    filterLanguages,
    includeUnlabeled,
  });

  printResults(result, rootDir);

  // Export to JSON if requested
  if (args.includes('--json')) {
    const jsonOutput = {
      summary: {
        totalFiles: result.totalFiles,
        totalBlocks: result.totalBlocks,
        languages: Array.from(result.blocksByLanguage.keys()),
      },
      blocks: result.allBlocks,
    };
    console.log('\n\nJSON Output:');
    console.log(JSON.stringify(jsonOutput, null, 2));
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export for use as a module
export {
  collectTokenscriptBlocks as extractAllCodeBlocks,
  extractCodeBlocks,
  findMarkdownFiles,
  type CodeBlock,
  type ExtractionResult,
};
