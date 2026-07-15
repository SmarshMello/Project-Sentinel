# Sentinel AI installation order

1. Copy this update into the Project Sentinel repository.
2. Commit and push the site. The `/sentinel-ai` page will appear in setup mode.
3. Follow `sentinel-ai-worker/SETUP.md` to deploy the secure Worker.
4. Add the Worker URL to `customFields.sentinelAiEndpoint` in `docusaurus.config.js`.
5. Commit and push again.
6. Test with a harmless sample problem before enabling Turnstile and sharing publicly.

The OpenAI key belongs only in a Cloudflare Worker secret. Never add it to GitHub Pages or `docusaurus.config.js`.
