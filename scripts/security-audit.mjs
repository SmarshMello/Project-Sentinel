import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignored = new Set(['node_modules', 'build', '.docusaurus', '.git']);
const patterns = [
  /-----BEGIN (?:RSA |OPENSSH |EC |PGP )?PRIVATE KEY-----/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk_live_[A-Za-z0-9]+\b/,
  /\bsk-[A-Za-z0-9]{20,}\b/,
];
const findings = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const stat = fs.statSync(full);
      if (stat.size > 2_000_000) continue;
      let text; try { text = fs.readFileSync(full, 'utf8'); } catch { continue; }
      for (const pattern of patterns) if (pattern.test(text)) findings.push(path.relative(root, full));
    }
  }
}
walk(root);
if (findings.length) {
  console.error(`Potential secrets detected in:\n${[...new Set(findings)].join('\n')}`);
  process.exit(1);
}
console.log('Security audit passed: no high-confidence committed secrets detected.');
