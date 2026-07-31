# Vault L1.5 Schema + Tag Guard write-path (Stage-0 §7.2) — `theo_project_context_items` + `theo_tag_guard_write_context_item` + `theo_create_project_context_item` — Pass-1 VEP

Backend implementation VEP (Pass 1) for **Stage-0 §7.2** of the Codex-APPROVED access-policy engine design ([[Vault_Access_Policy_Engine_Stage0_Design.md]] §4, §7 item 2). Delivers the engine's **L1.5 Project Context substrate + write-path enforcement**: (1) a net-new `theo_project_context_items` table with a six-value **information-type tag** column (vision §3); (2) the **Tag Guard** SECURITY DEFINER write function `theo_tag_guard_write_context_item` (design §4) that enforces project membership + tag authority, fail-closed; (3) a write handler `theo_create_project_context_item` that resolves the caller's firm role via the §7.1 OBO→Graph→`resolveFirmRole` path and passes it to the guard. **Migration is Walter-run** (`pgadmin_vault`); **handler is Claude-deployed** to `vaultgpt-func-projects` (run-from-package). Read access is the separate §7.3 (`theo_can_read`) VEP — this VEP is write-path only.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Verified Evidence Pack (backend implementation package — schema migration + handler)
Grounding parent (source baseline): `d770a56ca260905b8bda8015100a4186ea4d5fc4` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; currency anchors below are tip-independent blob SHAs
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Stage-0 DESIGN (this VEP implements §7.2) — `Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md` | Codex-APPROVED (`33f5655`); §4 Tag Guard + §7 item 2 re-read this turn | `0e6779235c9b39935c4e63688f06a27ae92a8175` |
| 2 | GOVERNING VISION — `governance/VAULT_MEMORY_ARCHITECTURE.md` (§3 info-type × access; §5 Tag Guard; §9 SPW reconciliation; Amendment 7 firm-role hierarchy) | `Read`(§3/§4/§5/§9) this turn | `d17ddd0d97887b38e6db3297c56db9d6b3cfe9cf` |
| 3 | Backend Governor — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3 Never-Guess; §4 Schema Reality Lock; §6 SQL/authorization; §8 VEP format + Gap Register) | `Grep("Never-Guess")` + `Grep("Schema Reality Lock")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 4 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 5 | Golden Handler — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary reference; §5.1 Structural Mirror Table; Golden SQL SECURITY DEFINER/search_path/SQLSTATE; §5.3 Golden Curl; §5.5 run-from-package deploy) | `Grep("Structural Mirror Table")` + `Grep("SECURITY DEFINER")` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 6 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1C Walter-runs-migrations, Claude deploys to func-projects; §1D ordered pass) | `Grep("migrations/merges remain Walter-only")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 7 | SCHEMA TRUTH — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (theo_projects/theo_project_members/theo_conversations §; theo_user_memory §6; SPW gates §10/§11 — the §5 Role-C target) | `Grep("theo_project_members")` + `Grep("theo_user_memory")` this turn | `abe14dc5d45b8a78b4d2b7303f0bd1257da120ec` |
| 8 | **PRIMARY REFERENCE (DEPLOYED)** — `theo_publish_conversation` handler + function.json on `vaultgpt-func-projects` (definer-call write + SQLSTATE map; pg + isUuid; structural mirror) | `curl` Kudu VFS GET (live bytes) this turn; byte-identical copies in-package | index.js `4f0d1bf6c51d9566bdb8fef841216694f3b06552`; function.json `0a0b4ce3f88155ee275605bb0d5489976d0497da` |
| 9 | OBO-MIRROR SOURCE (DEPLOYED) — `theo_get_my_role.index.js` (§7.1; the ALLOWED-DELTA OBO→Graph→`resolveFirmRole` block is byte-faithfully mirrored from it) | `Read`(theo_get_my_role.index.js, full) this turn | `b6a85d64acf2fc5227bc16c626a032e42d832a40` |
| 10a | DEPLOYED IDIOM — `theo_publish_conversation` SQL gate + `theo_project_effective_role` — `Codex Governance/Theo-SPW-Phase2b1-Publish-Gates-Schema-Pass-1-VEP/spw_phase2b1_migration.sql`; `.../Theo-SPW-Phase1-Roles-Substrate-Pass-1-VEP/spw_phase1_migration.sql` | catalog-verified; `git rev-parse HEAD:<path>` this turn | spw_phase2b1 `321d368aa3f53f6c2ffb2da13efd66733f0cd450`; spw_phase1 `75659097d611ba833741b2fb8383f7050c534334` |
| 10b | DEPLOYED IDIOM — `theo_user_memory` DDL + RLS/`_exists_unscoped` + base substrate — `.../Theo-1B-B7a-Memory-Substrate-Schema-Pass-1-VEP/b7a_migration.sql`; `.../Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql` | catalog-verified; `git rev-parse HEAD:<path>` this turn | b7a `bbb66f45d5b598bf104499f32b3812af41c64e26`; b2 `2f2b6ddf8bf87525bc1a43e34bb7f82351a54b7c` |
| 10c | DEPLOYED IDIOM — `theo_project_members` + membership RLS + publish-broadening subquery — `.../Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/b5c_migration.sql`; `.../Theo-SPW-Phase2a-Publish-To-Project-Schema-Pass-1-VEP/spw_phase2a_migration.sql` | catalog-verified; `git rev-parse HEAD:<path>` this turn | b5c `ddc7f01da299c3d57973b0b67ba7c41c8db06e83`; spw_phase2a `25cdb7d08553bc3ef2c52ec996e496a20c84ece5` |
| 11 | DEPLOYED FACT — `vaultgpt-func-projects` has BOTH Postgres (`PG*`) AND OBO env (`AAD_*` = KV ref) + MI holds Key Vault Secrets User on `kv-vaultgpt-uks`; run-from-package | `az functionapp config appsettings list` (names/KV-shape) + `az rest` role-assignment GET this turn | live Azure state (§3/§9) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Never-Guess" | §3 — all schema/DDL mirrored from deployed migrations, not invented |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §3 — new table grounded on deployed theo_projects/theo_user_memory shapes |
| Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md | §4 | "Tag Guard" | §2/§4 — the write-path enforcement function |
| Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md | §3.1 | "never a parameter" | §4 — caller from the JWT claim, never a parameter |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §3 | "sign-off authority only" | §2 authority table — governance tag |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §3 | "partner + director + senior manager only" | §2 authority table — commercial tag |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §A-7 | "partner > director > senior manager > manager > associate > preparer" | §2 the firm-role rank order the authority floors use |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | Golden SQL | "SECURITY DEFINER" | §4 — Tag Guard + exists-helper function idiom |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "Structural Mirror Table" | §5 — handler mirror table |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "deployed `function.json` file as the canonical Primary Reference" | §5 — primary reference = theo_publish_conversation index.js AND function.json (both inlined) |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1C | "migrations/merges remain Walter-only" | §9 — Walter runs the migration; Claude deploys the handler |

