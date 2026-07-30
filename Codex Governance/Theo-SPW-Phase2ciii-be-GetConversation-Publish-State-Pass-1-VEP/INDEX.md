# Codex Governance Package — SPW Phase 2c-iii-be theo_get_conversation Publish-State + Owner Exposure (Pass 1 Backend VEP)

- **Main artifact:** `Theo_SPW_Phase2ciii_be_GetConversation_Publish_State_VEP.md` — Pass-1 backend VEP (plan only; Codex Pass 2).
- **Primary Reference (LIVE):** `primary-reference/theo_get_conversation.LIVE.index.js` (blob `7a571df`, the 2b-3d/G-3-deployed version, Kudu VFS this turn) + `.function.json`. Retained for rollback.
- **Staged AFTER handler:** `handlers/theo_get_conversation.index.js` (`node --check` clean).
- **Scope (2c-iii-be):** add TWO columns — `created_by` (owner) + `published_to_project` (§11) — to the conversation SELECT so the 2c-iii FE publish control can gate owner-only + reflect publish state. Read-additive; no authorization/DB change.
- **Deploy:** Kudu VFS to `vaultgpt-func-premium`; rollback = re-PUT the LIVE baseline. Paired API-Spec §2.1 Role-C.
- **Grounding parent:** vault-theo `037d5602ce0a226ece2a396d3ed4027db13f1133`; tip-independent blob anchors.
