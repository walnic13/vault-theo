# Codex Governance Package — SPW Phase 2b-3d theo_get_conversation Author Exposure (Pass 1 Backend VEP)

- **Main artifact:** `Theo_SPW_Phase2b3d_GetConversation_Author_Exposure_VEP.md` — Pass-1 backend VEP (plan only; Codex Pass 2).
- **Primary Reference (LIVE):** `primary-reference/theo_get_conversation.LIVE.index.js` (blob `610bb3e`, the 2b-3b-deployed version, pulled from func-premium Kudu VFS this turn). Retained for rollback.
- **Staged AFTER handler:** `handlers/theo_get_conversation.index.js` (`node --check` clean).
- **Scope (G-3):** add ONE column `created_by` to the messages SELECT so each message row carries its author OID (FE resolves to a name via the People roster). Read-additive; no authorization/DB change.
- **Deploy:** Kudu VFS to `vaultgpt-func-premium`; rollback = re-PUT the LIVE baseline. Paired API-Spec §2.1 Role-C (adds created_by + trues-up the 2b-3b member-read wording).
- **Grounding parent:** vault-theo `6ba2ab8a66dc3715651898aeeeab3ebffef885e1`; tip-independent blob anchors. Carrying commit named in the forward note.
