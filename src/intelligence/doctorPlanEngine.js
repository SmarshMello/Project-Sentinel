const ACTIVE_STORAGE_KEY = 'sentinel:intelligence-doctor-case:v1';
const HISTORY_STORAGE_KEY = 'sentinel:intelligence-doctor-history:v1';
const MAX_HISTORY = 50;

function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function normalizePlan(plan) {
  if (!plan) return null;
  return {
    status: 'open',
    updatedAt: plan.createdAt || new Date().toISOString(),
    notes: '',
    ...plan,
  };
}

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
  const now = new Date().toISOString();
  return {
    id: `${profile.id}-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    status: 'open',
    notes: '',
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

export function loadDoctorHistory() {
  if (typeof window === 'undefined') return [];
  const history = safeParse(window.localStorage.getItem(HISTORY_STORAGE_KEY), []);
  return Array.isArray(history) ? history.map(normalizePlan).filter(Boolean) : [];
}

export function saveDoctorHistory(history) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function upsertDoctorHistory(plan) {
  if (typeof window === 'undefined' || !plan) return plan;
  const normalized = normalizePlan({...plan, updatedAt: new Date().toISOString()});
  const history = loadDoctorHistory().filter((item) => item.id !== normalized.id);
  saveDoctorHistory([normalized, ...history]);
  return normalized;
}

export function saveDoctorPlan(plan) {
  if (typeof window === 'undefined') return;
  const normalized = upsertDoctorHistory(plan);
  window.localStorage.setItem(ACTIVE_STORAGE_KEY, JSON.stringify(normalized));
}

export function loadDoctorPlan() {
  if (typeof window === 'undefined') return null;
  return normalizePlan(safeParse(window.localStorage.getItem(ACTIVE_STORAGE_KEY), null));
}

export function clearDoctorPlan() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(ACTIVE_STORAGE_KEY);
}

export function reopenDoctorPlan(id) {
  if (typeof window === 'undefined') return null;
  const plan = loadDoctorHistory().find((item) => item.id === id) || null;
  if (plan) window.localStorage.setItem(ACTIVE_STORAGE_KEY, JSON.stringify(plan));
  return plan;
}

export function updateDoctorCase(id, changes) {
  if (typeof window === 'undefined') return null;
  const history = loadDoctorHistory();
  const existing = history.find((item) => item.id === id);
  if (!existing) return null;
  const updated = normalizePlan({...existing, ...changes, updatedAt: new Date().toISOString()});
  saveDoctorHistory([updated, ...history.filter((item) => item.id !== id)]);
  const active = loadDoctorPlan();
  if (active?.id === id) window.localStorage.setItem(ACTIVE_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteDoctorCase(id) {
  if (typeof window === 'undefined') return;
  saveDoctorHistory(loadDoctorHistory().filter((item) => item.id !== id));
  const active = loadDoctorPlan();
  if (active?.id === id) clearDoctorPlan();
}

export function clearDoctorHistory() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  clearDoctorPlan();
}
