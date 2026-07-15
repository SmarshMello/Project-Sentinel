# Project Sentinel 7.0 — Step 3 Handoff

## Added
- Exact GTA V, RAGE Plugin Hook, and LSPDFR baseline validation.
- Automatic Legacy-versus-Enhanced edition warning.
- High/medium/low environment priority classification.
- Entered-versus-expected version cards.
- Environment-first repair ordering before plugin replacement.
- Clear handling for missing version information without inventing a mismatch.

## Current verified baseline
- GTA V Legacy 1.0.3788.0
- RAGE Plugin Hook 1.130.1406.17682
- LSPDFR 0.4.9 / 0.4.9572

## Install
Copy this package into the repository root and allow folders to merge.

Commit message:
`Project Sentinel 7.0 Step 3 - environment validation`

## Test cases
1. Enter the exact verified baseline and confirm all three checks show **matched**.
2. Enter `GTA V Enhanced` and confirm Doctor displays a high-priority edition warning.
3. Enter an older RPH version and confirm the entered and expected versions are shown.
4. Leave one version blank and confirm it is labeled **missing**, not mismatched.
