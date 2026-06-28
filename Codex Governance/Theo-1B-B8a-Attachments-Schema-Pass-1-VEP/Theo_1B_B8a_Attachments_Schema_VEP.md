# Theo 1B — B8a Attachments Substrate: `theo_attachments` schema + RLS — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete Walter-executable migration for deploy at Pass 3, after which Claude Code runs the read-only catalog verification. **Microstep:** Tier **B8a (substrate)** — the `theo_attachments` table from the Attachments plan (Backend Plan §7 Tier B8; §5 PROPOSED row). One new table mirroring the deployed `theo_*` idiom (Tier B2): 4-policy ownership RLS `TO authenticated` keyed on `auth.uid()` + a `theo_attachment_exists_unscoped(uuid)` helper. Holds the Blob pointer (into the existing `theo-content` container) + file metadata; FK to deployed `theo_conversations`. **Storage substrate only** — the upload handler (B8b), gateway document-block injection (B8c), and FE (B8d) are subsequent microsteps; B8b is gated by D-8 (upload mechanism + limits), B8a is not gated.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `3d05cd0ac04fcdc0cf08983bf39c4f27d262e859` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Schema-only microstep (no handler, no model call). DDL idiom mirrors the deployed Tier B2 migration (`b2_migration.sql`, cited blob) — same 4-policy RLS + `_exists_unscoped` pattern. Columns are the Walter-approved §5 PROPOSED row (landed via the B8 amendment). Per-user isolation enforced by RLS (this migration) + explicit `created_by` predicates in the B8 handlers (next microsteps). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§5 SM; schema discipline) | `Grep("selects \*\*exactly one\*\* deployed handler file")` this turn | `af4ef9fd93ce886ad968d3644599e54e29c67220` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8; §5 `theo_attachments` row) | `Grep("theo_attachments")` this turn | `f9ff44111298469a9b3771eb815d2b14524b2345` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§2 RLS; §3 additive set) | `Grep("Four separate policies per table")` this turn | `95538419e01ff95d20342e6b65d97c332912c614` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (boundary; additive namespacing) | `Read(offset=1, limit=20)` this turn | `f491b3986dd1fdbcaa91346def08520217fc9370` |
| 10 | **DDL idiom reference** — deployed Tier B2 migration — `Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql` | `Read(offset=1, limit=45)` + `Grep("_exists_unscoped")` this turn | `2f2b6ddf8bf87525bc1a43e34bb7f82351a54b7c` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL executed (plan only; Walter runs the migration at Pass 3).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "theo_attachments" | §P1 / §DDL — the B8a substrate table |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Four separate policies per table" | §DDL — 4-policy ownership RLS on `theo_attachments` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §DDL — RLS keyed on `created_by = auth.uid()` |

---

## P1 — Feature identification
**Microstep:** Tier **B8a substrate** of Attachments — the `theo_attachments` table (Backend Plan §7 Tier B8 / §5 PROPOSED row; Rule Anchor 3). It stores metadata + a Blob pointer for files a user attaches to a chat (filename, content_type, byte_size, container/path), owner-scoped. This VEP delivers **only the table + RLS + helper** — the foundation for the upload handler (B8b), gateway document-block injection (B8c), and FE (B8d). No surface, no handler, no model call.

## P2 — Architecture & boundary reconciliation
- **Idiom (mirrors deployed B2).** `id uuid PK gen_random_uuid()`; `created_by text NOT NULL` (Entra OID); `created_at`; four RLS policies `TO authenticated` keyed on `created_by = auth.uid()`; `theo_attachment_exists_unscoped(uuid)` SECURITY DEFINER helper for the future handlers' 403/404 split. Idempotent; no top-level BEGIN/COMMIT.
- **Columns (Walter-approved §5).** `conversation_id` (FK→`theo_conversations` ON DELETE SET NULL — an attachment survives deletion of its chat), `filename` (non-empty), `content_type`, `byte_size bigint` (≥0), `blob_container`/`blob_path` (pointer into the existing `theo-content` container). Immutable file metadata (no `updated_at`).
- **Isolation.** RLS + (in the B8 handlers) explicit `created_by = $oid`; the Blob body lives in `theo-content`; the row holds only the pointer.
- **Boundary.** Net-new, additive `theo_*` table in the shared `vaultgpt` instance; **no `reporting_*` access**; no change to existing tables; FK references the deployed B2 `theo_conversations`.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** One idempotent migration on the shared `vaultgpt` Postgres (as `pgadmin_vault`, the owner — same as every prior theo migration). No app/env/dependency change. | **PRE-LAND** — §DEPLOY; Claude Code runs the read-only §VERIFY catalog probe after. |
| G-2 | **Schema doc DEPLOYED row.** `spec/THEO_AZURE_POSTGRES_SCHEMA.md` must add the `theo_attachments` DEPLOYED row after the migration lands. | **PRE-LAND** — a short schema-doc Role-C follows deploy (mirrors prior DEPLOYED Role-Cs). |
| G-3 | **B8b upload handler.** `theo_upload_attachment` (store in Blob + insert the owner-scoped row). | **PROCEED (future-trigger)** — next microstep; **gated by D-8** (upload mechanism + size/type limits); Claude Code recommends in the B8b VEP. |
| G-4 | **B8c gateway integration + B8d FE.** Inject document/image blocks at `theo_message`; composer attach UI. | **PROCEED (future-trigger)** — subsequent microsteps; capability already verified (Foundry accepts document blocks). |

