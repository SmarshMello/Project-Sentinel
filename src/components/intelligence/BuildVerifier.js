import React, {useMemo, useState} from 'react';
import {verifyBuild} from '@site/src/intelligence/buildVerifierEngine';
import styles from './BuildVerifier.module.css';

export default function BuildVerifier({snapshot, onSelect}) {
  const goldenIds = snapshot.profiles.filter((p) => p.goldenBuild).map((p) => p.id);
  const [mode, setMode] = useState('golden');
  const [custom, setCustom] = useState(goldenIds);
  const ids = mode === 'golden' ? goldenIds : custom;
  const report = useMemo(() => verifyBuild(ids, snapshot.graph, snapshot.profiles), [ids, snapshot]);
  return <section className={styles.panel}>
    <div className={styles.head}><div><h3>Build verifier</h3><p>Run a pre-flight audit before launching GTA V or promoting a Golden Build.</p></div><select value={mode} onChange={(e)=>setMode(e.target.value)}><option value="golden">Current Golden Build</option><option value="custom">Custom selection</option></select></div>
    {mode === 'custom' && <div className={styles.custom}>{snapshot.profiles.map((profile)=><label key={profile.id}><input type="checkbox" checked={custom.includes(profile.id)} onChange={()=>setCustom((items)=>items.includes(profile.id)?items.filter((id)=>id!==profile.id):[...items,profile.id])}/>{profile.name}</label>)}</div>}
    <div className={styles.score}><strong>{report.score}%</strong><div><b>{report.status === 'verified' ? 'Ready for controlled launch' : report.status === 'review' ? 'Review recommended' : 'Build blocked'}</b><span>{report.selectedCount} plugins · {report.counts.error} errors · {report.counts.warning} warnings</span></div></div>
    <div className={styles.bar}><i style={{width:`${report.score}%`}}/></div>
    {report.findings.length ? <div className={styles.findings}>{report.findings.slice(0,18).map((finding,index)=><button type="button" onClick={()=>finding.pluginId&&onSelect(finding.pluginId)} key={`${finding.type}-${finding.pluginId}-${index}`} className={styles[finding.severity]}><b>{finding.severity}</b><span>{finding.message}</span></button>)}</div> : <div className={styles.clean}>No blocking dependency, risk, version, or confidence findings were detected.</div>}
  </section>;
}
