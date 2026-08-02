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
