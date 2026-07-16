const normalize = (value = '') => String(value).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const slug = (value = '') => normalize(value).replace(/\s+/g, '-').replace(/^-|-$/g, '') || 'unknown-project';
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(Number(value) || 0)));

export function canonicalResearchId(project) {
  return `research-${slug(project?.name || project?.id)}`;
}

export function researchProfileUrl(project) {
  const id = canonicalResearchId(project);
  const name = project?.name ? `&name=${encodeURIComponent(project.name)}` : '';
  return `/plugins/research?project=${encodeURIComponent(id)}${name}`;
}


function normalizeDiscovery(item) {
  if (!item?.name) return null;
  const sourceId = item.id || null;
  const id = canonicalResearchId(item);
  return {
    ...item,
    id,
    sourceId,
    legacyIds: [...new Set([...(item.legacyIds || []), sourceId].filter(Boolean))],
    name: item.name,
    category: item.category || 'Research discoveries',
    status: 'research',
    version: item.version || 'Not verified',
    developer: item.developer || item.author || 'Unknown',
    impact: item.impact || 'Unknown',
    confidence: clamp(item.identityConfidence ?? item.confidence ?? 50),
    tags: [...new Set([...(item.tags || []), 'Pending review'])],
    dependencies: item.dependencies || [],
    sources: item.sources || item.candidates || [],
    candidates: item.candidates || item.sources || [],
    sentinelPolice: false,
    researchDiscovered: true,
    researchStatus: item.researchStatus || 'pending-review',
    profile: researchProfileUrl({id, name: item.name}),
  };
}

function synthesizeFromRequest(request) {
  if (!request?.query) return null;
  const candidates = request.candidates || [];
  const best = candidates[0];
  if (!best) return null;
  const score = clamp(best.score || 0);
  // A discovered candidate may enter the registry as an explicitly unverified lead.
  // This does not assert compatibility or official status.
  if (score < 25 && request.status !== 'resolved') return null;
  const id = canonicalResearchId({name: request.query});
  const credibleCount = request.credibleCandidateCount || 0;
  return normalizeDiscovery({
    id,
    name: request.query,
    aliases: [request.query, best.title, best.name].filter(Boolean),
    description: best.description || best.snippet || `Sentinel Research found a public candidate source for ${request.query}. The identity and compatibility still require review.`,
    developer: best.author || 'Unknown',
    confidence: request.status === 'resolved' ? Math.max(65, score) : Math.max(25, score),
    identityConfidence: request.status === 'resolved' ? Math.max(65, score) : Math.max(25, score),
    sourceCredibility: score,
    documentationConfidence: best.description ? 55 : 30,
    compatibilityConfidence: 0,
    download: best.url || null,
    note: request.status === 'resolved'
      ? `Research found ${credibleCount || 1} credible source${credibleCount === 1 ? '' : 's'}. Added automatically as Research and awaiting review.`
      : `Research found a possible project source, but it did not clear the automatic credibility threshold. Added as an unverified research lead for review.`,
    researchStatus: request.status === 'resolved' ? 'pending-review' : 'candidate-review',
    requestedAt: request.completedAt || request.requestedAt || null,
    sources: request.status === 'resolved' ? candidates.filter(candidate => (candidate.score || 0) >= 68) : [best],
    candidates,
    tags: request.status === 'resolved'
      ? ['Internet research', 'Pending review', 'Automatic discovery']
      : ['Internet research', 'Candidate review', 'Unverified lead'],
  });
}

export function collectResearchProjects(data) {
  const projects = new Map();
  for (const item of data?.discoveries || []) {
    const normalized = normalizeDiscovery(item);
    if (normalized) projects.set(normalized.id, normalized);
  }
  for (const request of data?.requests || []) {
    const candidate = synthesizeFromRequest(request);
    if (!candidate) continue;
    const sameName = [...projects.values()].find(item => normalize(item.name) === normalize(candidate.name));
    if (!sameName) projects.set(candidate.id, candidate);
  }
  return [...projects.values()].sort((a, b) => Date.parse(b.requestedAt || 0) - Date.parse(a.requestedAt || 0));
}

export function findResearchProject(data, idOrName) {
  const target = decodeURIComponent(String(idOrName || ''));
  const normalizedTarget = normalize(target.replace(/^research[- ]?/, ''));
  return collectResearchProjects(data).find(item =>
    item.id === target
    || item.sourceId === target
    || item.legacyIds?.includes(target)
    || normalize(item.name) === normalize(target)
    || normalize(item.name) === normalizedTarget
    || (target.startsWith(`${item.id}-`))
  ) || null;
}
