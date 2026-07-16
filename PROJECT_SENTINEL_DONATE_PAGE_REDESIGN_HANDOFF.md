# Project Sentinel — Donate Page Redesign

## Purpose

This update replaces the visible split PayPal/Ko-fi donation experience with one polished, provider-neutral support page. The single public donation button uses `customFields.kofiUrl`, allowing Ko-fi to handle the available payment methods without exposing or duplicating a separate PayPal link. The unused PayPal configuration value may remain in the config for backward compatibility, but it is no longer rendered anywhere on the Donate page.

## Files changed

- `src/pages/donate.js`
- `src/pages/donate.module.css`

## Configure the donation link

In `docusaurus.config.js`, set:

```js
customFields: {
  kofiUrl: 'https://ko-fi.com/YOUR_PUBLIC_NAME',
  watcherControlEndpoint: 'https://project-sentinel-watcher-control.sentinelwatcher.workers.dev',
},
```

Use only the public Ko-fi profile URL. Do not add passwords, API keys, dashboard links, access tokens, or bank information.

## New page content

- A single generic **Donate to Project Sentinel** call to action
- A personal appreciation message explaining that continued support helps updates continue
- Four cards explaining what donations support
- Secure payment-provider disclosure
- Non-financial support options for GitHub stars, bug reports, feature suggestions, and sharing
- A final thank-you and secondary donation call to action
- Responsive desktop, tablet, and mobile layouts
