-- Theo B5c — read-only verification (run after b5c_migration.sql). SELECT-only; no writes.

-- V1) theo_project_members table + RLS enabled.
SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'theo_project_members';

-- V2) columns of theo_project_members.
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_project_members'
ORDER BY ordinal_position;

-- V3) primary key + foreign key on theo_project_members.
SELECT con.conname, con.contype
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'theo_project_members'
ORDER BY con.contype, con.conname;

-- V4) the member index.
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'theo_project_members'
ORDER BY indexname;

-- V5) membership policies (3: select/insert/delete) + broadened project/knowledge SELECT policies.
--     Confirms the membership SELECT policy is present (self-contained) and the projects/knowledge
--     SELECT policies were re-created with the member clause. No SECURITY DEFINER helper is used.
SELECT c.relname AS tablename, p.polname, p.polcmd
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('theo_project_members', 'theo_projects', 'theo_project_knowledge')
ORDER BY c.relname, p.polname;
