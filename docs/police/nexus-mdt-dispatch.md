---
title: NexusMDT and Nexus Dispatch
---

# NexusMDT Lite/FULL and Nexus Dispatch

NexusMDT supplies the records/computer workflow. Nexus Dispatch supplies the radio and dispatch workflow. They are related but should be tested independently.

- [NexusMDT Lite official download](https://www.nexusmdt.com/lite)
- [NexusMDT public LCPDFR listing](https://www.lcpdfr.com/downloads/gta5mods/scripts/54363-nexusmdt-lite/)

## Choose Lite or FULL

**Lite** is the free community build and includes a modern MDT, records, ALPR/radar features, reports, and PR/NPCI integrations depending on release.

**FULL** requires the user's own entitlement. Download it from the official dashboard while signed into the account that owns access. Never install Lite over FULL or FULL over Lite without first reading the migration instructions.

## Clean installation

1. Back up any Nexus configuration and records.
2. Remove an abandoned partial installation.
3. Extract the complete selected package into the GTA root.
4. Verify the expected folder exists under `plugins\LSPDFR`.
5. Verify WebView/UI assets were copied, not only the plugin DLL.
6. Launch once and check the log before activating optional integrations.

## HTML interface configuration

The personal build used:

```ini
[General]
UiMode=html

[Keys]
ToggleKey=Q
```

F7 was also tested as a conflict-free alternative. Use one key only. After changing the INI, run `ReloadPlugins` or restart RPH as directed by the file comments.

## FULL activation

1. Open the MDT.
2. Open the in-game Settings app.
3. Select Activate or recheck entitlement.
4. Wait for FULL status.
5. Confirm department and officer data display.

Activation proves the account is recognized; it does not prove the local UI files are complete.

## When the tablet does not open

Check in this order:

1. Does the RPH log say NexusMDT initialized?
2. Is the correct config file being read?
3. Is `UiMode=html` supported on the machine?
4. Are WebView2 and UI assets present?
5. Is `MDTOnlyInVehicle` or a similar restriction enabled?
6. Does the chosen key conflict with PR, another tablet, or a game control?
7. Is an old CompuLite/Computer+ plugin still intercepting the key?

## Nexus Dispatch setup

Install the complete package including audio and textures. Confirm the log identifies the plugin, audio path, texture path, callsign, and PTT listener.

Use separate controls for:

- radio UI open/close
- push-to-talk
- status changes
- MDT toggle
- NPCAI talk key

## Integration test

1. Put yourself available for calls.
2. Open the radio UI.
3. Perform one manual status change.
4. Speak one dispatch command.
5. Confirm the transcript/recognition event.
6. Confirm PR executes the requested action.
7. Open NexusMDT and confirm the event/record handoff.

## Common failures

### Radio hears speech but nothing happens

Recognition succeeded. Inspect the PR action bridge, selected command, and supported PR version.

### Scanner audio missing

The audio folder was not copied or the configured path points to an older GrammarPolice audio directory.

### PTT key never registers

Map the mouse button to an unused keyboard key such as F24 in Logitech G Hub, then configure the plugin to use that key. This bypasses plugins that do not understand mouse side-button names.

### MDT freezes or overloads during NPCAI use

Update to a release containing NPCAI optimizations, reduce optional live integrations, and test MDT and NPCAI separately before combining them.
