# Project Sentinel 8.0 — Sentinel Expert Step 3

## Release focus
Explainable multi-project reasoning and validation-first installation planning.

## Added
- Multi-project stack evaluation across all projects named in one question.
- Confidence scoring that explains positive signals, caution signals, conflicts, Watcher coverage, and unresolved dependencies.
- Clear recommendation states such as approved baseline, staged testing, isolated test branch, or do not combine.
- Dependency-aware install ordering with cycle protection and unresolved dependency warnings.
- Validation checkpoints tailored to callouts, EUP, backup, and policing systems.
- New UI cards for confidence, reasoning evidence, manual dependency checks, and validation steps.

## Test prompts
- Can I install Grammar Police, Stop The Ped, Ultimate Backup and CompuLite together?
- Can I install Policing Redefined with Stop The Ped?
- What is the install order for EUP Menu?
- What does Ultimate Backup require?

## Install
Copy the files from this package into the root of the Project Sentinel repository and allow folders to merge.

## Commit message
Project Sentinel 8.0 Step 3 - explainable reasoning and install validation

## Validation
`npm run build` completed successfully. Client and server bundles compiled and Docusaurus generated the static site.
