# Project Sentinel Intelligence 1.2 — Persistent Research Profiles

## Purpose
Fix research discoveries that appear in Sentinel Expert but fail to appear in the Plugin Database or open a profile.

## Changes
- Plugin Database loads the committed research registry directly from GitHub when GitHub Pages has not deployed it yet.
- Research profiles use the same fallback, eliminating the deployment-delay 404/not-found state.
- Research project IDs are now stable and based on the project name rather than the current best source URL.
- Existing hashed research links remain compatible through legacy-ID and name matching.
- Profile links include the project name as a recovery key.
- Every credible resolved discovery written by the Research Engine receives a permanent Research record.

## Commit
`Project Sentinel Intelligence 1.2 - persistent research profiles`

## Worker
No Worker redeployment is required.
