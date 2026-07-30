# Theo — Shared Project Workspace Phase 1: role model on `theo_project_members` (substrate + gate functions) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete Walter-executable migration for deploy at Pass 3, after which Claude Code runs the read-only catalog verification. **Program:** Shared Project Workspace (Walter-approved design 2026-07-30 — turning a shared Theo project into a collaborative reasoning workspace). **This microstep = Phase 1 "Roles & permissions" foundation:** add a `role` (owner|member) column to the deployed `theo_project_members` table and the governed **SECURITY DEFINER** gate functions that enforce the Creator / Owner / Member model. The project **Creator** = `theo_projects.created_by` (implicit top authority; never a member row); a membership `role='owner'` = a promoted **Owner**; `role='member'` = a **Member**. **Owner status is mutated ONLY by the Creator** (mint, demote, or remove an Owner); Creator + Owners add and remove **Members**; Members cannot manage anyone. **Substrate only** — the handler wiring (Phase 1b: `theo_share_project`/`theo_unshare_project`/`theo_list_project_members` adopt the functions + a new `theo_set_project_member_role`) and the later publish / decision-log / fork phases are subsequent microsteps. **RLS is UNCHANGED** (additive column; privileged writes are function-gated — the deployed `theo_chat_leave`/`dms_sub_*` idiom — so the B5c non-recursion invariant is preserved).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `fad23986222fbb876d031c92c6f49fe50d3bbfd8` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Schema + SECURITY DEFINER gate-function microstep (no HTTP handler, no model call — handlers are Phase 1b). The `role` column extends the deployed B5c `theo_project_members`; the five gate functions mirror the deployed governed service write-path idiom (`theo_chat_leave`, `dms_sub_*`) — SECURITY DEFINER, migration-role-owned, pinned `search_path`, `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated`, caller OID from `request.jwt.claim.sub` (never a parameter). Sharing/membership RLS is out of default 1B scope "unless Walter authorizes" (Backend Plan; Schema §1) — Walter authorized this role extension 2026-07-30 (precedent: B5a/B5c). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§4/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | `Read` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (schema / SECURITY DEFINER discipline) | `Read` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | `Read` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (scope: sharing/membership authorization gate) | `Grep("sharing/membership RLS models")` this turn | `97645ecd0bc9e3c25082dd2a333c82ab83446584` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `Grep("Default family: ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 sharing gate; §2 RLS; §8/§9 definer idiom) | `Grep("Membership/sharing models are introduced")` + `Read` this turn | `57fa5f2a33e683692c12a41dfe732b92bed101a4` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2C project sharing — current owner-only contract) | `Grep("Writes (share/unshare) stay owner-only")` this turn | `60a2d548d75022c01595d6e5860c5003b76abe20` |
| 10 | **Extended table (deployed DDL)** — B5c migration — `Codex Governance/Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/b5c_migration.sql` | `Read` this turn | `ddc7f01da299c3d57973b0b67ba7c41c8db06e83` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL executed (plan only; Walter runs the migration at Pass 3).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P7 — the authorization gate this change rides on (Walter-authorized 2026-07-30) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "Membership/sharing models are introduced only by explicit Walter-authorized schema update" | §P1 / §P2 — role model = Walter-authorized membership extension |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8/§9 | "the governed service write-path idiom" | §DDL — the five SECURITY DEFINER gate functions |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P2 — role model layered on the ownership RLS family; base RLS unchanged |
| spec/THEO_API_SPEC.md | §2C | "Writes (share/unshare) stay owner-only; only the owner invites/revokes." | §P3 — current contract; Phase 1b broadens invite to Owners + creator-only role-set |

---

