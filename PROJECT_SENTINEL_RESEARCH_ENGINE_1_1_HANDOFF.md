# Sentinel Research Engine 1.1 — Internet Discovery

## Purpose
This patch fixes the false failure shown after a completed manual-review result and expands unknown-mod discovery beyond GitHub repositories.

## Changes
- Searches the public web through Bing and DuckDuckGo, plus GitHub's repository API.
- Evaluates arbitrary public domains instead of using a fixed allow-list.
- Gives stronger trust signals to established GTA/LSPDFR mod platforms while still allowing independent creator sites to qualify through exact-name matching and corroboration.
- Fetches candidate pages and extracts title, description, author, canonical URL, and dependency clues.
- Adds credible new projects automatically as `Research / Pending review / Not verified`.
- Never converts a discovery directly into a compatibility approval.
- Adds a Worker endpoint that reads the exact committed research result from GitHub, removing the long GitHub Pages publishing wait.
- Correctly displays `needs-manual-research` and `no-results` as completed outcomes instead of later changing them to failed.
- Shows weak candidate sources for manual review.

## Install
Copy this package into the repository root and merge/replace files.

Commit message:
`Project Sentinel Research Engine 1.1 - broader internet discovery`

## Required Worker deployment
```powershell
cd watcher-control-worker
npx wrangler deploy
```

## Test
Ask Sentinel: `Can I use Los Santos Alive with EUP?`

Expected behavior:
1. Dedicated Sentinel Research run starts.
2. The engine searches web search results and GitHub.
3. A credible GTA5-Mods/LCPDFR/Nexus result is added as an unverified Research record.
4. Expert immediately retrieves the committed result from GitHub and re-runs the question.
5. Sentinel still does not claim EUP compatibility unless the discovered evidence explicitly supports it.
