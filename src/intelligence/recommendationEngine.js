export const RECOMMENDATIONS = {
  upgradeNow: {key: 'upgradeNow', label: 'Upgrade immediately', tone: 'upgradeNow'},
  recommended: {key: 'recommended', label: 'Recommended', tone: 'recommended'},
  optional: {key: 'optional', label: 'Optional', tone: 'optional'},
  wait: {key: 'wait', label: 'Wait for verification', tone: 'wait'},
  avoid: {key: 'avoid', label: 'Avoid', tone: 'avoid'},
  monitor: {key: 'monitor', label: 'Monitor', tone: 'monitor'},
};

function isSupportedCurrentInstall(plugin, risk) {
  return ['verified', 'community', 'documented'].includes(plugin.status) && risk.score <= 35;
}

export function recommendUpgrade(plugin, release, risk, watcherItem = null) {
  const reasons = [];
  let recommendation = RECOMMENDATIONS.monitor;

  if (plugin.status === 'deprecated' || plugin.status === 'conflict' || release.hasBreaking || risk.score >= 86) {
    recommendation = RECOMMENDATIONS.avoid;
    reasons.push('The current evidence indicates a breaking, deprecated, or conflicting release state.');
  } else if (watcherItem?.needsReview || risk.score >= 61 || release.needsMigration) {
    recommendation = RECOMMENDATIONS.wait;
    reasons.push('Manual compatibility review is required before changing the Golden Build.');
  } else if (release.updateDetected && plugin.goldenBuild && risk.score <= 25) {
    recommendation = RECOMMENDATIONS.upgradeNow;
    reasons.push('Watcher found an update and the available compatibility signals are strong.');
  } else if (release.updateDetected && risk.score <= 45) {
    recommendation = RECOMMENDATIONS.recommended;
    reasons.push('An update is available with no major risk signal detected.');
  } else if (release.updateDetected) {
    recommendation = RECOMMENDATIONS.optional;
    reasons.push('An update may be available, but it is not required by the current build.');
  } else if (watcherItem?.status === 'healthy') {
    recommendation = RECOMMENDATIONS.monitor;
    reasons.push('No change is required; the latest source check is healthy.');
  } else if (isSupportedCurrentInstall(plugin, risk)) {
    recommendation = RECOMMENDATIONS.monitor;
    reasons.push(
      plugin.status === 'verified'
        ? 'No change is required; the current version is verified in the Sentinel registry.'
        : 'No change is required; current registry evidence supports keeping the installed version.'
    );
  } else {
    recommendation = RECOMMENDATIONS.wait;
    reasons.push('Source evidence is incomplete, so verify the release before changing the current build.');
  }

  return {...recommendation, reasons};
}
