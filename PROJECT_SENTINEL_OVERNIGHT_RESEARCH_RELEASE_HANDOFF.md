# Project Sentinel Overnight Research Release

## Changes
- Bulk input raised to 100,000 characters.
- Maximum batch raised from 50 to 500 unique projects.
- Stop now means stop after the active project finishes.
- Completed findings remain saved and the queue becomes resumable.
- Queue state persists in localStorage across refreshes.
- Progress uses the frozen original queue size, preventing impossible counters such as 30 of 16.
- Intermediate bulk research runs defer GitHub Pages deployment; one publish is requested at completion or pause.
- Added clear queue and overnight-run guidance.

## Cloudflare Worker
Redeploy watcher-control-worker because the /publish endpoint and publishSite request flag are new.

## Verification
Run npm run test:research, npm run test:intelligence, npm run test:doctor, npm run security:audit, and npm run build.
