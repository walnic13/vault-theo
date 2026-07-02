# Codex Governance Package — Theo 1B B4d API-Spec Role-C (Pass 4)

- **Main artifact:** `Theo_1B_B4d_API_Spec_Role_C_Handoff.md` — Pass-4 Role-C Verbatim-Edit Handoff. Author = Claude Code (Role-C). Inline executor = Codex.
- **Purpose:** finalize Theo API Spec **§2.1** to the deployed + golden-verified B4d contracts. Closes B4d-backend G-2 + B4d-FE G-4.
- **Edits (2, one target `spec/THEO_API_SPEC.md`):**
  1. Add the additive `?projectId=<uuid>` filter to the `theo_list_conversations` row.
  2. Insert a new `theo_set_conversation_project` row (owner-scoped idempotent set-once link of `theo_conversations.project_id`; 400/403/404 semantics; gateway handlers unchanged).
- Documentation only; no source/handler/schema change.
- **Lint:** microstep lint → PASS; HEAD `c060451`; API-spec blob `4b978ef`.
- **Pipeline:** Pass 4 (Role-C authoring by Claude Code → Codex inline execution + Role-C review).
