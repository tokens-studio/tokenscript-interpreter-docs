import { ColorManager, FunctionsManager } from '@tokens-studio/tokenscript-interpreter';
import type { FunctionSpecification } from '@tokens-studio/tokenscript-interpreter';

export function setupColorManager(schemas: Map<string, any>): ColorManager {
  const colorManager = new ColorManager();

  for (const [uri, spec] of schemas.entries()) {
    try {
      colorManager.register(uri, spec);
    } catch (error) {
      console.warn(`Failed to register color schema ${uri}:`, error);
    }
  }

  return colorManager;
}

export function setupFunctionsManager(schemas: Map<string, FunctionSpecification>): FunctionsManager {
  const functionsManager = new FunctionsManager();

  for (const [uri, spec] of schemas.entries()) {
    try {
      functionsManager.register(spec.keyword, spec);
    } catch (error) {
      console.warn(`Failed to register function schema ${uri}:`, error);
    }
  }

  return functionsManager;
}
