# Codex Governance Package — Theo 1B B7b-1 History-RAG Indexing — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B7b1_History_RAG_Indexing_VEP.md` — Pass-1 Backend VEP (plan only).
- **Deploy files:** `b7b1_migration.sql` (§DDL — last_indexed_at + theo_index_due_conversations SECURITY DEFINER enumeration), `theo_index_messages.index.js` (§HG — indexing timer), `theo_index_messages.function.json` (§FJ — timerTrigger :05/:20/:35/:50). `DEPLOY.md` has the steps + new app settings.
- **Microstep:** B7b-1 indexing half of cross-chat history-RAG. Separate timer embeds (text-embedding-3-small, 1536-d) + upserts each idle conversation's messages into a `theo-messages` Azure AI Search index; own last_indexed_at watermark; per-owner set_config; created_by on every doc. Distillation timer untouched.
- **Azure prereqs:** DONE + golden-curl-verified (embedding 1536-d 200; Search RBAC 200). D-3 ZDR + D-5 resource resolved.
- **Primary Reference:** deployed theo_distill_memory pair (§SM a9fe40b3 + §SM-FJ fe5890b2).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Deploy = Walter (Pass 3); Claude Code verifies.
- **HEAD:** vault-theo `801007a8711348dff23973f6807fac5d74c1ebbe`.
- **Lint:** PASS (exit 0).
