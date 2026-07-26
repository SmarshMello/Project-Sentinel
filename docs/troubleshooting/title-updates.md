---
title: GTA title updates and the Legacy 3889 transition
---

# GTA V Legacy 3889 update guide

Rockstar updated GTA V Legacy to **1.0.3889.0**. The public **LSPDFR 0.4.9 build 9695** package and its bundled RAGE Plugin Hook support this game build. ScriptHookV also has a 3889-compatible official release. BattlEye must remain disabled for the modded single-player launch path.

## Preserve the old build

The Legacy 3788 Golden Build remains a historically verified rollback reference. Do not mix its RPH, ScriptHookV, GameConfig, or dependency files into a 3889 installation.

## Safe migration order

1. Back up the entire working GTA directory and current logs.
2. Confirm `GTA5.exe` reports version `1.0.3889.0`.
3. Install the complete public LSPDFR build 9695 package, including its bundled RPH files.
4. Disable BattlEye for the modded Story Mode launch path.
5. Install the current official ScriptHookV package only when an ASI mod requires it.
6. Launch with only LSPDFR and go on duty.
7. Validate arrest, traffic stop, pursuit, backup, and callout cleanup.
8. Restore shared dependencies one at a time.
9. Choose one police-framework architecture before restoring police plugins.
10. Add MDT, dispatch, voice AI, callouts, vehicles, and graphics last.

## Architecture warning

Do not combine the Stop The Ped/Ultimate Backup/CompuLite stack with Policing Redefined. Choose one architecture and use a compatible records/dispatch backend.

## When a plugin fails after the update

Read the **first meaningful exception**, not only the final crash line. Check whether the failure belongs to RPH, ScriptHookV, ScriptHookVDotNet, a shared assembly, a plugin loading scope, or an OpenIV `mods`-folder package. Test one controlled change at a time.

## Candidate-build status

Official core compatibility is available, but Project Sentinel does not mark the entire 3889 third-party stack verified until the complete regression and extended-patrol checklist passes.
