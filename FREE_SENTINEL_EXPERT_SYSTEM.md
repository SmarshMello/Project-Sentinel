# Free Sentinel Expert System

This release replaces the paid API requirement with a browser-based rule engine.

## How it works

- Reads selected plugin records from `src/data/plugins.js`
- Loads a saved Build Planner selection from browser local storage
- Searches all database entries by name, category, developer, tags, and description
- Reads text logs locally in the visitor's browser
- Matches symptoms and log signatures against curated rules in `src/data/diagnostics.js`
- Detects known plugin-stack conflicts
- Produces a prioritized repair sequence and links to Project Sentinel guides

## Privacy and cost

- No OpenAI key
- No Cloudflare Worker
- No server requests
- No recurring cost
- Uploaded logs never leave the browser

## Extending the engine

Add new entries to `src/data/diagnostics.js`. Each rule may include:

- `keywords`
- `logPatterns`
- `steps`
- `checks`
- `guide`

Add known incompatible combinations to `conflictRules`.
