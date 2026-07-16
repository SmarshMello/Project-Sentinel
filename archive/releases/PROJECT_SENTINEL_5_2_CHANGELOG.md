# Project Sentinel 5.2 — Intelligence Polish

## Analytics accuracy
- Normalizes and sorts Watcher history chronologically.
- Removes invalid placeholder scans with missing timestamps or zero health.
- Uses the newest valid run for latest chart values.
- Adds health change, runtime change, average health, and average runtime.

## Mission Control polish
- Expands the dashboard to a 1600px desktop canvas.
- Adds health and runtime trend indicators.
- Increases the visible priority queue from four to six items on the full dashboard.
- Clarifies that medium signals are review priority rather than compatibility verdicts.

## Project profiles
- Separates compatibility, source reliability, review priority, health, and confidence.
- Expands search to developers and dependencies.
- Renames risk filters to review-priority filters.

## Compatibility Center
- Adds a visual, clickable dependency graph for the verified baseline.
- Keeps the detailed dependency cards below the graph.

## Validation
- `npm run build` completed successfully.
- Docusaurus client and server bundles compiled successfully.
