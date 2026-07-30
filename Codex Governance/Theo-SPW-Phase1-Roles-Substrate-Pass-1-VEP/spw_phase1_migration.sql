-- ============================================================================
-- Theo Shared Project Workspace — Phase 1: role model on theo_project_members.
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; NO top-level BEGIN/COMMIT (migration governance). Idempotent + reversible.
--
-- WHAT: adds a role (owner|member) to project membership and the governed SECURITY DEFINER
-- write-path functions that enforce the Creator / Owner / Member gates. This is the "permission
-- gates" foundation of the Shared Project Workspace program; the handler wiring (Phase 1b) and the
-- later publish/decision-log/fork phases ride on it.
--
-- MODEL: the project CREATOR is `theo_projects.created_by` — the implicit top authority; NEVER a
-- theo_project_members row. A membership row `role='owner'` = a promoted Owner; `role='member'` = a
-- Member. Only the Creator mints/demotes Owners; Creator + Owners manage Members; Members cannot add /
-- remove / promote anyone (enforced in the functions below).
--
-- RLS: UNCHANGED. The `role` column is additive; the new privileged writes are FUNCTION-gated
-- (SECURITY DEFINER, migration-role-owned) — the deployed "governed service write-path idiom"
-- (theo_chat_leave / dms_sub_*). Routing writes through definer functions deliberately avoids adding
-- any new projects<->members RLS subquery, so the B5c non-recursion invariant is preserved exactly.
--
-- AUTHORIZATION: sharing/membership RLS is out of default 1B scope "unless Walter authorizes"
-- (Backend Plan; Schema §1). Walter authorized this role extension 2026-07-30 (Shared Project
-- Workspace design). Precedent: the B5a group-visible + B5c per-member membership models.
-- ============================================================================

-- 1) role column. Existing membership rows backfill to 'member' via the default (matches today's
--    read-only reality — every currently-shared user is a Member). Guarded CHECK.
ALTER TABLE public.theo_project_members
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'member';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'theo_project_members_role_ck'
      AND conrelid = 'public.theo_project_members'::regclass
  ) THEN
    ALTER TABLE public.theo_project_members
      ADD CONSTRAINT theo_project_members_role_ck CHECK (role IN ('owner','member'));
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- Gate functions. All: LANGUAGE plpgsql SECURITY DEFINER, pinned search_path, migration-role-owned,
-- REVOKE ALL FROM PUBLIC + GRANT EXECUTE TO authenticated. The caller OID is read from the request
-- claim `request.jwt.claim.sub` (set per-request via set_config; NEVER passed as a parameter — the
-- same trusted source as theo_chat_leave), so a caller can only act as themselves.
-- SQLSTATEs (for the Phase-1b handler → HTTP mapping): 28000 = unauthenticated (401); 42501 =
-- insufficient privilege (403); 22023 = invalid argument (400); P0002 = no_data / not found (404).
-- ----------------------------------------------------------------------------

