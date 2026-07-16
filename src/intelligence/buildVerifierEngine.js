export function verifyBuild(selectedIds, graph, profiles = []) {
  const selected = new Set(selectedIds || []);
  const byId = new Map(profiles.map((profile) => [profile.id, profile]));
  const findings = [];

  for (const id of selected) {
    const profile = byId.get(id);
    if (!profile) {
      findings.push({severity: 'error', type: 'missing', pluginId: id, message: `Registry profile ${id} is missing.`});
      continue;
    }
    if (profile.risk.key === 'breaking') findings.push({severity: 'error', type: 'risk', pluginId: id, message: `${profile.name} is marked Breaking.`});
    else if (profile.risk.key === 'highRisk') findings.push({severity: 'warning', type: 'risk', pluginId: id, message: `${profile.name} is high risk and needs manual verification.`});
    if (profile.release?.updateDetected) findings.push({severity: 'warning', type: 'update', pluginId: id, message: `${profile.name} has a detected update awaiting review.`});
    if (profile.confidence < 60) findings.push({severity: 'warning', type: 'confidence', pluginId: id, message: `${profile.name} has low registry confidence (${profile.confidence}%).`});
    if (!profile.currentVersion || /unknown|current release|version to be locked/i.test(profile.currentVersion)) findings.push({severity: 'warning', type: 'version', pluginId: id, message: `${profile.name} does not have a precise locked version.`});
  }

  for (const edge of graph.edges.filter((item) => selected.has(item.source))) {
    const source = byId.get(edge.source);
    if (!edge.resolved || !edge.target) findings.push({severity: 'error', type: 'dependency', pluginId: edge.source, message: `${source?.name || edge.source} has an unresolved dependency: ${edge.targetLabel}.`});
    else if (!selected.has(edge.target)) {
      const dependency = byId.get(edge.target);
      findings.push({severity: 'error', type: 'dependency', pluginId: edge.source, message: `${source?.name || edge.source} requires ${dependency?.name || edge.target}, which is not included.`});
    }
  }

  const counts = findings.reduce((acc, finding) => ({...acc, [finding.severity]: (acc[finding.severity] || 0) + 1}), {error: 0, warning: 0, info: 0});
  const penalty = counts.error * 18 + counts.warning * 6;
  const score = Math.max(0, Math.min(100, 100 - penalty));
  const status = counts.error ? 'blocked' : counts.warning ? 'review' : 'verified';
  return {
    selectedCount: selected.size,
    findings,
    counts,
    score,
    status,
    readyToLaunch: counts.error === 0,
  };
}
