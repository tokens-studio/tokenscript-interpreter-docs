import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "TokenScript Documentation",
  tagline: "Design token logic with a statically-typed language",
  favicon: "img/favicon.svg",
  url: "https://tokens.studio",
  baseUrl: "/",
  organizationName: "tokens-studio",
  projectName: "tokenscript-docs",
  onBrokenLinks: "throw",
  trailingSlash: false,
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: false, // Disable the default docs plugin
        blog: false,
        pages: {
          path: "src/pages",
        },
        theme: {
          customCss: [
            "./src/css/custom.css",
            "./src/css/prism-tokenscript-theme.css",
          ],
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "about",
        path: "./docs-about",
        routeBasePath: "about",
        sidebarPath: "./sidebars-about.ts",
        editUrl: undefined,
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "language",
        path: "./docs-language",
        routeBasePath: "language",
        sidebarPath: "./sidebars-language.ts",
        editUrl: undefined,
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "cli",
        path: "./docs-cli",
        routeBasePath: "cli",
        sidebarPath: "./sidebars-cli.ts",
        editUrl: undefined,
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "api",
        path: "./docs-api",
        routeBasePath: "api",
        sidebarPath: "./sidebars-api.ts",
        editUrl: undefined,
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "extensions",
        path: "./docs-extensions",
        routeBasePath: "extensions",
        sidebarPath: "./sidebars-extensions.ts",
        editUrl: undefined,
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "TokenScript",
      hideOnScroll: false,
      items: [
        {
          type: "doc",
          docId: "why-tokenscript",
          docsPluginId: "about",
          position: "left",
          label: "About",
        },
        {
          type: "doc",
          docId: "syntax",
          docsPluginId: "language",
          position: "left",
          label: "Language",
        },
        {
          type: "doc",
          docId: "overview",
          docsPluginId: "cli",
          position: "left",
          label: "CLI",
        },
        {
          type: "doc",
          docId: "getting-started",
          docsPluginId: "api",
          position: "left",
          label: "API",
        },
        {
          type: "doc",
          docId: "overview",
          docsPluginId: "extensions",
          position: "left",
          label: "Extensions",
        },
        {
          href: "https://github.com/tokens-studio/tokenscript",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Getting Started",
          items: [
            {
              label: "Why TokenScript",
              to: "/about/why-tokenscript",
            },
            {
              label: "Quick Start",
              to: "/about/quick-start",
            },
          ],
        },
        {
          title: "Learn",
          items: [
            {
              label: "Language Reference",
              to: "/language/syntax",
            },
            {
              label: "CLI Commands",
              to: "/cli/commands",
            },
          ],
        },
        {
          title: "Integrate",
          items: [
            {
              label: "API Guide",
              to: "/api/getting-started",
            },
            {
              label: "Extensions",
              to: "/extensions/color-schemas",
            },
            {
              label: "GitHub",
              href: "https://github.com/tokens-studio/tokenscript",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tokens Studio. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ["tokenscript"],
      theme: {
        plain: {
          color: "#e2e8f0",
          backgroundColor: "#0f172a",
        },
        styles: [
          {
            types: ["comment", "prolog", "doctype", "cdata"],
            style: {
              color: "#64748b",
              fontStyle: "italic",
            },
          },
          {
            types: ["namespace"],
            style: {
              opacity: 0.7,
            },
          },
          {
            types: ["string", "attr-value"],
            style: {
              color: "#7dd3fc",
            },
          },
          {
            types: ["punctuation", "operator"],
            style: {
              color: "#cbd5e1",
            },
          },
          {
            types: [
              "entity",
              "url",
              "symbol",
              "number",
              "boolean",
              "variable",
              "constant",
              "property",
              "regex",
              "inserted",
            ],
            style: {
              color: "#a5f3fc",
            },
          },
          {
            types: ["atrule", "keyword", "attr-name", "selector"],
            style: {
              color: "#c084fc",
            },
          },
          {
            types: ["function", "deleted", "tag"],
            style: {
              color: "#f472b6",
            },
          },
          {
            types: ["function-variable"],
            style: {
              color: "#818cf8",
            },
          },
          {
            types: ["tag", "selector", "keyword"],
            style: {
              color: "#818cf8",
            },
          },
        ],
      },
      darkTheme: {
        plain: {
          color: "#e2e8f0",
          backgroundColor: "#0f172a",
        },
        styles: [
          {
            types: ["comment", "prolog", "doctype", "cdata"],
            style: {
              color: "#64748b",
              fontStyle: "italic",
            },
          },
          {
            types: ["namespace"],
            style: {
              opacity: 0.7,
            },
          },
          {
            types: ["string", "attr-value"],
            style: {
              color: "#7dd3fc",
            },
          },
          {
            types: ["punctuation", "operator"],
            style: {
              color: "#cbd5e1",
            },
          },
          {
            types: [
              "entity",
              "url",
              "symbol",
              "number",
              "boolean",
              "variable",
              "constant",
              "property",
              "regex",
              "inserted",
            ],
            style: {
              color: "#a5f3fc",
            },
          },
          {
            types: ["atrule", "keyword", "attr-name", "selector"],
            style: {
              color: "#c084fc",
            },
          },
          {
            types: ["function", "deleted", "tag"],
            style: {
              color: "#f472b6",
            },
          },
          {
            types: ["function-variable"],
            style: {
              color: "#818cf8",
            },
          },
          {
            types: ["tag", "selector", "keyword"],
            style: {
              color: "#818cf8",
            },
          },
        ],
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
