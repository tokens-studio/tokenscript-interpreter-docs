import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import tokenscriptLanguage from './prism-tokenscript';

const prismIncludeLanguages = (PrismObject) => {
  // Always register tokenscript language (works in both SSR and browser)
  tokenscriptLanguage(PrismObject);
  
  if (ExecutionEnvironment.canUseDOM) {
    // Handle additional languages from config
    try {
      const siteConfig = require('@generated/docusaurus.config').default;
      const prismConfig = siteConfig?.themeConfig?.prism || {};
      const additionalLanguages = prismConfig.additionalLanguages || [];

      // Prism components work on the Prism instance on the window, while prism-
      // react-renderer uses its own Prism instance. We temporarily mount the
      // instance onto window, import components to enhance it, then remove it to
      // avoid polluting global namespace.
      globalThis.Prism = PrismObject;

      additionalLanguages.forEach((lang) => {
        if (lang === 'tokenscript') {
          // Already registered above
          return;
        }
        try {
          // eslint-disable-next-line
          require(`prismjs/components/prism-${lang}`);
        } catch (e) {
          console.warn(`Failed to load Prism language: ${lang}`, e);
        }
      });

      delete globalThis.Prism;
    } catch (e) {
      console.warn('Failed to load additional Prism languages', e);
    }
  }
};

export default prismIncludeLanguages;
