# Project Sentinel 2.1 — Plugin Database

Version 2.1 adds a searchable, filterable plugin registry to the existing 2.0 site.

## New files

- `src/data/plugins.js` — centralized plugin records and verification metadata
- `src/components/PluginStatus/index.js` — reusable verification badge
- `src/components/PluginStatus/styles.module.css` — badge styling
- `src/pages/plugins/index.js` — interactive database page
- `src/pages/plugins/styles.module.css` — responsive registry design

## Updated files

- `docusaurus.config.js` — adds Plugin Database to the navbar and footer

## Registry features

- Search by plugin, function, tag or version
- Category filtering
- Verification-state filtering
- Verified, documented, testing and research badges
- Version and developer details
- Performance impact
- Confidence meter
- Dependency and feature tags
- Direct links to existing Sentinel guides
- Official download button where the verified source is already locked
- Responsive mobile layout

## Publishing with GitHub Desktop

1. Replace your local repository files with the contents of this package.
2. Open GitHub Desktop.
3. Review the changed files.
4. Use commit message: `Launch Project Sentinel 2.1 plugin database`
5. Click **Commit to main**.
6. Click **Push origin**.
7. Wait for the GitHub Actions deployment to complete.

The database route will be:

`https://smarshmello.github.io/Project-Sentinel/plugins`
