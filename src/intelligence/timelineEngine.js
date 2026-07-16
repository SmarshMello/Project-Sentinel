function asDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function event(id, type, title, detail, date = null, tone = 'neutral', meta = {}) {
  const parsed = asDate(date);
  return {
    id,
    type,
    title,
    detail,
    date: parsed ? parsed.toISOString() : null,
    tone,
    ...meta,
  };
}

function statusTone(status) {
  if (status === 'resolved') return 'positive';
  if (status === 'monitoring') return 'warning';
  return 'attention';
}

export function buildPluginTimeline(profile, doctorCases = []) {
  if (!profile) return [];
  const events = [];
  const watcher = profile.watcher;
  const release = profile.release;

  if (watcher?.checkedAt) {
    const sourceLabel = watcher.status === 'healthy'
      ? 'Watcher source healthy'
      : watcher.status === 'possible-update'
        ? 'Watcher detected a possible update'
        : `Watcher scan: ${String(watcher.status || 'unknown').replace(/-/g, ' ')}`;
    events.push(event(
      `watcher-${watcher.checkedAt}`,
      'watcher',
      sourceLabel,
      watcher.note || watcher.reviewReason || 'The latest source check was recorded.',
      watcher.checkedAt,
      watcher.status === 'healthy' ? 'positive' : watcher.status === 'possible-update' ? 'attention' : 'warning',
      {version: watcher.detectedVersion || null},
    ));
  }

  const releaseDate = watcher?.latestRelease?.publishedAt || watcher?.latestRelease?.published_at || watcher?.latestRelease?.date || watcher?.checkedAt;
  if (release?.updateDetected) {
    events.push(event(
      `release-${release.detectedVersion || releaseDate || 'detected'}`,
      'release',
      `${release.detectedVersion || 'New release'} detected`,
      release.hasBreaking
        ? 'Release notes contain a possible breaking-change signal.'
        : release.needsMigration
          ? 'The release may require configuration or migration work.'
          : 'A newer release signal is available for review.',
      releaseDate,
      release.hasBreaking ? 'critical' : release.needsMigration ? 'warning' : 'attention',
      {version: release.detectedVersion || null},
    ));
  }

  doctorCases
    .filter((item) => item.pluginId === profile.id)
    .forEach((item) => {
      const progress = Array.isArray(item.completedSteps) && Array.isArray(item.steps) && item.steps.length
        ? `${item.completedSteps.length}/${item.steps.length} repair steps complete. `
        : '';
      events.push(event(
        `doctor-${item.id}`,
        'doctor',
        `Doctor case ${item.status || 'open'}`,
        `${progress}${item.summary || item.recommendation || 'Intelligence case created.'}`,
        item.updatedAt || item.createdAt,
        statusTone(item.status),
        {caseId: item.id, status: item.status || 'open'},
      ));
    });

  if (profile.goldenBuild) {
    events.push(event(
      'golden-build',
      'build',
      'Included in the Sentinel Golden Build',
      `${profile.name} is currently marked as part of the verified working build.`,
      null,
      'positive',
      {version: profile.currentVersion},
    ));
  }

  events.push(event(
    'registry-baseline',
    'registry',
    `Registry baseline: ${profile.currentVersion}`,
    `${profile.registryStatus === 'verified' ? 'Sentinel Verified' : 'Registry status: ' + profile.registryStatus}. Confidence ${profile.confidence}%.`,
    null,
    profile.registryStatus === 'verified' ? 'positive' : 'neutral',
    {version: profile.currentVersion},
  ));

  return events.sort((a, b) => {
    if (a.date && b.date) return new Date(b.date) - new Date(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });
}

export function summarizeTimeline(events = []) {
  return {
    total: events.length,
    releases: events.filter((item) => item.type === 'release').length,
    watcher: events.filter((item) => item.type === 'watcher').length,
    doctor: events.filter((item) => item.type === 'doctor').length,
    build: events.filter((item) => item.type === 'build').length,
  };
}
