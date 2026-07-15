import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const root = new URL('../', import.meta.url);
const registry = JSON.parse(await fs.readFile(new URL('sentinel-watcher/sources.json', root), 'utf8'));
const previousPath = new URL('public/data/watcher-report.json', root);
let previous = null;
try { previous = JSON.parse(await fs.readFile(previousPath, 'utf8')); } catch {}

const checkedAt = new Date().toISOString();
const userAgent = 'Project-Sentinel-Watcher/0.2 (+https://github.com/SmarshMello/Project-Sentinel)';
const maxAttempts = 3;
const timeoutMs = 18000;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 20);
}

function githubRepo(url) {
  const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/i);
  return match ? { owner: match[1], repo: match[2].replace(/\.git$/i, '') } : null;
}

function classifyHttp(status) {
  if (status >= 200 && status < 400) return 'healthy';
  if ([401, 403].includes(status)) return 'blocked';
  if (status === 404 || status === 410) return 'not-found';
  if (status === 429) return 'rate-limited';
  if (status >= 500) return 'server-error';
  return 'failed';
}

function reviewFor(status, result) {
  const mapping = {
    'version-changed': ['high', 'A new release was detected and compatibility should be reviewed.'],
    archived: ['high', 'The GitHub repository is archived. Confirm whether the mod should be marked legacy or deprecated.'],
    'not-found': ['high', 'The official source returned 404/410. Confirm whether the project moved or was removed.'],
    'page-changed': ['medium', 'The source metadata changed. Review the page for a new version, dependencies, or compatibility notes.'],
    redirected: ['medium', 'The source redirected to a different URL. Confirm and update the official link if appropriate.'],
    'server-error': ['medium', 'The source returned a server error after retries. Recheck manually later.'],
    'rate-limited': ['low', 'The source rate-limited the automated check. Manual review is optional.'],
    blocked: ['low', 'The source blocks automated checks. Do not treat this as a dead mod.'],
    'timed-out': ['low', 'The source timed out after retries. Do not treat this as a dead mod.'],
    failed: ['medium', 'The automated check failed unexpectedly. Review the error details.'],
  };
  const [priority, reason] = mapping[status] || ['none', 'No review required.'];
  return { needsReview: priority !== 'none', reviewPriority: priority, reviewReason: reason, ...result };
}

async function fetchWithRetry(url, options = {}) {
  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'user-agent': userAgent,
          accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.8',
          ...(options.headers || {}),
        },
        ...options,
      });
      clearTimeout(timer);
      return { response, attempts: attempt };
    } catch (error) {
      clearTimeout(timer);
      lastError = error;
      if (attempt < maxAttempts) await delay(1200 * attempt);
    }
  }
  throw Object.assign(lastError || new Error('Request failed'), { attempts: maxAttempts });
}

async function inspectGitHub(source, result, repoInfo) {
  const headers = { accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const { response: repoRes, attempts } = await fetchWithRetry(
    `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
    { headers },
  );
  result.attempts = attempts;
  result.httpStatus = repoRes.status;
  result.status = classifyHttp(repoRes.status);

  if (!repoRes.ok) {
    result.note = `GitHub API returned HTTP ${repoRes.status}.`;
    return result;
  }

  const repo = await repoRes.json();
  result.reachable = true;
  result.archived = Boolean(repo.archived);
  result.finalUrl = repo.html_url;
  result.lastActivity = repo.pushed_at;
  result.defaultBranch = repo.default_branch;
  result.status = result.archived ? 'archived' : 'healthy';

  const { response: releaseRes } = await fetchWithRetry(
    `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/releases/latest`,
    { headers },
  );
  if (releaseRes.ok) {
    const release = await releaseRes.json();
    result.latestRelease = release.tag_name || release.name || null;
    result.releasePublishedAt = release.published_at || null;
    result.releaseUrl = release.html_url || null;
  } else if (releaseRes.status === 404) {
    const { response: tagsRes } = await fetchWithRetry(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/tags?per_page=1`,
      { headers },
    );
    if (tagsRes.ok) {
      const tags = await tagsRes.json();
      result.latestRelease = tags?.[0]?.name || null;
      result.releaseUrl = tags?.[0]?.zipball_url || null;
    }
  }

  result.fingerprint = hash([
    result.httpStatus,
    result.finalUrl,
    result.archived,
    result.latestRelease,
    result.lastActivity,
  ].join('|'));
  return result;
}

async function inspectWebsite(source, result) {
  const original = new URL(source.url);
  const { response, attempts } = await fetchWithRetry(source.url);
  result.attempts = attempts;
  result.httpStatus = response.status;
  result.finalUrl = response.url || source.url;
  result.reachable = response.ok || [401, 403, 429].includes(response.status);
  result.status = classifyHttp(response.status);

  const final = new URL(result.finalUrl);
  const redirected = result.finalUrl !== source.url && (final.hostname !== original.hostname || final.pathname !== original.pathname);
  if (redirected && result.status === 'healthy') result.status = 'redirected';

  if (result.status === 'blocked') {
    result.note = 'Source blocks automated checks; this does not mean the mod is unavailable.';
  } else if (result.status === 'rate-limited') {
    result.note = 'Source rate-limited the scan; retry on the next scheduled run.';
  } else if (!response.ok) {
    result.note = `Source returned HTTP ${response.status}.`;
  } else if (redirected) {
    result.note = `Source redirected to ${result.finalUrl}.`;
  }

  const metadata = [
    response.headers.get('etag'),
    response.headers.get('last-modified'),
    response.headers.get('content-length'),
    response.headers.get('content-type'),
  ].join('|');
  result.fingerprint = hash(`${response.status}|${result.finalUrl}|${metadata}`);
  return result;
}

