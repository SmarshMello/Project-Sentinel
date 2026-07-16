# Project Sentinel Intelligence 2.1 — Build Planning & Verification

## Added
- Dependency-aware Build Planner with automatic dependency inclusion.
- Topological installation order generation.
- Warnings for unresolved dependencies, cycles, high-risk and breaking projects.
- Build Verifier with pre-flight score, blocking errors, warnings and launch readiness.
- Golden Build and custom-selection verification modes.
- Clickable verifier findings that open the affected Intelligence profile.
- Clear zero-impact explanation when no registered reverse dependencies exist.

## Validation
- Intelligence engine regression suite.
- Doctor diagnostic regression suite.
- Docusaurus production build.
- Static route output checks for Intelligence and Doctor.

## Files
- `src/intelligence/buildPlannerEngine.js`
- `src/intelligence/buildVerifierEngine.js`
- `src/components/intelligence/BuildPlanner.js`
- `src/components/intelligence/BuildPlanner.module.css`
- `src/components/intelligence/BuildVerifier.js`
- `src/components/intelligence/BuildVerifier.module.css`
- `src/components/intelligence/ImpactSimulator.js`
- `src/components/intelligence/ImpactSimulator.module.css`
- `src/pages/intelligence/index.js`
- `intelligence-tests/run-tests.mjs`
