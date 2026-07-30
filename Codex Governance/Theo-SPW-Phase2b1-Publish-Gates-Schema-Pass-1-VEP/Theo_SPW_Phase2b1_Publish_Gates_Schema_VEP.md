# Theo — Shared Project Workspace Phase 2b-1: publish-to-project write-path gates (SECURITY DEFINER substrate) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete Walter-executable migration for deploy at Pass 3, after which Claude Code runs the read-only catalog verification. **Program:** Shared Project Workspace (Walter-approved design 2026-07-30). **This microstep = Phase 2b-1:** the three **SECURITY DEFINER** gate functions that drive the deployed Phase 2a publish columns (Schema §11) — `theo_publish_conversation(uuid)` (OWNER-only publish; requires the conversation be linked to a project), `theo_unpublish_conversation(uuid)` (OWNER-only unpublish), `theo_list_project_conversations(uuid)` (MEMBER-visible list of a project's published conversations). **Substrate only** — the func-projects handler wiring (Phase 2b-2) and the chat read/post broadening (Phase 2b-3) are subsequent microsteps. **RLS is UNCHANGED** by this migration (the §11 policy broadening already landed; these are function-gated writes — the deployed `theo_project_*` / `theo_chat_leave` / `dms_sub_*` idiom — so no new policy and no new projects↔conversations subquery).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `7a96a654d88fed973aa597d442a2bc62c35094db` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Schema + SECURITY DEFINER gate-function microstep (no HTTP handler, no model call — handlers are Phase 2b-2). The three gates drive the deployed Phase 2a publish columns (Schema §11) and reuse the deployed `theo_project_effective_role` (Schema §10) for the list gate's membership check; they mirror the deployed governed service write-path idiom (Phase 1 `theo_project_*`, `theo_chat_leave`, `dms_sub_*`) — SECURITY DEFINER, migration-role-owned, pinned `search_path`, `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated`, caller OID from `request.jwt.claim.sub` (never a parameter). Ownership here is CONVERSATION ownership (`theo_conversations.created_by = caller`); only the author may publish/unpublish. Broadening the conversation write-path beyond ownership is out of default 1B scope "unless Walter authorizes" (Backend Plan; Schema §1) — Walter authorized the SPW program and explicitly directed Phase 2 read+write 2026-07-30 (precedent: Phase 1/2a). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§4/§5) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (SECURITY DEFINER discipline §3) | `Grep("SECURITY DEFINER")` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | carried grounding (this program; blob-anchored) | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (scope: sharing/membership authorization gate) | `Grep("sharing/membership RLS models")` this turn | `97645ecd0bc9e3c25082dd2a333c82ab83446584` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | `Grep("ownership-based")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 sharing gate; §8/§9 definer idiom; §10 role gates; §11 publish columns) | `Grep("published_to_project")` + `Grep("governed service write-path idiom")` + `Read` this turn | `7c629ce10b283e22ebc5e41e4375f238fbd80596` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2C project sharing — current "config-only; no transcripts shared" contract) | `Grep("owner-only\|share/unshare")` this turn | `63eae771e7dd9336b57bd26f2c4fa532eb7c685d` |
| 10 | **Reference DDL (deployed §10 gate idiom + reused `theo_project_effective_role`)** — Phase 1 migration — `Codex Governance/Theo-SPW-Phase1-Roles-Substrate-Pass-1-VEP/spw_phase1_migration.sql` | `Read` this turn | `75659097d611ba833741b2fb8383f7050c534334` |
| 11 | **Reference DDL (deployed §11 publish columns these gates drive)** — Phase 2a migration — `Codex Governance/Theo-SPW-Phase2a-Publish-To-Project-Schema-Pass-1-VEP/spw_phase2a_migration.sql` | `Read` this turn | `25cdb7d08553bc3ef2c52ec996e496a20c84ece5` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL executed (plan only; Walter runs the migration at Pass 3).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P7 — the authorization gate this change rides on (Walter-authorized 2026-07-30) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "Membership/sharing models are introduced only by explicit Walter-authorized schema update" | §P1 / §P2 — publish write-path = Walter-authorized extension |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §9 | "the governed service write-path idiom" | §DDL — the three SECURITY DEFINER gate functions |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §11 | "published_to_project = true" | §P2 / §DDL — the flags these gates set/clear/filter on |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "SECURITY DEFINER" | §DDL — least-privilege gate discipline (REVOKE PUBLIC + GRANT authenticated) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "ownership-based" | §P2 — publish gates layered on the ownership family; base RLS unchanged |
| spec/THEO_API_SPEC.md | §2C | "Writes (share/unshare) stay owner-only; only the owner invites/revokes." | §P3 — current contract; Phase 2b-2 adds the publish/unpublish/list contract |

