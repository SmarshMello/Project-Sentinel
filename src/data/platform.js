export const platformState = {
  current: {
    edition: 'GTA V Legacy',
    gameVersion: '1.0.3889.0',
    gameBuild: '3889',
    lspdfrVersion: '0.4.9',
    lspdfrBuild: '9695',
    rphVersion: '1.131.1411.17718',
    scriptHookV: '3889-compatible official release',
    battleye: 'Disabled for modded Story Mode',
    releaseDate: '2026-07-19',
    state: 'candidate',
    label: 'Legacy 3889 Candidate Build',
    note: 'Official core support is available. Sentinel validation of the full third-party stack is still in progress.',
  },
  archived: {
    edition: 'GTA V Legacy',
    gameVersion: '1.0.3788.0',
    gameBuild: '3788',
    lspdfrVersion: '0.4.9',
    lspdfrBuild: '9572.22921',
    rphVersion: '1.130.1406.17682',
    state: 'archived',
    label: 'Legacy 3788 Golden Build',
    note: 'Historically verified and reproducible, but no longer the current platform baseline.',
  },
  sources: {
    lspdfr: 'https://www.lcpdfr.com/downloads/gta5mods/g17media/7792-lspd-first-response/',
    compatibility: 'https://www.lcpdfr.com/wiki/gta5/modding-after-title-update/',
    ragenativeui: 'https://github.com/alexguirre/RAGENativeUI/releases',
  },
};

export const currentPlatformLabel = `Legacy ${platformState.current.gameBuild} · LSPDFR build ${platformState.current.lspdfrBuild}`;
