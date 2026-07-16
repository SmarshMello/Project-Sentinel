# Project Sentinel Security

Project Sentinel is designed to be safely hosted from a public GitHub repository. The website contains public source code and public registry data; operational secrets must never be committed.

## Report a security issue

Do not publish real credentials in a public issue. Contact the repository owner privately through GitHub first, then rotate any potentially exposed credential immediately.

## Secrets that must stay outside GitHub

- Cloudflare Worker secrets: `GITHUB_TOKEN`, `WATCHER_ADMIN_KEY`, `OPENAI_API_KEY`, and `TURNSTILE_SECRET_KEY`.
- Local `.dev.vars` and `.env*` files.
- GitHub personal-access tokens, recovery codes, private keys, certificates, payment account credentials, or provider dashboard links.

Use Cloudflare `wrangler secret put ...` and GitHub Actions encrypted secrets where appropriate. Public donation URLs, Worker public endpoints, GitHub owner/repository names, and workflow filenames are not secrets.

## Public-repository model

Keeping the source public is supported and recommended for transparency, contribution, issue reporting, and community trust. Security must rely on server-side authorization and secret storage—not on hiding JavaScript or workflow files.

## If a secret is exposed

1. Revoke or rotate it at the provider immediately.
2. Replace the Worker/GitHub secret.
3. Remove it from the current repository.
4. Purge it from Git history when necessary.
5. Review Actions and provider logs for unauthorized use.
