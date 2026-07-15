# Sentinel AI — complete setup guide

This guide connects the public Docusaurus page on GitHub Pages to a private Cloudflare Worker, which then calls the OpenAI API. The OpenAI key must exist only as a Cloudflare secret.

## Architecture

```text
Visitor on GitHub Pages
        ↓ HTTPS request
Cloudflare Worker
        ↓ server-side request using secret key
OpenAI Responses API
        ↓ structured diagnosis
Cloudflare Worker → visitor
```

Never place an OpenAI or Turnstile secret in `docusaurus.config.js`, GitHub, screenshots, Discord messages, or browser JavaScript.

---

## Part 1 — prerequisites

You need:

1. A Cloudflare account.
2. An OpenAI API Platform account with API billing enabled.
3. Node.js installed on your computer. Node 22 is recommended for this project.
4. The current Project Sentinel repository on your computer through GitHub Desktop.
5. The Sentinel AI files copied into the repository.

Verify Node and npm in **Command Prompt**:

```bat
node --version
npm --version
```

If both commands print version numbers, continue.

---

## Part 2 — create the OpenAI API project and key

Open the OpenAI API Platform in your browser.

1. Create a project named **Project Sentinel AI**.
2. Open the project’s billing/usage settings and add a payment method if required.
3. Set a conservative project budget or usage alert before public launch.
4. Open **API keys** inside the Project Sentinel AI project.
5. Create a new secret key named something recognizable, such as:

```text
Cloudflare Worker — Project Sentinel AI
```

6. Copy the secret key when it is shown.

Important:

- The key is normally shown only once.
- Do not paste it into a source file.
- Do not send it to ChatGPT or another person.
- Keep it temporarily in a secure password manager until Part 4.
- A ChatGPT Plus subscription does not provide API credits; API billing is separate.

Official references:

- https://platform.openai.com/api-keys
- https://platform.openai.com/settings/organization/billing/overview
- https://platform.openai.com/docs/api-reference/responses

---

## Part 3 — open the Worker folder in Command Prompt

In GitHub Desktop:

1. Select **Project-Sentinel**.
2. Click **Repository → Show in Explorer**.
3. Open the `sentinel-ai-worker` folder.
4. Click the File Explorer address bar.
5. Type:

```text
cmd
```

6. Press Enter.

Command Prompt should open directly inside the Worker folder. Confirm with:

```bat
dir
```

You should see `package.json`, `wrangler.jsonc`, `src`, and `SETUP.md`.

---

## Part 4 — install Wrangler and sign in to Cloudflare

Run:

```bat
npm install
```

Then:

```bat
npx wrangler login
```

Wrangler opens a browser window. Sign in to Cloudflare and approve access. Return to Command Prompt after authorization succeeds.

You can confirm the login with:

```bat
npx wrangler whoami
```

Official reference:

- https://developers.cloudflare.com/workers/get-started/guide/

---

## Part 5 — store the OpenAI key securely

Run:

```bat
npx wrangler secret put OPENAI_API_KEY
```

Wrangler asks for the secret value. Paste the OpenAI key and press Enter.

Notes:

- The terminal may not visibly show the pasted characters. That is normal.
- This creates an encrypted Cloudflare Worker secret.
- The key is not written into the repository.

Official reference:

- https://developers.cloudflare.com/workers/configuration/secrets/

---

## Part 6 — deploy the Worker

Run:

```bat
npm run deploy
```

After deployment, Wrangler prints a URL similar to:

```text
https://project-sentinel-ai.YOUR-SUBDOMAIN.workers.dev
```

Copy this complete URL. Do not add a trailing slash unless Cloudflare prints one.

The Worker configuration already permits requests from:

```text
https://smarshmello.github.io
```

and local Docusaurus development at:

```text
http://localhost:3000
```

---

## Part 7 — connect GitHub Pages to the Worker

Open the root project file:

```text
docusaurus.config.js
```

Find:

```js
customFields: {
  paypalUrl: '',
  kofiUrl: '',
  sentinelAiEndpoint: '',
  turnstileSiteKey: '',
},
```

Put the Worker URL between the quotes:

```js
customFields: {
  paypalUrl: '',
  kofiUrl: '',
  sentinelAiEndpoint: 'https://project-sentinel-ai.YOUR-SUBDOMAIN.workers.dev',
  turnstileSiteKey: '',
},
```

Save the file.

In GitHub Desktop, commit with:

```text
Connect Sentinel AI Worker
```

Then click **Push origin**.

Wait for GitHub Actions to turn green, then open:

```text
https://smarshmello.github.io/Project-Sentinel/sentinel-ai
```

The status beside **Sentinel AI Technician** should change from **Setup required** to **Backend configured**.

---

## Part 8 — first functional test

Before enabling Turnstile, submit a harmless test such as:

```text
RAGE Plugin Hook starts GTA V, but LSPDFR does not load. What information should I check first?
```

Expected result:

