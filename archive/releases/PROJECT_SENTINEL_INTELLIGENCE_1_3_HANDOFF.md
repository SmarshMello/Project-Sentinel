# Project Sentinel Intelligence 1.3 — Release Intelligence Engine

## Build verification

- `npm run build`: **PASSED**
- Docusaurus client compilation: **PASSED**
- Docusaurus server compilation: **PASSED**
- Static output generated successfully in `build/`

## What changed

- Added deterministic release-note classification for features, bug fixes, performance, security, configuration, migration, and breaking changes.
- Added upgrade recommendations: Upgrade immediately, Recommended, Optional, Monitor, Wait for verification, and Avoid.
- Added plugin health scores based on registry evidence, Watcher health, confidence, review state, and dependency resolution.
- Added dependency-impact analysis showing every registered plugin that should be retested when a dependency changes.
- Added expanded per-plugin release intelligence panels.
- Added intent-aware search phrases such as `needs review`, `breaking updates`, `outdated dependencies`, `Golden Build`, `updated`, and `deprecated`.
- Added command-center metrics for updates detected, items needing review, dependency alerts, and average health.

## Files to replace or add

- `src/data/intelligenceEngine.js`
- `src/pages/intelligence/index.js`
- `src/pages/intelligence/styles.module.css`
- `src/intelligence/releaseEngine.js`
- `src/intelligence/recommendationEngine.js`
- `src/intelligence/healthEngine.js`
- `src/components/intelligence/ReleaseDetails.js`
- `src/components/intelligence/ReleaseDetails.module.css`
- `PROJECT_SENTINEL_INTELLIGENCE_1_3_HANDOFF.md`

## Test checklist

1. Open `/intelligence`.
2. Confirm the top row shows Updates detected, Needs review, Dependency alerts, and Average health.
3. Search `needs review` and confirm the list filters.
4. Search `Golden Build` and confirm only Golden Build entries remain.
5. Click **Analyze release** on a plugin.
6. Confirm the expanded panel shows health, recommendation, detected version, last checked, dependency impact, and release-note sections when available.
7. Open a plugin with reverse dependencies and confirm the affected projects are listed.

## Deployment

Copy the update-only package into the repository root, commit, and push. GitHub Pages deployment should run automatically through the existing workflow. No Cloudflare Worker redeployment is required.
