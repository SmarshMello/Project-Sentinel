---
title: Paid Maximum-Realism Sentinel Build
sidebar_position: 3
---

# Paid Sentinel Build — the personal maximum-realism architecture

This branch documents the architecture developed through the actual Sentinel installation sessions. Its goal is natural police roleplay: speak to civilians, speak to dispatch, access a modern MDT, and avoid overlapping legacy menus.

## Final paid architecture

![Paid Sentinel architecture](/img/sentinel-build/paid-architecture.svg)

| Layer | Selected component | Sentinel role |
|---|---|---|
| Core | GTA V Legacy 3889, LSPDFR build 9695, current RPH | Supported game and police runtime |
| Police framework | Policing Redefined 1.0.0.5 | Stops, interactions, backup, and police state |
| Shared damage layer | Damage Tracker Framework 2.0.0 | Accurate damage events required by parts of the stack |
| Computer | NexusMDT FULL | Records, citations, reports, ALPR/radar, connected patrol workflow |
| Dispatch | Nexus Dispatch | Radio UI, call status, unit actions, and dispatch integration |
| Ped conversation | DoubleHook NPCAI 3.1 | Unscripted AI conversation with civilians and first responders |
| Optional recording | AxonSignal | Bodycam and dashcam roleplay |
| Presentation | EUP + Better Radiance + lore-friendly fleet | Uniform and visual identity |

:::danger Remove the old police branch first
Before installing this build, remove or quarantine Stop The Ped, Ultimate Backup, CompuLite, and GrammarPolice. Policing Redefined replaces the first three. Nexus Dispatch replaces the strict phrase-dispatch role in this paid architecture. Leaving old DLLs installed can produce double menus, duplicated backup, conflicting records handoffs, and keys that appear not to work.
:::

## Paid files and licensing

Paid files must be downloaded from the creator's official account, Patreon, entitlement dashboard, or Discord delivery system. Never copy a friend's DLL, use a re-upload, or publish the archive inside a modpack. Project Sentinel documents configuration but does not include protected files.

## Installation order

### Stage 1 — current clean foundation

Complete the core install and title-update guide first. Confirm GTA Legacy 3889, LSPDFR build 9695, and the matching RPH launch cleanly. Because Microsoft Defender has produced a known false-positive against RPH, use the official package and follow the official antivirus guidance rather than downloading replacement executables from mirrors.

### Stage 2 — Damage Tracker Framework

Install the framework using its documented split layout. In the Sentinel build, failures here previously caused Policing Redefined and NPCAI-related systems to load incorrectly. Test the framework before adding PR.

### Stage 3 — Policing Redefined

Install the complete main-directory and plugin content. Do not restore old STP/UB configuration files. Go on duty and test a stop, arrest, backup, and cleanup.

### Stage 4 — NexusMDT FULL

1. Download the current FULL entitlement package from the NexusMDT dashboard.
2. Extract the complete archive into the GTA root, preserving folders.
3. Confirm `UiMode=html` when using the modern WebView interface.
4. Confirm the config file is in the exact folder expected by the plugin.
5. Activate the entitlement through the in-game Settings app.
6. Confirm the officer/department information appears.
7. Set one MDT toggle key. In the personal build, Q and F7 were tested; choose one that does not conflict with PR or another UI.
8. Open the tablet outside and inside a vehicle if your settings allow it.

The personal build's MDT failed to appear until the plugin configuration and `Plugins.ini` placement were corrected. A successful entitlement status alone does not prove the overlay files are in the correct location.

### Stage 5 — Nexus Dispatch

Install the complete entitlement package and scanner/audio folders. Confirm its radio UI and settings menu load before adding NPCAI. Give dispatch its own push-to-talk key. Do not bind MDT toggle, dispatch PTT, and NPCAI PTT to the same physical key unless the tool intentionally supports a layered macro.

### Stage 6 — NPCAI 3.1

Download NPCAI from DoubleHook's official Patreon. Select the build intended for **Policing Redefined**, not the Stop The Ped edition.

The personal build used mouse software to map a Logitech side button to an unused function key such as F24. This is more reliable than expecting every RPH plugin to recognize `XButton2` directly.

Recommended starting configuration:

```ini
AmbientSpeechEnabled=true
AmbientSpeechMinutes=3
EnableVisualContext=false
VisualContextToggleKey=L
VisualContextToggleModifier=RShift
```

Keep visual context off during routine patrol to reduce API usage; enable it only when scene awareness is needed.

### Stage 7 — AxonSignal and presentation

Add AxonSignal only after voice, dispatch, and MDT pass. The personal build used `O` for bodycam recording. Adjust the dashcam overlay before adding further graphics mods.

### Stage 8 — lore-friendly fleet and graphics

Add vehicles in small batches and keep a list of every DLC pack added to `dlclist.xml`. Test game loading after each batch. Graphics and siren packs are last because they can create crashes that look unrelated to the police plugins.

## Paid-build acceptance test

Run one 30-minute patrol and prove:

1. PR traffic stop and pedestrian interaction work.
2. Nexus MDT opens, searches records, and accepts a citation.
3. Nexus Dispatch hears one command and executes the corresponding PR action.
4. NPCAI records voice, animates the officer's mouth, and returns an NPC response.
5. Backup and EMS spawn and clean up.
6. Bodycam/dashcam toggles do not block other controls.
7. No duplicate records or double menus appear.
8. The game can return to duty after a plugin reload or full restart.

Create a full backup immediately after this test passes.
