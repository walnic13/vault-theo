# Codex Governance Package — Theo 1B B7b-2 History-RAG Retrieval + Injection — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B7b2_History_RAG_Retrieval_VEP.md` — Pass-1 Backend VEP (plan only). **Final memory-layer component.**
- **Deploy file:** `theo_message.index.js` (== §FIX). `function.json` UNCHANGED; B7b-1 app settings reused.
- **Microstep:** B7b-2 — theo_message embeds the latest user message + hybrid-searches theo-messages filtered created_by=$oid (excludes current thread) + injects top-k prior-discussion excerpts alongside the memory profile. Non-fatal; per-user isolated (no SECURITY DEFINER — per-user request).
- **Change:** additive (config + 3 helpers + history block) + one line (effectiveSystem now [memoryBlock, historyBlock, systemPrompt]); persist/isolation/citations byte-identical; node --check clean; diff-verified.
- **Primary Reference:** deployed theo_message pair (§SM f41362bb + §SM-FJ bd476fc8).
- **HEAD:** vault-theo `8799e6da3d06eb7345619deb36120f8b7a6e49a7`. Lint: PASS.
