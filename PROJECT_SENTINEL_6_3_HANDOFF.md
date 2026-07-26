# Project Sentinel 6.3 — Public Launch Hardening

This release is the final pre-promotion cleanup for the Project Sentinel public website.

## Changes

- Restored **Donate** beside **Help** in the primary navigation.
- Removed local Git history, dependency folders, Wrangler account cache data, build output, and other generated files from the distributable repository.
- Strengthened the repository security audit to reject credentials, private metadata, personal email addresses, local Windows profile paths, `.git`, `.wrangler`, and `node_modules` content.
- Hardened Watcher Control responses with no-store, no-referrer, and MIME-sniffing protections.
- Changed public research throttling from one request per query to one request per visitor/IP per ten-minute window, reducing workflow abuse by rotating search terms.
- Stopped returning upstream GitHub error bodies to public clients.
- Reduced the public research dataset from roughly 8 MB to about 1.7 MB by removing malformed candidates and bounding scraped text, improving load time and reducing exposure to untrusted copied page content.
- Updated the research bot so future records enforce the same URL validation and text limits.
- Updated the project release version to 6.3.0.

## Before promotion

1. Rotate any credential that was ever pasted into a public commit, issue, screenshot, or chat.
2. Enable GitHub secret scanning, push protection, Dependabot alerts, two-factor authentication, and branch protection.
3. Confirm Cloudflare secrets exist only in Worker secret storage.
4. Enable Turnstile before exposing any AI endpoint that consumes a paid API.
5. Run the full public release checklist and create a signed or annotated release tag.
