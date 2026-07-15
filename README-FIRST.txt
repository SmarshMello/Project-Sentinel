PROJECT SENTINEL — ALL-IN-ONE PLATFORM UPDATE

This update adds the connected application layer requested after the Compatibility Center:

1. /planner — Interactive Build Planner with profiles, performance targets and text export.
2. /troubleshooter — Symptom-driven troubleshooting wizard.
3. /dashboard — Operations dashboard showing registry, Golden Build and matrix health.
4. /checklist — Browser-saved installation checklist with reset and text export.
5. /plugins/<plugin-id> — 15 individual plugin health/profile pages.
6. Plugin Database cards now open individual profiles.
7. Navigation/footer links for all new tools.
8. Compatibility Center files are included to preserve the current live feature.

PRODUCTION VALIDATION
- npm ci --no-audit --no-fund: successful
- Docusaurus server bundle: compiled successfully
- Docusaurus client bundle: compiled successfully
- Static site generation: successful
- Broken-link check: passed

INSTALL WITH GITHUB DESKTOP
1. Extract this ZIP.
2. In GitHub Desktop select Project-Sentinel.
3. Repository > Show in Explorer.
4. Copy docusaurus.config.js and the src folder from this update into the repository root.
5. Choose Replace files in the destination.
6. Commit: Add Sentinel platform tools
7. Push origin and watch GitHub Actions.

NEW ROUTES
/Project-Sentinel/planner
/Project-Sentinel/troubleshooter
/Project-Sentinel/dashboard
/Project-Sentinel/checklist
/Project-Sentinel/plugins/lspdfr (and 14 additional plugin profiles)
