import React, {useMemo, useState} from 'react';
import {createInstallationPlan} from '@site/src/intelligence/buildPlannerEngine';
import styles from './BuildPlanner.module.css';

export default function BuildPlanner({snapshot, selectedId, onSelect}) {
  const [selected, setSelected] = useState(() => snapshot.profiles.filter((p) => p.goldenBuild).map((p) => p.id));
  const plan = useMemo(() => createInstallationPlan(selected, snapshot.graph, snapshot.profiles), [selected, snapshot]);
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <section className={styles.panel}>
    <div className={styles.head}><div><h3>Build planner</h3><p>Select plugins and Sentinel automatically adds dependencies and creates a safe installation order.</p></div><button type="button" onClick={() => setSelected(snapshot.profiles.filter((p) => p.goldenBuild).map((p) => p.id))}>Load Golden Build</button></div>
    <div className={styles.body}>
      <div className={styles.selector}>
        <input placeholder="Filter plugins" aria-label="Filter build planner plugins" onChange={(event) => {
          const text = event.target.value.toLowerCase();
          event.currentTarget.parentElement.querySelectorAll('label').forEach((label) => {label.hidden = !label.dataset.search.includes(text);});
        }}/>
        <div className={styles.choices}>{snapshot.profiles.map((profile) => <label key={profile.id} data-search={`${profile.name} ${profile.category}`.toLowerCase()} className={selectedId === profile.id ? styles.focused : ''}><input type="checkbox" checked={selected.includes(profile.id)} onChange={() => toggle(profile.id)}/><span onClick={() => onSelect(profile.id)}>{profile.name}<small>{profile.category} · {profile.currentVersion}</small></span></label>)}</div>
      </div>
      <div className={styles.plan}>
        <div className={styles.summary}><strong>{plan.steps.length}</strong><span>installation steps</span><b>{plan.autoAddedIds.length} dependencies added automatically</b></div>
        {plan.warnings.map((warning) => <div className={styles.warning} key={warning.type}>{warning.message}</div>)}
        {plan.steps.length ? <ol>{plan.steps.map((step) => <li key={step.id}><b>{step.order}</b><div><strong>{step.name}</strong><span>{step.version} · {step.recommendation}{step.autoAdded ? ' · dependency' : ''}</span></div></li>)}</ol> : <p>Select at least one plugin to build a plan.</p>}
      </div>
    </div>
  </section>;
}
