import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const Icon = ({name}) => {
  const icons = {
    shield: <><path d="M12 2.7 19 5.5v5.8c0 4.5-2.9 8.6-7 10-4.1-1.4-7-5.5-7-10V5.5L12 2.7Z"/><path d="m8.8 12 2 2 4.5-4.7"/></>,
    book: <><path d="M4 4.5h5.2A2.8 2.8 0 0 1 12 7.3V21a3.5 3.5 0 0 0-3.5-3.5H4Z"/><path d="M20 4.5h-5.2A2.8 2.8 0 0 0 12 7.3V21a3.5 3.5 0 0 1 3.5-3.5H20Z"/></>,
    wrench: <><path d="M14.7 6.3a5 5 0 0 0-6.5 6.5L3 18l3 3 5.2-5.2a5 5 0 0 0 6.5-6.5l-3.2 3.2-3-3Z"/></>,
    gauge: <><path d="M4.2 18a8.5 8.5 0 1 1 15.6 0"/><path d="m12 14 4-4"/><path d="M7 18h10"/></>,
    flask: <><path d="M9 3h6"/><path d="M10 3v6l-5 8.3A2.4 2.4 0 0 0 7 21h10a2.4 2.4 0 0 0 2-3.7L14 9V3"/><path d="M7.5 16h9"/></>,
    package: <><path d="m12 2.8 8 4.4v9.6l-8 4.4-8-4.4V7.2Z"/><path d="m4.4 7.4 7.6 4.2 7.6-4.2M12 11.6v9.2"/></>,
    radio: <><rect x="5" y="7" width="14" height="14" rx="2"/><path d="m8 7 7-4M9 12h6M9 16h3M16 16h.01"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>,
  };
  return <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};

const features = [
  {icon:'shield', title:'Stable builds', text:'Version-matched combinations designed to launch, load and patrol reliably.', badge:'VERIFIED'},
  {icon:'book', title:'Exact documentation', text:'Every dependency, folder path, configuration edit and test gate explained.', badge:'DOCUMENTED'},
  {icon:'wrench', title:'Real troubleshooting', text:'Symptom-first fixes built from actual logs, crashes and installation mistakes.', badge:'FIELD TESTED'},
  {icon:'gauge', title:'Performance focused', text:'Maximum realism without sacrificing the frame rate and stability a patrol needs.', badge:'OPTIMIZED'},
  {icon:'flask', title:'Testing laboratory', text:'New plugins enter testing before they ever receive a recommendation.', badge:'CONTROLLED'},
  {icon:'package', title:'Golden builds', text:'Reproducible snapshots with known versions, settings and rollback points.', badge:'REPEATABLE'},
];

const roadmap = [
  {name:'Foundation', detail:'Core loaders, limits and backups', value:100, state:'Verified'},
  {name:'Core police', detail:'Stops, backup, MDT and ALPR', value:100, state:'Verified'},
  {name:'Uniforms', detail:'EUP, agencies and presentation', value:85, state:'In progress'},
  {name:'Communications', detail:'Dispatch, radio and voice workflow', value:58, state:'Testing'},
  {name:'Fleet', detail:'Departments and vehicle standards', value:34, state:'Planned'},
  {name:'AI laboratory', detail:'Conversation and context systems', value:12, state:'Research'},
];

const statusRows = [
  ['GTA V Legacy', '1.0.3788.0'],
  ['RAGE Plugin Hook', '1.130.1406.17682'],
  ['LSPDFR', '0.4.9 / 0.4.9572'],
  ['Build channel', 'Legacy'],
];

function StatusPill({children, tone='green'}) {
  return <span className={clsx(styles.statusPill, styles[`statusPill${tone}`])}><span className={styles.statusDot}/>{children}</span>;
}

