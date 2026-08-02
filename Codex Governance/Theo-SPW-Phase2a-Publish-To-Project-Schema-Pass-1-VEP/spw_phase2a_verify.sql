-- SPW Phase 2a — post-deploy verification (read-only; catalog only).
-- Claude Code runs this via .local\run-reporting-ro-query.ps1 after Walter deploys the migration.

-- 1) publish columns present on theo_conversations
SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS type, a.attnotnull AS not_null,
       pg_get_expr(d.adbin, d.adrelid) AS default_expr
FROM pg_attribute a
LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE a.attrelid = 'public.theo_conversations'::regclass
  AND a.attname IN ('published_to_project','published_at','published_by')
  AND NOT a.attisdropped
ORDER BY a.attname;

-- 2) partial published index
SELECT indexname, indexdef FROM pg_indexes
WHERE schemaname='public' AND tablename='theo_conversations' AND indexname='idx_theo_conversations_published';

-- 3) broadened policies — SELECT on conversations + messages, INSERT on messages (show the predicate)
SELECT c.relname AS tbl, p.polname,
       CASE p.polcmd WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT' WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE' END AS cmd,
       pg_get_expr(p.polqual, p.polrelid) AS using_expr,
       pg_get_expr(p.polwithcheck, p.polrelid) AS check_expr
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_conversations','theo_messages')
ORDER BY c.relname, p.polname;
-- Expect: theo_conversation_select_own USING references published_to_project + theo_project_members;
-- theo_message_select_own USING references theo_conversations(published_to_project);
-- theo_message_insert_own WITH CHECK references created_by=auth.uid() + published conversation;
-- theo_conversation_{insert,update,delete}_own + theo_message_{update,delete}_own still created_by=auth.uid().

-- 4) RLS still enabled on both tables
SELECT relname, relrowsecurity AS rls FROM pg_class
WHERE relnamespace='public'::regnamespace AND relname IN ('theo_conversations','theo_messages');
