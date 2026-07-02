-- Theo B5c — Per-member project invite. ADDITIVE + REVERSIBLE.
-- Adds theo_project_members (a project owner invites specific Vault users to a project by Entra OID)
-- and broadens the SELECT-only RLS on theo_projects + theo_project_knowledge so a project SHARED
-- WITH the caller (a member row) is readable, in addition to owned + group-visible (B5a). Project
-- INSERT/UPDATE/DELETE and knowledge INSERT/UPDATE/DELETE stay OWNER-ONLY. Membership rows are
-- owner-managed. Conversations / messages RLS is UNCHANGED (config-only sharing: members chat with
-- their own conversations; no one reads another user's transcripts). Idempotent; safe to re-run.
--
-- RLS non-recursion: theo_projects' SELECT policy references membership, and theo_project_members'
-- policies reference project ownership. To avoid Postgres "infinite recursion detected in policy",
-- each cross-table lookup goes through a SECURITY DEFINER helper (bypasses the other table's RLS),
-- mirroring the deployed theo_*_exists_unscoped SECURITY DEFINER helper pattern.

-- 0) SECURITY DEFINER helpers that break the projects<->members RLS cycle.
--    (a) the project_ids a given member is invited to (used by the two broadened SELECT policies).
CREATE OR REPLACE FUNCTION public.theo_project_member_project_ids(p_member_oid text)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT project_id FROM public.theo_project_members WHERE member_oid = p_member_oid
$$;

--    (b) the project_ids a given user owns (used by the membership-table owner policies).
CREATE OR REPLACE FUNCTION public.theo_owned_project_ids(p_owner_oid text)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.theo_projects WHERE created_by = p_owner_oid
$$;

-- 1) Membership table: (project_id, member_oid) grants READ access to a specific user.
CREATE TABLE IF NOT EXISTS public.theo_project_members (
  project_id uuid NOT NULL REFERENCES public.theo_projects(id) ON DELETE CASCADE,
  member_oid text NOT NULL,
  invited_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, member_oid)
);

-- Lookup index for the member -> projects direction (RLS helper + list).
CREATE INDEX IF NOT EXISTS theo_project_members_member_idx
  ON public.theo_project_members (member_oid);

ALTER TABLE public.theo_project_members ENABLE ROW LEVEL SECURITY;

-- 2) Membership RLS (owner-managed; a member may see their OWN membership row).
--    SELECT: the member themselves OR the owner of the project (via SECURITY DEFINER owner helper).
DROP POLICY IF EXISTS "theo_project_member_select_own" ON public.theo_project_members;
CREATE POLICY "theo_project_member_select_own" ON public.theo_project_members
  FOR SELECT TO authenticated
  USING (
    member_oid = auth.uid()
    OR project_id IN (SELECT public.theo_owned_project_ids(auth.uid()))
  );

--    INSERT: only the project OWNER may add a member; invited_by must be the owner themselves.
DROP POLICY IF EXISTS "theo_project_member_insert_own" ON public.theo_project_members;
CREATE POLICY "theo_project_member_insert_own" ON public.theo_project_members
  FOR INSERT TO authenticated
  WITH CHECK (
    invited_by = auth.uid()
    AND project_id IN (SELECT public.theo_owned_project_ids(auth.uid()))
  );

--    DELETE: only the project OWNER may remove a member.
DROP POLICY IF EXISTS "theo_project_member_delete_own" ON public.theo_project_members;
CREATE POLICY "theo_project_member_delete_own" ON public.theo_project_members
  FOR DELETE TO authenticated
  USING (
    project_id IN (SELECT public.theo_owned_project_ids(auth.uid()))
  );
--    (No UPDATE policy: membership rows are immutable — share/unshare is INSERT/DELETE.)

-- 3) Broaden theo_projects SELECT: own OR group-visible OR shared-with-me (member row).
--    (INSERT/UPDATE/DELETE unchanged — owner-only.)
DROP POLICY IF EXISTS "theo_project_select_own" ON public.theo_projects;
CREATE POLICY "theo_project_select_own" ON public.theo_projects
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR visibility = 'group'
    OR id IN (SELECT public.theo_project_member_project_ids(auth.uid()))
  );

-- 4) Broaden theo_project_knowledge SELECT: own OR belongs to a group-visible OR shared-with-me project.
--    (INSERT/UPDATE/DELETE unchanged — only the project owner adds/removes knowledge.)
DROP POLICY IF EXISTS "theo_project_knowledge_select_own" ON public.theo_project_knowledge;
CREATE POLICY "theo_project_knowledge_select_own" ON public.theo_project_knowledge
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR project_id IN (SELECT id FROM public.theo_projects WHERE visibility = 'group')
    OR project_id IN (SELECT public.theo_project_member_project_ids(auth.uid()))
  );
