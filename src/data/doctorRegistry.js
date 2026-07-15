import {registry, resolveDependency, statusMeta} from './registry';

const explicitConflicts = {
  'policing-redefined': ['stop-the-ped', 'ultimate-backup', 'compulite'],
  'lspdfr-enhanced-remastered': ['policing-redefined'],
};

const normalized = (value) => String(value || '').toLowerCase().replace(/[’']/g, "'").trim();

function projectTerms(project) {
  return [project.name, project.shortName, project.id, ...(project.tags || [])]
    .filter(Boolean)
    .map(normalized)
    .filter((term) => term.length >= 3);
}

function findMentionedProjects(text) {
  const haystack = normalized(text);
  if (!haystack) return [];
  return registry.filter((project) => projectTerms(project).some((term) => haystack.includes(term)));
}

function dependencyLinks(project) {
  return (project.dependencies || []).map((name) => {
    const resolved = resolveDependency(name);
    return {
      name,
      id: resolved?.id || null,
      profile: resolved?.profile || null,
      known: Boolean(resolved),
    };
  });
}

function buildProjectFinding(project, source) {
  const conflicts = (explicitConflicts[project.id] || [])
    .map((id) => registry.find((item) => item.id === id))
    .filter(Boolean);
  const meta = statusMeta[project.status] || {};
  const priority = project.status === 'conflict' ? 'high' : ['legacy', 'testing', 'research'].includes(project.status) ? 'medium' : 'low';
  const actions = [];

  if (project.status === 'conflict') actions.push('Keep this project on a separate test branch until its conflicting stack is removed.');
  if (project.status === 'legacy') actions.push('Confirm current GTA, RPH and LSPDFR support before restoring this legacy project.');
  if (project.status === 'testing') actions.push('Use a test profile and validate one feature at a time before approving it for the Golden Build.');
  if (project.status === 'research') actions.push('Do not use this project in a production patrol build.');
  if (project.dependencies?.length) actions.push('Verify every listed dependency and its version before replacing the project itself.');
  if (!actions.length) actions.push('Compare the installed version with the Sentinel profile, then test this project by itself.');

  return {
    id: project.id,
    name: project.name,
    category: project.category,
    version: project.version,
    developer: project.developer,
    status: project.status,
    statusLabel: meta.label || project.status,
    confidence: project.confidence || 50,
    priority,
    source,
    note: project.note,
    guide: project.guide || project.profile,
    profile: project.profile,
    dependencies: dependencyLinks(project),
    conflicts: conflicts.map((item) => ({id: item.id, name: item.name, profile: item.profile})),
    actions,
  };
}

export function analyzeRegistryContext({text = '', symptom = '', environment = {}} = {}) {
  const combined = [text, environment.lastChange, symptom].filter(Boolean).join('\n');
  const mentioned = findMentionedProjects(combined);
  const lastChangeMatches = findMentionedProjects(environment.lastChange || '');
  const ordered = [...lastChangeMatches, ...mentioned.filter((item) => !lastChangeMatches.some((match) => match.id === item.id))];
  const findings = ordered.slice(0, 6).map((project) => buildProjectFinding(project, lastChangeMatches.some((item) => item.id === project.id) ? 'Last change' : 'Evidence'));

  const conflictPairs = [];
  const selectedIds = new Set(ordered.map((item) => item.id));
  for (const project of ordered) {
    for (const conflictId of explicitConflicts[project.id] || []) {
      if (selectedIds.has(conflictId)) {
        const other = registry.find((item) => item.id === conflictId);
        if (other && !conflictPairs.some((pair) => pair.ids.includes(project.id) && pair.ids.includes(other.id))) {
          conflictPairs.push({ids: [project.id, other.id], left: project, right: other});
        }
      }
    }
  }

  return {
    findings,
    conflictPairs,
    matchedCount: findings.length,
    registryVersion: '6.0',
  };
}
