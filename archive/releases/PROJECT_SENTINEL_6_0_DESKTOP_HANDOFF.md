# Project Sentinel 6.0 Desktop Handoff

Copy the contents of the update ZIP into the root of the Project Sentinel repository and allow Windows to merge folders and replace matching files.

## Files changed
- `src/data/registry.js` — new unified registry layer
- `src/data/compatibility.js` — compatibility now generated from all registry records
- `src/pages/operations/projects/index.js` — profiles now show all 59 records and merge Watcher data where available
- `src/pages/compatibility/index.js` — supports all registry statuses and all dependency records
- `PROJECT_SENTINEL_6_0_CHANGELOG.md`
- `PROJECT_SENTINEL_6_0_DESKTOP_HANDOFF.md`

## Commit message
`Project Sentinel 6.0 - Unified Registry`

## Verify after deployment
- Project Profiles should show 59 records with no search filter.
- Compatibility Center should show 59 tracked components.
- Watcher-connected cards should show live source health.
- Registry-only cards should show `Not monitored` rather than fake Watcher data.
- Dependency Intelligence should include all registry entries with dependencies.
