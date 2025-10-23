import React, { useEffect } from 'react';
import type { ColorManager } from '@tokens-studio/tokenscript-interpreter';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import styles from './styles.module.css';

// Tokenscript theme colors for JSON syntax highlighting
const tokenscriptThemeColors = {
  jsonString: '#22c55e',
  jsonNumber: '#3b82f6',
  jsonBoolean: '#f97316',
  jsonNull: '#8b5cf6',
  jsonProperty: '#60a5fa',
  jsonPunctuation: '#d1d5db',
};

// Type guards for interpreter symbols
interface BaseSymbol {
  type: string;
  value: any;
  toString(): string;
  getTypeName?(): string;
}

interface ColorSymbol extends BaseSymbol {
  type: 'Color';
  value: Record<string, any> | string;
  isHex?(): boolean;
}

interface ListSymbol extends BaseSymbol {
  type: 'List';
  elements: BaseSymbol[];
}

interface DictionarySymbol extends BaseSymbol {
  type: 'Dictionary';
  value: Map<string, BaseSymbol>;
}

function isColorSymbol(symbol: any): symbol is ColorSymbol {
  return symbol && typeof symbol === 'object' && symbol.type === 'Color';
}

function isListSymbol(symbol: any): symbol is ListSymbol {
  return symbol && typeof symbol === 'object' && symbol.type === 'List' && Array.isArray(symbol.elements);
}

function isDictionarySymbol(symbol: any): symbol is DictionarySymbol {
  return symbol && typeof symbol === 'object' && symbol.type === 'Dictionary' && symbol.value instanceof Map;
}

function isBaseSymbol(value: any): value is BaseSymbol {
  return value && typeof value === 'object' && 'type' in value && 'value' in value && typeof value.toString === 'function';
}

/**
 * Convert a color symbol to CSS color string
 */
const toCssColor = (color: ColorSymbol, colorManager: ColorManager): string | undefined => {
  // If it's a hex color, return directly
  if (color.isHex && color.isHex()) {
    return color.value as string;
  }
  
  try {
    // Try to convert to CssColor type
    const cssColor = colorManager.convertToByType(color, 'CssColor');
    // Navigate through the nested structure to get the actual CSS string
    if (cssColor && typeof cssColor === 'object' && 'value' in cssColor) {
      const val = (cssColor as any).value;
      if (val && typeof val === 'object' && 'value' in val) {
        const innerVal = val.value;
        if (innerVal && typeof innerVal === 'object' && 'value' in innerVal) {
          return String(innerVal.value);
        }
        return String(innerVal);
      }
      return String(val);
    }
    return undefined;
  } catch (error) {
    console.error('Error converting to css color:', error);
    return undefined;
  }
};

/**
 * Color output component - displays a color swatch with details
 */
