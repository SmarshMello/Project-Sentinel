import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const REPORT_URL = '/Project-Sentinel/data/watcher-report.json';
const HISTORY_URL = '/Project-Sentinel/data/watcher-history.json';

const toneForHealth = (value) => value >= 90 ? 'good' : value >= 75 ? 'watch' : 'risk';
const statusText = (report) => {
  const critical = report?.intelligenceCounts?.highRisk || 0;
  const reviews = report?.counts?.needsReview || 0;
  if (critical) return ['Critical attention', 'risk'];
  if (reviews) return ['Operational with reviews', 'watch'];
  return ['All systems nominal', 'good'];
};

export function useSentinelData() {
  const [state, setState] = useState({loading:true, report:null, history:[], error:null});
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch(`${REPORT_URL}?v=${Date.now()}`, {cache:'no-store'}).then(r => {if(!r.ok) throw new Error(`Report ${r.status}`); return r.json();}),
      fetch(`${HISTORY_URL}?v=${Date.now()}`, {cache:'no-store'}).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([report, history]) => active && setState({loading:false, report, history:Array.isArray(history) ? history : history?.runs || [], error:null}))
      .catch(error => active && setState({loading:false, report:null, history:[], error:error.message}));
    return () => {active = false;};
  }, []);
  return state;
}

function Metric({label, value, detail, tone='neutral'}) {
  return <div className={`${styles.metric} ${styles[tone]}`}><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>;
}

export default function MissionControl({compact=false}) {
  const {loading, report, history, error} = useSentinelData();
  const status = statusText(report);
  const actions = useMemo(() => (report?.reviewQueue || []).slice(0, 4), [report]);
  const medium = report?.intelligenceCounts?.mediumRisk || 0;
  const low = report?.intelligenceCounts?.lowRisk || 0;
  const categories = (report?.categories || []).slice().sort((a,b)=>(a.health ?? a.averageHealth ?? 0)-(b.health ?? b.averageHealth ?? 0)).slice(0, compact ? 4 : 8);
  const health = report?.averageHealth ?? 0;
  const last = Array.isArray(history) && history.length > 1 ? history[history.length - 2] : null;
  const previousHealth = last?.averageHealth ?? last?.health;
  const trend = typeof previousHealth === 'number' ? health - previousHealth : 0;

  if (loading) return <div className={styles.loading}>Connecting to Sentinel intelligence…</div>;
  if (error) return <div className={styles.error}>Mission Control could not load live Watcher data: {error}</div>;

  return <div className={styles.shell}>
    <section className={styles.commandBar}>
      <div>
        <div className={styles.eyebrow}>MISSION CONTROL // LIVE</div>
        <h2>{status[0]}</h2>
        <p>Last intelligence scan {new Date(report.checkedAt).toLocaleString()} · Watcher {report.watcherVersion}</p>
      </div>
      <div className={`${styles.score} ${styles[toneForHealth(health)]}`}><strong>{health}%</strong><span>Ecosystem health</span><small>{trend === 0 ? 'No change' : `${trend > 0 ? '+' : ''}${trend}% from prior scan`}</small></div>
    </section>

    <section className={styles.metrics}>
      <Metric label="Projects monitored" value={report.counts?.tracked ?? 0} detail="Across the LSPDFR ecosystem" />
      <Metric label="Critical" value={report.intelligenceCounts?.highRisk ?? 0} detail="Immediate attention" tone={(report.intelligenceCounts?.highRisk || 0) ? 'risk':'good'} />
      <Metric label="Needs review" value={report.counts?.needsReview ?? 0} detail={`${medium} medium-risk signals`} tone={(report.counts?.needsReview || 0) ? 'watch':'good'} />
      <Metric label="Possible updates" value={report.counts?.possibleUpdates ?? 0} detail="Release signals detected" tone={(report.counts?.possibleUpdates || 0) ? 'watch':'good'} />
      <Metric label="Healthy sources" value={report.counts?.healthy ?? 0} detail={`${low} low-risk records`} tone="good" />
      <Metric label="Latest runtime" value={`${report.durationSeconds ?? 0}s`} detail="Daily automated scan" />
    </section>

    <section className={styles.grid}>
      <article className={styles.panel}>
        <div className={styles.panelHead}><div><span>PRIORITY QUEUE</span><h3>Today’s actions</h3></div><Link to="/watcher">Open live scan →</Link></div>
        {actions.length ? <div className={styles.actions}>{actions.map((item,index)=><Link key={item.id || item.name || index} className={styles.action} to={`/operations/projects?id=${encodeURIComponent(item.id || '')}`}><div><strong>{item.name || item.title || item.id}</strong><span>{item.reviewReason || item.reason || item.status || 'Manual review recommended'}</span></div><b>Review</b></Link>)}</div> : <div className={styles.empty}><strong>No urgent actions.</strong><span>The currently published scan contains no review queue.</span></div>}
      </article>
      <article className={styles.panel}>
        <div className={styles.panelHead}><div><span>ECOSYSTEM COVERAGE</span><h3>Category readiness</h3></div><Link to="/operations/analytics">View analytics →</Link></div>
        <div className={styles.categories}>{categories.map((category,index)=>{const value=category.health ?? category.averageHealth ?? 0; return <div className={styles.category} key={category.name || index}><div><strong>{category.name}</strong><span>{category.needsReview ?? category.reviewCount ?? 0} review</span></div><div className={styles.track}><i style={{width:`${value}%`}}/></div><b>{value}%</b></div>})}</div>
      </article>
    </section>

    {!compact && <section className={styles.quickLinks}>
      <Link to="/watcher"><strong>Live Scan</strong><span>Run and monitor the Watcher.</span></Link>
      <Link to="/operations/projects"><strong>Project Profiles</strong><span>Inspect live project intelligence.</span></Link>
      <Link to="/operations/analytics"><strong>Analytics</strong><span>See health, risk and source trends.</span></Link>
      <Link to="/compatibility"><strong>Compatibility</strong><span>Validate dependencies and combinations.</span></Link>
      <Link to="/planner"><strong>Build Planner</strong><span>Create a controlled installation path.</span></Link>
      <Link to="/doctor"><strong>Sentinel Doctor</strong><span>Diagnose a broken installation.</span></Link>
    </section>}
  </div>;
}
