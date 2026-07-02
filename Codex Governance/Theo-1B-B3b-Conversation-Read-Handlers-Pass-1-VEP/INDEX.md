# Codex Governance Package — Theo 1B B3b Conversation Read Handlers — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B3b_Conversation_Read_Handlers_VEP.md` — full Pass-1 Backend VEP (plan only) with both complete handlers.
- **Deploy files:** `theo_list_conversations.index.js` + `.function.json`, `theo_get_conversation.index.js` + `.function.json` (== VEP §HG.3–§HG.6). `DEPLOY.md` has the steps.
- **Pipeline:** Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3); Claude Code golden-curls.
- **HEAD:** vault-theo `31720ab34f72bf67134d1ca4b3f171680ee03841` (`development`).
- **Microstep:** Tier B3 read side — `theo_list_conversations` (Recents) + `theo_get_conversation` (reload + per-row read-back of B3a persistence). Read-only over deployed B2; ownership RLS; Family-B read pattern (no `BEGIN/COMMIT`).
- **Primary Reference:** deployed `reporting_list_entities` (§HG.1, byte-identical); get-by-id `isUuid`/`_exists_unscoped` referenced from deployed `theo_message` (B3a) + `reporting_get_workpaper`. §SM EXACT read pattern + ALLOWED-DELTA list/get bodies; no DEVIATION.
- **Lint:** PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
