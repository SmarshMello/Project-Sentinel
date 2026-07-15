import React,{useMemo,useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useSentinelData} from '@site/src/components/MissionControl';
import {plugins} from '@site/src/data/plugins';
import styles from './styles.module.css';

export default function Projects(){
  const {loading,report,error}=useSentinelData();
  const [query,setQuery]=useState('');
  const [risk,setRisk]=useState('all');
  const registry=useMemo(()=>new Map(plugins.map(item=>[item.id,item])),[]);
  const items=useMemo(()=>{
    const q=query.toLowerCase().trim();
    return (report?.items||[]).filter(x=>(!q||`${x.name} ${x.category} ${x.status} ${x.expectedVersion}`.toLowerCase().includes(q))&&(risk==='all'||(x.intelligence?.riskLevel||x.riskLevel||'low')===risk));
  },[report,query,risk]);
  return <Layout title="Project Profiles"><main className={styles.page}><div className="container"><div className={styles.head}><div><span>UNIFIED PROJECT REGISTRY</span><h1>Project profiles</h1><p>Live Watcher intelligence connected to permanent Sentinel guides.</p></div><Link to="/watcher">Open Watcher →</Link></div><div className={styles.controls}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search projects, categories or status…"/><select value={risk} onChange={e=>setRisk(e.target.value)}><option value="all">All risk levels</option><option value="high">High risk</option><option value="medium">Medium risk</option><option value="low">Low risk</option></select></div><div className={styles.resultLine}><strong>{items.length}</strong> projects shown <span>Click any card to open its full Sentinel profile.</span></div>{loading&&<p>Loading live registry…</p>}{error&&<p>{error}</p>}<div className={styles.grid}>{items.map(x=>{const intel=x.intelligence||{};const level=intel.riskLevel||x.riskLevel||'low';const meta=registry.get(x.id);return <Link className={styles.card} key={x.id||x.name} to={`/plugins/${x.id}`}><div className={styles.cardHead}><span>{x.category}</span><b className={styles[level]}>{level} risk</b></div><h2>{x.name}</h2><p className={styles.version}>{x.detectedVersion||x.expectedVersion||x.expected||'Current official release'}</p><div className={styles.stats}><div><span>Health</span><strong>{x.healthScore??x.health??0}%</strong></div><div><span>Status</span><strong>{x.status||'Unknown'}</strong></div><div><span>Confidence</span><strong>{intel.confidence??x.confidence??0}%</strong></div></div><p className={styles.recommendation}>{intel.recommendation||x.recommendation||'Continue monitoring.'}</p><div className={styles.cardFoot}><span>{meta?.developer||'Verified source'}</span><strong>Open full profile →</strong></div></Link>})}</div></div></main></Layout>}
