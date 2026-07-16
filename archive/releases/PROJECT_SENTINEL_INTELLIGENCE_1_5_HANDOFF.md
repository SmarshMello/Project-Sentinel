# Project Sentinel Intelligence 1.5 — Doctor Case Memory

## Added
- Persistent Doctor case history stored locally in the browser.
- Automatic history entry whenever Intelligence creates a Doctor case.
- Open, Monitoring, and Resolved case states.
- Reopen, delete, filter, and clear-history controls.
- Active-case status controls in the Doctor handoff card.
- Up to 50 recent cases retained per browser/profile.

## Privacy
Case history remains in browser localStorage. It is not uploaded to GitHub, Cloudflare, or any external service.

## Files changed
- src/intelligence/doctorPlanEngine.js
- src/pages/doctor/index.js
- src/components/doctor/IntelligenceCase.js
- src/components/doctor/IntelligenceCase.module.css

## Files added
- src/components/doctor/CaseHistory.js
- src/components/doctor/CaseHistory.module.css
- PROJECT_SENTINEL_INTELLIGENCE_1_5_HANDOFF.md
