# Sentinel AI installation order

1. Copy the Sentinel AI update into the current Project Sentinel repository.
2. Commit and push. `/sentinel-ai` will appear in safe **Setup required** mode.
3. Open `sentinel-ai-worker/SETUP.md` and follow every section in order.
4. Create a dedicated OpenAI API project and key. Never commit or share the key.
5. Run `npm install` and `npx wrangler login` inside `sentinel-ai-worker`.
6. Store the key with `npx wrangler secret put OPENAI_API_KEY`.
7. Deploy with `npm run deploy`.
8. Put the returned Worker URL in `customFields.sentinelAiEndpoint` in `docusaurus.config.js`.
9. Commit and push the website change.
10. Test a harmless diagnosis.
11. Create and enable Cloudflare Turnstile before public promotion.
12. Set a conservative OpenAI project budget/usage alert and monitor usage.

The OpenAI key belongs only in a Cloudflare Worker secret. The Turnstile secret also belongs only in a Cloudflare Worker secret.
