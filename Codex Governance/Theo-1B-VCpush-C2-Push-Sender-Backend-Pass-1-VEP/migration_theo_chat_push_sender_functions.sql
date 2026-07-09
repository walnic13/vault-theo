-- ============================================================================
-- Theo 1B — Apps Phase C, C2: Web Push SENDER — two SECURITY DEFINER helpers
-- Target: shared vaultgpt Azure Postgres instance, schema public. App: vaultgpt-func-chat.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance, Golden Handler section 5.2).
-- Idempotent (CREATE OR REPLACE FUNCTION; no DDL on the C1 table). Safe to re-run.
-- Run by Walter as pgadmin_vault at Pass 3 BEFORE the C2 send-handler delta deploys (write-SQL is Walter-only).
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
-- ELEVATED-READ-CLASS NOTE (see the C2 VEP Gap Register G-READCLASS): theo_chat_get_push_subscriptions
-- returns another user's push credentials (endpoint + p256dh + auth) to an HTTP handler. That exceeds the
-- Golden Handler section 3(a) existence-helper and section 3(b) timer-enumeration exceptions and has no
-- exact deployed mirror, so it is a NEW elevated-read class that REQUIRES explicit Walter authorization
-- (Golden Handler section 4) before the C2 Implementation Package / deploy. This migration is delivered
-- plan-only; it is NOT executed until that authorization is quoted and Codex has APPROVED.
-- ============================================================================

-- 1) Cross-owner enumeration read: return the push subscriptions owned by any of p_oids (the sender passes
--    the RECIPIENT OIDs, derived server-side from theo_chat_threads.member_oids MINUS the sender — never
--    from client input). Returns exactly the fields RFC 8291 aes128gcm encryption requires (endpoint plus
--    the p256dh / auth client keys) plus created_by so the sender can attribute a row. auth.uid() guard
--    rejects an unauthenticated caller. A NULL / empty p_oids yields no rows.
CREATE OR REPLACE FUNCTION public.theo_chat_get_push_subscriptions(p_oids text[])
RETURNS TABLE(created_by text, endpoint text, p256dh text, auth text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
DECLARE
  v_oid text := auth.uid();
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_get_push_subscriptions: no caller identity' USING ERRCODE = '28000';
  END IF;

  IF p_oids IS NULL OR array_length(p_oids, 1) IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT s.created_by, s.endpoint, s.p256dh, s.auth
    FROM public.theo_chat_push_subscriptions s
   WHERE s.created_by = ANY(p_oids);
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_get_push_subscriptions(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_get_push_subscriptions(text[]) TO authenticated;

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