---

## §1 — Feature + design

**Feature.** Three artifacts implementing the design's §7.2:
1. **`theo_project_context_items`** (table) — the L1.5 Project Context substrate. Each row is one tagged project-scoped item: `project_id`, `info_type` (the six vision types), `content`, an optional `sharepoint_ref` (the Rule-5 hook, §7.4), optional `source_conversation_id` provenance, `created_by` (owner OID), timestamps. Information-typing is greenfield (design §6 G-1).
2. **`theo_tag_guard_write_context_item`** (SECURITY DEFINER function) — the **Tag Guard** write-path (design §4). Enforces, before insert, fail-closed at every branch: authenticated → content present → tag present & known → caller is a project member → tag authority (firm-role floor for restricted tags) → insert. Caller from `current_setting('request.jwt.claim.sub', true)` — **never a parameter**.
3. **`theo_create_project_context_item`** (handler, `POST`) — resolves the caller's firm role via delegated Graph OBO (the §7.1 technique, byte-faithful), validates typed inputs, calls the guard, maps SQLSTATE→HTTP, returns the created item (`201`).

**Scope boundary.** Write-path only. The read path (`theo_can_read`, absorbing `theo_conversation_access`/`theo_project_effective_role` as helpers) is §7.3 — NOT in this VEP. The table's RLS SELECT policy is provided (project-membership-scoped) so the table is not readable outside membership before §7.3 lands, but no read handler ships here.

