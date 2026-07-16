# Project Sentinel 8.0 — Expert Step 8
## Duplicate-safe Watcher research

### Purpose
Prevents accidental double-clicks or repeated unknown-mod questions from launching multiple research workflows and confusing Sentinel Expert's progress tracking.

### Changes
- Every Expert research attempt receives a unique `requestId`.
- The same request ID follows the question through Expert, Cloudflare Worker, GitHub Actions, the research script, and `research-results.json`.
- Expert stores an active research request in session storage for 15 minutes.
- Repeated submissions for the same unknown project reconnect to the existing request instead of dispatching another workflow.
- The research button remains disabled while the request is queued, running, or publishing.
- Published results are matched by exact request ID first, rather than relying only on project name and timestamp.
- The Worker checks for an existing active GitHub run with the same scan ID before dispatching.
- Completion, failure, and timeout clean up the active request lock.

### Files
- `src/pages/sentinel-ai/index.js`
- `watcher-control-worker/src/index.js`
- `.github/workflows/sentinel-watcher.yml`
- `scripts/sentinel-research.mjs`

### Install
Copy the package contents into the repository root and allow folders to merge.

Commit message:

`Project Sentinel 8.0 Step 8 - duplicate-safe Watcher research`

### Required Worker deployment
After pushing the repository, redeploy the Worker:

```powershell
cd watcher-control-worker
npx wrangler deploy
```

### Test
1. Ask Sentinel about an unknown mod.
2. Immediately click **Search with Watcher** again or submit the same question again.
3. Confirm the panel says it is reconnecting/reusing the active request.
4. Confirm only one new research workflow is created for that request.
5. Confirm the original answer updates after the matching `requestId` is published.

### Validation
`npm run build` completed successfully for both server and client bundles and generated the static site.
