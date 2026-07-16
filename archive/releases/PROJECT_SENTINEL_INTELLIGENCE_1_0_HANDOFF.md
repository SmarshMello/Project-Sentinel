# Project Sentinel Intelligence 1.0 — Research Assessment & Watcher Adoption

## Install
Copy this package into the repository root and allow folders to merge.

Commit message:
`Project Sentinel Intelligence 1.0 - research assessment and Watcher adoption`

No Cloudflare Worker redeployment is required.

## What changed
- Research results now separate identity, source credibility, documentation quality, and compatibility evidence.
- Research projects no longer receive a misleading production-build yes/no verdict when compatibility evidence is missing.
- Original pairwise questions are used to search for compatibility/conflict evidence.
- New credible Research discoveries are automatically included in future normal Watcher scans.
- Expert shows source links and confidence dimensions on Research project cards.

## Test
Ask: `Can I use Los Santos Alive with EUP?`
Expected: Sentinel confirms the project identity, clearly labels compatibility as unverified or evidence-limited, and shows separate confidence scores.

Run the normal Watcher afterward. Los Santos Alive should appear as a monitored Research discovery if it has a credible download/source URL.
