# Vault Six-Plates Lens (Stage-0 §7.5) — `theo_user_memory.plate` — Pass-1 VEP

Backend implementation VEP (Pass 1) for **Stage-0 §7.5** — the FINAL Stage-0 step. Delivers the **opt-in Six-Plates lens substrate**: one additive nullable `plate text` column on the deployed L1 personal-memory table `theo_user_memory`, per the Codex-APPROVED design ([[Vault_Access_Policy_Engine_Stage0_Design.md]] §7 item 5 + the §1 reconciliation VERDICT). **Migration-only — Walter-run (`pgadmin_vault`); NO handler.** Honours the design's three constraints exactly: **open taxonomy (no CHECK — C1); no new scope (C2); no substrate-shape change** → **no `VAULT_MEMORY_ARCHITECTURE.md` §6 amendment is triggered**. A NULL plate = the default Work & Craft lens; a non-NULL plate = an opt-in life-plate tag. Per-plate MODE + check-in UI (vision §11) are deferred.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Verified Evidence Pack (backend implementation package — schema migration, no handler)
Grounding parent (source baseline): `6056879778604d2005ac59ac7e2a6d43e9eed58d` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; currency anchors below are tip-independent blob SHAs
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Stage-0 DESIGN (this VEP implements §7 item 5 + the §1 verdict) — `Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md` | Codex-APPROVED (`33f5655`); §1 (C1/C2/C3) + §7 item 5 re-read this turn | `0e6779235c9b39935c4e63688f06a27ae92a8175` |
| 2 | GOVERNING VISION — `governance/VAULT_MEMORY_ARCHITECTURE.md` (§6 Amendment 3 — Six Plates optional lens, schema-flexible substrate, plate modes; §11 not-yet-specified) | `Read`(§6/§11) this turn | `d17ddd0d97887b38e6db3297c56db9d6b3cfe9cf` |
| 3 | Backend Governor — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3 Never-Guess; §4 Schema Reality Lock; §8 VEP format + Gap Register) | `Grep("Never-Guess")` + `Grep("Schema Reality Lock")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 4 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 5 | Golden Handler — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§5.2 migration discipline — no top-level transaction control) | `Grep("transaction control")` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 6 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1C Walter-runs-migrations; §1D ordered pass) | `Grep("migrations/merges remain Walter-only")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 7 | SCHEMA TRUTH — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_user_memory` row; §6 Tier B7a DDL + scope CHECK; the §7 Role-C target) | `Read`(§3/§6) this turn | `6b213eb061ac39253d4038e2bee71ef407dadb7f` |
| 8 | DEPLOYED DDL (the table altered) — `Codex Governance/Theo-1B-B7a-Memory-Substrate-Schema-Pass-1-VEP/b7a_migration.sql` (`theo_user_memory` shape, RLS, additive-index idiom) | `Read`(full) this turn | `bbb66f45d5b598bf104499f32b3812af41c64e26` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md | §1 | "open (no CHECK)" | §1/§4 — the plate column carries NO CHECK (C1) |
| Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md | §1 | "NOT a new scope" | §2/§4 — plates are metadata on scope='user' rows (C2) |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §6 | "Six Plates is an OPTIONAL lens" | §1/§2 — opt-in lens, not a foundational commitment |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §3 — additive on the deployed B7a shape |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1C | "migrations/merges remain Walter-only" | §8 — Walter runs the migration |

---

## §1 — Feature + design

**Feature.** One additive column: `public.theo_user_memory.plate text NULL` — **open (no CHECK)**. The Six-Plates lens tag (design §1 verdict — the "additive nullable `plate text` column" option, chosen over overloading the existing `kind` which already carries `'fact'|'preference'|'profile'`). Plus a partial index `idx_theo_user_memory_owner_plate ON (created_by, plate) WHERE plate IS NOT NULL` for lens-filtered recall over opted-in rows.

**Semantics.** A **NULL** plate = the DEFAULT lens = **Work & Craft** (work-awareness is default for everyone — vision §6). A **non-NULL** plate = the user has OPTED IN to filing that memory under a life-plate (Body / Inner Life / Close Others / Wider Belonging / Work & Craft / Material World — offered by the FE, NOT enforced by the DB). The lens overlays organisation on the SAME `scope='user'` rows; it is not a new memory kind or scope.

## §2 — Architecture & boundary reconciliation

**The §1 reconciliation verdict, executed.** The deployed `theo_user_memory` already IS the flexible, user-controlled substrate; **"Six Plates is an OPTIONAL lens"** (vision §6) realised additively. This VEP lands exactly the substrate the design specified, honouring all three constraints:
- **C1 (open taxonomy):** `plate` carries **"open (no CHECK)"** — the FE offers the six domains; the DB does not enforce a closed vocabulary. Promoting to a CHECK is a later Walter-run migration if ever wanted.
- **C2 (no new scope):** plates are metadata on the existing `scope='user'` rows — **"NOT a new scope"**. The `scope`/`theo_user_memory_scope_project_ck` are untouched. (A distinct life-scope WOULD relax that CHECK and change the shape — explicitly out of scope.)
- **No substrate-shape change** ⇒ **no `VAULT_MEMORY_ARCHITECTURE.md` §6 amendment is triggered** (the doc requires one "only if it changes the substrate shape"). This is the Stage-0 precondition resolved without a shape change.

**Engine / L1 boundary.** `theo_user_memory` is **L1 — inviolable** (Rule 1; nothing reads it but the owner + their Personal Theo). The access-policy engine (§7.1–§7.4) is unaffected: `theo_can_read`'s L1 branch is `created_by = caller` and does not read `plate`; the lens is a presentation/organisation overlay ON the owner's own rows, never an access dimension. L2 plate-modulation is conditional + opt-in (vision §6); L3/L4 never read plate state. Boundary: net-new additive column + index; no `reporting_*`; no RLS change (the new column inherits the four ownership policies, column-agnostic); no existing object altered.

**Deferred (flagged, by design — NOT this VEP):**
- **Per-plate MODE** (active/settled/delegated/developing) + **check-in UI** — vision §11 "NOT YET SPECIFIED"; landing a mode table now would guess an unspecified shape (against C1's caution). A future dated step once the mode UX is specified.
- **Lens consumption** — setting the plate (via the Theo memory/distillation write path) + lens-filtered prompt assembly are handler/FE follow-on (the substrate lands here; consumers adopt the column as they ship, exactly as §7.2's table preceded its readers).
- **C3 history-RAG lens filter** — the Azure AI Search `theo-messages` index has no plate field; a lens-filtered recall path is net-new (an index field + filter), design §7 / future — not a Stage-0 reuse.

## §3 — Schema Reality Lock (deployed grounding)

Additive on the DEPLOYED B7a shape (Governor §3/§4) — nothing invented:
- **`theo_user_memory`** (b7a, blob `bbb66f45`; schema §6): `id`/`created_by`/`scope text CHECK IN ('user','project')`/`project_id`/`kind text` (free-text, no CHECK)/`content text` (non-empty)/`source_conversation_id`/`salience int`/`created_at`/`updated_at`, + `theo_user_memory_scope_project_ck`, four ownership RLS policies, `theo_user_memory_exists_unscoped`. **Untouched** by this VEP except the additive column.
- **Additive-column + partial-index idiom** mirrors the deployed additive migrations (`app_key`, `ingestion_class`, `message_seq` columns; `idx_theo_user_memory_owner_scope` index) — `ADD COLUMN IF NOT EXISTS` + `CREATE INDEX IF NOT EXISTS … WHERE …`. No `SECURITY DEFINER` (no function); no top-level transaction control (§5.2).

## §4 — The migration (Walter runs as `pgadmin_vault`)

Runnable file: `theo_user_memory_plate_migration.sql`. Additive; `ADD COLUMN`/`CREATE INDEX IF NOT EXISTS`; **no top-level `BEGIN`/`COMMIT`** (§5.2); idempotent + reversible (commented footer). Full text:

```sql
-- theo_user_memory_plate_migration.sql
-- Vault Memory Architecture — Stage-0 §7.5: the Six-Plates lens (opt-in). Additive nullable `plate text` on the
-- deployed L1 personal-memory substrate theo_user_memory (design §7 item 5; the §1 reconciliation VERDICT).
-- Design constraints honoured exactly:
--   * OPEN taxonomy — NO CHECK on `plate` (C1: a closed plate vocabulary would be a later Walter-run migration).
--   * NO new scope — plates are metadata on the existing scope='user' rows, NOT a third scope (C2: a distinct
--     life/plate scope WOULD relax theo_user_memory_scope_project_ck and change the substrate SHAPE).
--   * NO substrate SHAPE change — the scope/scope_project_ck/columns are untouched; only a nullable column is
--     added. Therefore NO VAULT_MEMORY_ARCHITECTURE.md §6 amendment is triggered ("only if it changes the shape").
-- Semantics: a NULL `plate` = the DEFAULT lens (Work & Craft / professional — work-awareness is default for
-- everyone); a non-NULL `plate` = the user has OPTED IN to filing that memory under a life-plate (Body /
-- Inner Life / Close Others / Wider Belonging / Work & Craft / Material World — offered by the FE, not enforced
-- by the DB). Per-plate MODE (active/settled/delegated/developing) + check-in UI are NOT YET SPECIFIED
-- (vision §11) and are deliberately deferred — this VEP lands only the lens substrate.
-- The new column inherits theo_user_memory's four ownership RLS policies (created_by = auth.uid(); column-agnostic).
-- Executor: Walter, as pgadmin_vault. Additive; ADD COLUMN / CREATE INDEX IF NOT EXISTS; NO top-level BEGIN/COMMIT
-- (Golden Handler §5.2); idempotent + reversible (footer).

