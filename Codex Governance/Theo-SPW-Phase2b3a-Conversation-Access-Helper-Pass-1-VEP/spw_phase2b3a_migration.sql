-- ============================================================================
-- Theo Shared Project Workspace — Phase 2b-3a: conversation-access read helper.
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; NO top-level BEGIN/COMMIT (migration governance). Idempotent + reversible.
--
-- WHAT: one SECURITY DEFINER helper `theo_conversation_access(uuid) → 'owner' | 'member' | NULL`
-- that answers "may the caller read/continue this conversation?" — 'owner' if the caller authored it,
-- 'member' if it is PUBLISHED to a project the caller participates in (creator ∪ owner ∪ member),
-- NULL otherwise. This is the SINGLE audited home of the publish-to-project access predicate so the
-- Phase-2b-3b/2b-3c chat handlers (theo_get_conversation / theo_message / theo_message_stream) can gate
-- reads + continuation with ONE call instead of inlining the membership subquery in every query.
--
-- WHY A HELPER (not inline): the deployed chat handlers connect with a Functions role that BYPASSES
-- RLS and enforce isolation with explicit `created_by = $oid` predicates in application SQL — so the
-- Phase 2a §11 RLS broadening does not, by itself, open a published transcript to a member. Rather than
-- replicate the (owner ∪ published-in-my-project) predicate in 6+ live-handler queries across two apps
-- (drift-prone, larger diffs on live traffic), this helper centralizes it — the deployed
-- `theo_conversation_exists_unscoped` / `theo_project_exists_unscoped` existence-helper idiom.
--
-- PREDICATE PARITY: the 'member' branch is byte-for-byte the same access set as the deployed §11
-- policies — `published_to_project = true AND project_id IS NOT NULL AND project_id ∈ (creator ∪
-- member)` — so read-path access via this helper matches the RLS model exactly.
--
-- ENFORCEMENT / IDIOM: SECURITY DEFINER, migration-role-owned, pinned search_path, REVOKE ALL FROM
-- PUBLIC + GRANT EXECUTE TO authenticated (the governed service write-path idiom; Schema §8/§9/§10/§11).
-- The caller OID is read from `request.jwt.claim.sub` (set per-request via set_config; NEVER a
-- parameter). READ-ONLY: the function performs no write; it only classifies access.
--
-- RLS: UNCHANGED. No policy, table, column, or row is altered. No new projects<->conversations RLS
-- subquery is added (the helper reads inside a definer context), so the §11 + B5c non-recursion
-- invariants are preserved.
--
-- AUTHORIZATION: this rides the Walter-authorized Shared Project Workspace program + the explicit
-- "build read plus write together" Phase 2 direction (2026-07-30). Precedent: Phase 1/2a/2b-1 gates.
-- ============================================================================

-- theo_conversation_access: the caller's access to a conversation — 'owner' | 'member' | NULL.
--   'owner'  = the caller authored the conversation (created_by = caller).
--   'member' = the conversation is published to a project the caller participates in.
--   NULL     = no access (or the conversation does not exist — the handler discriminates 403/404 via
--              the deployed theo_conversation_exists_unscoped helper, exactly as today).
CREATE OR REPLACE FUNCTION public.theo_conversation_access(p_conversation_id uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller    text := current_setting('request.jwt.claim.sub', true);
  v_owner     text;
  v_project   uuid;
  v_published boolean;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RETURN NULL;
  END IF;
  SELECT created_by, project_id, published_to_project
    INTO v_owner, v_project, v_published
    FROM public.theo_conversations
   WHERE id = p_conversation_id;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  IF v_owner = v_caller THEN
    RETURN 'owner';
  END IF;
  IF v_published = true AND v_project IS NOT NULL
     AND v_project IN (
       SELECT id FROM public.theo_projects WHERE created_by = v_caller
       UNION
       SELECT project_id FROM public.theo_project_members WHERE member_oid = v_caller
     ) THEN
    RETURN 'member';
  END IF;
  RETURN NULL;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_conversation_access(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_conversation_access(uuid) TO authenticated;

-- ============================================================================
-- REVERSIBILITY (manual, if ever needed; not run at deploy):
--   DROP FUNCTION IF EXISTS public.theo_conversation_access(uuid);
-- ============================================================================
