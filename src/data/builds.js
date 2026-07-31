export const buildStatus = {
  verified: {label: 'Verified', tone: 'green'},
  candidate: {label: 'Testing', tone: 'blue'},
  archived: {label: 'Archived', tone: 'gray'},
};

export const goldenBuilds = [
  {
    id: 'legacy-3889-july-2026', name: 'Sentinel Build v1.0 · Legacy 3889', release: 'July 30, 2026', status: 'verified', confidence: 100,
    summary: 'The completed and tested Project Sentinel reference build: Policing Redefined, NexusMDT FULL, Nexus Dispatch, NPCAI, ALPR Lite, EUP, ELS, VisualV, and Better Radiance.',
    versions: [['GTA V Legacy','1.0.3889.0'],['RAGE Plugin Hook','1.131.1411.17718'],['LSPDFR','0.4.9 · build 9695'],['ScriptHookV','3889-compatible official release'],['RAGENativeUI','1.9.3']],
    verified: ['Story Mode and LSPDFR duty launch','Damage Tracker Framework + Policing Redefined','NexusMDT FULL activation and records workflow','Nexus Dispatch voice integration','NPCAI conversation and microphone path','ALPR Lite realistic configuration','EUP + ELS','VisualV 1.0.630 + Better Radiance'],
    notes: ['Do not install Stop The Ped, Ultimate Backup, CompuLite, GrammarPolice, or Callout Interface beside this build','Keep Nexus Dispatch on F24 and NPCAI on F23','Back up the complete stable GTA folder before future changes','Add nothing unless it solves a real problem found during play'],
    guide: '/guide/builds/paid-sentinel-build',
  },
  {
    id: 'legacy-3788-july-2026', name: 'Legacy 3788 Golden Build', release: 'July 2026', status: 'archived', confidence: 100,
    summary: 'The historically verified Project Sentinel baseline. Preserved for reproducibility and rollback—not presented as the current game platform.',
    versions: [['GTA V Legacy','1.0.3788.0'],['RAGE Plugin Hook','1.130.1406.17682'],['LSPDFR','0.4.9 · 0.4.9572.22921'],['EUP Menu','2.3.0'],['Stop The Ped','4.9.5.4']],
    verified: ['OpenIV and ASI Loader','ScriptHookV','Heap Adjuster','Packfile Limit Adjuster','PNWParksFan GameConfig','LML','EUP Law & Order 8.3','EUP Serve & Rescue 1.5','Better Radiance','Ultimate Backup','CompuLite'],
    notes: ['Archived after the GTA 3889 title update','Use only when intentionally maintaining or restoring the historical build','Do not mix 3788 RPH/ScriptHook files into a 3889 installation'],
    guide: '/guide/optimization/golden-build',
  },
];
