# Sentinel Watcher 0.3

## Main improvements

- Six concurrent source checks with visible progress in the GitHub Action log.
- Source-specific timeouts and fewer retries, reducing scan time.
- Possible updates are separated from harmless metadata changes.
- Consecutive status streaks prevent one temporary failure from becoming a major alert.
- Every source receives a 0–100 health score.
- A single timeout or automation block creates no review item.
- A single 404 is medium priority; it becomes high priority only after consecutive scans.
- The first 0.3 scan creates a clean baseline instead of comparing against volatile 0.2 fingerprints.
- Successful scans commit the latest report and state to the repository, so the live Watcher dashboard updates automatically.
- Watcher still never edits plugin records or compatibility claims automatically.
