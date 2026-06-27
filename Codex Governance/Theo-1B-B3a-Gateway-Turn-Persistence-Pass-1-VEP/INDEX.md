# Codex Governance Package — Theo 1B B3a Gateway Turn Persistence — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B3a_Gateway_Turn_Persistence_VEP.md` — full Pass-1 Backend VEP (plan only) with the complete replacement `theo_message` handler.
- **Pipeline:** Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3); Claude Code golden-curls.
- **HEAD:** vault-theo `4266f8140b9c368238092c3ef75aba4f9ec02423` (`development`).
- **Microstep:** Tier B3 (sub-pass B3a) — extend `theo_message` to persist each turn to the deployed B2 substrate: auto-create/resolve `theo_conversations`, insert user + assistant `theo_messages` (with `citations`), return `conversation_id`. Chats durable under ownership RLS. Read handlers (recents/reload) = B3b.
- **Primary Reference:** deployed `theo_message` (§HG.1, byte-identical, blob 6c5e9c12); persistence mirrors deployed `reporting_create_entity` (referenced, blob-pinned c2f02bf0; Golden §4 + §WA). §SM EXACT except the persistence region (ALLOWED DELTA); no DEVIATION.
- **Verified:** §HG.1 == deployed theo_message; §HG.3 `node --check` clean + diff = only the persistence delta.
- **Gaps:** POSTGRES_CONNECTION_STRING on theo's Functions app (PRE-LAND); multi-turn threading needs the paired FE wiring to echo conversation_id (PROCEED); ZDR/client-PII (PRE-LAND); API-Spec §2.1 contract delta recorded by Role-C on land.
- **Lint:** PASS (exit 0).
- **Requested verdict:** Codex APPROVED or REJECTED.
