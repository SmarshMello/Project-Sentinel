# Sentinel Research Engine 1.0

## Purpose
Separates unknown-project discovery from the normal Sentinel Watcher ecosystem scan.

## New flow
1. Sentinel Expert submits an unknown project to the Worker.
2. The Worker dispatches `.github/workflows/sentinel-research.yml`.
3. The dedicated workflow runs only `scripts/sentinel-research.mjs`.
4. Findings are committed to `static/data/research-results.json`.
5. Expert follows the exact request ID, waits for GitHub Pages, and re-runs the original question.

## Important deployment step
After pushing the files, redeploy the Cloudflare Worker:

```powershell
cd watcher-control-worker
npx wrangler deploy
```

The Worker defaults to `sentinel-research.yml`. An optional `RESEARCH_WORKFLOW_FILE` environment variable may override the filename.

## Verification
- A manual Watcher scan should run only the 26-project ecosystem scan.
- Unknown-mod research should open a GitHub Actions run named `Sentinel Research — <request id>`.
- Its artifact should be named `sentinel-research-<request id>` and contain `research-results.json`.
