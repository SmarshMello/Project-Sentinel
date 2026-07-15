# Sentinel Watcher 0.4 — website control setup

Watcher 0.4 fixes the live report path and adds a secure **Run new scan** button with GitHub Actions progress.

The website remains on GitHub Pages. A free Cloudflare Worker safely holds the GitHub token needed to start a workflow. Never place the token or the admin key in Docusaurus, GitHub source files, screenshots, or chat messages.

## Part A — publish the website update first

Copy this update into Project Sentinel, commit it, and push it. The dashboard will immediately begin loading its report from `static/data/watcher-report.json`. The scan button will show **Worker setup required** until Part B is complete.

## Part B — create the GitHub token

1. Sign in to GitHub.
2. Open your profile picture → **Settings**.
3. Open **Developer settings** → **Personal access tokens** → **Fine-grained tokens**.
4. Choose **Generate new token**.
5. Name it `Project Sentinel Watcher Control`.
6. Set an expiration date you are comfortable maintaining. A shorter expiration is safer, but you must replace it before it expires.
7. Under **Repository access**, choose **Only select repositories**, then select `Project-Sentinel`.
8. Under **Repository permissions**, set:
   - **Actions: Read and write**
   - **Metadata: Read-only** (GitHub normally selects this automatically)
9. Generate and copy the token. GitHub will not show it again.

The Worker uses this token only to trigger Sentinel Watcher and read its run/job status.

## Part C — choose the private admin key

Create a private password used only for the Watcher button. Make it long and random, for example at least 24 characters. Do not use your GitHub password.

You will store this as `WATCHER_ADMIN_KEY` in Cloudflare and type it into the Watcher dashboard when starting a scan. The dashboard stores it only in the current browser session.

## Part D — deploy the free Cloudflare Worker

1. Create or sign in to a free Cloudflare account.
2. In GitHub Desktop select Project Sentinel, then choose **Repository → Show in Explorer**.
3. Open the folder `watcher-control-worker`.
4. Click the File Explorer address bar, type `cmd`, and press Enter.
5. Run:

```bat
npm install
npx wrangler login
npx wrangler whoami
```

6. Store the GitHub token securely:

```bat
npx wrangler secret put GITHUB_TOKEN
```

Paste the fine-grained token when prompted. The terminal may not show characters while pasting.

7. Store your private Watcher admin key:

```bat
npx wrangler secret put WATCHER_ADMIN_KEY
```

8. Deploy:

```bat
npm run deploy
```

Cloudflare will return a URL similar to:

```text
https://project-sentinel-watcher-control.YOUR-SUBDOMAIN.workers.dev
```

9. Test the Worker by opening this in a browser:

```text
https://project-sentinel-watcher-control.YOUR-SUBDOMAIN.workers.dev/health
```

You should see JSON containing `"ok": true`.

## Part E — connect Project Sentinel

1. Open `docusaurus.config.js`.
2. Find:

```js
customFields: {
  paypalUrl: '',
  kofiUrl: '',
  watcherControlEndpoint: '',
},
```

3. Add the Worker URL without a trailing slash:

```js
customFields: {
  paypalUrl: '',
  kofiUrl: '',
  watcherControlEndpoint: 'https://project-sentinel-watcher-control.YOUR-SUBDOMAIN.workers.dev',
},
```

4. Commit and push with:

```text
Connect Sentinel Watcher control Worker
```

5. Wait for GitHub Pages to deploy, then open `/Project-Sentinel/watcher`.
6. Enter your private Watcher admin key and click **Run new scan**.

## What progress can display

The page reads the real GitHub Actions run and job steps. It shows:

- queued / waiting for runner
- checkout
- Node setup
- tracked-source scan
- report summary
- dashboard-data publishing
- artifact upload
- completion or failure

While the source scanner is executing, GitHub reports that entire operation as one active step. The elapsed timer continues, and the page switches steps as GitHub completes them.

## Report publishing behavior

The scanner now writes to:

```text
static/data/watcher-report.json
```

After the scan, the workflow commits that report and `sentinel-watcher/state.json`. This triggers the normal Pages deployment. The Watcher page automatically requests the new report after completion; GitHub Pages may take roughly one or two minutes to publish it.

## Security and maintenance

- Never commit `GITHUB_TOKEN` or `WATCHER_ADMIN_KEY`.
- Do not make the admin key public. Anyone with it can trigger scans.
- Revoke the GitHub token immediately if exposed.
- When the fine-grained token expires, create a replacement and rerun:

```bat
npx wrangler secret put GITHUB_TOKEN
```

- To replace the admin key, rerun:

```bat
npx wrangler secret put WATCHER_ADMIN_KEY
```

- To inspect Worker logs:

```bat
npm run tail
```

## Troubleshooting

### Invalid Watcher admin key
The value entered on the page does not exactly match the Cloudflare secret. Reset it with `npx wrangler secret put WATCHER_ADMIN_KEY`.

### GitHub rejected the scan request (403)
The fine-grained token is missing **Actions: Read and write**, does not have access to `Project-Sentinel`, or has expired.

### Worker connected, but no run appears
Confirm `.github/workflows/sentinel-watcher.yml` is on the `main` branch and still contains `workflow_dispatch`.

### Scan completes but report does not change immediately
The scan commit triggers a separate Pages deployment. Allow one or two minutes, then reload the dashboard.

### Browser reports a CORS error
Confirm `ALLOWED_ORIGIN` in `watcher-control-worker/wrangler.jsonc` is exactly `https://smarshmello.github.io`, then deploy again.
