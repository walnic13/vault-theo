-- Theo B5a — Project Visibility (group-visible sharing). ADDITIVE + REVERSIBLE.
-- Adds theo_projects.visibility ('private' default | 'group') and broadens the SELECT-only RLS on
-- theo_projects + theo_project_knowledge so a group-visible project (and its knowledge/instructions)
-- is readable by any authenticated Vault user. INSERT/UPDATE/DELETE stay owner-only. Conversations /
-- messages RLS is UNCHANGED (config-only sharing: members chat with their own conversations; no one
-- reads another user's transcripts). Idempotent; safe to re-run.

-- 1) Additive column: visibility (default preserves existing rows as private).
ALTER TABLE public.theo_projects
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private';

-- 2) Constrain to the closed vocabulary (guarded so re-run is safe).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'theo_projects_visibility_chk'
  ) THEN
    ALTER TABLE public.theo_projects
      ADD CONSTRAINT theo_projects_visibility_chk CHECK (visibility IN ('private','group'));
  END IF;
END $$;

-- 3) Broaden theo_projects SELECT policy: own OR group-visible. (INSERT/UPDATE/DELETE unchanged — owner-only.)
DROP POLICY IF EXISTS "theo_project_select_own" ON public.theo_projects;
CREATE POLICY "theo_project_select_own" ON public.theo_projects
  FOR SELECT TO authenticated
  USING (created_by = auth.uid() OR visibility = 'group');

-- 4) Broaden theo_project_knowledge SELECT policy: own OR belongs to a group-visible project.
--    (INSERT/UPDATE/DELETE unchanged — only the project owner adds/removes knowledge.)
DROP POLICY IF EXISTS "theo_project_knowledge_select_own" ON public.theo_project_knowledge;
CREATE POLICY "theo_project_knowledge_select_own" ON public.theo_project_knowledge
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR project_id IN (SELECT id FROM public.theo_projects WHERE visibility = 'group')
  );
