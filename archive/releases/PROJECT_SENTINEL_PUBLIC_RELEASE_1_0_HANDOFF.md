# Project Sentinel Public Release 1.0 — Final Pre-Publication Sweep

## Included changes

- Restored Donate immediately beside Help in the top navigation.
- Added Donate to the footer Community section.
- Hardened PayPal and Ko-fi links with external-tab and opener protections.
- Added clearer donation safety guidance.
- Added a Watcher `Forget key` control to remove the admin key from session storage.
- Strengthened `.gitignore` against environment files, Worker secrets, private keys, certificates, credential exports, and local archives.
- Added `SECURITY.md` and a full public-launch/security checklist.
- Added `npm run security:audit` for repeatable high-confidence secret scanning.
- Updated Docusaurus broken-Markdown configuration to the current supported location.
- Added dependency overrides for patched `serialize-javascript` and `uuid` releases.

## Donation setup

In `docusaurus.config.js`, set only public donation URLs:

```js
paypalUrl: 'https://www.paypal.com/paypalme/YOUR_PUBLIC_NAME',
kofiUrl: 'https://ko-fi.com/YOUR_PUBLIC_NAME',
```

Commit and push. Do not place passwords, API keys, payment tokens, account-management links, or private email-login URLs in the configuration.

## Security audit result

No committed real API keys, GitHub tokens, private keys, `.dev.vars`, `.env` files, payment credentials, or certificates were detected.

The repository is suitable to remain public as long as operational secrets stay in Cloudflare/GitHub encrypted secret storage.

## Optional cleanup

Historical root-level installation notes, handoffs, and old changelogs are not dangerous. They may be moved to `archive/` later to reduce clutter. Do not remove current workflows, Worker folders, tests, registry data, `static/data`, lockfiles, or active setup/security documents.

## Verification

- Security secret scan: passed.
- npm production dependency audit: 0 known vulnerabilities.
- Intelligence tests: passed.
- Doctor tests: 27/27 passed.
- Standard minified Docusaurus build: passed.
- Donate, Intelligence, and Watcher generated routes: passed.
- Donate navbar output check: passed.
