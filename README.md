# Project Sentinel

Project Sentinel is a public LSPDFR knowledge and change-management platform focused on stable, reproducible GTA V Legacy police-simulator builds.

**Live site:** https://smarshmello.github.io/Project-Sentinel/

## What Project Sentinel includes

- **Sentinel Intelligence** — plugin health, dependency relationships, impact simulation, build planning, and verification.
- **Sentinel Watcher** — scheduled ecosystem scans with review-first update reporting.
- **Sentinel Doctor** — local log analysis, guided repairs, case history, and validation tracking.
- **Compatibility Center** — version and dependency guidance across the monitored ecosystem.
- **Golden Builds** — documented, reproducible configurations that have passed controlled testing.
- **Plugin Database** — installation, dependency, risk, and troubleshooting profiles.

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
npm ci --no-audit --no-fund
npm start
```

Build the production site:

```bash
npm run build
```

Run regression and security checks:

```bash
npm run test:intelligence
npm run test:doctor
npm run security:audit
```

## Repository layout

- `.github/workflows/` — Pages, Watcher, Research, and pull-request checks.
- `src/` — website pages, components, data models, and intelligence engines.
- `static/data/` — published Watcher and Research data consumed by the website.
- `scripts/` — Watcher, Research, and repository security scripts.
- `sentinel-watcher/` — Watcher state and generated report workspace.
- `watcher-control-worker/` — Cloudflare Worker used to securely trigger scans.
- `sentinel-ai-worker/` — optional Sentinel AI Worker source.
- `doctor-tests/` and `intelligence-tests/` — regression suites.
- `archive/releases/` — historical release and handoff notes; not current instructions.

## Security model

The repository is designed to remain public. Secrets must be stored only in GitHub encrypted secrets or Cloudflare Worker secrets. Never commit `.env`, `.dev.vars`, private keys, access tokens, payment credentials, or provider dashboard links.

Review [SECURITY.md](SECURITY.md) before deploying Workers or accepting contributions.

## Contributing

Bug reports and suggestions are welcome through GitHub Issues. Review [CONTRIBUTING.md](CONTRIBUTING.md) before submitting code or diagnostic material.

## Support

Project Sentinel is free and publicly available. Donations through the website's Donate page help support continued research, testing, hosting, and development.

## Third-party projects

Project Sentinel is an independent community resource. GTA V, LSPDFR, plugins, mods, logos, and related third-party content belong to their respective owners and creators.
