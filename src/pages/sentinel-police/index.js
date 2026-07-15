import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {plugins} from '@site/src/data/plugins';
import styles from './styles.module.css';

const sections=[
  ['Start the build','Clean installation through the verified LSPDFR foundation.','/guide/getting-started/clean-install','01'],
  ['Current working build','Exact versions and components currently locked for Sentinel Police.','/builds','02'],
  ['Installation checklist','Track every completed installation step in your browser.','/checklist','03'],
  ['Build planner','Generate a profile around stability, realism or experimental systems.','/planner','04'],
  ['Police systems','Stop The Ped, Ultimate Backup, CompuLite and patrol tools.','/guide/police/stop-the-ped','05'],
  ['Agencies & fleet','Department structure, vehicle strategy and future statewide coverage.','/guide/fleet/department-plan','06'],
  ['Uniforms','EUP Menu, Law & Order, Serve & Rescue and agency configuration.','/guide/uniforms/eup-menu-ragenativeui','07'],
  ['Graphics & audio','Emergency lighting, visual presentation and audio strategy.','/guide/presentation/graphics-audio','08'],
  ['Optimization','Golden-build discipline, keybinds and performance stability.','/guide/optimization/golden-build','09'],
  ['Build troubleshooting','Fixes documented from the actual Sentinel Police installation.','/troubleshooter','10'],
];
export default function SentinelPolice(){
 const included=plugins.filter(p=>p.sentinelPolice);
 return <Layout title="Sentinel Police" description="The official working Project Sentinel LSPDFR police simulator build.">
  <main className={styles.page}>
   <header className={styles.hero}><div className={styles.scan}/><div className="container"><div className={styles.kicker}>PROJECT SENTINEL // WORKING MOD PACK</div><div className={styles.heroGrid}><div><Heading as="h1">Sentinel <span>Police</span></Heading><p>The dedicated home of our personally tested GTA V Legacy police simulator. This section contains the build guide, exact working stack, installation order, agencies, fleet, uniforms, presentation and fixes.</p><div className={styles.actions}><Link className="button button--primary button--lg" to="/guide/getting-started/clean-install">Start building</Link><Link className="button button--secondary button--lg" to="/checklist">Open checklist</Link></div></div><aside><span>Current baseline</span><strong>Legacy 3788</strong><dl><div><dt>LSPDFR</dt><dd>0.4.9</dd></div><div><dt>RPH</dt><dd>1.130</dd></div><div><dt>Verified components</dt><dd>{included.length}</dd></div><div><dt>Status</dt><dd className={styles.online}>Operational</dd></div></dl></aside></div></div></header>
   <nav className={styles.bar}><div className="container"><Link to="/sentinel-police">Overview</Link><Link to="/guide/intro">Build Guide</Link><Link to="/builds">Working Build</Link><Link to="/checklist">Checklist</Link><Link to="/planner">Planner</Link><Link to="/troubleshooter">Troubleshooting</Link></div></nav>
   <section className={styles.content}><div className="container"><div className={styles.heading}><span>BUILD OPERATIONS</span><Heading as="h2">Everything for the working mod pack.</Heading><p>The general database catalogs the wider community. Sentinel Police contains only our selected build and the procedures used to keep it stable.</p></div><div className={styles.grid}>{sections.map(([title,desc,to,num])=><Link className={styles.card} to={to} key={title}><span>{num}</span><Heading as="h3">{title}</Heading><p>{desc}</p><b>Open section →</b></Link>)}</div></div></section>
   <section className={styles.stack}><div className="container"><div><span>ACTIVE STACK</span><Heading as="h2">Included in Sentinel Police</Heading></div><div className={styles.chips}>{included.map(p=><Link to={`/plugins/${p.id}`} key={p.id}>{p.name}<small>{p.version}</small></Link>)}</div></div></section>
  </main>
 </Layout>
}
