// TokenScript language definition for Prism.js
// Based on the Monaco editor language definition from web-repl

export default function tokenscriptLanguage(Prism) {
  Prism.languages.tokenscript = {
    'comment': {
      pattern: /\/\/.*/,
      greedy: true
    },
    'string': {
      pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
      greedy: true
    },
    'reference': {
      pattern: /\{[^}]+\}/,
      greedy: true,
      alias: 'variable'
    },
    'hex-color': {
      pattern: /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/,
      alias: 'number'
    },
    'number-with-unit': {
      pattern: /\b\d+(?:\.\d+)?(?:px|em|rem|vh|vw|%|pt|in|cm|mm|deg|rad|turn)\b/,
      alias: 'number'
    },
    'number': {
      pattern: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/
    },
    'keyword': {
      pattern: /\b(?:variable|if|else|elif|while|for|return|true|false|null|undefined)\b/
    },
    'type': {
      pattern: /\b(?:String|Number|NumberWithUnit|Color|List|Dictionary|Boolean)\b/,
      alias: 'class-name'
    },
    'color-type': {
      pattern: /\bColor\.(?:Hex|Rgb|Rgba|Hsl|Hsla|Srgb|Lrgb|Oklch)\b/,
      alias: 'class-name'
    },
    'function': {
      pattern: /\b(?:rgb|rgba|hsl|hsla|srgb|lrgb|hex|oklch|oklchRamp|lighten|darken|saturate|desaturate|spin|mix|roundTo|snap|remap|pow|contrastColor|relativeDarken|hslRamp|linear-gradient|type)\b(?=\()/
    },
    'method': {
      pattern: /\.\w+(?=\()/,
      inside: {
        'punctuation': /\./
      }
    },
    'property': {
      pattern: /\.\w+\b(?!\()/,
      inside: {
        'punctuation': /\./
      }
    },
    'operator': /[+\-*/%=<>!&|^~?:]+/,
    'punctuation': /[{}[\]();,.:]/
  };

  // Add tokenscript as an alias for ts
  Prism.languages.ts = Prism.languages.tokenscript;
  
  return Prism.languages.tokenscript;
}