## §2 — Architecture & boundary reconciliation

**Where this sits.** L1.5 is the shared project memory layer (vision §1). This VEP builds its substrate + write enforcement; it does not touch L1 (`theo_user_memory`, inviolable — vision §7.1), L2/L3, or Dottie (§5/Stage 6). It reuses the DEPLOYED SPW project graph (`theo_projects`, `theo_project_members`, `theo_project_effective_role`) rather than introducing a second authorization model (vision §9 / design §6 G-4): project membership is resolved through the existing `theo_project_effective_role` classifier.

**Boundary.** No `reporting_*` access; no Blob; no cross-tenant reach. The only external call is the OBO→Graph profile read for the caller's own `jobTitle` (identical surface to §7.1). The handler runs on `vaultgpt-func-projects` (the projects-domain app), alongside `theo_publish_conversation` / `theo_add_project_knowledge`.

**Information-type authority model (the core policy).** Vision §3 fixes each type's access; Tag Guard enforces the **write** side (who may APPLY a tag). Project membership is the floor for EVERY write; firm role (resolved via §7.1) is the ADDITIONAL gate on the three restricted tags. Firm-role rank (Amendment 7): `partner > director > senior_manager > manager > associate > preparer > null`.

| info_type | Write authority (this VEP) | Vision §3 basis | Fixed / tunable |
| --------- | -------------------------- | --------------- | --------------- |
| factual / technical / deliberative | any project member (creator/owner/member) | "broad" / "by role" / "participants + levels above" | membership-only |
| **commercial** | firm_role ∈ {partner, director, senior_manager} | "partner + director + senior manager only" | **FIXED by vision** |
| **governance** | firm_role ∈ {partner, director, senior_manager, manager} | "sign-off authority only" | tunable (manager-and-above recommended) |
| **personnel** | firm_role ∈ {partner, director} | "very restricted, need-to-know" | tunable (director-and-above recommended); read-side need-to-know narrowing deferred to §7.3 |

**Fail-closed (design §5).** Unresolved firm role (`NULL`/unknown — OBO failure, non-fee-earner title) ⇒ restricted tags are rejected (`42501`). Untagged/unknown tag ⇒ `22023`. Non-member ⇒ `42501`. A mis-tag over-restricts; it never leaks. The recommended governance/personnel floors are a **Vault policy value** encoded as data in the guard — Walter can retune them in a future migration without touching the handler.

## §3 — Schema Reality Lock (deployed grounding for the new DDL)

The new table + functions mirror DEPLOYED idioms (Governor §3 Never-Guess / §4 Schema Reality Lock) — nothing is invented:
- **Table shape** mirrors `theo_user_memory` (b7a, blob `bbb66f45`): `id uuid PK DEFAULT gen_random_uuid()`, `created_by text NOT NULL`, `content text NOT NULL CHECK (length(trim(content)) > 0)`, `project_id uuid REFERENCES public.theo_projects(id) ON DELETE CASCADE`, `source_conversation_id uuid REFERENCES public.theo_conversations(id) ON DELETE SET NULL`, `timestamptz NOT NULL DEFAULT now()`. The `info_type` CHECK is the six vision types (net-new).
- **RLS** mirrors the 4-policy ownership baseline (b2, blob `2f2b6ddf`) + the canonical project-membership SELECT-broadening subquery (spw_phase2a, blob `25cdb7d0`): `created_by = auth.uid() OR project_id IN (SELECT id FROM theo_projects WHERE created_by = auth.uid() UNION SELECT project_id FROM theo_project_members WHERE member_oid = auth.uid())`. **Writes are never broadened via RLS** — the Functions role bypasses RLS; write authority lives in the Tag Guard function.
- **Tag Guard function** mirrors the deployed gate idiom: `theo_publish_conversation` (spw_phase2b1, blob `321d368a`) for `SECURITY DEFINER SET search_path = public` + caller-from-claim + `RAISE EXCEPTION … USING ERRCODE` + REVOKE/GRANT; `theo_project_effective_role` (spw_phase1, blob `75659097`) for the membership classifier it calls.
- **`_exists_unscoped` helper** mirrors `theo_user_memory_exists_unscoped` (b7a) for §7.3's future 403/404 discrimination.
- **Deployed app fact:** `vaultgpt-func-projects` already carries the full Postgres connection (`PG*`/`POSTGRES_*`) AND the OBO env (`AAD_TENANT_ID`/`AAD_CLIENT_ID`/`AAD_CLIENT_SECRET` = the `kv-vaultgpt-uks` KV reference), and its managed identity holds **Key Vault Secrets User** on that vault. So the handler needs **zero new infrastructure** — pg + OBO both resolve today. Deploy model is **run-from-package** (§5.5).

