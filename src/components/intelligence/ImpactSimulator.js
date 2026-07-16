import React, {useMemo} from 'react';
import {simulateImpact} from '@site/src/intelligence/impactEngine';
import styles from './ImpactSimulator.module.css';
export default function ImpactSimulator({snapshot, selectedId, onSelect}) {
  const result = useMemo(() => simulateImpact(selectedId, snapshot.graph, snapshot.profiles), [selectedId, snapshot]);
  const selected = snapshot.profiles.find((item) => item.id === selectedId);
  return <div className={styles.panel}><div className={styles.head}><div><h3>Impact simulator</h3><p>Model the transitive retest workload before changing a plugin.</p></div><select value={selectedId} onChange={(e)=>onSelect(e.target.value)}>{snapshot.profiles.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
    <div className={styles.summary}><strong>{result.affected.length}</strong><span>projects affected by changing {selected?.name}</span></div>
    {result.affected.length === 0 && <p className={styles.empty}>No registered plugin currently declares a direct or transitive dependency on {selected?.name}. This does not mean the plugin is universally risk-free; manual integrations may still require testing.</p>}
    <div className={styles.groups}>{[['critical','Critical'],['medium','Medium'],['low','Low']].map(([key,label])=><section key={key}><h4>{label} · {result[key].length}</h4>{result[key].length ? <ol>{result[key].slice(0,10).map((item)=><li key={item.id}><b>#{result.plan.find((p)=>p.id===item.id)?.order}</b> {item.label}<span>depth {item.depth}{item.goldenBuild ? ' · Golden Build' : ''}</span></li>)}</ol>:<p>None</p>}</section>)}</div>
  </div>;
}
