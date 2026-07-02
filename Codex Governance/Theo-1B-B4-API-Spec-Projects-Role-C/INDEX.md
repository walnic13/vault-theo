# Codex Governance Package — Theo 1B B4 API-Spec Projects Role-C (Pass 4)

- **Main artifact:** `Theo_1B_B4_API_Spec_Projects_Role_C_Handoff.md` — Pass-4 Role-C Verbatim-Edit Handoff. Author = Claude Code (Role-C). Inline executor = Codex.
- **Purpose:** finalize Theo API Spec **§2.2 Projects** from the v0.1 `1A-contract (in-memory)` skeleton to the deployed contract, naming the seven live endpoints (B4a projects core CRUD + B4b project-knowledge CRUD, both deployed + golden-verified 2026-07-01). Mirrors the §2.7 Memory / §2.8 Attachments deployed-row style. Closes G-2 of B4a + B4b before the B4c FE-live VEP cites §2.2 (T22 prevention).
- **Edits:** 1 verbatim edit to 1 target (`spec/THEO_API_SPEC.md` — replace the §2.2 table). Documentation only; no source/handler/schema change.
- **Endpoints finalized:** `theo_list/create/update/delete_project` + `theo_add/list/remove_project_knowledge`, with request/response shapes, status codes, FK cascade behavior, and the additive `description` column note.
- **Lint:** microstep lint → PASS; HEAD `2360c04`.
- **Pipeline:** Pass 4 (Role-C authoring by Claude Code → Codex inline execution + Role-C review).