ALTER TABLE public.theo_user_memory
  ADD COLUMN IF NOT EXISTS plate text NULL;

-- Accelerate lens-filtered recall over ONLY the opted-in rows (a partial index; NULL plates are the default lens
-- and are not indexed here). Mirrors the deployed additive-index idiom (idx_theo_user_memory_owner_scope).
CREATE INDEX IF NOT EXISTS idx_theo_user_memory_owner_plate
  ON public.theo_user_memory (created_by, plate)
  WHERE plate IS NOT NULL;

-- ── Reversal (documented; run only to roll back — additive column + index, no data loss on rows without a plate) ──
-- DROP INDEX IF EXISTS public.idx_theo_user_memory_owner_plate;
-- ALTER TABLE public.theo_user_memory DROP COLUMN IF EXISTS plate;
```

## §5 — No handler (migration-only)

This package ships **no handler** (design §7 item 5 is the additive metadata; consumption is follow-on — §2). Golden Handler §2's handler-primary-reference does not apply. There is no `SECURITY DEFINER` function and no new access surface — the lens is metadata on the owner's own L1 rows, gated by the unchanged ownership RLS.

## §6 — Verification (read-only; no golden curls — no handler)

Runnable file: `theo_user_memory_plate_verify.sql` (read-only SELECT / catalog only). Post-migration checks: (1) `plate` column present — `text`, nullable, no default; (2) **no CHECK** references `plate` (open — C1); (3) the `scope` CHECK is **unchanged** (no shape change — C2); (4) the partial index present; (5) the four ownership RLS policies unchanged (the column inherits them). Claude runs it read-only after Walter's migration (via the shared-instance `codex_reporting_ro` catalog path). Full text:

```sql
-- theo_user_memory_plate_verify.sql — READ-ONLY verification for Stage-0 §7.5. No writes; safe to re-run.