-- 1a) effective_role: the caller's role on a project — 'creator' | 'owner' | 'member' | NULL.
--     The read primitive every handler (and the FE) gates on. NULL = the caller has no access.
CREATE OR REPLACE FUNCTION public.theo_project_effective_role(p_project_id uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller text := current_setting('request.jwt.claim.sub', true);
  v_role   text;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RETURN NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM public.theo_projects WHERE id = p_project_id AND created_by = v_caller) THEN
    RETURN 'creator';
  END IF;
  SELECT role INTO v_role
    FROM public.theo_project_members
   WHERE project_id = p_project_id AND member_oid = v_caller;
  RETURN v_role; -- 'owner' | 'member' | NULL
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_effective_role(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_effective_role(uuid) TO authenticated;

-- 1b) list_members: the full roster (member_oid, invited_by, role, created_at) for a project.
--     Creator + Owners only (a Member cannot enumerate co-members). Raises 42501 otherwise. This is
--     the definer read the Phase-1b theo_list_project_members handler uses, so an Owner sees the whole
--     roster regardless of who invited each row (the RLS member-SELECT policy only exposes own/invited).
CREATE OR REPLACE FUNCTION public.theo_project_list_members(p_project_id uuid)
RETURNS TABLE (member_oid text, invited_by text, role text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller_role text := public.theo_project_effective_role(p_project_id);
BEGIN
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'not a project member' USING ERRCODE = 'P0002';
  END IF;
  IF v_caller_role NOT IN ('creator','owner') THEN
    RAISE EXCEPTION 'only the creator or an owner may list members' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
    SELECT m.member_oid, m.invited_by, m.role, m.created_at
      FROM public.theo_project_members m
     WHERE m.project_id = p_project_id
     ORDER BY m.created_at;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_list_members(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_list_members(uuid) TO authenticated;

-- 1c) add_member: Creator or Owner adds a MEMBER. Always role='member' — promotion to Owner is a
--     separate Creator-only step (set_member_role). Idempotent (existing row untouched → false).
--     Rejects adding the Creator (never a member row) or a blank OID.
CREATE OR REPLACE FUNCTION public.theo_project_add_member(p_project_id uuid, p_member_oid text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller      text := current_setting('request.jwt.claim.sub', true);
  v_caller_role text;
  v_added       boolean := false;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;
  IF p_member_oid IS NULL OR p_member_oid = '' THEN
    RAISE EXCEPTION 'member_oid is required' USING ERRCODE = '22023';
  END IF;
  v_caller_role := public.theo_project_effective_role(p_project_id);
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'project not found or no access' USING ERRCODE = 'P0002';
  END IF;
  IF v_caller_role NOT IN ('creator','owner') THEN
    RAISE EXCEPTION 'only the creator or an owner may add members' USING ERRCODE = '42501';
  END IF;
  -- The creator is never a member row.
  IF EXISTS (SELECT 1 FROM public.theo_projects WHERE id = p_project_id AND created_by = p_member_oid) THEN
    RAISE EXCEPTION 'the project creator cannot be added as a member' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.theo_project_members (project_id, member_oid, invited_by, role)
  VALUES (p_project_id, p_member_oid, v_caller, 'member')
  ON CONFLICT (project_id, member_oid) DO NOTHING;
  GET DIAGNOSTICS v_added = ROW_COUNT;
  RETURN v_added; -- true = newly added; false = already a member (idempotent)
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_add_member(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_add_member(uuid, text) TO authenticated;

-- 1d) set_member_role: CREATOR-ONLY promote/demote of an existing member between 'owner'/'member'.
--     Raises 404 if the target is not a member, 400 on a bad role, 403 if the caller isn't the creator.
CREATE OR REPLACE FUNCTION public.theo_project_set_member_role(p_project_id uuid, p_member_oid text, p_new_role text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller_role text := public.theo_project_effective_role(p_project_id);
  v_changed     boolean := false;
BEGIN
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'project not found or no access' USING ERRCODE = 'P0002';
  END IF;
  IF v_caller_role <> 'creator' THEN
    RAISE EXCEPTION 'only the creator may set member roles' USING ERRCODE = '42501';
  END IF;
  IF p_new_role NOT IN ('owner','member') THEN
    RAISE EXCEPTION 'role must be owner or member' USING ERRCODE = '22023';
  END IF;
  UPDATE public.theo_project_members
     SET role = p_new_role
   WHERE project_id = p_project_id AND member_oid = p_member_oid;
  GET DIAGNOSTICS v_changed = ROW_COUNT;
  IF NOT v_changed THEN
    RAISE EXCEPTION 'member not found in this project' USING ERRCODE = 'P0002';
  END IF;
  RETURN true;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_set_member_role(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_set_member_role(uuid, text, text) TO authenticated;

-- 1e) remove_member: the Creator removes anyone; an Owner may remove only MEMBERS. Removing an Owner
--     is a Creator-only action (parity with promote/demote — Owner status is mutated ONLY by the
--     Creator, never by another Owner). Idempotent (no row → false). The creator has no member row,
--     so is never removable here.
CREATE OR REPLACE FUNCTION public.theo_project_remove_member(p_project_id uuid, p_member_oid text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller_role text := public.theo_project_effective_role(p_project_id);
  v_removed     boolean := false;
BEGIN
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'project not found or no access' USING ERRCODE = 'P0002';
  END IF;
  IF v_caller_role NOT IN ('creator','owner') THEN
    RAISE EXCEPTION 'only the creator or an owner may remove members' USING ERRCODE = '42501';
  END IF;
  -- An Owner may NOT remove another Owner (that would strip ownership without Creator action); only
  -- the Creator may remove an Owner. The Creator bypasses this guard (v_caller_role = 'creator').
  IF v_caller_role = 'owner'
     AND EXISTS (SELECT 1 FROM public.theo_project_members
                  WHERE project_id = p_project_id AND member_oid = p_member_oid AND role = 'owner') THEN
    RAISE EXCEPTION 'only the creator may remove an owner' USING ERRCODE = '42501';
  END IF;
  DELETE FROM public.theo_project_members
   WHERE project_id = p_project_id AND member_oid = p_member_oid;
  GET DIAGNOSTICS v_removed = ROW_COUNT;
  RETURN v_removed; -- true = removed; false = was not a member (idempotent)
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_remove_member(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_remove_member(uuid, text) TO authenticated;

-- ============================================================================
-- REVERSIBILITY (manual, if ever needed; not run at deploy):
--   DROP FUNCTION IF EXISTS public.theo_project_remove_member(uuid, text);
--   DROP FUNCTION IF EXISTS public.theo_project_set_member_role(uuid, text, text);
--   DROP FUNCTION IF EXISTS public.theo_project_add_member(uuid, text);
--   DROP FUNCTION IF EXISTS public.theo_project_list_members(uuid);
--   DROP FUNCTION IF EXISTS public.theo_project_effective_role(uuid);
--   ALTER TABLE public.theo_project_members DROP CONSTRAINT IF EXISTS theo_project_members_role_ck;
--   ALTER TABLE public.theo_project_members DROP COLUMN IF EXISTS role;
-- ============================================================================
