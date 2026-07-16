import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
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
const POLL_MS = 4000;

function formatElapsed(seconds) {
  const safe = Math.max(0, seconds || 0);
  const minutes = Math.floor(safe / 60).toString().padStart(2, '0');
  const remainder = Math.floor(safe % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export default function Watcher() {
  const {siteConfig} = useDocusaurusContext();
  const controlEndpoint = String(siteConfig.customFields?.watcherControlEndpoint || '').replace(/\/$/, '');
  const reportUrl = useBaseUrl('/data/watcher-report.json');
  const historyUrl = useBaseUrl('/data/watcher-history.json');
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState('');
  const [history, setHistory] = useState({scans: []});
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('review');
  const [adminKey, setAdminKey] = useState('');
  const [run, setRun] = useState(null);
  const [runError, setRunError] = useState('');
  const [starting, setStarting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [publishStatus, setPublishStatus] = useState('');
  const pollRef = useRef(null);
  const timerRef = useRef(null);
  const publishPollRef = useRef(null);
  const preScanReportRef = useRef(null);

  const loadReport = useCallback(async () => {
    try {
      const response = await fetch(`${reportUrl}?t=${Date.now()}`, {cache: 'no-store'});
      if (!response.ok) throw new Error(`Report returned HTTP ${response.status}`);
      const nextReport = await response.json();
      setReport(nextReport);
      setReportError('');
      try {
        const historyResponse = await fetch(`${historyUrl}?t=${Date.now()}`, {cache: 'no-store'});
        if (historyResponse.ok) setHistory(await historyResponse.json());
      } catch {}
      return nextReport;
    } catch (error) {
      setReportError(error instanceof Error ? error.message : 'Could not load the report.');
      setReport((current) => current || {counts: {}, items: [], reviewQueue: []});
      return null;
    }
  }, [reportUrl, historyUrl]);

  const waitForPublishedReport = useCallback((previousCheckedAt, attempt = 0) => {
    const maxAttempts = 72;
    setPublishStatus(attempt === 0 ? 'GitHub Pages is publishing the new report…' : `Waiting for GitHub Pages… ${attempt * 5}s`);
    publishPollRef.current = window.setTimeout(async () => {
      const nextReport = await loadReport();
      const isNewReport = nextReport?.checkedAt && nextReport.checkedAt !== previousCheckedAt;
      const hasIntelligence = Number(nextReport?.schemaVersion || 0) >= 6 && nextReport?.intelligenceCounts && Array.isArray(nextReport?.categories);
      if (isNewReport && hasIntelligence) {
        setPublishStatus('New Watcher 0.7 intelligence report is live.');
        return;
      }
      if (attempt + 1 >= maxAttempts) {
        setPublishStatus('The scan finished and the Pages deployment was triggered, but the new report is still publishing. Check the Pages workflow or refresh shortly.');
        return;
      }
      waitForPublishedReport(previousCheckedAt, attempt + 1);
    }, attempt === 0 ? 5000 : 5000);
  }, [loadReport]);

  useEffect(() => {
    loadReport();
    if (typeof window !== 'undefined') setAdminKey(window.sessionStorage.getItem('sentinel-watcher-admin-key') || '');
  }, [loadReport]);

  useEffect(() => () => {
    if (pollRef.current) clearTimeout(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (publishPollRef.current) clearTimeout(publishPollRef.current);
  }, []);

  const pollStatus = useCallback(async (scanId, runId, key) => {
    try {
      const params = new URLSearchParams(runId ? {runId: String(runId)} : {scanId});
      const response = await fetch(`${controlEndpoint}/status?${params}`, {
        headers: {'x-watcher-key': key},
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `Status request failed (${response.status})`);
      setRun(payload);
      setRunError('');
      if (payload.status === 'completed') {
        if (pollRef.current) clearTimeout(pollRef.current);
        waitForPublishedReport(preScanReportRef.current, 0);
        return;
      }
      pollRef.current = window.setTimeout(() => pollStatus(scanId, payload.runId || runId, key), POLL_MS);
    } catch (error) {
      setRunError(error instanceof Error ? error.message : 'Could not read scan progress.');
    }
  }, [controlEndpoint, waitForPublishedReport]);

  const forgetAdminKey = () => {
    setAdminKey('');
    if (typeof window !== 'undefined') window.sessionStorage.removeItem('sentinel-watcher-admin-key');
    setRunError('Watcher admin key cleared from this browser tab.');
  };

  const startScan = async () => {
    if (!controlEndpoint) {
      setRunError('Watcher Control Worker is not connected yet. Follow WATCHER_CONTROL_SETUP.md.');
      return;
    }
    if (!adminKey.trim()) {
      setRunError('Enter your private Watcher admin key first.');
      return;
    }
    setStarting(true);
    setRunError('');
    setRun({status: 'queued', percent: 1, activeStep: 'Sending scan request…', steps: []});
    setElapsed(0);
    setPublishStatus('');
    preScanReportRef.current = report?.checkedAt || null;
    if (typeof window !== 'undefined') window.sessionStorage.setItem('sentinel-watcher-admin-key', adminKey.trim());
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    try {
      const response = await fetch(`${controlEndpoint}/trigger`, {
        method: 'POST',
        headers: {'content-type': 'application/json', 'x-watcher-key': adminKey.trim()},
        body: JSON.stringify({}),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `Scan request failed (${response.status})`);
      setRun({status: 'queued', percent: 2, activeStep: 'Waiting for GitHub Actions…', scanId: payload.scanId, steps: []});
      pollStatus(payload.scanId, null, adminKey.trim());
    } catch (error) {
      setRunError(error instanceof Error ? error.message : 'Could not start the scan.');
      setRun(null);
      if (timerRef.current) clearInterval(timerRef.current);
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    if (run?.status === 'completed' && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [run?.status]);

  const items = useMemo(() => {
    const all = report?.items || [];
    const normalizedQuery = query.trim().toLowerCase();
    return all.filter((item) => {
      const text = `${item.name} ${item.category} ${item.status} ${item.note || ''} ${item.reviewReason || ''}`.toLowerCase();
      return (!normalizedQuery || text.includes(normalizedQuery)) &&
        (filter === 'all' || (filter === 'review' && item.needsReview) || item.status === filter);
    });
  }, [report, query, filter]);

  const counts = report?.counts || {};
  const metrics = [
    ['Tracked', counts.tracked], ['Healthy', counts.healthy], ['Possible updates', counts.possibleUpdates],
    ['Timed out', counts.timedOut], ['Blocked', counts.blocked], ['Not found', counts.notFound],
    ['High priority', counts.highPriority], ['Needs review', counts.needsReview],
  ];
  const running = run && run.status !== 'completed';
  const changes = report?.changes || [];
  const recentScans = history?.scans || [];
  const previousScan = recentScans[1] || null;
  const healthDelta = previousScan ? (report?.averageHealth ?? 0) - (previousScan.averageHealth ?? 0) : null;
  const intelligenceItems = report?.items || [];
  const intelligenceCounts = report?.intelligenceCounts || intelligenceItems.reduce((totals, item) => {
    const level = item.intelligence?.riskLevel;
    if (level === 'high') totals.highRisk += 1;
    if (level === 'medium') totals.mediumRisk += 1;
    if (level === 'low') totals.lowRisk += 1;
    if (item.status === 'healthy') totals.stable += 1;
    return totals;
  }, {highRisk: 0, mediumRisk: 0, lowRisk: 0, stable: 0});
  const categories = report?.categories || Object.values(intelligenceItems.reduce((groups, item) => {
    const name = item.category || 'Other';
    const group = groups[name] || {name, tracked: 0, healthTotal: 0, needsReview: 0};
    group.tracked += 1;
    group.healthTotal += Number(item.healthScore || 0);
    group.needsReview += item.needsReview ? 1 : 0;
    groups[name] = group;
    return groups;
  }, {})).map((group) => ({...group, averageHealth: group.tracked ? Math.round(group.healthTotal / group.tracked) : 0})).sort((a, b) => a.averageHealth - b.averageHealth || b.needsReview - a.needsReview);
  const riskClass = (value) => styles[`risk${String(value || 'medium').replace(/^./, (letter) => letter.toUpperCase())}`] || '';

  return (
    <Layout title="Sentinel Watcher" description="Automated monitoring and review queues for the LSPDFR mod ecosystem.">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <span className={styles.eyebrow}>Project Sentinel maintenance system</span>
            <Heading as="h1">Sentinel Watcher</Heading>
            <p>Scheduled ecosystem checks with a secure one-click control panel, live GitHub Actions progress and review-first reporting.</p>
            <div className={styles.actions}>
              <a href="https://github.com/SmarshMello/Project-Sentinel/actions/workflows/sentinel-watcher.yml">Open workflow</a>
              <Link to="/plugins">Browse database</Link>
            </div>
          </div>
        </header>

        <nav className={styles.operationsNav}>
          <div className="container">
            <Link to="/">Operations center</Link>
            <Link className={styles.operationsActive} to="/watcher">Live scan</Link>
            <Link to="/operations/projects">Project profiles</Link>
            <Link to="/operations/analytics">Analytics</Link>
            <Link to="/compatibility">Compatibility</Link>
          </div>
        </nav>

        <section className="container">
          <div className={styles.controlPanel}>
            <div className={styles.controlHeader}>
              <div>
                <span className={styles.panelLabel}>Watcher control</span>
                <Heading as="h2">Run a fresh ecosystem scan</Heading>
                <p>The private key stays in this browser session and is sent only to your Cloudflare Worker.</p>
              </div>
              <span className={`${styles.connection} ${controlEndpoint ? styles.connected : styles.unconfigured}`}>
                {controlEndpoint ? 'Worker connected' : 'Worker setup required'}
              </span>
            </div>
            <div className={styles.controlRow}>
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Private Watcher admin key"
                autoComplete="current-password"
              />
              <button type="button" onClick={startScan} disabled={starting || running}>
                {running ? 'Scan running…' : starting ? 'Starting…' : 'Run new scan'}
              </button>
              <button type="button" className={styles.secondaryButton} onClick={forgetAdminKey} disabled={!adminKey || running}>Forget key</button>
            </div>
            {run && (
              <div className={styles.progressPanel}>
                <div className={styles.progressTop}>
                  <div><b>{run.activeStep || 'Preparing scan'}</b><span>{run.status || 'queued'}</span></div>
                  <strong>{formatElapsed(elapsed)}</strong>
                </div>
                <div className={styles.progressTrack}><span style={{width: `${Math.max(2, run.percent || 0)}%`}} /></div>
                <div className={styles.progressMeta}>
                  <span>{run.percent ?? 0}%</span>
                  {run.runUrl && <a href={run.runUrl}>Open active GitHub run →</a>}
                </div>
                {!!run.steps?.length && (
                  <div className={styles.steps}>
                    {run.steps.map((step, index) => (
                      <span key={`${step.job}-${step.name}-${index}`} data-status={step.status}>
                        {step.status === 'completed' ? (step.conclusion === 'success' ? '✓' : '×') : step.status === 'in_progress' ? '●' : '○'} {step.name}
                      </span>
                    ))}
                  </div>
                )}
                {run.status === 'completed' && run.conclusion === 'success' && <div className={styles.success}>{publishStatus || 'Scan complete. Waiting for GitHub Pages to publish the new data…'}</div>}
              </div>
            )}
            {runError && <div className={styles.error}>{runError}</div>}
          </div>

          <div className={styles.notice}><b>Daily intelligence automation</b><span>Watcher now scans every day, assigns risk and confidence, recommends the next action, and never treats a timeout or bot block as proof that a mod is dead.</span></div>

          <div className={styles.intelligenceGrid}>
            <article>
              <div className={styles.sectionHeading}><div><span className={styles.panelLabel}>Watcher 0.7</span><Heading as="h2">Intelligence summary</Heading></div><strong>{intelligenceCounts.highRisk ?? '—'}</strong></div>
              <div className={styles.riskSummary}><span className={styles.riskHigh}>High risk <b>{intelligenceCounts.highRisk ?? '—'}</b></span><span className={styles.riskMedium}>Medium <b>{intelligenceCounts.mediumRisk ?? '—'}</b></span><span className={styles.riskLow}>Low <b>{intelligenceCounts.lowRisk ?? '—'}</b></span><span>Stable <b>{intelligenceCounts.stable ?? '—'}</b></span></div>
              <p>Risk is based on source status, repeated failures, release signals and source quality. It is a review aid, not an automatic compatibility verdict.</p>
            </article>
            <article>
              <div className={styles.sectionHeading}><div><span className={styles.panelLabel}>Ecosystem coverage</span><Heading as="h2">Category health</Heading></div><strong>{categories.length || '—'}</strong></div>
              <div className={styles.categoryList}>{categories.slice(0,6).map((category) => <div key={category.name}><span>{category.name}</span><div className={styles.healthTrack}><i style={{width:`${category.averageHealth || 0}%`}} /></div><b>{category.averageHealth}%</b><small>{category.needsReview} review</small></div>)}</div>
            </article>
          </div>

          <div className={styles.operationsGrid}>
            <article className={styles.changeCard}>
              <div className={styles.sectionHeading}>
                <div><span className={styles.panelLabel}>Since the previous scan</span><Heading as="h2">What changed</Heading></div>
                <strong>{changes.length}</strong>
              </div>
              {changes.length ? <div className={styles.changeList}>{changes.slice(0, 6).map((change, index) => (
                <div key={`${change.id}-${change.type}-${index}`}>
                  <span className={`${styles.changeType} ${styles[change.priority] || ''}`}>{change.type.replaceAll('-', ' ')}</span>
                  <div><b>{change.name}</b><small>{change.summary}</small></div>
                </div>
              ))}</div> : <div className={styles.quietState}>No meaningful changes were detected. The ecosystem matches the previous published scan.</div>}
              {changes.length > 6 && <small className={styles.moreChanges}>+{changes.length - 6} more changes are included in the records below.</small>}
            </article>
            <article className={styles.historyCard}>
              <div className={styles.sectionHeading}>
                <div><span className={styles.panelLabel}>Last {Math.min(recentScans.length, 8)} runs</span><Heading as="h2">Scan history</Heading></div>
                <strong className={healthDelta > 0 ? styles.deltaUp : healthDelta < 0 ? styles.deltaDown : ''}>{healthDelta === null ? '—' : `${healthDelta > 0 ? '+' : ''}${healthDelta}%`}</strong>
              </div>
              <div className={styles.historyList}>{recentScans.slice(0, 8).map((scan, index) => (
                <div key={scan.checkedAt}>
                  <span>{index === 0 ? 'Latest' : new Date(scan.checkedAt).toLocaleDateString()}</span>
                  <div className={styles.healthTrack}><i style={{width: `${scan.averageHealth || 0}%`}} /></div>
                  <b>{scan.averageHealth ?? '—'}%</b>
                  <small>{scan.durationSeconds ?? '—'}s</small>
                </div>
              ))}</div>
              {!recentScans.length && <div className={styles.quietState}>History begins after the first Watcher 0.5 scan.</div>}
            </article>
          </div>

          <div className={styles.metrics}>{metrics.map(([label, value]) => <article key={label}><span>{label}</span><strong>{value ?? '—'}</strong></article>)}</div>
          <div className={styles.legend}>{['healthy','possible-update','metadata-changed','timed-out','blocked','redirected','not-found','archived'].map((status) => <span key={status} className={`${styles.state} ${styles[status] || ''}`}>{STATUS_LABELS[status]}</span>)}</div>
          <div className={styles.toolbar}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search monitored projects…" />
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>{FILTERS.map((value) => <option key={value} value={value}>{value === 'review' ? 'Needs review' : value === 'all' ? 'All tracked' : STATUS_LABELS[value]}</option>)}</select>
          </div>
          <div className={styles.meta}>Latest published scan: {report?.checkedAt ? new Date(report.checkedAt).toLocaleString() : 'Loading…'} · Showing {items.length} records · Watcher {report?.watcherVersion || '—'} · Average health {report?.averageHealth ?? '—'}% · Runtime {report?.durationSeconds ?? '—'}s</div>
          {reportError && <div className={styles.error}>Dashboard data could not load: {reportError}</div>}
          <div className={styles.list}>{items.map((item) => (
            <article key={item.id}>
              <div className={styles.mainInfo}>
                <div className={styles.badges}><span className={`${styles.state} ${styles[item.status] || ''}`}>{STATUS_LABELS[item.status] || item.status}</span>{item.reviewPriority && item.reviewPriority !== 'none' && <span className={`${styles.priority} ${styles[item.reviewPriority]}`}>{item.reviewPriority} priority</span>}</div>
                <Heading as="h2">{item.name}</Heading><p>{item.category} · Expected: {item.expectedVersion}</p>
                {(item.latestRelease || item.detectedVersion) && <small>Detected: <b>{item.latestRelease || item.detectedVersion}</b></small>}
                {item.note && <small>{item.note}</small>}<small>Health: <b>{item.healthScore ?? '—'}%</b>{item.statusStreak > 1 ? ` · ${item.statusStreak} consecutive scans` : ''}</small>
                {item.reviewReason && item.needsReview && <small className={styles.reason}>{item.reviewReason}</small>}
                {item.intelligence && <div className={styles.intelligence}><span className={riskClass(item.intelligence.riskLevel)}>{item.intelligence.riskLevel} risk</span><small><b>{item.intelligence.confidence}% confidence</b> · {item.intelligence.recommendation}</small></div>}
              </div>
              <dl><div><dt>HTTP</dt><dd>{item.httpStatus ?? '—'}</dd></div><div><dt>Attempts</dt><dd>{item.attempts ?? '—'}</dd></div><div><dt>Latest release</dt><dd>{item.latestRelease || 'Not detected'}</dd></div><div><dt>Sentinel Police</dt><dd>{item.sentinelPolice ? 'Yes' : 'No'}</dd></div></dl>
              <a href={item.finalUrl || item.url}>Open official source →</a>
            </article>
          ))}</div>
          {!items.length && <div className={styles.empty}>No records match this view.</div>}
        </section>
      </main>
    </Layout>
  );
}
