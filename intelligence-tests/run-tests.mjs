import assert from 'node:assert/strict';
import {recommendUpgrade} from '../src/intelligence/recommendationEngine.js';

const basePlugin = {status: 'verified', goldenBuild: false};
const baseRelease = {hasBreaking: false, needsMigration: false, updateDetected: false};
const safeRisk = {score: 5};

const cases = [
  ['verified current install without Watcher evidence', basePlugin, baseRelease, safeRisk, null, 'monitor'],
  ['healthy Watcher source', basePlugin, baseRelease, safeRisk, {status: 'healthy'}, 'monitor'],
  ['safe Golden Build update', {...basePlugin, goldenBuild: true}, {...baseRelease, updateDetected: true}, safeRisk, {status: 'possible-update'}, 'upgradeNow'],
  ['manual review required', basePlugin, baseRelease, {score: 20}, {needsReview: true}, 'wait'],
  ['deprecated project', {...basePlugin, status: 'deprecated'}, baseRelease, {score: 90}, null, 'avoid'],
];

for (const [name, plugin, release, risk, watcher, expected] of cases) {
  const result = recommendUpgrade(plugin, release, risk, watcher);
  assert.equal(result.key, expected, `${name}: expected ${expected}, got ${result.key}`);
  console.log(`PASS ${name} -> ${result.label}`);
}

console.log(`\n${cases.length}/${cases.length} recommendation consistency cases passed.`);
