# Project Sentinel Intelligence 1.2 — Intelligence Foundation

## What changed
- Added a shared Intelligence Engine built from the Unified Plugin Registry.
- Added the first Knowledge Graph model for plugin dependency relationships.
- Added Plugin DNA profiles with confidence, dependency, reverse-dependency and Golden Build context.
- Added an initial compatibility predictor with Safe, Likely safe, Unknown, High risk and Breaking classifications.
- Connected live Watcher report states to compatibility risk scoring when available.
- Added a searchable `/intelligence` dashboard.
- Added Sentinel Intelligence navigation entries under Operations and Tools.

## Files to replace
- `docusaurus.config.js`
- `src/data/intelligenceEngine.js`
- `src/pages/intelligence/index.js`
- `src/pages/intelligence/styles.module.css`
- `PROJECT_SENTINEL_INTELLIGENCE_1_2_HANDOFF.md`

## GitHub upload
1. Extract the changed-files ZIP.
2. Copy its contents into the root of the Project Sentinel repository.
3. Allow Windows to merge folders and replace `docusaurus.config.js`.
4. Commit with: `Project Sentinel Intelligence 1.2 - intelligence foundation`
5. Push to the default branch and allow GitHub Pages to deploy.

No Cloudflare Worker redeployment is required.
