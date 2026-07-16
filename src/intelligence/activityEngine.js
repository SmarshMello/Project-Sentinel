function dateValue(value) {
  const parsed = Date.parse(value || '');
  return Number.isFinite(parsed) ? parsed : 0;
}

export function buildWatcherActivity(profiles = []) {
  return profiles.flatMap((profile) => {
    const watcher = profile.watcher;
    if (!watcher) return [];
    const status = watcher.status || 'unknown';
    const title = status === 'possible-update' ? 'Release signal detected' : status === 'healthy' ? 'Source check healthy' : status === 'rate-limited' ? 'Source rate limited' : status === 'error' ? 'Source check failed' : 'Watcher scan recorded';
    return [{
      id: `${profile.id}:${watcher.checkedAt || watcher.lastChecked || status}`,
      pluginId: profile.id,
      pluginName: profile.name,
      status,
      title,
      detail: watcher.note || watcher.message || profile.recommendation.reasons[0],
      detectedVersion: watcher.detectedVersion || profile.release.detectedVersion || null,
      timestamp: watcher.checkedAt || watcher.lastChecked || null,
      risk: profile.risk,
    }];
  }).sort((a, b) => dateValue(b.timestamp) - dateValue(a.timestamp));
}
