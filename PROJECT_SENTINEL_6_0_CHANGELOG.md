# Project Sentinel 6.0 — Unified Registry

## Added
- One shared registry layer built from the complete 59-record plugin catalog.
- Compatibility rows are now generated from the registry instead of a separate 15-record hardcoded list.
- Project Profiles now include every registry record, including projects not currently monitored by Watcher.
- Watcher data is merged into registry records when a matching project ID exists.
- Registry-only and Watcher-connected projects are labeled separately.
- Compatibility filters now cover Verified, Compatible, Testing, Conflict Risk, Legacy, Research, and Deprecated records.
- Dependency intelligence now renders every registry project with dependencies rather than truncating the list.

## Architecture
- New `src/data/registry.js` is the shared source used to connect database metadata, project profiles, compatibility, and dependency resolution.
- `src/data/compatibility.js` is now derived data rather than a second manually maintained database.
