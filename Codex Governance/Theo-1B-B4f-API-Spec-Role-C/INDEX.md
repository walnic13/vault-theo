# Codex Governance Package — Theo 1B B4f API-Spec Role-C

- **Main artifact:** `Theo_1B_B4f_API_Spec_Role_C_Handoff.md` — Pass-4 Role-C Verbatim-Edit Handoff. Executor = Codex (inline).
- **Purpose:** document the two deployed B4f conversation-management endpoints in `spec/THEO_API_SPEC.md` §2.1, completing the documented conversations CRUD (B3 = create/read/list; B4d = link-to-project; B4f = rename/delete). Closes B4f-backend Gap Register **G-2**.
- **Edit:** 1 verbatim edit to 1 target — insert a **Rename conversation** row (`POST /api/theo_rename_conversation {id, title}` → `{conversation:{id,title}}`) and a **Delete conversation** row (`POST /api/theo_delete_conversation {id}` → `{deleted:true,id}`; `theo_messages` cascade, `theo_attachments` SET NULL) immediately after the "Link conversation to project" row.
- **Authority:** the endpoints are DEPLOYED + golden-verified (2026-07-01; B4f-backend VEP Codex-APPROVED). This is documentation-only — no source/handler/schema change.
- **No companion edit:** Schema §3/§5 already records `theo_conversations`, `theo_conversation_exists_unscoped`, and the child FKs; only §2.1 contract text was missing the rows.
- **Currency:** vault-theo HEAD `8980bef`; target blob `1069096`.
- **Pipeline:** Author = Claude Code (Role-C, Pass 4). Executor = Codex (Pass 4 inline).
