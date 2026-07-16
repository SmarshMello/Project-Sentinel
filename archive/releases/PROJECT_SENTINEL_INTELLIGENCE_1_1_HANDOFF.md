# Project Sentinel Intelligence 1.1 — Research Registry Reliability

## Fixes
- Research discoveries always receive a working dynamic profile URL.
- The Plugin Database imports resolved discoveries and qualified research leads from the entire research-results file, not only the discoveries array.
- Newly found projects no longer disappear when a request was completed but its discovery record was missing.
- Research profile pages load live data by project ID and no longer produce a static-route 404.
- Sentinel Expert uses the same normalized research registry as the Plugin Database.
- Unknown-project answers no longer retain an unrelated positive compatibility recommendation from the known project in the same question.

## Install
Copy this package into the repository root, merge folders, commit, and push.

Suggested commit:
`Project Sentinel Intelligence 1.1 - fix research registry and profiles`

No Worker redeployment is required.