---

## P1 — Feature identification
**Program:** Shared Project Workspace — Walter-approved design (2026-07-30). **This microstep = Phase 2b-1: the publish-to-project write-path gates.** Phase 2a (Schema §11) landed the columns (`published_to_project`/`published_at`/`published_by`) + the broadened RLS policies. This microstep adds the three **SECURITY DEFINER** functions that operate those columns: `theo_publish_conversation` / `theo_unpublish_conversation` (OWNER-only — the conversation author publishes/unpublishes their own chat into its linked project) and `theo_list_project_conversations` (any project participant enumerates the project's published chats). Broadening the conversation write-path beyond ownership is out of default 1B scope "ownership-only unless Walter authorizes" (Backend Plan; Schema §1 — Rule Anchors); **Walter authorized this 2026-07-30** (SPW program + explicit "build read plus write together" direction), exactly as Phase 1 (roles) and Phase 2a (publish RLS) were authorized. Delivers **only** the three functions — no handler, no surface, no model call.

## P2 — Architecture & boundary reconciliation
- **Model.** Publishing is an explicit **OWNER** action, where ownership = **conversation** ownership (`theo_conversations.created_by = caller`), NOT project membership — only a conversation's author may publish/unpublish it. A conversation is shared **iff** `published_to_project = true AND project_id IS NOT NULL` (Schema §11 — Rule Anchor). `theo_publish_conversation` requires the conversation already be linked to a project (`project_id IS NOT NULL`, else `22023`), sets the three flags, and is **idempotent** (re-publish preserves the original `published_at`/`published_by`, returns `false`). `theo_unpublish_conversation` clears the flags (reverts to private; leaves `project_id`), idempotent. `theo_list_project_conversations` is broader: any participant (**creator ∪ owner ∪ member**, via the deployed `theo_project_effective_role` — Schema §10) lists the project's published conversations.
- **Idiom (mirrors deployed).** All three are `LANGUAGE plpgsql SECURITY DEFINER SET search_path = public`, migration-role-owned, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated` — the "governed service write-path idiom" (Schema §9; the deployed Phase 1 `theo_project_*`, `theo_chat_leave`, `dms_sub_*` families — Rule Anchor). The caller OID is read from `current_setting('request.jwt.claim.sub', true)` (set per-request; **never a parameter**), so a caller can only act as themselves. The function owner bypasses RLS, so authorization lives INSIDE each function (explicit `created_by` / `effective_role` checks + `RAISE`) — the same enforcement model the deployed chat handlers use (explicit `created_by = $oid` in application SQL).
- **RLS non-recursion preserved.** These gates add **no** new RLS policy and **no** new projects↔conversations subquery. `theo_project_effective_role` (reused, deployed) reads `theo_projects` + `theo_project_members` only; the publish/unpublish gates read/write `theo_conversations` only; the list gate reads `theo_conversations` (filtered) after the membership check. No cycle. The §11 policies (already deployed) are untouched by this migration.
- **Boundary.** Additive functions only, operating existing `theo_*` columns in the shared `vaultgpt` instance; **no `reporting_*` access**; no table/column/row/policy change; base ownership RLS untouched.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** One idempotent, additive migration on the shared `vaultgpt` Postgres (as `pgadmin_vault`, the owner — same as every prior theo migration). No app/env/dependency change. | **PRE-LAND** — §DEPLOY; Claude Code runs the read-only §VERIFY catalog probe after. |
| G-2 | **Schema doc row.** `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §11 gains the three gate-function signatures after deploy (mirrors the §10 role-gate note). | **PRE-LAND** — a short schema-doc Role-C follows deploy. |
| G-3 | **Phase 2b-2 handlers (func-projects).** `theo_publish_conversation` / `theo_unpublish_conversation` / `theo_list_project_conversations` thin wrappers on `vaultgpt-func-projects` (the Phase-1b template) + an API-Spec §2C Role-C. The SQLSTATE→HTTP map (28000→401, 42501→403, 22023→400, P0002→404) is defined in §DDL for it. Note: API Spec §2C currently states B5a/B5c sharing is "config-only … no chat transcripts are shared" — Phase 2b introduces the first transcript sharing, so that clause is superseded by the 2b-2 Role-C. | **PROCEED (future-trigger)** — next microstep VEP. |
| G-4 | **Phase 2b-3 chat read/post broadening.** The deployed chat handlers (`theo_get_conversation`, `theo_message` on func-premium; `theo_message_stream` on func-stream) enforce isolation via explicit `created_by = $oid` application SQL (the shared Functions role bypasses RLS), so the §11 RLS broadening does not by itself enable member read/continue; 2b-3 adds the `OR published-in-my-project` branch to those predicates. | **PROCEED (future-trigger)** — separate governed VEP (higher-touch; the delicate persistence path). |

No write SQL in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
No HTTP contract in this microstep (no handler). Current deployed contract (API Spec §2C — Rule Anchor): project writes incl. "Writes (share/unshare) stay owner-only; only the owner invites/revokes," and B5a/B5c sharing is documented as "config-only … no chat transcripts are shared." Phase 2b-2 will add `POST /api/theo_publish_conversation` `{ conversation_id }`, `POST /api/theo_unpublish_conversation` `{ conversation_id }`, and `GET /api/theo_list_project_conversations?projectId=<uuid>`, and its §2C Role-C supersedes the "no transcripts shared" statement (publish-to-project is the first transcript sharing — Walter-authorized). The functions' SQLSTATEs (§DDL) define that HTTP mapping. The schema doc §11 gains its function-signature note post-deploy (G-2).

## P4 — Schema definition
See §DDL (complete idempotent migration): three SECURITY DEFINER gate functions — `theo_publish_conversation(uuid)→boolean`, `theo_unpublish_conversation(uuid)→boolean`, `theo_list_project_conversations(uuid)→TABLE(...)` — each with `REVOKE`/`GRANT`. No table, column, index, or policy change (the §11 columns + policies are already deployed).

## P5 — Component reference grounding
- **Reused deployed function:** `theo_project_effective_role(uuid)` (Schema §10; Phase 1 migration blob `75659097` — Rule Anchor / doc 10) returns `'creator'|'owner'|'member'|NULL` and is the membership primitive `theo_list_project_conversations` gates on — identical to how `theo_project_list_members` gates.
- **Driven deployed columns:** `theo_conversations.published_to_project`/`published_at`/`published_by` (Schema §11; Phase 2a migration blob `25cdb7d0` — Rule Anchor / doc 11). The publish/unpublish gates set/clear exactly these three columns; the invariant "shared iff `published_to_project = true AND project_id IS NOT NULL`" is the §11 contract.
- **Function idiom reference (deployed):** the Phase 1 `theo_project_*` gates (Schema §10) and `dms_sub_*` (Schema §9) — migration-role-owned SECURITY DEFINER, `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated`, pinned `search_path`, caller identity from the request claim. The three gates reproduce that shape exactly.

## P6 — Repository & active-surface grounding
New artifacts (this package): `spw_phase2b1_migration.sql` (== §DDL), `spw_phase2b1_verify.sql` (== §VERIFY). No source/handler/active-surface file changed in this microstep. Guardrails: no `reporting_*`; no change to deployed tables' columns, rows, or RLS policies; additive functions only; idempotent migration (`CREATE OR REPLACE FUNCTION`); base ownership RLS untouched. Verified via the §VERIFY catalog probe post-deploy.

## P7 — Risk / regression
- **Additive + reversible.** `CREATE OR REPLACE FUNCTION` ×3; re-runnable; the reversal block (three `DROP FUNCTION IF EXISTS`) is documented in the migration footer. No column/policy/row touched.
- **No RLS regression / no recursion.** Zero change to existing policies; the new powers are function-gated, so no projects↔conversations RLS subquery is added and the §11 + B5c non-recursion invariants are preserved. Base ownership RLS unchanged.
- **Least privilege.** Every function reads the caller from `request.jwt.claim.sub` (never a parameter); `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated`; publish/unpublish are conversation-owner-only (`created_by = caller`, else 42501); list requires project participation (`effective_role` non-NULL, else 404). `theo_publish_conversation` refuses an unlinked conversation (`project_id IS NULL` → 22023), so a conversation can never be "published" into no project.
- **No live-traffic risk.** Nothing calls the functions until the Phase-2b-2 handlers land; the columns remain `published_to_project=false` for all rows (no existing row is published), so the feature is inert until deliberately invoked. Authorization gate satisfied (Walter, 2026-07-30).

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED future-trigger); complete migration in §DDL; read-only verification in §VERIFY. Plan-only. On Codex APPROVAL, Walter runs the migration; Claude Code runs §VERIFY; then the schema-doc §11 function note Role-C (G-2) and the Phase-2b-2 handler VEP (G-3).

