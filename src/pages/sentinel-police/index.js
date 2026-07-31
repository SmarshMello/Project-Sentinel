import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {plugins} from '@site/src/data/plugins';
import {platformState} from '@site/src/data/platform';
import styles from './styles.module.css';

const paths=[
  {tag:'Verified final setup',title:'Sentinel Build v1.0',desc:'Reproduce the completed Policing Redefined, Nexus, NPCAI, ALPR, EUP, ELS, VisualV, and Better Radiance build.',to:'/guide/builds/paid-sentinel-build',tone:'paid'},
  {tag:'No-premium alternative',title:'Free Modern Build',desc:'Use the same modern foundation without the paid Nexus and NPCAI workflow.',to:'/guide/builds/free-sentinel-build',tone:'free'},
  {tag:'Existing older installations',title:'Legacy Alternative',desc:'Keep Stop The Ped, Ultimate Backup, and CompuLite in their own documented architecture.',to:'/guide/builds/migrate-legacy-to-modern',tone:'legacy'},
];

const workflow=[
  ['1','Choose','Pick one architecture and understand what it replaces.','/guide/builds/choose-your-build'],
  ['2','Prepare','Create a clean Legacy baseline and named backups.','/guide/getting-started/clean-install'],
  ['3','Install','Follow the exact dependency order for your chosen path.','/guide/intro'],
  ['4','Verify','Use test gates, compatibility checks, and the checklist.','/checklist'],
  ['5','Recover','Diagnose the first real error instead of reinstalling randomly.','/doctor'],
];

export default function SentinelPolice(){
 const included=plugins.filter(p=>p.sentinelPolice);
 return <Layout title="Build Guide" description="Choose and install a stable Project Sentinel LSPDFR build.">
  <main className={styles.page}>
   <header className={styles.hero}><div className="container"><div className={styles.heroGrid}><div><div className={styles.kicker}>PROJECT SENTINEL // BUILD GUIDE</div><Heading as="h1">Build a stable police simulator, one verified layer at a time.</Heading><p>Reproduce the completed Sentinel Build v1.0, choose the free modern alternative, or preserve a separate legacy installation. Every route uses the same method: install, test, document, and back up.</p><div className={styles.actions}><Link className="button button--primary button--lg" to="/guide/builds/choose-your-build">Compare build paths</Link><Link className="button button--secondary button--lg" to="/guide/getting-started/clean-install">Start with a clean game</Link></div></div><aside><span>Current candidate platform</span><strong>Legacy {platformState.current.gameBuild}</strong><dl><div><dt>LSPDFR</dt><dd>{platformState.current.lspdfr}</dd></div><div><dt>RPH</dt><dd>{platformState.current.rph}</dd></div><div><dt>Documented components</dt><dd>{included.length}</dd></div><div><dt>Reference status</dt><dd>Sentinel v1.0 verified</dd></div></dl></aside></div></div></header>
   <nav className={styles.bar}><div className="container"><Link to="/guide/builds/paid-sentinel-build">Sentinel v1.0</Link><Link to="/keybinds">Keybinds</Link><Link to="/guide/getting-started/clean-install">Clean install</Link><Link to="/checklist">Checklist</Link><Link to="/compatibility">Compatibility</Link><Link to="/doctor">Doctor</Link></div></nav>
   <section className={styles.paths}><div className="container"><div className={styles.heading}><span>CHOOSE ONE PATH</span><Heading as="h2">The difference is clear before you install.</Heading><p>Sentinel v1.0 is the verified reference. The free route shares its modern foundation; the legacy route uses a different police framework and must stay separate.</p></div><div className={styles.pathGrid}>{paths.map(path=><Link className={styles.pathCard} to={path.to} key={path.title}><small className={styles[path.tone]}>{path.tag}</small><Heading as="h3">{path.title}</Heading><p>{path.desc}</p><b>Open this path →</b></Link>)}</div></div></section>
   <section className={styles.workflow}><div className="container"><div className={styles.heading}><span>THE INSTALLATION METHOD</span><Heading as="h2">Five stages from download to patrol.</Heading></div><div className={styles.workflowGrid}>{workflow.map(([num,title,desc,to])=><Link to={to} key={num}><i>{num}</i><strong>{title}</strong><span>{desc}</span></Link>)}</div></div></section>
   <section className={styles.quick}><div className="container"><div><Heading as="h2">Ready to reproduce the finished build?</Heading><p>Follow Sentinel Build v1.0 exactly, then use the searchable keybind page and final acceptance test before creating your Golden Build backup.</p></div><Link className="button button--primary" to="/guide/builds/paid-sentinel-build">Open Sentinel v1.0</Link></div></section>
  </main>
 </Layout>
}
