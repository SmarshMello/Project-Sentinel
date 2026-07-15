import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import StatusPill from '@site/src/components/StatusPill';
import {compatibilityCategories, compatibilityRows, compatibilityStatuses} from '@site/src/data/compatibility';
import styles from './styles.module.css';

const Icon = ({name}) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    shield: <><path d="M12 2.7 19 5.5v5.8c0 4.5-2.8 8.1-7 10-4.2-1.9-7-5.5-7-10V5.5Z"/><path d="m8.8 12 2.1 2.1 4.6-4.8"/></>,
    sliders: <><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="13" cy="18" r="2"/></>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="M12 3 2.8 20h18.4Z"/><path d="M12 9v4M12 17h.01"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

const toneMap = {verified:'green', compatible:'blue', testing:'yellow', research:'purple', deprecated:'red'};

export default function CompatibilityPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('all');
  const [goldenOnly, setGoldenOnly] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return compatibilityRows
      .filter((row) => category === 'All' || row.category === category)
      .filter((row) => status === 'all' || row.status === status)
      .filter((row) => !goldenOnly || row.goldenBuild)
      .filter((row) => !term || [row.component, row.version, row.category, row.note, row.impact].join(' ').toLowerCase().includes(term))
      .sort((a, b) => compatibilityStatuses[a.status].rank - compatibilityStatuses[b.status].rank || b.confidence - a.confidence);
  }, [query, category, status, goldenOnly]);

  const counts = useMemo(() => compatibilityRows.reduce((acc, row) => ({...acc, [row.status]:(acc[row.status] || 0) + 1}), {}), []);
  const verifiedCount = compatibilityRows.filter((row) => row.status === 'verified').length;
  const goldenCount = compatibilityRows.filter((row) => row.goldenBuild).length;

  return (
    <Layout title="Compatibility Center" description="Project Sentinel compatibility matrix for the current verified GTA V Legacy LSPDFR build.">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div>
                <div className={styles.eyebrow}><span/>Compatibility intelligence</div>
                <Heading as="h1">Compatibility <em>Center</em></Heading>
                <p className={styles.lead}>See what is verified, what is still being tested, and what belongs in the current Project Sentinel Golden Build.</p>
                <div className={styles.baseline}><Icon name="shield"/><div><span>Current baseline</span><strong>Legacy 3788 · RPH 1.130 · LSPDFR 0.4.9</strong></div></div>
              </div>
              <div className={styles.summaryPanel}>
                <div><span>Tracked components</span><strong>{compatibilityRows.length}</strong></div>
                <div><span>Verified</span><strong>{verifiedCount}</strong></div>
                <div><span>Golden Build</span><strong>{goldenCount}</strong></div>
                <div className={styles.systemState}><i/><span>Matrix operational</span></div>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.noticeStrip}>
          <div className="container">
            <Icon name="alert"/>
            <p><strong>Compatibility is build-specific.</strong> A plugin that works on another GTA or RPH version is not automatically approved for this baseline.</p>
          </div>
        </section>

        <section className={styles.matrixSection}>
          <div className="container">
            <div className={styles.controls}>
              <label className={styles.searchBox}><Icon name="search"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search components, versions or notes…" aria-label="Search compatibility matrix"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search">×</button>}</label>
              <label className={styles.selectBox}><Icon name="sliders"/><select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter category">{compatibilityCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
              <button className={clsx(styles.goldenToggle, goldenOnly && styles.activeToggle)} onClick={() => setGoldenOnly((value) => !value)}><Icon name="shield"/>Golden Build only</button>
            </div>

            <div className={styles.statusTabs} role="tablist" aria-label="Compatibility status filters">
              <button className={status === 'all' ? styles.activeTab : ''} onClick={() => setStatus('all')}>All <span>{compatibilityRows.length}</span></button>
              {Object.entries(compatibilityStatuses).filter(([key]) => counts[key]).map(([key, meta]) => <button key={key} className={status === key ? styles.activeTab : ''} onClick={() => setStatus(key)}>{meta.label} <span>{counts[key]}</span></button>)}
            </div>

            <div className={styles.resultBar}><span><strong>{filtered.length}</strong> matching components</span><span>Sorted by approval level</span></div>

            <div className={styles.tableWrap}>
              <table className={styles.matrixTable}>
                <thead><tr><th>Component</th><th>Version</th><th>Legacy 3788</th><th>Golden Build</th><th>Impact</th><th>Status</th><th>Confidence</th><th/></tr></thead>
                <tbody>{filtered.map((row) => <tr key={row.id}>
                  <td><strong>{row.component}</strong><span>{row.category}</span><small>{row.note}</small></td>
                  <td>{row.version}</td>
                  <td><span className={clsx(styles.compatText, row.legacy3788 === 'Yes' && styles.yes, row.legacy3788 === 'Pending' && styles.pending)}>{row.legacy3788}</span></td>
                  <td>{row.goldenBuild ? <span className={styles.included}><Icon name="check"/>Included</span> : <span className={styles.notIncluded}>No</span>}</td>
                  <td>{row.impact}</td>
                  <td><StatusPill label={compatibilityStatuses[row.status].label} tone={toneMap[row.status]}/></td>
                  <td><div className={styles.confidenceCell}><span>{row.confidence}%</span><i><b style={{width:`${row.confidence}%`}}/></i></div></td>
                  <td><Link className={styles.guideLink} to={row.guide} aria-label={`Open ${row.component} guide`}><Icon name="arrow"/></Link></td>
                </tr>)}</tbody>
              </table>
            </div>

            <div className={styles.mobileCards}>{filtered.map((row) => <article className={styles.mobileCard} key={row.id}>
              <div className={styles.mobileTop}><div><span>{row.category}</span><Heading as="h2">{row.component}</Heading></div><StatusPill label={compatibilityStatuses[row.status].label} tone={toneMap[row.status]}/></div>
              <p>{row.note}</p>
              <dl><div><dt>Version</dt><dd>{row.version}</dd></div><div><dt>Legacy 3788</dt><dd>{row.legacy3788}</dd></div><div><dt>Golden Build</dt><dd>{row.goldenBuild ? 'Included' : 'Not included'}</dd></div><div><dt>Impact</dt><dd>{row.impact}</dd></div></dl>
              <div className={styles.mobileConfidence}><span>Verification confidence</span><strong>{row.confidence}%</strong><i><b style={{width:`${row.confidence}%`}}/></i></div>
              <Link className={styles.mobileGuide} to={row.guide}>Open guide <Icon name="arrow"/></Link>
            </article>)}</div>

            {filtered.length === 0 && <div className={styles.empty}><Icon name="search"/><Heading as="h2">No components found</Heading><p>Clear your filters or try a broader search.</p><button onClick={() => {setQuery(''); setCategory('All'); setStatus('all'); setGoldenOnly(false);}}>Reset matrix</button></div>}
          </div>
        </section>
      </main>
    </Layout>
  );
}