## §4 — The migration (Walter runs as `pgadmin_vault`)

Runnable file: `l1_5_migration.sql` (in this package). Additive only; wrapped in `BEGIN`/`COMMIT`; idempotent (`IF NOT EXISTS` / `CREATE OR REPLACE`). Full text:

```sql
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
-- NO top-level transaction control (Golden Handler §5.2): Walter runs this migration; every statement is
-- idempotent (IF NOT EXISTS / CREATE OR REPLACE) and safely re-runnable on its own.

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
```

## §5 — Primary Reference (DEPLOYED) + Structural Mirror Table

**Primary Reference:** `theo_publish_conversation` — DEPLOYED on `vaultgpt-func-projects`, fetched live via Kudu VFS this turn (Golden Handler §5.5: the deployed handler is the source of truth). It is the canonical **definer-call write** handler: `pg` pool, `isUuid`, identity from EasyAuth claims, `set_config` per-request, `SELECT public.<gate>(…)`, and a compact SQLSTATE→HTTP `mapGateError` over exactly the vocabulary the Tag Guard raises. Byte-identical copies are in-package (`PRIMARY_REFERENCE.theo_publish_conversation.index.js` / `.function.json`); both files inlined full-verbatim (Golden Handler §2 requires BOTH).

### §5.1 Structural Mirror Table (Golden Handler §5.1)

| Handler region | Classification vs Primary Reference | Notes |
| -------------- | ----------------------------------- | ----- |
| `require("pg")` + `pool` (`POSTGRES_CONNECTION_STRING`, ssl) | **EXACT** | byte-identical to primary reference |
| `corsHeaders` / `send` / `nowIso` / `errorBody` / `successBody` | **EXACT** | byte-identical |
| `getPrincipal` / `getClaimValue` / `parseBody` / `isUuid` | **EXACT** | byte-identical |
| `mapGateError` (28000/42501/22023/P0002 → HTTP) | **ALLOWED DELTA** | same vocabulary + shape; message strings adapted to this endpoint (Golden Handler §4 allowed: contract response shape / messages) |
| OBO→Graph→`resolveFirmRole` block (`requestUrl`/`getOboInputToken`/`exchangeGraphToken`/`graphGetJson`/`resolveFirmRole`/`buildKnownError`/`parseJsonSafe`) | **ALLOWED DELTA (new-external-system helper, EXACT-mirrored)** | Golden Handler §4: a new-external-system helper is permitted as ALLOWED DELTA with an **EXACT mirror against a deployed handler containing that helper** — here byte-faithful to the DEPLOYED `theo_get_my_role` (§7.1, blob `b6a85d64`). No Walter authorization needed (the EXACT-mirror route). |
| identity → validate typed inputs → resolve firm role → `SELECT * FROM theo_tag_guard_write_context_item(...)` → `201` | **ALLOWED DELTA** | endpoint name / validated field set / SQL function called / response shape — all §4-permitted deltas |
| SQLSTATE catch (+ `23503`→404 FK, `23514`→400 CHECK) | **ALLOWED DELTA** | superset of the primary reference's catch (adds FK/CHECK rows); same idiom |

No DEVIATION regions.

### §5.2 Primary Reference — `theo_publish_conversation` index.js (full verbatim)

