# Project Sentinel 2.2 — Component Foundation

Version 2.2 converts the homepage's repeated interface code into reusable React components without changing the existing routes or documentation.

## New components

- `SentinelIcon` — one shared SVG icon registry
- `StatusPill` — reusable verified/testing/planned status badges
- `SectionHeader` — consistent section titles and descriptions
- `FeatureCard` — reusable standards and capability cards
- `VersionPanel` — current verified-build command panel
- `RoadmapTimeline` — reusable project progress timeline
- `GoldenBuildCard` — reusable Golden Build callout

## Updated

- Homepage now assembles reusable components instead of maintaining every section inline.
- Plugin Database continues using the existing plugin registry and status system.
- Existing guides, routes, navbar links, and GitHub Pages configuration remain intact.

## GitHub Desktop install

Copy the contents of this folder over the existing local repository, replace matching files, then commit:

`Launch Project Sentinel 2.2 component foundation`
