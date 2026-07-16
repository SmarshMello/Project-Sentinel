const STORAGE_KEY = 'sentinel:intelligence-doctor-case:v1';

export function buildDoctorPlan(profile) {
  const affected = profile.usedBy.map((item) => item.label);
  const unresolved = profile.risk.unresolvedDependencies || [];
  const steps = [];

  steps.push(`Back up the current Golden Build before changing ${profile.name}.`);
  if (unresolved.length) steps.push(`Resolve or verify these dependency records first: ${unresolved.join(', ')}.`);
  if (profile.dependencies.length) steps.push(`Confirm every required dependency for ${profile.name} is installed at the documented version.`);
  if (profile.release.updateDetected) steps.push(`Install ${profile.release.detectedVersion || 'the detected release'} in an isolated test copy, not the live Golden Build.`);
  else steps.push(`Keep the current ${profile.currentVersion} install in place while gathering stronger release evidence.`);
  steps.push(`Launch GTA V with only the minimum core stack and ${profile.name} enabled.`);
  steps.push(`Run one controlled duty session and capture RAGEPluginHook.log plus lspdfr.log.`);
  if (affected.length) steps.push(`Retest affected projects in this order: ${affected.join(', ')}.`);
  steps.push('Promote the change to the Golden Build only after a clean startup, duty load, and controlled gameplay test.');

  const severity = profile.risk.score >= 86 ? 'critical' : profile.risk.score >= 61 ? 'high' : profile.risk.score >= 36 ? 'medium' : 'low';
  return {
    id: `${profile.id}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    source: 'sentinel-intelligence',
    pluginId: profile.id,
    pluginName: profile.name,
    currentVersion: profile.currentVersion,
    detectedVersion: profile.release.detectedVersion,
    severity,
    riskScore: profile.risk.score,
    riskLabel: profile.risk.label,
    recommendation: profile.recommendation.label,
    summary: profile.recommendation.reasons[0],
    evidence: [...profile.risk.reasons, ...(profile.release.notes || []).slice(0, 5)],
    unresolvedDependencies: unresolved,
    affectedProjects: affected,
    steps,
    profileUrl: profile.profile,
    guideUrl: profile.guide,
  };
}

export function saveDoctorPlan(plan) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

export function loadDoctorPlan() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(window.localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

export function clearDoctorPlan() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
}