const ColorOutput = ({ 
  color, 
  colorManager,
  compact = false 
}: { 
  color: ColorSymbol; 
  colorManager: ColorManager;
  compact?: boolean;
}) => {
  const cssColor = toCssColor(color, colorManager);
  const typeName = color.getTypeName ? color.getTypeName() : color.type;
  
  if (compact) {
    return (
      <div className={styles.colorOutputCompact}>
        <div 
          className={styles.colorSwatch}
          style={{ backgroundColor: cssColor }}
          title={`Color: ${cssColor}`}
        />
        <div className={styles.colorInfo}>
          <div className={styles.colorType}>{typeName}</div>
          {cssColor && <div className={styles.colorValue}>{cssColor}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.colorOutput}>
      <div className={styles.colorPreview}>
        <div 
          className={styles.colorSwatchLarge}
          style={{ backgroundColor: cssColor }}
          title={`Color: ${cssColor}`}
        />
        <div>
          <div className={styles.colorLabel}>Color Object</div>
          <div className={styles.colorTypeLabel}>Type: {typeName}</div>
        </div>
      </div>

      {(typeof color.value === 'object' && color.value !== null && Object.keys(color.value).length > 0) && (
        <div className={styles.colorProperties}>
          <div className={styles.propertiesLabel}>Properties</div>
          <div className={styles.propertiesContent}>
            {color.isHex && color.isHex() ? (
              <div className={styles.propertyRow}>
                <span className={styles.propertyValue}>{color.toString()}</span>
              </div>
            ) : (
              Object.entries(color.value).map(([key, value]) => (
                <div key={key} className={styles.propertyRow}>
                  <span className={styles.propertyKey}>{key}:</span>
                  <span className={styles.propertyValue}>{String(value)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * List output component
 */
const ListOutput = ({
  list,
  colorManager,
  compact = false,
}: {
  list: ListSymbol;
  colorManager: ColorManager;
  compact?: boolean;
}) => {
  if (list.elements.length === 0) {
    return (
      <div className={styles.emptyList}>
        Empty list
      </div>
    );
  }

  // Check if all elements are colors - if so, use grid layout
  const allColors = list.elements.every(element => isColorSymbol(element));

  if (allColors) {
    return (
      <div className={styles.colorGrid}>
        {list.elements.map((element, index) => {
          const color = element as ColorSymbol;
          const cssColor = toCssColor(color, colorManager);
          const typeName = color.getTypeName ? color.getTypeName() : color.type;
          return (
            <div 
              key={index}
              className={styles.colorTile}
              style={{ backgroundColor: cssColor }}
              title={`${typeName}: ${cssColor}`}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.listOutput}>
      <div className={styles.listItems}>
        {list.elements.map((element, index) => (
          <SymbolOutput
            key={index}
            symbol={element} 
            colorManager={colorManager} 
            compact={true}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Color tile for dictionary display - 2ch x 2ch with toString
 */
const DictionaryColorTile = ({ 
  color, 
  colorManager,
}: { 
  color: ColorSymbol; 
  colorManager: ColorManager;
}) => {
  const cssColor = toCssColor(color, colorManager);
  return (
    <div className={styles.dictionaryColorTile}>
      <div 
        className={styles.dictionaryColorSwatch}
        style={{ backgroundColor: cssColor }}
        title={`Color: ${cssColor}`}
      />
      <div className={styles.dictionaryColorValue}>{color.toString()}</div>
    </div>
  );
};

/**
 * Dictionary output component
 */
const DictionaryOutput = ({
  dictionary,
  colorManager,
}: {
  dictionary: DictionarySymbol;
  colorManager: ColorManager;
}) => {
  const entries = Array.from(dictionary.value.entries());
  
  if (entries.length === 0) {
    return (
      <div className={styles.emptyList}>
        Empty dictionary
      </div>
    );
  }

  return (
    <div className={styles.dictionaryOutput}>
      <div className={styles.dictionaryItems}>
        {entries.map(([key, value]) => (
          <div key={key} className={styles.dictionaryItem}>
            <span className={styles.dictionaryKey}>{key}:</span>

            {isColorSymbol(value) ? (
              <DictionaryColorTile color={value} colorManager={colorManager} />
            ) : (
              <SymbolOutput 
                symbol={value} 
                colorManager={colorManager} 
                compact={true}
              />
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * String/primitive output
 */
const StringOutput = ({ str, compact = false }: { str: string; compact?: boolean }) => {
  if (compact) {
    return (
      <div className={styles.stringOutputCompact}>
        <div>
          <div>{str}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stringOutput}>
      <pre>{str}</pre>
    </div>
  );
};

/**
 * Main symbol output router
 */
const SymbolOutput = ({
  symbol,
  colorManager,
  compact = false,
}: {
  symbol: BaseSymbol;
  colorManager: ColorManager;
  compact?: boolean;
}) => {
  if (isColorSymbol(symbol)) {
    return <ColorOutput color={symbol} colorManager={colorManager} compact={compact} />;
  }
  
  if (isListSymbol(symbol)) {
    return <ListOutput list={symbol} colorManager={colorManager} compact={compact} />;
  }
  
  if (isDictionarySymbol(symbol)) {
    return <DictionaryOutput dictionary={symbol} colorManager={colorManager} />;
  }

  // Default: treat as string
  return <StringOutput str={symbol.toString()} compact={compact} />;
};

/**
 * JSON output for design tokens mode
 */
const JsonOutput = ({ value }: { value: any }) => {
  const jsonString = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

  useEffect(() => {
    // Ensure theme colors are applied to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--tokenscript-json-string', tokenscriptThemeColors.jsonString);
    root.style.setProperty('--tokenscript-json-number', tokenscriptThemeColors.jsonNumber);
    root.style.setProperty('--tokenscript-json-boolean', tokenscriptThemeColors.jsonBoolean);
    root.style.setProperty('--tokenscript-json-null', tokenscriptThemeColors.jsonNull);
    root.style.setProperty('--tokenscript-json-property', tokenscriptThemeColors.jsonProperty);
    root.style.setProperty('--tokenscript-json-punctuation', tokenscriptThemeColors.jsonPunctuation);

    Prism.highlightAll();
  }, []);

  return (
    <div
      className="bg-gray-50 rounded p-3 text-sm font-mono overflow-auto"
      data-testid="json-output"
    >
      <pre className="whitespace-pre-wrap">
        <code className="language-json">{jsonString}</code>
      </pre>
    </div>
  );
};

/**
 * Main output panel component
 */
export interface OutputPanelProps {
  result: any;
  error: string | null;
  mode: 'json' | 'script';
  colorManager?: ColorManager;
}

export default function OutputPanel({ result, error, mode, colorManager }: OutputPanelProps) {
  if (error) {
    return (
      <div className={styles.outputError}>
        <strong>Error:</strong>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Script mode with interpreter symbols
  if (mode === 'script' && colorManager && isBaseSymbol(result)) {
    return (
      <div className={styles.outputContent}>
        <SymbolOutput symbol={result} colorManager={colorManager} />
      </div>
    );
  }

  // JSON mode or fallback
  return (
    <div className={styles.outputContent}>
      <JsonOutput value={result} />
    </div>
  );
}
