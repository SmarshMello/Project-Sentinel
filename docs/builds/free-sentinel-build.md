---
title: Free Sentinel Build
sidebar_position: 2
---

# Free Sentinel Build — complete first-time installation

This route provides a modern police framework, MDT, voice dispatch, voice pedestrian interaction, uniforms, and visual improvements without requiring a paid mod membership.

## Final free stack

| Layer | Selection | Why it is here |
|---|---|---|
| Game | GTA V Legacy 3889 | Current supported Legacy platform documented by LSPDFR |
| Core | LSPDFR 0.4.9 build 9695 + bundled/current RPH | Police framework and plugin runtime |
| File tools | OpenIV + ASI Loader + OpenIV.asi | Safe `mods`-folder edits |
| ASI runtime | Current ScriptHookV | Required by ELS and many non-RPH mods |
| Limits | GameConfig + Heap Adjuster + Packfile Limit Adjuster | Required before large vehicle/EUP builds |
| Police framework | Policing Redefined 1.0.0.5 | Modern interaction and backup architecture |
| Damage API | Damage Tracker Framework 2.0.0 | Dependency used by the modern stack |
| MDT | NexusMDT Lite 0.3.1 | Free records, radar, reports, ALPR, and UI |
| Dispatch | AIDispatch 1.0 | Natural-language dispatch for Policing Redefined |
| Ped voice | NPCI 2.1 PR edition | Free phrase-based pedestrian voice control |
| Uniforms | EUP Menu, Law & Order, Serve & Rescue | Agency uniforms and duty equipment |
| Lighting | Better Radiance | Improved emergency-light visibility |

:::info Free voice is not the same as paid NPCAI
NPCI 2.1 recognizes configured phrases through Windows Speech Recognition or Microsoft Speech Platform. Paid NPCAI 3.1 uses cloud AI for more open-ended conversation. The free route is still highly immersive, but the player must use phrases defined by the plugin.
:::

## Phase 0 — prepare Windows and GTA

1. Install GTA V **Legacy** and launch Story Mode once without mods.
2. In the Rockstar launcher, disable BattlEye for the modded launch path.
3. Find the folder containing `GTA5.exe`. This is the only folder called the **GTA root** in this guide.
4. Copy the entire clean folder to a backup drive or create a compressed archive.
5. Disable automatic cloud synchronization for the game directory. OneDrive should not manage the GTA root.
6. Create a text file named `SENTINEL_BUILD_NOTES.txt` and record the game build, date, and every mod added.

## Phase 1 — install the core runtime

Follow these guides in order:

1. [OpenIV and the mods folder](/guide/core/openiv)
2. [ScriptHookV](/guide/core/scripthookv)
3. [GameConfig and limit adjusters](/guide/core/limits-gameconfig)
4. [RAGE Plugin Hook](/guide/core/rage-plugin-hook)
5. [LSPDFR](/guide/core/lspdfr)

### Core test gate

Do not continue until all of these pass:

- `RAGEPluginHook.exe` reaches the game.
- Police-station blips appear.
- You can enter a station and go on duty.
- F4 opens the RPH console.
- `RagePluginHook.log` is created in the GTA root.
- No third-party police plugin is loaded yet.

Create a backup named `01_CORE_LSPDFR_WORKING`.

## Phase 2 — install Policing Redefined and Damage Tracker Framework

Read both detailed guides first:

- [Damage Tracker Framework](/guide/police/damage-tracker-framework)
- [Policing Redefined](/guide/police/policing-redefined)

Remove Stop The Ped, Ultimate Backup, and CompuLite before loading PR. Do not merely disable their menu keys; remove their DLLs from the active plugin folders.

### Police-framework test gate

- Go on duty.
- Start a traffic stop.
- Open the Policing Redefined interaction menu.
- Ask for identification.
- Frisk, detain, and release or arrest one test pedestrian.
- Request one normal backup unit.
- End the stop and confirm every spawned entity cleans up.

Create `02_POLICING_REDEFINED_WORKING`.

## Phase 3 — install NexusMDT Lite

Download the free build from the official NexusMDT page. Preserve the archive's folder structure.

[Download NexusMDT Lite](https://www.nexusmdt.com/lite)

The public Lite page currently identifies version 0.3.1. Always install the newest version that explicitly supports your PR/LSPDFR setup.

### MDT test gate

1. Open the MDT using the configured toggle key.
2. Search a pedestrian and a vehicle.
3. Create a citation or arrest record.
4. Test ALPR or radar only after the records screen works.
5. Close and reopen the UI several times.
6. Restart the game and confirm records/settings persist.

Create `03_MDT_WORKING`.

## Phase 4 — free voice dispatch with AIDispatch

AIDispatch is designed for the Policing Redefined branch and requires a Google Gemini API key and working microphone.

1. Install the **complete** package, not only its DLL.
2. Put the API key only in the documented config field.
3. Select the correct Windows recording device.
4. Pick a push-to-talk key that is not used by MDT, PR, Discord, or your mouse software.
5. Test a simple status update before requesting backup.
6. Test speech recognition and action execution separately.

If the transcript appears but no unit is dispatched, the microphone is working; inspect the PR backend/version instead.

## Phase 5 — free pedestrian voice with NPCI 2.1

[Download NPCI from LCPDFR](https://www.lcpdfr.com/downloads/gta5mods/scripts/50691-npci/)

Choose the **PR edition**, not the STP edition. NPCI 2.1 requires Microsoft Speech Platform even when Windows Speech Recognition is selected. Install the runtime and the correct English recognition package described by the author.

### NPCI test gate

- Mark or select a pedestrian as required by the plugin.
- Hold the voice key for the entire phrase.
- Use one exact phrase from the included XML.
- Confirm the mouth/interaction indicator appears.
- Confirm a response appears.
- Test one pedestrian action, such as waiting by the patrol vehicle.

## Phase 6 — uniforms, lighting, and vehicles

Install EUP and Better Radiance only after the police/voice stack passes. Add vehicles last, in small groups. Prefer lore-friendly packs to reduce texture memory and branding inconsistency.

### Final free-build acceptance test

Complete one 20-minute patrol containing:

- one normal traffic stop
- one pedestrian interaction
- one backup request
- one citation or arrest record
- one voice-dispatch command
- one voice pedestrian command
- one game save/restart

Do not add graphics overhauls until this test passes twice.
