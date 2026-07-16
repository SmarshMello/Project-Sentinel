export const MAX_BULK_PROJECTS = 500;
export const MAX_INPUT_LENGTH = 100000;

export const normalizeProjectName = (value = '') => String(value)
  .replace(/^[-*•\d.)\s]+/, '')
  .replace(/\s+/g, ' ')
  .trim();

export const projectKey = (value = '') => normalizeProjectName(value)
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function splitInput(input = '') {
  const clean = String(input).slice(0, MAX_INPUT_LENGTH).replace(/\r/g, '\n');
  const explicit = clean
    .split(/\n+|\s*[;,|]\s*/g)
    .map(normalizeProjectName)
    .filter(Boolean);
  return explicit;
}

export function parseBulkResearchInput(input, knownProjects = []) {
  const entries = splitInput(input);
  const looksLikeList = entries.length >= 2;
  if (!looksLikeList) return {isBulk: false, entries: [], unique: [], duplicates: [], known: [], unknown: [], overflow: 0};

  const seen = new Map();
  const unique = [];
  const duplicates = [];
  for (const name of entries) {
    const key = projectKey(name);
    if (!key || key.length < 2) continue;
    if (seen.has(key)) duplicates.push(name);
    else { seen.set(key, name); unique.push(name); }
  }

  const knownByKey = new Map();
  for (const project of knownProjects) {
    for (const value of [project.name, project.shortName, ...(project.aliases || [])]) {
      const key = projectKey(value);
      if (key) knownByKey.set(key, project);
    }
  }

  const limited = unique.slice(0, MAX_BULK_PROJECTS);
  const known = [];
  const unknown = [];
  for (const name of limited) {
    const project = knownByKey.get(projectKey(name));
    if (project) known.push({name, project});
    else unknown.push(name);
  }

  return {
    isBulk: limited.length >= 2,
    entries,
    unique: limited,
    duplicates,
    known,
    unknown,
    overflow: Math.max(0, unique.length - MAX_BULK_PROJECTS),
    maxProjects: MAX_BULK_PROJECTS,
  };
}

export function summarizeBulkResults(items = []) {
  return items.reduce((summary, item) => {
    summary.total += 1;
    const status = item.status || 'pending';
    summary[status] = (summary[status] || 0) + 1;
    return summary;
  }, {total: 0, pending: 0, running: 0, found: 0, manual: 0, notFound: 0, failed: 0, known: 0});
}
