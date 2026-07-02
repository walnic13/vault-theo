-- tables present (expect 7)
SELECT table_name FROM information_schema.tables
 WHERE table_schema='public' AND table_name LIKE 'theo\_%' ORDER BY table_name;
-- RLS enabled + policy count per table (expect rowsecurity = true; 4 policies each)
SELECT c.relname, c.relrowsecurity, count(p.policyname) AS policies
  FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  LEFT JOIN pg_policies p ON p.schemaname='public' AND p.tablename=c.relname
 WHERE n.nspname='public' AND c.relname LIKE 'theo\_%' AND c.relkind='r'
 GROUP BY c.relname, c.relrowsecurity ORDER BY c.relname;
-- _exists_unscoped helpers present (expect 4: project, conversation, project_knowledge, artifact)
SELECT proname FROM pg_proc WHERE proname LIKE 'theo\_%\_exists_unscoped' ORDER BY proname;
