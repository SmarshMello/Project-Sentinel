import React from 'react';
import Heading from '@theme/Heading';
import SentinelIcon from '@site/src/components/SentinelIcon';
import styles from './styles.module.css';

export default function FeatureCard({icon, index, title, text, badge}) {
  return (
    <article className={styles.card}>
      <div className={styles.top}><div className={styles.icon}><SentinelIcon name={icon}/></div><span>{String(index).padStart(2,'0')}</span></div>
      <Heading as="h3">{title}</Heading>
      <p>{text}</p>
      <div className={styles.badge}><span/>{badge}</div>
    </article>
  );
}
