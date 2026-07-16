# Project Sentinel 2.3 — Operations & Doctor

This update adds a focused application layer without increasing backend complexity.

## Added

- Sentinel Doctor at `/doctor`
  - Opens `.log`, `.txt`, `.json`, `.xml`, `.ini`, and `.cfg` files locally
  - Keeps analysis inside the browser
  - Ranks known diagnostic patterns from the existing Sentinel rules
  - Provides a review-first repair path and links to related guides
  - Does not upload or modify game files
- Live Operations Dashboard
  - Reads the latest Watcher report and history
  - Displays Watcher health, review count, release signals, and change count
  - Shows the latest changes and highest-priority review items
  - Links directly to Watcher, Doctor, Planner, and Compatibility Center
- Navigation links for Sentinel Doctor

## Efficiency and safety

- No new npm dependencies
- No new Worker secrets
- No Worker redeployment required
- No database or external service added
- Existing Watcher 0.5 workflow remains unchanged
- Public Docusaurus edit links remain disabled

## Validation

Production build tested with `npm run build` using Node.js 22-compatible dependencies.
