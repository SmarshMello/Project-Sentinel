# Project Sentinel Intelligence 1.6.1

## Recommendation Consistency Fix

This patch corrects contradictory recommendations for verified or otherwise supported current installs when Watcher has not supplied a fresh release record.

### Changed behavior

- A verified, low-risk plugin with no detected update now reports **Monitor** instead of **Wait for verification**.
- Supported community/documented plugins with low risk also remain on **Monitor** when no update is detected.
- **Wait for verification** is reserved for genuinely incomplete or risky evidence, migration requirements, high risk, or an explicit Watcher review flag.
- Doctor repair plans now say that no update action is required for stable monitored installs instead of implying that evidence is missing.

### Verification

Run:

```bash
npm run test:intelligence
npm run test:doctor
npm run build
```

### Files to replace

- `package.json`
- `src/intelligence/recommendationEngine.js`
- `src/intelligence/doctorPlanEngine.js`
- `intelligence-tests/run-tests.mjs`
- `PROJECT_SENTINEL_INTELLIGENCE_1_6_1_HANDOFF.md`
