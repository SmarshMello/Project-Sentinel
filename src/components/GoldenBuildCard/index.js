import React from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import SentinelIcon from '@site/src/components/SentinelIcon';
import styles from './styles.module.css';

export default function GoldenBuildCard({stats=[]}) {
  return (
    <article className={styles.card}>
      <div className={styles.glow}/>
      <div className={styles.icon}><SentinelIcon name="star"/></div>
      <div className={styles.copy}>
        <div className={styles.eyebrow}>PROJECT SENTINEL GOLDEN BUILD</div>
        <Heading as="h2">A known-good checkpoint you can actually reproduce.</Heading>
        <p>The Golden Build records every verified version, dependency, configuration decision and backup point—so updates never force you to start over.</p>
        <div className={styles.stats}>{stats.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </div>
      <Link className={styles.link} to="/guide/optimization/golden-build">Open Golden Build <SentinelIcon name="chevron" size={18}/></Link>
    </article>
  );
}
