import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoredNames = new Set(['build', '.docusaurus', 'coverage']);
const forbiddenDirectories = new Set(['.git', '.wrangler', 'node_modules']);
const forbiddenFileNames = new Set(['.env', '.dev.vars', 'wrangler-account.json']);
const secretPatterns = [
  /-----BEGIN (?:RSA |OPENSSH |EC |PGP )?PRIVATE KEY-----/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bAIza[0-9A-Za-z_-]{30,}\b/,
  /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\b(?:OPENAI_API_KEY|WATCHER_ADMIN_KEY|TURNSTILE_SECRET_KEY|GITHUB_TOKEN)\s*=\s*(?!replace|choose|your|example|\$\{|<)[^\s#]{8,}/i,
];
const privacyPatterns = [
  /\b[A-Z]:\\Users\\(?!USERNAME|YourName|YOUR_NAME|Test)[^\\\s]+/i,
  /\b[A-Z0-9._%+-]+@(gmail|outlook|yahoo|icloud)\.com\b/i,
];
const forbiddenText = [/packages\.applied-caas-gateway/i, /internal\.api\.openai\.org/i];
const findings = [];

function add(kind, value) { findings.push(`${kind}: ${value}`); }

function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    const relative = path.relative(root, full) || '.';
    if (entry.isDirectory()) {
      if (forbiddenDirectories.has(entry.name)) {
        add('forbidden generated/private directory', relative);
        continue;
      }
      if (!ignoredNames.has(entry.name)) walk(full);
      continue;
    }
    if (forbiddenFileNames.has(entry.name)) add('forbidden private file', relative);
    const stat = fs.statSync(full);
    if (stat.size > 2_000_000) continue;
    let text;
    try { text = fs.readFileSync(full, 'utf8'); } catch { continue; }
    for (const pattern of secretPatterns) if (pattern.test(text)) add('possible credential', relative);
    for (const pattern of privacyPatterns) if (pattern.test(text)) add('possible personal data', relative);
    for (const pattern of forbiddenText) if (pattern.test(text)) add('internal infrastructure reference', relative);
  }
}

walk(root);
const unique = [...new Set(findings)];
if (unique.length) {
  console.error(`Security audit failed:\n${unique.join('\n')}`);
  process.exit(1);
}
console.log('Security audit passed: no credentials, private metadata, generated dependency trees, or obvious personal data were found.');
