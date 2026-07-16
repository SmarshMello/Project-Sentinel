export const GOLDEN_SNAPSHOT_KEY = 'sentinel-golden-build-snapshots-v2';

export function createGoldenSnapshot(profiles = [], name = '') {
  const createdAt = new Date().toISOString();
  return {
    id: `golden-${Date.now()}`,
    name: name.trim() || `Golden Build ${new Date(createdAt).toLocaleDateString()}`,
    createdAt,
    plugins: profiles.filter((profile) => profile.goldenBuild).map((profile) => ({
      id: profile.id, name: profile.name, version: profile.currentVersion, risk: profile.risk.key, health: profile.health.score,
    })),
  };
}

export function compareGoldenSnapshots(before, after) {
  const left = new Map((before?.plugins || []).map((item) => [item.id, item]));
  const right = new Map((after?.plugins || []).map((item) => [item.id, item]));
  const added = [], removed = [], changed = [], unchanged = [];
  for (const item of right.values()) {
    const previous = left.get(item.id);
    if (!previous) added.push(item);
    else if (previous.version !== item.version || previous.risk !== item.risk || previous.health !== item.health) changed.push({before: previous, after: item});
    else unchanged.push(item);
  }
  for (const item of left.values()) if (!right.has(item.id)) removed.push(item);
  return {added, removed, changed, unchanged};
}
