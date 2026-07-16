import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {buildIntelligenceSnapshot} from '@site/src/data/intelligenceEngine';
import styles from './styles.module.css';

export default function IntelligenceCenter() {
  const reportUrl = useBaseUrl('/data/watcher-report.json');
  const [report, setReport] = useState(null);
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('all');

  useEffect(() => {
    fetch(`${reportUrl}?t=${Date.now()}`, {cache: 'no-store'})
      .then((response) => response.ok ? response.json() : null)
      .then(setReport)
      .catch(() => setReport(null));
  }, [reportUrl]);

  const snapshot = useMemo(() => buildIntelligenceSnapshot(report), [report]);
  const profiles = useMemo(() => snapshot.profiles.filter((profile) => {
    const text = `${profile.name} ${profile.developer} ${profile.category} ${profile.currentVersion}`.toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase())) && (risk === 'all' || profile.risk.key === risk);
  }), [snapshot, query, risk]);

  const cards = [
    ['Registry projects', snapshot.metrics.plugins],
    ['Knowledge links', snapshot.metrics.relationships],
    ['Resolved links', snapshot.metrics.resolvedRelationships],
    ['Needs mapping', snapshot.metrics.unresolvedRelationships],
    ['Golden Build', snapshot.metrics.goldenBuildPlugins],
    ['Watcher connected', snapshot.metrics.watcherConnected],
  ];

  return <Layout title="Sentinel Intelligence" description="Knowledge Graph, Plugin DNA and compatibility predictions for Project Sentinel.">
    <main className={styles.page}>
      <header className={styles.hero}><div className="container">
        <span className={styles.eyebrow}>Unified intelligence foundation</span>
        <Heading as="h1">Sentinel Intelligence</Heading>
        <p>The first shared intelligence layer connecting the Plugin Database, Watcher, compatibility evidence and Golden Build registry.</p>
        <div className={styles.heroActions}><Link to="/watcher">Open Watcher</Link><Link to="/compatibility">Compatibility Center</Link></div>
      </div></header>

      <section className={`container ${styles.content}`}>
        <div className={styles.metrics}>{cards.map(([label, value]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div>

        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>Plugin DNA</span><Heading as="h2">Intelligence profiles</Heading><p>Risk is calculated from registry verification, evidence confidence, dependency resolution and the latest Watcher state.</p></div></div>
        <div className={styles.filters}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, developers or categories" />
          <select value={risk} onChange={(event) => setRisk(event.target.value)}>
            <option value="all">All risk levels</option><option value="safe">Safe</option><option value="likelySafe">Likely safe</option><option value="unknown">Unknown</option><option value="highRisk">High risk</option><option value="breaking">Breaking</option>
          </select>
        </div>

        <div className={styles.grid}>{profiles.map((profile) => <article className={styles.profile} key={profile.id}>
          <div className={styles.profileTop}><div><span>{profile.category}</span><Heading as="h3">{profile.name}</Heading></div><b className={styles[profile.risk.tone]}>{profile.risk.label} · {profile.risk.score}</b></div>
          <p>{profile.developer} · {profile.currentVersion}</p>
          <dl><div><dt>Confidence</dt><dd>{profile.confidence}%</dd></div><div><dt>Dependencies</dt><dd>{profile.dependencies.length}</dd></div><div><dt>Used by</dt><dd>{profile.usedBy.length}</dd></div><div><dt>Golden Build</dt><dd>{profile.goldenBuild ? 'Yes' : 'No'}</dd></div></dl>
          <div className={styles.reason}>{profile.risk.reasons[0] || 'More evidence is required.'}</div>
          <Link to={profile.profile}>Open full profile →</Link>
        </article>)}</div>
      </section>
    </main>
  </Layout>;
}
