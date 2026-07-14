
# Project Sentinel Docusaurus Site

## First deployment
1. Replace the current repository contents with this project.
2. In GitHub: **Settings → Pages → Source: GitHub Actions**.
3. Commit/push to `main`.
4. Open **Actions** and wait for `Deploy Docusaurus to GitHub Pages` to finish.

## Local preview
```bash
npm install
npm start
```

## Production test
```bash
npm run build
npm run serve
```

## Editing
Guide pages are Markdown files under `docs/`. Home, Donate, and Help are React pages under `src/pages/`.

## Donation links
Edit `customFields.paypalUrl` and `customFields.kofiUrl` in `docusaurus.config.js`. Use only public provider-hosted HTTPS URLs. Never commit secrets.
