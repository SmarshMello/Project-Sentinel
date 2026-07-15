import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const STATUS_LABELS = {
  healthy: 'Healthy',
  'possible-update': 'Possible update',
  'metadata-changed': 'Metadata changed',
  'timed-out': 'Timed out',
  blocked: 'Automation blocked',
  redirected: 'Redirected',
  'not-found': 'Not found',
  'rate-limited': 'Rate limited',
  'server-error': 'Server error',
  archived: 'Archived',
  failed: 'Failed',
  unknown: 'Unknown',
};

const FILTERS = ['review', 'all', 'possible-update', 'healthy', 'metadata-changed', 'timed-out', 'blocked', 'not-found', 'archived'];

export default function Watcher() {
  const reportUrl = useBaseUrl('/data/watcher-report.json');
  const [report, setReport] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('review');

  useEffect(() => {
    fetch(reportUrl)
      .then((response) => response.json())
      .then(setReport)
      .catch(() => setReport({counts: {}, items: [], reviewQueue: []}));
  }, [reportUrl]);

  const items = useMemo(() => {
    const all = report?.items || [];
    const normalizedQuery = query.trim().toLowerCase();
    return all.filter((item) => {
      const text = `${item.name} ${item.category} ${item.status} ${item.note} ${item.reviewReason}`.toLowerCase();
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'review' && item.needsReview) ||
        item.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [report, query, filter]);

  const counts = report?.counts || {};
  const metrics = [
    ['Tracked', counts.tracked],
    ['Healthy', counts.healthy],
    ['Possible updates', counts.possibleUpdates],
    ['Timed out', counts.timedOut],
    ['Blocked', counts.blocked],
    ['Not found', counts.notFound],
    ['High priority', counts.highPriority],
    ['Needs review', counts.needsReview],
  ];

  return (
    <Layout title="Sentinel Watcher" description="Automated monitoring and review queues for the LSPDFR mod ecosystem.">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <span className={styles.eyebrow}>Project Sentinel maintenance system</span>
            <Heading as="h1">Sentinel Watcher</Heading>
            <p>
              Smarter scheduled checks for mod pages, GitHub releases, redirects, broken links,
              archived repositories, timeouts and changes that need human review.
            </p>
            <div className={styles.actions}>
              <a href="https://github.com/SmarshMello/Project-Sentinel/actions/workflows/sentinel-watcher.yml">Open workflow</a>
              <Link to="/plugins">Browse database</Link>
            </div>
          </div>
        </header>

        <section className="container">
          <div className={styles.notice}>
            <b>Review-first automation</b>
            <span>
              Watcher 0.3 tracks repeated failures, health scores and possible releases. One timeout, one 404 or one metadata change does not become a major alert.
            </span>
          </div>

          <div className={styles.metrics}>
            {metrics.map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value ?? '—'}</strong>
              </article>
            ))}
          </div>

          <div className={styles.legend}>
            {['healthy', 'possible-update', 'metadata-changed', 'timed-out', 'blocked', 'redirected', 'not-found', 'archived'].map((status) => (
              <span key={status} className={`${styles.state} ${styles[status] || ''}`}>{STATUS_LABELS[status]}</span>
            ))}
          </div>

          <div className={styles.toolbar}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search monitored projects…" />
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              {FILTERS.map((value) => <option key={value} value={value}>{value === 'review' ? 'Needs review' : value === 'all' ? 'All tracked' : STATUS_LABELS[value]}</option>)}
            </select>
          </div>

          <div className={styles.meta}>
            Latest published scan: {report?.checkedAt ? new Date(report.checkedAt).toLocaleString() : 'Loading…'} · Showing {items.length} records · Watcher {report?.watcherVersion || '—'} · Average health {report?.averageHealth ?? '—'}% · Runtime {report?.durationSeconds ?? '—'}s
          </div>

          <div className={styles.list}>
            {items.map((item) => (
              <article key={item.id}>
                <div className={styles.mainInfo}>
                  <div className={styles.badges}>
                    <span className={`${styles.state} ${styles[item.status] || ''}`}>{STATUS_LABELS[item.status] || item.status}</span>
                    {item.reviewPriority && item.reviewPriority !== 'none' && <span className={`${styles.priority} ${styles[item.reviewPriority]}`}>{item.reviewPriority} priority</span>}
                  </div>
                  <Heading as="h2">{item.name}</Heading>
                  <p>{item.category} · Expected: {item.expectedVersion}</p>
                  {(item.latestRelease || item.detectedVersion) && <small>Detected: <b>{item.latestRelease || item.detectedVersion}</b></small>}
                  {item.note && <small>{item.note}</small>}
                  <small>Health: <b>{item.healthScore ?? '—'}%</b>{item.statusStreak > 1 ? ` · ${item.statusStreak} consecutive scans` : ''}</small>
                  {item.reviewReason && item.needsReview && <small className={styles.reason}>{item.reviewReason}</small>}
                </div>
                <dl>
                  <div><dt>HTTP</dt><dd>{item.httpStatus ?? '—'}</dd></div>
                  <div><dt>Attempts</dt><dd>{item.attempts ?? '—'}</dd></div>
                  <div><dt>Latest release</dt><dd>{item.latestRelease || 'Not detected'}</dd></div>
                  <div><dt>Sentinel Police</dt><dd>{item.sentinelPolice ? 'Yes' : 'No'}</dd></div>
                </dl>
                <a href={item.finalUrl || item.url}>Open official source →</a>
              </article>
            ))}
          </div>

          {!items.length && <div className={styles.empty}>No records match this view. Run the workflow manually to generate a fresh report.</div>}
        </section>
      </main>
    </Layout>
  );
}
