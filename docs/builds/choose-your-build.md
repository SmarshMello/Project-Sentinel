---
title: Choose the Free or Paid Sentinel Build
sidebar_position: 1
---

# Choose the correct Sentinel architecture before installing anything

Project Sentinel now supports two carefully separated routes. Both begin with the same clean GTA V Legacy foundation, but the police, computer, dispatch, and voice layers are different.

![Sentinel build paths](/img/sentinel-build/build-paths.svg)

:::danger Do not mix the two police frameworks
The modern Sentinel route uses **Policing Redefined**. Do not leave **Stop The Ped**, **Ultimate Backup**, or **CompuLite** enabled beside it. They overlap in pedestrian handling, backup, records, menus, and arrest workflows. Mixing them can create duplicate menus, broken handoffs, unstable traffic stops, and misleading crash logs.
:::

## Free Community Build

Best for a first-time installer who wants the complete police-simulator experience without paid memberships.

- LSPDFR and RAGE Plugin Hook
- OpenIV, ScriptHookV, GameConfig, Heap Adjuster, and Packfile Limit Adjuster
- Policing Redefined
- Damage Tracker Framework
- NexusMDT Lite
- pdComp as an optional alternative records computer—not at the same time as NexusMDT unless the authors explicitly support that combination
- AIDispatch 1.0 for natural voice dispatch through Google Gemini
- Free NPCI 2.1 for phrase-based voice interaction with pedestrians
- EUP, Better Radiance, and carefully selected lore-friendly vehicles

[Start the free build →](./free-sentinel-build)

## Paid Maximum-Realism Build

This reproduces the direction used in the personal Sentinel installation. It prioritizes natural speech, connected records, immersive dispatch, and minimal menu dependence.

- Everything in the clean core foundation
- Policing Redefined
- Damage Tracker Framework
- NexusMDT FULL entitlement build
- Nexus Dispatch entitlement build
- DoubleHook NPCAI 3.1 for Gemini/Groq-powered unscripted NPC conversations
- Optional AxonSignal bodycam/dashcam system
- EUP, Better Radiance, and lore-friendly vehicles

[Start the paid build →](./paid-sentinel-build)

## What “free” and “paid” mean

Project Sentinel does not redistribute paid files. The paid guide explains installation order, configuration, testing, and troubleshooting, then sends the reader to the creator's official purchase or entitlement page. Prices and access terms can change, so check the creator's page before purchasing.

## Shared non-negotiable rules

1. Use **GTA V Legacy**, not the standard Legacy guide against Enhanced.
2. Confirm the game build before replacing RPH or ScriptHook files.
3. Back up the clean game and every known-good milestone.
4. Install one subsystem at a time.
5. Launch, go on duty, and perform a real test after each subsystem.
6. Never overwrite a newer shared DLL with an older copy bundled inside a plugin archive.
7. Keep API keys outside screenshots, public logs, and support uploads.