```javascript
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

// Map a SECURITY DEFINER gate-function SQLSTATE (SPW Phase 2b-1) to an HTTP error, or null if not a
// recognised gate error. 28000 → 401, 42501 → 403, 22023 → 400, P0002 → 404.
function mapGateError(err) {
  if (!err || typeof err.code !== "string") return null;
  switch (err.code) {
    case "28000": return { status: 401, code: "UNAUTHORIZED", message: "Missing or invalid identity." };
    case "42501": return { status: 403, code: "FORBIDDEN", message: "Only the conversation owner may publish it." };
    case "22023": return { status: 400, code: "INVALID_REQUEST", message: err.message || "Conversation is not linked to a project." };
    case "P0002": return { status: 404, code: "NOT_FOUND", message: "Conversation not found." };
    default: return null;
  }
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);

  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  const conversationId = typeof body.conversation_id === "string" ? body.conversation_id.trim() : "";
  if (!isUuid(conversationId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'conversation_id' is required and must be a valid UUID.", 400));
  }

  let client = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // SPW Phase 2b-1: publish the conversation into its linked project, via the deployed SECURITY
    // DEFINER theo_publish_conversation. CONVERSATION-owner-only (non-owner → 42501); conversation
    // must be linked to a project (project_id NULL → 22023); absent → P0002. Idempotent — re-publish
    // preserves the original publish metadata (gate returns false). The conversation is published
    // regardless of the newly-published boolean, so the response reports published:true.
    await client.query(
      `SELECT public.theo_publish_conversation($1::uuid)`,
      [conversationId]
    );

    return send(context, 200, successBody({ conversation_id: conversationId, published: true }));
  } catch (err) {
    context.log.error("theo_publish_conversation failed", err);
    const mapped = mapGateError(err);
    if (mapped) {
      return send(context, mapped.status, errorBody(mapped.code, mapped.message, mapped.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

### §5.3 Primary Reference — `theo_publish_conversation` function.json (full verbatim)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_publish_conversation"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §6 — The handler (`theo_create_project_context_item`)

Deployed to `vaultgpt-func-projects` (run-from-package). `node --check` clean; `resolveFirmRole` self-tested byte-identical to deployed `theo_get_my_role`. Full text:

```javascript
const { Pool } = require("pg");
const https = require("https");

// theo_create_project_context_item (Vault Memory Architecture Stage-0 §7.2 — L1.5 Project Context write).
// Creates a tagged L1.5 item through the Tag Guard write-path: resolves the CALLER's firm role via delegated
// Microsoft Graph OBO (the same technique + env as the deployed theo_get_my_role, §7.1 — AAD_TENANT_ID /
// AAD_CLIENT_ID / AAD_CLIENT_SECRET), then calls the SECURITY DEFINER public.theo_tag_guard_write_context_item,
// which enforces project membership + information-type tag authority (fail-closed) before inserting. Structure
// mirrors the deployed theo_publish_conversation (definer-call write + SQLSTATE map); the OBO block mirrors
// theo_get_my_role. Runs on vaultgpt-func-projects (pg + OBO both already provisioned).

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const GRAPH = "https://graph.microsoft.com/v1.0";
const CONTENT_MAX_LEN = 10000;
const VALID_INFO_TYPES = ["factual", "technical", "deliberative", "governance", "commercial", "personnel"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

// Map a SECURITY DEFINER gate-function SQLSTATE (Tag Guard) to an HTTP error, or null if not a recognised
// gate error. 28000 -> 401, 42501 -> 403, 22023 -> 400, P0002 -> 404. (Same vocabulary as the SPW gates.)
function mapGateError(err) {
  if (!err || typeof err.code !== "string") return null;
  switch (err.code) {
    case "28000": return { status: 401, code: "UNAUTHORIZED", message: "Missing or invalid identity." };
    case "42501": return { status: 403, code: "FORBIDDEN", message: err.message || "You are not authorised to write this item." };
    case "22023": return { status: 400, code: "INVALID_REQUEST", message: err.message || "Invalid request." };
    case "P0002": return { status: 404, code: "NOT_FOUND", message: "Project not found." };
    default: return null;
  }
}

// ── OBO -> Graph firm-role resolution (byte-faithful mirror of the deployed theo_get_my_role, §7.1) ──────────
function buildKnownError(code, message, status) {
  const err = new Error(message);
  err.code = code; err.status = status; err.isKnown = true;
  return err;
}

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = https.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : 443,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }); });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function getBearerTokenFromAuthorization(req) {
  const raw = req.headers["authorization"];
  if (!raw || typeof raw !== "string") return null;
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match && match[1] ? match[1].trim() : null;
}

