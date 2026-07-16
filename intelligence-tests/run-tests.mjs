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

const {buildPluginTimeline, summarizeTimeline} = await import('../src/intelligence/timelineEngine.js');
const timelineProfile = {
  id: 'test-plugin',
  name: 'Test Plugin',
  currentVersion: '1.0.0',
  registryStatus: 'verified',
  confidence: 100,
  goldenBuild: true,
  release: {updateDetected: true, detectedVersion: '1.1.0', hasBreaking: false, needsMigration: false},
  watcher: {status: 'possible-update', checkedAt: '2026-07-15T12:00:00.000Z', note: 'New version found.', detectedVersion: '1.1.0'},
};
const timelineCases = [{id: 'case-1', pluginId: 'test-plugin', status: 'monitoring', createdAt: '2026-07-15T13:00:00.000Z', updatedAt: '2026-07-15T14:00:00.000Z', summary: 'Retest required.', steps: ['one'], completedSteps: []}];
const timeline = buildPluginTimeline(timelineProfile, timelineCases);
const timelineSummary = summarizeTimeline(timeline);
assert.equal(timeline[0].type, 'doctor', 'newest dated event should be the Doctor case');
assert.equal(timelineSummary.doctor, 1);
assert.equal(timelineSummary.releases, 1);
assert.equal(timelineSummary.watcher, 1);
assert.equal(timelineSummary.build, 1);
assert.ok(timeline.some((item) => item.id === 'registry-baseline'));
console.log('PASS plugin lifecycle timeline ordering and event summary');
