-- Shared Project Workspace Phase 1 — post-deploy verification (read-only; catalog only).
-- Claude Code runs this via .local\run-reporting-ro-query.ps1 after Walter deploys the migration.

-- 1. role column present, NOT NULL, default 'member'
SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS type, a.attnotnull AS not_null,
       pg_get_expr(d.adbin, d.adrelid) AS default_expr
FROM pg_attribute a
LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE a.attrelid = 'public.theo_project_members'::regclass
  AND a.attname = 'role' AND a.attnum > 0 AND NOT a.attisdropped;

-- 2. role CHECK constraint
SELECT conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE conrelid = 'public.theo_project_members'::regclass
  AND conname = 'theo_project_members_role_ck';

-- 3. the five SECURITY DEFINER gate functions: name, args, return, security-definer flag, search_path
SELECT p.proname,
       pg_get_function_arguments(p.oid) AS args,
       pg_get_function_result(p.oid)    AS returns,
       p.prosecdef                       AS security_definer,
       p.proconfig                       AS config
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN (
    'theo_project_effective_role',
    'theo_project_list_members',
    'theo_project_add_member',
    'theo_project_set_member_role',
    'theo_project_remove_member'
  )
ORDER BY p.proname;

-- 4. execute grants: authenticated may EXECUTE; PUBLIC does not
SELECT p.proname, r.rolname AS grantee, a.privilege_type
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN LATERAL aclexplode(p.proacl) a ON true
JOIN pg_roles r ON r.oid = a.grantee
WHERE n.nspname = 'public'
  AND p.proname LIKE 'theo_project_%member%' OR p.proname = 'theo_project_effective_role'
ORDER BY p.proname, r.rolname;

-- 5. RLS unchanged: theo_project_members still has its three B5c policies and no new ones
SELECT polname,
       CASE polcmd WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT' WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE' WHEN '*' THEN 'ALL' END AS cmd
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname = 'theo_project_members'
ORDER BY polname;
