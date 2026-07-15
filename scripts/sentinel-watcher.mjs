import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const root = new URL('../', import.meta.url);
const sources = JSON.parse(await fs.readFile(new URL('sentinel-watcher/sources.json', root), 'utf8')).sources;
const reportPath = new URL('public/data/watcher-report.json', root);
const statePath = new URL('sentinel-watcher/state.json', root);
const readJson = async (url, fallback) => { try { return JSON.parse(await fs.readFile(url, 'utf8')); } catch { return fallback; } };
const previous = await readJson(reportPath, null);
const state = await readJson(statePath, {items: {}});
const checkedAt = new Date().toISOString();
const startedAt = Date.now();
const ua = 'Project-Sentinel-Watcher/0.3 (+https://github.com/SmarshMello/Project-Sentinel)';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const digest = (value) => crypto.createHash('sha256').update(String(value)).digest('hex').slice(0, 20);
const cleanVersion = (value) => String(value || '').toLowerCase().replace(/^v(?=\d)/, '').replace(/[^0-9a-z.]+/g, '');
const concreteVersion = (value) => /\d/.test(cleanVersion(value)) && !/(current|latest|unknown|various|research)/i.test(String(value || ''));
const repoFrom = (url) => { const m = String(url).match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/i); return m ? {owner:m[1], repo:m[2].replace(/\.git$/i,'')} : null; };

function profile(url) {
  const host = new URL(url).hostname.toLowerCase();
  if (host.includes('github.com')) return {timeout: 9000, attempts: 2};
  if (host.includes('lcpdfr.com')) return {timeout: 14000, attempts: 2};
  return {timeout: 11000, attempts: 2};
}

async function fetchRetry(url, options = {}) {
  const config = profile(url);
  let last;
  for (let attempt = 1; attempt <= config.attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeout);
    try {
      const response = await fetch(url, {
        ...options,
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'user-agent': ua,
          accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
          ...(options.headers || {}),
        },
      });
      clearTimeout(timer);
      return {response, attempts: attempt};
    } catch (error) {
      clearTimeout(timer);
      last = error;
      if (attempt < config.attempts) await wait(500 * attempt);
    }
  }
  throw Object.assign(last || new Error('Request failed'), {attempts: config.attempts});
}

const classify = (status) => status >= 200 && status < 400 ? 'healthy' : [401,403].includes(status) ? 'blocked' : status === 429 ? 'rate-limited' : [404,410].includes(status) ? 'not-found' : status >= 500 ? 'server-error' : 'failed';
const textMatch = (html, patterns) => { for (const pattern of patterns) { const m = html.match(pattern); if (m?.[1]) return m[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,240); } return null; };

async function inspectGitHub(source, result, repo) {
  const headers = {accept:'application/vnd.github+json','x-github-api-version':'2022-11-28'};
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const {response, attempts} = await fetchRetry(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, {headers});
  result.attempts = attempts; result.httpStatus = response.status; result.status = classify(response.status);
  if (!response.ok) { result.note = `GitHub API returned HTTP ${response.status}.`; return; }
  const data = await response.json();
  result.reachable = true; result.archived = Boolean(data.archived); result.finalUrl = data.html_url; result.lastActivity = data.pushed_at; result.status = result.archived ? 'archived' : 'healthy';
  const latest = await fetchRetry(`https://api.github.com/repos/${repo.owner}/${repo.repo}/releases/latest`, {headers});
  if (latest.response.ok) { const release = await latest.response.json(); result.latestRelease = release.tag_name || release.name || null; result.releaseUrl = release.html_url || null; }
  else if (latest.response.status === 404) { const tags = await fetchRetry(`https://api.github.com/repos/${repo.owner}/${repo.repo}/tags?per_page=1`, {headers}); if (tags.response.ok) result.latestRelease = (await tags.response.json())?.[0]?.name || null; }
  result.fingerprint = digest([result.finalUrl,result.archived,result.latestRelease,result.lastActivity].join('|'));
}

