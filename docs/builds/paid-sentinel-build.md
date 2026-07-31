---
title: Sentinel Build v1.0
sidebar_position: 3
---

# Sentinel Build v1.0 — verified maximum-realism build

<span className="guide-kicker">COMPLETED JULY 30, 2026</span>

<p className="guide-lead">This is the finished Project Sentinel police-simulator build: a small, purpose-built stack centered on Policing Redefined, Nexus, natural NPCAI conversation, realistic ALPR, EUP, ELS, VisualV, and Better Radiance.</p>

<div className="guide-grid">
  <div className="guide-card"><span className="guide-card-badge paid">Verified build</span><h3>What this guide reproduces</h3><p>The exact architecture that passed launch, duty, MDT, dispatch, NPCAI, ALPR, EUP, ELS, and graphics testing.</p></div>
  <div className="guide-card"><span className="guide-card-badge">Build rule</span><h3>Stop when it works</h3><p>Every component has one job. Do not add overlapping police frameworks, duplicate computers, extra dispatch systems, or random callout packs.</p></div>
</div>

<div className="guide-path"><span>Core runtime</span><b>→</b><span>DTF + PR</span><b>→</b><span>Nexus MDT + Dispatch</span><b>→</b><span>NPCAI</span><b>→</b><span>EUP + ELS + ALPR</span><b>→</b><span>VisualV + Radiance</span></div>

## Final verified stack

| Layer | Selection | Purpose |
|---|---|---|
| Game | GTA V Legacy 1.0.3889.0 | Verified game platform |
| Runtime | RAGE Plugin Hook + LSPDFR 0.4.9 | Police runtime and duty system |
| File tools | OpenIV, ASI Loader, OpenIV.asi | Safe mods-folder installation |
| ASI support | ScriptHookV | ELS and ASI runtime support |
| Limits | Expanded GameConfig, Heap Adjuster, Packfile Limit Adjuster | Stable expanded archives and resources |
| UI dependency | Current RAGENativeUI | EUP and supported plugin interfaces |
| Police framework | Policing Redefined | Stops, interactions, backup, arrests, and police workflow |
| Framework dependency | Damage Tracker Framework | Shared damage/event dependency |
| MDT | NexusMDT FULL | Records, citations, reports, and patrol computer |
| Dispatch | Nexus Dispatch | Voice radio and PR-integrated dispatch actions |
| NPC conversation | NPCAI, Policing Redefined edition | Open-ended AI conversation with civilians and responders |
| Plate reader | ALPR Lite | Realistic mobile plate scanning |
| Uniforms | EUP Menu, Law & Order, Serve & Rescue | Uniforms and duty equipment |
| Emergency lighting | ELS | Emergency-light and siren control |
| Graphics | VisualV 1.0.630 | Weather, lighting, fog, and color improvements |
| Lighting | Better Radiance | Improved emergency and environmental light visibility |

:::danger Never mix the old police branch into this build
Do not install **Stop The Ped**, **Ultimate Backup**, **CompuLite**, or **GrammarPolice** beside this architecture. Do not add Callout Interface merely to force callouts. These systems duplicate responsibilities already owned by Policing Redefined, Nexus, or the base LSPDFR workflow.
:::

## Exact installation order

### 1. Establish the clean Legacy core

Install and test, in order:

1. OpenIV, ASI Loader, and OpenIV.asi.
2. ScriptHookV.
3. Expanded GameConfig.
4. Heap Adjuster.
5. Packfile Limit Adjuster.
6. RAGE Plugin Hook.
7. LSPDFR.
8. Current RAGENativeUI.

Pass Story Mode, RPH launch, station entry, On Duty, and the F4 console before continuing.

### 2. Install the modern police foundation

1. Damage Tracker Framework.
2. Policing Redefined.

Test a traffic stop, pedestrian interaction, arrest, backup request, and cleanup. Do not restore Stop The Ped or Ultimate Backup configuration files.

