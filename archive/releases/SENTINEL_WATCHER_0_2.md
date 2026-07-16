# Sentinel Watcher 0.2

Sentinel Watcher 0.2 improves the first monitoring release without allowing automation to publish unreviewed claims.

## Changes

- Retries each failed request up to three times.
- Uses a longer request timeout and lower concurrency for sites that respond slowly.
- Separates healthy, timed out, blocked, rate limited, redirected, 404/410, server error, archived, page changed and version changed states.
- Treats timeouts and bot blocks as informational rather than proof that a project is dead.
- Checks GitHub releases and falls back to the latest tag when a repository has no formal release.
- Generates a prioritized review queue.
- Adds high, medium and low review priorities.
- Uploads `review-queue.json` with every GitHub Actions report.
- Expands the Watcher dashboard filters and status legend.

## Running the scan

Open **Actions → Sentinel Watcher → Run workflow**. After the run completes, download the `sentinel-watcher-report` artifact. It contains:

- `latest.md` — readable report
- `latest.json` — complete machine-readable result
- `review-queue.json` — sorted review queue for future pull-request automation

Watcher does not edit the public database automatically.
