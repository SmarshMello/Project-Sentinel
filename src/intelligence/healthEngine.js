export function calculatePluginHealth(plugin, watcherItem = null, risk = null) {
  let score = 50;
  const factors = [];

  if (plugin.status === 'verified') { score += 25; factors.push('Verified registry entry'); }
  else if (plugin.status === 'community' || plugin.status === 'documented') { score += 10; factors.push('Documented community evidence'); }
  else if (plugin.status === 'deprecated' || plugin.status === 'conflict') { score -= 35; factors.push('Deprecated or conflicting registry status'); }

  const confidence = Number(plugin.confidence || 0);
  score += Math.round((confidence - 50) * 0.2);
  if (confidence >= 90) factors.push('High evidence confidence');

  if (watcherItem) {
    const watcherHealth = Number(watcherItem.healthScore);
    if (Number.isFinite(watcherHealth)) score = Math.round((score + watcherHealth) / 2);
    if (watcherItem.status === 'healthy') factors.push('Watcher source is healthy');
    if (watcherItem.needsReview) { score -= 10; factors.push('Watcher review pending'); }
    if (['timed-out', 'rate-limited', 'blocked'].includes(watcherItem.status)) factors.push('Source could not be fully verified this scan');
  } else {
    score -= 8;
    factors.push('Not connected to Watcher');
  }

  if (risk?.unresolvedDependencies?.length) score -= Math.min(15, risk.unresolvedDependencies.length * 3);
  score = Math.max(0, Math.min(100, score));
  const label = score >= 85 ? 'Excellent' : score >= 70 ? 'Healthy' : score >= 50 ? 'Needs attention' : score >= 30 ? 'Weak' : 'Critical';
  return {score, label, factors};
}
