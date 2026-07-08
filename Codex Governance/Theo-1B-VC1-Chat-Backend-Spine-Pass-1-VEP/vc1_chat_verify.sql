-- Theo VC-1 — read-only verification (run after vc1_chat_migration.sql). SELECT-only; no writes.

-- V1) the three tables exist + RLS enabled.
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY c.relname;

-- V2) columns of each table.
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY table_name, ordinal_position;

-- V3) keys, FKs, uniques, checks.
SELECT c.relname AS table_name, con.conname, con.contype
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY c.relname, con.contype, con.conname;

-- V4) indexes (dm_key unique-partial, members gin, oid, messages thread_seq).
SELECT tablename, indexname FROM pg_indexes
WHERE schemaname = 'public' AND tablename IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY tablename, indexname;

-- V5) policies present (threads: select/insert/update; members: select/insert/update/delete;
--     messages: select/insert). No SECURITY DEFINER function created by this migration.
SELECT c.relname AS tablename, p.polname, p.polcmd
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname IN ('theo_chat_threads','theo_chat_thread_members','theo_chat_messages')
ORDER BY c.relname, p.polname;
