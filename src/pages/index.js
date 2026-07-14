
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

export default function Home(){
 const hero=useBaseUrl('/img/hero.jpg');
 return <Layout title="Home" description="The complete GTA V Legacy LSPDFR master guide">
  <section className="heroBanner"><div className="container heroGrid"><div><div className="eyebrow">THE COMPLETE GTA V LEGACY LSPDFR GUIDE</div><h1 className="heroTitle">Build a police simulator, not a pile of mods.</h1><p className="heroLead">Project Sentinel is a beginner-first blueprint for building a stable, realistic and expandable LSPDFR experience—from a clean GTA installation to dispatch, investigations, fleets, graphics, audio and advanced conversational AI.</p><div className="buttonRow"><Link className="button button--primary button--lg" to="/guide/intro">Start the Complete Guide</Link><Link className="button button--secondary button--lg" to="/help">Get Help</Link></div><div className="notice"><strong>Professional rule:</strong> install one layer, test it, document it, and back it up before continuing.</div></div><img className="heroImage" src={hero} alt="Project Sentinel EUP Menu"/></div></section>
  <section className="homeSection"><div className="container"><div className="eyebrow">WHAT YOU GET</div><h2 className={styles.sectionTitle}>One professional site for the entire build</h2><div className="featureGrid">{[['01','Beginner install path','A strict phase-by-phase workflow with test gates.'],['02','Searchable documentation','Find every dependency, file, folder, keybind and fix.'],['03','Real troubleshooting','Solutions based on actual loader errors and crashes.'],['04','Expandable architecture','Add future callouts, fleets, tools and AI without rebuilding the site.']].map(x=><article className="featureCard" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></div></section>
  <section className="homeSection altSection"><div className="container"><div className="eyebrow">THE FINISHED BUILD</div><h2 className={styles.sectionTitle}>Project Sentinel architecture</h2><div className="scopeGrid">{[['Foundation','Loaders, limits, GameConfig, RPH, LSPDFR, LML and backups.'],['Police Systems','Stops, MDT, ALPR, radar, backup, K9, DUI, evidence, reports and transport.'],['Communications','Voice dispatch, unit status, pursuits, plate checks and radio audio.'],['World & Fleet','Departments, EUP, vehicles, callouts, improved AI, fire and EMS.'],['Presentation','Graphics, lighting, weather, sirens, gun sounds, ambience and bodycam.'],['AI Laboratory','Context-aware conversation, memory, believable voices and a stable fallback.']].map(x=><article className="scopeCard" key={x[0]}><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></div></section>
 </Layout>
}
