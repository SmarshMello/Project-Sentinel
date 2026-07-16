import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './donate.module.css';

const supportAreas = [
  {
    number: '01',
    title: 'Sentinel Intelligence',
    body: 'Keep dependency mapping, build verification, Doctor integration, and compatibility tools moving forward.',
  },
  {
    number: '02',
    title: 'Watcher research',
    body: 'Expand monitored sources, improve release detection, and review new or changed LSPDFR projects.',
  },
  {
    number: '03',
    title: 'Testing and documentation',
    body: 'Support compatibility checks, installation guidance, troubleshooting research, and Golden Build maintenance.',
  },
  {
    number: '04',
    title: 'Hosting and infrastructure',
    body: 'Help cover the services and tooling used to keep Project Sentinel available, searchable, and reliable.',
  },
];

function DonateButton({href, children}) {
  if (!href) {
    return (
      <span className={styles.disabledButton} aria-disabled="true">
        Donation link coming soon
      </span>
    );
  }

  return (
    <a
      className={styles.donateButton}
      href={href}
      target="_blank"
      rel="noopener noreferrer external"
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export default function Donate() {
  const {siteConfig} = useDocusaurusContext();
  const donationUrl = siteConfig.customFields.kofiUrl;

  return (
    <Layout
      title="Support Project Sentinel"
      description="Support continued Project Sentinel development, research, testing, and public documentation."
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <span className={styles.eyebrow}>Support the mission</span>
                <Heading as="h1">Help keep Project Sentinel growing.</Heading>
                <p className={styles.lead}>
                  Project Sentinel is free and will remain free. If the site has saved you time,
                  helped stabilize your LSPDFR build, or made troubleshooting easier, your support
                  helps keep research, testing, fixes, and new updates moving forward.
                </p>
                <div className={styles.actions}>
                  <DonateButton href={donationUrl}>Donate to Project Sentinel</DonateButton>
                  <Link className={styles.secondaryButton} to="/intelligence">
                    Explore Sentinel Intelligence
                  </Link>
                </div>
                <p className={styles.providerNote}>
                  Donations are handled securely through Ko-fi. Project Sentinel never receives or
                  stores your card, bank, or payment-account details.
                </p>
              </div>

              <aside className={styles.appreciationCard}>
                <span className={styles.cardLabel}>A message from the project</span>
                <Heading as="h2">Every contribution means a lot.</Heading>
                <p>
                  Project Sentinel is built and maintained in my free time. Any amount of support
                  helps me spend more time improving the website, expanding Watcher coverage,
                  researching compatibility, and creating tools that make LSPDFR easier to build and maintain.
                </p>
                <div className={styles.promise}>
                  <strong>My commitment</strong>
                  <span>Keep the project public, practical, transparent, and focused on the community.</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.supportSection}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>Where support goes</span>
              <Heading as="h2">Help fund the next round of updates.</Heading>
              <p>
                Donations are not required to use Project Sentinel. They simply help sustain the work
                behind the project and make continued development easier.
              </p>
            </div>

            <div className={styles.supportGrid}>
              {supportAreas.map((area) => (
                <article className={styles.supportCard} key={area.number}>
                  <span className={styles.supportNumber}>{area.number}</span>
                  <Heading as="h3">{area.title}</Heading>
                  <p>{area.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.communitySection}>
          <div className="container">
            <div className={styles.communityCard}>
              <div>
                <span className={styles.eyebrow}>Support without donating</span>
                <Heading as="h2">There are plenty of other ways to help.</Heading>
                <p>
                  Starring the repository, sharing Project Sentinel, reporting a bug, or suggesting
                  a useful feature all help the project reach more players and improve faster.
                </p>
              </div>
              <div className={styles.communityLinks}>
                <a
                  href="https://github.com/SmarshMello/Project-Sentinel"
                  target="_blank"
                  rel="noopener noreferrer external"
                >
                  Star on GitHub <span aria-hidden="true">↗</span>
                </a>
                <Link to="/help">Report a problem</Link>
                <a
                  href="https://github.com/SmarshMello/Project-Sentinel/issues/new?template=suggestion.yml"
                  target="_blank"
                  rel="noopener noreferrer external"
                >
                  Suggest a feature <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className="container">
            <div className={styles.finalCtaInner}>
              <div>
                <span className={styles.eyebrow}>Thank you</span>
                <Heading as="h2">Thank you for helping Project Sentinel move forward.</Heading>
                <p>
                  Whether you donate, contribute research, report a bug, or simply use and share the
                  website, you are helping build a better resource for the LSPDFR community.
                </p>
              </div>
              <DonateButton href={donationUrl}>Support the next update</DonateButton>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
