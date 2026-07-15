# Project Sentinel 8.0 — Expert Step 7: Live Watcher Research Loop

## Purpose
Unknown projects now trigger a visible Watcher research workflow inside Sentinel Expert. Expert monitors the GitHub Actions run, waits for GitHub Pages to publish the result, then automatically re-runs the original question with the newly published Research record.

## Changed files
- `src/pages/sentinel-ai/index.js`
- `src/pages/sentinel-ai/styles.module.css`

## User flow
1. Ask about an unknown project.
2. Expert marks it unknown and sends it to Watcher.
3. A live panel displays queued/running/publishing progress and the active workflow step.
4. After the research JSON is published:
   - Credible candidate found: Expert reloads discoveries and automatically re-submits the original question.
   - No credible candidate: Expert reports completion and keeps the project unknown for manual review.
5. Automatically added records remain `Research`, `Pending review`, and `Not verified`.

## Deployment
Copy the changed files into the repository root, commit, push, wait for GitHub Pages, and hard refresh.

Suggested commit:
`Project Sentinel 8.0 Step 7 - live Watcher research loop`

No Cloudflare Worker redeploy is required because the existing `/research` and `/status` endpoints are reused.
