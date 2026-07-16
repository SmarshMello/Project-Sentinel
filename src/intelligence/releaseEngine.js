const CATEGORY_RULES = {
  breaking: [/breaking/i, /incompatible/i, /removed/i, /no longer supports/i, /requires .* newer/i],
  security: [/security/i, /vulnerab/i, /exploit/i, /cve-/i],
  migration: [/migrat/i, /replace .* file/i, /delete .* config/i, /reinstall/i, /clean install/i],
  configuration: [/config/i, /\.ini\b/i, /setting/i, /option/i],
  performance: [/performance/i, /optim/i, /memory leak/i, /faster/i, /latency/i],
  fixes: [/fix/i, /crash/i, /bug/i, /issue/i, /error/i],
  features: [/add/i, /new /i, /support/i, /introduc/i, /improv/i],
};

export function classifyReleaseText(...values) {
  const text = values.filter(Boolean).join('\n').trim();
  const lines = text.split(/\n|[•;]/).map((line) => line.trim()).filter(Boolean);
  const buckets = Object.fromEntries(Object.keys(CATEGORY_RULES).map((key) => [key, []]));
  const uncategorized = [];

  lines.forEach((line) => {
    const matched = Object.entries(CATEGORY_RULES).find(([, rules]) => rules.some((rule) => rule.test(line)));
    if (matched) buckets[matched[0]].push(line);
    else uncategorized.push(line);
  });

  return {...buckets, uncategorized, sourceText: text};
}

export function buildReleaseIntelligence(plugin, watcherItem = null) {
  const classified = classifyReleaseText(
    watcherItem?.note,
    watcherItem?.reviewReason,
    watcherItem?.intelligence?.recommendation,
    watcherItem?.latestRelease?.body,
  );
  const detectedVersion = watcherItem?.detectedVersion || watcherItem?.latestRelease?.tag || watcherItem?.latestRelease?.name || null;
  const updateDetected = watcherItem?.status === 'possible-update' || watcherItem?.change === 'release' || Boolean(detectedVersion && detectedVersion !== plugin.version);
  const hasBreaking = classified.breaking.length > 0;
  const needsMigration = classified.migration.length > 0 || classified.configuration.length > 0;

  return {
    currentVersion: plugin.version || 'Unknown',
    detectedVersion,
    updateDetected,
    hasBreaking,
    needsMigration,
    classified,
    sourceStatus: watcherItem?.status || 'not-tracked',
    checkedAt: watcherItem?.checkedAt || null,
  };
}