-- 1) COLUMN present, type text, NULLABLE, NO default — the open/opt-in lens tag.
SELECT column_name, data_type, is_nullable, column_default
  FROM information_schema.columns
 WHERE table_schema='public' AND table_name='theo_user_memory' AND column_name='plate';   -- expect: text, YES, (null)

-- 2) NO CHECK constraint references `plate` (open taxonomy — C1). Expect zero rows.
SELECT c.conname, pg_get_constraintdef(c.oid) AS def
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
 WHERE n.nspname='public' AND t.relname='theo_user_memory' AND c.contype='c'
   AND pg_get_constraintdef(c.oid) ILIKE '%plate%';   -- expect: 0 rows

-- 3) The scope CHECK is UNCHANGED (no shape change — C2). Expect theo_user_memory_scope_project_ck still present,
--    and NO new scope value beyond ('user','project').
SELECT c.conname, pg_get_constraintdef(c.oid) AS def
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
 WHERE n.nspname='public' AND t.relname='theo_user_memory' AND c.contype='c'
   AND (c.conname = 'theo_user_memory_scope_project_ck' OR pg_get_constraintdef(c.oid) ILIKE '%scope%');

-- 4) The partial index is present.
SELECT indexname, indexdef
  FROM pg_indexes
 WHERE schemaname='public' AND tablename='theo_user_memory' AND indexname='idx_theo_user_memory_owner_plate';

