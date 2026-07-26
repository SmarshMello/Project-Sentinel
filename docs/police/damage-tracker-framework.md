---
title: Damage Tracker Framework
---

# Damage Tracker Framework 2.0.0

Damage Tracker Framework is not a visible police menu. It provides accurate ped and player damage events to other plugins. A user may think it “does nothing,” but dependent plugins can fail or behave incorrectly when it is missing or placed in the wrong loading scope.

[Open the official LCPDFR listing](https://www.lcpdfr.com/downloads/gta5mods/scripts/)

## Before installation

- Confirm the selected plugin actually requires the framework.
- Remove obsolete copies from unexpected folders.
- Back up the GTA root and `plugins` folder.
- Do not rename framework DLLs.

## Installation layout

Follow the current archive documentation. The modern framework package has used a split layout in which the low-level library belongs in the GTA root and the RPH framework plugin belongs in the root `plugins` directory.

```text
Grand Theft Auto V\
├── GTA5.exe
├── DamageTrackerLib.dll          ← low-level library when included by the official package
└── plugins\
    └── DamageTrackerFramework.dll ← standalone RPH framework plugin
```

Do not put the framework DLL in `plugins\LSPDFR` unless the current author documentation specifically changes the layout.

## Loading test

1. Start RAGE Plugin Hook.
2. Open F4.
3. Load the framework if it is not configured to load automatically.
4. Search `RagePluginHook.log` for the framework name.
5. Confirm no `FileNotFoundException`, `BadImageFormatException`, or missing dependency appears.

## Common failures

### Policing Redefined says a damage library is missing

The package is incomplete or files are in the wrong scopes. Reinstall the complete framework archive rather than downloading one DLL from a random mirror.

### “No suitable entry point”

The framework may be loaded as the wrong plugin type. Check whether it belongs in root `plugins` rather than `plugins\LSPDFR`.

### Duplicate assembly or type-load errors

Search the GTA root, `plugins`, and `plugins\LSPDFR` for duplicate framework copies. Keep only the locations documented by the current package.

### The framework loads, but a dependent plugin still fails

The dependent plugin may require a specific framework version or its own main-directory files. Confirm the complete dependency chain instead of repeatedly reinstalling RPH.

## Test gate

Damage Tracker Framework passes when it loads without an exception and Policing Redefined can complete an interaction involving damage, arrest, or medical response without producing framework errors.
