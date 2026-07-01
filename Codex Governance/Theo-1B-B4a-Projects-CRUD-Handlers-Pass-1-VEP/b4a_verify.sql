-- Read-only verification for Tier B4a (SELECT-only; no writes, no transaction control).
-- V1 — the additive description column exists on theo_projects (text, NOT NULL DEFAULT '').
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_projects'
ORDER BY ordinal_position;

-- V2 — RLS remains enabled with the four ownership policies (unchanged by an additive column).
SELECT polname, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'theo_projects'
ORDER BY polname;

-- V3 — the 403/404 discrimination helper used by update/delete is present.
SELECT proname
FROM pg_proc
WHERE proname = 'theo_project_exists_unscoped';
