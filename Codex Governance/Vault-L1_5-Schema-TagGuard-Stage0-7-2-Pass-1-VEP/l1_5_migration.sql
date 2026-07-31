-- l1_5_migration.sql
-- Vault Memory Architecture — Stage-0 §7.2: L1.5 "Project Context" items + information-type tags + Tag Guard write-path.
-- Authority: Vault_Access_Policy_Engine_Stage0_Design §4 (Tag Guard) + §7 item 2; VAULT_MEMORY_ARCHITECTURE.md §3 (info-types),
--            §5 (Tag Guard vs Dottie), Amendment 7 (firm-role hierarchy).
-- Executor: Walter, as pgadmin_vault (per Execution Orchestration §1C). Claude Code does NOT run write SQL.
-- Shape: ADDITIVE only (new table + new functions). No destructive change to any deployed object.
-- Mirrors deployed idioms: theo_user_memory (b7a_migration.sql) table+RLS+exists-helper; theo_publish_conversation /
--   theo_project_add_member (spw_phase2b1 / spw_phase1) SECURITY DEFINER gate; theo_project_effective_role (spw_phase1).
-- SQLSTATE vocabulary (matches SPW gates): 28000 = unauthenticated (401); 42501 = insufficient privilege (403);
--   22023 = invalid argument (400); P0002 = not found (404).

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────────────────────────
-- 1) L1.5 Project Context items (net-new; L1.5 information-typing is greenfield per design §6 G-1)
-- ─────────────────────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.theo_project_context_items (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id             uuid NOT NULL REFERENCES public.theo_projects(id) ON DELETE CASCADE,
  info_type              text NOT NULL
                           CHECK (info_type IN ('factual','technical','deliberative','governance','commercial','personnel')),
  content                text NOT NULL CHECK (length(trim(content)) > 0),
  sharepoint_ref         text NULL,   -- Rule-5 (SharePoint-Graph reachability) hook; NULL => pure-DB item (design §2.2/§3.2)
  source_conversation_id uuid NULL REFERENCES public.theo_conversations(id) ON DELETE SET NULL,
  created_by             text NOT NULL,  -- owner OID; ALWAYS set by the Tag Guard fn from the JWT claim, never a client value
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_theo_project_context_items_project
  ON public.theo_project_context_items (project_id);
CREATE INDEX IF NOT EXISTS idx_theo_project_context_items_project_type
  ON public.theo_project_context_items (project_id, info_type);
CREATE INDEX IF NOT EXISTS idx_theo_project_context_items_created_by
  ON public.theo_project_context_items (created_by);

-- ─────────────────────────────────────────────────────────────────────────────────────────────
-- 2) RLS. Ownership baseline (4 policies) + SELECT broadened to project membership (mirrors the
--    canonical theo_conversations SELECT policy, spw_phase2a). WRITES ARE NEVER BROADENED VIA RLS —
--    the Functions connection role bypasses RLS, so write authority lives in the Tag Guard SECURITY
--    DEFINER function (§3). These policies bound any NON-definer access path (e.g. §7.3 reads).
-- ─────────────────────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.theo_project_context_items ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_context_items' AND policyname='theo_project_context_items_select_member') THEN
    CREATE POLICY "theo_project_context_items_select_member" ON public.theo_project_context_items
      FOR SELECT TO authenticated
      USING (
        created_by = auth.uid()
        OR project_id IN (
          SELECT id FROM public.theo_projects WHERE created_by = auth.uid()
          UNION
          SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid()
        )
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_context_items' AND policyname='theo_project_context_items_insert_own') THEN
    CREATE POLICY "theo_project_context_items_insert_own" ON public.theo_project_context_items
      FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_context_items' AND policyname='theo_project_context_items_update_own') THEN
    CREATE POLICY "theo_project_context_items_update_own" ON public.theo_project_context_items
      FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_context_items' AND policyname='theo_project_context_items_delete_own') THEN
    CREATE POLICY "theo_project_context_items_delete_own" ON public.theo_project_context_items
      FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────────────────────
-- 3) Tag Guard write-path (design §4). SECURITY DEFINER; caller from the JWT claim (NEVER a parameter);
--    p_firm_role passed IN — resolved in the handler from the §7.1 firm-role source (theo_get_my_role /
--    resolveFirmRole). NULL/unknown firm role => least-privileged (restricted tags fail-closed).
--    Enforcement order (all fail-closed): authenticated -> content present -> tag present & known ->
--    caller is a project member -> tag authority (firm-role floor for restricted tags) -> INSERT.
-- ─────────────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.theo_tag_guard_write_context_item(
  p_project_id             uuid,
  p_info_type              text,
  p_content                text,
  p_firm_role              text,               -- caller's resolved firm role (§7.1) or NULL => least-privileged
  p_sharepoint_ref         text DEFAULT NULL,
  p_source_conversation_id uuid DEFAULT NULL
) RETURNS public.theo_project_context_items
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller text := current_setting('request.jwt.claim.sub', true);
  v_role   text;                                          -- project role: 'creator'|'owner'|'member'|NULL
  v_type   text := lower(btrim(coalesce(p_info_type, '')));
  v_firm   text := lower(btrim(coalesce(p_firm_role, '')));
  v_row    public.theo_project_context_items;
