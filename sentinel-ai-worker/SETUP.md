# Sentinel AI Worker setup

This Worker keeps the OpenAI API key out of the public GitHub Pages website.

## 1. Install and sign in

```bash
cd sentinel-ai-worker
npm install
npx wrangler login
```

## 2. Add secrets

```bash
npx wrangler secret put OPENAI_API_KEY
```

Optional but strongly recommended before public launch:

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Never place either secret in `wrangler.jsonc`, Docusaurus, GitHub, screenshots, or support messages.

## 3. Deploy

```bash
npm run deploy
```

Wrangler prints a URL similar to:

```text
https://project-sentinel-ai.<your-subdomain>.workers.dev
```

## 4. Connect the website

In the root `docusaurus.config.js`, set:

```js
customFields: {
  // existing fields...
  sentinelAiEndpoint: 'https://project-sentinel-ai.<your-subdomain>.workers.dev',
  turnstileSiteKey: '',
},
```

Commit and push the Docusaurus change.

## 5. Enable Turnstile before public promotion

Create a Turnstile widget for `smarshmello.github.io` in Cloudflare. Then:

1. Put its public site key in `turnstileSiteKey` in `docusaurus.config.js`.
2. Put the secret key in the Worker with `wrangler secret put TURNSTILE_SECRET_KEY`.
3. Change `REQUIRE_TURNSTILE` to `"true"` in `wrangler.jsonc`.
4. Deploy the Worker again.

Server-side Turnstile validation is already implemented in `src/index.js`.

## 6. Restrict origins

`ALLOWED_ORIGINS` already allows the live GitHub Pages origin and local Docusaurus development. Remove localhost when you no longer need it.

## Cost and safety

- API billing is separate from ChatGPT subscriptions.
- Set a low OpenAI project budget before publishing.
- Monitor Worker logs and OpenAI usage.
- The Worker limits message, history, file count, and total log size.
- Add Cloudflare rate limiting before advertising the feature widely.
