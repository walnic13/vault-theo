# Theo 1B — B7a Memory Substrate: `theo_user_memory` schema + RLS (option C) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete Walter-executable migration provided for deploy at Pass 3, after which Claude Code runs the read-only catalog verification. **Microstep:** Tier **B7a (substrate)** — the **distilled per-user memory profile** table from the Memory-Layer (option C) plan (Backend Plan §7 Tier B7; §5 PROPOSED row). One new table `theo_user_memory` mirroring the deployed `theo_*` idiom (Tier B2): 4-policy ownership RLS `TO authenticated` keyed on `auth.uid()` + a `theo_user_memory_exists_unscoped(uuid)` helper. FKs to deployed B2 tables (`theo_projects`, `theo_conversations`). This is the **storage substrate only** — the distillation engine, system-prompt injection, the CRUD handlers, and cross-chat history-RAG (B7b) are subsequent microsteps and are **gated** (D-7 distillation policy; D-3 ZDR; D-5 Azure AI Search) per §GR. The substrate itself sends no content to any model and is not gated.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `2aa663c28573ab6e17c4a08764c588bd18aa2680` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Schema-only microstep (no handler, no model call). DDL idiom mirrors the deployed Tier B2 migration (`b2_migration.sql`, cited blob) — same RLS 4-policy + `_exists_unscoped` pattern. Columns are the Walter-approved §5 PROPOSED row (landed via the Memory-Layer-C amendment). Per-user isolation is enforced both by RLS (this migration) and, because the shared Functions connection role bypasses RLS, by explicit `created_by = $oid` predicates in the B7a CRUD handlers (next microstep) per the SEC user-isolation fix. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§5 SM; schema discipline) | `Grep("selects \*\*exactly one\*\* deployed handler file")` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B7; §5 `theo_user_memory` row) | `Grep("Distilled memory profile")` + `sed §5/§7` this turn | `d3d02ccfaf9f244c60e71438972397e994b08330` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership; §8.2 memory pillar) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§2 RLS; §3 additive set) | `Grep("Four separate policies per table")` this turn | `2c9d013b9bbff00c8023a8a19497bbab5f97a4f7` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (boundary; additive namespacing) | `Read(offset=1, limit=55)` this turn | `010133b146b5fa8c5ed1820f6b25b40f6bb1656b` |
| 10 | **DDL idiom reference** — deployed Tier B2 migration — `Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql` | `Read(offset=1, limit=45)` + `Grep("_exists_unscoped")` this turn | `2f2b6ddf8bf87525bc1a43e34bb7f82351a54b7c` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL executed (plan only; Walter runs the migration at Pass 3).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B7 | "Distilled memory profile" | §P1 / §DDL — `theo_user_memory` substrate (B7a) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Four separate policies per table" | §DDL — 4-policy ownership RLS on `theo_user_memory` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §DDL — RLS keyed on `created_by = auth.uid()` |

---

## P1 — Feature identification
**Microstep:** Tier **B7a substrate** of the Memory Layer (option C) — the `theo_user_memory` table (Backend Plan §7 Tier B7 / §5 PROPOSED row; Rule Anchor 3). It stores distilled per-user memory items (stable facts/preferences), scoped `user` (cross-chat/global) or `project`. This VEP delivers **only the table + RLS + helper** — the foundation the later microsteps build on (CRUD handlers; distillation engine; injection at system-prompt assembly; B7b history-RAG). No surface, no handler, no model call in this microstep.

