# Project Sentinel 2.7

- Adds a dedicated ScriptHookV/GTA compatibility diagnosis.
- Adds startup dependency reasoning: GTA → ScriptHookV → ASI Loader → LSPDFR → plugins.
- Treats verified/detected/success lines as negative evidence instead of positive matches.
- Prevents verified RAGENativeUI from becoming a false diagnosis.
- Adds regression tests for ScriptHookV-update and duplicate-RAGENativeUI cases.
- Keeps all analysis local in the browser with no paid AI API or new backend.