No write SQL in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
No API contract in this microstep (no handler). The table is the substrate the B8 handlers consume. Schema doc gets its DEPLOYED row post-deploy (G-2). Additive namespacing per Schema doc §3; the Blob body uses the existing `theo-content` container.

## P4 — Schema definition
See §DDL (complete idempotent migration). One table, two indexes, four RLS policies, one helper + grant.

## P5 — Component reference grounding
DDL idiom reference (Golden §5 schema analog) = the deployed Tier B2 migration `b2_migration.sql` (blob `2f2b6ddf`) — `theo_attachments` reproduces its table+RLS+helper shape, differing only in the attachment columns.

## P6 — Repository & active-surface grounding
New artifact: `b8a_migration.sql` (this package). No source/handler/active-surface file changed. Guardrails: no `reporting_*`; no change to deployed tables; idempotent migration; ownership RLS. Verified via the §VERIFY catalog probe post-deploy.

## P7 — Risk / regression
- **Additive only:** `CREATE TABLE IF NOT EXISTS` + guarded `CREATE POLICY` + `CREATE OR REPLACE FUNCTION`. Re-runnable; no impact on existing tables/rows.
- **FK safety:** `conversation_id`→`theo_conversations` ON DELETE SET NULL (references the deployed B2 table).
- **No live-traffic risk:** nothing reads/writes the table until the B8b/B8c handlers land.

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED); complete migration in §DDL; read-only verification in §VERIFY. Plan-only. On Codex APPROVAL, Walter runs the migration; Claude Code runs §VERIFY; then the schema-doc DEPLOYED Role-C (G-2) and the B8b upload handler (after the D-8 recommendation).

---

## §DDL — `b8a_migration.sql` (complete; Walter-executable; idempotent)
```sql
-- ============================================================================
-- Theo 1B — Tier B8a: theo_attachments (files attached to a chat; document/image RAG-to-model)
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
-- Mirrors the deployed theo_* idiom (Tier B2): four RLS policies TO authenticated keyed on
-- auth.uid() (= Entra OID in created_by) + a SECURITY DEFINER theo_attachment_exists_unscoped(uuid)
-- helper (403/404 discrimination for the B8b upload/delete handlers). The file body lives in Azure
-- Blob (the existing `theo-content` container); this row holds the Blob pointer + metadata only.
-- Per-user isolation is ALSO enforced by explicit `created_by = $oid` predicates in the B8 handlers
-- (the shared connection role enforces RLS via set_config; explicit filter is defence-in-depth).
-- FK to deployed B2 table theo_conversations.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.theo_attachments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      text NOT NULL,
  conversation_id uuid NULL REFERENCES public.theo_conversations(id) ON DELETE SET NULL,
  filename        text NOT NULL CHECK (length(trim(filename)) > 0),
  content_type    text NOT NULL,
  byte_size       bigint NOT NULL CHECK (byte_size >= 0),
  blob_container  text NOT NULL,
  blob_path       text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_attachments_created_by ON public.theo_attachments (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_attachments_conversation ON public.theo_attachments (conversation_id);
ALTER TABLE public.theo_attachments ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_attachments' AND policyname='theo_attachment_select_own') THEN
    CREATE POLICY "theo_attachment_select_own" ON public.theo_attachments FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_attachments' AND policyname='theo_attachment_insert_own') THEN
    CREATE POLICY "theo_attachment_insert_own" ON public.theo_attachments FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_attachments' AND policyname='theo_attachment_update_own') THEN
    CREATE POLICY "theo_attachment_update_own" ON public.theo_attachments FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_attachments' AND policyname='theo_attachment_delete_own') THEN
    CREATE POLICY "theo_attachment_delete_own" ON public.theo_attachments FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_attachment_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_attachments WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_attachment_exists_unscoped(uuid) TO authenticated;
```

## §VERIFY — post-deploy read-only catalog probe (Claude Code runs via `.local\run-reporting-ro-query.ps1`)
```sql
-- B8a post-deploy verification (read-only; catalog).
-- 1. table present + RLS enabled
SELECT c.relname, c.relrowsecurity AS rls FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname='theo_attachments';
-- 2. four ownership policies
SELECT polname, CASE polcmd WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT' WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE' END AS cmd,
       pg_get_expr(polqual, polrelid) AS using_expr, pg_get_expr(polwithcheck, polrelid) AS check_expr
FROM pg_policy p JOIN pg_class c ON c.oid=p.polrelid WHERE c.relname='theo_attachments' ORDER BY polname;
-- 3. _exists_unscoped helper
SELECT p.proname, pg_get_function_result(p.oid) AS returns FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname='theo_attachment_exists_unscoped';
-- 4. FK + checks
SELECT conname, pg_get_constraintdef(oid) AS def FROM pg_constraint
WHERE conrelid='public.theo_attachments'::regclass AND contype IN ('c','f') ORDER BY conname;
```

## §DEPLOY — Walter deploy steps
1. Run `b8a_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (the owner; same as every prior theo migration — NOT via the RO tool).
2. Reply "B8a schema deployed" → Claude Code runs §VERIFY (table + 4 policies + helper + FK/CHECKs), then prepares the schema-doc DEPLOYED Role-C (G-2) and the D-8 recommendation for B8b.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B8a Attachments Substrate Schema Pass-1 Backend VEP (plan only).*
