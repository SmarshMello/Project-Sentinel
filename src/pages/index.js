import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import MissionControl from '@site/src/components/MissionControl';
import {platformState} from '@site/src/data/platform';
import styles from './index.module.css';

const paths = [
  {label:'Recommended first step',title:'Choose your build',text:'Compare the free modern build, the paid maximum-realism build, and the separate legacy alternative.',to:'/guide/builds/choose-your-build',action:'Compare builds'},
  {label:'New installer',title:'Start from a clean game',text:'Set up GTA V Legacy, backups, folders, core loaders, and your first known-good checkpoint.',to:'/guide/getting-started/clean-install',action:'Begin installation'},
  {label:'Existing build',title:'Check compatibility',text:'Review framework conflicts, dependencies, versions, and supported architecture before adding a mod.',to:'/compatibility',action:'Check compatibility'},
];

const workflow = [
  ['01','Prepare','Confirm Legacy, create backups, and identify the GTA root folder.','/guide/getting-started/clean-install'],
  ['02','Install','Add one dependency layer at a time in the documented order.','/guide/intro'],
  ['03','Test','Pass a real in-game test gate before adding the next system.','/checklist'],
  ['04','Maintain','Monitor title updates, mod releases, and compatibility changes.','/watcher'],
  ['05','Recover','Use logs and guided diagnostics instead of random reinstalls.','/doctor'],
];

export default function Home(){
  return <Layout title="Mission Control" description="Build, verify, and maintain a stable GTA V Legacy LSPDFR installation.">
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.kicker}>PROJECT SENTINEL // GTA V LEGACY LSPDFR</div>
              <Heading as="h1">A clear path from a clean game to a stable police simulator.</Heading>
              <p>Beginner-first installation guides, verified build paths, compatibility research, and troubleshooting tools—organized as one controlled system.</p>
              <div className={styles.heroActions}>
                <Link className="button button--primary button--lg" to="/guide/builds/choose-your-build">Choose your build</Link>
                <Link className="button button--secondary button--lg" to="/guide/getting-started/clean-install">Start from scratch</Link>
              </div>
            </div>
            <aside className={styles.platformCard}>
              <span>Current candidate platform</span>
              <strong>GTA Legacy {platformState.current.gameBuild}</strong>
              <dl>
                <div><dt>LSPDFR</dt><dd>{platformState.current.lspdfr}</dd></div>
                <div><dt>RAGE Plugin Hook</dt><dd>{platformState.current.rph}</dd></div>
                <div><dt>Guide paths</dt><dd>Free + Paid</dd></div>
                <div><dt>Method</dt><dd>Install → test → back up</dd></div>
              </dl>
              <Link to="/dashboard">View platform status →</Link>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.paths}>
        <div className="container">
          <div className={styles.sectionHead}><div><span>START WITH YOUR SITUATION</span><Heading as="h2">One site, three clear entry points.</Heading></div><p>You should never need to guess which page comes first.</p></div>
          <div className={styles.pathGrid}>{paths.map(path=><Link className={styles.pathCard} to={path.to} key={path.title}><small>{path.label}</small><Heading as="h3">{path.title}</Heading><p>{path.text}</p><b>{path.action} →</b></Link>)}</div>
        </div>
      </section>

      <section className={styles.workflow}>
        <div className="container">
          <div className={styles.sectionHead}><div><span>THE SENTINEL METHOD</span><Heading as="h2">A repeatable five-stage workflow.</Heading></div><Link to="/guide/intro">Open the complete guide →</Link></div>
          <div className={styles.steps}>{workflow.map(item=><Link key={item[0]} to={item[4]}><b>{item[0]}</b><strong>{item[1]}</strong><span>{item[2]}</span></Link>)}</div>
        </div>
      </section>

      <section className={styles.operations}>
        <div className="container">
          <div className={styles.sectionHead}><div><span>LIVE OPERATIONS</span><Heading as="h2">Research and health at a glance.</Heading></div><p>Use these tools after you understand your build path.</p></div>
          <MissionControl/>
        </div>
      </section>
    </main>
  </Layout>
}