## P1 — Feature identification
**Program:** Shared Project Workspace — Walter-approved design (2026-07-30) making a shared Theo project a collaborative reasoning workspace (private-by-default chats + publish-to-project, a Theo-maintained Decision Log, and shared-thread forks). **This microstep = Phase 1 foundation: the Creator / Owner / Member role model.** It adds `role` to the deployed `theo_project_members` (Rule Anchor: B5c) and the SECURITY DEFINER gate functions enforcing who may add/remove members and mint owners. Sharing/membership RLS is out of default 1B scope "ownership-only unless Walter authorizes" (Backend Plan; Schema §1 — Rule Anchors); **Walter authorized this extension 2026-07-30**, exactly as B5a (group-visible) and B5c (per-member invite) were previously authorized. Delivers **only** the column + functions — no handler, no surface, no model call.

## P2 — Architecture & boundary reconciliation
- **Model.** Creator = `theo_projects.created_by` (implicit; never a member row). `theo_project_members.role='owner'` = a promoted Owner; `='member'` = a Member. Gate rules: **Creator** mints/demotes Owners (`set_member_role`), removes anyone, and does everything an Owner does; **Owner** (creator OR `role='owner'`) adds/removes **Members** and lists the roster **but may NOT add, demote, or remove another Owner** — Owner status is Creator-only; **Member** has no membership-management power. Invariant: *a promoted Owner's status (promote / demote / remove) is mutated only by the Creator, never by another Owner* — enforced in `set_member_role` (creator-only) and the target-role guard in `remove_member`.
- **Idiom (mirrors deployed).** The five functions are `LANGUAGE plpgsql SECURITY DEFINER SET search_path = public`, migration-role-owned, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated` — the "governed service write-path idiom" (Schema §8/§9; the deployed `theo_chat_leave` and `dms_sub_*` families — Rule Anchor). The caller OID is read from `current_setting('request.jwt.claim.sub', true)` (set per-request; **never a parameter**), so a caller can only act as themselves.
- **RLS non-recursion preserved.** The B5c design keeps `theo_project_members`' SELECT policy self-contained to avoid the projects↔members cycle. Routing the new privileged writes through definer functions (not broadened RLS policies) adds **no** new cross-table policy subquery, so that invariant is preserved exactly. RLS is otherwise **unchanged**; the base family stays "ownership-based" (Architecture §5.2 — Rule Anchor).
- **Boundary.** Additive column + additive functions on an existing `theo_*` table in the shared `vaultgpt` instance; **no `reporting_*` access**; no change to existing RLS policies, tables, or rows; the base ownership RLS is untouched.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** One idempotent, additive migration on the shared `vaultgpt` Postgres (as `pgadmin_vault`, the owner — same as every prior theo migration). No app/env/dependency change. | **PRE-LAND** — §DEPLOY; Claude Code runs the read-only §VERIFY catalog probe after. |
| G-2 | **Schema doc row.** `spec/THEO_AZURE_POSTGRES_SCHEMA.md` gains the `theo_project_members.role` column note + the five gate functions after deploy. | **PRE-LAND** — a short schema-doc Role-C follows deploy (mirrors prior DEPLOYED Role-Cs). |
| G-3 | **Phase 1b handlers.** `theo_share_project`/`theo_unshare_project`/`theo_list_project_members` adopt the functions (Owners may invite; roster returns `role`) + a new `theo_set_project_member_role` (creator-only). | **PROCEED (future-trigger)** — next microstep VEP; the SQLSTATE→HTTP map (28000→401, 42501→403, 22023→400, P0002→404) is defined in §DDL for it. |
| G-4 | **Later phases.** Publish-to-project + attributed multi-party threads (Phase 2), Decision Log + Theo moderation (Phase 3), forks/promote/archive (Phase 4). | **PROCEED (future-trigger)** — separate governed VEPs per the approved design doc. |

No write SQL in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
No HTTP contract in this microstep (no handler). Current deployed contract (API Spec §2C — Rule Anchor): project writes incl. "Writes (share/unshare) stay owner-only; only the owner invites/revokes." Phase 1b will broaden **invite** to Owners (via `theo_project_add_member`) and add creator-only **role set** (`theo_set_project_member_role`), and `theo_list_project_members` will return each member's `role` + the caller's effective role (via `theo_project_list_members`). The functions' SQLSTATEs (§DDL) define the Phase-1b HTTP mapping. The schema doc gains its row post-deploy (G-2).

## P4 — Schema definition
See §DDL (complete idempotent migration): one additive `role` column + guarded CHECK on the deployed `theo_project_members`, and five SECURITY DEFINER gate functions (`theo_project_effective_role`, `theo_project_list_members`, `theo_project_add_member`, `theo_project_set_member_role`, `theo_project_remove_member`) with `REVOKE`/`GRANT`.

## P5 — Component reference grounding
- **Extended table (deployed DDL):** the B5c migration `b5c_migration.sql` (blob `ddc7f01d` — Rule Anchor / doc 10) created `theo_project_members (project_id, member_oid, invited_by, created_at)` with the self-contained non-recursive RLS this VEP preserves; the `role` column extends that table.
- **Function idiom reference (deployed):** the `dms_sub_*` family (Schema §9) and `theo_chat_leave` (Schema §8) — migration-role-owned SECURITY DEFINER functions, `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated`, pinned `search_path`, caller identity from the request claim. The five gate functions reproduce that shape.

## P6 — Repository & active-surface grounding
New artifacts (this package): `spw_phase1_migration.sql` (== §DDL), `spw_phase1_verify.sql` (== §VERIFY). No source/handler/active-surface file changed in this microstep. Guardrails: no `reporting_*`; no change to deployed tables' RLS policies or rows; additive column + additive functions; idempotent migration; base ownership RLS untouched. Verified via the §VERIFY catalog probe post-deploy.

## P7 — Risk / regression
- **Additive + reversible.** `ADD COLUMN IF NOT EXISTS` (default `'member'` backfills existing rows to Member — matches today's read-only reality) + guarded CHECK + `CREATE OR REPLACE FUNCTION`. Re-runnable; the reversal block is documented in the migration footer.
- **No RLS regression / no recursion.** Zero change to existing policies; new powers are function-gated, so the B5c projects↔members non-recursion invariant is preserved. Base ownership RLS unchanged.
- **Least privilege.** Every function reads the caller from the request claim (never a parameter); `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated`; Creator-only for owner minting; Members get no management power.
- **No live-traffic risk.** Nothing calls the functions until the Phase-1b handlers land; the `role` column is inert until then (existing handlers ignore it). Authorization gate satisfied (Walter, 2026-07-30).

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED future-trigger); complete migration in §DDL; read-only verification in §VERIFY. Plan-only. On Codex APPROVAL, Walter runs the migration; Claude Code runs §VERIFY; then the schema-doc row Role-C (G-2) and the Phase-1b handler VEP (G-3).

---

## §DDL — `spw_phase1_migration.sql` (complete; Walter-executable; idempotent)
```sql
-- ============================================================================
-- Theo Shared Project Workspace — Phase 1: role model on theo_project_members.
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; NO top-level BEGIN/COMMIT (migration governance). Idempotent + reversible.
--
-- MODEL: the project CREATOR is theo_projects.created_by (implicit; never a member row). A membership
-- row role='owner' = a promoted Owner; role='member' = a Member. Only the Creator mints/demotes Owners;
-- Creator + Owners add/remove Members; Members cannot manage anyone.
--
-- RLS: UNCHANGED. The role column is additive; privileged writes are FUNCTION-gated (SECURITY DEFINER,
-- migration-role-owned) — the deployed "governed service write-path idiom" (theo_chat_leave/dms_sub_*).
-- No new projects<->members RLS subquery is added, so the B5c non-recursion invariant is preserved.
--
-- AUTHORIZATION: sharing/membership RLS is out of default 1B scope "unless Walter authorizes"
-- (Backend Plan; Schema §1). Walter authorized this role extension 2026-07-30 (precedent: B5a/B5c).
-- ============================================================================

