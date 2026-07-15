import fs from 'node:fs';import assert from 'node:assert/strict';import {analyzeDiagnostics} from '../src/utils/diagnosticEngine.js';
const cases=[
 ['scripthook-update.log','scripthookv-version',['ragenativeui','gameconfig-packfiles','heap-adjuster-missing']],
 ['duplicate-ragenativeui.log','ragenativeui',['gameconfig-packfiles','heap-adjuster-missing','scripthookv-version']],
];
for(const [file,expected,forbidden] of cases){const result=analyzeDiagnostics(fs.readFileSync(new URL(file,import.meta.url),'utf8'));assert.equal(result.matches[0]?.id,expected,`${file}: expected ${expected}, got ${result.matches[0]?.id}`);for(const id of forbidden)assert.ok(!result.matches.some(x=>x.id===id),`${file}: false positive ${id}`);console.log(`PASS ${file} -> ${expected}`)}