## P2 — Architecture & boundary reconciliation
- **Idiom (mirrors deployed B2).** `id uuid PK gen_random_uuid()`; `created_by text NOT NULL` (Entra OID); server-managed `created_at`/`updated_at`; four RLS policies `TO authenticated` (SELECT USING / INSERT WITH CHECK / UPDATE both / DELETE USING) keyed on `created_by = auth.uid()`; `theo_user_memory_exists_unscoped(uuid)` SECURITY DEFINER helper for the future handlers' 403/404 split. Idempotent; no top-level BEGIN/COMMIT (migration governance).
- **Columns (Walter-approved §5).** `scope` (`'user'`|`'project'`), `project_id` (FK→`theo_projects` ON DELETE CASCADE), `kind`, `content`, `source_conversation_id` (FK→`theo_conversations` ON DELETE SET NULL — a distilled fact survives deletion of its source chat), `salience int` (assembly ranking). A CHECK enforces project-scoped ⟺ `project_id` present.
- **Isolation (SEC-fix-aware).** The shared Functions connection bypasses RLS, so the B7a CRUD handlers (next microstep) MUST explicit-filter `created_by = $oid` (per the deployed SEC user-isolation fix); RLS here is the defence-in-depth second layer. Recorded so the substrate's consumers inherit the requirement.
- **Boundary.** Net-new, additive `theo_*` table in the shared `vaultgpt` instance; **no `reporting_*` access**, no change to existing tables, no grants beyond the helper `EXECUTE` (mirrors B2).

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** One idempotent migration run on the shared `vaultgpt` Postgres (as `pgadmin_vault`, the owner — same as every prior theo migration). No app/env/dependency change. | **PRE-LAND** — §DEPLOY; Claude Code runs the read-only §VERIFY catalog probe after. |
| G-2 | **Schema doc DEPLOYED row.** `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 must add the `theo_user_memory` DEPLOYED row after the migration lands. | **PRE-LAND** — a short schema-doc Role-C follows deploy (mirrors the B2 Schema-Doc-DEPLOYED Role-C). |
| G-3 | **Distillation engine + injection + B7b history-RAG are GATED.** The parts that read chat content into a model (distillation) or an index (history-RAG) are client-PII flows. | **PROCEED (future-trigger).** Gated by **D-7** (distillation policy/model/retention/user controls), **D-3** (ZDR contractual confirmation), and the **D-5** Azure AI Search sub-item. The substrate does not trigger any of these (no model/index traffic); those gates bind the *next* microsteps, not this one. |
| G-4 | **CRUD handlers (B7a-handlers) follow.** `theo_*` list/create/update/delete-memory handlers with explicit `created_by` scoping (Claude-style view/edit/delete). | **PROCEED (future-trigger)** — next microstep; not gated by D-3/D-7 (user-managed CRUD sends nothing to a model), authored once this substrate lands. |

No write SQL in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
No API contract in this microstep (no handler). The table is the contract substrate the B7a-handlers + assembly seam will consume. Schema doc gets its DEPLOYED row post-deploy (G-2). Additive namespacing per Schema doc §3.

## P4 — Schema definition
See §DDL (complete idempotent migration). One table, three indexes, four RLS policies, one helper + grant.

## P5 — Component reference grounding
DDL idiom reference (Golden §5 Structural Mirror analog for schema) = the deployed Tier B2 migration `b2_migration.sql` (blob `2f2b6ddf`) — `theo_user_memory` reproduces its `theo_projects`/`theo_conversations` table+RLS+helper shape exactly, differing only in the option-C columns.

## P6 — Repository & active-surface grounding
New artifact: `b7a_migration.sql` (this package). No source/handler/active-surface file changed. Guardrails: no `reporting_*`; no change to deployed tables; idempotent migration; ownership RLS. Verified parse intent via the §VERIFY catalog probe post-deploy.

## P7 — Risk / regression
- **Additive only:** `CREATE TABLE IF NOT EXISTS` + `CREATE POLICY` guarded by `pg_policies` existence checks + `CREATE OR REPLACE FUNCTION`. Re-runnable; no impact on existing tables/rows.
- **FK safety:** `project_id`→`theo_projects` CASCADE; `source_conversation_id`→`theo_conversations` SET NULL. Both reference deployed B2 tables.
- **No live-traffic risk:** nothing reads/writes the table until the B7a handlers land (gated/sequenced separately).

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED future-triggers); complete migration in §DDL; read-only verification in §VERIFY. No implementation begun beyond authoring (plan only). On Codex APPROVAL, Walter runs the migration; Claude Code runs §VERIFY; then the schema-doc DEPLOYED Role-C (G-2) and, separately, the B7a CRUD handlers (G-4).

---

## §DDL — `b7a_migration.sql` (complete; Walter-executable; idempotent)
```sql
-- ============================================================================
-- Theo 1B — Tier B7a: theo_user_memory (distilled cross-chat memory; option C)
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
-- Mirrors the deployed theo_* idiom (Tier B2): four RLS policies TO authenticated keyed on
-- auth.uid() (= Entra OID in created_by) + a SECURITY DEFINER _exists_unscoped(uuid) helper.
-- NOTE: the shared Functions connection role bypasses RLS, so per-user isolation is ALSO
-- enforced by explicit `created_by = $oid` predicates in the B7a CRUD handlers (next microstep),
-- exactly as the SEC user-isolation fix established. RLS here is the second (defence-in-depth) layer.
-- FKs reference deployed B2 tables (theo_projects, theo_conversations).
-- ============================================================================

