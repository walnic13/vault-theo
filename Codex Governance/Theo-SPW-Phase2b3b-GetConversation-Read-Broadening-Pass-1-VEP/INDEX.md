# Codex Governance Package — SPW Phase 2b-3b theo_get_conversation Read Broadening (Pass 1 Backend VEP)

- **Main artifact:** `Theo_SPW_Phase2b3b_GetConversation_Read_Broadening_VEP.md` — Pass-1 backend VEP (plan only; Codex reviews Pass 2).
- **Primary Reference (LIVE):** `primary-reference/theo_get_conversation.LIVE.index.js` (blob `149e080`, pulled from func-premium Kudu VFS this turn — differs from the July-26 snapshot) + `.function.json`. Retained for rollback.
- **Staged AFTER handler:** `handlers/theo_get_conversation.index.js` (`node --check` clean) — the read-broadened version.
- **Scope:** rewire `theo_get_conversation` (func-premium) read path onto the deployed Phase-2b-3a `theo_conversation_access(uuid)` classifier — (A) helper access gate, (B) by-id conversation read, (C) conversation-wide message read (attributed), (D) generalized persisted-image re-sign (any author, gated by access). READ-ONLY; no INSERT/continue (that's 2b-3c); `last_opened_at` stays owner-only. No DB/DDL; no FE.
- **Deploy:** Kudu VFS (PUT + GET-back byte-diff + restart) to `vaultgpt-func-premium`; rollback = re-PUT the LIVE baseline.
- **Grounding parent:** vault-theo `da92ed883d853ecf6dce30e795d25b6dbec41dbd`; currency anchors are tip-independent blob SHAs. Carrying commit named in the forward note.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Claude Pass-3 (VFS deploy + golden curls) → Phase 2b-3c (continue path).
