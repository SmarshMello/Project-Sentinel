# Project Sentinel — Final Public Launch Handoff

## Donation links

Edit `docusaurus.config.js` and replace the empty values:

```js
customFields: {
  paypalUrl: 'https://www.paypal.com/paypalme/YOUR_PUBLIC_NAME',
  kofiUrl: 'https://ko-fi.com/YOUR_PUBLIC_NAME',
  watcherControlEndpoint: 'https://project-sentinel-watcher-control.sentinelwatcher.workers.dev',
},
```

Use only public-facing profile or donation URLs. Do not paste email-login URLs, account dashboard URLs, passwords, client secrets, API keys, or payment tokens.

## Repository security audit

No real API keys, GitHub tokens, private keys, `.dev.vars`, `.env` files, payment credentials, or certificates were detected in the release repository.

Safe to remain public:

- Website source and Docusaurus configuration.
- GitHub Actions workflow definitions.
- Public Cloudflare Worker URLs and Worker source.
- Watcher source lists, public reports, test fixtures, registry data, documentation, and changelogs.
- `.dev.vars.example` placeholder files.

Keep private and outside Git:

- Cloudflare Worker secrets.
- Watcher admin key.
- GitHub personal-access token used by the Worker.
- OpenAI API key and Turnstile secret.
- Donation-provider login information.

## Optional cleanup before promotion

The many historical `INSTALL_*`, `PROJECT_SENTINEL_*_HANDOFF.md`, old release notes, and prior Watcher documents in the repository root are not dangerous. They are only clutter. They may be moved into an `archive/` folder or removed after preserving the latest handoff, README, Watcher setup, and security documentation.

Do not delete test fixtures, `static/data`, `.github/workflows`, Worker source folders, `package-lock.json`, or current handoff/setup files merely to make the repository smaller.

## Public or private GitHub repository?

Keep the repository public unless you plan to sell proprietary source code or cannot secure the backend credentials correctly. Public source does not expose Cloudflare/GitHub/OpenAI secrets when those values are stored as encrypted provider secrets. Public visibility improves transparency, community review, contributions, issue reporting, and user trust.

Recommended GitHub settings:

- Require two-factor authentication on the owner account.
- Protect `main` and require the build workflow before merging outside contributions.
- Disable force pushes and branch deletion on `main`.
- Keep workflow permissions limited to the permissions declared in each workflow.
- Enable Dependabot alerts, secret scanning, push protection, and code scanning when available.
- Restrict collaborator access and remove accounts that no longer need write permission.
- Never accept a pull request that modifies workflows or Worker code without reviewing every line.
