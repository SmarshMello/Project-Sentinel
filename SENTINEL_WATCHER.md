# Sentinel Watcher 0.1

Sentinel Watcher is a free, review-first monitoring system for Project Sentinel.

## Run it manually

1. Open the repository on GitHub.
2. Open **Actions**.
3. Select **Sentinel Watcher**.
4. Click **Run workflow**.
5. Open the completed run and read its summary.
6. Download the `sentinel-watcher-report` artifact for the JSON and Markdown reports.

## Schedule

The workflow runs every Monday at 09:23 UTC. GitHub may start scheduled jobs a little later during busy periods.

## What it checks

- Reachability of official project/download pages
- GitHub repository archival state
- Latest GitHub release tag when available
- Page changes compared with the previously committed report
- Sources that block automated checks and therefore need manual review

## Safety model

Version 0.1 does not edit the plugin database, open pull requests, or publish conclusions automatically. An old mod is not declared dead merely because it has not received a recent update.