1. The page shows “Analyzing versions, plugins, and logs…”
2. The Worker returns a structured answer.
3. The response shows a confidence label.
4. No API key appears anywhere in browser developer tools or GitHub.

If the request fails, see **Troubleshooting the setup** below.

---

## Part 9 — enable Cloudflare Turnstile before promoting the AI publicly

Turnstile reduces automated abuse. Its browser token must always be validated by the Worker.

### Create the widget

In Cloudflare:

1. Open **Turnstile**.
2. Choose **Add widget**.
3. Widget name:

```text
Project Sentinel AI
```

4. Add this hostname:

```text
smarshmello.github.io
```

5. Choose **Managed** mode.
6. Create the widget.
7. Cloudflare displays two values:
   - **Site key** — public; this goes in Docusaurus.
   - **Secret key** — private; this goes in the Worker secret.

Official references:

- https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

### Store the Turnstile secret

In Command Prompt inside `sentinel-ai-worker`, run:

```bat
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Paste the private Turnstile secret and press Enter.

### Require Turnstile in the Worker

Open:

```text
sentinel-ai-worker/wrangler.jsonc
```

Change:

```json
"REQUIRE_TURNSTILE": "false"
```

to:

```json
"REQUIRE_TURNSTILE": "true"
```

Deploy the Worker again:

```bat
npm run deploy
```

### Add the public site key to Docusaurus

In the root `docusaurus.config.js`, change:

```js
turnstileSiteKey: '',
```

to:

```js
turnstileSiteKey: 'YOUR_PUBLIC_TURNSTILE_SITE_KEY',
```

Commit and push:

```text
Enable Turnstile for Sentinel AI
```

After GitHub Pages deploys, the Turnstile security check should appear above the Analyze button.

---

## Part 10 — verify the Build Planner integration

1. Open `/Project-Sentinel/planner`.
2. Choose a patrol profile and performance target.
3. The finished component list is automatically saved in that browser.
4. Open `/Project-Sentinel/sentinel-ai`.
5. The **Installed mods and plugins** panel should say that it loaded the saved planner selection.
6. Search for additional database entries and check or uncheck them as necessary.

This uses browser `localStorage`; selections do not follow a user to another device or browser.

---

## Updating the Worker later

After changing Worker code:

```bat
cd path\to\Project-Sentinel\sentinel-ai-worker
npm install
npm run deploy
```

You do not need to recreate the secrets after every deployment. Existing Worker secrets remain unless you delete or replace them.

To replace a compromised or rotated OpenAI key:

```bat
npx wrangler secret put OPENAI_API_KEY
npm run deploy
```

Then revoke the old key in the OpenAI Platform.

---

## Monitoring and costs

OpenAI API use is billed separately from ChatGPT. Before announcing Sentinel AI publicly:

1. Set a conservative OpenAI project budget/alert.
2. Review OpenAI usage regularly.
3. Keep Turnstile enabled.
4. Review Cloudflare Worker logs.
5. Avoid permanently storing users’ pasted logs.
6. Add rate limiting before high traffic or public promotion.

View live Worker logs from the Worker folder:

```bat
npm run tail
```

Press `Ctrl+C` to stop the log stream.

---

## Troubleshooting the setup

### The page says “Setup required”

`sentinelAiEndpoint` is still empty, misspelled, or the GitHub Pages deployment has not finished.

### “Origin not allowed”

Open `sentinel-ai-worker/wrangler.jsonc` and verify:

```json
"ALLOWED_ORIGINS": "https://smarshmello.github.io,http://localhost:3000"
```

Then redeploy the Worker.

### “The Worker is missing OPENAI_API_KEY”

Run:

```bat
npx wrangler secret put OPENAI_API_KEY
npm run deploy
```

### OpenAI reports billing, quota, or authorization failure

Check that:

- The key belongs to the correct OpenAI project.
- API billing is enabled.
- The project has not reached its budget or usage limit.
- The key was copied completely and has not been revoked.

### “Security verification failed or expired”

Turnstile tokens expire and are single-use. Refresh the widget and submit again. Also verify that the site key is in Docusaurus, the matching secret is in Cloudflare, and `REQUIRE_TURNSTILE` is enabled only after both are configured.

### Cloudflare deployment fails

Run:

```bat
npx wrangler whoami
npm install
npm run deploy
```

If authentication expired, run `npx wrangler login` again.

### The AI answers, but the plugin list is wrong

Open the Build Planner again to save the desired profile, then click **Reload planner** in Sentinel AI. You can also search the entire website registry and adjust the checklist manually.

---

## Security checklist

Before public launch, confirm all boxes:

- [ ] OpenAI key is stored only as `OPENAI_API_KEY` in Cloudflare.
- [ ] No secrets are committed to GitHub.
- [ ] Worker URL is present in `sentinelAiEndpoint`.
- [ ] Live site is listed in `ALLOWED_ORIGINS`.
- [ ] Turnstile is enabled and validated server-side.
- [ ] OpenAI budget or usage alert is configured.
- [ ] A harmless end-to-end test succeeds.
- [ ] Logs are not permanently stored.