-- ---------- theo_user_memory ----------
CREATE TABLE IF NOT EXISTS public.theo_user_memory (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by             text NOT NULL,
  scope                  text NOT NULL DEFAULT 'user' CHECK (scope IN ('user','project')),
  project_id             uuid NULL REFERENCES public.theo_projects(id) ON DELETE CASCADE,
  kind                   text NOT NULL DEFAULT 'fact',
  content                text NOT NULL CHECK (length(trim(content)) > 0),
  source_conversation_id uuid NULL REFERENCES public.theo_conversations(id) ON DELETE SET NULL,
  salience               int  NOT NULL DEFAULT 0,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  -- project-scoped iff a project_id is present; user-scoped iff it is null
  CONSTRAINT theo_user_memory_scope_project_ck CHECK ((scope = 'project') = (project_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS idx_theo_user_memory_created_by ON public.theo_user_memory (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_user_memory_owner_scope ON public.theo_user_memory (created_by, scope);
CREATE INDEX IF NOT EXISTS idx_theo_user_memory_project ON public.theo_user_memory (project_id);
ALTER TABLE public.theo_user_memory ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_memory' AND policyname='theo_user_memory_select_own') THEN
    CREATE POLICY "theo_user_memory_select_own" ON public.theo_user_memory FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_memory' AND policyname='theo_user_memory_insert_own') THEN
    CREATE POLICY "theo_user_memory_insert_own" ON public.theo_user_memory FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_memory' AND policyname='theo_user_memory_update_own') THEN
    CREATE POLICY "theo_user_memory_update_own" ON public.theo_user_memory FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_memory' AND policyname='theo_user_memory_delete_own') THEN
    CREATE POLICY "theo_user_memory_delete_own" ON public.theo_user_memory FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_user_memory_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_user_memory WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_user_memory_exists_unscoped(uuid) TO authenticated;
```

## §VERIFY — post-deploy read-only catalog probe (Claude Code runs via `.local\run-reporting-ro-query.ps1`)
```sql
-- B7a post-deploy verification (read-only; run as codex_reporting_ro or any role).

-- 1. table present + RLS enabled
SELECT c.relname, c.relrowsecurity AS rls
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname='theo_user_memory';

-- 2. four ownership policies
SELECT polname,
       CASE polcmd WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT' WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE' END AS cmd,
       pg_get_expr(polqual, polrelid) AS using_expr,
       pg_get_expr(polwithcheck, polrelid) AS check_expr
FROM pg_policy p JOIN pg_class c ON c.oid=p.polrelid
WHERE c.relname='theo_user_memory' ORDER BY polname;

-- 3. _exists_unscoped helper present
SELECT p.proname, pg_get_function_result(p.oid) AS returns
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname='theo_user_memory_exists_unscoped';

-- 4. scope/project_id CHECK constraint present
SELECT conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE conrelid='public.theo_user_memory'::regclass AND contype='c';
```

## §DEPLOY — Walter deploy steps
1. Run `b7a_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (the owner; same as every prior theo migration — NOT via the RO tool).
2. Reply "B7a schema deployed" → Claude Code runs §VERIFY (table + 4 policies + helper + CHECK), then prepares the schema-doc DEPLOYED Role-C (G-2).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B7a Memory Substrate Schema Pass-1 Backend VEP (plan only).*
