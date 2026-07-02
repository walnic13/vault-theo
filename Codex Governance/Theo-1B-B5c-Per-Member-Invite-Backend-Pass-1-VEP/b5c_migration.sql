-- Theo B5c — Per-member project invite. ADDITIVE + REVERSIBLE.
-- Adds theo_project_members (a project owner invites specific Vault users to a project by Entra OID)
-- and broadens the SELECT-only RLS on theo_projects + theo_project_knowledge so a project SHARED
-- WITH the caller (a member row) is readable, in addition to owned + group-visible (B5a). Project
-- INSERT/UPDATE/DELETE and knowledge INSERT/UPDATE/DELETE stay OWNER-ONLY. Membership rows are
-- owner-managed. Conversations / messages RLS is UNCHANGED (config-only sharing: members chat with
-- their own conversations; no one reads another user's transcripts). Idempotent; safe to re-run.
--
-- RLS non-recursion (NO new elevated-read helper): theo_projects' SELECT policy references
-- theo_project_members, so theo_project_members' OWN policies MUST NOT reference theo_projects (that
-- would create the mutual projects<->members cycle Postgres rejects as "infinite recursion detected
-- in policy"). We keep the membership SELECT policy SELF-CONTAINED: a member sees rows where
-- member_oid = auth.uid(); the owner sees rows where invited_by = auth.uid(). Because only a project
-- owner can insert a membership row (INSERT policy below) and invited_by is stamped with that owner's
-- OID, `invited_by = auth.uid()` is exactly "the members of the projects I own" — no theo_projects
-- lookup, no cycle. The membership INSERT/DELETE policies MAY reference theo_projects for the owner
-- check: that path is projects.SELECT -> members.SELECT (self-contained) and terminates. This uses
-- only the ordinary ownership-family RLS primitives (auth.uid()); it introduces NO SECURITY DEFINER
-- helper and NO new elevated-read class.

-- 1) Membership table: (project_id, member_oid) grants READ access to a specific user.
CREATE TABLE IF NOT EXISTS public.theo_project_members (
  project_id uuid NOT NULL REFERENCES public.theo_projects(id) ON DELETE CASCADE,
  member_oid text NOT NULL,
  invited_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, member_oid)
);

-- Lookup index for the member -> projects direction (RLS member subquery + list).
CREATE INDEX IF NOT EXISTS theo_project_members_member_idx
  ON public.theo_project_members (member_oid);

ALTER TABLE public.theo_project_members ENABLE ROW LEVEL SECURITY;

-- 2) Membership RLS (owner-managed; a member may see their OWN membership row).
--    SELECT: the member themselves OR the owner who invited them (invited_by). SELF-CONTAINED — no
--    reference to theo_projects, so no projects<->members recursion. invited_by is always the owning
--    inviter (set by theo_share_project + enforced by the INSERT policy; ownership does not transfer).
DROP POLICY IF EXISTS "theo_project_member_select_own" ON public.theo_project_members;
CREATE POLICY "theo_project_member_select_own" ON public.theo_project_members
  FOR SELECT TO authenticated
  USING (
    member_oid = auth.uid()
    OR invited_by = auth.uid()
  );

--    INSERT: only the project OWNER may add a member; invited_by must be the owner themselves. The
--    theo_projects subquery is safe (projects.SELECT -> members.SELECT is self-contained; terminates).
DROP POLICY IF EXISTS "theo_project_member_insert_own" ON public.theo_project_members;
CREATE POLICY "theo_project_member_insert_own" ON public.theo_project_members
  FOR INSERT TO authenticated
  WITH CHECK (
    invited_by = auth.uid()
    AND project_id IN (SELECT id FROM public.theo_projects WHERE created_by = auth.uid())
  );

--    DELETE: only the project OWNER may remove a member.
DROP POLICY IF EXISTS "theo_project_member_delete_own" ON public.theo_project_members;
CREATE POLICY "theo_project_member_delete_own" ON public.theo_project_members
  FOR DELETE TO authenticated
  USING (
    project_id IN (SELECT id FROM public.theo_projects WHERE created_by = auth.uid())
  );
--    (No UPDATE policy: membership rows are immutable — share/unshare is INSERT/DELETE.)

-- 3) Broaden theo_projects SELECT: own OR group-visible OR shared-with-me (member row).
--    (INSERT/UPDATE/DELETE unchanged — owner-only.) The member subquery reads theo_project_members
--    under its SELF-CONTAINED SELECT policy, so this does not recurse.
DROP POLICY IF EXISTS "theo_project_select_own" ON public.theo_projects;
CREATE POLICY "theo_project_select_own" ON public.theo_projects
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR visibility = 'group'
    OR id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid())
  );

-- 4) Broaden theo_project_knowledge SELECT: own OR belongs to a group-visible OR shared-with-me project.
--    (INSERT/UPDATE/DELETE unchanged — only the project owner adds/removes knowledge.) Both subqueries
--    terminate: the group subquery hits projects.SELECT (-> members.SELECT self-contained); the member
--    subquery hits members.SELECT (self-contained).
DROP POLICY IF EXISTS "theo_project_knowledge_select_own" ON public.theo_project_knowledge;
CREATE POLICY "theo_project_knowledge_select_own" ON public.theo_project_knowledge
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR project_id IN (SELECT id FROM public.theo_projects WHERE visibility = 'group')
    OR project_id IN (SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid())
  );
