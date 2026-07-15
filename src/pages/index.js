import React,{useEffect,useMemo,useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {plugins} from '@site/src/data/plugins';
import styles from './index.module.css';

const fmt=(v)=>v?new Date(v).toLocaleString():'Awaiting first scan';
const scoreLabel=(v)=>v>=90?'Excellent':v>=75?'Operational':v>=60?'Review recommended':'Attention required';

export default function Home(){
 const reportUrl=useBaseUrl('/data/watcher-report.json');
 const historyUrl=useBaseUrl('/data/watcher-history.json');
 const [report,setReport]=useState(null); const [history,setHistory]=useState({scans:[]});
 useEffect(()=>{let active=true;(async()=>{try{const [r,h]=await Promise.all([fetch(`${reportUrl}?t=${Date.now()}`,{cache:'no-store'}),fetch(`${historyUrl}?t=${Date.now()}`,{cache:'no-store'})]);if(active&&r.ok)setReport(await r.json());if(active&&h.ok)setHistory(await h.json())}catch{}})();return()=>{active=false}},[reportUrl,historyUrl]);
 const scans=history?.scans||[]; const previous=scans[1];
 const delta=report&&previous?(report.averageHealth-previous.averageHealth):null;
 const actions=useMemo(()=>report?.reviewQueue?.slice(0,4)||[],[report]);
 const watched=report?.counts?.tracked??26; const health=report?.averageHealth??'—';
 const critical=report?.intelligenceCounts?.highRisk??0; const reviews=report?.counts?.needsReview??'—';
 const updates=report?.counts?.possibleUpdates??'—'; const runtime=report?.durationSeconds??'—';
 return <Layout title="Operations Center" description="Project Sentinel operations center for LSPDFR builds, monitoring, compatibility and troubleshooting.">
  <main className={styles.page}>
   <section className={styles.hero}><div className={styles.grid}/><div className="container"><div className={styles.kicker}>PROJECT SENTINEL // OPERATIONS CENTER 4.0</div><Heading as="h1">Your LSPDFR command center.</Heading><p>Build, monitor, verify and troubleshoot a stable GTA V Legacy police simulator from one connected platform.</p><div className={styles.actions}><Link className={styles.primary} to="/watcher">Open live operations</Link><Link className={styles.secondary} to="/sentinel-police">Continue Sentinel Police</Link></div></div></section>
   <section className="container">
    <div className={styles.statusBanner}><div><span>Overall ecosystem status</span><strong>{report?scoreLabel(report.averageHealth):'Loading live status'}</strong><small>Last published: {fmt(report?.checkedAt)}</small></div><div className={styles.score}><b>{health}{health!=='—'?'%':''}</b><span>{delta===null?'Live intelligence':`${delta>=0?'+':''}${delta}% since prior scan`}</span></div></div>
    <div className={styles.metrics}>
     {[['Projects monitored',watched,'Watcher coverage'],['Critical alerts',critical,'Immediate action'],['Possible updates',updates,'Release signals'],['Needs review',reviews,'Human verification'],['Last runtime',`${runtime}s`,'Automated scan'],['Database records',plugins.length,'Sentinel registry']].map(([a,b,c])=><article key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></article>)}
    </div>
    <div className={styles.columns}>
     <article className={styles.panel}><div className={styles.panelHead}><div><span>Today</span><Heading as="h2">Action center</Heading></div><Link to="/watcher">Open Watcher →</Link></div>{actions.length?<div className={styles.actionsList}>{actions.map(item=><Link key={item.id} to={`/operations/projects?id=${encodeURIComponent(item.id)}`}><b>{item.name}</b><span>{item.reviewReason||item.note||'Manual review recommended'}</span><i>{item.reviewPriority||'review'}</i></Link>)}</div>:<div className={styles.clear}><b>No urgent actions.</b><span>The latest published scan contains no high-priority review items.</span></div>}</article>
     <article className={styles.panel}><div className={styles.panelHead}><div><span>Connected systems</span><Heading as="h2">Sentinel modules</Heading></div></div><div className={styles.modules}>{[
      ['/watcher','Watcher','Daily ecosystem intelligence'],['/operations/projects','Project profiles','Live mod health and source data'],['/operations/analytics','Analytics','Trends, category health and history'],['/compatibility','Compatibility Center','Conflicts, dependencies and confidence'],['/planner','Build Planner','Generate a controlled installation plan'],['/doctor','Sentinel Doctor','Guided diagnosis and repair']].map(([to,name,desc])=><Link key={to} to={to}><b>{name}</b><span>{desc}</span><i>→</i></Link>)}</div></article>
    </div>
    <div className={styles.categories}><div className={styles.panelHead}><div><span>Live category intelligence</span><Heading as="h2">Ecosystem coverage</Heading></div><Link to="/operations/analytics">View analytics →</Link></div><div className={styles.categoryGrid}>{(report?.categories||[]).slice(0,8).map(c=><article key={c.name}><div><b>{c.name}</b><span>{c.needsReview} review</span></div><div className={styles.track}><i style={{width:`${c.averageHealth}%`}}/></div><strong>{c.averageHealth}%</strong></article>)}</div></div>
   </section>
  </main>
 </Layout>
}
