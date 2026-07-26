---
title: Keybind Plan
---

# Modern Sentinel keybind plan

Controls should be assigned by role. Never reuse a held push-to-talk key for a toggle action.

| Role | Suggested key | Notes |
|---|---|---|
| RPH console | F4 | Core runtime console |
| EUP Menu | F11 | Existing Sentinel binding |
| NexusMDT | Q or F7 | Pick one; Q was restored in the personal build |
| Nexus Dispatch PTT | Unused function key | Keep separate from NPCAI |
| NPCAI PTT | F24 via mouse software | Reliable Logitech side-button workaround |
| NPCAI visual context | Right Shift + L | Toggle only when scene context is needed |
| Axon bodycam | O | Personal-build example |
| Callout Interface | F8 | Only when installed |
| Force callout | Left Control + F9 | Only when installed |

## Mouse-button method

Many RPH plugins do not reliably recognize `XButton1` or `XButton2`. In Logitech G Hub, map the desired physical side button to F24, then bind F24 inside the plugin INI.

## Conflict checklist

- One MDT/tablet toggle
- One dispatch PTT
- One NPC voice PTT
- No old Stop The Ped E-menu left active
- No Ultimate Backup B-menu beside PR
- No CompuLite N/NumPad tablet beside NexusMDT
- Discord PTT does not consume the same key
