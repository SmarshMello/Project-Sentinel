# Project Sentinel Public Release 1.0.1

## GitHub Actions npm registry hotfix

Corrected two `resolved` package URLs in the root `package-lock.json` that referenced a private build-environment mirror. Both now point to the public npm registry so GitHub Actions can complete `npm ci`.

Changed file:
- `package-lock.json`

After deployment, rerun the failed `Deploy Docusaurus to GitHub Pages` workflow or push this commit to `main`.
