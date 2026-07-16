# Project Sentinel Public Release Checklist

## Before publishing

- [ ] Run `npm ci --no-audit --no-fund`.
- [ ] Run `npm run test:intelligence`.
- [ ] Run `npm run test:doctor`.
- [ ] Run `npm run security:audit`.
- [ ] Run `npm run build`.
- [ ] Confirm GitHub Pages deploys successfully.
- [ ] Confirm `/`, `/intelligence`, `/watcher`, `/doctor`, `/donate`, and `/help` load correctly.
- [ ] Confirm the Ko-fi donation button opens the correct public page.
- [ ] Confirm the Watcher admin key is not stored in source or screenshots.
- [ ] Confirm GitHub secret scanning, push protection, Dependabot alerts, and two-factor authentication are enabled.
- [ ] Protect `main` against force pushes and deletion.
- [ ] Create a release tag for the published version.

## Never commit

- `.env`, `.dev.vars`, private keys, access tokens, admin keys, passwords, or payment credentials.
- `node_modules`, `.docusaurus`, or `build`.
- Unredacted diagnostic logs containing personal data.
