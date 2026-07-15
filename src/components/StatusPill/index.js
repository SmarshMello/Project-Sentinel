import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function StatusPill({children, tone = 'green', compact = false}) {
  return (
    <span className={clsx(styles.pill, styles[tone], compact && styles.compact)}>
      <span className={styles.dot}/>
      {children}
    </span>
  );
}
