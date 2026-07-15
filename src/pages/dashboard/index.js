import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {plugins} from '@site/src/data/plugins';
import {goldenBuilds} from '@site/src/data/builds';
import {compatibilityRows} from '@site/src/data/compatibility';
import styles from './styles.module.css';

const statusLabel = (value) => ({'possible-update':'Possible update','metadata-changed':'Metadata changed','timed-out':'Timed out',blocked:'Automation blocked',redirected:'Redirected','not-found':'Not found',archived:'Archived'}[value] || value || 'Unknown');
const dateText = (value) => value ? new Date(value).toLocaleString() : 'Not published yet';

export default function Dashboard(){
  const reportUrl = useBaseUrl('/data/watcher-report.json');
  const historyUrl = useBaseUrl('/data/watcher-history.json');
  const [report,setReport]=useState(null);
  const [history,setHistory]=useState({scans:[]});
  const [loadError,setLoadError]=useState('');
  const verified=plugins.filter(p=>p.status==='verified').length;
  const testing=plugins.filter(p=>p.status==='testing').length;
  const confidence=Math.round(compatibilityRows.reduce((a,p)=>a+p.confidence,0)/compatibilityRows.length);

  useEffect(()=>{let active=true;(async()=>{try{const [r,h]=await Promise.all([fetch(`${reportUrl}?t=${Date.now()}`,{cache:'no-store'}),fetch(`${historyUrl}?t=${Date.now()}`,{cache:'no-store'})]);if(!r.ok)throw new Error(`Watcher report returned HTTP ${r.status}`);if(active){setReport(await r.json());if(h.ok)setHistory(await h.json());setLoadError('')}}catch(error){if(active)setLoadError(error instanceof Error?error.message:'Could not load Watcher data.')}})();return()=>{active=false}},[reportUrl,historyUrl]);

  const scans=history?.scans||[];
  const previous=scans[1];
  const delta=previous&&report?report.averageHealth-previous.averageHealth:null;
  const alerts=useMemo(()=>report?.reviewQueue?.slice(0,5)||[],[report]);
  const changes=useMemo(()=>report?.changes?.slice(0,5)||[],[report]);
  const watcherHealthy=report?report.averageHealth>=70:false;
  const systemLabel=loadError?'Watcher data unavailable':report?(watcherHealthy?'Systems operational':'Review required'):'Loading operations data';

  return <Layout title="Operations Dashboard" description="Live Project Sentinel operations dashboard."><main className={styles.page}>
    <header className={styles.hero}><div className="container"><div><span>Sentinel operations center</span><Heading as="h1">System Dashboard</Heading><p>The current state of the verified build, compatibility registry, Watcher automation and review queue.</p></div><div className={`${styles.live} ${!watcherHealthy&&report?styles.warning:''}`}><i/>{systemLabel}</div></div></header>
    <section className={styles.body}><div className="container">
      {loadError&&<div className={styles.loadError}>{loadError}</div>}
      <div className={styles.metrics}>
        <article><span>Registry records</span><strong>{plugins.length}</strong><small>{verified} verified</small></article>
        <article><span>Watcher health</span><strong>{report?`${report.averageHealth}%`:'—'}</strong><small>{delta===null?'Awaiting comparison':`${delta>=0?'+':''}${delta}% since prior scan`}</small></article>
        <article><span>Review queue</span><strong>{report?.counts?.needsReview??'—'}</strong><small>{report?.counts?.highPriority??'—'} high priority</small></article>
        <article><span>Changes detected</span><strong>{report?.changeCounts?.total??'—'}</strong><small>{report?.changeCounts?.releases??'—'} release signals</small></article>
      </div>

      <div className={styles.grid}>
        <article className={styles.primary}><span>Current verified environment</span><Heading as="h2">Legacy 3788 Golden Build</Heading><dl><div><dt>GTA V Legacy</dt><dd>1.0.3788.0</dd></div><div><dt>RAGE Plugin Hook</dt><dd>1.130.1406.17682</dd></div><div><dt>LSPDFR</dt><dd>0.4.9 · 0.4.9572</dd></div><div><dt>Build state</dt><dd className={styles.good}>Verified</dd></div></dl><Link to="/builds">Open build archive →</Link></article>
        <article><span>Quick actions</span><Heading as="h2">Plan, diagnose, maintain</Heading><div className={styles.actions}><Link to="/doctor"><b>Sentinel Doctor</b><small>Analyze logs privately in your browser.</small></Link><Link to="/watcher"><b>Sentinel Watcher</b><small>Run a fresh ecosystem scan.</small></Link><Link to="/planner"><b>Build Planner</b><small>Generate a compatible patrol setup.</small></Link><Link to="/compatibility"><b>Compatibility Center</b><small>Inspect every tracked component.</small></Link></div></article>
      </div>

      <div className={styles.operationsGrid}>
        <article className={styles.panel}><div className={styles.panelHead}><div><span>Watcher intelligence</span><Heading as="h2">Latest changes</Heading></div><Link to="/watcher">Full report →</Link></div>{changes.length?<div className={styles.feed}>{changes.map((change)=><div key={`${change.id}-${change.type}`}><i data-priority={change.priority}/><div><b>{change.name}</b><span>{change.summary}</span></div><small>{change.type.replaceAll('-',' ')}</small></div>)}</div>:<p className={styles.empty}>No meaningful changes were detected in the latest published scan.</p>}</article>
        <article className={styles.panel}><div className={styles.panelHead}><div><span>Human review</span><Heading as="h2">Priority queue</Heading></div><strong>{report?.counts?.needsReview??'—'}</strong></div>{alerts.length?<div className={styles.queue}>{alerts.map((item)=><a key={item.id} href={item.sourceUrl}><div><b>{item.name}</b><span>{item.reason}</span></div><em data-priority={item.priority}>{item.priority}</em></a>)}</div>:<p className={styles.empty}>The current Watcher report has no items requiring review.</p>}</article>
      </div>

      <section className={styles.health}><div><span>Watcher source health</span><strong>{report?`${report.averageHealth}%`:'—'}</strong></div><div className={styles.track}><i style={{width:`${report?.averageHealth||0}%`}}/></div><div className={styles.healthMeta}><p>Last published scan: {dateText(report?.checkedAt)} · Runtime {report?.durationSeconds??'—'}s · Watcher {report?.watcherVersion??'—'}</p><Link to="/watcher">Open monitoring console →</Link></div></section>
    </div></section>
  </main></Layout>
}
