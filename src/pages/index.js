import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import MissionControl from '@site/src/components/MissionControl';
import styles from './index.module.css';

export default function Home(){
  return <Layout title="Mission Control" description="Live operations center for Project Sentinel and the GTA V Legacy LSPDFR ecosystem.">
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.kicker}>PROJECT SENTINEL 5.0 // MISSION CONTROL</div>
          <Heading as="h1">The operating system for a stable LSPDFR build.</Heading>
          <p>One command center connecting ecosystem monitoring, verified installation guidance, compatibility intelligence and troubleshooting.</p>
          <div className={styles.heroActions}><Link className="button button--primary button--lg" to="/sentinel-police">Build Sentinel Police</Link><Link className="button button--secondary button--lg" to="/watcher">Run Watcher</Link></div>
        </div>
      </section>
      <section className={styles.mission}><div className="container"><MissionControl/></div></section>
      <section className={styles.foundation}><div className="container"><div className={styles.foundationHead}><div><span>CONTROLLED BUILD SYSTEM</span><Heading as="h2">From clean install to verified patrol.</Heading></div><Link to="/guide/intro">Open the master guide →</Link></div><div className={styles.steps}>{[
        ['01','Foundation','Backups, core loaders, limits and a clean Legacy baseline.','/guide/getting-started/clean-install'],
        ['02','Build','Install police systems in a controlled dependency order.','/sentinel-police'],
        ['03','Validate','Use compatibility checks, gates and the installation checklist.','/compatibility'],
        ['04','Operate','Monitor releases and ecosystem health every day.','/watcher'],
        ['05','Recover','Diagnose crashes with Sentinel Doctor and troubleshooting tools.','/doctor'],
      ].map(x=><Link key={x[0]} to={x[4]}><b>{x[0]}</b><strong>{x[1]}</strong><span>{x[2]}</span></Link>)}</div></div></section>
    </main>
  </Layout>
}
