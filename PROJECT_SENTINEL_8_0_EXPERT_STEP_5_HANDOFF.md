# Sentinel Expert 8.0 — Step 5: Knowledge Sync and Watcher Research

## Fixes
- Recognizes `EUP`, `Lenny's Mod Loader`, `Lennys Mod Loader`, and `LML` as distinct known projects.
- Multi-project questions no longer incorrectly ask for a second project when both names are present.

## Unified knowledge
- Expert uses all website registry records, live Watcher records, and published research discoveries.
- Plugin Database automatically displays Watcher research discoveries as `Research` records after the research workflow publishes them.

## Unknown project workflow
- Unknown names are never guessed.
- With the Watcher admin key already stored in the browser, Expert automatically queues a Watcher research run.
- The research job searches GitHub for candidate official sources and publishes a pending-review record.
- Discovered projects remain unverified until manually reviewed; Sentinel does not claim compatibility from search results alone.

## Required Worker deployment
The changed `watcher-control-worker/src/index.js` must be redeployed with Wrangler for `/research` to work.