---

## §DDL — `spw_phase2b1_migration.sql` (complete; Walter-executable; idempotent)
```sql
-- ============================================================================
-- Theo Shared Project Workspace — Phase 2b-1: publish-to-project write-path gates.
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; NO top-level BEGIN/COMMIT (migration governance). Idempotent + reversible.
--
-- WHAT: three SECURITY DEFINER gate functions that drive the Phase 2a publish-to-project columns
-- (theo_conversations.published_to_project / published_at / published_by, deployed §11):
--   theo_publish_conversation(uuid)        — OWNER-only publish (requires the conversation be linked
--                                            to a project). Sets the publish flags.
--   theo_unpublish_conversation(uuid)      — OWNER-only unpublish. Clears the publish flags.
--   theo_list_project_conversations(uuid)  — MEMBER-visible list of the published conversations in a
--                                            project (creator ∪ owner ∪ member).
-- The Phase-2b-2 func-projects handlers are thin wrappers over these gates (the Phase-1/1b idiom).
--
-- MODEL (private-by-default; §11): publishing is an explicit OWNER action. Ownership here is
-- CONVERSATION ownership — `theo_conversations.created_by = caller` — NOT project membership; only the
-- author of a conversation may publish/unpublish it. Listing is broader: any project participant
-- (creator ∪ owner ∪ member, via theo_project_effective_role) may enumerate the project's published
-- conversations. A conversation is shared iff `published_to_project = true AND project_id IS NOT NULL`.
--
-- ENFORCEMENT: these are the governed service write-path idiom (SECURITY DEFINER, migration-role-owned;
-- same as the Phase 1 role gates theo_project_* and theo_chat_leave / dms_sub_*). The function owner
-- bypasses RLS, so authorization is enforced INSIDE each function (explicit created_by / effective_role
-- checks + RAISE), exactly like the deployed chat handlers enforce `created_by = $oid` in application
-- SQL. The caller OID is read from `request.jwt.claim.sub` (set per-request via set_config; NEVER a
-- parameter — the trusted source), so a caller can only ever act as themselves.
--
-- RLS: UNCHANGED by this migration. The Phase 2a policy broadening (§11) already landed; these gates
-- add no new policy and no new projects<->conversations RLS subquery, so the B5c non-recursion
-- invariant is preserved. (theo_project_effective_role reads theo_projects + theo_project_members only.)
--
-- SQLSTATE → HTTP (for the Phase-2b-2 handler mapping, matching Phase 1b): 28000 = unauthenticated
-- (401); 42501 = insufficient privilege (403); 22023 = invalid argument (400); P0002 = not found (404).
--
-- AUTHORIZATION: broadening the conversation write-path beyond ownership is out of default 1B scope
-- "unless Walter authorizes" (Backend Plan; Schema §1). Walter authorized the Shared Project Workspace
-- program and explicitly directed Phase 2 read+write (2026-07-30). Precedent: Phase 1 role gates.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) theo_publish_conversation: OWNER-only publish. The caller must own the conversation and the
--    conversation must be linked to a project. Idempotent — re-publishing an already-published
--    conversation is a no-op that PRESERVES the original published_at/published_by (returns false).
--    Returns true = newly published; false = already published (idempotent).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.theo_publish_conversation(p_conversation_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller     text := current_setting('request.jwt.claim.sub', true);
  v_owner      text;
  v_project    uuid;
  v_published  boolean;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;
  SELECT created_by, project_id, published_to_project
    INTO v_owner, v_project, v_published
    FROM public.theo_conversations
   WHERE id = p_conversation_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'conversation not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_owner <> v_caller THEN
    RAISE EXCEPTION 'only the conversation owner may publish it' USING ERRCODE = '42501';
  END IF;
  IF v_project IS NULL THEN
    RAISE EXCEPTION 'conversation is not linked to a project' USING ERRCODE = '22023';
  END IF;
  IF v_published THEN
    RETURN false; -- already published; preserve original publish metadata (idempotent)
  END IF;
  UPDATE public.theo_conversations
     SET published_to_project = true,
         published_at         = now(),
         published_by         = v_caller
   WHERE id = p_conversation_id;
  RETURN true;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_publish_conversation(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_publish_conversation(uuid) TO authenticated;

-- ----------------------------------------------------------------------------
-- 2) theo_unpublish_conversation: OWNER-only unpublish. Clears the publish flags (the conversation
--    reverts to private; project_id is left intact). Idempotent — unpublishing an already-private
--    conversation is a no-op (returns false). Returns true = was published and is now private.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.theo_unpublish_conversation(p_conversation_id uuid)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller     text := current_setting('request.jwt.claim.sub', true);
  v_owner      text;
  v_published  boolean;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;
  SELECT created_by, published_to_project
    INTO v_owner, v_published
    FROM public.theo_conversations
   WHERE id = p_conversation_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'conversation not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_owner <> v_caller THEN
    RAISE EXCEPTION 'only the conversation owner may unpublish it' USING ERRCODE = '42501';
  END IF;
  IF NOT v_published THEN
    RETURN false; -- already private (idempotent)
  END IF;
  UPDATE public.theo_conversations
     SET published_to_project = false,
         published_at         = NULL,
         published_by         = NULL
   WHERE id = p_conversation_id;
  RETURN true;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_unpublish_conversation(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_unpublish_conversation(uuid) TO authenticated;

-- ----------------------------------------------------------------------------
-- 3) theo_list_project_conversations: the published conversations in a project, visible to ANY
--    participant (creator ∪ owner ∪ member — gated via theo_project_effective_role). Ordered by
--    last activity (updated_at DESC), mirroring the Recents last-touched idiom. Raises 404 if the
--    caller has no access to the project (effective_role NULL). Returns the fields the shared-list FE
--    needs: id, title, the author (created_by), publish provenance (published_at/published_by), and
--    created_at/updated_at for ordering + display.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.theo_list_project_conversations(p_project_id uuid)
RETURNS TABLE (
  id           uuid,
  title        text,
  created_by   text,
  created_at   timestamptz,
  updated_at   timestamptz,
  published_at timestamptz,
  published_by text
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller_role text := public.theo_project_effective_role(p_project_id);
BEGIN
  IF v_caller_role IS NULL THEN
    RAISE EXCEPTION 'project not found or no access' USING ERRCODE = 'P0002';
  END IF;
  RETURN QUERY
    SELECT c.id, c.title, c.created_by, c.created_at, c.updated_at, c.published_at, c.published_by
      FROM public.theo_conversations c
     WHERE c.project_id = p_project_id
       AND c.published_to_project = true
     ORDER BY c.updated_at DESC;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_list_project_conversations(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_list_project_conversations(uuid) TO authenticated;

-- ============================================================================
-- REVERSIBILITY (manual, if ever needed; not run at deploy):
--   DROP FUNCTION IF EXISTS public.theo_list_project_conversations(uuid);
--   DROP FUNCTION IF EXISTS public.theo_unpublish_conversation(uuid);
--   DROP FUNCTION IF EXISTS public.theo_publish_conversation(uuid);
-- ============================================================================
```