async function inspectWebsite(source, result) {
  const {response, attempts} = await fetchRetry(source.url);
  result.attempts = attempts; result.httpStatus = response.status; result.finalUrl = response.url || source.url; result.status = classify(response.status); result.reachable = response.ok || [401,403,429].includes(response.status);
  let html = '';
  const length = Number(response.headers.get('content-length') || 0);
  if (length < 2000000) { try { html = (await response.text()).slice(0,1500000); } catch {} }
  const title = textMatch(html,[/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i,/<title[^>]*>([\s\S]*?)<\/title>/i]);
  const detected = textMatch(html, [/["']softwareVersion["']\s*:\s*["']([^"']+)/i, /\bversion\s*[:\-]\s*(v?\d+(?:\.\d+){1,4})/i]);
  result.pageTitle = title; result.detectedVersion = detected;
  if (/just a moment|cf-chl-|cloudflare ray id/i.test(html)) { result.status = 'blocked'; result.note = 'The source returned an anti-bot challenge; the page may still be healthy.'; }
  const original = new URL(source.url); const final = new URL(result.finalUrl);
  if (result.status === 'healthy' && (original.hostname !== final.hostname || original.pathname !== final.pathname)) { result.status = 'redirected'; result.note = `Source redirected to ${result.finalUrl}.`; }
  if (result.status === 'blocked' && !result.note) result.note = 'Source blocks automated checks; this is not evidence the mod is dead.';
  if (result.status === 'rate-limited') result.note = 'Source rate-limited the scan; retry next run.';
  if (!response.ok && !result.note) result.note = `Source returned HTTP ${response.status}.`;
  result.fingerprint = digest([response.status,result.finalUrl,title,detected,response.headers.get('last-modified')].join('|'));
}

function review(result) {
  let priority = 'none'; let reason = 'No review required.';
  if (result.status === 'possible-update') { priority='high'; reason='A newer release may be available. Review compatibility before updating the database.'; }
  else if (result.status === 'archived') { priority='high'; reason='Repository is archived. Decide whether this should be marked legacy or deprecated.'; }
  else if (result.status === 'not-found') { priority=result.statusStreak >= 2 ? 'high' : 'medium'; reason=result.statusStreak >= 2 ? 'The source returned 404/410 on consecutive scans.' : 'The source returned 404/410 once; recheck before changing its status.'; }
  else if (result.status === 'redirected') { priority='medium'; reason='Confirm whether the official database link should be updated.'; }
  else if (['failed','server-error'].includes(result.status)) { priority=result.statusStreak >= 2 ? 'medium' : 'low'; reason='Review only if this failure persists.'; }
  else if (result.status === 'timed-out' && result.statusStreak >= 3) { priority='low'; reason='Repeated timeouts deserve a manual check but do not imply the mod is dead.'; }
  else if (result.status === 'metadata-changed' && result.statusStreak >= 2) { priority='low'; reason='Stable metadata changed across repeated scans.'; }
  result.needsReview = priority !== 'none'; result.reviewPriority = priority; result.reviewReason = reason;
  const base = {healthy:100,'possible-update':88,'metadata-changed':92,redirected:82,blocked:76,'rate-limited':74,'timed-out':68,'server-error':48,failed:42,'not-found':20,archived:35}[result.status] ?? 60;
  result.healthScore = Math.max(0, base - (['timed-out','server-error','failed','not-found'].includes(result.status) ? Math.min(20,(result.statusStreak-1)*5) : 0));
  return result;
}

async function inspect(source, index, total) {
  const old = previous?.items?.find((item) => item.id === source.id) || state.items?.[source.id];
  const result = {...source,checkedAt,reachable:false,httpStatus:null,finalUrl:source.url,sourceType:'website',archived:false,latestRelease:null,detectedVersion:null,status:'unknown',change:'none',note:'',attempts:0};
  try { const repo = repoFrom(source.url); if (repo) { result.sourceType='github'; await inspectGitHub(source,result,repo); } else await inspectWebsite(source,result); }
  catch (error) { result.attempts=error.attempts||2; result.status=error.name==='AbortError'?'timed-out':'failed'; result.note=error.name==='AbortError'?`Timed out after ${result.attempts} attempts.`:`Check failed: ${error.message}`; }
  const detected = result.latestRelease || result.detectedVersion;
  if (result.archived) result.change='archived';
  else if (detected && concreteVersion(source.expectedVersion) && cleanVersion(detected) !== cleanVersion(source.expectedVersion)) { result.status='possible-update'; result.change='possible-update'; result.previousRelease=source.expectedVersion; }
  else if (previous?.watcherVersion?.startsWith('0.3') && old?.latestRelease && result.latestRelease && cleanVersion(old.latestRelease)!==cleanVersion(result.latestRelease)) { result.status='possible-update'; result.change='possible-update'; result.previousRelease=old.latestRelease; }
  else if (previous?.watcherVersion?.startsWith('0.3') && old?.fingerprint && result.fingerprint && old.fingerprint!==result.fingerprint && result.status==='healthy') { result.status='metadata-changed'; result.change='metadata-changed'; }
  else if (result.status!=='healthy') result.change=result.status;
  result.statusStreak = old?.status === result.status ? Number(old.statusStreak||1)+1 : 1;
  review(result);
  console.log(`[${index+1}/${total}] ${result.name}: ${result.status}`);
  return result;
}

async function concurrent(values, limit) {
  const output = new Array(values.length); let cursor=0;
  async function worker(){ while(cursor<values.length){ const i=cursor++; output[i]=await inspect(values[i],i,values.length); } }
  await Promise.all(Array.from({length:Math.min(limit,values.length)},worker)); return output;
}

const items = await concurrent(sources,6);
const count = (status) => items.filter((item)=>item.status===status).length;
const counts = {tracked:items.length,healthy:count('healthy'),possibleUpdates:count('possible-update'),metadataChanged:count('metadata-changed'),timedOut:count('timed-out'),blocked:count('blocked'),redirected:count('redirected'),notFound:count('not-found'),rateLimited:count('rate-limited'),serverErrors:count('server-error'),archived:count('archived'),failed:count('failed'),needsReview:items.filter((i)=>i.needsReview).length,highPriority:items.filter((i)=>i.reviewPriority==='high').length};
const averageHealth = items.length ? Math.round(items.reduce((sum,item)=>sum+item.healthScore,0)/items.length) : 0;
const reviewQueue = items.filter((i)=>i.needsReview).sort((a,b)=>({high:0,medium:1,low:2}[a.reviewPriority]-({high:0,medium:1,low:2}[b.reviewPriority]))).map((i)=>({id:i.id,name:i.name,status:i.status,priority:i.reviewPriority,reason:i.reviewReason,sourceUrl:i.finalUrl||i.url,expectedVersion:i.expectedVersion,detectedVersion:i.latestRelease||i.detectedVersion,statusStreak:i.statusStreak,healthScore:i.healthScore}));
const report = {schemaVersion:3,watcherVersion:'0.3.0',checkedAt,durationSeconds:Math.round((Date.now()-startedAt)/1000),averageHealth,counts,reviewQueue,items};
const nextState = {schemaVersion:1,updatedAt:checkedAt,items:Object.fromEntries(items.map((i)=>[i.id,{status:i.status,statusStreak:i.statusStreak,fingerprint:i.fingerprint||null,latestRelease:i.latestRelease||null,checkedAt:i.checkedAt}]))};
await fs.mkdir(new URL('public/data/',root),{recursive:true}); await fs.mkdir(new URL('sentinel-watcher/reports/',root),{recursive:true});
await fs.writeFile(reportPath,JSON.stringify(report,null,2)+'\n'); await fs.writeFile(statePath,JSON.stringify(nextState,null,2)+'\n'); await fs.writeFile(new URL('sentinel-watcher/reports/latest.json',root),JSON.stringify(report,null,2)+'\n'); await fs.writeFile(new URL('sentinel-watcher/reports/review-queue.json',root),JSON.stringify(reviewQueue,null,2)+'\n');
const lines=['# Sentinel Watcher report','',`Generated: ${checkedAt}`,`Runtime: ${report.durationSeconds}s`,`Average source health: ${averageHealth}%`,'','| Metric | Count |','|---|---:|',...Object.entries(counts).map(([k,v])=>`| ${k} | ${v} |`),'','## Review queue','',...(reviewQueue.length?reviewQueue.map((i)=>`- **${i.name}** — ${i.priority}: ${i.reason} (health ${i.healthScore}%, streak ${i.statusStreak}) ([source](${i.sourceUrl}))`):['- None']),'','Timeouts and automation blocks are not treated as dead projects.'];
await fs.writeFile(new URL('sentinel-watcher/reports/latest.md',root),lines.join('\n')+'\n'); console.log(`Completed in ${report.durationSeconds}s.`);
