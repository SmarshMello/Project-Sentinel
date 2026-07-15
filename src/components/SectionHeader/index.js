import React from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function SectionHeader({eyebrow, title, description, action}) {
  return (
    <div className={styles.header}>
      <div className={styles.copy}>
        {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
        <Heading as="h2">{title}</Heading>
      </div>
      <div className={styles.side}>
        {description && <p>{description}</p>}
        {action}
      </div>
    </div>
  );
}
