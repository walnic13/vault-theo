# Codex Governance Package — Theo 1B B7 Memory Injection — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B7_Memory_Injection_VEP.md` — Pass-1 Backend VEP (plan only) with the full-replacement `theo_message`.
- **Deploy file:** `theo_message.index.js` (== §FIX). `DEPLOY.md` has the steps. `function.json` UNCHANGED.
- **Microstep:** Tier B7 injection — `theo_message` fetches the user's `scope='user'` memory (`theo_user_memory`, explicit `created_by`) and prepends it to the system prompt before the Foundry call. The keystone that makes deployed memory (and future distilled memory) actually affect answers.
- **Change:** exactly two edits vs deployed (§P4) — one isolated NON-FATAL memory-fetch block + one upstream `system` line. Persist/isolation/citations unchanged; diff-verified; node --check clean.
- **Primary Reference:** the deployed `theo_message` pair — handler (§SM, blob `2f966fe9`) + function.json (§SM-FJ, blob `bd476fc8`, unchanged).
- **Gates:** ungated (D-3 ZDR + D-7 RESOLVED). Distillation engine + B7b history-RAG follow.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3); Claude Code golden-curls (memory recalled in a fresh conversation).
- **HEAD:** vault-theo `c1edebbaf21ce3c7247f24c8aa8165b86767d87c`.
- **Lint:** PASS (exit 0).
