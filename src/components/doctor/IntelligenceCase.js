import React from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './IntelligenceCase.module.css';

export default function IntelligenceCase({plan, onDismiss}) {
  if (!plan) return null;
  return <section className={styles.caseCard}>
    <div className={styles.header}><div><span>Intelligence handoff · {plan.severity} priority</span><Heading as="h2">Doctor case: {plan.pluginName}</Heading><p>{plan.summary}</p></div><button type="button" onClick={onDismiss}>Dismiss</button></div>
    <div className={styles.metrics}><div><b>{plan.riskScore}</b><span>Risk score</span></div><div><b>{plan.riskLabel}</b><span>Risk level</span></div><div><b>{plan.recommendation}</b><span>Recommendation</span></div><div><b>{plan.affectedProjects.length}</b><span>Projects to retest</span></div></div>
    {!!plan.evidence.length && <div className={styles.evidence}><h3>Evidence carried from Intelligence</h3>{plan.evidence.map((item, index)=><p key={`${item}-${index}`}>• {item}</p>)}</div>}
    <div className={styles.plan}><h3>Controlled repair and validation plan</h3><ol>{plan.steps.map((step)=><li key={step}>{step}</li>)}</ol></div>
    {!!plan.affectedProjects.length && <div className={styles.affected}><b>Affected projects:</b> {plan.affectedProjects.join(', ')}</div>}
    <div className={styles.links}>{plan.profileUrl && <Link to={plan.profileUrl}>Open plugin profile →</Link>}{plan.guideUrl && <Link to={plan.guideUrl}>Open installation guide →</Link>}</div>
  </section>;
}
