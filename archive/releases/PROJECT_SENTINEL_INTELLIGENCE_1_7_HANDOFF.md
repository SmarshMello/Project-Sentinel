# Project Sentinel Intelligence 1.7 — Plugin Lifecycle Timeline

## Release summary

Intelligence profiles now include a chronological lifecycle timeline that combines the latest Watcher scan, detected releases, saved Doctor cases, Golden Build membership, and the current registry baseline.

## Added

- `src/intelligence/timelineEngine.js`
  - Builds normalized timeline events from Intelligence and Doctor data.
  - Sorts dated events newest-first while retaining undated registry/build baselines.
  - Produces event totals for releases, Watcher scans, Doctor cases, and build history.
- `src/components/intelligence/PluginTimeline.js`
- `src/components/intelligence/PluginTimeline.module.css`
  - Filterable All Events, Releases, Watcher, Doctor, and Build views.
  - Timeline markers and status-aware presentation.
  - Version, case status, event date, and evidence summaries.

## Changed

- `src/components/intelligence/ReleaseDetails.js`
  - Loads locally saved Doctor cases for the selected plugin.
  - Displays the new lifecycle timeline inside Analyze Release.
- `src/pages/intelligence/index.js`
  - Updates the Intelligence release label and description.
- `intelligence-tests/run-tests.mjs`
  - Adds timeline ordering and event-count regression coverage.

## Installation

Copy the update-only package into the repository root, merge folders, and replace files. No Worker redeployment is required.

## Test

1. Open `/Project-Sentinel/intelligence`.
2. Expand Stop The Ped or another plugin with a saved Doctor case.
3. Confirm the Intelligence Timeline appears.
4. Test All Events, Watcher, Doctor, and Build filters.
5. Confirm saved Doctor cases appear on the corresponding plugin timeline.
