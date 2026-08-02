-- SPW Phase 2b-3a — post-deploy verification (read-only; catalog only).
-- Claude Code runs this via .local\run-reporting-ro-query.ps1 after Walter deploys the migration.

-- 1) the access helper exists, is SECURITY DEFINER, pins search_path=public, returns text.
SELECT p.proname,
       pg_get_function_identity_arguments(p.oid) AS args,
       p.prosecdef                                AS security_definer,
       pg_get_function_result(p.oid)              AS returns,
       (SELECT array_agg(cfg) FROM unnest(p.proconfig) cfg
         WHERE cfg LIKE 'search_path=%')          AS search_path
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname = 'theo_conversation_access'
ORDER BY p.proname;
-- Expect: prosecdef = t; search_path = {search_path=public};
--   theo_conversation_access(p_conversation_id uuid) -> text

-- 2) EXECUTE granted to `authenticated` and NOT to PUBLIC (privileged gate discipline).
SELECT p.proname, r.rolname AS grantee, a.privilege_type
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
CROSS JOIN LATERAL aclexplode(p.proacl) a
JOIN pg_roles r ON r.oid = a.grantee
WHERE n.nspname = 'public'
  AND p.proname = 'theo_conversation_access'
ORDER BY r.rolname;
-- Expect: grantee `authenticated` with EXECUTE; NO row for `PUBLIC` (empty grantee).

-- 3) no RLS policy changed by this migration — the §11 policy set is intact (4 + 4).
SELECT c.relname AS tbl, count(*) AS policies
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_conversations','theo_messages')
GROUP BY c.relname
ORDER BY c.relname;
-- Expect: theo_conversations = 4, theo_messages = 4 (unchanged).

-- 4) the publish columns the helper reads are present (unchanged by this migration).
SELECT a.attname
FROM pg_attribute a
WHERE a.attrelid = 'public.theo_conversations'::regclass
  AND a.attname IN ('published_to_project','project_id','created_by')
  AND NOT a.attisdropped
ORDER BY a.attname;
