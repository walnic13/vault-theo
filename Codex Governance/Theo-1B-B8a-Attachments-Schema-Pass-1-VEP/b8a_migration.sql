-- ============================================================================
-- Theo 1B — Tier B8a: theo_attachments (files attached to a chat; document/image RAG-to-model)
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
-- Mirrors the deployed theo_* idiom (Tier B2): four RLS policies TO authenticated keyed on
-- auth.uid() (= Entra OID in created_by) + a SECURITY DEFINER theo_attachment_exists_unscoped(uuid)
-- helper (403/404 discrimination for the B8b upload/delete handlers). The file body lives in Azure
-- Blob (the existing `theo-content` container); this row holds the Blob pointer + metadata only.
-- Per-user isolation is ALSO enforced by explicit `created_by = $oid` predicates in the B8 handlers
-- (the shared connection role enforces RLS via set_config; explicit filter is defence-in-depth).
-- FK to deployed B2 table theo_conversations.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.theo_attachments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      text NOT NULL,
  conversation_id uuid NULL REFERENCES public.theo_conversations(id) ON DELETE SET NULL,
  filename        text NOT NULL CHECK (length(trim(filename)) > 0),
  content_type    text NOT NULL,
  byte_size       bigint NOT NULL CHECK (byte_size >= 0),
  blob_container  text NOT NULL,
  blob_path       text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_attachments_created_by ON public.theo_attachments (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_attachments_conversation ON public.theo_attachments (conversation_id);
ALTER TABLE public.theo_attachments ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_attachments' AND policyname='theo_attachment_select_own') THEN
    CREATE POLICY "theo_attachment_select_own" ON public.theo_attachments FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_attachments' AND policyname='theo_attachment_insert_own') THEN
    CREATE POLICY "theo_attachment_insert_own" ON public.theo_attachments FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_attachments' AND policyname='theo_attachment_update_own') THEN
    CREATE POLICY "theo_attachment_update_own" ON public.theo_attachments FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_attachments' AND policyname='theo_attachment_delete_own') THEN
    CREATE POLICY "theo_attachment_delete_own" ON public.theo_attachments FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_attachment_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_attachments WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_attachment_exists_unscoped(uuid) TO authenticated;
