import {plugins, pluginCategories, statusMeta} from './plugins';

const statusToCompatibility = {
  verified: 'verified',
  community: 'compatible',
  documented: 'compatible',
  testing: 'testing',
  conflict: 'conflict',
  legacy: 'legacy',
  research: 'research',
  deprecated: 'deprecated',
};

const legacyState = {
  verified: 'Yes',
  community: 'Likely',
  documented: 'Unknown',
  testing: 'Testing',
  conflict: 'Conditional',
  legacy: 'Unconfirmed',
  research: 'Unknown',
  deprecated: 'No',
};

export const registry = plugins.map((plugin) => ({
  ...plugin,
  compatibilityStatus: statusToCompatibility[plugin.status] || 'compatible',
  legacy3788: legacyState[plugin.status] || 'Unknown',
  goldenBuild: Boolean(plugin.sentinelPolice && plugin.status === 'verified'),
  profile: `/plugins/${plugin.id}`,
  watcherTracked: false,
}));

export const registryById = new Map(registry.map((plugin) => [plugin.id, plugin]));
export const registryByName = new Map(registry.map((plugin) => [plugin.name.toLowerCase(), plugin]));
export const registryCategories = pluginCategories;
export {statusMeta};

export function mergeWatcherReport(report) {
  const liveById = new Map((report?.items || []).map((item) => [item.id, item]));
  return registry.map((plugin) => {
    const live = liveById.get(plugin.id);
    return {
      ...plugin,
      watcherTracked: Boolean(live),
      watcher: live || null,
    };
  });
}

export function resolveDependency(name) {
  const normalized = String(name || '').toLowerCase().trim();
  return registry.find((plugin) =>
    plugin.name.toLowerCase() === normalized ||
    plugin.shortName?.toLowerCase() === normalized ||
    plugin.tags?.some((tag) => tag.toLowerCase() === normalized)
  ) || null;
}