async function inspect(source) {
  const result = {
    ...source,
    checkedAt,
    reachable: false,
    httpStatus: null,
    finalUrl: source.url,
    sourceType: 'website',
    archived: false,
    latestRelease: null,
    lastActivity: null,
    status: 'unknown',
    change: 'none',
    note: '',
    attempts: 0,
  };

  try {
    const repoInfo = githubRepo(source.url);
    if (repoInfo) {
      result.sourceType = 'github';
      await inspectGitHub(source, result, repoInfo);
    } else {
      await inspectWebsite(source, result);
    }
  } catch (error) {
    result.attempts = error.attempts || maxAttempts;
    if (error.name === 'AbortError') {
      result.status = 'timed-out';
      result.note = `Timed out after ${result.attempts} attempts.`;
    } else {
      result.status = 'failed';
      result.note = `Check failed after ${result.attempts} attempts: ${error.message}`;
    }
  }

  const old = previous?.items?.find((item) => item.id === source.id);
  if (result.archived) {
    result.change = 'archived';
  } else if (old?.latestRelease && result.latestRelease && old.latestRelease !== result.latestRelease) {
    result.change = 'version-changed';
    result.status = 'version-changed';
    result.previousRelease = old.latestRelease;
  } else if (old?.fingerprint && result.fingerprint && old.fingerprint !== result.fingerprint) {
    result.change = 'page-changed';
    if (result.status === 'healthy') result.status = 'page-changed';
  } else if (['not-found', 'server-error', 'rate-limited', 'blocked', 'timed-out', 'failed', 'redirected'].includes(result.status)) {
    result.change = result.status;
  }

  return reviewFor(result.status, result);
}

const items = [];
const concurrency = 3;
for (let index = 0; index < registry.sources.length; index += concurrency) {
  const batch = registry.sources.slice(index, index + concurrency);
  items.push(...await Promise.all(batch.map(inspect)));
  process.stdout.write('.');
  await delay(350);
}
console.log('');

const statusCount = (status) => items.filter((item) => item.status === status).length;
const counts = {
  tracked: items.length,
  healthy: statusCount('healthy'),
  changed: items.filter((item) => ['version-changed', 'page-changed'].includes(item.status)).length,
  timedOut: statusCount('timed-out'),
  blocked: statusCount('blocked'),
  redirected: statusCount('redirected'),
  notFound: statusCount('not-found'),
  rateLimited: statusCount('rate-limited'),
  serverErrors: statusCount('server-error'),
  archived: statusCount('archived'),
  failed: statusCount('failed'),
  needsReview: items.filter((item) => item.needsReview).length,
};

const reviewQueue = items
  .filter((item) => item.needsReview)
  .sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2, none: 3 };
    return order[a.reviewPriority] - order[b.reviewPriority] || a.name.localeCompare(b.name);
  })
  .map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    status: item.status,
    priority: item.reviewPriority,
    reason: item.reviewReason,
    note: item.note,
    sourceUrl: item.finalUrl || item.url,
    expectedVersion: item.expectedVersion,
    latestRelease: item.latestRelease,
    previousRelease: item.previousRelease || null,
    sentinelPolice: item.sentinelPolice,
  }));

const report = {
  schemaVersion: 2,
  watcherVersion: '0.2.0',
  checkedAt,
  counts,
  reviewQueue,
  items,
};

await fs.mkdir(new URL('public/data/', root), { recursive: true });
await fs.writeFile(previousPath, `${JSON.stringify(report, null, 2)}\n`);
await fs.mkdir(new URL('sentinel-watcher/reports/', root), { recursive: true });
await fs.writeFile(new URL('sentinel-watcher/reports/latest.json', root), `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(new URL('sentinel-watcher/reports/review-queue.json', root), `${JSON.stringify(reviewQueue, null, 2)}\n`);

const statusLabels = {
  healthy: 'Healthy',
  'version-changed': 'Version changed',
  'page-changed': 'Page changed',
  'timed-out': 'Timed out',
  blocked: 'Automation blocked',
  redirected: 'Redirected',
  'not-found': 'Not found',
  'rate-limited': 'Rate limited',
  'server-error': 'Server error',
  archived: 'Archived',
  failed: 'Failed',
};

const reportLines = [
  '# Sentinel Watcher report',
  '',
  `Generated: ${checkedAt}`,
  '',
  '| Metric | Count |',
  '|---|---:|',
  ...Object.entries(counts).map(([key, value]) => `| ${key} | ${value} |`),
  '',
  '## High-priority review',
  '',
  ...reviewQueue.filter((item) => item.priority === 'high').map((item) => `- **${item.name}** — ${statusLabels[item.status] || item.status}: ${item.reason} ([source](${item.sourceUrl}))`),
  '',
  '## Medium-priority review',
  '',
  ...reviewQueue.filter((item) => item.priority === 'medium').map((item) => `- **${item.name}** — ${statusLabels[item.status] || item.status}: ${item.reason} ([source](${item.sourceUrl}))`),
  '',
  '## Low-priority / informational',
  '',
  ...reviewQueue.filter((item) => item.priority === 'low').map((item) => `- **${item.name}** — ${statusLabels[item.status] || item.status}: ${item.note || item.reason} ([source](${item.sourceUrl}))`),
];

await fs.writeFile(new URL('sentinel-watcher/reports/latest.md', root), `${reportLines.join('\n')}\n`);
console.log(JSON.stringify(counts));
