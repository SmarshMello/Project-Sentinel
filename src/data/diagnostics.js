export const diagnosticRules = [
  {
    id: 'battleye',
    title: 'BattlEye is blocking the modded Story Mode launch',
    confidence: 'high',
    status: 'Sentinel Verified',
    keywords: ['battleye','battle eye','install battleye','gta5_be','be launcher'],
    logPatterns: [/battleye/i,/gta5_be/i],
    steps: [
      'Open Rockstar Games Launcher settings for GTA V Legacy and disable “Enable BattlEye anti-cheat for Grand Theft Auto Online.”',
      'Keep -nobattleye in the launcher arguments or commandline.txt, one argument per line.',
      'Completely close Rockstar Launcher and all GTA processes, then launch RAGEPluginHook.exe directly from the GTA V Legacy root folder.',
      'Do not install BattlEye for an LSPDFR session.'
    ],
    checks: ['Confirm GTA V Legacy is selected, not Enhanced.','Confirm RAGEPluginHook.exe is in the same folder as GTA5.exe.'],
    guide: '/guide/troubleshooting',
  },
  {
    id: 'rph-version',
    title: 'RAGE Plugin Hook or GTA version mismatch',
    confidence: 'high',
    status: 'Sentinel Verified',
    keywords: ['unsupported game version','version mismatch','rage plugin hook not supported','rph version','hook does not support'],
    logPatterns: [/unsupported game version/i,/not support(ed)? (this|the) game version/i,/game version.*not supported/i],
    steps: [
      'Check GTA5.exe Properties → Details and record the exact file version.',
      'Use the RAGE Plugin Hook build bundled with the LSPDFR release verified for that GTA Legacy version.',
      'Do not mix RPH files from older LSPDFR packages.',
      'Restore the last Golden Build backup if the game updated unexpectedly.'
    ],
    checks: ['Sentinel baseline: GTA V Legacy 1.0.3788.0.','Sentinel baseline RPH: 1.130.1406.17682.'],
    guide: '/guide/core/rage-plugin-hook',
  },
  {
    id: 'plugin-timeout',
    title: 'A plugin is timing out or blocking the game fiber',
    confidence: 'high',
    status: 'Sentinel Verified',
    keywords: ['plugin timeout','timed out','game fiber','plugin crashed','rage plugin hook crash'],
    logPatterns: [/plugin.*timed out/i,/fiber.*(abort|timeout|stuck)/i,/plugin.*exception/i],
    steps: [
      'Set RAGE Plugin Hook to load only LSPD First Response on startup.',
      'Add one police plugin at a time until the failure returns.',
      'Read the first exception in RagePluginHook.log, not only the final crash line.',
      'Update or remove the named plugin and retest from a clean launch.'
    ],
    checks: ['Never test several newly added plugins at once.','Keep a copy of the log immediately after the failed session.'],
    guide: '/guide/troubleshooting/plugin-attribute',
  },
  {
    id: 'ragenativeui',
    title: 'Duplicate or outdated RAGENativeUI dependency',
    confidence: 'high',
    status: 'Sentinel Verified',
    keywords: ['ragenativeui','eup crash','eup menu crashes','menu crash','type load exception','method not found'],
    logPatterns: [/ragenativeui/i,/method not found/i,/typeloadexception/i,/could not load file or assembly.*ragenativeui/i],
    steps: [
      'Download the newest official RAGENativeUI release from its GitHub page.',
      'Search the GTA V folder and plugins folders for duplicate RAGENativeUI.dll files.',
      'Keep one correct current copy and remove older copies bundled with plugins.',
      'Retest EUP Menu before loading other optional plugins.'
    ],
    checks: ['Sentinel uses EUP Menu 2.3.0.','Older bundled RAGENativeUI copies are a known EUP crash cause.'],
    guide: '/guide/uniforms/eup-menu-ragenativeui',
  },
  {
    id: 'missing-dependency',
    title: 'A required dependency or assembly is missing',
    confidence: 'high',
    status: 'Sentinel Verified',
    keywords: ['missing dependency','could not load file','assembly not found','file not found','dependency'],
    logPatterns: [/could not load file or assembly/i,/filenotfoundexception/i,/dependency.*missing/i,/assembly.*not found/i],
    steps: [
      'Identify the exact DLL named in the first error.',
      'Open the affected plugin page and verify every required dependency and version.',
      'Place dependencies in the location specified by the developer; do not scatter duplicate copies across folders.',
      'Restart RAGE Plugin Hook and check whether the assembly error is gone.'
    ],
    checks: ['Common dependencies include RAGENativeUI, LemonUI, and ScriptHookV.NET.'],
    guide: '/plugins',
  },
  {
    id: 'wrong-plugin-folder',
    title: 'Plugin is installed in the wrong folder or is not being loaded',
    confidence: 'medium',
    status: 'Sentinel Verified',
    keywords: ['plugin not loading','plugin does not load','not showing in console','doesnt work','does not work','not detected'],
    logPatterns: [/plugin.*not found/i,/failed to load plugin/i],
    steps: [
      'Confirm whether the plugin belongs in plugins\\LSPDFR or the GTA V root plugins folder.',
      'Open RAGE Plugin Hook settings and verify LSPD First Response loads on startup.',
      'Use the F4 console to load the plugin manually and read the exact response.',
      'Verify Windows did not block the downloaded DLL files.'
    ],
    checks: ['Most LSPDFR gameplay plugins belong in plugins\\LSPDFR.'],
    guide: '/guide/troubleshooting/plugin-attribute',
  },
  {
    id: 'gameconfig-packfiles',
    title: 'GameConfig or archive limits are being exceeded',
    confidence: 'high',
    status: 'Sentinel Verified',
    keywords: ['gameconfig','packfile','dlc pack','after adding vehicles','vehicle pack crash','err_fil_pack_1','out of game memory'],
    logPatterns: [/err_fil_pack/i,/out of game memory/i,/packfile/i,/gameconfig/i],
    steps: [
      'Verify GameConfig is installed at mods\\update\\update.rpf\\common\\data\\gameconfig.xml.',
      'Confirm Heap Adjuster and Packfile Limit Adjuster are in the GTA V root folder.',
      'Remove the most recently added DLC pack entry and retest.',
      'Avoid stacking limit-adjuster files from multiple mod packages.'
    ],
    checks: ['A Packfile Limit Adjuster does not replace a proper GameConfig.'],
    guide: '/guide/core/limits-gameconfig',
  },
  {
    id: 'keybind',
    title: 'A keybind conflict is preventing the feature from responding',
    confidence: 'medium',
    status: 'Sentinel Verified',
    keywords: ['keybind','key does nothing','button does nothing','menu wont open','menu will not open','f11','hotkey'],
    logPatterns: [/keybind/i,/key code/i],
    steps: [
      'Open the INI or XML settings for every plugin using the same key.',
      'Assign a unique key and save the file while the game is closed.',
      'Check Num Lock, controller mappings, and overlays that may intercept the input.',
      'Launch with only the affected plugin enabled and test again.'
    ],
    checks: ['Create a master keybind list for the Golden Build.'],
    guide: '/guide/optimization/keybinds',
  },
  {
    id: 'lml-eup',
    title: 'Lenny’s Mod Loader or EUP package is not loading correctly',
    confidence: 'medium',
    status: 'Sentinel Verified',
    keywords: ['uniform missing','eup missing','law and order missing','serve and rescue missing','lml','lennys mod loader'],
    logPatterns: [/lenny'?s mod loader/i,/eup/i,/law.*order/i,/serve.*rescue/i],
    steps: [
      'Confirm Lenny’s Mod Loader is installed and its manager recognizes the package.',
      'Verify the EUP package folder exists inside lml and is enabled.',
      'Confirm EUP Menu and the newest official RAGENativeUI are installed.',
      'Test a base EUP outfit before adding custom agency packs.'
    ],
    checks: ['Sentinel Police uses EUP Menu 2.3.0.'],
    guide: '/guide/uniforms/eup-law-order',
  },
  {
    id: 'performance',
    title: 'Plugin load, traffic, or visual mods are creating performance pressure',
    confidence: 'medium',
    status: 'Sentinel Guidance',
    keywords: ['lag','low fps','stutter','freezing','performance','frame drops','fps'],
    logPatterns: [/performance/i,/timeout/i,/slow/i],
    steps: [
      'Test Story Mode with no plugins, then LSPDFR only, then the Sentinel Police core stack.',
      'Disable heavy graphics and vegetation changes before removing essential police plugins.',
      'Reduce traffic, population, backup-unit, and callout spawn density.',
      'Check the log for repeated errors, because exception spam can cause severe stutter.'
    ],
    checks: ['Compare each test from the same location and weather.','Monitor CPU, GPU, VRAM, RAM, and storage activity.'],
    guide: '/guide/optimization/golden-build',
  },
  {
    id: 'generic-crash',
    title: 'Return to a known-good baseline and isolate the last change',
    confidence: 'medium',
    status: 'Sentinel Verified Method',
    keywords: ['crash','game closes','desktop','fatal error','stopped working'],
    logPatterns: [/fatal/i,/unhandled exception/i,/crash/i],
    steps: [
      'Back up RagePluginHook.log and lspdfr.log immediately after the crash.',
      'Remove or disable the most recently installed mod, plugin, vehicle, or configuration change.',
      'Load only LSPD First Response and verify a clean patrol starts.',
      'Re-enable components one at a time until the failure returns.'
    ],
    checks: ['The first error usually matters more than the final shutdown messages.'],
    guide: '/guide/troubleshooting',
  },
];

export const conflictRules = [
  {
    ids: ['policing-redefined','stop-the-ped'],
    title: 'Policing Redefined conflicts with Stop The Ped',
    detail: 'Policing Redefined is an alternative interaction stack and should not be combined with Stop The Ped.'
  },
  {
    ids: ['policing-redefined','ultimate-backup'],
    title: 'Policing Redefined conflicts with Ultimate Backup',
    detail: 'Choose one police framework stack instead of mixing their backup systems.'
  },
  {
    ids: ['policing-redefined','compulite'],
    title: 'Policing Redefined conflicts with CompuLite',
    detail: 'The database records mark this combination as incompatible.'
  },
];