-- 5) RLS unchanged — the four ownership policies still present (the new column inherits them; column-agnostic).
SELECT policyname, cmd
  FROM pg_policies
 WHERE schemaname='public' AND tablename='theo_user_memory'
 ORDER BY policyname;   -- expect: theo_user_memory_select_own / _insert_own / _update_own / _delete_own
```

## §7 — Gap Register

**PROCEED.** No missing CURRENT authority; no ESCALATE.
- **G-1 (per-plate mode + check-in): PROCEED (deferred, by design)** — vision §11 "not yet specified"; landing a mode table now would guess an unspecified shape. Future dated step.
- **G-2 (lens consumption — write plate / lens-filtered prompt assembly): PROCEED (follow-on)** — the substrate lands here; consumers (the memory write path + prompt assembly) adopt the column as they ship (as §7.2's table preceded its readers). No access surface added.
- **G-3 (C3 history-RAG lens filter): PROCEED (deferred, design §7)** — net-new Azure AI Search index field + filter; out of Stage-0 scope.
- **G-SCHEMADOC: PRE-LAND (Role-C, post-migration)** — the `plate` column is recorded in `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 row note + §6 Tier-B7a addendum) via Role-C after the Walter-run migration + read-only verification. Disclosed; does not block Pass-2.

## §8 — Deploy plan (ordered; §1C/§1D)

1. **Codex Pass-2** → APPROVED/REJECTED.
2. **Walter** runs `theo_user_memory_plate_migration.sql` as `pgadmin_vault`.
3. **Claude** runs `theo_user_memory_plate_verify.sql` read-only (catalog) to confirm.
4. **Role-C** lands the schema-doc entry (G-SCHEMADOC). No API-Spec change (no endpoint).

## Codex activation note (Walter forwards)

```
Codex is activated for Pass-2 review of the Vault Six-Plates Lens (Stage-0 §7.5), vault-theo,
"Codex Governance/Vault-SixPlates-Lens-Stage0-7-5-Pass-1-VEP/Vault_SixPlates_Lens_Stage0_7_5_VEP.md".
Open your Pass-2 turn with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo
Grounding Conformance §3/§5). This is a migration-only backend package (a Walter-run additive column; NO
handler, NO golden curls — read-only catalog verification). Review for: (1) the migration (§4) — is it
EXACTLY the design §1 verdict: one additive nullable `plate text` with OPEN taxonomy (no CHECK — C1), NO
new scope and the scope CHECK untouched (C2 — no substrate-shape change, so no §6 amendment), additive +
idempotent + reversible, no top-level BEGIN/COMMIT (§5.2)? (2) the L1/engine boundary (§2) — theo_user_memory
is L1-inviolable; the lens is a presentation overlay on the owner's own rows, NOT an access dimension, and
theo_can_read's L1 branch (created_by=caller) does not read plate; the new column inherits the four ownership
RLS policies (no RLS change). (3) the deferrals (§7) — per-plate mode + check-in (vision §11 unspecified),
lens consumption (write/prompt-assembly follow-on), and the C3 history-RAG filter are correctly deferred
without blocking. (4) the deploy plan (§8) — Walter-runs-migration / Claude read-only verify / schema-doc
Role-C deferred post-migration (G-SCHEMADOC); no API-Spec change (no endpoint). Emit APPROVED or REJECTED only.
```
