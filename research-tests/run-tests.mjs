import assert from 'node:assert/strict';
import fs from 'node:fs';
import {collectResearchProjects, findResearchProject} from '../src/data/researchRegistry.js';

const resolvedPayload = {
  discoveries: [],
  requests: [{
    requestId: 'expert-resolved-1',
    query: 'Example Verified Mod',
    status: 'resolved',
    completedAt: '2026-07-16T05:00:00.000Z',
    credibleCandidateCount: 1,
    candidates: [{title: 'Example Verified Mod', url: 'https://example.com/mod', domain: 'example.com', score: 76, description: 'Official project page.'}],
  }],
};
const resolved = collectResearchProjects(resolvedPayload);
assert.equal(resolved.length, 1);
assert.equal(resolved[0].name, 'Example Verified Mod');
assert.equal(resolved[0].researchStatus, 'pending-review');
assert.ok(findResearchProject(resolvedPayload, resolved[0].id));
console.log('PASS resolved research request enters the Research registry');

const leadPayload = {
  discoveries: [],
  requests: [{
    requestId: 'expert-lead-1',
    query: 'Example Candidate Mod',
    status: 'needs-manual-research',
    completedAt: '2026-07-16T05:01:00.000Z',
    candidates: [{title: 'Possible Example Candidate Mod', url: 'https://example.net/lead', domain: 'example.net', score: 31, snippet: 'Possible public project source.'}],
  }],
};
const leads = collectResearchProjects(leadPayload);
assert.equal(leads.length, 1);
assert.equal(leads[0].researchStatus, 'candidate-review');
assert.equal(leads[0].status, 'research');
console.log('PASS lower-confidence candidate is preserved as an unverified Research lead');

const junkPayload = {
  discoveries: [],
  requests: [{query: 'Unrelated Noise', status: 'needs-manual-research', candidates: [{url: 'https://example.org/noise', score: 12}]}],
};
assert.equal(collectResearchProjects(junkPayload).length, 0);
console.log('PASS very low-confidence noise is not added to the Research registry');

const deployWorkflow = fs.readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
assert.match(deployWorkflow, /workflows:\s*\["Sentinel Watcher"\]/);
const researchWorkflow = fs.readFileSync(new URL('../.github/workflows/sentinel-research.yml', import.meta.url), 'utf8');
assert.match(researchWorkflow, /publish_site/);
assert.match(researchWorkflow, /gh workflow run deploy\.yml/);
console.log('PASS bulk research defers Pages deployment until the final publish request');

console.log('\n4/4 Sentinel Research integration tests passed.');

import {MAX_BULK_PROJECTS,MAX_INPUT_LENGTH,parseBulkResearchInput, summarizeBulkResults} from '../src/data/bulkResearch.js';
{
  const known=[{name:'Stop The Ped',aliases:['STP']},{name:'Ultimate Backup',shortName:'UB'}];
  const parsed=parseBulkResearchInput('ResponseV\nStop The Ped\nResponseV\nSTP\nBetter Chases+',known);
  assert.equal(parsed.isBulk,true,'multi-line input should activate bulk mode');
  assert.equal(parsed.duplicates.length,1,'exact duplicate should be removed');
  assert.equal(parsed.known.length,2,'known names and aliases should be classified');
  assert.deepEqual(parsed.unknown,['ResponseV','Better Chases+'],'unknown projects should remain queued');
  const summary=summarizeBulkResults([{status:'known'},{status:'found'},{status:'failed'}]);
  assert.equal(summary.total,3);
  assert.equal(summary.found,1);
  assert.equal(MAX_BULK_PROJECTS,500);
  assert.equal(MAX_INPUT_LENGTH,100000);
  const many=parseBulkResearchInput(Array.from({length:520},(_,i)=>`Project ${i+1}`).join('\n'),[]);
  assert.equal(many.unique.length,500);
  assert.equal(many.overflow,20);
  console.log('✓ bulk research parser, higher limits, and result summary');
}


const expertPage = fs.readFileSync(new URL('../src/pages/sentinel-ai/index.js', import.meta.url), 'utf8');
assert.match(expertPage, /Stop after current project/);
assert.match(expertPage, /phase:'stopping'/);
assert.match(expertPage, /sentinel-bulk-research-v2/);
assert.match(expertPage, /totalUnknown/);
console.log('PASS bulk queue pause, persistence, and frozen progress totals are wired');

const workerSource = fs.readFileSync(new URL('../watcher-control-worker/src/index.js', import.meta.url), 'utf8');
assert.match(workerSource, /url\.pathname === '\/publish'/);
assert.match(workerSource, /publish_site/);
console.log('PASS bulk completion can request one final Pages publish');