function getOboInputToken(req) {
  const bearer = getBearerTokenFromAuthorization(req);
  if (bearer) {
    return { token: bearer, source: "authorization_bearer" };
  }
  const tokenStore = req.headers["x-ms-token-aad-access-token"];
  if (typeof tokenStore === "string" && tokenStore.trim() !== "") {
    return { token: tokenStore.trim(), source: "x-ms-token-aad-access-token" };
  }
  return null;
}

async function exchangeGraphToken(oboInputToken) {
  const tenantId = process.env.AAD_TENANT_ID;
  const clientId = process.env.AAD_CLIENT_ID;
  const clientSecret = process.env.AAD_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw buildKnownError("INTERNAL_SERVER_ERROR", "Missing required OBO configuration.", 500);
  }
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    requested_token_use: "on_behalf_of",
    assertion: oboInputToken,
    scope: "https://graph.microsoft.com/.default",
  }).toString();
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const r = await requestUrl(
    tokenUrl,
    { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(form) } },
    form
  );
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300 || !payload || !payload.access_token) {
    const description = payload && (payload.error_description || payload.error || (payload.error_codes && payload.error_codes.join(", ")));
    const message = description ? `Delegated Graph token exchange failed: ${description}` : "Delegated Graph token exchange failed.";
    if (r.statusCode === 400 || r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload.access_token;
}

async function graphGetJson(url, accessToken) {
  const r = await requestUrl(url, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" } });
  const payload = parseJsonSafe(r.body);
  if (r.statusCode < 200 || r.statusCode >= 300) {
    const message = (payload && payload.error && payload.error.message) || `Graph request failed (HTTP ${r.statusCode}).`;
    if (r.statusCode === 401 || r.statusCode === 403) throw buildKnownError("FORBIDDEN", message, 403);
    throw buildKnownError("INTERNAL_SERVER_ERROR", message, 500);
  }
  return payload || {};
}

// Firm-role mapping — BYTE-IDENTICAL to the deployed theo_get_my_role.resolveFirmRole (§7.1). Case-insensitive,
// most-senior-first substring match; unmapped / non-fee-earner / absent title => null => least-privileged.
function resolveFirmRole(jobTitle) {
  if (typeof jobTitle !== "string") return null;
  const t = jobTitle.trim().toLowerCase();
  if (!t) return null;
  if (t.includes("partner")) return "partner";
  if (t.includes("director")) return "director";
  if (t.includes("senior manager")) return "senior_manager";
  if (t.includes("manager")) return "manager";
  if (t.includes("associate")) return "associate";
  if (t.includes("preparer")) return "preparer";
  return null;
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);

  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try {
    body = parseBody(req);
  } catch {
    return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400));
  }

  // Validate typed inputs BEFORE any SQL (isUuid / enum / length gates first).
  const projectId = typeof body.project_id === "string" ? body.project_id.trim() : "";
  if (!isUuid(projectId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'project_id' is required and must be a valid UUID.", 400));
  }

  const infoType = typeof body.info_type === "string" ? body.info_type.trim().toLowerCase() : "";
  if (!VALID_INFO_TYPES.includes(infoType)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'info_type' is required and must be one of: factual, technical, deliberative, governance, commercial, personnel.", 400));
  }

  const content = typeof body.content === "string" ? body.content : "";
  if (content.trim().length === 0) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'content' is required.", 400));
  }
  if (content.length > CONTENT_MAX_LEN) {
    return send(context, 400, errorBody("INVALID_REQUEST", `Field 'content' exceeds the maximum length of ${CONTENT_MAX_LEN} characters.`, 400));
  }

  const sharepointRef =
    body.sharepoint_ref == null ? null : (typeof body.sharepoint_ref === "string" && body.sharepoint_ref.trim() ? body.sharepoint_ref.trim() : null);

  let sourceConversationId = null;
  if (body.source_conversation_id != null && body.source_conversation_id !== "") {
    const raw = String(body.source_conversation_id).trim();
    if (!isUuid(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'source_conversation_id' must be a valid UUID when provided.", 400));
    }
    sourceConversationId = raw;
  }

  // Resolve the caller's firm role via delegated Graph OBO (same technique + env as theo_get_my_role, §7.1).
  // Best-effort: on ANY OBO/Graph failure, firmRole stays null => least-privileged (the Tag Guard rejects the
  // restricted tags with 403). Membership-only tags (factual/technical/deliberative) still succeed. This never
  // fails the write by itself.
  let firmRole = null;
  const oboInput = getOboInputToken(req);
  if (oboInput) {
    try {
      const graphToken = await exchangeGraphToken(oboInput.token);
      const me = await graphGetJson(`${GRAPH}/users/${encodeURIComponent(oid)}?$select=id,jobTitle`, graphToken);
      firmRole = resolveFirmRole(me && typeof me.jobTitle === "string" ? me.jobTitle : null);
    } catch (e) {
      context.log.warn("theo_create_project_context_item: firm-role resolution failed; proceeding least-privileged", e && e.message);
    }
  }

  let client = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Tag Guard write-path (Stage-0 §7.2): the SECURITY DEFINER function enforces project membership +
    // information-type tag authority (fail-closed) then inserts. p_firm_role is the OBO-resolved role above
    // (NULL => least-privileged). Non-member / unauthorised tag -> 42501; untagged/unknown tag/blank content
    // -> 22023; absent project -> 23503 (FK). Returns the created row.
    const result = await client.query(
      `SELECT * FROM public.theo_tag_guard_write_context_item($1::uuid, $2::text, $3::text, $4::text, $5::text, $6::uuid)`,
      [projectId, infoType, content, firmRole, sharepointRef, sourceConversationId]
    );

    const row = result.rows[0];
    return send(context, 201, successBody({ item: row }));
  } catch (err) {
    context.log.error("theo_create_project_context_item failed", err);
    const mapped = mapGateError(err);
    if (mapped) {
      return send(context, mapped.status, errorBody(mapped.code, mapped.message, mapped.status));
    }
    if (err && err.code === "23503") {
      return send(context, 404, errorBody("NOT_FOUND", "Project not found.", 404));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Item violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) {
      client.release();
    }
  }
};
```

### §6.1 function.json

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_create_project_context_item"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §7 — Golden Curls (Golden Handler §5.3; Claude runs post-deploy)

Deterministic, run as authenticated `az` bearer (audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`) after deploy. The authority matrix is the assertion surface. Preconditions: a project the caller is a member of (`P`), a project the caller is NOT a member of (`Q`).

