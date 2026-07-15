import React,{useMemo,useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useSentinelData} from '@site/src/components/MissionControl';
import {mergeWatcherReport} from '@site/src/data/registry';
import styles from './styles.module.css';

const sourceLabel=(status)=>({healthy:'Reliable','rate-limited':'Rate limited','timed-out':'Degraded','blocked':'Blocked','not-found':'Unavailable'}[status]||'Unknown');
const compatibilityLabel=(meta)=>meta?.status==='verified'?'Verified':meta?.status==='compatible'?'Compatible':meta?.status==='testing'?'Testing':'Unverified';
const priorityLabel=(item)=>item?.intelligence?.riskLevel||item?.riskLevel||'low';

export default function Projects(){
  const {loading,report,error}=useSentinelData();
  const [query,setQuery]=useState('');
  const [risk,setRisk]=useState('all');
  const items=useMemo(()=>{
    const q=query.toLowerCase().trim();
    return mergeWatcherReport(report).filter(meta=>{
      const x=meta.watcher||{};
      const haystack=`${meta.name} ${meta.category} ${meta.status} ${meta.version} ${meta.developer||''} ${(meta.dependencies||[]).join(' ')} ${x.status||''}`.toLowerCase();
      const level=priorityLabel(x);
      return (!q||haystack.includes(q))&&(risk==='all'||level===risk);
    });
  },[report,query,risk]);
  return <Layout title="Project Profiles"><main className={styles.page}><div className="container"><div className={styles.head}><div><span>UNIFIED PROJECT REGISTRY</span><h1>Project profiles</h1><p>Live Watcher intelligence connected to permanent Sentinel guides.</p></div><Link to="/watcher">Open Watcher →</Link></div><div className={styles.controls}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search names, developers, dependencies or status…"/><select value={risk} onChange={e=>setRisk(e.target.value)}><option value="all">All review priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select></div><div className={styles.resultLine}><strong>{items.length}</strong> registry projects shown <span>Compatibility, source reliability and review priority are scored separately.</span></div>{loading&&<p>Loading live registry…</p>}{error&&<p>{error}</p>}<div className={styles.grid}>{items.map(meta=>{const x=meta.watcher||{};const intel=x.intelligence||{};const level=meta.watcherTracked?priorityLabel(x):(meta.status==='conflict'?'high':meta.status==='testing'||meta.status==='legacy'?'medium':'low');const health=meta.watcherTracked?(x.healthScore??x.health??0):Math.round(meta.confidence*(meta.status==='verified'?1:meta.status==='community'?0.9:meta.status==='documented'?0.82:meta.status==='testing'?0.7:meta.status==='conflict'?0.55:0.6));return <Link className={styles.card} key={meta.id} to={meta.profile}><div className={styles.cardHead}><span>{meta.category}</span><b className={styles[level]}>{level} priority</b></div><h2>{meta.name}</h2><p className={styles.version}>{x.detectedVersion||x.expectedVersion||meta.version||'Current official release'}</p><div className={styles.scoreGrid}><div><span>Compatibility</span><strong>{compatibilityLabel(meta)}</strong></div><div><span>Source</span><strong>{meta.watcherTracked?sourceLabel(x.status):'Not monitored'}</strong></div><div><span>Health</span><strong>{health}%</strong></div><div><span>Confidence</span><strong>{intel.confidence??x.confidence??meta.confidence??0}%</strong></div></div><p className={styles.recommendation}>{intel.recommendation||x.recommendation||meta.note||'Continue monitoring.'}</p><div className={styles.cardFoot}><span>{meta.developer||'Verified source'} · {meta.watcherTracked?'Watcher connected':'Registry only'}</span><strong>Open full profile →</strong></div></Link>})}</div></div></main></Layout>}
