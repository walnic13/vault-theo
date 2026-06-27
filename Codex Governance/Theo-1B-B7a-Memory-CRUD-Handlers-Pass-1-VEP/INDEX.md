# Codex Governance Package — Theo 1B B7a Memory CRUD Handlers — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B7a_Memory_CRUD_Handlers_VEP.md` — full Pass-1 Backend VEP (plan only) with four complete handlers.
- **Deploy files (== §HG/§FJ):** `theo_list_user_memory`, `theo_create_user_memory`, `theo_update_user_memory`, `theo_delete_user_memory` (`.index.js` + `.function.json`). `DEPLOY.md` has the steps.
- **Microstep:** Tier B7a handlers — memory CRUD over the deployed `theo_user_memory` table (option C); backs Claude-style view/edit/delete. Every query explicit `created_by = $oid` (SEC-fix discipline); Family-B; list=GET, mutations=POST.
- **Primary Reference:** deployed `reporting_create_entity` (pg mutation pattern), §SM byte-identical.
- **Scope/gates:** ungated (user-managed CRUD; no model/index traffic). Distillation engine + injection + B7b history-RAG (D-5 AI Search) are separate later microsteps. API-Spec Memory row follows post-deploy (G-2).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Deploy = Walter (Pass 3); Claude Code golden-curls incl. cross-user isolation.
- **HEAD:** vault-theo `d010a33fea0cb3f9ca33299ec8f8f0cb00e5298c`.
- **Lint:** PASS (exit 0). All four handlers `node --check` clean; inlines byte-verified.
- **Requested verdict:** Codex APPROVED or REJECTED.
