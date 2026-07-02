-- ============================================================================
-- Theo 1B — Tier B2: theo_* persistence substrate (schema + RLS + helpers)
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
-- RLS mirrors corporate-reporting ownership pattern: four policies per table
-- TO authenticated keyed on auth.uid() (= Entra OID in created_by). auth.uid() and the
-- per-request set_config session context pre-exist in the shared instance; handlers set
-- context in B3+. Creation order respects FKs.
-- ============================================================================

-- ---------- theo_projects (created first; others FK it) ----------
CREATE TABLE IF NOT EXISTS public.theo_projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by   text NOT NULL,
  name         text NOT NULL CHECK (length(trim(name)) > 0),
  instructions text NOT NULL DEFAULT '',
  app_key      text NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_projects_created_by ON public.theo_projects (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_projects_created_at_desc ON public.theo_projects (created_at DESC);
ALTER TABLE public.theo_projects ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_projects' AND policyname='theo_project_select_own') THEN
    CREATE POLICY "theo_project_select_own" ON public.theo_projects FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_projects' AND policyname='theo_project_insert_own') THEN
    CREATE POLICY "theo_project_insert_own" ON public.theo_projects FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_projects' AND policyname='theo_project_update_own') THEN
    CREATE POLICY "theo_project_update_own" ON public.theo_projects FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_projects' AND policyname='theo_project_delete_own') THEN
    CREATE POLICY "theo_project_delete_own" ON public.theo_projects FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_project_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_projects WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_project_exists_unscoped(uuid) TO authenticated;

-- ---------- theo_conversations ----------
CREATE TABLE IF NOT EXISTS public.theo_conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by  text NOT NULL,
  project_id  uuid NULL REFERENCES public.theo_projects(id) ON DELETE SET NULL,
  title       text NULL,
  model       text NULL,
  app_key     text NULL,
  app_context jsonb NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_conversations_created_by ON public.theo_conversations (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_conversations_created_at_desc ON public.theo_conversations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_theo_conversations_project_id ON public.theo_conversations (project_id);
ALTER TABLE public.theo_conversations ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_conversations' AND policyname='theo_conversation_select_own') THEN
    CREATE POLICY "theo_conversation_select_own" ON public.theo_conversations FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_conversations' AND policyname='theo_conversation_insert_own') THEN
    CREATE POLICY "theo_conversation_insert_own" ON public.theo_conversations FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_conversations' AND policyname='theo_conversation_update_own') THEN
    CREATE POLICY "theo_conversation_update_own" ON public.theo_conversations FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_conversations' AND policyname='theo_conversation_delete_own') THEN
    CREATE POLICY "theo_conversation_delete_own" ON public.theo_conversations FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_conversation_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_conversations WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_conversation_exists_unscoped(uuid) TO authenticated;

-- ---------- theo_messages (immutable: no updated_at) ----------
CREATE TABLE IF NOT EXISTS public.theo_messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      text NOT NULL,
  conversation_id uuid NOT NULL REFERENCES public.theo_conversations(id) ON DELETE CASCADE,
  seq             integer NOT NULL,
  role            text NOT NULL CHECK (role IN ('user','assistant')),
  content         text NOT NULL,
  model           text NULL,
  citations       jsonb NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, seq)
);
CREATE INDEX IF NOT EXISTS idx_theo_messages_conversation_id ON public.theo_messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_theo_messages_created_by ON public.theo_messages (created_by);
ALTER TABLE public.theo_messages ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_messages' AND policyname='theo_message_select_own') THEN
    CREATE POLICY "theo_message_select_own" ON public.theo_messages FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_messages' AND policyname='theo_message_insert_own') THEN
    CREATE POLICY "theo_message_insert_own" ON public.theo_messages FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_messages' AND policyname='theo_message_update_own') THEN
    CREATE POLICY "theo_message_update_own" ON public.theo_messages FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_messages' AND policyname='theo_message_delete_own') THEN
    CREATE POLICY "theo_message_delete_own" ON public.theo_messages FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
-- (immutable + cascade-delete only; no individual update/delete handler → no _exists_unscoped)

