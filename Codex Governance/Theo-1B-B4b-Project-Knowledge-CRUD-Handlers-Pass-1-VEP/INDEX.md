# Codex Governance Package — Theo 1B B4b Project Knowledge CRUD Handlers Pass-1 VEP

- **Main artifact:** `Theo_1B_B4b_Project_Knowledge_CRUD_Handlers_VEP.md` — Pass-1 backend VEP (plan + complete handlers). Reviewer = Codex (Pass 2).
- **Microstep:** Tier **B4b** — project-knowledge CRUD over the deployed `theo_project_knowledge` table (B2), backing the Claude-style project knowledge panel. Follows B4a (deployed + verified). Three GREENFIELD handlers + three `function.json`:
  - `theo_add_project_knowledge` (POST) — `{project_id, title, content}`; verifies the project is owned; inserts `source_type='text'` → 201.
  - `theo_list_project_knowledge` (GET `?projectId`) — a project's knowledge items; resolves project ownership (403/404) first.
  - `theo_remove_project_knowledge` (POST) — `{knowledge_id}`; permanent (the table is immutable); 403/404 via `_exists_unscoped`.
- **Text knowledge only** (`source_type='text'`, inline `content`); file-backed (`source_type='file'` + Blob, reusing B8 upload) + RAG (Tier B6) are deferred fast-follows.
- **No migration** — `theo_project_knowledge` + RLS + `theo_project_knowledge_exists_unscoped` are deployed from B2.
- **Primary Reference:** the deployed `theo_create_user_memory` pair (B7a) — the Theo verify-parent-owned → INSERT pattern; inlined byte-identical (§SM/§SM-FJ).
- **Pattern:** Family-B; every query explicit `created_by = $oid`; parent-project ownership pre-check on add/list; deterministic 400s before SQL.
- **Validation:** all three handlers `node --check` clean; three `function.json` JSON-valid; microstep lint → PASS; HEAD `1b6497f`.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2).
