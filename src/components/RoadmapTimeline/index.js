import React from 'react';
import Heading from '@theme/Heading';
import StatusPill from '@site/src/components/StatusPill';
import styles from './styles.module.css';

const toneFor = state => state === 'Verified' ? 'green' : state === 'In progress' ? 'blue' : 'amber';

export default function RoadmapTimeline({items}) {
  return <div className={styles.list}>{items.map((item,index)=>(
    <article className={styles.item} key={item.name}>
      <div className={styles.index}>{String(index+1).padStart(2,'0')}</div>
      <div className={styles.content}>
        <div className={styles.title}><div><Heading as="h3">{item.name}</Heading><p>{item.detail}</p></div><StatusPill tone={toneFor(item.state)}>{item.state}</StatusPill></div>
        <div className={styles.track}><span style={{width:`${item.value}%`}}/></div>
        <div className={styles.meta}><span>PHASE COMPLETION</span><strong>{item.value}%</strong></div>
      </div>
    </article>
  ))}</div>;
}