-- ---------- theo_project_knowledge (immutable; inline content OR Blob pointer) ----------
CREATE TABLE IF NOT EXISTS public.theo_project_knowledge (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by     text NOT NULL,
  project_id     uuid NOT NULL REFERENCES public.theo_projects(id) ON DELETE CASCADE,
  title          text NOT NULL CHECK (length(trim(title)) > 0),
  source_type    text NOT NULL DEFAULT 'text' CHECK (source_type IN ('text','file')),
  content        text NULL,
  blob_container text NULL,
  blob_path      text NULL,
  byte_size      bigint NULL,
  content_type   text NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_project_knowledge_project_id ON public.theo_project_knowledge (project_id);
CREATE INDEX IF NOT EXISTS idx_theo_project_knowledge_created_by ON public.theo_project_knowledge (created_by);
ALTER TABLE public.theo_project_knowledge ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_knowledge' AND policyname='theo_project_knowledge_select_own') THEN
    CREATE POLICY "theo_project_knowledge_select_own" ON public.theo_project_knowledge FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_knowledge' AND policyname='theo_project_knowledge_insert_own') THEN
    CREATE POLICY "theo_project_knowledge_insert_own" ON public.theo_project_knowledge FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_knowledge' AND policyname='theo_project_knowledge_update_own') THEN
    CREATE POLICY "theo_project_knowledge_update_own" ON public.theo_project_knowledge FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_knowledge' AND policyname='theo_project_knowledge_delete_own') THEN
    CREATE POLICY "theo_project_knowledge_delete_own" ON public.theo_project_knowledge FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_project_knowledge_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_project_knowledge WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_project_knowledge_exists_unscoped(uuid) TO authenticated;

-- ---------- theo_artifacts ----------
CREATE TABLE IF NOT EXISTS public.theo_artifacts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      text NOT NULL,
  conversation_id uuid NULL REFERENCES public.theo_conversations(id) ON DELETE SET NULL,
  project_id      uuid NULL REFERENCES public.theo_projects(id) ON DELETE SET NULL,
  title           text NOT NULL CHECK (length(trim(title)) > 0),
  type            text NOT NULL CHECK (type IN ('document','code','html')),
  current_version integer NOT NULL DEFAULT 1,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_artifacts_created_by ON public.theo_artifacts (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_artifacts_conversation_id ON public.theo_artifacts (conversation_id);
CREATE INDEX IF NOT EXISTS idx_theo_artifacts_project_id ON public.theo_artifacts (project_id);
ALTER TABLE public.theo_artifacts ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifacts' AND policyname='theo_artifact_select_own') THEN
    CREATE POLICY "theo_artifact_select_own" ON public.theo_artifacts FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifacts' AND policyname='theo_artifact_insert_own') THEN
    CREATE POLICY "theo_artifact_insert_own" ON public.theo_artifacts FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifacts' AND policyname='theo_artifact_update_own') THEN
    CREATE POLICY "theo_artifact_update_own" ON public.theo_artifacts FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifacts' AND policyname='theo_artifact_delete_own') THEN
    CREATE POLICY "theo_artifact_delete_own" ON public.theo_artifacts FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_artifact_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_artifacts WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_artifact_exists_unscoped(uuid) TO authenticated;

-- ---------- theo_artifact_versions (immutable; Blob pointer content) ----------
CREATE TABLE IF NOT EXISTS public.theo_artifact_versions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by     text NOT NULL,
  artifact_id    uuid NOT NULL REFERENCES public.theo_artifacts(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  blob_container text NOT NULL,
  blob_path      text NOT NULL,
  byte_size      bigint NULL,
  content_type   text NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (artifact_id, version_number)
);
CREATE INDEX IF NOT EXISTS idx_theo_artifact_versions_artifact_id ON public.theo_artifact_versions (artifact_id);
ALTER TABLE public.theo_artifact_versions ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifact_versions' AND policyname='theo_artifact_version_select_own') THEN
    CREATE POLICY "theo_artifact_version_select_own" ON public.theo_artifact_versions FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifact_versions' AND policyname='theo_artifact_version_insert_own') THEN
    CREATE POLICY "theo_artifact_version_insert_own" ON public.theo_artifact_versions FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifact_versions' AND policyname='theo_artifact_version_update_own') THEN
    CREATE POLICY "theo_artifact_version_update_own" ON public.theo_artifact_versions FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifact_versions' AND policyname='theo_artifact_version_delete_own') THEN
    CREATE POLICY "theo_artifact_version_delete_own" ON public.theo_artifact_versions FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
-- (immutable + cascade-delete only → no _exists_unscoped)

-- ---------- theo_user_settings (text PK = Entra OID; keyed on user_oid) ----------
CREATE TABLE IF NOT EXISTS public.theo_user_settings (
  user_oid            text PRIMARY KEY,
  style_key           text NOT NULL DEFAULT 'normal' CHECK (style_key IN ('normal','concise','explanatory','formal')),
  custom_instructions text NOT NULL DEFAULT '',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.theo_user_settings ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_settings' AND policyname='theo_user_settings_select_own') THEN
    CREATE POLICY "theo_user_settings_select_own" ON public.theo_user_settings FOR SELECT TO authenticated USING (user_oid = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_settings' AND policyname='theo_user_settings_insert_own') THEN
    CREATE POLICY "theo_user_settings_insert_own" ON public.theo_user_settings FOR INSERT TO authenticated WITH CHECK (user_oid = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_settings' AND policyname='theo_user_settings_update_own') THEN
    CREATE POLICY "theo_user_settings_update_own" ON public.theo_user_settings FOR UPDATE TO authenticated USING (user_oid = auth.uid()) WITH CHECK (user_oid = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_settings' AND policyname='theo_user_settings_delete_own') THEN
    CREATE POLICY "theo_user_settings_delete_own" ON public.theo_user_settings FOR DELETE TO authenticated USING (user_oid = auth.uid());
  END IF;
END $$;
-- (upsert by own PK = user_oid → no _exists_unscoped)
