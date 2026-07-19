-- ============================================================================
-- Theo 1B — Tier DMS-Push, MS1: dms_change_subscriptions (DMS Layer-3 change-notification store)
-- Target: shared vaultgpt Azure Postgres instance, schema public. App: vaultgpt-func-chat.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent; safe to re-run.
-- Run by Walter as pgadmin_vault at Pass 3 BEFORE the MS1 handlers deploy (write-SQL is Walter-only).
--
-- OWNERSHIP MODEL — DELIBERATE DEVIATION from the theo_* per-user idiom (Schema §5 created_by/RLS):
-- these are APP-LEVEL INFRASTRUCTURE rows (one Graph change-notification subscription PER DMS DRIVE,
-- shared across all users who can see that drive), NOT user-owned data. There is no `created_by` and
-- no per-user RLS keyed on auth.uid(). Access is SERVICE-ONLY, via the SECURITY DEFINER functions
-- below (migration-role-owned; REVOKE ALL FROM PUBLIC; GRANT EXECUTE TO the app role; pinned
-- search_path) — the governed write-path idiom (Golden Handler §3; mirrors the deployed
-- theo_chat_claim_push_subscription SECURITY DEFINER pattern). RLS is ENABLED with NO policies to
-- `authenticated`, so there is NO direct table access from the app's RLS-enforced connection — the
-- DEFINER functions (which run as the table-owning migration role and bypass RLS) are the only path.
-- No file content, names, or per-user data live here — only Graph subscription bookkeeping + the
-- client_state secret used to authenticate inbound notifications. Layer-3 change signals remain
-- trigger-only; per-user SharePoint trimming stays in the delegated dms_delta path (vault-dms).
-- ============================================================================

-- 1) Storage table. drive_id UNIQUE -> exactly one active subscription per DMS drive.
CREATE TABLE IF NOT EXISTS public.dms_change_subscriptions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id  text NOT NULL UNIQUE,          -- Microsoft Graph subscription id
  site_id          text NOT NULL,                 -- SharePoint site id (caller-carried)
  drive_id         text NOT NULL UNIQUE,          -- one subscription per drive
  resource         text NOT NULL,                 -- Graph resource, e.g. drives/{driveId}/root
  client_state     text NOT NULL,                 -- secret echoed by Graph in each notification (auth)
  expiration       timestamptz NOT NULL,          -- Graph subscription expirationDateTime
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- 2) RLS ENABLED, NO policies to authenticated -> the app's RLS-enforced connection has zero direct
--    row access. All access is via the SECURITY DEFINER functions below (owned by the migration role,
--    which bypasses RLS). App-infra table: no per-user ownership.
ALTER TABLE public.dms_change_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3) SECURITY DEFINER access functions (service-only; migration-role-owned; pinned search_path).
--    Upsert-by-drive: create or refresh the single subscription row for a drive (idempotent ensure).
CREATE OR REPLACE FUNCTION public.dms_sub_upsert(
  p_subscription_id text, p_site_id text, p_drive_id text,
  p_resource text, p_client_state text, p_expiration timestamptz
) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.dms_change_subscriptions
    (subscription_id, site_id, drive_id, resource, client_state, expiration)
  VALUES (p_subscription_id, p_site_id, p_drive_id, p_resource, p_client_state, p_expiration)
  ON CONFLICT (drive_id) DO UPDATE SET
    subscription_id = EXCLUDED.subscription_id,
    site_id         = EXCLUDED.site_id,
    resource        = EXCLUDED.resource,
    client_state    = EXCLUDED.client_state,
    expiration      = EXCLUDED.expiration,
    updated_at      = now();
$$;

--    Get the current subscription for a drive (idempotent-ensure read; excludes the secret).
CREATE OR REPLACE FUNCTION public.dms_sub_get_by_drive(p_drive_id text)
RETURNS TABLE(subscription_id text, site_id text, drive_id text, resource text, expiration timestamptz)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT subscription_id, site_id, drive_id, resource, expiration
  FROM public.dms_change_subscriptions WHERE drive_id = p_drive_id;
$$;

--    Get a subscription by Graph subscription id, INCLUDING client_state + site/drive — used by the
--    notification receiver to authenticate an inbound notification and resolve which drive changed.
CREATE OR REPLACE FUNCTION public.dms_sub_get(p_subscription_id text)
RETURNS TABLE(subscription_id text, site_id text, drive_id text, client_state text, expiration timestamptz)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT subscription_id, site_id, drive_id, client_state, expiration
  FROM public.dms_change_subscriptions WHERE subscription_id = p_subscription_id;
$$;

--    List subscriptions expiring before a cutoff — used by the MS2 renewal timer.
CREATE OR REPLACE FUNCTION public.dms_sub_list_expiring(p_before timestamptz)
RETURNS TABLE(subscription_id text, site_id text, drive_id text, resource text, expiration timestamptz)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT subscription_id, site_id, drive_id, resource, expiration
  FROM public.dms_change_subscriptions WHERE expiration < p_before;
$$;

--    Update the expiration after a successful Graph renewal (MS2).
CREATE OR REPLACE FUNCTION public.dms_sub_touch_expiration(p_subscription_id text, p_expiration timestamptz)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.dms_change_subscriptions
  SET expiration = p_expiration, updated_at = now()
  WHERE subscription_id = p_subscription_id;
$$;

--    Delete a subscription row (Graph subscription gone / renewal failed).
CREATE OR REPLACE FUNCTION public.dms_sub_delete(p_subscription_id text)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  DELETE FROM public.dms_change_subscriptions WHERE subscription_id = p_subscription_id;
$$;

-- 4) Lock down execution: no PUBLIC; only the app role (member of `authenticated`) may call.
REVOKE ALL ON FUNCTION public.dms_sub_upsert(text, text, text, text, text, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.dms_sub_get_by_drive(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.dms_sub_get(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.dms_sub_list_expiring(timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.dms_sub_touch_expiration(text, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.dms_sub_delete(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.dms_sub_upsert(text, text, text, text, text, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.dms_sub_get_by_drive(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.dms_sub_get(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.dms_sub_list_expiring(timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.dms_sub_touch_expiration(text, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.dms_sub_delete(text) TO authenticated;
