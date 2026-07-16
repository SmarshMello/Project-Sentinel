import React, {useMemo, useState} from 'react';
import Heading from '@theme/Heading';
import styles from './CaseHistory.module.css';

function formatDate(value) {
  if (!value) return 'Unknown date';
  try { return new Date(value).toLocaleString(); } catch { return value; }
}

export default function CaseHistory({cases, onOpen, onUpdate, onDelete, onClear}) {
  const [filter, setFilter] = useState('all');
  const visible = useMemo(() => cases.filter((item) => filter === 'all' || item.status === filter), [cases, filter]);
  const openCount = cases.filter((item) => item.status !== 'resolved').length;

  return <section className={styles.historyCard}>
    <div className={styles.header}>
      <div><span>Doctor memory</span><Heading as="h2">Intelligence case history</Heading><p>Reopen earlier investigations, track their state, and preserve what still needs validation.</p></div>
      <div className={styles.headerActions}><b>{openCount} active · {cases.length} saved</b>{cases.length > 0 && <button type="button" onClick={onClear}>Clear history</button>}</div>
    </div>
    <div className={styles.filters}>
      {['all', 'open', 'monitoring', 'resolved'].map((status) => <button type="button" key={status} className={filter === status ? styles.activeFilter : ''} onClick={() => setFilter(status)}>{status}</button>)}
    </div>
    {visible.length === 0 ? <div className={styles.empty}>No {filter === 'all' ? '' : `${filter} `}Doctor cases are saved yet. Create one from an Intelligence profile.</div> : <div className={styles.caseList}>
      {visible.map((item) => <article key={item.id} className={styles.caseRow}>
        <div className={styles.caseMain}><div className={styles.caseTitle}><b>{item.pluginName}</b><span className={`${styles.status} ${styles[item.status] || ''}`}>{item.status}</span><span>{item.severity} priority</span></div><p>{item.summary}</p><small>Created {formatDate(item.createdAt)} · Updated {formatDate(item.updatedAt)}</small></div>
        <div className={styles.caseMetrics}><span><b>{item.riskScore}</b> risk</span><span>{item.recommendation}</span><span>{item.affectedProjects?.length || 0} retests</span></div>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={() => onOpen(item.id)}>Open case</button>
          <select aria-label={`Status for ${item.pluginName}`} value={item.status || 'open'} onChange={(event) => onUpdate(item.id, {status: event.target.value})}><option value="open">Open</option><option value="monitoring">Monitoring</option><option value="resolved">Resolved</option></select>
          <button type="button" onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      </article>)}
    </div>}
  </section>;
}
