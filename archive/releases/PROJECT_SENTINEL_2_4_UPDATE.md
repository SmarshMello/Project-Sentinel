# Project Sentinel 2.4 — Faster Watcher and Smarter Diagnostics

## Sentinel Doctor 2.0
- Context-aware rule requirements prevent generic phrases such as “version mismatch” from creating unrelated RPH diagnoses.
- Root-cause rules can suppress redundant findings.
- Explicit Heap Adjuster detection and repair guidance.
- Generic crash/performance symptoms are hidden when stronger evidence exists.
- Matched log lines are displayed as evidence.
- Drag-and-drop log support.

## Sentinel Expert System
- Drag-and-drop support for multiple logs and configuration files.
- Existing browse support remains available by clicking the drop zone.

## Sentinel Watcher 0.6
- Parallelism increased from 6 to 12 sources.
- Faster domain-aware timeouts.
- Retries remain for GitHub API checks but are avoided for sites that usually rate-limit or challenge automation.
- Transient status shuffles such as timeout → rate-limit are suppressed unless persistent, reducing noisy review items.
- The scan keeps the same safety rule: a timeout, challenge, or rate limit is not evidence that a project is dead.

No new npm dependencies, Cloudflare services, secrets, or databases are required.
