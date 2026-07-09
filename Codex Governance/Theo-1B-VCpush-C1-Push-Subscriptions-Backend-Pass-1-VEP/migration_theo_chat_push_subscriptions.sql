-- ============================================================================
-- Theo 1B — Apps Phase C, C1: theo_chat_push_subscriptions (Web Push subscription storage)
-- Target: shared vaultgpt Azure Postgres instance, schema public. App: vaultgpt-func-chat.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent; safe to re-run.
-- Run by Walter as pgadmin_vault at Pass 3 BEFORE the C1 handlers deploy (write-SQL is Walter-only).
-- Ownership-family idiom (Schema section 1/2; Tier B7a theo_user_memory; Tier B8a theo_attachments):
-- created_by text NOT NULL (Entra OID), four RLS policies TO authenticated keyed on created_by = auth.uid(),
-- policy names theo_<entity>_<verb>_own. Direct table access is own-rows-only; per-user isolation is ALSO
-- enforced by explicit created_by = $oid predicates in the delete handler (RLS = defence-in-depth layer).
-- SINGLE-OWNER-PER-ENDPOINT invariant: endpoint is GLOBALLY UNIQUE, so exactly one owner holds an endpoint
-- at a time. Cross-owner re-registration (shared browser: A logs out, B subscribes) is performed by the
-- SECURITY DEFINER claim function below -- the governed write-path idiom (Schema section 8; Golden Handler
-- section 3) -- which reassigns the endpoint to the AUTHENTICATED CALLER only (created_by := auth.uid(),
-- NEVER a client value), atomically removing the prior owner's row-access. See the C1 VEP Gap Register G4.
-- ============================================================================

-- 1) Storage table. endpoint is globally UNIQUE -> exactly one owner at a time (no cross-user leak).
CREATE TABLE IF NOT EXISTS public.theo_chat_push_subscriptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by  text NOT NULL,
  endpoint    text NOT NULL,
  p256dh      text NOT NULL,
  auth        text NOT NULL,
  ua          text NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_theo_chat_push_subscriptions_endpoint UNIQUE (endpoint)
);
CREATE INDEX IF NOT EXISTS idx_theo_chat_push_subscriptions_created_by
  ON public.theo_chat_push_subscriptions (created_by);

-- 2) RLS + four ownership policies. Direct table access (delete handler; any future read) = own rows only.
ALTER TABLE public.theo_chat_push_subscriptions ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_chat_push_subscriptions' AND policyname='theo_push_subscription_select_own') THEN
    CREATE POLICY "theo_push_subscription_select_own" ON public.theo_chat_push_subscriptions FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_chat_push_subscriptions' AND policyname='theo_push_subscription_insert_own') THEN
    CREATE POLICY "theo_push_subscription_insert_own" ON public.theo_chat_push_subscriptions FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_chat_push_subscriptions' AND policyname='theo_push_subscription_update_own') THEN
    CREATE POLICY "theo_push_subscription_update_own" ON public.theo_chat_push_subscriptions FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_chat_push_subscriptions' AND policyname='theo_push_subscription_delete_own') THEN
    CREATE POLICY "theo_push_subscription_delete_own" ON public.theo_chat_push_subscriptions FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;

-- 3) Grant: the app role (vaultgpt_app) is a member of `authenticated` and receives table DML via the
-- pgadmin_vault default-privilege ACL (the deployed B2/B7a/B8a migrations add no explicit per-table GRANT).
-- This explicit grant to `authenticated` is a harmless, idempotent superset. Run as pgadmin_vault.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theo_chat_push_subscriptions TO authenticated;

-- 4) SECURITY DEFINER single-owner claim (the governed cross-owner write-path; Schema section 8 idiom).
-- Reassigns the endpoint to the AUTHENTICATED CALLER only (created_by := auth.uid(), never a client value);
-- ON CONFLICT (endpoint) atomically removes any prior owner in the same statement. SECURITY DEFINER (owned
-- by the migration role; tables are ENABLE- not FORCE-RLS) bypasses the ownership UPDATE RLS that would
-- otherwise forbid the cross-owner reassignment -- mirrors the deployed theo_chat_leave /
-- theo_chat_delete_message write-path helpers. Caller identity is derived from auth.uid() (set by the
-- handler's set_config/JWT triad before the call), NEVER a parameter; unauthenticated -> raise 28000.
CREATE OR REPLACE FUNCTION public.theo_chat_claim_push_subscription(
  p_endpoint text,
  p_p256dh   text,
  p_auth     text,
  p_ua       text
)
RETURNS TABLE(id uuid, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
DECLARE
  v_oid text := auth.uid();
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_claim_push_subscription: no caller identity' USING ERRCODE = '28000';
  END IF;

  RETURN QUERY
  INSERT INTO public.theo_chat_push_subscriptions (created_by, endpoint, p256dh, auth, ua)
  VALUES (v_oid, p_endpoint, p_p256dh, p_auth, p_ua)
  ON CONFLICT (endpoint) DO UPDATE
    SET created_by = v_oid,
        p256dh     = EXCLUDED.p256dh,
        auth       = EXCLUDED.auth,
        ua         = EXCLUDED.ua,
        created_at = now()
  RETURNING theo_chat_push_subscriptions.id, theo_chat_push_subscriptions.created_at;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_claim_push_subscription(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_claim_push_subscription(text, text, text, text) TO authenticated;
