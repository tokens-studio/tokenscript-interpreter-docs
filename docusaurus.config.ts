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
  onBrokenMarkdownLinks: "warn",
  trailingSlash: false,
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          path: "./docs",
          routeBasePath: "docs",
          sidebarPath: "./sidebars.ts",
          editUrl: undefined,
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false,
        pages: {
          path: "src/pages",
        },
        theme: {
          customCss: ["./src/css/custom.css", "./src/css/prism-tokenscript-theme.css"],
        },
      } satisfies Preset.Options,
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
          docId: "guides/quickstart",
          position: "left",
          label: "Documentation",
        },
        {
          to: "/docs/guides/quickstart",
          label: "Quickstart",
          position: "left",
          activeBasePath: "/docs/guides/quickstart",
        },
        {
          to: "/docs/spec/overview",
          label: "Spec",
          position: "left",
          activeBasePath: "/docs/spec",
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
          title: "Documentation",
          items: [
            {
              label: "Getting Started",
              to: "/docs/guides/quickstart",
            },
            {
              label: "Language Spec",
              to: "/docs/spec/overview",
            },
            {
              label: "Integration Guide",
              to: "/docs/integrator/getting-started",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "CLI Commands",
              to: "/docs/cli/commands",
            },
            {
              label: "Extensions",
              to: "/docs/extensions/color-schemas",
            },
            {
              label: "Changelog",
              to: "/docs/changelog",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/tokens-studio/tokenscript",
            },
            {
              label: "Tokens Studio",
              href: "https://tokens.studio",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tokens Studio. Built with Docusaurus.`,
    },
    prism: {
      additionalLanguages: ['tokenscript'],
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
            types: ["entity", "url", "symbol", "number", "boolean", "variable", "constant", "property", "regex", "inserted"],
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
            types: ["entity", "url", "symbol", "number", "boolean", "variable", "constant", "property", "regex", "inserted"],
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
