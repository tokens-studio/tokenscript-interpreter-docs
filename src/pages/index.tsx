import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";
import TokenScriptCodeBlock from "@site/src/components/TokenScriptCodeBlock";
import { COLOR_SCHEMAS, FUNCTION_SCHEMAS } from "@site/src/lib/schemas.generated";
import styles from "./index.module.css";

function HomepageHeader(): JSX.Element {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <span className={styles.heroBadge}>
          <span>TokenScript Interpreter</span>
        </span>
        <Heading as="h1" className={styles.heroTitle}>
          Design Token Logic,
          <br />
          Beautifully Automated
        </Heading>
        <p className={styles.heroSubtitle}>
          A language for design tokens with an embeddable interpreter.
          Build powerful token transformations with support for custom colors, units,
          and design system workflows.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/about/quick-start">
            Get Started
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
          Generate entire color palettes, spacing scales, or typographic systems.
        </p>
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col col--8">
            <TokenScriptCodeBlock 
              mode="script" 
              colorSchemas={COLOR_SCHEMAS}
              functionSchemas={FUNCTION_SCHEMAS}
            >
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
`}
            </TokenScriptCodeBlock>
          </div>
        </div>

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
      link: "/language/syntax",
    },
    {
      title: "Why TokenScript?",
      icon: "🔌",
      description:
        "Understand the problems TokenScript solves and when to use it in your design system workflow.",
      link: "/about/why-tokenscript",
    },
    {
      title: "Quick Start",
      icon: "⚡",
      description:
        "Get started with TokenScript in minutes. Install, write your first script, and start automating your token workflows.",
      link: "/about/quick-start",
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
                <Link to={feature.link}>Learn more</Link>
              </div>
            </div>
          ))}
        </div>
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
      </main>
    </Layout>
  );
}
