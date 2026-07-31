---
title: Sentinel Build v1.0 Keybinds
---

# Conflict-free keybind plan

The finished Sentinel build uses one key for each major role. The searchable version is available on the dedicated **[Keybinds page](/keybinds)**.

| Key | System | Action |
|---|---|---|
| F4 | RAGE Plugin Hook | Open console |
| F11 | EUP Menu | Open uniform menu |
| Q | NexusMDT FULL | Open/close MDT |
| F24 | Nexus Dispatch | Hold to speak to dispatch |
| F23 | NPCAI | Hold to speak with NPCs |
| Right Shift + L | NPCAI | Toggle visual context |
| F8 | ALPR Lite | Toggle plate reader |
| E | LSPDFR / Policing Redefined | Context interaction |
| B | Policing Redefined | Backup workflow |
| J | ELS | Siren-stage control |
| G | GTA V / ELS | Horn or secondary siren tone |

## Mouse-button setup

Map one mouse side button to **F24** for Nexus Dispatch and a different button to **F23** for NPCAI. This is more reliable than binding `XButton1` or `XButton2` directly in every RPH plugin.

## Files used to change controls

| System | File location |
|---|---|
| RAGE Plugin Hook | `GTA V Legacy\RagePluginHook.ini` |
| LSPDFR | `GTA V Legacy\lspdfr\keys.ini` |
| EUP Menu | `GTA V Legacy\Plugins\EUP\settings.ini` |
| NexusMDT | `GTA V Legacy\Plugins\LSPDFR\NexusMDT\NexusMDT.ini` |
| Nexus Dispatch | `GTA V Legacy\Plugins\LSPDFR\NexusDispatch\config\custom.ini` |
| NPCAI | `GTA V Legacy\Plugins\LSPDFR\NPCAI\GeminiAI.ini` |
| ALPR Lite | `GTA V Legacy\Plugins\LSPDFR\ALPRLite.ini` |
| Policing Redefined | `GTA V Legacy\Plugins\LSPDFR\PolicingRedefined\` |
| ELS | `GTA V Legacy\ELS.ini` |

:::warning Preserve the final layout
Do not assign F24 to NPCAI, Q to another tablet, F8 to Callout Interface, or B to Ultimate Backup. Stop The Ped, Ultimate Backup, CompuLite, GrammarPolice, and Callout Interface are not part of Sentinel Build v1.0.
:::
