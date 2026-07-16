import React, {useEffect, useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {buildIntelligenceSnapshot} from '@site/src/data/intelligenceEngine';
import ReleaseDetails from '@site/src/components/intelligence/ReleaseDetails';
import DependencyGraph from '@site/src/components/intelligence/DependencyGraph';
import ImpactSimulator from '@site/src/components/intelligence/ImpactSimulator';
import WatcherFeed from '@site/src/components/intelligence/WatcherFeed';
import RegistryQuality from '@site/src/components/intelligence/RegistryQuality';
import GoldenBuildManager from '@site/src/components/intelligence/GoldenBuildManager';
import BuildPlanner from '@site/src/components/intelligence/BuildPlanner';
import BuildVerifier from '@site/src/components/intelligence/BuildVerifier';
import styles from './styles.module.css';

const INTENT_FILTERS = {
  'needs review': (profile) => ['wait', 'avoid'].includes(profile.recommendation.key),
  'breaking updates': (profile) => profile.release.hasBreaking,
  'outdated dependencies': (profile) => profile.risk.unresolvedDependencies.length > 0,
  'golden build': (profile) => profile.goldenBuild,
  'updated': (profile) => profile.release.updateDetected,
  'deprecated': (profile) => profile.registryStatus === 'deprecated',
};

export default function IntelligenceCenter() {
  const reportUrl = useBaseUrl('/data/watcher-report.json');
  const [report, setReport] = useState(null);
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [selectedId, setSelectedId] = useState('lspdfr');

  useEffect(() => {
    fetch(`${reportUrl}?t=${Date.now()}`, {cache: 'no-store'})
      .then((response) => response.ok ? response.json() : null)
      .then(setReport)
      .catch(() => setReport(null));
  }, [reportUrl]);

  const snapshot = useMemo(() => buildIntelligenceSnapshot(report), [report]);
  const profiles = useMemo(() => snapshot.profiles.filter((profile) => {
    const normalizedQuery = query.trim().toLowerCase();
    const intent = Object.entries(INTENT_FILTERS).find(([phrase]) => normalizedQuery.includes(phrase));
    const text = `${profile.name} ${profile.developer} ${profile.category} ${profile.currentVersion} ${profile.recommendation.label}`.toLowerCase();
    const queryMatch = !normalizedQuery || (intent ? intent[1](profile) : text.includes(normalizedQuery));
    return queryMatch && (risk === 'all' || profile.risk.key === risk);
  }), [snapshot, query, risk]);

  const cards = [
    ['Registry projects', snapshot.metrics.plugins],
    ['Updates detected', snapshot.metrics.updatesDetected],
    ['Needs review', snapshot.metrics.needsReview],
    ['Dependency alerts', snapshot.metrics.dependencyAlerts],
    ['Golden Build', snapshot.metrics.goldenBuildPlugins],
    ['Average health', `${snapshot.metrics.averageHealth}%`],
    ['Knowledge links', snapshot.metrics.relationships],
    ['Watcher connected', snapshot.metrics.watcherConnected],
  ];

  return <Layout title="Sentinel Intelligence" description="Release intelligence, Plugin DNA and compatibility predictions for Project Sentinel.">
    <main className={styles.page}>
      <header className={styles.hero}><div className="container">
        <span className={styles.eyebrow}>Operations console refinement · 2.2</span>
        <Heading as="h1">Sentinel Intelligence</Heading>
        <p>Design installation orders, verify build readiness, map dependencies, simulate change impact, compare Golden Build snapshots, and turn Watcher and Doctor evidence into one operations picture.</p>
        <div className={styles.heroActions}><Link to="/watcher">Open Watcher</Link><Link to="/compatibility">Compatibility Center</Link></div>
      </div></header>

      <section className={`container ${styles.content}`}>
        <div className={styles.metrics}>{cards.map(([label, value]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div>

        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>Change management</span><Heading as="h2">Intelligence operations console</Heading><p>Select any plugin in the graph, activity feed, impact simulator, or quality audit. Every module stays centered on the same project.</p></div></div>
        <div className={styles.operationsGrid}>
          <div className={styles.operationsColumns}>
            <div className={styles.primaryColumn}>
              <div className={styles.graphPanel}><DependencyGraph snapshot={snapshot} selectedId={selectedId} onSelect={setSelectedId} /></div>
              <RegistryQuality snapshot={snapshot} onSelect={(id) => {setSelectedId(id); setExpanded(id);}} />
              <GoldenBuildManager profiles={snapshot.profiles} />
            </div>
            <div className={styles.secondaryColumn}>
              <ImpactSimulator snapshot={snapshot} selectedId={selectedId} onSelect={setSelectedId} />
              <WatcherFeed profiles={snapshot.profiles} onSelect={(id) => {setSelectedId(id); setExpanded(id);}} />
            </div>
          </div>
          <BuildPlanner snapshot={snapshot} selectedId={selectedId} onSelect={setSelectedId} />
          <BuildVerifier snapshot={snapshot} onSelect={(id) => {setSelectedId(id); setExpanded(id);}} />
        </div>

        <div className={styles.sectionHeader}><div><span className={styles.eyebrow}>Release intelligence</span><Heading as="h2">Plugin DNA and update decisions</Heading><p>Search normally or use phrases such as “needs review,” “breaking updates,” “outdated dependencies,” “Golden Build,” “updated,” or “deprecated.”</p></div></div>
        <div className={styles.filters}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects or ask: show plugins needing review" />
          <select value={risk} onChange={(event) => setRisk(event.target.value)}>
            <option value="all">All risk levels</option><option value="safe">Safe</option><option value="likelySafe">Likely safe</option><option value="unknown">Unknown</option><option value="highRisk">High risk</option><option value="breaking">Breaking</option>
          </select>
        </div>
        <p className={styles.results}>{profiles.length} intelligence profile{profiles.length === 1 ? '' : 's'} shown</p>

        <div className={styles.grid}>{profiles.map((profile) => <article className={`${styles.profile} ${expanded === profile.id ? styles.expanded : ''}`} key={profile.id}>
          <div className={styles.profileTop}><div><span>{profile.category}</span><Heading as="h3">{profile.name}</Heading></div><b className={styles[profile.risk.tone]}>{profile.risk.label} · {profile.risk.score}</b></div>
          <p>{profile.developer} · {profile.currentVersion}</p>
          <div className={styles.badges}><b className={styles[profile.recommendation.tone]}>{profile.recommendation.label}</b><b className={styles.healthBadge}>Health {profile.health.score}</b>{profile.release.updateDetected && <b className={styles.updateBadge}>Update detected</b>}</div>
          <dl><div><dt>Confidence</dt><dd>{profile.confidence}%</dd></div><div><dt>Dependencies</dt><dd>{profile.dependencies.length}</dd></div><div><dt>Retest impact</dt><dd>{profile.usedBy.length}</dd></div><div><dt>Golden Build</dt><dd>{profile.goldenBuild ? 'Yes' : 'No'}</dd></div></dl>
          <div className={styles.reason}>{profile.recommendation.reasons[0]}</div>
          <div className={styles.actions}><button type="button" onClick={() => {setSelectedId(profile.id); setExpanded(expanded === profile.id ? null : profile.id);}}>{expanded === profile.id ? 'Hide intelligence' : 'Analyze release'}</button><Link to={profile.profile}>Full profile →</Link></div>
          {expanded === profile.id && <ReleaseDetails profile={profile} />}
        </article>)}</div>
      </section>
    </main>
  </Layout>;
}
