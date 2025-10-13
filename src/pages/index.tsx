import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
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
          <Link className="button button--secondary button--lg" to="/docs/guides/quickstart">
            Get Started
          </Link>
          <Link className="button button--outline button--lg" to="/docs/spec/overview">
            Read the Docs
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeaturesSection(): JSX.Element {
  const features = [
    {
      title: "Language Specification",
      icon: "📖",
      description:
        "Complete reference for syntax, types, control flow, and functions. Learn how the interpreter executes your token logic.",
      link: "/docs/spec/overview",
    },
    {
      title: "Integration Guides",
      icon: "🔌",
      description:
        "Embed the interpreter in your design system pipelines. Resolve token sets and automate transformations in CI/CD.",
      link: "/docs/integrator/getting-started",
    },
    {
      title: "Extensible Runtime",
      icon: "⚡",
      description:
        "Register custom color spaces, units, and functions without forking. Ship product-specific extensions in pure JSON.",
      link: "/docs/extensions/color-schemas",
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
          Explore our quickstart guide and start automating your design token workflows in minutes.
        </p>
        <Link className="button button--lg" to="/docs/guides/quickstart">
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
        <FeaturesSection />
        <ValuePropsSection />
        <CTASection />
      </main>
    </Layout>
  );
}
