const BASELINE = {
  gta: {
    label: 'GTA V Legacy',
    recommended: '1.0.3788.0',
    aliases: ['3788', '1.0.3788.0', 'legacy 3788'],
  },
  rph: {
    label: 'RAGE Plugin Hook',
    recommended: '1.130.1406.17682',
    aliases: ['1.130.1406.17682', '1.130'],
  },
  lspdfr: {
    label: 'LSPDFR',
    recommended: '0.4.9 / 0.4.9572',
    aliases: ['0.4.9', '0.4.9572', '0.4.9572.22921'],
  },
};

const clean = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9.]+/g, ' ').trim();

function classifyVersion(field, value) {
  const baseline = BASELINE[field];
  const raw = String(value || '').trim();
  if (!raw) {
    return {
      field,
      label: baseline.label,
      state: 'missing',
      priority: 'medium',
      entered: 'Not provided',
      expected: baseline.recommended,
      message: `Enter the exact ${baseline.label} version so Doctor can rule out an environment mismatch.`,
      action: `Confirm ${baseline.label} before replacing plugins or configuration files.`,
    };
  }

  const normalized = clean(raw);
  const match = baseline.aliases.some((alias) => normalized.includes(clean(alias)));
  if (match) {
    return {
      field,
      label: baseline.label,
      state: 'matched',
      priority: 'low',
      entered: raw,
      expected: baseline.recommended,
      message: `Matches the current Sentinel Police Legacy 3788 baseline.`,
      action: 'Keep this version fixed while testing the reported failure.',
    };
  }

  return {
    field,
    label: baseline.label,
    state: 'mismatch',
    priority: 'high',
    entered: raw,
    expected: baseline.recommended,
    message: `Does not match the current verified Sentinel baseline.`,
    action: `Restore or verify ${baseline.label} ${baseline.recommended}, then reproduce the problem before changing another component.`,
  };
}

function detectEdition(environment) {
  const gta = clean(environment.gta);
  if (!gta) return null;
  if (gta.includes('enhanced')) {
    return {
      field: 'edition',
      label: 'Game edition',
      state: 'mismatch',
      priority: 'high',
      entered: environment.gta,
      expected: 'GTA V Legacy 1.0.3788.0',
      message: 'The current Sentinel Golden Build is Legacy-specific; Enhanced requires a separate compatibility branch.',
      action: 'Do not apply Legacy DLLs, gameconfig files, or ScriptHookV packages to an Enhanced installation.',
    };
  }
  return null;
}

export function validateDoctorEnvironment(environment = {}) {
  const checks = [
    classifyVersion('gta', environment.gta),
    classifyVersion('rph', environment.rph),
    classifyVersion('lspdfr', environment.lspdfr),
  ];
  const edition = detectEdition(environment);
  if (edition) checks.unshift(edition);

  const mismatches = checks.filter((item) => item.state === 'mismatch');
  const missing = checks.filter((item) => item.state === 'missing');
  const matched = checks.filter((item) => item.state === 'matched');
  const priority = mismatches.length ? 'high' : missing.length ? 'medium' : 'low';

  return {
    checks,
    mismatches,
    missing,
    matched,
    priority,
    ready: !mismatches.length && !missing.length,
    summary: mismatches.length
      ? `${mismatches.length} environment mismatch${mismatches.length === 1 ? '' : 'es'} should be corrected before plugin-level repair.`
      : missing.length
        ? `${missing.length} version field${missing.length === 1 ? '' : 's'} still need exact values.`
        : 'Environment matches the current verified Sentinel Police baseline.',
    repairOrder: [...mismatches, ...missing, ...matched].map((item) => item.action),
    baseline: BASELINE,
  };
}
