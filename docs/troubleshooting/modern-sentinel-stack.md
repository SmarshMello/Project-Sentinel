---
title: Modern Sentinel Stack Troubleshooting
---

# Modern Sentinel troubleshooting matrix

Use the first failing subsystem rather than the final crash message.

| Symptom | Most likely layer | First evidence to inspect |
|---|---|---|
| RPH closes at “Verifying Hook” | RPH/antivirus/title update | Official RPH version, Defender history, GTA build |
| PR never appears | Framework/dependency | First PR or Damage Tracker exception in RPH log |
| Two interaction menus | Architecture conflict | Loaded StopThePed/PR assemblies |
| MDT entitlement says FULL but tablet is absent | Local MDT UI/config | Config path, `UiMode`, WebView/UI assets |
| Dispatch transcribes but sends no unit | PR bridge/version | Dispatch action result after transcript |
| NPCAI mouth never moves | PTT/input | Key event and microphone capture |
| NPCAI mouth moves but no answer | API/dependencies | Provider response, quota, JSON assemblies |
| Crash immediately when pressing voice key | Missing assembly | First `FileNotFoundException` above LSPDFR crash |
| Backup/EMS pile up | GTA traffic/pathing | Scene location and AI path, not necessarily plugin crash |
| Game works after renaming `mods` | OpenIV/add-on content | Recent DLC packs, `dlclist.xml`, GameConfig |

## Clean isolation order

1. GTA Story Mode without RPH.
2. RPH without LSPDFR autoload.
3. LSPDFR only.
4. Damage Tracker Framework.
5. Policing Redefined.
6. MDT.
7. Dispatch.
8. NPCAI/NPCI.
9. EUP and visual files.
10. Vehicles, sirens, callouts, and graphics.

## Files to collect for support

- Current GTA-root `RagePluginHook.log`
- Plugin-specific log such as NPCAI, NexusMDT, or NexusDispatch log
- Exact GTA, RPH, and LSPDFR versions
- Screenshot of the GTA root and affected plugin folder
- The last mod installed before the failure
- Whether the clean isolation stage passes

Redact API keys, entitlement tokens, email addresses, and Windows user names.
