export const buildStatus = {
  verified: {label: 'Verified', tone: 'green'},
  current: {label: 'Current', tone: 'blue'},
  archived: {label: 'Archived', tone: 'gray'},
};

export const goldenBuilds = [
  {
    id: 'legacy-3788-july-2026',
    name: 'Legacy 3788 Foundation',
    release: 'July 2026',
    status: 'current',
    confidence: 100,
    summary: 'The current Project Sentinel baseline for a stable GTA V Legacy LSPDFR installation.',
    versions: [
      ['GTA V Legacy', '1.0.3788.0'],
      ['RAGE Plugin Hook', '1.130.1406.17682'],
      ['LSPDFR', '0.4.9 · 0.4.9572.22921'],
      ['EUP Menu', '2.3.0'],
      ['Stop The Ped', '4.9.5.4'],
    ],
    verified: [
      'OpenIV and ASI Loader',
      'ScriptHookV',
      'Heap Adjuster',
      'Packfile Limit Adjuster',
      'PNWParksFan GameConfig',
      'LML',
      'EUP Law & Order 8.3',
      'EUP Serve & Rescue 1.5',
      'Better Radiance',
      'Ultimate Backup',
      'CompuLite',
    ],
    notes: [
      'Rockstar Launcher installation',
      'BattlEye disabled for modded Story Mode',
      'Use the newest official RAGENativeUI release',
      'Do not replace RAGENativeUI with older plugin-bundled copies',
    ],
    guide: '/guide/optimization/golden-build',
  },
];
