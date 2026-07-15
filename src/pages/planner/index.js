import React,{useEffect,useMemo,useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {plugins} from '@site/src/data/plugins';
import {plannerProfiles} from '@site/src/data/planner';
import styles from './styles.module.css';

const PLANNER_KEY='sentinelPlannerSelection';

export default function Planner(){
 const [profile,setProfile]=useState('realistic');
 const [performance,setPerformance]=useState('balanced');
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(PLANNER_KEY)||'null');if(saved?.profile&&plannerProfiles[saved.profile])setProfile(saved.profile);if(['fps','balanced','realism'].includes(saved?.performance))setPerformance(saved.performance);}catch{}},[]);
 const chosen=useMemo(()=>plannerProfiles[profile].ids.map(id=>plugins.find(p=>p.id===id)).filter(Boolean).filter(p=>performance!=='fps'||p.impact!=='Medium'),[profile,performance]);
 useEffect(()=>{localStorage.setItem(PLANNER_KEY,JSON.stringify({profile,profileLabel:plannerProfiles[profile].label,performance,ids:chosen.map(p=>p.id),updatedAt:new Date().toISOString()}));},[profile,performance,chosen]);
 const confidence=Math.round(chosen.reduce((a,p)=>a+p.confidence,0)/chosen.length);
 const warnings=chosen.filter(p=>!['verified'].includes(p.status));
 const exportPlan=()=>{const text=[`PROJECT SENTINEL BUILD PLAN`,plannerProfiles[profile].label,`Performance: ${performance}`,`Confidence: ${confidence}%`,'',...chosen.map((p,i)=>`${i+1}. ${p.name} — ${p.version} [${p.status}]`) ].join('\n'); const blob=new Blob([text],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='project-sentinel-build-plan.txt';a.click();URL.revokeObjectURL(url)};
 return <Layout title="Build Planner" description="Generate a Project Sentinel LSPDFR build plan."><main className={styles.page}><header className={styles.hero}><div className="container"><span>Interactive planning system</span><Heading as="h1">Build Planner</Heading><p>Choose your patrol style and performance target. Sentinel will assemble a compatible installation path from the current registry.</p></div></header><section className={styles.body}><div className="container"><div className={styles.layout}><aside className={styles.controls}><Heading as="h2">1. Patrol profile</Heading>{Object.entries(plannerProfiles).map(([id,p])=><button key={id} className={profile===id?styles.active:''} onClick={()=>setProfile(id)}><strong>{p.label}</strong><span>{p.description}</span></button>)}<Heading as="h2">2. Performance target</Heading><select value={performance} onChange={e=>setPerformance(e.target.value)}><option value="fps">Maximum FPS</option><option value="balanced">Balanced</option><option value="realism">Maximum realism</option></select></aside><section className={styles.result}><div className={styles.summary}><div><span>Recommended components</span><strong>{chosen.length}</strong></div><div><span>Average confidence</span><strong>{confidence}%</strong></div><div><span>Warnings</span><strong>{warnings.length}</strong></div></div><div className={styles.banner}><div><span>Generated profile</span><Heading as="h2">{plannerProfiles[profile].label}</Heading><small>Automatically synced to Sentinel AI on this browser.</small></div><button onClick={exportPlan}>Export plan</button></div><ol className={styles.list}>{chosen.map((p,i)=><li key={p.id}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{p.name}</strong><small>{p.version} · {p.impact} impact</small></div><b className={styles[p.status]}>{p.status}</b><Link to={`/plugins/${p.id}`}>Details →</Link></li>)}</ol>{warnings.length>0&&<div className={styles.warning}><strong>Testing content included.</strong> Create a backup and add these plugins one at a time.</div>}<Link className={styles.checklistLink} to="/checklist">Open interactive installation checklist →</Link></section></div></div></section></main></Layout>
}