export default function Home() {
  return (
    <Layout title="LSPDFR Knowledge Base" description="Verified guides for building a stable, realistic GTA V Legacy LSPDFR police simulator.">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGridPattern}/>
          <div className={styles.heroGlow}/>
          <div className={clsx('container', styles.heroInner)}>
            <div className={styles.heroCopy}>
              <div className={styles.kicker}><span className={styles.kickerMark}/><span>PROJECT SENTINEL // OPERATIONS CENTER</span></div>
              <Heading as="h1" className={styles.heroTitle}>Build the police simulator<br/><span>GTA V was never meant to be.</span></Heading>
              <p className={styles.heroLead}>The definitive, beginner-first knowledge base for a stable and realistic GTA V Legacy LSPDFR installation—verified one layer at a time.</p>
              <div className={styles.heroActions}>
                <Link className={clsx('button button--lg', styles.primaryButton)} to="/guide/intro">Start building <Icon name="chevron"/></Link>
                <Link className={clsx('button button--lg', styles.secondaryButton)} to="/guide/optimization/golden-build">View Golden Build</Link>
              </div>
              <div className={styles.trustRow}>
                <span><Icon name="check"/> Version matched</span>
                <span><Icon name="check"/> Beginner safe</span>
                <span><Icon name="check"/> Continuously tested</span>
              </div>
            </div>

            <div className={styles.commandPanel} aria-label="Current verified build status">
              <div className={styles.panelTopbar}>
                <div className={styles.windowDots}><i/><i/><i/></div>
                <span>SENTINEL_BUILD_STATUS</span>
                <StatusPill>VERIFIED</StatusPill>
              </div>
              <div className={styles.panelBody}>
                <div className={styles.radarGraphic}>
                  <div className={styles.radarSweep}/>
                  <div className={styles.radarRingOne}/>
                  <div className={styles.radarRingTwo}/>
                  <div className={styles.radarCrossX}/>
                  <div className={styles.radarCrossY}/>
                  <div className={styles.radarBlip}/>
                  <div className={styles.radarCore}><Icon name="shield"/></div>
                </div>
                <div className={styles.buildHeading}>
                  <span>CURRENT VERIFIED BUILD</span>
                  <strong>Legacy 3788</strong>
                  <small>Last validation snapshot: July 2026</small>
                </div>
                <div className={styles.statusTable}>
                  {statusRows.map(([label,value]) => <div className={styles.statusRow} key={label}><span>{label}</span><strong>{value}</strong></div>)}
                </div>
                <div className={styles.integrityLine}><span>BUILD INTEGRITY</span><div><i/><i/><i/><i/><i/><i/><i/><i/></div><strong>100%</strong></div>
              </div>
            </div>
          </div>
          <div className={styles.heroStrip}>
            <div className="container"><span>STATUS // ONLINE</span><span>GUIDES // 30+</span><span>CORE BUILD // VERIFIED</span><span>AI SYSTEMS // RESEARCH</span></div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div><div className={styles.sectionEyebrow}>THE SENTINEL STANDARD</div><Heading as="h2">Everything required. Nothing left to guess.</Heading></div>
              <p>Project Sentinel replaces scattered videos and outdated mod lists with one controlled, documented build system.</p>
            </div>
            <div className={styles.featureGrid}>
              {features.map((feature,index) => (
                <article className={styles.featureCard} key={feature.title}>
                  <div className={styles.featureTop}><div className={styles.iconBox}><Icon name={feature.icon}/></div><span>0{index+1}</span></div>
                  <Heading as="h3">{feature.title}</Heading>
                  <p>{feature.text}</p>
                  <div className={styles.testingBadge}><span/>{feature.badge}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.roadmapSection)} id="roadmap">
          <div className="container">
            <div className={styles.sectionHeader}>
              <div><div className={styles.sectionEyebrow}>BUILD ROADMAP</div><Heading as="h2">From clean install to complete simulator.</Heading></div>
              <Link className={styles.textLink} to="/guide/intro">Explore the full guide <Icon name="chevron"/></Link>
            </div>
            <div className={styles.roadmapGrid}>
              {roadmap.map((item,index) => (
                <article className={styles.roadmapItem} key={item.name}>
                  <div className={styles.roadmapIndex}>{String(index+1).padStart(2,'0')}</div>
                  <div className={styles.roadmapContent}>
                    <div className={styles.roadmapTitle}><div><Heading as="h3">{item.name}</Heading><p>{item.detail}</p></div><StatusPill tone={item.state==='Verified'?'green':item.state==='In progress'?'blue':'amber'}>{item.state.toUpperCase()}</StatusPill></div>
                    <div className={styles.progressTrack}><span style={{width:`${item.value}%`}}/></div>
                    <div className={styles.progressMeta}><span>PHASE COMPLETION</span><strong>{item.value}%</strong></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.goldenCard}>
              <div className={styles.goldenGlow}/>
              <div className={styles.goldenIcon}><Icon name="star"/></div>
              <div className={styles.goldenCopy}>
                <div className={styles.sectionEyebrow}>PROJECT SENTINEL GOLDEN BUILD</div>
                <Heading as="h2">A known-good checkpoint you can actually reproduce.</Heading>
                <p>The Golden Build records every verified version, dependency, configuration decision and backup point—so updates never force you to start over.</p>
                <div className={styles.goldenStats}>
                  <div><strong>3788</strong><span>GTA Legacy</span></div>
                  <div><strong>0.4.9</strong><span>LSPDFR</span></div>
                  <div><strong>1.130</strong><span>RPH</span></div>
                  <div><strong>STABLE</strong><span>Build state</span></div>
                </div>
              </div>
              <div className={styles.goldenAction}>
                <StatusPill tone="amber">GOLDEN SNAPSHOT</StatusPill>
                <Link className={clsx('button button--lg', styles.goldButton)} to="/guide/optimization/golden-build">Open Golden Build <Icon name="chevron"/></Link>
              </div>
            </div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.finalSection)}>
          <div className="container">
            <div className={styles.finalGrid}>
              <div>
                <div className={styles.sectionEyebrow}>BEGIN THE BUILD</div>
                <Heading as="h2">Your first stable patrol starts with a clean foundation.</Heading>
                <p>Follow the installation path in order. Test every layer. Back up every milestone. Build with confidence.</p>
              </div>
              <div className={styles.finalActions}>
                <Link className={clsx('button button--lg', styles.primaryButton)} to="/guide/getting-started/clean-install">Start with a clean install <Icon name="chevron"/></Link>
                <Link className={styles.helpLink} to="/help"><Icon name="radio"/> Need installation help?</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
