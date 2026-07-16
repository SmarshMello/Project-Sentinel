import React from 'react';
import {useHistory} from '@docusaurus/router';
import {buildDoctorPlan, saveDoctorPlan} from '@site/src/intelligence/doctorPlanEngine';
import styles from './ReleaseDetails.module.css';

const SECTION_LABELS = {
  features: 'Features', fixes: 'Bug fixes', performance: 'Performance', breaking: 'Breaking changes',
  security: 'Security', configuration: 'Configuration', migration: 'Migration', uncategorized: 'Other notes',
};

export default function ReleaseDetails({profile}) {
  const history = useHistory();
  const {release, recommendation, health} = profile;
  const openDoctor = () => {
    saveDoctorPlan(buildDoctorPlan(profile));
    history.push('/doctor?from=intelligence');
  };
  const sections = Object.entries(SECTION_LABELS).filter(([key]) => release.classified[key]?.length);
  return <div className={styles.panel}>
    <div className={styles.summary}>
      <div><span>Health</span><strong>{health.score} · {health.label}</strong></div>
      <div><span>Recommendation</span><strong>{recommendation.label}</strong></div>
      <div><span>Detected version</span><strong>{release.detectedVersion || 'No newer version detected'}</strong></div>
      <div><span>Last checked</span><strong>{release.checkedAt ? new Date(release.checkedAt).toLocaleString() : 'Not tracked'}</strong></div>
    </div>

    <div className={styles.impact}>
      <div><h4>Dependency impact</h4><p>{profile.usedBy.length ? `${profile.usedBy.length} registered project${profile.usedBy.length === 1 ? '' : 's'} should be retested if this plugin changes.` : 'No reverse dependencies are currently registered.'}</p>
        {profile.usedBy.length > 0 && <ul>{profile.usedBy.map((item) => <li key={item.id}>{item.label}</li>)}</ul>}
      </div>
      <div><h4>Recommendation reason</h4><p>{recommendation.reasons[0]}</p><p>{profile.risk.reasons.join(' ')}</p></div>
    </div>

    <div className={styles.doctorAction}><div><h4>Doctor integration</h4><p>Turn this intelligence profile into an ordered backup, dependency, installation, and retest plan.</p></div><button type="button" onClick={openDoctor}>Create Doctor case →</button></div>

    {sections.length > 0 ? <div className={styles.sections}>{sections.map(([key, label]) => <section key={key}><h4>{label}</h4><ul>{release.classified[key].map((line, index) => <li key={`${key}-${index}`}>{line}</li>)}</ul></section>)}</div> : <p className={styles.empty}>No structured release notes were available in the latest Watcher result. Sentinel is still using source health, registry evidence, and dependencies for its recommendation.</p>}
  </div>;
}
