# Codex Governance Package — SPW Phase 2b-3c-i theo_message Continue Broadening (Pass 1 Backend VEP)

- **Main artifact:** `Theo_SPW_Phase2b3ci_Message_Continue_Broadening_VEP.md` — Pass-1 backend VEP (plan only; Codex Pass 2).
- **Primary Reference (LIVE):** `primary-reference/theo_message.LIVE.index.js` (blob `93cfce8`, pulled from func-premium Kudu VFS this turn) + `.function.json`. Retained for rollback.
- **Staged AFTER handler:** `handlers/theo_message.index.js` (`node --check` clean) — the continue-broadened version.
- **Scope:** rewire `theo_message` (func-premium) append path onto the deployed Phase-2b-3a `theo_conversation_access(uuid)` — (1) helper access gate, (2) conversation row-lock `FOR UPDATE` + conversation-wide seq, (3) `updated_at` bump by id. Message INSERTs keep `created_by = caller` (attribution). No DB/DDL; no FE.
- **Deploy:** Kudu VFS (PUT + GET-back byte-diff + restart) to `vaultgpt-func-premium`; rollback = re-PUT the LIVE baseline.
- **Grounding parent:** vault-theo `2af89b28acee9d69e1a9da3d2e94e005b4538665`; currency anchors are tip-independent blob SHAs. Carrying commit named in the forward note.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Claude Pass-3 (VFS deploy + golden curls) → Phase 2b-3c-ii (theo_message_stream).
