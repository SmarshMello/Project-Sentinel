function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function expandBuildSelection(selectedIds, graph) {
  const selected = new Set(selectedIds || []);
  const queue = [...selected];
  const unresolved = [];
  while (queue.length) {
    const id = queue.shift();
    for (const edge of graph.edges.filter((item) => item.source === id)) {
      if (!edge.resolved || !edge.target) {
        unresolved.push({sourceId: id, label: edge.targetLabel});
        continue;
      }
      if (!selected.has(edge.target)) {
        selected.add(edge.target);
        queue.push(edge.target);
      }
    }
  }
  return {ids: [...selected], unresolved};
}

export function createInstallationPlan(selectedIds, graph, profiles = []) {
  const byId = new Map(profiles.map((profile) => [profile.id, profile]));
  const expanded = expandBuildSelection(selectedIds, graph);
  const included = new Set(expanded.ids);
  const incomingCount = new Map(expanded.ids.map((id) => [id, 0]));
  const dependents = new Map();

  for (const edge of graph.edges.filter((item) => item.resolved && included.has(item.source) && included.has(item.target))) {
    incomingCount.set(edge.source, (incomingCount.get(edge.source) || 0) + 1);
    if (!dependents.has(edge.target)) dependents.set(edge.target, []);
    dependents.get(edge.target).push(edge.source);
  }

  const queue = [...incomingCount.entries()]
    .filter(([, count]) => count === 0)
    .map(([id]) => id)
    .sort((a, b) => (byId.get(b)?.goldenBuild ? 1 : 0) - (byId.get(a)?.goldenBuild ? 1 : 0) || (byId.get(a)?.name || a).localeCompare(byId.get(b)?.name || b));
  const ordered = [];
  while (queue.length) {
    const id = queue.shift();
    ordered.push(id);
    for (const child of dependents.get(id) || []) {
      incomingCount.set(child, incomingCount.get(child) - 1);
      if (incomingCount.get(child) === 0) queue.push(child);
    }
  }

  const cycles = expanded.ids.filter((id) => !ordered.includes(id));
  ordered.push(...cycles);
  const steps = ordered.map((id, index) => {
    const profile = byId.get(id);
    const autoAdded = !selectedIds.includes(id);
    return {
      order: index + 1,
      id,
      name: profile?.name || id,
      version: profile?.currentVersion || 'Unknown',
      risk: profile?.risk?.key || 'unknown',
      recommendation: profile?.recommendation?.label || 'Review',
      autoAdded,
      goldenBuild: Boolean(profile?.goldenBuild),
    };
  });

  const warnings = [];
  if (expanded.unresolved.length) warnings.push({type: 'dependency', message: `${expanded.unresolved.length} dependency reference${expanded.unresolved.length === 1 ? '' : 's'} could not be resolved.`, items: expanded.unresolved});
  if (cycles.length) warnings.push({type: 'cycle', message: `${cycles.length} project${cycles.length === 1 ? '' : 's'} participate in a dependency cycle and require manual ordering.`, items: cycles});
  const risky = steps.filter((step) => ['highRisk', 'breaking'].includes(step.risk));
  if (risky.length) warnings.push({type: 'risk', message: `${risky.length} selected project${risky.length === 1 ? '' : 's'} are high risk or breaking.`, items: risky});

  return {
    selectedIds: unique(selectedIds),
    includedIds: expanded.ids,
    autoAddedIds: expanded.ids.filter((id) => !selectedIds.includes(id)),
    steps,
    warnings,
    ready: selectedIds.length > 0 && !cycles.length && !risky.some((item) => item.risk === 'breaking'),
  };
}
