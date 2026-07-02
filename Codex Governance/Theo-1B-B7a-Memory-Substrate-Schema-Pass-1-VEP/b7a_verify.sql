-- B7a post-deploy verification (read-only; run as codex_reporting_ro or any role).

-- 1. table present + RLS enabled
SELECT c.relname, c.relrowsecurity AS rls
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname='theo_user_memory';

-- 2. four ownership policies
SELECT polname,
       CASE polcmd WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT' WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE' END AS cmd,
       pg_get_expr(polqual, polrelid) AS using_expr,
       pg_get_expr(polwithcheck, polrelid) AS check_expr
FROM pg_policy p JOIN pg_class c ON c.oid=p.polrelid
WHERE c.relname='theo_user_memory' ORDER BY polname;

-- 3. _exists_unscoped helper present
SELECT p.proname, pg_get_function_result(p.oid) AS returns
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname='theo_user_memory_exists_unscoped';

-- 4. scope/project_id CHECK constraint present
SELECT conname, pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE conrelid='public.theo_user_memory'::regclass AND contype='c';