-- 1) role column (existing rows backfill to 'member' via the default). Guarded CHECK.
ALTER TABLE public.theo_project_members
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'member';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'theo_project_members_role_ck'
      AND conrelid = 'public.theo_project_members'::regclass
  ) THEN
    ALTER TABLE public.theo_project_members
      ADD CONSTRAINT theo_project_members_role_ck CHECK (role IN ('owner','member'));
  END IF;
END $$;

-- SQLSTATEs for the Phase-1b handler -> HTTP map: 28000=unauthenticated(401), 42501=forbidden(403),
-- 22023=invalid argument(400), P0002=no_data/not found(404). Caller OID = request.jwt.claim.sub.

-- 1a) effective_role: caller's role on a project — 'creator' | 'owner' | 'member' | NULL.
CREATE OR REPLACE FUNCTION public.theo_project_effective_role(p_project_id uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller text := current_setting('request.jwt.claim.sub', true);
  v_role   text;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RETURN NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM public.theo_projects WHERE id = p_project_id AND created_by = v_caller) THEN
    RETURN 'creator';
  END IF;
  SELECT role INTO v_role
    FROM public.theo_project_members
   WHERE project_id = p_project_id AND member_oid = v_caller;
  RETURN v_role;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_effective_role(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_effective_role(uuid) TO authenticated;

-- 1b) list_members: full roster; Creator + Owners only.
CREATE OR REPLACE FUNCTION public.theo_project_list_members(p_project_id uuid)
RETURNS TABLE (member_oid text, invited_by text, role text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller_role text := public.theo_project_effective_role(p_project_id);
BEGIN
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'not a project member' USING ERRCODE = 'P0002';
  END IF;
  IF v_caller_role NOT IN ('creator','owner') THEN
    RAISE EXCEPTION 'only the creator or an owner may list members' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
    SELECT m.member_oid, m.invited_by, m.role, m.created_at
      FROM public.theo_project_members m
     WHERE m.project_id = p_project_id
     ORDER BY m.created_at;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_list_members(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_list_members(uuid) TO authenticated;

-- 1c) add_member: Creator or Owner adds a MEMBER (promotion to Owner is separate, Creator-only).
CREATE OR REPLACE FUNCTION public.theo_project_add_member(p_project_id uuid, p_member_oid text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller      text := current_setting('request.jwt.claim.sub', true);
  v_caller_role text;
  v_added       boolean := false;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;
  IF p_member_oid IS NULL OR p_member_oid = '' THEN
    RAISE EXCEPTION 'member_oid is required' USING ERRCODE = '22023';
  END IF;
  v_caller_role := public.theo_project_effective_role(p_project_id);
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'project not found or no access' USING ERRCODE = 'P0002';
  END IF;
  IF v_caller_role NOT IN ('creator','owner') THEN
    RAISE EXCEPTION 'only the creator or an owner may add members' USING ERRCODE = '42501';
  END IF;
  IF EXISTS (SELECT 1 FROM public.theo_projects WHERE id = p_project_id AND created_by = p_member_oid) THEN
    RAISE EXCEPTION 'the project creator cannot be added as a member' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.theo_project_members (project_id, member_oid, invited_by, role)
  VALUES (p_project_id, p_member_oid, v_caller, 'member')
  ON CONFLICT (project_id, member_oid) DO NOTHING;
  GET DIAGNOSTICS v_added = ROW_COUNT;
  RETURN v_added;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_add_member(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_add_member(uuid, text) TO authenticated;

-- 1d) set_member_role: CREATOR-ONLY promote/demote of an existing member.
CREATE OR REPLACE FUNCTION public.theo_project_set_member_role(p_project_id uuid, p_member_oid text, p_new_role text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller_role text := public.theo_project_effective_role(p_project_id);
  v_changed     boolean := false;
BEGIN
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'project not found or no access' USING ERRCODE = 'P0002';
  END IF;
  IF v_caller_role <> 'creator' THEN
    RAISE EXCEPTION 'only the creator may set member roles' USING ERRCODE = '42501';
  END IF;
  IF p_new_role NOT IN ('owner','member') THEN
    RAISE EXCEPTION 'role must be owner or member' USING ERRCODE = '22023';
  END IF;
  UPDATE public.theo_project_members
     SET role = p_new_role
   WHERE project_id = p_project_id AND member_oid = p_member_oid;
  GET DIAGNOSTICS v_changed = ROW_COUNT;
  IF NOT v_changed THEN
    RAISE EXCEPTION 'member not found in this project' USING ERRCODE = 'P0002';
  END IF;
  RETURN true;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_set_member_role(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_set_member_role(uuid, text, text) TO authenticated;

-- 1e) remove_member: the Creator removes anyone; an Owner may remove only MEMBERS. Removing an Owner
--     is Creator-only (Owner status is mutated only by the Creator). Idempotent. Creator has no member row.
CREATE OR REPLACE FUNCTION public.theo_project_remove_member(p_project_id uuid, p_member_oid text)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller_role text := public.theo_project_effective_role(p_project_id);
  v_removed     boolean := false;
BEGIN
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'project not found or no access' USING ERRCODE = 'P0002';
  END IF;
  IF v_caller_role NOT IN ('creator','owner') THEN
    RAISE EXCEPTION 'only the creator or an owner may remove members' USING ERRCODE = '42501';
  END IF;
  -- An Owner may NOT remove another Owner (that would strip ownership without Creator action); only
  -- the Creator may remove an Owner. The Creator bypasses this guard (v_caller_role = 'creator').
  IF v_caller_role = 'owner'
     AND EXISTS (SELECT 1 FROM public.theo_project_members
                  WHERE project_id = p_project_id AND member_oid = p_member_oid AND role = 'owner') THEN
    RAISE EXCEPTION 'only the creator may remove an owner' USING ERRCODE = '42501';
  END IF;
  DELETE FROM public.theo_project_members
   WHERE project_id = p_project_id AND member_oid = p_member_oid;
  GET DIAGNOSTICS v_removed = ROW_COUNT;
  RETURN v_removed;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_project_remove_member(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_project_remove_member(uuid, text) TO authenticated;
```

## §VERIFY — post-deploy read-only catalog probe (Claude Code runs via `.local\run-reporting-ro-query.ps1`)
```sql
-- Shared Project Workspace Phase 1 — post-deploy verification (read-only; catalog only).
-- 1. role column present, NOT NULL, default 'member'
SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS type, a.attnotnull AS not_null,
       pg_get_expr(d.adbin, d.adrelid) AS default_expr
FROM pg_attribute a
LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE a.attrelid = 'public.theo_project_members'::regclass
  AND a.attname = 'role' AND a.attnum > 0 AND NOT a.attisdropped;
-- 2. role CHECK constraint
SELECT conname, pg_get_constraintdef(oid) AS def FROM pg_constraint
WHERE conrelid = 'public.theo_project_members'::regclass AND conname = 'theo_project_members_role_ck';
-- 3. the five SECURITY DEFINER gate functions
SELECT p.proname, pg_get_function_arguments(p.oid) AS args, pg_get_function_result(p.oid) AS returns,
       p.prosecdef AS security_definer, p.proconfig AS config
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname IN (
  'theo_project_effective_role','theo_project_list_members','theo_project_add_member',
  'theo_project_set_member_role','theo_project_remove_member') ORDER BY p.proname;
-- 4. RLS unchanged: theo_project_members still carries only its B5c policies
SELECT polname, CASE polcmd WHEN 'r' THEN 'SELECT' WHEN 'a' THEN 'INSERT' WHEN 'w' THEN 'UPDATE' WHEN 'd' THEN 'DELETE' END AS cmd
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE c.relname = 'theo_project_members' ORDER BY polname;
```

## §DEPLOY — Walter deploy steps
1. Run `spw_phase1_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (the owner; same as every prior theo migration — NOT via the RO tool).
2. Reply "SPW Phase 1 deployed" → Claude Code runs §VERIFY (role column + CHECK + five functions + RLS-unchanged), then prepares the schema-doc row Role-C (G-2) and the Phase-1b handler VEP (G-3).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Shared Project Workspace Phase 1 Roles Substrate Pass-1 Backend VEP (plan only).*
