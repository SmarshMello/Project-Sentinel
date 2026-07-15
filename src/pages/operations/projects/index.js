import React,{useMemo,useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useSentinelData} from '@site/src/components/MissionControl';
import {plugins} from '@site/src/data/plugins';
import styles from './styles.module.css';

const sourceLabel=(status)=>({healthy:'Reliable','rate-limited':'Rate limited','timed-out':'Degraded','blocked':'Blocked','not-found':'Unavailable'}[status]||'Unknown');
const compatibilityLabel=(meta)=>meta?.status==='verified'?'Verified':meta?.status==='compatible'?'Compatible':meta?.status==='testing'?'Testing':'Unverified';
const priorityLabel=(item)=>item?.intelligence?.riskLevel||item?.riskLevel||'low';

export default function Projects(){
  const {loading,report,error}=useSentinelData();
  const [query,setQuery]=useState('');
  const [risk,setRisk]=useState('all');
  const registry=useMemo(()=>new Map(plugins.map(item=>[item.id,item])),[]);
  const items=useMemo(()=>{
    const q=query.toLowerCase().trim();
    return (report?.items||[]).filter(x=>{
      const meta=registry.get(x.id);
      const haystack=`${x.name} ${x.category} ${x.status} ${x.expectedVersion} ${meta?.developer||''} ${(meta?.dependencies||[]).join(' ')}`.toLowerCase();
      return (!q||haystack.includes(q))&&(risk==='all'||priorityLabel(x)===risk);
    });
  },[report,query,risk,registry]);
  return <Layout title="Project Profiles"><main className={styles.page}><div className="container"><div className={styles.head}><div><span>UNIFIED PROJECT REGISTRY</span><h1>Project profiles</h1><p>Live Watcher intelligence connected to permanent Sentinel guides.</p></div><Link to="/watcher">Open Watcher →</Link></div><div className={styles.controls}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search names, developers, dependencies or status…"/><select value={risk} onChange={e=>setRisk(e.target.value)}><option value="all">All review priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select></div><div className={styles.resultLine}><strong>{items.length}</strong> projects shown <span>Compatibility, source reliability and review priority are scored separately.</span></div>{loading&&<p>Loading live registry…</p>}{error&&<p>{error}</p>}<div className={styles.grid}>{items.map(x=>{const intel=x.intelligence||{};const level=priorityLabel(x);const meta=registry.get(x.id);return <Link className={styles.card} key={x.id||x.name} to={`/plugins/${x.id}`}><div className={styles.cardHead}><span>{x.category}</span><b className={styles[level]}>{level} priority</b></div><h2>{x.name}</h2><p className={styles.version}>{x.detectedVersion||x.expectedVersion||x.expected||'Current official release'}</p><div className={styles.scoreGrid}><div><span>Compatibility</span><strong>{compatibilityLabel(meta)}</strong></div><div><span>Source</span><strong>{sourceLabel(x.status)}</strong></div><div><span>Health</span><strong>{x.healthScore??x.health??0}%</strong></div><div><span>Confidence</span><strong>{intel.confidence??x.confidence??0}%</strong></div></div><p className={styles.recommendation}>{intel.recommendation||x.recommendation||'Continue monitoring.'}</p><div className={styles.cardFoot}><span>{meta?.developer||'Verified source'}</span><strong>Open full profile →</strong></div></Link>})}</div></div></main></Layout>}
