---
title: Graphics and Audio
---

# Sentinel Build v1.0 presentation stack

The verified final graphics stack is deliberately small:

1. **VisualV 1.0.630** — install the base `VisualV.oiv` to the OpenIV `mods` folder.
2. **Better Radiance** — replace `mods\update\update.rpf\common\data\visualsettings.dat` with the included main file.
3. **ELS** — keep the working ELS installation and vehicle configurations already tested with the build.

The optional Better Radiance taxi, bus, and train brightness textures are not required. Skip them unless those civilian signs are visibly overexposed in your game.

## What is intentionally excluded

Sentinel Build v1.0 does not require ENB, a ReShade preset, QuantV, NaturalVision, large road replacements, vegetation overhauls, or giant texture packs. These packages add more shared-file changes and are outside the verified baseline.

## Graphics acceptance test

Test Story Mode, LSPDFR duty, daytime, sunset, night, rain, emergency lights, headlights, Nexus MDT, Nexus Dispatch, NPCAI, and ALPR Lite. When all pass, create the final Golden Build backup before changing anything else.
