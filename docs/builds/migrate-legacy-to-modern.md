---
title: Migrate from STP/UB/CompuLite
sidebar_position: 4
---

# Migrate the legacy Sentinel branch to the modern branch

This procedure prevents old systems from silently loading beside Policing Redefined.

## 1. Back up the working legacy build

Copy the complete GTA folder and label it with the game build and date. Keep the old INI files for reference, but do not copy them into the new branch automatically.

## 2. Quarantine legacy plugins

Create a folder outside GTA named `Sentinel Legacy Police Stack` and move the following plugin DLLs and their dedicated folders into it:

- Stop The Ped
- Ultimate Backup
- CompuLite
- GrammarPolice when Nexus Dispatch will replace it
- old Computer+/MDT plugins being replaced by NexusMDT

Do not delete personal citation, agency, or keybind files until the modern stack is verified.

## 3. Clean shared dependencies carefully

Do not delete RAGENativeUI or other shared DLLs merely because an old plugin used them. Compare which remaining plugins still require each library. Keep one current official copy in the documented shared location.

## 4. Reset conflicting keys

Remove or document old bindings such as:

- E for multiple pedestrian menus
- B for multiple backup menus
- N or NumPad0 for old computer/tablet systems
- GrammarPolice and Nexus Dispatch sharing PTT

## 5. Install and test the new stack in layers

Damage Tracker Framework → Policing Redefined → MDT → Dispatch → voice AI.

## 6. Prove there are no hidden old assemblies

Search `RagePluginHook.log` after going on duty. The loaded plugin list should not include the quarantined legacy DLLs.

## 7. Preserve the legacy guide

The old STP/UB/CompuLite documentation remains useful as an alternative community build, but it is no longer labeled as the personal Sentinel working stack.