| # | Caller | Body | Expect |
| - | ------ | ---- | ------ |
| C1 | partner (Walter) | `{project_id:P, info_type:"factual", content:"…"}` | **201** `{ data:{ item:{ id, project_id:P, info_type:"factual", created_by:<oid> … } } }` |
| C2 | partner | `{project_id:P, info_type:"commercial", content:"…"}` | **201** (partner authorised for commercial) |
| C3 | partner | `{project_id:P, info_type:"governance", content:"…"}` | **201** |
| C4 | partner | `{project_id:P, info_type:"personnel", content:"…"}` | **201** |
| C5 | partner | `{project_id:Q, info_type:"factual", content:"…"}` | **403** FORBIDDEN (not a member of Q) |
| C6 | partner | `{project_id:P, info_type:"governance"}` (no content) | **400** INVALID_REQUEST |
| C7 | partner | `{project_id:P, info_type:"nonsense", content:"…"}` | **400** INVALID_REQUEST (handler enum gate) |
| C8 | partner | `{project_id:"not-a-uuid", …}` | **400** INVALID_REQUEST |
| C9 | (unauth) | any | **401** UNAUTHORIZED |
| C10 | partner | `{project_id:<absent uuid>, info_type:"factual", content:"…"}` | **403** FORBIDDEN (absent project → `theo_project_effective_role` NULL → guard `42501`; indistinguishable from non-member by design — fail-closed, no existence leak) |

Note on C10: `theo_project_effective_role` returns NULL for BOTH an absent project AND a non-member caller, so the guard raises `42501` → **403** before any FK path — deliberately not leaking project existence (fail-closed). The handler's `23503`/404 branch exists only as defence-in-depth (a project vanishing between membership resolution and insert); it is NOT the C10 path. (An associate test caller — commercial/governance/personnel → **403** — runs if an associate OID is available; otherwise C1–C5 bound the authority matrix.)

