const API_VERSION = '2022-11-28';

function cors(env, origin) {
  const allowed = env.ALLOWED_ORIGIN || 'https://smarshmello.github.io';
  return {
    'access-control-allow-origin': origin === allowed ? origin : allowed,
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type,x-watcher-key',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

function json(data, status, env, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {'content-type': 'application/json; charset=utf-8', ...cors(env, origin)},
  });
}

function githubHeaders(env) {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${env.GITHUB_TOKEN}`,
    'x-github-api-version': API_VERSION,
    'user-agent': 'Project-Sentinel-Watcher-Control/0.6',
  };
}

function apiBase(env) {
  return `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}`;
}

async function github(env, path, options = {}) {
  return fetch(`${apiBase(env)}${path}`, {
    ...options,
    headers: {...githubHeaders(env), ...(options.headers || {})},
  });
}

function requireAdmin(request, env) {
  const supplied = request.headers.get('x-watcher-key') || '';
  return Boolean(env.WATCHER_ADMIN_KEY) && supplied === env.WATCHER_ADMIN_KEY;
}

async function findRun(env, workflowFile, scanId) {
  const response = await github(env, `/actions/workflows/${workflowFile}/runs?event=workflow_dispatch&per_page=30`);
  if (!response.ok) throw new Error(`GitHub runs API returned ${response.status}`);
  const runs = (await response.json()).workflow_runs || [];
  return runs.find((run) => String(run.display_title || '').includes(scanId)) || null;
}

function stepProgress(jobs) {
  const steps = jobs.flatMap((job) => (job.steps || []).map((step) => ({...step, job: job.name})));
  const completed = steps.filter((step) => step.status === 'completed').length;
  const total = Math.max(steps.length, 1);
  const active = steps.find((step) => step.status === 'in_progress') || null;
  return {
    completed,
    total,
    percent: Math.min(99, Math.round((completed / total) * 100)),
    activeStep: active ? active.name : null,
    steps: steps.map((step) => ({name: step.name, job: step.job, status: step.status, conclusion: step.conclusion})),
  };
}

async function statusForRun(env, run) {
  const jobsResponse = await github(env, `/actions/runs/${run.id}/jobs?per_page=20`);
  const jobs = jobsResponse.ok ? ((await jobsResponse.json()).jobs || []) : [];
  const progress = stepProgress(jobs);
  const finished = run.status === 'completed';
  return {
    found: true,
    runId: run.id,
    scanId: String(run.display_title || '').replace(/^Sentinel (?:Watcher|Research)\s*—\s*/, ''),
    status: run.status,
    conclusion: run.conclusion,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    runUrl: run.html_url,
    percent: finished ? 100 : progress.percent,
    activeStep: finished ? (run.conclusion === 'success' ? 'Scan complete' : 'Scan finished with an error') : (progress.activeStep || 'Waiting for runner'),
    steps: progress.steps,
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors(env, origin)});

    const url = new URL(request.url);
    try {
      if (url.pathname === '/health' && request.method === 'GET') {
        return json({ok: true, service: 'Sentinel Watcher Control', version: '1.0.0', researchService: true}, 200, env, origin);
      }

      if (url.pathname === '/trigger' && request.method === 'POST') {
        if (!requireAdmin(request, env)) return json({error: 'Invalid Watcher admin key.'}, 401, env, origin);
        const scanId = `web-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
        const response = await github(env, `/actions/workflows/${env.WORKFLOW_FILE}/dispatches`, {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({ref: 'main', inputs: {scan_id: scanId}}),
        });
        if (!response.ok) {
          const detail = await response.text();
          return json({error: `GitHub rejected the scan request (${response.status}).`, detail}, 502, env, origin);
        }
        return json({ok: true, scanId, status: 'queued'}, 202, env, origin);
      }


      if (url.pathname === '/research' && request.method === 'POST') {
        if (!requireAdmin(request, env)) return json({error: 'Watcher admin key required to submit research.'}, 401, env, origin);
        const body = await request.json().catch(() => ({}));
        const query = String(body.query || '').trim().replace(/\s+/g, ' ');
        if (query.length < 3 || query.length > 120) return json({error: 'Research query must be 3–120 characters.'}, 400, env, origin);
        const suppliedRequestId = String(body.requestId || '').trim();
        const requestId = /^[a-zA-Z0-9_-]{8,100}$/.test(suppliedRequestId)
          ? suppliedRequestId
          : `expert-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
        const scanId = `research-${requestId}`.slice(0, 120);
        const researchWorkflow = env.RESEARCH_WORKFLOW_FILE || 'sentinel-research.yml';
        const existing = await findRun(env, researchWorkflow, requestId);
        if (existing && existing.status !== 'completed') {
          return json({ok: true, reused: true, requestId, scanId, query, status: existing.status, runId: existing.id, runUrl: existing.html_url}, 200, env, origin);
        }
        const response = await github(env, `/actions/workflows/${researchWorkflow}/dispatches`, {
          method: 'POST', headers: {'content-type': 'application/json'},
          body: JSON.stringify({ref: 'main', inputs: {research_query: query, research_request_id: requestId, original_question: String(body.question || '').slice(0, 500)}}),
        });
        if (!response.ok) return json({error: `GitHub rejected the research request (${response.status}).`, detail: await response.text()}, 502, env, origin);
        return json({ok: true, reused: false, requestId, scanId, query, status: 'queued'}, 202, env, origin);
      }


      if (url.pathname === '/research-result' && request.method === 'GET') {
        if (!requireAdmin(request, env)) return json({error: 'Watcher admin key required.'}, 401, env, origin);
        const requestId = String(url.searchParams.get('requestId') || '').trim();
        if (!requestId) return json({error: 'requestId is required.'}, 400, env, origin);
        const response = await github(env, '/contents/static/data/research-results.json?ref=main');
        if (!response.ok) return json({error: `Research data is not available yet (${response.status}).`}, response.status === 404 ? 404 : 502, env, origin);
        const payload = await response.json();
        const content = String(payload.content || '').replace(/\n/g, '');
        let data;
        try { data = JSON.parse(atob(content)); } catch { return json({error: 'Published research data could not be decoded.'}, 502, env, origin); }
        const requestRecord = (data.requests || []).find((item) => item.requestId === requestId || item.id === requestId);
        if (!requestRecord) return json({found: false, requestId}, 404, env, origin);
        return json({found: true, request: requestRecord, discoveries: data.discoveries || [], data}, 200, env, origin);
      }

      if (url.pathname === '/status' && request.method === 'GET') {
        if (!requireAdmin(request, env)) return json({error: 'Invalid Watcher admin key.'}, 401, env, origin);
        const runId = url.searchParams.get('runId');
        const scanId = url.searchParams.get('scanId');
        let run = null;
        if (runId) {
          const response = await github(env, `/actions/runs/${encodeURIComponent(runId)}`);
          if (response.ok) run = await response.json();
        } else if (scanId) {
          const workflowFile = scanId && scanId.startsWith('research-') ? (env.RESEARCH_WORKFLOW_FILE || 'sentinel-research.yml') : env.WORKFLOW_FILE;
          const lookupId = scanId && scanId.startsWith('research-') ? scanId.replace(/^research-/, '') : scanId;
          run = await findRun(env, workflowFile, lookupId);
        }
        if (!run) return json({found: false, status: 'queued', activeStep: 'Waiting for GitHub to create the run', percent: 2}, 200, env, origin);
        return json(await statusForRun(env, run), 200, env, origin);
      }

      return json({error: 'Not found'}, 404, env, origin);
    } catch (error) {
      return json({error: error instanceof Error ? error.message : 'Unexpected Worker error'}, 500, env, origin);
    }
  },
};
