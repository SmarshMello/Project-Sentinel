import React, {useMemo, useState} from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './IntelligenceCase.module.css';

const TEST_RESULTS = [
  ['not-tested', 'Not tested'],
  ['passed', 'Passed'],
  ['partial', 'Partially passed'],
  ['failed', 'Failed'],
];

export default function IntelligenceCase({plan, onDismiss, onStatusChange, onUpdate}) {
  const [noteDraft, setNoteDraft] = useState(plan?.notes || '');
  const completed = plan?.completedSteps || [];
  const progress = useMemo(() => plan?.steps?.length ? Math.round((completed.length / plan.steps.length) * 100) : 0, [completed.length, plan?.steps?.length]);
  if (!plan) return null;

  const toggleStep = (index) => {
    const next = completed.includes(index) ? completed.filter((item) => item !== index) : [...completed, index].sort((a,b)=>a-b);
    onUpdate?.({completedSteps: next});
  };
  const saveNotes = () => onUpdate?.({notes: noteDraft.trim()});

  return <section className={styles.caseCard}>
    <div className={styles.header}><div><span>Intelligence handoff · {plan.severity} priority</span><Heading as="h2">Doctor case: {plan.pluginName}</Heading><p>{plan.summary}</p></div><div><select aria-label="Doctor case status" value={plan.status || 'open'} onChange={(event) => onStatusChange?.(event.target.value)}><option value="open">Open</option><option value="monitoring">Monitoring</option><option value="resolved">Resolved</option></select><button type="button" onClick={onDismiss}>Close view</button></div></div>
    <div className={styles.metrics}><div><b>{plan.riskScore}</b><span>Risk score</span></div><div><b>{plan.riskLabel}</b><span>Risk level</span></div><div><b>{plan.recommendation}</b><span>Recommendation</span></div><div><b>{plan.affectedProjects.length}</b><span>Projects to retest</span></div></div>

    <div className={styles.progressBlock}><div><b>Case progress</b><span>{completed.length} of {plan.steps.length} steps · {progress}%</span></div><div className={styles.progressTrack}><i style={{width:`${progress}%`}} /></div></div>

    {!!plan.evidence.length && <div className={styles.evidence}><h3>Evidence carried from Intelligence</h3>{plan.evidence.map((item, index)=><p key={`${item}-${index}`}>• {item}</p>)}</div>}
    <div className={styles.plan}><h3>Controlled repair and validation plan</h3><ol className={styles.checklist}>{plan.steps.map((step, index)=><li key={step} className={completed.includes(index)?styles.stepDone:''}><label><input type="checkbox" checked={completed.includes(index)} onChange={()=>toggleStep(index)} /><span>{step}</span></label></li>)}</ol></div>

    <div className={styles.verificationGrid}>
      <label><span>Startup test</span><select value={plan.verification?.startup || 'not-tested'} onChange={(e)=>onUpdate?.({verification:{...(plan.verification||{}), startup:e.target.value}})}>{TEST_RESULTS.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label><span>On-duty test</span><select value={plan.verification?.onDuty || 'not-tested'} onChange={(e)=>onUpdate?.({verification:{...(plan.verification||{}), onDuty:e.target.value}})}>{TEST_RESULTS.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label><span>Gameplay test</span><select value={plan.verification?.gameplay || 'not-tested'} onChange={(e)=>onUpdate?.({verification:{...(plan.verification||{}), gameplay:e.target.value}})}>{TEST_RESULTS.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label><span>Log review</span><select value={plan.verification?.logs || 'not-tested'} onChange={(e)=>onUpdate?.({verification:{...(plan.verification||{}), logs:e.target.value}})}>{TEST_RESULTS.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
    </div>

    <div className={styles.notes}><label htmlFor={`doctor-notes-${plan.id}`}>Case notes</label><textarea id={`doctor-notes-${plan.id}`} value={noteDraft} onChange={(e)=>setNoteDraft(e.target.value)} placeholder="Record what changed, test results, log names, or why the case is being monitored…"/><button type="button" onClick={saveNotes}>Save notes</button></div>

    {!!plan.affectedProjects.length && <div className={styles.affected}><b>Affected projects:</b> {plan.affectedProjects.join(', ')}</div>}
    <div className={styles.links}>{plan.profileUrl && <Link to={plan.profileUrl}>Open plugin profile →</Link>}{plan.guideUrl && <Link to={plan.guideUrl}>Open installation guide →</Link>}</div>
  </section>;
}
