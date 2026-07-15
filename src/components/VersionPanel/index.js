import React from 'react';
import Heading from '@theme/Heading';
import SentinelIcon from '@site/src/components/SentinelIcon';
import StatusPill from '@site/src/components/StatusPill';
import styles from './styles.module.css';

export default function VersionPanel({title='Legacy 3788', subtitle='Last validation snapshot: July 2026', rows=[]}) {
  return (
    <aside className={styles.panel} aria-label="Current verified build status">
      <div className={styles.topbar}><div className={styles.dots}><i/><i/><i/></div><span>SENTINEL_BUILD_STATUS</span><StatusPill compact>Verified</StatusPill></div>
      <div className={styles.body}>
        <div className={styles.radar}><div className={styles.sweep}/><div className={styles.ringOne}/><div className={styles.ringTwo}/><div className={styles.crossX}/><div className={styles.crossY}/><div className={styles.blip}/><div className={styles.core}><SentinelIcon name="shield"/></div></div>
        <div className={styles.heading}><span>CURRENT VERIFIED BUILD</span><Heading as="h2">{title}</Heading><small>{subtitle}</small></div>
        <div className={styles.table}>{rows.map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
        <div className={styles.integrity}><span>BUILD INTEGRITY</span><div>{Array.from({length:8}).map((_,i)=><i key={i}/>)}</div><strong>100%</strong></div>
      </div>
    </aside>
  );
}
