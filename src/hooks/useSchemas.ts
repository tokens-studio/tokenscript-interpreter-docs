import { useState, useEffect } from 'react';

interface SchemaCache {
  colorSchemas: Map<string, any>;
  functionSchemas: Map<string, any>;
  loaded: boolean;
}

const cache: SchemaCache = {
  colorSchemas: new Map(),
  functionSchemas: new Map(),
  loaded: false,
};

const SCHEMA_BASE_URL = 'https://schema.tokenscript.dev.gcp.tokens.studio/api/v1/schema';

// Common schemas we want to load
const COLOR_SCHEMA_SLUGS = [
  'hsl-color',
  'rgb-color',
  'hex-color',
  'srgb-color',
];

export function useSchemas() {
  const [schemas, setSchemas] = useState<SchemaCache>(cache);
  const [loading, setLoading] = useState(!cache.loaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cache.loaded) {
      setSchemas(cache);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchSchemas() {
      try {
        const colorSchemas = new Map<string, any>();
        
        // Fetch color schemas
        for (const slug of COLOR_SCHEMA_SLUGS) {
          try {
            const url = `${SCHEMA_BASE_URL}/${slug}`;
            const response = await fetch(`${url}/latest?format=json`);
            
            if (response.ok) {
              const data = await response.json();
              if (data.content) {
                // Use versioned URL as key
                const versionedUrl = `${url}/${data.version || '0'}/`;
                colorSchemas.set(versionedUrl, data.content);
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch schema ${slug}:`, err);
          }
        }

        if (!cancelled) {
          cache.colorSchemas = colorSchemas;
          cache.functionSchemas = new Map(); // TODO: Add function schemas
          cache.loaded = true;
          
          setSchemas({ ...cache });
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    }

    fetchSchemas();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    colorSchemas: schemas.colorSchemas,
    functionSchemas: schemas.functionSchemas,
    loading,
    error,
  };
}
