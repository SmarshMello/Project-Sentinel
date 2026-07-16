# Project Sentinel Intelligence 1.4.1 — GitHub Pages Routing Fix

## Fixed

- Corrected the Intelligence → Doctor handoff on GitHub Pages.
- The Doctor URL now respects Docusaurus `baseUrl` (`/Project-Sentinel/`) instead of navigating to the domain root.
- The handoff query string (`?from=intelligence`) and saved Doctor case remain unchanged.

## Changed file

- `src/components/intelligence/ReleaseDetails.js`

## Test

1. Open `/Project-Sentinel/intelligence` on the deployed site.
2. Expand a plugin with **Analyze release**.
3. Select **Create Doctor case →**.
4. Confirm the browser opens `/Project-Sentinel/doctor?from=intelligence` and displays the generated case.
