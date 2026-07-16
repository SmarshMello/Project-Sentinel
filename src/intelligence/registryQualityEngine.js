export function auditRegistry(profiles = [], graph = {edges: []}) {
  const issues = [];
  for (const profile of profiles) {
    if (!profile.developer || profile.developer === 'Unknown') issues.push({type: 'developer', pluginId: profile.id, label: profile.name, message: 'Developer is missing.'});
    if (!profile.currentVersion || /unknown|to be locked/i.test(profile.currentVersion)) issues.push({type: 'version', pluginId: profile.id, label: profile.name, message: 'Version needs a verified lock.'});
    if (!profile.profile) issues.push({type: 'profile', pluginId: profile.id, label: profile.name, message: 'Plugin profile route is missing.'});
    if (!profile.guide) issues.push({type: 'guide', pluginId: profile.id, label: profile.name, message: 'Installation guidance is missing.'});
    if (!profile.watcher) issues.push({type: 'watcher', pluginId: profile.id, label: profile.name, message: 'No Watcher source is connected.'});
    if (profile.confidence < 60) issues.push({type: 'confidence', pluginId: profile.id, label: profile.name, message: `Confidence is only ${profile.confidence}%.`});
  }
  for (const edge of graph.edges.filter((item) => !item.resolved)) {
    const source = profiles.find((profile) => profile.id === edge.source);
    issues.push({type: 'dependency', pluginId: edge.source, label: source?.name || edge.source, message: `Unresolved dependency: ${edge.targetLabel}.`});
  }
  const counts = issues.reduce((result, issue) => ({...result, [issue.type]: (result[issue.type] || 0) + 1}), {});
  return {issues, counts, score: Math.max(0, Math.round(100 - (issues.length / Math.max(1, profiles.length * 4)) * 100))};
}
