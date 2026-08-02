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
