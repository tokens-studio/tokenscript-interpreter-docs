import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  interpretTokens,
  Lexer,
  Parser,
  Interpreter,
  Config,
  ColorManager,
  FunctionsManager,
} from '@tokens-studio/tokenscript-interpreter';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { tokenscriptLanguage } from '@tokens-studio/tokenscript-interpreter/syntax-highlighting';
import OutputPanel, { getResultTypeName } from './OutputPanel';
import styles from './styles.module.css';
import './prism-tokenscript-theme.css';
import { COLOR_SCHEMAS, FUNCTION_SCHEMAS } from "@site/src/lib/schemas.generated";


// Register the TokenScript language with Prism
if (typeof window !== 'undefined') {
  tokenscriptLanguage(Prism);
}

interface TokenScriptCodeBlockProps {
  code?: string;
  children?: string;
  showResult?: boolean;
  title?: string;
  mode?: 'json' | 'script';
  input?: any;
  colorSchemas?: Map<string, any>;
  functionSchemas?: Map<string, any>;
  lines?: { start?: number; end?: number };
}

export default function TokenScriptCodeBlock({ 
  code: codeProp,
  children,
  showResult = true,
  title,
  mode = 'json',
  input = {},
  colorSchemas = COLOR_SCHEMAS,
  functionSchemas = FUNCTION_SCHEMAS,
  lines,
}: TokenScriptCodeBlockProps) {
  // Use children if provided, otherwise fall back to code prop
  const fullCode = children || codeProp || '';
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // Get the code to display based on lines prop and expanded state
  const displayCode = useMemo(() => {
    if (!lines || expanded) {
      return fullCode;
    }

    const codeLines = fullCode.split('\n');
    const start = (lines.start ?? 1) - 1; // Convert to 0-based index
    const end = lines.end ?? codeLines.length;
    
    return codeLines.slice(start, end).join('\n');
  }, [fullCode, lines, expanded]);

  // Apply Prism highlighting after render
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [displayCode, mode]);

  // Execute code once and memoize the result
  // Always execute the full code, not just the displayed portion
  const { result, error, colorManager } = useMemo(() => {
    if (!showResult) {
      return { result: null, error: null, colorManager: undefined };
    }

    try {
      let interpretedResult: any;
      let managerInstance: ColorManager | undefined;

      if (mode === 'script') {
        // Script mode: use Lexer, Parser, and Interpreter
        const colorMgr = new ColorManager();
        const functionsManager = new FunctionsManager();
        
        // Register color schemas
        for (const [uri, spec] of colorSchemas.entries()) {
          try {
            colorMgr.register(uri, spec);
          } catch (error) {
            console.warn(`Failed to register color schema ${uri}:`, error);
          }
        }
        // Register function schemas
        
        for (const [uri, spec] of functionSchemas.entries()) {
          try {
            functionsManager.register(spec.keyword, spec);
          } catch (error) {
            console.warn(`Failed to register function schema ${uri}:`, error);
          }
        }
        
        const config = new Config({ colorManager: colorMgr, functionsManager });

        console.log(config);

        const lexer = new Lexer(fullCode);
        const ast = new Parser(lexer).parse();
        const interpreter = new Interpreter(ast, {
          references: { input },
          config,
        });
        interpretedResult = interpreter.interpret();
        managerInstance = colorMgr;
      } else {
        // JSON mode: use interpretTokens
        // Parse JSON string to object first
        const parsedJson = JSON.parse(fullCode);
        interpretedResult = interpretTokens(parsedJson);
      }
      
      return { result: interpretedResult, error: null, colorManager: managerInstance };
    } catch (err) {
      return { 
        result: null, 
        error: err instanceof Error ? err.message : String(err),
        colorManager: undefined
      };
    }
  }, [fullCode, showResult, mode, input, colorSchemas, functionSchemas]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handleCopyResult = async () => {
    if (!result) return;
    try {
      const resultText = typeof result === 'object' && 'toString' in result 
        ? result.toString() 
        : JSON.stringify(result, null, 2);
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };



  return (
    <div className={styles.container}>
      <div className={styles.codeBlock}>
        {title && <div className={styles.codeTitle}>{title}</div>}
        <div className={styles.codeHeader}>
          <span className={styles.language}>
            {mode === 'script' ? 'TokenScript' : 'JSON (Design Tokens)'}
          </span>
          <div className={styles.buttonGroup}>
            {lines && (
              <button 
                className={styles.expandButton}
                onClick={handleExpand}
                aria-label={expanded ? 'Collapse code' : 'Expand code'}
              >
                {expanded ? 'Collapse' : 'Expand'}
              </button>
            )}
            <button 
              className={styles.copyButton}
              onClick={handleCopy}
              aria-label="Copy code"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <pre className={mode === 'script' ? 'language-tokenscript' : 'language-json'}>
          <code 
            ref={codeRef}
            className={mode === 'script' ? 'language-tokenscript' : 'language-json'}
          >
            {displayCode}
          </code>
        </pre>
      </div>
      
      {showResult && (
        <div className={styles.resultContainer}>
          <div className={styles.resultHeader}>
            <span>
              Result
              {result && !error && mode === 'script' && (
                <span className={styles.resultType}> ({getResultTypeName(result)})</span>
              )}
            </span>
          </div>
          
          <OutputPanel 
            result={result}
            error={error}
            mode={mode}
            colorManager={colorManager}
          />
        </div>
      )}
    </div>
  );
}
