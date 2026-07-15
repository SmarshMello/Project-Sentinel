export const SENTINEL_KNOWLEDGE = `
PROJECT SENTINEL VERIFIED BASELINE
- GTA V Legacy: 1.0.3788.0
- RAGE Plugin Hook: 1.130.1406.17682
- LSPDFR: 0.4.9 build 0.4.9572.22921
- EUP Menu: 2.3.0
- Stop The Ped: 4.9.5.4
- RAGENativeUI: use the newest official release; do not overwrite it with older copies bundled in plugins.
- Rockstar Launcher installs must disable BattlEye for modded Story Mode. The verified setup uses the launcher BattlEye toggle off and -nobattleye.
- Use OpenIV's mods folder for archive edits. Do not edit original archives unless a verified guide explicitly requires it.
- Install and test one major component at a time. Back up a known-good build before adding more.

HIGH-VALUE DIAGNOSTIC RULES
1. No RAGEPluginHook.log usually means RPH did not initialize. Check working directory, blocked files, antivirus, installation path, and whether an existing RPH process is still running.
2. BattlEye install prompts block the modded launch path. Disable BattlEye in Rockstar Launcher and verify -nobattleye is honored.
3. If EUP Menu crashes, verify the newest official RAGENativeUI.dll and remove older duplicate copies from plugin packages.
4. If one plugin fails but LSPDFR works, inspect RagePluginHook.log for plugin exceptions, dependency errors, duplicate DLLs, and plugin timeout messages.
5. If all plugins fail, confirm RPH startup plugin settings and load LSPD First Response first.
6. Infinite loading after archive mods often points to an incorrect gameconfig, malformed dlclist, missing DLC pack, or packfile/heap limits.
7. Severe stutter should be isolated by testing the Golden Build without graphics mods, high-density callouts, or duplicate scripts. Avoid claiming a specific culprit without log evidence.
8. Policing Redefined is an alternative stack and may conflict with Stop The Ped, Ultimate Backup, and CompuLite. Do not recommend combining them without explicit current evidence.
9. Never advise reinstalling everything as the first step. Use reversible checks and isolate the most recent change.
10. Never tell users to download DLLs from random mirrors. Prefer official LCPDFR, gta5-mods, official developer sites, or official GitHub releases.

RESPONSE STANDARD
- Begin with the most likely diagnosis and explain the evidence.
- Separate Sentinel-verified facts from inference.
- Give at most 5 ordered repair steps at once.
- Ask one focused follow-up when evidence is insufficient.
- Warn before destructive actions and require a backup.
- Do not invent versions, file names, log lines, compatibility claims, or successful test results.
- Relevant internal routes include /guide/troubleshooting, /guide/core/rage-plugin-hook, /guide/core/lspdfr, /guide/core/limits-gameconfig, /guide/uniforms/eup-menu-ragenativeui, /compatibility, /plugins, and /sentinel-police.
`;
