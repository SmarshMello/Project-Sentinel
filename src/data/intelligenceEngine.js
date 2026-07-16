import {registry} from './registry';

export const RISK_LEVELS = {
  safe: {label: 'Safe', score: 0, tone: 'safe'},
  likelySafe: {label: 'Likely safe', score: 25, tone: 'likelySafe'},
  unknown: {label: 'Unknown', score: 50, tone: 'unknown'},
  highRisk: {label: 'High risk', score: 75, tone: 'highRisk'},
  breaking: {label: 'Breaking', score: 100, tone: 'breaking'},
};

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function dependencyMatches(dependency, plugin) {
  const target = normalize(dependency);
  return [plugin.name, plugin.shortName, plugin.id, ...(plugin.tags || [])]
    .filter(Boolean)
    .some((value) => normalize(value) === target);
}

export function buildKnowledgeGraph(entries = registry) {
  const nodes = entries.map((plugin) => ({
    id: plugin.id,
    type: 'plugin',
    label: plugin.name,
    category: plugin.category,
    status: plugin.status,
    version: plugin.version,
  }));

  const edges = [];
  entries.forEach((plugin) => {
    (plugin.dependencies || []).forEach((dependency) => {
      const match = entries.find((candidate) => dependencyMatches(dependency, candidate));
      edges.push({
        id: `${plugin.id}:depends-on:${match?.id || normalize(dependency).replace(/[^a-z0-9]+/g, '-')}`,
        source: plugin.id,
        target: match?.id || null,
        targetLabel: match?.name || dependency,
        relation: 'depends-on',
        resolved: Boolean(match),
      });
    });
  });

  return {nodes, edges};
}

export function predictCompatibility(plugin, watcherItem = null) {
  const confidence = Number(plugin.confidence || 0);
  const unresolvedDependencies = (plugin.dependencies || []).filter(
    (dependency) => !registry.some((candidate) => dependencyMatches(dependency, candidate))
  );
  let score = 50;
  const reasons = [];

  if (plugin.status === 'verified') {
    score -= 35;
    reasons.push('Verified in the current Sentinel registry.');
  } else if (plugin.status === 'community' || plugin.status === 'documented') {
    score -= 15;
    reasons.push('Supported by community or documented evidence.');
  } else if (plugin.status === 'conflict' || plugin.status === 'deprecated') {
    score += 35;
    reasons.push('Registry status identifies a conflict or deprecated project.');
  }

  if (confidence >= 95) score -= 10;
  else if (confidence < 60) score += 15;

  if (unresolvedDependencies.length) {
    score += Math.min(20, unresolvedDependencies.length * 5);
    reasons.push(`${unresolvedDependencies.length} dependency reference${unresolvedDependencies.length === 1 ? '' : 's'} still need registry resolution.`);
  }

  if (watcherItem?.status === 'possible-update' || watcherItem?.intelligence?.riskLevel === 'high') {
    score += 25;
    reasons.push('Watcher found a release or high-risk change requiring review.');
  } else if (watcherItem?.status === 'healthy') {
    score -= 10;
    reasons.push('Latest Watcher scan reports a healthy source.');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const key = score <= 15 ? 'safe' : score <= 35 ? 'likelySafe' : score <= 60 ? 'unknown' : score <= 85 ? 'highRisk' : 'breaking';
  return {...RISK_LEVELS[key], key, score, reasons, unresolvedDependencies};
}

export function createPluginDNA(plugin, graph = buildKnowledgeGraph(), watcherItem = null) {
  const outgoing = graph.edges.filter((edge) => edge.source === plugin.id);
  const incoming = graph.edges.filter((edge) => edge.target === plugin.id);
  const prediction = predictCompatibility(plugin, watcherItem);
  return {
    id: plugin.id,
    name: plugin.name,
    developer: plugin.developer || 'Unknown',
    currentVersion: plugin.version || 'Unknown',
    category: plugin.category,
    registryStatus: plugin.status,
    confidence: Number(plugin.confidence || 0),
    goldenBuild: Boolean(plugin.goldenBuild),
    sentinelPolice: Boolean(plugin.sentinelPolice),
    dependencies: outgoing,
    usedBy: incoming.map((edge) => graph.nodes.find((node) => node.id === edge.source)).filter(Boolean),
    risk: prediction,
    profile: plugin.profile,
    guide: plugin.guide,
  };
}

export function buildIntelligenceSnapshot(watcherReport = null, entries = registry) {
  const graph = buildKnowledgeGraph(entries);
  const watcherById = new Map((watcherReport?.items || []).map((item) => [item.id, item]));
  const profiles = entries.map((plugin) => createPluginDNA(plugin, graph, watcherById.get(plugin.id)));
  const riskCounts = profiles.reduce((counts, profile) => {
    counts[profile.risk.key] = (counts[profile.risk.key] || 0) + 1;
    return counts;
  }, {});
  return {
    generatedAt: new Date().toISOString(),
    graph,
    profiles,
    metrics: {
      plugins: profiles.length,
      relationships: graph.edges.length,
      resolvedRelationships: graph.edges.filter((edge) => edge.resolved).length,
      unresolvedRelationships: graph.edges.filter((edge) => !edge.resolved).length,
      goldenBuildPlugins: profiles.filter((profile) => profile.goldenBuild).length,
      watcherConnected: watcherById.size,
      riskCounts,
    },
  };
}
