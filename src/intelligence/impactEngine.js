export function simulateImpact(profileId, graph, profiles = []) {
  const byId = new Map(profiles.map((profile) => [profile.id, profile]));
  const reverse = new Map();
  for (const edge of graph.edges.filter((item) => item.resolved)) {
    if (!reverse.has(edge.target)) reverse.set(edge.target, []);
    reverse.get(edge.target).push(edge.source);
  }

  const queue = [{id: profileId, depth: 0}];
  const seen = new Set([profileId]);
  const affected = [];
  while (queue.length) {
    const current = queue.shift();
    for (const childId of reverse.get(current.id) || []) {
      if (seen.has(childId)) continue;
      seen.add(childId);
      const depth = current.depth + 1;
      const profile = byId.get(childId);
      affected.push({
        id: childId,
        label: profile?.name || childId,
        depth,
        riskScore: profile?.risk?.score ?? 50,
        goldenBuild: Boolean(profile?.goldenBuild),
        priority: depth === 1 || profile?.goldenBuild ? 'critical' : depth === 2 ? 'medium' : 'low',
      });
      queue.push({id: childId, depth});
    }
  }

  const rank = {critical: 0, medium: 1, low: 2};
  affected.sort((a, b) => rank[a.priority] - rank[b.priority] || a.depth - b.depth || b.riskScore - a.riskScore || a.label.localeCompare(b.label));
  return {
    sourceId: profileId,
    affected,
    critical: affected.filter((item) => item.priority === 'critical'),
    medium: affected.filter((item) => item.priority === 'medium'),
    low: affected.filter((item) => item.priority === 'low'),
    plan: affected.map((item, index) => ({...item, order: index + 1})),
  };
}
