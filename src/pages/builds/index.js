import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import StatusPill from '@site/src/components/StatusPill';
import SentinelIcon from '@site/src/components/SentinelIcon';
import {buildStatus, goldenBuilds} from '@site/src/data/builds';
import styles from './styles.module.css';

function BuildCard({build}) {
  const status = buildStatus[build.status];
  return (
    <article className={styles.buildCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.release}>{build.release}</span>
          <Heading as="h2">{build.name}</Heading>
          <p>{build.summary}</p>
        </div>
        <StatusPill tone={status.tone}>{status.label}</StatusPill>
      </div>

      <div className={styles.confidenceRow}>
        <span>Verification confidence</span>
        <strong>{build.confidence}%</strong>
      </div>
      <div className={styles.confidenceTrack}><span style={{width: `${build.confidence}%`}} /></div>

      <div className={styles.columns}>
        <section>
          <Heading as="h3">Core versions</Heading>
          <dl className={styles.versionList}>
            {build.versions.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </section>
        <section>
          <Heading as="h3">Verified components</Heading>
          <ul className={styles.checkList}>
            {build.verified.map(item => <li key={item}><SentinelIcon name="check" size={17}/>{item}</li>)}
          </ul>
        </section>
      </div>

      <div className={styles.notes}>
        <Heading as="h3">Build rules</Heading>
        <ul>{build.notes.map(item => <li key={item}>{item}</li>)}</ul>
      </div>

      <Link className={styles.openButton} to={build.guide}>
        Open complete build guide <SentinelIcon name="chevron" size={18}/>
      </Link>
    </article>
  );
}

export default function GoldenBuildsPage() {
  return (
    <Layout title="Golden Builds" description="Reproducible, version-locked Project Sentinel LSPDFR builds.">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.grid}/>
          <div className="container">
            <div className={styles.eyebrow}><span/> CONTROLLED RELEASE ARCHIVE</div>
            <div className={styles.heroLayout}>
              <div>
                <Heading as="h1">Golden Builds.</Heading>
                <p>Known-good LSPDFR checkpoints with exact versions, verified components, operating rules and recovery guidance.</p>
              </div>
              <div className={styles.heroStat}>
                <SentinelIcon name="star" size={34}/>
                <strong>{goldenBuilds.length}</strong>
                <span>Reproducible build</span>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.explainer}>
          <div className="container">
            <div><strong>Version locked</strong><span>Every core dependency is recorded.</span></div>
            <div><strong>Personally tested</strong><span>Only proven combinations receive this badge.</span></div>
            <div><strong>Recoverable</strong><span>Backup points prevent full reinstalls.</span></div>
          </div>
        </section>

        <section className={styles.buildSection}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <div><span>ACTIVE ARCHIVE</span><Heading as="h2">Current verified releases</Heading></div>
              <p>A Golden Build is a controlled baseline, not a random mod list. Additions are tested against it one layer at a time.</p>
            </div>
            <div className={styles.buildGrid}>
              {goldenBuilds.map(build => <BuildCard key={build.id} build={build}/>) }
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
