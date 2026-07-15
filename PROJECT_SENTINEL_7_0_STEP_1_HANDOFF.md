# Project Sentinel 7.0 — Sentinel Doctor, Step 1

## Included in this step

- Guided symptom intake before log analysis.
- GTA, RPH and LSPDFR environment fields.
- Last-change context field.
- Symptom-only triage when no log is available.
- Intake context is passed into the existing diagnostic ranking engine.
- Updated four-stage Doctor workflow: describe, evidence, diagnosis, repair.

## Install

Copy the included files into the repository root and allow the folders to merge.

Commit message:

`Project Sentinel 7.0 Step 1 - Doctor guided intake`

## Test

Open `/doctor`, select a symptom, fill any known versions, and click Analyze Evidence with or without pasted log text.
