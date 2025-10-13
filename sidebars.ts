import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsible: true,
      collapsed: false,
      items: [
        "guides/quickstart",
        "guides/language-recipes",
        "guides/integration-examples",
        "guides/playground",
      ],
    },
    {
      type: "category",
      label: "Language Specification",
      collapsible: true,
      collapsed: false,
      items: [
        "spec/overview",
        "spec/syntax",
        "spec/types",
        "spec/control-flow",
        "spec/functions",
        "spec/errors",
        "spec/grammar",
      ],
    },
    {
      type: "category",
      label: "Integrator Guides",
      collapsible: true,
      collapsed: true,
      items: [
        "integrator/getting-started",
        "integrator/tokenset-resolution",
        "integrator/configuration",
        "integrator/performance-debugging",
        "integrator/compliance",
      ],
    },
    {
      type: "category",
      label: "Extensions",
      collapsible: true,
      collapsed: true,
      items: [
        "extensions/color-schemas",
        "extensions/unit-schemas",
        "extensions/functions",
        "extensions/testing",
      ],
    },
    {
      type: "category",
      label: "CLI Reference",
      collapsible: true,
      collapsed: true,
      items: ["cli/commands", "cli/recipes", "cli/automation"],
    },
    {
      type: "category",
      label: "Reference",
      collapsible: true,
      collapsed: true,
      items: ["guides/example-inventory"],
    },
  ],
};

export default sidebars;
