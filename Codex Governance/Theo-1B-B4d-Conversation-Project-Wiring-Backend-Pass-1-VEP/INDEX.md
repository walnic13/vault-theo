# Codex Governance Package — Theo 1B B4d Conversation↔Project Wiring (backend) Pass-1 VEP

- **Main artifact:** `Theo_1B_B4d_Conversation_Project_Wiring_Backend_VEP.md` — Pass-1 backend VEP (plan + complete handlers). Reviewer = Codex (Pass 2).
- **Microstep:** Tier **B4d (backend)** — the data that makes a chat belong to a project, so the FE can tag / restore / list per-project chats. **`theo_message` / `theo_message_stream` are NOT touched** (linking kept out of the gateway/streaming path).
  - **`theo_set_conversation_project`** (NEW, POST) — `{ conversation_id, project_id }`; owner-scoped, idempotent set-once of `theo_conversations.project_id`; verifies project owned (404) + conversation owned (403/404 via `theo_conversation_exists_unscoped`).
  - **`theo_list_conversations`** (MODIFY) — additive optional `?projectId` filter (default path byte-identical; §CHANGESET diff).
- **No migration** — `theo_conversations.project_id` + the `_exists_unscoped` helper are deployed from B2/B3.
- **Primary Reference:** the deployed `theo_update_user_memory` pair (owner-scoped UPDATE + `_exists_unscoped` 403/404); inlined byte-identical (§SM/§SM-FJ).
- **Validation:** both handlers `node --check` clean; setter `function.json` JSON-valid; microstep lint → PASS; HEAD `1e2edcb`.
- **Follows:** B4d-FE (send the setter call, restore project on reload, per-project chat list) + B4e (project-home redesign) are the separate following microsteps.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). On APPROVAL → Walter deploys the setter + redeploys the list handler → Claude Code golden curls.
