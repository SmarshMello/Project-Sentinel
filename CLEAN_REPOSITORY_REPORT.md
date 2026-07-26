# Project Sentinel clean-repository report

This repository was sanitized for public replacement and deployment.

## Removed

- Local `.git` history, reflogs, remote metadata, and commit identity data.
- All nested `node_modules` dependency trees.
- Local Cloudflare Wrangler caches and generated build folders.
- Obsolete release handoffs, changed-file manifests, replacement instructions, and historical archive clutter.
- The obsolete `public/data` duplicate of Watcher output. Docusaurus publishes the canonical files from `static/data`.
- Operating-system and editor-generated files.

## Security fixes

- Reworked the Sentinel Research GitHub Actions workflow so user-supplied fields are passed through environment variables instead of being inserted directly into shell and JavaScript command strings.
- Added strict length and character validation for research requests.
- Removed unnecessary `actions: write` permission from the research workflow.
- Replaced user-controlled artifact and concurrency names with the trusted GitHub run ID.
- Removed the unsupported `secrets` metadata block from the Wrangler configuration. Secrets must be configured with Wrangler or the Cloudflare dashboard and are never stored here.

## Intentionally retained public identifiers

The GitHub owner name, repository name, GitHub Pages URL, Ko-fi URL, and public Worker endpoint remain because the website and deployment configuration require them. They are public routing identifiers, not credentials.

## Required private configuration

Keep these values only in GitHub Actions or Cloudflare secret stores:

- `GITHUB_TOKEN` (GitHub supplies the workflow token automatically)
- `WATCHER_ADMIN_KEY`
- `OPENAI_API_KEY`
- `TURNSTILE_SECRET_KEY`

Never place real values in `.env`, `.dev.vars`, Wrangler configuration, source code, screenshots, issues, or support logs.
