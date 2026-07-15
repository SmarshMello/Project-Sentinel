import {registry} from './registry';

export const compatibilityStatuses = {
  verified: {label: 'Verified', tone: 'green', rank: 1},
  compatible: {label: 'Compatible', tone: 'blue', rank: 2},
  testing: {label: 'Testing', tone: 'yellow', rank: 3},
  conflict: {label: 'Conflict Risk', tone: 'red', rank: 4},
  legacy: {label: 'Legacy', tone: 'yellow', rank: 5},
  research: {label: 'Research', tone: 'purple', rank: 6},
  deprecated: {label: 'Deprecated', tone: 'red', rank: 7},
};

export const compatibilityRows = registry.map((plugin) => ({
  id: plugin.id,
  component: plugin.name,
  version: plugin.version,
  category: plugin.category,
  status: plugin.compatibilityStatus,
  legacy3788: plugin.legacy3788,
  goldenBuild: plugin.goldenBuild,
  impact: plugin.impact,
  confidence: plugin.confidence,
  note: plugin.note,
  guide: plugin.profile,
  dependencies: plugin.dependencies,
  developer: plugin.developer,
}));

export const compatibilityCategories = ['All', ...Array.from(new Set(compatibilityRows.map((row) => row.category)))];
