# Codex Governance Package — SPW Phase 2b-3e (G-4) Member Project-Knowledge RAG Parity (Pass 1 Backend VEP)

- **Main artifact:** `Theo_SPW_Phase2b3e_Member_Project_Knowledge_VEP.md` — Pass-1 backend VEP (plan only; Codex Pass 2).
- **Primary Reference (LIVE):** `primary-reference/theo_message_stream.LIVE.js` (blob `4e71da8`, the 2b-3c-ii-deployed version, pulled from func-stream Kudu VFS this turn). Retained for rollback. v4 handler — no per-dir function.json.
- **Staged AFTER handler:** `handlers/theo_message_stream.js` (`node --check` clean).
- **Scope (G-4):** give a project MEMBER's turn the shared project's knowledge RAG — broaden the active-project lookup to by-id, ADD a `theo_project_effective_role` access-gate (§10), and drop `created_by` from the Azure Search filter + the live-filter (safe behind the gate). `searchHistory` untouched. `theo_message` has no project-RAG (stream-only). No DB/DDL; no FE.
- **Deploy:** Kudu VFS to `vaultgpt-func-stream`; rollback = re-PUT the LIVE baseline.
- **Grounding parent:** vault-theo `ef2901e7b9b4fbea92c8943ffddc787376a82243`; tip-independent blob anchors. Carrying commit named in the forward note.
