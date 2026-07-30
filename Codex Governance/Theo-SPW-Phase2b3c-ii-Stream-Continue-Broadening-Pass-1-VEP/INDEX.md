# Codex Governance Package — SPW Phase 2b-3c-ii theo_message_stream Continue Broadening (Pass 1 Backend VEP)

- **Main artifact:** `Theo_SPW_Phase2b3cii_Stream_Continue_Broadening_VEP.md` — Pass-1 backend VEP (plan only; Codex Pass 2).
- **Primary Reference (LIVE):** `primary-reference/theo_message_stream.LIVE.js` (blob `aa54dec`, pulled from func-stream Kudu VFS this turn). Retained for rollback. v4 handler — no per-dir function.json.
- **Staged AFTER handler:** `handlers/theo_message_stream.js` (`node --check` clean) — the continue-broadened version.
- **Scope:** rewire BOTH append gates (pre-stream + persist) onto the deployed Phase-2b-3a `theo_conversation_access(uuid)`; conversation row-lock `FOR UPDATE` + conversation-wide seq; `updated_at` by id. Message INSERTs keep `created_by = caller`. Project-knowledge/active-project stay caller-scoped (safe boundary, G-4). No DB/DDL; no FE.
- **Deploy:** Kudu VFS (PUT + GET-back byte-diff + restart) to `vaultgpt-func-stream` at `/site/wwwroot/src/functions/theo_message_stream.js`; rollback = re-PUT the LIVE baseline.
- **Grounding parent:** vault-theo `09217282f9500e78a2a1b4a60be836823e44da9b`; currency anchors are tip-independent blob SHAs. Carrying commit named in the forward note.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Claude Pass-3 (VFS deploy + golden curls). Completes SPW Phase 2b backend.
