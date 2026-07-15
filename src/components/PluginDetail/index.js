import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import {plugins, statusMeta} from '@site/src/data/plugins';
import styles from './styles.module.css';

const statusTone = {verified:'green', documented:'blue', testing:'yellow', research:'purple', deprecated:'red'};

export default function PluginDetail({pluginId}) {
  const plugin = plugins.find((item) => item.id === pluginId);
  if (!plugin) return <Layout title="Plugin not found"><main className="container margin-vert--xl"><Heading as="h1">Plugin not found</Heading><Link to="/plugins">Return to the database</Link></main></Layout>;
  const health = Math.round(plugin.confidence * (plugin.status === 'verified' ? 1 : plugin.status === 'documented' ? .88 : plugin.status === 'testing' ? .75 : .55));
  const meta = statusMeta[plugin.status];
  return <Layout title={plugin.name} description={plugin.description}>
    <main className={styles.page}>
      <header className={styles.hero}><div className="container"><Link className={styles.back} to="/plugins">← Plugin Database</Link><div className={styles.heroGrid}><div><span className={styles.category}>{plugin.category}</span><Heading as="h1">{plugin.name}</Heading><p>{plugin.description}</p><div className={styles.actions}><Link className="button button--primary" to={plugin.guide}>Open installation guide</Link>{plugin.download && <a className="button button--secondary" href={plugin.download} target="_blank" rel="noreferrer">Official download ↗</a>}</div></div><aside className={styles.health}><span>Sentinel health score</span><strong>{health}</strong><div><i style={{width:`${health}%`}}/></div><small>{meta.label} · {plugin.confidence}% confidence</small></aside></div></div></header>
      <section className={styles.body}><div className="container"><div className={styles.facts}><div><span>Verified version</span><strong>{plugin.version}</strong></div><div><span>Developer</span><strong>{plugin.developer}</strong></div><div><span>Performance</span><strong>{plugin.impact}</strong></div><div><span>Status</span><strong className={styles[statusTone[plugin.status]]}>{meta.label}</strong></div></div><div className={styles.columns}><article><Heading as="h2">Compatibility assessment</Heading><p>{plugin.note}</p><div className={styles.callout}><strong>Project Sentinel position</strong><p>{meta.description}</p></div><Heading as="h2">Dependencies</Heading><ul>{plugin.dependencies.map((d)=><li key={d}>{d}</li>)}</ul></article><aside><Heading as="h2">Capabilities</Heading><div className={styles.tags}>{plugin.tags.map((tag)=><span key={tag}>{tag}</span>)}</div><Heading as="h2">Recommended workflow</Heading><ol><li>Match the listed Sentinel version.</li><li>Install required dependencies first.</li><li>Launch and test before adding another plugin.</li><li>Keep a working backup of the GTA V folder.</li></ol></aside></div></div></section>
    </main>
  </Layout>;
}
