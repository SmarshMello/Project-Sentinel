# Project Sentinel Public Release Checklist

## Repository and identity safety

- [ ] Run `npm run security:audit` and resolve every finding.
- [ ] Confirm the upload does not contain `.git`, `node_modules`, `.wrangler`, `build`, `.docusaurus`, caches, local logs, archives, or editor folders.
- [ ] Search the repository for personal email addresses, local Windows usernames/paths, API keys, admin keys, recovery codes, tokens, private keys, and screenshots containing credentials.
- [ ] Rotate any credential that was ever committed or shared publicly; deleting the current file is not enough when it remains in Git history.
- [ ] Confirm public donation URLs contain no private payment-dashboard links or account credentials.

## Build and regression checks

- [ ] Run `npm ci --no-audit --no-fund`.
- [ ] Run `npm run test:intelligence`.
- [ ] Run `npm run test:doctor`.
- [ ] Run `npm run test:research`.
- [ ] Run `npm run build`.
- [ ] Confirm GitHub Pages deploys successfully.
- [ ] Confirm `/`, `/sentinel-police`, `/intelligence`, `/watcher`, `/doctor`, `/donate`, and `/help` load correctly.
- [ ] Confirm search, mobile navigation, light mode, dark mode, guide sidebars, and all primary buttons work.
- [ ] Confirm the Ko-fi donation button opens the intended public page.

## Service protection

- [ ] Confirm `GITHUB_TOKEN`, `WATCHER_ADMIN_KEY`, `OPENAI_API_KEY`, and `TURNSTILE_SECRET_KEY` exist only in encrypted provider secret storage.
- [ ] Use a long unique Watcher admin key and rotate it before launch if it has been typed into screenshots, streams, or shared browsers.
- [ ] Confirm the Watcher Worker allows only the production site origin and does not return upstream error details.
- [ ] Enable Cloudflare Turnstile before promoting any public AI feature that spends paid API credits.
- [ ] Review Cloudflare and GitHub Actions usage after launch for unusual traffic or repeated workflow triggers.

## GitHub protection

- [ ] Enable GitHub secret scanning and push protection.
- [ ] Enable Dependabot security alerts and automated security updates.
- [ ] Require two-factor authentication on the owner account.
- [ ] Protect `main` against force pushes and deletion.
- [ ] Limit Actions permissions to the minimum needed by each workflow.
- [ ] Create a release tag for the published version.

## Never commit

- `.env`, `.dev.vars`, private keys, access tokens, admin keys, passwords, payment credentials, or provider dashboard exports.
- `.git`, `node_modules`, `.wrangler`, `.docusaurus`, `build`, caches, local logs, or unredacted diagnostic files.
- Personal email addresses, home/network information, local computer usernames, or screenshots exposing browser tabs and account details.