## §VERIFY — post-deploy read-only catalog probe (Claude Code runs via `.local\run-reporting-ro-query.ps1`)
```sql
-- SPW Phase 2b-1 — post-deploy verification (read-only; catalog only).
-- Claude Code runs this via .local\run-reporting-ro-query.ps1 after Walter deploys the migration.

-- 1) the three gate functions exist, are SECURITY DEFINER, pin search_path=public, and return the
--    expected type (boolean for publish/unpublish; a row set for list).
SELECT p.proname,
       pg_get_function_identity_arguments(p.oid) AS args,
       p.prosecdef                                AS security_definer,
       pg_get_function_result(p.oid)              AS returns,
       (SELECT array_agg(cfg) FROM unnest(p.proconfig) cfg
         WHERE cfg LIKE 'search_path=%')          AS search_path
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('theo_publish_conversation','theo_unpublish_conversation','theo_list_project_conversations')
ORDER BY p.proname;
-- Expect: all three prosecdef = t; search_path = {search_path=public};
--   theo_publish_conversation(p_conversation_id uuid) -> boolean
--   theo_unpublish_conversation(p_conversation_id uuid) -> boolean
--   theo_list_project_conversations(p_project_id uuid) -> TABLE(id uuid, title text, created_by text,
--       created_at timestamp with time zone, updated_at timestamp with time zone,
--       published_at timestamp with time zone, published_by text)

-- 2) EXECUTE granted to `authenticated` and NOT to PUBLIC (privileged gate discipline).
SELECT p.proname, r.rolname AS grantee, a.privilege_type
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
CROSS JOIN LATERAL aclexplode(p.proacl) a
JOIN pg_roles r ON r.oid = a.grantee
WHERE n.nspname = 'public'
  AND p.proname IN ('theo_publish_conversation','theo_unpublish_conversation','theo_list_project_conversations')
ORDER BY p.proname, r.rolname;
-- Expect: grantee `authenticated` with EXECUTE for each; NO row for `PUBLIC` (empty grantee).

-- 3) the Phase 2a publish columns are still present (unchanged by this migration).
SELECT a.attname, format_type(a.atttypid, a.atttypmod) AS type, a.attnotnull AS not_null
FROM pg_attribute a
WHERE a.attrelid = 'public.theo_conversations'::regclass
  AND a.attname IN ('published_to_project','published_at','published_by')
  AND NOT a.attisdropped
ORDER BY a.attname;

-- 4) no RLS policy changed by this migration — the §11 policy set is intact (spot the count = 4+4).
SELECT c.relname AS tbl, count(*) AS policies
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_conversations','theo_messages')
GROUP BY c.relname
ORDER BY c.relname;
-- Expect: theo_conversations = 4, theo_messages = 4 (unchanged).
```

## §DEPLOY — Walter deploy steps
1. Run `spw_phase2b1_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (the owner; same as every prior theo migration — NOT via the RO tool).
2. Reply "SPW Phase 2b-1 deployed" → Claude Code runs §VERIFY (three SECURITY DEFINER functions present, `prosecdef=t`, `search_path=public`, EXECUTE to `authenticated` not PUBLIC; §11 columns intact; RLS policy counts unchanged), then prepares the schema-doc §11 function-note Role-C (G-2) and the Phase-2b-2 handler VEP (G-3).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Shared Project Workspace Phase 2b-1 Publish-Gates Schema Pass-1 Backend VEP (plan only).*