## §8 — Gap Register

**PROCEED.** No missing CURRENT authority (design authority + vision + deployed schema fully ground this); no ESCALATE conditions.
- **G-1 (L1.5 info-typing greenfield): PROCEED** — the tag column + Tag Guard ship here, exactly as the design's §7 item 2 directs.
- **G-FIRMROLE (restricted-tag authority needs firm role): PROCEED** — resolved in-handler via the DEPLOYED §7.1 OBO path (byte-faithful); `NULL` ⇒ least-privileged (design-sanctioned degrade). No new infra (func-projects already has OBO env + KV grant).
- **G-POLICY (governance/personnel floors are soft in the vision): PROCEED (PRE-LAND note)** — vision §3 fixes commercial precisely and leaves governance ("sign-off authority") / personnel ("need-to-know") as thresholds; this VEP encodes a recommended, **tunable** floor (manager-and-above / director-and-above) as a data value in the guard, flagged in-code and here. Retuning is a future Walter-run migration, not a code change.
- **G-APISPEC + G-SCHEMADOC (contract/schema docs): PRE-LAND (Role-C, post-deploy)** — the new endpoint's API-Spec §2 row and the new table/functions' `spec/THEO_AZURE_POSTGRES_SCHEMA.md` entries land via Role-C AFTER the Walter-run migration + Claude deploy + golden curls, per the deploy→document ordering (as §7.1 did). Disclosed; does not block Pass-2.

## §9 — Deploy plan (ordered; §1C/§1D)

1. **Codex Pass-2** review of this VEP → APPROVED/REJECTED.
2. **Walter** runs `l1_5_migration.sql` as `pgadmin_vault` (DB writes/migrations remain Walter-only). Claude may run read-only `SELECT` catalog verification after.
3. **Claude** deploys `theo_create_project_context_item` to `vaultgpt-func-projects` via **run-from-package** (§5.5: `npm ci` from the committed lockfile → versioned `.zip` → `deploy-packages` Blob → `WEBSITE_RUN_FROM_PACKAGE` pointer → restart), then runs the §7 golden curls.
4. **Role-C** lands the API-Spec §2 row + the schema-doc entries (G-APISPEC / G-SCHEMADOC).

## Codex activation note (Walter forwards)

```
Codex is activated for Pass-2 review of the Vault L1.5 Schema + Tag Guard write-path (Stage-0 §7.2),
vault-theo, "Codex Governance/Vault-L1_5-Schema-TagGuard-Stage0-7-2-Pass-1-VEP/Vault_L1_5_Schema_TagGuard_Stage0_7_2_VEP.md".
Open your Pass-2 turn with a governance-bound Grounding Conformance Receipt + Rule Anchor Table
(Theo Grounding Conformance §3/§5). This is a backend implementation package (a Walter-run migration +
a Claude-deployed handler). Review for: (1) the migration (§4) — is theo_project_context_items shape +
RLS faithful to the deployed theo_user_memory / SPW idioms (Schema Reality Lock), is the info_type CHECK
the six vision types, and is the additive/idempotent posture correct? (2) Tag Guard (§4 fn) — is it
SECURITY DEFINER + search_path pinned + caller-from-claim (never a parameter) + REVOKE/GRANT, is the
enforcement order fail-closed at every branch, and is the authority model (§2 table: commercial FIXED by
vision; governance/personnel tunable floors) a faithful, safe reading of vision §3 + Amendment 7? (3) the
handler (§6) — is the structural mirror (§5.1) honest, is the OBO block a byte-faithful ALLOWED-DELTA
mirror of the deployed theo_get_my_role (§7.1) under Golden Handler §4's EXACT-mirror route (no Walter
auth needed), and are typed inputs validated before SQL with correct SQLSTATE→HTTP? (4) fail-closed
completeness — does an unresolved firm role reject restricted tags, and does a mis-tag over-restrict
rather than leak? (5) the deploy plan (§9) — Walter-runs-migration / Claude-run-from-package-to-func-projects,
with the API-Spec + schema-doc Role-C correctly deferred post-deploy (G-APISPEC / G-SCHEMADOC). Emit
APPROVED or REJECTED only.
```