BEGIN
  -- (0) authenticated (never trust a parameter for identity)
  IF v_caller IS NULL OR v_caller = '' THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;

  -- (1) content required (no empty items)
  IF p_content IS NULL OR length(btrim(p_content)) = 0 THEN
    RAISE EXCEPTION 'content is required' USING ERRCODE = '22023';
  END IF;

  -- (2) tag required + known (no untagged / unknown-tag writes — fail-closed, design §4/§5)
  IF v_type = '' THEN
    RAISE EXCEPTION 'info_type (tag) is required' USING ERRCODE = '22023';
  END IF;
  IF v_type NOT IN ('factual','technical','deliberative','governance','commercial','personnel') THEN
    RAISE EXCEPTION 'unknown info_type (tag)' USING ERRCODE = '22023';
  END IF;

  -- (3) project membership is the floor for EVERY write (creator/owner/member). NULL => not a member OR
  --     project absent; we do not leak which (fail-closed 42501). The handler surfaces 403.
  v_role := public.theo_project_effective_role(p_project_id);
  IF v_role IS NULL THEN
    RAISE EXCEPTION 'not a project member' USING ERRCODE = '42501';
  END IF;

  -- (4) tag authority: firm-role floor for the RESTRICTED tags (design §4; vision §3). Restricted tags
  --     fail-closed when firm role is unresolved (NULL/unknown => least-privileged). factual/technical/
  --     deliberative need only project membership (already established).
  --     TUNABLE POLICY: 'commercial' is fixed by the vision (partner+director+senior_manager). The
  --     'governance' (sign-off authority) and 'personnel' (need-to-know) floors are a Vault policy value;
  --     adjust them here in a future Walter-run migration if the thresholds change. Read-side need-to-know
  --     narrowing for 'personnel' is deferred to the §7.3 read engine.
  IF v_type = 'commercial' THEN
    IF v_firm NOT IN ('partner','director','senior_manager') THEN
      RAISE EXCEPTION 'commercial tag requires partner, director, or senior_manager' USING ERRCODE = '42501';
    END IF;
  ELSIF v_type = 'governance' THEN
    IF v_firm NOT IN ('partner','director','senior_manager','manager') THEN
      RAISE EXCEPTION 'governance tag requires sign-off authority (manager and above)' USING ERRCODE = '42501';
    END IF;
  ELSIF v_type = 'personnel' THEN
    IF v_firm NOT IN ('partner','director') THEN
      RAISE EXCEPTION 'personnel tag requires partner or director (need-to-know)' USING ERRCODE = '42501';
    END IF;
  END IF;

  -- (5) write. Owner = caller from the claim; never a parameter. info_type stored normalised (v_type).
  INSERT INTO public.theo_project_context_items
    (project_id, info_type, content, sharepoint_ref, source_conversation_id, created_by)
  VALUES
    (p_project_id, v_type, p_content, p_sharepoint_ref, p_source_conversation_id, v_caller)
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_tag_guard_write_context_item(uuid, text, text, text, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_tag_guard_write_context_item(uuid, text, text, text, text, uuid) TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────────────────────
-- 4) exists-unscoped helper (403 vs 404 discrimination for the §7.3 read path; mirrors
--    theo_user_memory_exists_unscoped / the SPW _exists_unscoped idiom).
-- ─────────────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.theo_project_context_item_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_project_context_items WHERE id = p_id);
$$;
REVOKE ALL ON FUNCTION public.theo_project_context_item_exists_unscoped(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_context_item_exists_unscoped(uuid) TO authenticated;

COMMIT;
