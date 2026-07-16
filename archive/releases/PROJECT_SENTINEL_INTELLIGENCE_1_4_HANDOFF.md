# Project Sentinel Intelligence 1.4 — Doctor Integration

## Added
- One-click Intelligence-to-Doctor case creation.
- Persistent browser handoff containing plugin, version, risk, evidence, dependency alerts and reverse-dependency impact.
- Automatically generated controlled backup, dependency, installation and retest plan.
- Doctor case dashboard with direct links back to the plugin profile and installation guide.
- Doctor intake prefill using the selected plugin and detected release.

## Changed files
- src/intelligence/doctorPlanEngine.js
- src/components/intelligence/ReleaseDetails.js
- src/components/intelligence/ReleaseDetails.module.css
- src/components/doctor/IntelligenceCase.js
- src/components/doctor/IntelligenceCase.module.css
- src/pages/doctor/index.js

## Test
1. Open `/intelligence`.
2. Expand a plugin with **Analyze release**.
3. Select **Create Doctor case**.
4. Confirm `/doctor?from=intelligence` opens with the selected plugin, risk, evidence, affected projects and ordered test plan.
5. Dismiss the case and refresh to confirm the saved handoff is cleared.
