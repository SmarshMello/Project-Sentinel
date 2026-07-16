# Project Sentinel Watcher 0.7.1 — Pages Publish Fix

## Problem
Sentinel Watcher successfully generated and committed new dashboard data, but GitHub Pages did not rebuild. Commits made by a workflow using `GITHUB_TOKEN` do not trigger another push-based workflow run.

## Fix
- The Pages workflow now also runs after a successful `Sentinel Watcher` workflow via `workflow_run`.
- Failed Watcher runs do not trigger a deployment.
- The Watcher browser dashboard now waits up to six minutes for Pages instead of three minutes.
- The final timeout message points users to the Pages workflow instead of implying the scan failed.

## Files changed
- `.github/workflows/deploy.yml`
- `src/pages/watcher/index.js`

## Deployment behavior
1. Watcher scans sources.
2. Watcher commits `watcher-report.json`, history, and state to `main`.
3. Watcher workflow completes successfully.
4. `Deploy Docusaurus to GitHub Pages` starts through `workflow_run`.
5. The website polls until the new `checkedAt` value becomes available.
