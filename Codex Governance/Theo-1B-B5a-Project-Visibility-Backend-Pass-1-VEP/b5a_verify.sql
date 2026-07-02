-- Theo B5a — read-only post-migration verification (run via the RO grounding path).
-- V1: the visibility column exists, is NOT NULL, defaults 'private'.
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_projects' AND column_name = 'visibility';

-- V2: the CHECK constraint is present.
SELECT conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint WHERE conname = 'theo_projects_visibility_chk';

-- V3: the broadened SELECT policies (own OR group-visible).
SELECT c.relname AS tablename, p.polname, pg_get_expr(p.polqual, p.polrelid) AS using_expr
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_projects','theo_project_knowledge') AND p.polcmd = 'r'
ORDER BY c.relname, p.polname;

-- V4: conversations/messages RLS UNCHANGED (still owner-only) — confirm no group clause leaked in.
SELECT c.relname AS tablename, p.polname, p.polcmd, pg_get_expr(p.polqual, p.polrelid) AS using_expr
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_conversations','theo_messages')
ORDER BY c.relname, p.polname;
