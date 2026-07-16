import React, {useMemo, useState} from 'react';
import {buildPluginTimeline, summarizeTimeline} from '@site/src/intelligence/timelineEngine';
import styles from './PluginTimeline.module.css';

const FILTERS = [
  ['all', 'All events'],
  ['release', 'Releases'],
  ['watcher', 'Watcher'],
  ['doctor', 'Doctor'],
  ['build', 'Build'],
];

function formatDate(value) {
  if (!value) return 'Current registry baseline';
  try { return new Date(value).toLocaleString(); } catch { return value; }
}

export default function PluginTimeline({profile, doctorCases = []}) {
  const [filter, setFilter] = useState('all');
  const events = useMemo(() => buildPluginTimeline(profile, doctorCases), [profile, doctorCases]);
  const summary = useMemo(() => summarizeTimeline(events), [events]);
  const visible = filter === 'all' ? events : events.filter((item) => item.type === filter);

  return <section className={styles.timelineCard}>
    <div className={styles.header}>
      <div><span>Plugin lifecycle</span><h4>Intelligence timeline</h4><p>Watcher signals, releases, Doctor investigations, registry baselines, and Golden Build state in one chronological record.</p></div>
      <div className={styles.counts}><b>{summary.total} events</b><span>{summary.doctor} Doctor · {summary.releases} release</span></div>
    </div>
    <div className={styles.filters}>{FILTERS.map(([key, label]) => <button type="button" key={key} className={filter === key ? styles.active : ''} onClick={() => setFilter(key)}>{label}</button>)}</div>
    <div className={styles.list}>
      {visible.length === 0 ? <p className={styles.empty}>No {filter} events are recorded for this plugin yet.</p> : visible.map((item) => <article className={styles.event} key={item.id}>
        <div className={`${styles.marker} ${styles[item.tone] || ''}`} aria-hidden="true" />
        <div className={styles.eventBody}>
          <div className={styles.eventTop}><b>{item.title}</b><span>{formatDate(item.date)}</span></div>
          <p>{item.detail}</p>
          <div className={styles.tags}><span>{item.type}</span>{item.version && <span>Version {item.version}</span>}{item.status && <span>{item.status}</span>}</div>
        </div>
      </article>)}
    </div>
  </section>;
}
