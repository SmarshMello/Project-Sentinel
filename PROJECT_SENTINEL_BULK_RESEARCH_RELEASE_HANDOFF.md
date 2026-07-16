# Project Sentinel Bulk Research Release

## Purpose
Fixes the Sentinel Expert failure mode where a pasted list of plugin names was interpreted as one compatibility question.

## Added
- Bulk list detection for newline, comma, semicolon, and pipe separated names.
- 10,000-character Expert input limit.
- Exact known-project and alias classification.
- Duplicate removal.
- Maximum 50 unique projects per batch.
- Sequential unknown-project research to avoid concurrent Git commits.
- Live per-project status: pending, running, found, review, not found, failed, or known.
- Stop-queue control.
- Final result summary and direct GitHub run links.
- Regression tests for parsing, deduplication, aliases, and summaries.

## Files
- src/data/bulkResearch.js
- src/pages/sentinel-ai/index.js
- src/pages/sentinel-ai/styles.module.css
- research-tests/run-tests.mjs

## Validation
- Research tests passed.
- Intelligence tests passed.
- Doctor tests passed 27/27.
- Security audit passed.
- Docusaurus production static build passed.
