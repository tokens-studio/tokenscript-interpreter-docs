import React from 'react';
import TokenScriptCodeBlock from './index';

interface LiveCodeBlockProps {
  children: string;
  className?: string;
  live?: boolean;
}

/**
 * Wrapper component that can be used with MDX code blocks
 * 
 * Usage in MDX:
 * ```tokenscript live
 * {
 *   "primary-color": {
 *     "$value": "#ff6b35",
 *     "$type": "color"
 *   }
 * }
 * ```
 */
export default function LiveCodeBlock({ 
  children, 
  className, 
  live = false 
}: LiveCodeBlockProps) {
  // Check if this is a tokenscript code block with live attribute
  const isTokenScriptLive = className?.includes('language-tokenscript') && live;
  
  if (!isTokenScriptLive) {
    // Return standard code block
    return (
      <pre className={className}>
        <code>{children}</code>
      </pre>
    );
  }

  // Return live executable code block
  return <TokenScriptCodeBlock code={children.trim()} />;
}
