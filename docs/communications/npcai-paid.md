---
title: NPCAI 3.1 Paid Voice Conversations
---

# DoubleHook NPCAI 3.1

NPCAI is the paid cloud-AI evolution of NPCI. It allows open-ended conversations with civilians and first responders instead of requiring a fixed phrase list.

[Open DoubleHook's official Patreon](https://www.patreon.com/cw/Doublehook)

:::warning Private entitlement required
Do not use third-party reuploads. The guide assumes the user has legally obtained the current NPCAI package and selected the Policing Redefined build.
:::

## Dependencies observed in the Sentinel build

The package and its current documentation are the authority, but missing shared assemblies previously included errors for components such as:

```text
Microsoft.Bcl.AsyncInterfaces.dll
System.Buffers.dll
System.Memory.dll
System.Numerics.Vectors.dll
System.Runtime.CompilerServices.Unsafe.dll
System.Text.Encodings.Web.dll
System.Text.Json.dll
System.Threading.Tasks.Extensions.dll
DamageTrackerFramework.dll
```

Do not download these individually from DLL websites. Restore them from the official NPCAI/framework packages that own them.

## Installation

1. Download the PR-specific NPCAI package.
2. Back up old `NPCXML`, prompt, and config folders.
3. Remove obsolete NPCI/NPCAI DLLs from both root `plugins` and `plugins\LSPDFR`.
4. Extract the complete package into the GTA root.
5. Verify the main NPCAI DLL is inside the documented plugin folder.
6. Verify there is only one `NPCAI_API.dll` unless the author explicitly requires another copy.
7. Enter the chosen Gemini or Groq credential in the private config.
8. Launch once with default prompts before installing third-party prompt packs.

## Microphone and push-to-talk

The personal build's most reliable approach was:

1. Open Logitech G Hub.
2. Map the desired side button to F24.
3. Set NPCAI PTT to F24.
4. Disable the same key in Discord or other overlays.
5. Hold the button while speaking and release after the full sentence.

Direct `XButton2` mapping did not work consistently across plugins.

## Recommended starting options

```ini
EnableVisualContext=false
VisualContextToggleKey=L
VisualContextToggleModifier=RShift
AmbientSpeechEnabled=true
AmbientSpeechMinutes=3
```

Visual context can improve scene awareness but increases API usage. Keep it disabled until the basic voice pipeline works.

## Six-part test

1. **Input:** PTT press appears in the log.
2. **Capture:** microphone activity starts.
3. **Transcription:** spoken text is recognized.
4. **Request:** API call is sent without authentication or quota errors.
5. **Response:** a valid NPC reply returns.
6. **Presentation:** the NPC responds and the player mouth animation/indicator behaves correctly.

The stage that fails determines the repair. Do not reinstall everything when only the recording device is wrong.

## Troubleshooting

### Mouth does not move and the NPC does not respond

The PTT event probably never started. Verify key mapping, modifier, focus, and plugin initialization.

### Mouth moves but no response returns

Check API authentication, quota, network access, model availability, and JSON dependencies.

### Game freezes or LSPDFR crashes immediately after PTT

Inspect the first exception in `RagePluginHook.log`. In the actual build this was caused by missing shared assemblies after files were replaced, not by the microphone itself.

### Groq/Gemini test works outside the game, but NPCAI is silent

The API key is valid. Check whether the NPCAI DLL loaded, the selected provider matches the config, and the PTT listener receives the key.

### NPC responses are repetitive or inappropriate

Return to the official prompts, verify visual context state, and test without community prompt packs. Add enhancements only after the default package is stable.

## Privacy and cost

Cloud-AI conversation may send dialogue and scene context to the selected provider. Never upload API keys or raw configs publicly. Review the provider's quota and billing controls before enabling ambient speech.
