-- ============================================================================
-- Theo Shared Project Workspace — Phase 2b-1: publish-to-project write-path gates.
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; NO top-level BEGIN/COMMIT (migration governance). Idempotent + reversible.
--
-- WHAT: three SECURITY DEFINER gate functions that drive the Phase 2a publish-to-project columns
-- (theo_conversations.published_to_project / published_at / published_by, deployed §11):
--   theo_publish_conversation(uuid)        — OWNER-only publish (requires the conversation be linked
--                                            to a project). Sets the publish flags.
--   theo_unpublish_conversation(uuid)      — OWNER-only unpublish. Clears the publish flags.
--   theo_list_project_conversations(uuid)  — MEMBER-visible list of the published conversations in a
--                                            project (creator ∪ owner ∪ member).
-- The Phase-2b-2 func-projects handlers are thin wrappers over these gates (the Phase-1/1b idiom).
--
-- MODEL (private-by-default; §11): publishing is an explicit OWNER action. Ownership here is
-- CONVERSATION ownership — `theo_conversations.created_by = caller` — NOT project membership; only the
-- author of a conversation may publish/unpublish it. Listing is broader: any project participant
-- (creator ∪ owner ∪ member, via theo_project_effective_role) may enumerate the project's published
-- conversations. A conversation is shared iff `published_to_project = true AND project_id IS NOT NULL`.
--
-- ENFORCEMENT: these are the governed service write-path idiom (SECURITY DEFINER, migration-role-owned;
-- same as the Phase 1 role gates theo_project_* and theo_chat_leave / dms_sub_*). The function owner
-- bypasses RLS, so authorization is enforced INSIDE each function (explicit created_by / effective_role
-- checks + RAISE), exactly like the deployed chat handlers enforce `created_by = $oid` in application
-- SQL. The caller OID is read from `request.jwt.claim.sub` (set per-request via set_config; NEVER a
-- parameter — the trusted source), so a caller can only ever act as themselves.
--
-- RLS: UNCHANGED by this migration. The Phase 2a policy broadening (§11) already landed; these gates
-- add no new policy and no new projects<->conversations RLS subquery, so the B5c non-recursion
-- invariant is preserved. (theo_project_effective_role reads theo_projects + theo_project_members only.)
--
-- SQLSTATE → HTTP (for the Phase-2b-2 handler mapping, matching Phase 1b): 28000 = unauthenticated
-- (401); 42501 = insufficient privilege (403); 22023 = invalid argument (400); P0002 = not found (404).
--
-- AUTHORIZATION: broadening the conversation write-path beyond ownership is out of default 1B scope
-- "unless Walter authorizes" (Backend Plan; Schema §1). Walter authorized the Shared Project Workspace
-- program and explicitly directed Phase 2 read+write (2026-07-30). Precedent: Phase 1 role gates.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) theo_publish_conversation: OWNER-only publish. The caller must own the conversation and the
--    conversation must be linked to a project. Idempotent — re-publishing an already-published
--    conversation is a no-op that PRESERVES the original published_at/published_by (returns false).
--    Returns true = newly published; false = already published (idempotent).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.theo_publish_conversation(p_conversation_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller     text := current_setting('request.jwt.claim.sub', true);
  v_owner      text;
  v_project    uuid;
  v_published  boolean;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;
  SELECT created_by, project_id, published_to_project
    INTO v_owner, v_project, v_published
    FROM public.theo_conversations
   WHERE id = p_conversation_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'conversation not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_owner <> v_caller THEN
    RAISE EXCEPTION 'only the conversation owner may publish it' USING ERRCODE = '42501';
  END IF;
  IF v_project IS NULL THEN
    RAISE EXCEPTION 'conversation is not linked to a project' USING ERRCODE = '22023';
  END IF;
  IF v_published THEN
    RETURN false; -- already published; preserve original publish metadata (idempotent)
  END IF;
  UPDATE public.theo_conversations
     SET published_to_project = true,
         published_at         = now(),
         published_by         = v_caller
   WHERE id = p_conversation_id;
  RETURN true;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_publish_conversation(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_publish_conversation(uuid) TO authenticated;

-- ----------------------------------------------------------------------------
-- 2) theo_unpublish_conversation: OWNER-only unpublish. Clears the publish flags (the conversation
--    reverts to private; project_id is left intact). Idempotent — unpublishing an already-private
--    conversation is a no-op (returns false). Returns true = was published and is now private.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.theo_unpublish_conversation(p_conversation_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller     text := current_setting('request.jwt.claim.sub', true);
  v_owner      text;
  v_published  boolean;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;
  SELECT created_by, published_to_project
    INTO v_owner, v_published
    FROM public.theo_conversations
   WHERE id = p_conversation_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'conversation not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_owner <> v_caller THEN
    RAISE EXCEPTION 'only the conversation owner may unpublish it' USING ERRCODE = '42501';
  END IF;
  IF NOT v_published THEN
    RETURN false; -- already private (idempotent)
  END IF;
  UPDATE public.theo_conversations
     SET published_to_project = false,
         published_at         = NULL,
         published_by         = NULL
   WHERE id = p_conversation_id;
  RETURN true;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_unpublish_conversation(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_unpublish_conversation(uuid) TO authenticated;

-- ----------------------------------------------------------------------------
-- 3) theo_list_project_conversations: the published conversations in a project, visible to ANY
--    participant (creator ∪ owner ∪ member — gated via theo_project_effective_role). Ordered by
--    last activity (updated_at DESC), mirroring the Recents last-touched idiom. Raises 404 if the
--    caller has no access to the project (effective_role NULL). Returns the fields the shared-list FE
--    needs: id, title, the author (created_by), publish provenance (published_at/published_by), and
--    created_at/updated_at for ordering + display.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.theo_list_project_conversations(p_project_id uuid)
RETURNS TABLE (
  id           uuid,
  title        text,
  created_by   text,
  created_at   timestamptz,
  updated_at   timestamptz,
  published_at timestamptz,
  published_by text
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller_role text := public.theo_project_effective_role(p_project_id);
BEGIN
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'project not found or no access' USING ERRCODE = 'P0002';
  END IF;
  RETURN QUERY
    SELECT c.id, c.title, c.created_by, c.created_at, c.updated_at, c.published_at, c.published_by
      FROM public.theo_conversations c
     WHERE c.project_id = p_project_id
       AND c.published_to_project = true
     ORDER BY c.updated_at DESC;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_list_project_conversations(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_list_project_conversations(uuid) TO authenticated;

-- ============================================================================
-- REVERSIBILITY (manual, if ever needed; not run at deploy):
--   DROP FUNCTION IF EXISTS public.theo_list_project_conversations(uuid);
--   DROP FUNCTION IF EXISTS public.theo_unpublish_conversation(uuid);
--   DROP FUNCTION IF EXISTS public.theo_publish_conversation(uuid);
-- ============================================================================
