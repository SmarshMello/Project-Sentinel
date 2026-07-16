# Project Sentinel 4.0 — Operations Center

## Major additions

- Replaced the static landing page with a live Operations Center powered by the published Watcher report.
- Added overall ecosystem status, live health, critical alerts, update signals, review totals, runtime and registry metrics.
- Added an Action Center that surfaces the current human-review queue.
- Added a connected module launcher for Watcher, profiles, analytics, compatibility, planning and diagnosis.
- Added live category health to the home page.
- Added Project Profiles at `/operations/projects`.
  - Combines the Sentinel plugin registry with current Watcher health.
  - Provides version, release detection, HTTP status, risk, confidence, dependencies, notes and source links.
  - Supports direct links using `?id=project-id`.
- Added Watcher Analytics at `/operations/analytics`.
  - Health timeline.
  - Scan history and runtime.
  - Category health.
  - Source-status distribution.
- Added an Operations navigation bar to Sentinel Watcher.
- Updated navigation and footer links for the new Operations Center modules.

## Compatibility

- Existing Sentinel Police guides, database pages, Watcher controls, worker endpoint and automated scans remain intact.
- No Watcher report schema change is required.
- No files need to be deleted.
