import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  languageSidebar: [
    {
      type: "html",
      value:
        '<div style="margin-top: 1rem; padding: 0.5rem 0.75rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ifm-color-emphasis-600);">Reference</div>',
      defaultStyle: false,
    },
    "overview",
    "syntax",
    "types",
    "control-flow",
    "functions",
    "errors",
    "grammar",
  ],
};

export default sidebars;
