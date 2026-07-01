# Codex Governance Package — Theo 1B B4f Conversation Management (backend) Pass-1 VEP

- **Main artifact:** `Theo_1B_B4f_Conversation_Management_Backend_VEP.md` — Pass-1 backend VEP (plan + complete handlers). Reviewer = Codex (Pass 2).
- **Microstep:** Tier **B4f (backend)** — the update(rename) + delete verbs that complete the HF-T2 ownership CRUD over `theo_conversations` (B3 built create/read/list). Walter-directed (SWA feedback: rename/delete a chat). Two GREENFIELD handlers:
  - `theo_rename_conversation` (POST `{id, title}`) — owner-scoped title update; 403/404 via `_exists_unscoped`.
  - `theo_delete_conversation` (POST `{id}`) — permanent; `theo_messages` CASCADE, `theo_attachments` SET NULL (deployed FKs).
- **No migration** — `theo_conversations` + `theo_conversation_exists_unscoped` deployed from B2.
- **Primary Reference:** deployed `theo_update_user_memory` pair (owner-scoped UPDATE + `_exists_unscoped`); inlined byte-identical.
- **Gateway handlers untouched** (`theo_message`/`theo_message_stream`).
- **Validation:** both `node --check` clean; function.json JSON-valid; microstep lint → PASS; HEAD `ae98ac7` (APPROVED).
- **Pairs with B4f-FE:** rename/delete chat wire to these; rename/delete **project** reuse the deployed `theo_update_project`/`theo_delete_project` (B4a).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2).
