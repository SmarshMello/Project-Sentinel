# Project Sentinel Intelligence 1.3 — Public Research Access

## Purpose
Unknown-mod research is now available to normal visitors without exposing the private Watcher admin key.

## Security model
- Full Watcher scans remain protected by `WATCHER_ADMIN_KEY`.
- Public research requests are accepted only from the configured Project Sentinel origin.
- Duplicate public submissions are rate-limited for ten minutes per visitor/project combination.
- Normal Watcher status endpoints remain admin-only.
- Research progress and published research results are public to the Project Sentinel frontend.

## Changed files
- `watcher-control-worker/src/index.js`
- `src/pages/sentinel-ai/index.js`

## Required deployment
After pushing the repository, redeploy the Worker:

```powershell
cd watcher-control-worker
npx wrangler deploy
```

## Test
Open Sentinel Expert in a private/incognito browser where no admin key exists. Ask about an unknown mod. Research should start normally without an admin-key prompt.
