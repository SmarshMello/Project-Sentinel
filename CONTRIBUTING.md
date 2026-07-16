# Contributing to Project Sentinel

Thank you for helping improve Project Sentinel.

## Before opening an issue

- Search existing issues first.
- Use the appropriate issue template.
- Include exact GTA V Legacy, RAGE Plugin Hook, and LSPDFR versions when relevant.
- Share the first meaningful error and nearby log context rather than only the final shutdown lines.

## Protect private information

Never post:

- Access tokens, API keys, admin keys, passwords, or recovery codes.
- `.env` or `.dev.vars` files.
- Payment, banking, or account-dashboard details.
- Private keys or certificates.
- Full personal file paths, email addresses, or other identifying information unless required and intentionally shared.

Redact sensitive values before attaching logs or screenshots.

## Pull requests

1. Create a focused branch from `main`.
2. Keep changes limited to one clear purpose.
3. Run:

```bash
npm ci --no-audit --no-fund
npm run test:intelligence
npm run test:doctor
npm run security:audit
npm run build
```

4. Explain what changed, why it changed, and how it was tested.
5. Do not include generated directories such as `node_modules`, `.docusaurus`, or `build`.

Changes to workflows, Workers, dependency files, security logic, or deployment configuration require especially careful review.
