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
assert.match(deployWorkflow, /workflows:\s*\["Sentinel Watcher", "Sentinel Research"\]/);
console.log('PASS successful Sentinel Research runs trigger GitHub Pages deployment');

console.log('\n4/4 Sentinel Research integration tests passed.');
