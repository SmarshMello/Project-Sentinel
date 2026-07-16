import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const root = new URL('../', import.meta.url);
const query = String(process.env.SENTINEL_RESEARCH_QUERY || '').trim().replace(/\s+/g, ' ');
const suppliedRequestId = String(process.env.SENTINEL_RESEARCH_REQUEST_ID || '').trim();
const originalQuestion = String(process.env.SENTINEL_RESEARCH_QUESTION || '').trim().replace(/\s+/g, ' ');
if (!query) {
  console.log('No research query supplied.');
  process.exit(0);
}

const dataPath = new URL('static/data/research-results.json', root);
const read = async () => {
  try {
    return JSON.parse(await fs.readFile(dataPath, 'utf8'));
  } catch {
    return {schemaVersion: 3, updatedAt: null, discoveries: [], requests: []};
  }
};

const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
const norm = (value = '') => String(value).toLowerCase().replace(/&amp;/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const decodeEntities = (value = '') => String(value)
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/');
const stripTags = (value = '') => decodeEntities(String(value).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const generic = new Set(['mod', 'plugin', 'police', 'lspdfr', 'gta', 'gta5', 'gtav', 'grand', 'theft', 'auto', 'v', 'for', 'and', 'with', 'the', 'download', 'script']);
const queryTokens = norm(query).split(' ').filter((token) => token.length > 1 && !generic.has(token));
const exactQuery = norm(query);

const requestHeaders = {
  'user-agent': 'Mozilla/5.0 (compatible; Project Sentinel Research Engine/1.1; +https://smarshmello.github.io/Project-Sentinel/)',
  accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
};
const githubHeaders = {
  accept: 'application/vnd.github+json',
  'user-agent': 'Project-Sentinel-Research/3.0',
  ...(process.env.GITHUB_TOKEN ? {authorization: `Bearer ${process.env.GITHUB_TOKEN}`} : {}),
};

const authoritativeDomains = new Map([
  ['gta5-mods.com', 36],
  ['lcpdfr.com', 36],
  ['nexusmods.com', 32],
  ['github.com', 20],
  ['moddb.com', 22],
  ['patreon.com', 12],
  ['youtube.com', 8],
  ['youtu.be', 8],
]);

function domainOf(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function authorityScore(domain) {
  for (const [known, score] of authoritativeDomains) {
    if (domain === known || domain.endsWith(`.${known}`)) return score;
  }
  return 4;
}

function unwrapSearchUrl(raw) {
  try {
    const value = decodeEntities(raw);
    const url = new URL(value, 'https://duckduckgo.com');
    if (url.hostname.includes('duckduckgo.com') && url.searchParams.get('uddg')) return decodeURIComponent(url.searchParams.get('uddg'));
    if (url.hostname.includes('bing.com') && url.pathname === '/ck/a') {
      const encoded = url.searchParams.get('u');
      if (encoded?.startsWith('a1')) {
        try { return Buffer.from(encoded.slice(2), 'base64').toString('utf8'); } catch {}
      }
    }
    return url.href;
  } catch {
    return raw;
  }
}

function extractSearchResults(html, provider) {
  const results = [];
  const patterns = provider === 'duckduckgo'
    ? [/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi]
    : [/<li[^>]+class="b_algo"[\s\S]*?<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi,
       /<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) && results.length < 20) {
      const url = unwrapSearchUrl(match[1]);
      if (!/^https?:\/\//i.test(url)) continue;
      const domain = domainOf(url);
      if (!domain || domain.includes('bing.com') || domain.includes('duckduckgo.com')) continue;
      results.push({url, title: stripTags(match[2]), snippet: stripTags(match[3] || ''), provider});
    }
    if (results.length) break;
  }
  return results;
}

async function fetchText(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {...options, signal: controller.signal, redirect: 'follow'});
    if (!response.ok) return null;
    return {text: await response.text(), finalUrl: response.url, contentType: response.headers.get('content-type') || ''};
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function pageMetadata(html, fallbackTitle = '', fallbackSnippet = '') {
  const pick = (regex) => decodeEntities((html.match(regex)?.[1] || '').trim());
  const title = pick(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    || pick(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)
    || stripTags(pick(/<title[^>]*>([\s\S]*?)<\/title>/i))
    || fallbackTitle;
  const description = pick(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i)
    || pick(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["'](?:description|og:description)["']/i)
    || fallbackSnippet;
  const canonical = pick(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const author = pick(/<meta[^>]+name=["']author["'][^>]+content=["']([^"']+)["']/i)
    || stripTags(html.match(/\bBy\s+<a[^>]*>([\s\S]*?)<\/a>/i)?.[1] || '')
    || stripTags(html.match(/\bBy\s+([A-Za-z0-9_. -]{2,40})/i)?.[1] || '');
  return {title, description, canonical, author};
}

function tokenOverlap(haystack) {
  const words = new Set(norm(haystack).split(' '));
  if (!queryTokens.length) return 0;
  return queryTokens.filter((token) => words.has(token)).length / queryTokens.length;
}

function scoreCandidate(candidate, corroboratingDomains) {
  const haystack = `${candidate.title} ${candidate.description} ${candidate.snippet} ${candidate.url}`;
  const normalized = norm(haystack);
  const titleNorm = norm(candidate.title);
  const exact = titleNorm.includes(exactQuery) || normalized.includes(exactQuery);
  const overlap = tokenOverlap(haystack);
  const modContext = /\b(mod|plugin|script|rage plugin hook|lspdfr|gta ?v|grand theft auto|download|installation)\b/i.test(haystack);
  const weakContext = /\b(gameplay|player|npc|callout|uniform|police|framework)\b/i.test(haystack);
  const sourceAuthority = authorityScore(candidate.domain);
  const providerBonus = Math.min(10, (candidate.providers?.length || 1) * 4);
  const corroborationBonus = Math.min(18, Math.max(0, corroboratingDomains - 1) * 8);
  const exactUrl = norm(decodeURIComponent(candidate.url)).includes(exactQuery);
  let score = (exact ? 42 : 0) + (exactUrl ? 10 : 0) + Math.round(overlap * 30) + (modContext ? 16 : weakContext ? 6 : 0) + sourceAuthority + providerBonus + corroborationBonus;
  if (overlap < 0.5) score -= 22;
  if (!exact && sourceAuthority < 12) score -= 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function extractDependencies(text) {
  const checks = [
    ['RAGE Plugin Hook', /\brage plugin hook\b|\brph\b/i],
    ['LSPDFR', /\blspdfr\b/i],
    ['Script Hook V', /\bscript hook v\b/i],
    ['Community Script Hook V .NET', /\bscript ?hook ?v?\.?net\b|\bshvdn\b/i],
    ['RAGENativeUI', /\bragenativeui\b/i],
    ['LemonUI', /\blemonui\b/i],
    ["Lenny's Mod Loader", /\blenny'?s mod loader\b|\blml\b/i],
    ['EUP Menu', /\beup menu\b/i],
  ];
  return checks.filter(([, regex]) => regex.test(text)).map(([name]) => name);
}

const comparisonTerms = [...new Set((originalQuestion.match(/(?:with|and|plus|alongside)\s+([A-Za-z0-9 .'+_-]{2,60})/gi) || [])
  .map((value) => value.replace(/^(?:with|and|plus|alongside)\s+/i, '').replace(/[?.,!].*$/, '').trim())
  .filter((value) => value && norm(value) !== exactQuery))].slice(0, 4);
const searchQueries = [
  `"${query}" GTA V mod`,
  `"${query}" LSPDFR`,
  `"${query}" download`,
  `${query} GTA 5 plugin`,
  `${query} mod`,
  ...comparisonTerms.flatMap((term) => [`"${query}" "${term}" compatibility`, `"${query}" "${term}" conflict`, `"${query}" "${term}" install`]),
];
const rawResults = [];
for (const searchQuery of searchQueries) {
  const endpoints = [
    {provider: 'bing', url: `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}&count=20`},
    {provider: 'duckduckgo', url: `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`},
  ];
  for (const endpoint of endpoints) {
    const result = await fetchText(endpoint.url, {headers: requestHeaders});
    if (!result) continue;
    rawResults.push(...extractSearchResults(result.text, endpoint.provider));
  }
}

// GitHub remains one signal, but it is no longer the only search source.
for (const searchQuery of [`${query} GTA V`, `${query} LSPDFR`, query]) {
  const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=updated&order=desc&per_page=10`, {headers: githubHeaders});
  if (!response.ok) continue;
  const payload = await response.json();
  for (const repo of payload.items || []) {
    rawResults.push({
      url: repo.html_url,
      title: repo.name,
      snippet: repo.description || '',
      provider: 'github-api',
      github: repo,
    });
  }
}

const merged = new Map();
for (const result of rawResults) {
  const cleanUrl = result.url.split('#')[0];
  const key = cleanUrl.replace(/\/$/, '').toLowerCase();
  const existing = merged.get(key) || {...result, url: cleanUrl, providers: [], snippets: []};
  if (!existing.providers.includes(result.provider)) existing.providers.push(result.provider);
  if (result.snippet && !existing.snippets.includes(result.snippet)) existing.snippets.push(result.snippet);
  if (!existing.title && result.title) existing.title = result.title;
  if (result.github) existing.github = result.github;
  merged.set(key, existing);
}

const preliminary = [...merged.values()]
  .map((item) => ({...item, domain: domainOf(item.url), preliminary: tokenOverlap(`${item.title} ${item.snippets.join(' ')} ${item.url}`)}))
  .filter((item) => item.preliminary >= 0.34 || norm(`${item.title} ${item.url}`).includes(exactQuery))
  .sort((a, b) => (authorityScore(b.domain) + b.preliminary * 30) - (authorityScore(a.domain) + a.preliminary * 30))
  .slice(0, 24);

const enriched = [];
for (const item of preliminary) {
  let metadata = {title: item.title || '', description: item.snippets?.[0] || '', canonical: '', author: ''};
  let finalUrl = item.url;
  if (!item.github) {
    const page = await fetchText(item.url, {headers: requestHeaders}, 12000);
    if (page && /text\/html|application\/xhtml/i.test(page.contentType)) {
      metadata = pageMetadata(page.text, metadata.title, metadata.description);
      finalUrl = metadata.canonical || page.finalUrl || item.url;
    }
  } else {
    metadata = {
      title: item.github.name,
      description: item.github.description || '',
      canonical: item.github.html_url,
      author: item.github.owner?.login || '',
    };
  }
  enriched.push({
    url: finalUrl,
    domain: domainOf(finalUrl),
    title: metadata.title || item.title || query,
    description: metadata.description || item.snippets?.[0] || '',
    snippet: item.snippets?.join(' ') || '',
    author: metadata.author || '',
    providers: item.providers,
    source: item.github ? 'github' : 'web',
    stars: item.github?.stargazers_count || 0,
    updatedAt: item.github?.updated_at || null,
  });
}

const relevantDomains = new Set(enriched.filter((item) => tokenOverlap(`${item.title} ${item.description} ${item.url}`) >= 0.7).map((item) => item.domain));
const candidates = enriched
  .map((candidate) => ({...candidate, score: scoreCandidate(candidate, relevantDomains.size)}))
  .sort((a, b) => b.score - a.score)
  .slice(0, 12);
const credible = candidates.filter((candidate) => candidate.score >= 68);
const current = await read();
const now = new Date().toISOString();
const requestId = /^[a-zA-Z0-9_-]{8,100}$/.test(suppliedRequestId)
  ? suppliedRequestId
  : `request-${slug(query)}-${crypto.createHash('sha1').update(query.toLowerCase()).digest('hex').slice(0, 7)}`;
const requests = [{
  id: requestId,
  requestId,
  query,
  status: credible.length ? 'resolved' : candidates.length ? 'needs-manual-research' : 'no-results',
  requestedAt: now,
  completedAt: now,
  searchProviders: ['Bing web search', 'DuckDuckGo web search', 'GitHub API'],
  candidateCount: candidates.length,
  credibleCandidateCount: credible.length,
  candidates,
}, ...(current.requests || []).filter((item) => item.id !== requestId)].slice(0, 200);
let discoveries = current.discoveries || [];

if (credible.length) {
  const best = credible[0];
  const combinedText = credible.map((item) => `${item.title} ${item.description} ${item.snippet}`).join(' ');
  const dependencies = extractDependencies(combinedText);
  const compatibilityEvidence = comparisonTerms.map((term) => {
    const matching = credible.filter((item) => {
      const text = norm(`${item.title} ${item.description} ${item.snippet} ${item.url}`);
      return text.includes(norm(term)) && text.includes(exactQuery);
    });
    const negative = matching.filter((item) => /incompatib|conflict|does not work|not compatible|crash/i.test(`${item.title} ${item.description} ${item.snippet}`));
    const positive = matching.filter((item) => /compatib|works with|support|requires|integration/i.test(`${item.title} ${item.description} ${item.snippet}`) && !negative.includes(item));
    const confidence = Math.min(90, matching.length * 16 + Math.max(...matching.map((item) => item.score || 0), 0) * 0.35);
    return {project: term, sourceCount: matching.length, positiveCount: positive.length, negativeCount: negative.length, confidence: Math.round(confidence), sources: matching.slice(0, 5)};
  });
  const compatibilityConfidence = compatibilityEvidence.length ? Math.max(...compatibilityEvidence.map((item) => item.confidence), 0) : 0;
  const identityConfidence = Math.min(98, Math.round((best.score || 0) + Math.min(12, credible.length * 2)));
  const sourceCredibility = Math.min(98, Math.round(credible.reduce((sum, item) => sum + (item.score || 0), 0) / credible.length));
  const documentationConfidence = Math.min(95, (best.description?.length > 140 ? 32 : 18) + (best.author ? 18 : 0) + (dependencies.length ? 18 : 0) + Math.min(27, credible.length * 5));
  const id = `research-${slug(query)}-${crypto.createHash('sha1').update((best.url || query).toLowerCase()).digest('hex').slice(0, 7)}`;
  const record = {
    id,
    name: query,
    shortName: null,
    aliases: [...new Set([query, ...credible.map((item) => item.title).filter(Boolean)])].slice(0, 10),
    category: 'Research discoveries',
    status: 'research',
    version: 'Not verified',
    developer: best.author || 'Unknown',
    impact: 'Unknown',
    confidence: identityConfidence,
    identityConfidence,
    sourceCredibility,
    documentationConfidence,
    compatibilityConfidence,
    compatibilityEvidence,
    description: best.description || `Sentinel Research found credible public sources for ${query}. Compatibility remains unverified until review.`,
    dependencies,
    tags: ['Internet research', 'Pending review', 'Automatic discovery'],
    guide: null,
    download: best.url,
    note: `Research Engine found ${credible.length} credible source${credible.length === 1 ? '' : 's'} across ${new Set(credible.map((item) => item.domain)).size} domain${new Set(credible.map((item) => item.domain)).size === 1 ? '' : 's'}. This project was added automatically as Research and must be reviewed before compatibility approval.`,
    sentinelPolice: false,
    researchDiscovered: true,
    researchStatus: 'pending-review',
    requestedAt: now,
    sources: credible,
    candidates,
  };
  discoveries = [record, ...discoveries.filter((item) => item.id !== id && norm(item.name) !== norm(record.name))].slice(0, 250);
  console.log(`Research record added for ${record.name}; best source ${best.domain}, score ${best.score}.`);
} else if (candidates.length) {
  console.log(`No candidate cleared the credibility threshold for ${query}. ${candidates.length} candidate(s) retained for manual review.`);
} else {
  console.log(`No relevant public source was found for ${query}.`);
}

await fs.mkdir(new URL('static/data/', root), {recursive: true});
await fs.writeFile(dataPath, JSON.stringify({schemaVersion: 4, updatedAt: now, discoveries, requests}, null, 2) + '\n');
