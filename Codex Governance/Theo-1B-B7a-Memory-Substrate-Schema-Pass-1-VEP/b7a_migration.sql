-- ============================================================================
-- Theo 1B — Tier B7a: theo_user_memory (distilled cross-chat memory; option C)
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
-- Mirrors the deployed theo_* idiom (Tier B2): four RLS policies TO authenticated keyed on
-- auth.uid() (= Entra OID in created_by) + a SECURITY DEFINER _exists_unscoped(uuid) helper.
-- NOTE: the shared Functions connection role bypasses RLS, so per-user isolation is ALSO
-- enforced by explicit `created_by = $oid` predicates in the B7a CRUD handlers (next microstep),
-- exactly as the SEC user-isolation fix established. RLS here is the second (defence-in-depth) layer.
-- FKs reference deployed B2 tables (theo_projects, theo_conversations).
-- ============================================================================

-- ---------- theo_user_memory ----------
CREATE TABLE IF NOT EXISTS public.theo_user_memory (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by             text NOT NULL,
  scope                  text NOT NULL DEFAULT 'user' CHECK (scope IN ('user','project')),
  project_id             uuid NULL REFERENCES public.theo_projects(id) ON DELETE CASCADE,
  kind                   text NOT NULL DEFAULT 'fact',
  content                text NOT NULL CHECK (length(trim(content)) > 0),
  source_conversation_id uuid NULL REFERENCES public.theo_conversations(id) ON DELETE SET NULL,
  salience               int  NOT NULL DEFAULT 0,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  -- project-scoped iff a project_id is present; user-scoped iff it is null
  CONSTRAINT theo_user_memory_scope_project_ck CHECK ((scope = 'project') = (project_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS idx_theo_user_memory_created_by ON public.theo_user_memory (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_user_memory_owner_scope ON public.theo_user_memory (created_by, scope);
CREATE INDEX IF NOT EXISTS idx_theo_user_memory_project ON public.theo_user_memory (project_id);
ALTER TABLE public.theo_user_memory ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_memory' AND policyname='theo_user_memory_select_own') THEN
    CREATE POLICY "theo_user_memory_select_own" ON public.theo_user_memory FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_memory' AND policyname='theo_user_memory_insert_own') THEN
    CREATE POLICY "theo_user_memory_insert_own" ON public.theo_user_memory FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_memory' AND policyname='theo_user_memory_update_own') THEN
    CREATE POLICY "theo_user_memory_update_own" ON public.theo_user_memory FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_memory' AND policyname='theo_user_memory_delete_own') THEN
    CREATE POLICY "theo_user_memory_delete_own" ON public.theo_user_memory FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_user_memory_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_user_memory WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_user_memory_exists_unscoped(uuid) TO authenticated;
