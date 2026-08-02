-- SPW Phase 2b-1 — post-deploy verification (read-only; catalog only).
-- Claude Code runs this via .local\run-reporting-ro-query.ps1 after Walter deploys the migration.

-- 1) the three gate functions exist, are SECURITY DEFINER, pin search_path=public, and return the
--    expected type (boolean for publish/unpublish; a row set for list).
SELECT p.proname,
       pg_get_function_identity_arguments(p.oid) AS args,
       p.prosecdef                                AS security_definer,
       pg_get_function_result(p.oid)              AS returns,
       (SELECT array_agg(cfg) FROM unnest(p.proconfig) cfg
         WHERE cfg LIKE 'search_path=%')          AS search_path
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('theo_publish_conversation','theo_unpublish_conversation','theo_list_project_conversations')
ORDER BY p.proname;
-- Expect: all three prosecdef = t; search_path = {search_path=public};
--   theo_publish_conversation(p_conversation_id uuid) -> boolean
--   theo_unpublish_conversation(p_conversation_id uuid) -> boolean
--   theo_list_project_conversations(p_project_id uuid) -> TABLE(id uuid, title text, created_by text,
--       created_at timestamp with time zone, updated_at timestamp with time zone,
--       published_at timestamp with time zone, published_by text)

-- 2) EXECUTE granted to `authenticated` and NOT to PUBLIC (privileged gate discipline).
SELECT p.proname, r.rolname AS grantee, a.privilege_type
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
CROSS JOIN LATERAL aclexplode(p.proacl) a
JOIN pg_roles r ON r.oid = a.grantee
WHERE n.nspname = 'public'
  AND p.proname IN ('theo_publish_conversation','theo_unpublish_conversation','theo_list_project_conversations')
ORDER BY p.proname, r.rolname;
-- Expect: grantee `authenticated` with EXECUTE for each; NO row for `PUBLIC` (empty grantee).

-- 3) the Phase 2a publish columns are still present (unchanged by this migration).
SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS type, a.attnotnull AS not_null
FROM pg_attribute a
WHERE a.attrelid = 'public.theo_conversations'::regclass
  AND a.attname IN ('published_to_project','published_at','published_by')
  AND NOT a.attisdropped
ORDER BY a.attname;

-- 4) no RLS policy changed by this migration — the §11 policy set is intact (spot the count = 4+4).
SELECT c.relname AS tbl, count(*) AS policies
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_conversations','theo_messages')
GROUP BY c.relname
ORDER BY c.relname;
-- Expect: theo_conversations = 4, theo_messages = 4 (unchanged).
