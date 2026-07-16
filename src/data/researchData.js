const RAW_RESEARCH_URL = 'https://raw.githubusercontent.com/SmarshMello/Project-Sentinel/main/static/data/research-results.json';

const keyForDiscovery = (item = {}) => String(item.name || item.id || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const keyForRequest = (item = {}) => String(item.requestId || item.id || `${item.query}-${item.completedAt || item.requestedAt || ''}`);

function mergeResearchPayloads(payloads) {
  const discoveries = new Map();
  const requests = new Map();
  let updatedAt = null;
  let schemaVersion = 1;

  for (const data of payloads.filter(Boolean)) {
    schemaVersion = Math.max(schemaVersion, Number(data.schemaVersion) || 1);
    if (Date.parse(data.updatedAt || 0) > Date.parse(updatedAt || 0)) updatedAt = data.updatedAt;
    for (const item of data.discoveries || []) {
      const key = keyForDiscovery(item);
      if (!key) continue;
      const existing = discoveries.get(key);
      if (!existing || Date.parse(item.requestedAt || data.updatedAt || 0) >= Date.parse(existing.requestedAt || 0)) discoveries.set(key, item);
    }
    for (const item of data.requests || []) {
      const key = keyForRequest(item);
      if (!key) continue;
      const existing = requests.get(key);
      if (!existing || Date.parse(item.completedAt || item.requestedAt || 0) >= Date.parse(existing.completedAt || existing.requestedAt || 0)) requests.set(key, item);
    }
  }

  return {
    schemaVersion,
    updatedAt,
    discoveries: [...discoveries.values()],
    requests: [...requests.values()],
  };
}

async function fetchJson(url) {
  const separator = url.includes('?') ? '&' : '?';
  const response = await fetch(`${url}${separator}sentinel=${Date.now()}`, {cache: 'no-store'});
  if (!response.ok) throw new Error(`Research data request failed: ${response.status}`);
  return response.json();
}

export async function loadResearchData(localUrl) {
  const results = await Promise.allSettled([
    fetchJson(localUrl),
    fetchJson(RAW_RESEARCH_URL),
  ]);
  const payloads = results.filter(result => result.status === 'fulfilled').map(result => result.value);
  if (!payloads.length) throw new Error('No research registry source could be loaded.');
  return mergeResearchPayloads(payloads);
}
