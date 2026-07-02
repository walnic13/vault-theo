# Codex Governance Package — Theo 1B B3 SECURITY FIX: per-user chat isolation (Pass 1 Backend VEP)

- **Main artifact:** `Theo_1B_B3_SEC_User_Isolation_Fix_VEP.md` — full Pass-1 Backend VEP (plan only) with the three full-replacement handlers + root-cause evidence.
- **Deploy files (== §FIX.1–3):** `theo_list_conversations.index.js`, `theo_get_conversation.index.js`, `theo_message.index.js`. `DEPLOY.md` has the steps.
- **SECURITY:** live cross-user chat leak. Root cause (verified, §DIAG): app connects as `pgadmin_vault` (`rolbypassrls=t`) → ownership RLS skipped → RLS-only theo queries return all users' rows.
- **Fix:** explicit `created_by = $oid` scoping on every query in the 3 deployed B3/B3b handlers (mirrors the Reporting explicit-filter pattern). No DB/grant/connection/contract change; reporting untouched.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3); Claude Code golden-curls incl. the cross-user isolation check.
- **HEAD:** vault-theo `bacdd14f27f99c28691a7adda279556a8645d14b`.
- **Lint:** PASS (exit 0). All inlined handlers `node --check` clean and byte-verified.
- **Requested verdict:** Codex APPROVED or REJECTED.
