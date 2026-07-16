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


const {simulateImpact} = await import('../src/intelligence/impactEngine.js');
const impactGraph = {edges:[
  {source:'child-a',target:'root',resolved:true},
  {source:'child-b',target:'child-a',resolved:true},
  {source:'child-c',target:'child-b',resolved:true},
]};
const impactProfiles = [
  {id:'root',name:'Root',risk:{score:5},goldenBuild:true},
  {id:'child-a',name:'Child A',risk:{score:20},goldenBuild:false},
  {id:'child-b',name:'Child B',risk:{score:40},goldenBuild:false},
  {id:'child-c',name:'Child C',risk:{score:70},goldenBuild:false},
];
const impact = simulateImpact('root', impactGraph, impactProfiles);
assert.equal(impact.affected.length,3);
assert.equal(impact.critical[0].id,'child-a');
assert.equal(impact.medium[0].id,'child-b');
assert.equal(impact.low[0].id,'child-c');
console.log('PASS transitive impact simulation and priority ordering');

const {auditRegistry} = await import('../src/intelligence/registryQualityEngine.js');
const audit = auditRegistry([{id:'p',name:'Plugin',developer:'Unknown',currentVersion:'Unknown',confidence:40,profile:null,guide:null,watcher:null}],{edges:[{source:'p',target:null,targetLabel:'Missing',resolved:false}]});
assert.ok(audit.issues.length >= 6);
assert.equal(audit.counts.dependency,1);
console.log('PASS registry quality audit coverage');

const {compareGoldenSnapshots} = await import('../src/intelligence/goldenBuildEngine.js');
const diff = compareGoldenSnapshots({plugins:[{id:'a',name:'A',version:'1',risk:'safe',health:90},{id:'b',name:'B',version:'1',risk:'safe',health:80}]},{plugins:[{id:'a',name:'A',version:'2',risk:'likelySafe',health:85},{id:'c',name:'C',version:'1',risk:'safe',health:90}]});
assert.equal(diff.added.length,1); assert.equal(diff.removed.length,1); assert.equal(diff.changed.length,1);
console.log('PASS Golden Build snapshot comparison');

const {buildWatcherActivity} = await import('../src/intelligence/activityEngine.js');
const feed = buildWatcherActivity([{id:'a',name:'A',watcher:{status:'healthy',checkedAt:'2026-01-01T00:00:00Z'},risk:{tone:'safe'},release:{},recommendation:{reasons:['ok']}},{id:'b',name:'B',watcher:{status:'possible-update',checkedAt:'2026-02-01T00:00:00Z'},risk:{tone:'unknown'},release:{detectedVersion:'2'},recommendation:{reasons:['review']}}]);
assert.equal(feed[0].pluginId,'b'); assert.equal(feed.length,2);
console.log('PASS Watcher activity ordering');

const {createInstallationPlan} = await import('../src/intelligence/buildPlannerEngine.js');
const plannerGraph = {edges:[
  {source:'plugin',target:'library',resolved:true},
  {source:'library',target:'loader',resolved:true},
]};
const plannerProfiles = [
  {id:'loader',name:'Loader',currentVersion:'1',risk:{key:'safe'},recommendation:{label:'Monitor'},goldenBuild:true},
  {id:'library',name:'Library',currentVersion:'2',risk:{key:'safe'},recommendation:{label:'Monitor'},goldenBuild:false},
  {id:'plugin',name:'Plugin',currentVersion:'3',risk:{key:'likelySafe'},recommendation:{label:'Monitor'},goldenBuild:false},
];
const plan = createInstallationPlan(['plugin'], plannerGraph, plannerProfiles);
assert.deepEqual(plan.steps.map((step)=>step.id), ['loader','library','plugin']);
assert.equal(plan.autoAddedIds.length,2);
assert.equal(plan.ready,true);
console.log('PASS Build Planner dependency expansion and installation ordering');

const {verifyBuild} = await import('../src/intelligence/buildVerifierEngine.js');
const blocked = verifyBuild(['plugin'], plannerGraph, plannerProfiles);
assert.equal(blocked.readyToLaunch,false);
assert.equal(blocked.counts.error,1);
const verified = verifyBuild(['loader','library','plugin'], plannerGraph, plannerProfiles);
assert.equal(verified.readyToLaunch,true);
assert.equal(verified.counts.error,0);
console.log('PASS Build Verifier dependency completeness and launch readiness');
