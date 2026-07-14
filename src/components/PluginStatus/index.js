import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import {statusMeta} from '@site/src/data/plugins';

export default function PluginStatus({status, compact = false}) {
  const meta = statusMeta[status] ?? statusMeta.testing;
  return (
    <span
      className={clsx(styles.badge, styles[status], compact && styles.compact)}
      title={meta.description}
    >
      <span className={styles.dot}/>
      {meta.label}
    </span>
  );
}
