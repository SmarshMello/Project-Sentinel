---
title: AxonSignal Bodycam and Dashcam
---

# AxonSignal

AxonSignal adds bodycam and dashcam recording roleplay. It should be treated as a presentation/recording layer and installed after the police framework, MDT, dispatch, and voice systems are stable.

## Installation rules

1. Obtain the current package from the creator's official distribution channel.
2. Preserve the archive structure.
3. Confirm any video/output directory is writable.
4. Choose keys that do not overlap with PR, Nexus, or NPCAI.
5. Test overlays at the target resolution before adding ReShade or graphics overhauls.

## Personal Sentinel controls

```ini
BodyCamRecordKey=O
EnableDashcam=true
EnableDashcamOverlay=true
```

These are examples, not mandatory defaults.

## Test gate

- Toggle bodycam recording.
- Enter a patrol vehicle and confirm dashcam state.
- Confirm the overlay does not cover Nexus radio/MDT UI.
- Verify the expected output folder receives files when recording is enabled.
- Restart and confirm settings persist.

## Common problems

### Overlay is too large

Reduce the plugin's scale or position before changing the Windows display scale. Test at the same game resolution used for normal patrol.

### No recording file appears

Check whether the mod records actual video or simulates the UI, then verify the configured output path, folder permissions, and free disk space.

### Key also triggers another plugin

Move recording to an unused key. Do not stack it with PTT because recording toggles and held voice input behave differently.
