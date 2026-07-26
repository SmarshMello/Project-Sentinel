export const buildStatus = {
  verified: {label: 'Verified', tone: 'green'},
  candidate: {label: 'Testing', tone: 'blue'},
  archived: {label: 'Archived', tone: 'gray'},
};

export const goldenBuilds = [
  {
    id: 'legacy-3889-july-2026', name: 'Legacy 3889 Candidate Build', release: 'July 2026', status: 'candidate', confidence: 72,
    summary: 'The current official GTA V Legacy platform with LSPDFR build 9695, now documented around the modern Policing Redefined, Nexus and NPCAI Sentinel architecture.',
    versions: [['GTA V Legacy','1.0.3889.0'],['RAGE Plugin Hook','1.131.1411.17718'],['LSPDFR','0.4.9 · build 9695'],['ScriptHookV','3889-compatible official release'],['RAGENativeUI','1.9.3']],
    verified: ['Official LSPDFR/RPH compatibility for build 3889','BattlEye-disabled modded launch path','Damage Tracker Framework + Policing Redefined architecture','NexusMDT/Nexus Dispatch integration path','NPCAI 3.1 paid voice path','Free NexusMDT Lite + AIDispatch + NPCI alternative'],
    notes: ['Do not copy old RPH files over the build 9695 package','Install the full current ScriptHookV package when an ASI mod requires it','Retest shared libraries and police frameworks one at a time','Keep the 3788 build archived as a rollback reference'],
    guide: '/guide/builds/choose-your-build',
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
