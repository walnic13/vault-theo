-- theo_can_read_migration.sql
-- Vault Memory Architecture — Stage-0 §7.3: the Postgres READ classifier public.theo_can_read (design §3.1).
-- The DB half of the access-policy engine (Amendment 1): a single audited "may the caller read this item?"
-- for the DB-KNOWABLE dimensions — L1 ownership; L1.5 membership × info-type × firm-role floor; the Rule-3
-- lowest-participant MEMBERSHIP filter. Absorbs theo_project_effective_role (§10) and theo_conversation_access
-- (§11) as helpers. The app-layer Graph reachability probe (Rule 5) AND the firm-role lowest-participant
-- filter over OTHER participants are the §7.4 orchestrated engine (Postgres cannot reach Graph, and holds only
-- the CALLER's firm role — passed IN as p_firm_role). Authority is ONE POLICY with the §7.2 Tag Guard write
-- floors (design §4): identical info-type firm-role gates.
-- Executor: Walter, as pgadmin_vault. Additive; CREATE OR REPLACE only; NO top-level BEGIN/COMMIT (Golden Handler §5.2).
-- The classifier RETURNS boolean (false = deny — no RAISE), mirroring theo_conversation_access (NULL = deny);
-- the calling handler discriminates 403-vs-404 via theo_project_context_item_exists_unscoped / theo_conversation_exists_unscoped.

CREATE OR REPLACE FUNCTION public.theo_can_read(
  p_item_layer text,      -- 'L1' | 'L1.5' | 'L2' | 'L3'
  p_item_type  text,      -- info-type tag for L1.5 (ADVISORY; the authoritative type is read from the row); NULL for L1
  p_item_id    uuid,      -- the item: L1 = theo_user_memory.id; L1.5 = theo_project_context_items.id OR theo_conversations.id
  p_project_id uuid,      -- ADVISORY; the authoritative project is read from the row
  p_firm_role  text,      -- the CALLER's resolved firm role (§7.1 OBO source), or NULL => least-privileged (fail-closed)
  p_room_oids  text[]     -- collective-chat participant OIDs for the Rule-3 lowest-participant filter; NULL/empty => 1:1 context
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller text := current_setting('request.jwt.claim.sub', true);
  v_layer  text := upper(btrim(coalesce(p_item_layer, '')));
  v_firm   text := lower(btrim(coalesce(p_firm_role, '')));
  v_owner  text;
  v_proj   uuid;
  v_type   text;
  v_role   text;
  v_oid    text;
BEGIN
  -- fail-closed: no caller identity => deny (never trust a parameter for identity)
  IF v_caller IS NULL OR v_caller = '' THEN
    RETURN false;
  END IF;

  -- ── L1 personal memory — INVIOLABLE (Rule 1 / vision §7.1): allow iff the caller owns it ─────────────
  IF v_layer = 'L1' THEN
    SELECT created_by INTO v_owner
      FROM public.theo_user_memory
     WHERE id = p_item_id AND scope = 'user';
    IF NOT FOUND THEN RETURN false; END IF;          -- absent, or a project-scoped row => deny
    RETURN (v_owner = v_caller);
  END IF;

  -- ── L1.5 project context ─────────────────────────────────────────────────────────────────────────────
  IF v_layer = 'L1.5' THEN
    -- (a) the info-typed Project Context item (§12)
    SELECT created_by, project_id, info_type INTO v_owner, v_proj, v_type
      FROM public.theo_project_context_items
     WHERE id = p_item_id;

    IF NOT FOUND THEN
      -- (b) not a context item — the published-conversation L1.5 kind: absorb theo_conversation_access (§11)
      -- as the helper. A published conversation is readable by any project participant (owner/member); untyped,
      -- so no info-type floor applies (it is the Factual/Technical-dominant shared record, vision §8).
      RETURN (public.theo_conversation_access(p_item_id) IS NOT NULL);
    END IF;

    -- owner may always read their OWN context item; a non-owner needs membership + the info-type floor
    IF v_owner <> v_caller THEN
      v_role := public.theo_project_effective_role(v_proj);      -- 'creator'|'owner'|'member'|NULL
      IF v_role IS NULL THEN RETURN false; END IF;               -- not a project member => deny
      -- info-type firm-role floor — ONE POLICY with the §7.2 Tag Guard write floors (design §4; vision §3):
      IF v_type = 'commercial' THEN
        IF v_firm NOT IN ('partner','director','senior_manager') THEN RETURN false; END IF;
      ELSIF v_type = 'governance' THEN
        IF v_firm NOT IN ('partner','director','senior_manager','manager') THEN RETURN false; END IF;
      ELSIF v_type = 'personnel' THEN
        IF v_firm NOT IN ('partner','director') THEN RETURN false; END IF;
      END IF;
      -- factual/technical/deliberative: project membership suffices to read.
    END IF;

    -- Rule 3 (lowest-participant) — DB-KNOWABLE half: in a collective-chat context the item is surfaced only
    -- if EVERY room participant is also a project member. The firm-role lowest-participant filter over other
    -- participants (their roles are not PG-resident) is the §7.4 app-layer engine.
    IF p_room_oids IS NOT NULL AND array_length(p_room_oids, 1) IS NOT NULL THEN
      FOREACH v_oid IN ARRAY p_room_oids LOOP
        IF v_oid IS NOT NULL AND v_oid <> '' THEN
          IF NOT (
            EXISTS (SELECT 1 FROM public.theo_projects        WHERE id = v_proj AND created_by = v_oid)
            OR EXISTS (SELECT 1 FROM public.theo_project_members WHERE project_id = v_proj AND member_oid = v_oid)
          ) THEN
            RETURN false;                                        -- a non-member is present => do not surface
          END IF;
        END IF;
      END LOOP;
    END IF;

    RETURN true;
  END IF;

  -- ── L2 / L3 — RESERVED: their schemas are not yet built; fail-closed (deny) until they land ───────────
  -- (design §3.1: L2/L3 = read-only, rights-filtered substrate — wired here when the L2/L3 tables exist.)
  RETURN false;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_can_read(text, text, uuid, uuid, text, text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_can_read(text, text, uuid, uuid, text, text[]) TO authenticated;

-- ── Reversal (documented; run only to roll back — additive function, no data impact) ──────────────────
-- DROP FUNCTION IF EXISTS public.theo_can_read(text, text, uuid, uuid, text, text[]);
