import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";
import styles from "./index.module.css";

function HomepageHeader(): JSX.Element {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <span className={styles.heroBadge}>
          <span>🚀</span>
          <span>TokenScript Interpreter</span>
        </span>
        <Heading as="h1" className={styles.heroTitle}>
          Design Token Logic,
          <br />
          Beautifully Automated
        </Heading>
        <p className={styles.heroSubtitle}>
          A statically-typed language for design tokens with an embeddable interpreter.
          Build powerful token transformations with first-class support for colors, units,
          and design system workflows.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/intro/quick-start">
            Get Started
          </Link>
          <Link className="button button--outline button--lg" to="/intro/why-tokenscript">
            Why TokenScript?
          </Link>
        </div>
      </div>
    </header>
  );
}

function CodeExampleSection(): JSX.Element {
  return (
    <section style={{ padding: "4rem 0", background: "var(--ifm-background-surface-color)" }}>
      <div className="container">
        <Heading as="h2" style={{ textAlign: "center", marginBottom: "1rem" }}>
          Generate Design Systems Programmatically
        </Heading>
        <p style={{ textAlign: "center", color: "var(--ifm-color-emphasis-600)", marginBottom: "3rem", fontSize: "1rem" }}>
          Write logic once. Generate entire color palettes, spacing scales, or typographic systems.
        </p>
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col col--8">
            <CodeBlock language="tokenscript">
{`// Generate a 9-step color ramp from a brand color
variable brand: Color = #3B82F6;
variable brandHsl: Color.Hsl = brand.to.hsl();
variable ramp: List;
variable step: Number = 1;
variable stepValue: Number;
variable lightness: Number;
variable key: String;

while (step <= 9) [
  stepValue = step * 100;
  lightness = 95 - (step * 10);
  key = "blue-".concat(stepValue.to_string());
  ramp = ramp.append(hsl(brandHsl.h, brandHsl.s, lightness));
  step = step + 1;
]

return ramp;
// Generates: 9 perfectly balanced color values from light to dark`}
            </CodeBlock>
          </div>
        </div>
        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.875rem", color: "var(--ifm-color-emphasis-600)" }}>
          Change the brand color. The entire ramp regenerates automatically.
        </p>
      </div>
    </section>
  );
}

function FeaturesSection(): JSX.Element {
  const features = [
    {
      title: "Language Specification",
      icon: "📖",
      description:
        "Complete reference for syntax, types, control flow, and functions. Learn how the interpreter executes your token logic.",
      link: "/language/overview",
    },
    {
      title: "Integration Guides",
      icon: "🔌",
      description:
        "Embed the interpreter in your design system pipelines. Resolve token sets and automate transformations in CI/CD.",
      link: "/api/getting-started",
    },
    {
      title: "Extensible Runtime",
      icon: "⚡",
      description:
        "Register custom color spaces, units, and functions without forking. Ship product-specific extensions in pure JSON.",
      link: "/extensions/overview",
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Everything You Need
        </Heading>
        <p className={styles.sectionSubtitle}>
          From language basics to production deployment, we've got you covered.
        </p>
        <div className="row">
          {features.map((feature, idx) => (
            <div key={idx} className="col col--4">
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <Heading as="h3">{feature.title}</Heading>
                <p>{feature.description}</p>
                <Link to={feature.link}>Learn more →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuePropsSection(): JSX.Element {
  const valueProps = [
    {
      title: "Design-Native Language",
      items: [
        "First-class colors, units, lists, dictionaries, and references",
        "Deterministic evaluation with strong typing",
        "Method chaining for elegant transformations",
      ],
    },
    {
      title: "Production-Ready Tooling",
      items: [
        "CLI commands for parsing, validation, and compliance",
        "Performance instrumentation and debugging",
        "Token set resolution with dependency graphs",
      ],
    },
    {
      title: "Flexible Architecture",
      items: [
        "Register custom functions and color spaces in JSON",
        "Clone and compose interpreter configurations",
        "Safely embed in any JavaScript environment",
      ],
    },
  ];

  return (
    <section className={styles.valueSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Why TokenScript?
        </Heading>
        <p className={styles.sectionSubtitle}>
          Built specifically for design token workflows with modern teams in mind.
        </p>
        <div className="row">
          {valueProps.map((prop, idx) => (
            <div key={idx} className="col col--4">
              <div className={styles.valueCard}>
                <Heading as="h3">{prop.title}</Heading>
                <ul>
                  {prop.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection(): JSX.Element {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <Heading as="h2">Ready to Get Started?</Heading>
        <p>
          Explore our quickstart guide and start automating your design token workflows in 5 minutes.
        </p>
        <Link className="button button--lg" to="/intro/quick-start">
          Get Started Now
        </Link>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Home"
      description="Design token logic with a statically-typed language and embeddable interpreter"
    >
      <HomepageHeader />
      <main>
        <CodeExampleSection />
        <FeaturesSection />
        <ValuePropsSection />
        <CTASection />
      </main>
    </Layout>
  );
}
