-- ============================================================================
-- Theo 1B — Apps Phase C, C2: Web Push SENDER — two SECURITY DEFINER helpers (v2)
-- Target: shared vaultgpt Azure Postgres instance, schema public. App: vaultgpt-func-chat.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance, Golden Handler section 5.2).
-- Idempotent (CREATE OR REPLACE FUNCTION; no DDL on the C1 table). Safe to re-run.
-- Run by Walter as pgadmin_vault at Pass 3 BEFORE the C2 send-handler delta deploys (write-SQL is Walter-only).
--
-- v2 (thread-scoped least-privilege): the cross-owner read helper now takes the THREAD id, proves the
-- caller is a member INSIDE the function (auth.uid()), and derives recipients itself (member_oids MINUS
-- the caller). The old array-of-arbitrary-OIDs signature is removed entirely. Addresses Codex Pass 2.
--
-- Depends on C1 (DEPLOYED 2026-07-09): table public.theo_chat_push_subscriptions
--   (created_by text, endpoint text UNIQUE, p256dh text, auth text, ...), ownership RLS
--   (created_by = auth.uid()), and the single-owner SECURITY DEFINER theo_chat_claim_push_subscription.
--
-- WHY SECURITY DEFINER (cross-owner access — Schema section 8 write-path idiom; Golden Handler section 3):
-- the message SENDER must read/prune OTHER users' push subscriptions to deliver a push. C1's ownership RLS
-- (created_by = auth.uid()) scopes direct-table access to the caller's OWN rows, and the shared func-chat
-- connection role has no cross-owner grant. Both helpers are owned by the migration role (pgadmin_vault),
-- and because the C1 table is ENABLE- not FORCE-RLS, a SECURITY DEFINER function owned there bypasses the
-- ownership policies. Both pin search_path, REVOKE ALL FROM PUBLIC, GRANT EXECUTE TO authenticated, and
-- derive the caller identity from auth.uid() (never a parameter). This is the same justified write-path
-- class as the deployed theo_chat_leave / theo_chat_delete_message / theo_chat_claim_push_subscription.
--
-- ELEVATED-READ-CLASS NOTE (C2 VEP Gap Register G-READCLASS): theo_chat_get_push_subscriptions_for_thread
-- returns another user's push credentials (endpoint + p256dh + auth) to an HTTP handler. That exceeds the
-- Golden Handler section 3(a) existence-helper and section 3(b) timer-enumeration exceptions, so per
-- Golden Handler section 4 it required an explicit Walter authorization predating the Implementation
-- Package. That authorization has LANDED: WALTER_AUTHORIZATION_G-READCLASS.md (this package). The
-- thread-scoped signature ENFORCES the authorization's bound mitigations (membership proven inside the
-- definer; recipients server-derived from member_oids MINUS the caller) rather than trusting the handler.
-- ============================================================================

-- 1) Thread-scoped cross-owner enumeration read (LEAST-PRIVILEGE). The caller passes ONLY the thread id.
--    The function proves the caller is a member of that thread (auth.uid() = ANY(member_oids)) and derives
--    the recipients itself (member_oids MINUS the caller) — the caller can never pass arbitrary OIDs to
--    harvest credentials. Returns exactly the fields RFC 8291 aes128gcm encryption requires (endpoint plus
--    the p256dh / auth client keys) plus created_by so the sender can attribute a row. A non-member caller
--    is denied (42501); an unknown thread returns no rows; an unauthenticated caller is rejected (28000).
CREATE OR REPLACE FUNCTION public.theo_chat_get_push_subscriptions_for_thread(p_thread_id uuid)
RETURNS TABLE(created_by text, endpoint text, p256dh text, auth text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
DECLARE
  v_oid     text   := auth.uid();
  v_members text[];
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_get_push_subscriptions_for_thread: no caller identity' USING ERRCODE = '28000';
  END IF;

  SELECT t.member_oids INTO v_members
    FROM public.theo_chat_threads t
   WHERE t.id = p_thread_id;

  IF v_members IS NULL THEN
    RETURN;  -- unknown thread -> return no rows
  END IF;

  IF NOT (v_oid = ANY(v_members)) THEN
    RAISE EXCEPTION 'theo_chat_get_push_subscriptions_for_thread: caller not a thread member' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT s.created_by, s.endpoint, s.p256dh, s.auth
    FROM public.theo_chat_push_subscriptions s
   WHERE s.created_by = ANY(v_members)
     AND s.created_by <> v_oid;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_get_push_subscriptions_for_thread(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_get_push_subscriptions_for_thread(uuid) TO authenticated;

-- 2) Cross-owner prune: delete the row for p_endpoint regardless of owner. Called ONLY when the push
--    service returns 410 Gone / 404 for a dead endpoint (a genuinely-expired subscription). SECURITY
--    DEFINER because the sender is not the endpoint's owner; ownership RLS would otherwise forbid the
--    delete. Returns true when a row was removed, false otherwise (idempotent). auth.uid() guard rejects
--    an unauthenticated caller; a NULL / empty p_endpoint is a no-op returning false.
CREATE OR REPLACE FUNCTION public.theo_chat_prune_push_subscription(p_endpoint text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
DECLARE
  v_oid   text    := auth.uid();
  v_count integer := 0;
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_prune_push_subscription: no caller identity' USING ERRCODE = '28000';
  END IF;

  IF p_endpoint IS NULL OR p_endpoint = '' THEN
    RETURN false;
  END IF;

  DELETE FROM public.theo_chat_push_subscriptions
   WHERE endpoint = p_endpoint;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count > 0;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_prune_push_subscription(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_prune_push_subscription(text) TO authenticated;