### 3. Install NexusMDT FULL

1. Extract the complete official entitlement package while preserving folders.
2. Use the HTML/WebView interface when supported.
3. Activate through the in-game **Settings → Activate** screen.
4. Confirm officer and department information appear.
5. Assign **Q** as the only MDT toggle.
6. Open the MDT, search a record, and complete one citation or report action.

### 4. Install Nexus Dispatch

1. Preserve the package's audio, scanner, and configuration folders.
2. Keep Policing Redefined selected as the backup/action handler.
3. Keep Nexus MDT integration enabled.
4. Put personal changes in `custom.ini` rather than editing the shipped default file.
5. Assign **F24** to Dispatch PTT. A mouse side button can be mapped to F24 in Logitech G Hub.
6. Test a status command such as going 10-8 and one backup request.

### 5. Install NPCAI

Use the NPCAI package specifically built for **Policing Redefined**. Restore all included .NET dependency files exactly as delivered.

Recommended controls:

```ini
PushToTalkKey=F23
EnableVisualContext=false
VisualContextToggleKey=L
VisualContextToggleModifier=RShift
AmbientSpeechEnabled=true
AmbientSpeechMinutes=3
```

Use F23 for NPCAI so it never competes with Nexus Dispatch on F24. Confirm microphone capture, officer mouth animation, and an NPC response.

### 6. Install uniforms, ELS, and ALPR

Install and test:

1. EUP Law & Order.
2. EUP Serve & Rescue.
3. EUP Menu.
4. ELS and its required root files/folder.
5. ALPR Lite.

Sentinel ALPR configuration:

```ini
ToggleKey=F8
ModifierKey=None
ALPRHitProbability=4
RegistrationIssueProbability=30
InsuranceIssueProbability=30
StolenVehicleProbability=8
OwnerWantedProbability=7
OwnerLicenseIssueProbability=25
SilencePeriodAfterHit=60000
BlipAlertedVehicle=no
```

### 7. Install the final graphics stack

1. Install the base `VisualV.oiv` to the OpenIV **mods folder**.
2. Skip VisualV's optional ENB, ReShade, motion-blur, and experimental extras for the verified baseline.
3. Replace `mods\update\update.rpf\common\data\visualsettings.dat` with Better Radiance's main file.
4. The optional taxi/bus/train brightness fix is unnecessary unless those signs are visibly too bright.

## Final keybind map

| Key | Action |
|---|---|
| F4 | RPH console |
| F11 | EUP Menu |
| Q | Nexus MDT |
| F24 | Nexus Dispatch PTT |
| F23 | NPCAI PTT |
| Right Shift + L | NPCAI visual context |
| F8 | ALPR Lite |
| E | Contextual LSPDFR/PR interaction |
| B | Policing Redefined backup workflow |
| J | ELS siren stage |
| G | Horn/secondary siren tone |

Use the searchable **[Keybinds page](/keybinds)** for descriptions and exact configuration-file locations.

## Final acceptance test

Run one uninterrupted patrol of at least 30 minutes and prove:

1. Story Mode and LSPDFR load normally.
2. You can go on duty and perform a traffic stop.
3. Policing Redefined interactions, backup, arrest, and cleanup work.
4. Nexus MDT opens with Q and completes a records action.
5. Nexus Dispatch hears F24 speech and performs a PR action.
6. NPCAI hears F23 speech, animates the officer, and returns a response.
7. ALPR toggles with F8 and produces realistic alerts.
8. EUP Menu opens with F11.
9. ELS emergency lights and sirens work.
10. VisualV and Better Radiance work in day, night, and rain.
11. No duplicate menus, competing PTT keys, or old-framework DLLs appear.

When all eleven pass, create a complete backup named **Sentinel Build v1.0 Stable**. Do not add another mod unless it solves a problem you have actually encountered during normal play.
