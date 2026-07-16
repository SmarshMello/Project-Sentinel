# Project Sentinel Final Stability Release

## Purpose
Final pre-publication troubleshooting and security sweep based on Project-Sentinel(24).

## Primary repair
Sentinel Research successfully wrote discoveries to `static/data/research-results.json`, but the GitHub Pages deployment workflow only listened for Sentinel Watcher completions. Commits created by the Research workflow use GitHub's workflow token and therefore do not trigger the normal push deployment. The live Plugin Database could remain stale even though the repository contained the discovery.

`deploy.yml` now listens for both `Sentinel Watcher` and `Sentinel Research` workflow completions.

## Research hardening
- Sentinel Expert loads merged research from the deployed site and the current raw repository source.
- Resolved discoveries automatically enter the Research registry.
- Plausible lower-confidence candidates remain visible as clearly labeled unverified leads.
- Very low-confidence noise remains excluded.
- Project counts are calculated from the real registry instead of a hard-coded number.
- Research discoveries become a dynamic Plugin Database category.

## Plugin Database repair
Navbar category URLs now initialize the Plugin Database filters. Links such as `?category=Callout%20packs` and `?category=Research%20discoveries` no longer open an unfiltered database.

## Security and quality checks
- No committed high-confidence secrets found.
- No real `.env`, `.dev.vars`, private key, or certificate files found.
- No private OpenAI package-mirror URLs found.
- Production dependency audit: 0 known vulnerabilities.
- 8,031 generated local route/asset references checked; 0 missing.

## Tests
- Sentinel Research integration: 4/4 passed.
- Intelligence regression suite: passed.
- Doctor diagnostics: 27/27 passed.
- Docusaurus client/server production build: passed.
- Static generation: passed.

## Deployment test
After pushing this release:
1. Ask Sentinel about a mod absent from the reviewed registry.
2. Allow Sentinel Research to complete.
3. Confirm `Sentinel Research` succeeds in GitHub Actions.
4. Confirm `Deploy Docusaurus to GitHub Pages` starts automatically afterward.
5. Open Plugin Database and select `Research` status or `Research discoveries` category.
6. Confirm the discovery is visible and opens its Research profile.
