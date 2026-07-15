import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import SentinelIcon from '@site/src/components/SentinelIcon';
import FeatureCard from '@site/src/components/FeatureCard';
import VersionPanel from '@site/src/components/VersionPanel';
import SectionHeader from '@site/src/components/SectionHeader';
import RoadmapTimeline from '@site/src/components/RoadmapTimeline';
import GoldenBuildCard from '@site/src/components/GoldenBuildCard';
import styles from './index.module.css';

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
                <Link className={clsx('button button--lg', styles.primaryButton)} to="/guide/intro">Start building <SentinelIcon name="chevron" className={styles.icon}/></Link>
                <Link className={clsx('button button--lg', styles.secondaryButton)} to="/plugins">Browse plugins</Link>
              </div>
              <div className={styles.trustRow}>
                <span><SentinelIcon name="check" className={styles.icon}/> Version matched</span>
                <span><SentinelIcon name="check" className={styles.icon}/> Beginner safe</span>
                <span><SentinelIcon name="check" className={styles.icon}/> Continuously tested</span>
              </div>
            </div>
            <VersionPanel title="Legacy 3788" rows={statusRows}/>
          </div>
          <div className={styles.heroStrip}><div className="container"><span>STATUS // ONLINE</span><span>PLUGIN REGISTRY // LIVE</span><span>CORE BUILD // VERIFIED</span><span>AI SYSTEMS // RESEARCH</span></div></div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <SectionHeader eyebrow="THE SENTINEL STANDARD" title="Everything required. Nothing left to guess." description="Project Sentinel replaces scattered videos and outdated mod lists with one controlled, documented build system."/>
            <div className={styles.featureGrid}>{features.map((feature,index)=><FeatureCard key={feature.title} {...feature} index={index+1}/>)}</div>
          </div>
        </section>

        <section className={clsx(styles.section, styles.roadmapSection)} id="roadmap">
          <div className="container">
            <SectionHeader eyebrow="BUILD ROADMAP" title="From clean install to complete simulator." action={<Link className={styles.textLink} to="/guide/intro">Explore the full guide <SentinelIcon name="chevron" className={styles.icon}/></Link>}/>
            <RoadmapTimeline items={roadmap}/>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container"><GoldenBuildCard stats={[["3788","GTA Legacy"],["1.130","RAGE Plugin Hook"],["0.4.9","LSPDFR"],["100%","Core verified"]]}/></div>
        </section>

        <section className={clsx(styles.section, styles.ctaSection)}>
          <div className={clsx('container', styles.ctaInner)}>
            <div><div className={styles.sectionEyebrow}>READY FOR DUTY?</div><Heading as="h2">Start with a clean foundation.</Heading><p>Follow the controlled installation sequence and test at every gate. No giant mod dump. No mystery crashes.</p></div>
            <div className={styles.ctaActions}><Link className={clsx('button button--lg', styles.primaryButton)} to="/guide/getting-started/clean-install">Begin clean install <SentinelIcon name="chevron" className={styles.icon}/></Link><Link className={clsx('button button--lg', styles.secondaryButton)} to="/plugins">Open plugin database</Link></div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
