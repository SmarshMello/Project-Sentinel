# Project Sentinel Intelligence 2.0 — Build Change Management

This major release adds a coordinated Intelligence operations console:

- Interactive dependency graph with risk-colored nodes and click-to-recenter navigation.
- Transitive impact simulator with critical, medium, and low retest priorities.
- Watcher activity feed tied to plugin analysis.
- Registry quality audit for unresolved dependencies, missing guidance, low confidence, unknown versions, and missing Watcher coverage.
- Browser-local Golden Build snapshots and comparison.
- Expanded per-plugin relationship explorer.
- Existing Doctor cases, release timelines, recommendations, and health scoring remain integrated.

## Local data
Golden Build snapshots and Doctor cases remain browser-local and are never uploaded by Project Sentinel.

## Verification
Run:

```bash
npm run test:intelligence
npm run test:doctor
npm run build
```
