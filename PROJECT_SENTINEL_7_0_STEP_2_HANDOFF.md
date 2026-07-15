# Project Sentinel 7.0 — Step 2 Handoff

## Added
- Unified Registry matching inside Sentinel Doctor.
- Project-specific repair recommendations.
- Dependency verification links.
- Explicit conflict detection for incompatible stacks.
- Priority, confidence, version and status context for matched projects.

## Test
1. Open `/doctor`.
2. Choose **A plugin does not work**.
3. Enter `Policing Redefined and Stop The Ped` as the last change.
4. Analyze evidence with or without a log.
5. Confirm Doctor shows the registry conflict and project guidance.

## Commit
`Project Sentinel 7.0 Step 2 - registry-aware diagnosis`
