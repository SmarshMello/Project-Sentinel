---
title: Policing Redefined
---

# Policing Redefined 1.0.0.5

Policing Redefined is the central police-interaction framework in the modern Sentinel build. It is an architecture choice, not a small addon to the older BejoIjo stack.

[Open the official download page](https://www.lcpdfr.com/downloads/gta5mods/scripts/52191-policing-redefined/)

## Remove incompatible systems

Quarantine these before the first PR launch:

```text
plugins\LSPDFR\StopThePed.dll
plugins\LSPDFR\UltimateBackup.dll
plugins\LSPDFR\CompuLite.dll
```

Also remove their support folders only after backing up personal configuration. Do not leave DLLs present and assume changing the keybind disables their hooks.

## Dependencies

- GTA V Legacy supported build
- LSPDFR and RPH
- Damage Tracker Framework
- Current shared libraries included or required by the official package
- A compatible records backend such as NexusMDT or pdComp

## Installation

1. Read the archive README before copying anything.
2. Copy the package's main-directory content to the GTA root.
3. Copy the LSPDFR plugin content to `plugins\LSPDFR`.
4. Preserve folder names exactly.
5. Do not restore old PR INI files over a newer release until comparing every setting.
6. Launch PR alone before adding dispatch, MDT, or AI.

## First configuration

Start with default controls. Change only one key at a time after proving the menu opens. Maintain a keybind table containing the action, keyboard key, controller mapping, and mouse macro.

## Test sequence

1. Go on duty.
2. Stop one vehicle.
3. Approach the driver and open PR.
4. Request identification.
5. Order the driver out.
6. Frisk or search according to the stop.
7. Detain and release or arrest.
8. Request one backup unit.
9. End the stop.
10. Drive away and confirm the driver, vehicle, and backup are cleaned up.

## Troubleshooting

### Two interaction menus open

Stop The Ped or another interaction framework is still loaded. Search the RPH log's loaded-assembly list and remove the obsolete plugin.

### Backup menu does nothing

Confirm PR itself completed initialization. A dispatch or MDT plugin cannot repair a failed PR backend.

### Records do not transfer

Only one records handoff should be primary. Check NexusMDT/pdComp integration settings and disable unused citation handoffs.

### PR crashes immediately after loading

Look for the first dependency exception above the final crash. Damage Tracker Framework, shared JSON libraries, or package files may be missing. Do not diagnose the final generic LSPDFR crash as the root cause.

### Settings changed after an update

Version 1.0.0.5 included default-INI corrections. Compare the new defaults with the backed-up configuration rather than blindly restoring the old INI.
