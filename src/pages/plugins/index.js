import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import PluginStatus from '@site/src/components/PluginStatus';
import {pluginCategories, plugins, statusMeta} from '@site/src/data/plugins';
import styles from './styles.module.css';

const Icon = ({name}) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
    cube: <><path d="m12 2.8 8 4.4v9.6l-8 4.4-8-4.4V7.2Z"/><path d="m4.4 7.4 7.6 4.2 7.6-4.2M12 11.6v9.2"/></>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
    shield: <><path d="M12 2.7 19 5.5v5.8c0 4.5-2.9 8.6-7 10-4.1-1.4-7-5.5-7-10V5.5L12 2.7Z"/><path d="m8.8 12 2 2 4.5-4.7"/></>,
    pulse: <path d="M3 12h4l2-6 4 12 2-6h6"/>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const statusOrder = ['all', 'verified', 'documented', 'testing', 'research'];

function PluginCard({plugin}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardTopline}>
        <div className={styles.monogram}>{plugin.shortName.slice(0, 3).toUpperCase()}</div>
        <PluginStatus status={plugin.status}/>
      </div>
      <div className={styles.cardHeading}>
        <span>{plugin.category}</span>
        <Heading as="h2">{plugin.name}</Heading>
        <p>{plugin.description}</p>
      </div>
      <div className={styles.versionLine}>
        <span>Sentinel version</span>
        <strong>{plugin.version}</strong>
      </div>
      <div className={styles.tagList}>
        {plugin.tags.map(tag => <span key={tag}>{tag}</span>)}
      </div>
      <dl className={styles.quickFacts}>
        <div><dt>Developer</dt><dd>{plugin.developer}</dd></div>
        <div><dt>Performance</dt><dd>{plugin.impact}</dd></div>
      </dl>
      <div className={styles.confidence}>
        <div><span>Verification confidence</span><strong>{plugin.confidence}%</strong></div>
        <div className={styles.confidenceTrack}><i style={{width: `${plugin.confidence}%`}}/></div>
      </div>
      <p className={styles.note}>{plugin.note}</p>
      <div className={styles.cardActions}>
        <Link className={styles.guideButton} to={`/plugins/${plugin.id}`}>Plugin profile <Icon name="arrow"/></Link>
        <Link className={styles.iconButton} to={plugin.guide} aria-label={`Open installation guide for ${plugin.name}`}>G</Link>
        {plugin.download && <a className={styles.iconButton} href={plugin.download} target="_blank" rel="noreferrer" aria-label={`Open official download for ${plugin.name}`}><Icon name="external"/></a>}
      </div>
    </article>
  );
}

export default function PluginDatabase() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('all');

  const filteredPlugins = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return plugins.filter(plugin => {
      const matchesCategory = category === 'All' || plugin.category === category;
      const matchesStatus = status === 'all' || plugin.status === status;
      const haystack = [plugin.name, plugin.shortName, plugin.description, plugin.category, plugin.version, ...plugin.tags].join(' ').toLowerCase();
      return matchesCategory && matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [query, category, status]);

  const verifiedCount = plugins.filter(plugin => plugin.status === 'verified').length;
  const testingCount = plugins.filter(plugin => plugin.status === 'testing').length;

  return (
    <Layout title="Plugin Database" description="Project Sentinel compatibility, verification and installation database for LSPDFR plugins and dependencies.">
      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={styles.grid}/>
          <div className="container">
            <div className={styles.eyebrow}><span/> SENTINEL REGISTRY // VERSION 2.1</div>
            <div className={styles.heroLayout}>
              <div>
                <Heading as="h1">The LSPDFR plugin database.</Heading>
                <p>One controlled registry for compatibility status, tested versions, dependencies, performance impact and installation guides.</p>
              </div>
              <div className={styles.registryPanel}>
                <div><Icon name="shield"/><span>Verified</span><strong>{verifiedCount}</strong></div>
                <div><Icon name="pulse"/><span>Testing</span><strong>{testingCount}</strong></div>
                <div><Icon name="cube"/><span>Total records</span><strong>{plugins.length}</strong></div>
              </div>
            </div>
          </div>
        </header>

        <section className={styles.legendSection}>
          <div className={clsx('container', styles.legend)}>
            {Object.entries(statusMeta).filter(([key]) => key !== 'deprecated').map(([key, meta]) => (
              <div key={key}><PluginStatus status={key} compact/><span>{meta.description}</span></div>
            ))}
          </div>
        </section>

        <section className={styles.databaseSection}>
          <div className="container">
            <div className={styles.controls}>
              <label className={styles.searchBox}>
                <Icon name="search"/>
                <span className="sr-only">Search plugins</span>
                <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search plugin, feature, version…"/>
                {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
              </label>
              <div className={styles.filterGroup}>
                <Icon name="filter"/>
                <select value={category} onChange={event => setCategory(event.target.value)} aria-label="Filter by category">
                  {pluginCategories.map(item => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.statusTabs} role="group" aria-label="Filter by verification status">
              {statusOrder.map(item => (
                <button key={item} type="button" className={item === status ? styles.activeTab : ''} onClick={() => setStatus(item)}>
                  {item === 'all' ? 'All records' : statusMeta[item].label}
                  <span>{item === 'all' ? plugins.length : plugins.filter(plugin => plugin.status === item).length}</span>
                </button>
              ))}
            </div>

            <div className={styles.resultBar}>
              <span><strong>{filteredPlugins.length}</strong> {filteredPlugins.length === 1 ? 'record' : 'records'} shown</span>
              <span>Golden Build baseline: Legacy 3788</span>
            </div>

            {filteredPlugins.length > 0 ? (
              <div className={styles.cardGrid}>{filteredPlugins.map(plugin => <PluginCard plugin={plugin} key={plugin.id}/>)}</div>
            ) : (
              <div className={styles.emptyState}>
                <Icon name="search"/>
                <Heading as="h2">No registry records match.</Heading>
                <p>Clear the search or select a different category and verification state.</p>
                <button type="button" onClick={() => {setQuery(''); setCategory('All'); setStatus('all');}}>Reset filters</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
