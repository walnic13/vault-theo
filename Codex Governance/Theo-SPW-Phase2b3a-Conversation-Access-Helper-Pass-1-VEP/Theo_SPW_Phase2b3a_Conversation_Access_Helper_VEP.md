# Theo — Shared Project Workspace Phase 2b-3a: conversation-access read helper (SECURITY DEFINER) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; complete Walter-executable migration for deploy at Pass 3, after which Claude Code runs the read-only catalog verification. **Program:** Shared Project Workspace (Walter-approved design 2026-07-30). **This microstep = Phase 2b-3a:** one **SECURITY DEFINER** helper `theo_conversation_access(uuid) → 'owner' | 'member' | NULL` — the SINGLE audited home of the publish-to-project read/continue access predicate (`'owner'` = the caller authored the conversation; `'member'` = it is published to a project the caller participates in; `NULL` = no access). **Substrate only** — the chat handlers that call it (Phase 2b-3b `theo_get_conversation` read broadening on func-premium; Phase 2b-3c `theo_message`/`theo_message_stream` continue broadening on func-premium/func-stream) are subsequent microsteps. This exists because the deployed chat handlers connect with a Functions role that **BYPASSES RLS** and gate on explicit `created_by = $oid` app-SQL — so the §11 RLS broadening does not by itself open a published transcript; centralizing the predicate here keeps the live-handler edits small + uniform + reviewed-once. **RLS is UNCHANGED** by this migration; the helper is read-only (classifies access; no write).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding parent (source baseline): `2fbaae5e43c145360dc4567df53c69a32875a72e` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the forward submission note; all currency anchors below are tip-independent blob SHAs unaffected by the carrying commit
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Schema + SECURITY DEFINER helper microstep (no HTTP handler, no model call — the calling handlers are Phase 2b-3b/2b-3c). The helper's `'member'` branch is byte-for-byte the deployed §11 access set (`published_to_project = true AND project_id IS NOT NULL AND project_id ∈ (creator ∪ member)`); it mirrors the deployed governed service write-path idiom (Phase 1/2b-1 gates, `theo_conversation_exists_unscoped`) — SECURITY DEFINER, migration-role-owned, pinned `search_path`, `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated`, caller OID from `request.jwt.claim.sub` (never a parameter); read-only. Broadening conversation read/continue beyond ownership is out of default 1B scope "unless Walter authorizes" (Backend Plan; Schema §1) — Walter authorized the SPW program + explicitly directed Phase 2 read+write 2026-07-30 (precedent: Phase 1/2a/2b-1). Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§4/§5) | carried grounding (this program; blob-anchored) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (SECURITY DEFINER discipline §3) | carried grounding (this program; blob-anchored) | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles) | carried grounding (this program; blob-anchored) | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (scope: sharing/membership authorization gate) | carried grounding (this program; blob-anchored) | `97645ecd0bc9e3c25082dd2a333c82ab83446584` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership) | carried grounding (this program; blob-anchored) | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§8/§9 definer idiom; §11 publish columns + policy predicate the helper mirrors) | `Grep("governed service write-path idiom")` + `Grep("published_to_project = true")` this turn | `267e962861d9e03a56e51e54060aa91b4dbc5b8a` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 publish contracts — the read/continue path this helper backs) | carried grounding (this program; blob-anchored) | `9291b9eecade963514a9f3854bd7cbeb862d9e2f` |
| 10 | **Reference DDL (deployed §11 publish columns + RLS predicate the helper mirrors)** — Phase 2a migration — `Codex Governance/Theo-SPW-Phase2a-Publish-To-Project-Schema-Pass-1-VEP/spw_phase2a_migration.sql` | `Read` this turn | `25cdb7d08553bc3ef2c52ec996e496a20c84ece5` |
| 11 | **Reference DDL (deployed gate idiom this helper matches)** — Phase 2b-1 migration — `Codex Governance/Theo-SPW-Phase2b1-Publish-Gates-Schema-Pass-1-VEP/spw_phase2b1_migration.sql` | `Read` this turn | `321d368aa3f53f6c2ffb2da13efd66733f0cd450` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL executed (plan only; Walter runs the migration at Pass 3).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §9 | "the governed service write-path idiom" | §DDL — the SECURITY DEFINER helper (REVOKE PUBLIC + GRANT authenticated) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §11 | "published_to_project = true" | §P2 / §DDL — the helper's `'member'` branch mirrors the §11 access predicate |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "ownership-based" | §P2 — helper layered on the ownership family; base RLS unchanged |

---

## P1 — Feature identification
**Program:** Shared Project Workspace — Walter-approved design (2026-07-30). **This microstep = Phase 2b-3a: the conversation-access read helper.** Phase 2a landed the publish columns + broadened RLS (§11); Phase 2b-1/2b-2 landed the publish gates + func-projects handlers. But the deployed chat read/post handlers (`theo_get_conversation`, `theo_message` on func-premium; `theo_message_stream` on func-stream) BYPASS RLS and gate on explicit `created_by = $oid` app-SQL, so a published transcript is not yet readable/continuable by a member. This microstep adds the single SECURITY DEFINER helper those handlers will call — `theo_conversation_access(uuid) → 'owner'|'member'|NULL` — so Phase 2b-3b/2b-3c can gate reads + continuation with one call instead of inlining the membership predicate across many live-handler queries. Broadening conversation read/continue beyond ownership is out of default 1B scope "unless Walter authorizes" (Backend Plan; Schema §1 — Rule Anchors); **Walter authorized this 2026-07-30**. Delivers **only** the helper — no handler, no surface, no model call.

## P2 — Architecture & boundary reconciliation
- **Predicate parity with §11.** The helper's `'member'` branch is byte-for-byte the deployed §11 access set: `published_to_project = true AND project_id IS NOT NULL AND project_id IN (SELECT id FROM theo_projects WHERE created_by = caller UNION SELECT project_id FROM theo_project_members WHERE member_oid = caller)`. So read-path access via the helper matches the RLS model exactly; there is one predicate, defined once.
- **Why a helper, not inline (safety).** The deployed chat handlers connect with a Functions role that BYPASSES RLS and enforce `created_by = $oid` in app-SQL. Rather than replicate the membership predicate in 6+ live-handler queries across two apps (drift-prone; larger diffs on live traffic), this centralizes it — the deployed `theo_conversation_exists_unscoped` / `theo_project_exists_unscoped` existence-helper idiom. Phase 2b-3b/2b-3c handler edits become: call the helper, gate on the returned role (NULL → the existing 403/404 discrimination via `theo_conversation_exists_unscoped`).
- **Idiom (mirrors deployed).** `LANGUAGE plpgsql SECURITY DEFINER SET search_path = public`, migration-role-owned, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated` — the governed service write-path idiom (Schema §9; Phase 1/2b-1 gates — Rule Anchor). Caller OID from `current_setting('request.jwt.claim.sub', true)` (never a parameter). **Read-only** — the function performs no write; it only classifies access.
- **RLS non-recursion preserved.** The helper reads `theo_conversations` (the target row) + `theo_projects` + `theo_project_members` inside a definer context; it adds **no** RLS policy and **no** new projects↔conversations policy subquery, so the §11 + B5c non-recursion invariants are preserved.
- **Boundary.** One additive function operating existing `theo_*` columns in the shared `vaultgpt` instance; **no `reporting_*`**; no table/column/row/policy change; base ownership RLS untouched.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Walter).** One idempotent, additive migration on the shared `vaultgpt` Postgres (as `pgadmin_vault`, the owner). No app/env/dependency change. | **PRE-LAND** — §DEPLOY; Claude Code runs the read-only §VERIFY catalog probe after. |
| G-2 | **Schema doc row.** `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §11 gains the helper signature after deploy (mirrors the §11 gate-note). | **PRE-LAND** — a short schema-doc Role-C follows deploy. |
| G-3 | **Phase 2b-3b read broadening (func-premium).** `theo_get_conversation` gates via `theo_conversation_access` (owner OR published-member) + reads messages conversation-wide once access is confirmed. Deployed via Kudu VFS. | **PROCEED (future-trigger)** — next microstep VEP (Golden Handler primary-reference edit + curls). |
| G-4 | **Phase 2b-3c continue broadening (func-premium + func-stream).** `theo_message`/`theo_message_stream` gate via the helper, compute seq conversation-wide, bump `updated_at` for a member post, INSERT with `created_by = caller` (attribution); per-user reads (memory) stay caller-scoped. | **PROCEED (future-trigger)** — the highest-touch microstep; separate governed VEP. |

No write SQL in this pack (plan only). No `reporting_*` change.

## P3 — Backend / contract grounding
No HTTP contract in this microstep (no handler). The helper backs the read/continue path of the Phase-2b-2 publish contracts (API Spec §2.2 — doc 9): once 2b-3b/2b-3c wire it, a project participant may open + continue a published conversation. No API-Spec change here (the helper is internal); the schema doc §11 gains its signature note post-deploy (G-2).

## P4 — Schema definition
See §DDL (complete idempotent migration): one SECURITY DEFINER function `theo_conversation_access(uuid) → text` with `REVOKE`/`GRANT`. No table, column, index, or policy change (the §11 columns + policies are already deployed).

## P5 — Component reference grounding
- **Mirrored deployed predicate:** the §11 policy access set (Phase 2a migration blob `25cdb7d0` — Rule Anchor / doc 10): `published_to_project = true AND project_id IS NOT NULL AND project_id IN (creator ∪ member)`. The helper's `'member'` branch reproduces it exactly.
- **Function idiom reference (deployed):** the Phase 2b-1 gates (blob `321d368a` — doc 11) + `theo_conversation_exists_unscoped` (the 403/404 existence helper the calling handlers already use) — migration-role-owned SECURITY DEFINER, `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated`, pinned `search_path`, caller identity from the request claim. The helper reproduces that shape.

## P6 — Repository & active-surface grounding
New artifacts (this package): `spw_phase2b3a_migration.sql` (== §DDL), `spw_phase2b3a_verify.sql` (== §VERIFY). No source/handler/active-surface file changed in this microstep. Guardrails: no `reporting_*`; no change to deployed tables' columns, rows, or RLS policies; additive function only; idempotent (`CREATE OR REPLACE FUNCTION`); base ownership RLS untouched. Verified via the §VERIFY catalog probe post-deploy.

## P7 — Risk / regression
- **Additive + reversible + read-only.** `CREATE OR REPLACE FUNCTION` ×1; re-runnable; the reversal block (one `DROP FUNCTION IF EXISTS`) is in the migration footer. The function performs no write.
- **No RLS regression / no recursion.** Zero change to existing policies; no new projects↔conversations subquery.
- **Least privilege.** Reads the caller from `request.jwt.claim.sub` (never a parameter); `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated`.
- **No live-traffic risk.** Nothing calls the helper until Phase 2b-3b/2b-3c land; the deployed chat handlers are unchanged by this microstep, so normal chat is entirely unaffected. Authorization gate satisfied (Walter, 2026-07-30).

## P8 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; P1–P8 walked; Gap Register present (G-1/G-2 PRE-LAND; G-3/G-4 PROCEED future-trigger); complete migration in §DDL; read-only verification in §VERIFY. Plan-only. On Codex APPROVAL, Walter runs the migration; Claude Code runs §VERIFY; then the schema-doc §11 helper note Role-C (G-2) and the Phase-2b-3b read-broadening handler VEP (G-3).

---

## §DDL — `spw_phase2b3a_migration.sql` (complete; Walter-executable; idempotent)
```sql
-- ============================================================================
-- Theo Shared Project Workspace — Phase 2b-3a: conversation-access read helper.
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; NO top-level BEGIN/COMMIT (migration governance). Idempotent + reversible.
--
-- WHAT: one SECURITY DEFINER helper `theo_conversation_access(uuid) → 'owner' | 'member' | NULL`
-- that answers "may the caller read/continue this conversation?" — 'owner' if the caller authored it,
-- 'member' if it is PUBLISHED to a project the caller participates in (creator ∪ owner ∪ member),
-- NULL otherwise. This is the SINGLE audited home of the publish-to-project access predicate so the
-- Phase-2b-3b/2b-3c chat handlers (theo_get_conversation / theo_message / theo_message_stream) can gate
-- reads + continuation with ONE call instead of inlining the membership subquery in every query.
--
-- WHY A HELPER (not inline): the deployed chat handlers connect with a Functions role that BYPASSES
-- RLS and enforce isolation with explicit `created_by = $oid` predicates in application SQL — so the
-- Phase 2a §11 RLS broadening does not, by itself, open a published transcript to a member. Rather than
-- replicate the (owner ∪ published-in-my-project) predicate in 6+ live-handler queries across two apps
-- (drift-prone, larger diffs on live traffic), this helper centralizes it — the deployed
-- `theo_conversation_exists_unscoped` / `theo_project_exists_unscoped` existence-helper idiom.
--
-- PREDICATE PARITY: the 'member' branch is byte-for-byte the same access set as the deployed §11
-- policies — `published_to_project = true AND project_id IS NOT NULL AND project_id ∈ (creator ∪
-- member)` — so read-path access via this helper matches the RLS model exactly.
--
-- ENFORCEMENT / IDIOM: SECURITY DEFINER, migration-role-owned, pinned search_path, REVOKE ALL FROM
-- PUBLIC + GRANT EXECUTE TO authenticated (the governed service write-path idiom; Schema §8/§9/§10/§11).
-- The caller OID is read from `request.jwt.claim.sub` (set per-request via set_config; NEVER a
-- parameter). READ-ONLY: the function performs no write; it only classifies access.
--
-- RLS: UNCHANGED. No policy, table, column, or row is altered. No new projects<->conversations RLS
-- subquery is added (the helper reads inside a definer context), so the §11 + B5c non-recursion
-- invariants are preserved.
--
-- AUTHORIZATION: this rides the Walter-authorized Shared Project Workspace program + the explicit
-- "build read plus write together" Phase 2 direction (2026-07-30). Precedent: Phase 1/2a/2b-1 gates.
-- ============================================================================

-- theo_conversation_access: the caller's access to a conversation — 'owner' | 'member' | NULL.
--   'owner'  = the caller authored the conversation (created_by = caller).
--   'member' = the conversation is published to a project the caller participates in.
--   NULL     = no access (or the conversation does not exist — the handler discriminates 403/404 via
--              the deployed theo_conversation_exists_unscoped helper, exactly as today).
CREATE OR REPLACE FUNCTION public.theo_conversation_access(p_conversation_id uuid)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $fn$
DECLARE
  v_caller    text := current_setting('request.jwt.claim.sub', true);
  v_owner     text;
  v_project   uuid;
  v_published boolean;
BEGIN
  IF v_caller IS NULL OR v_caller = '' THEN
    RETURN NULL;
  END IF;
  SELECT created_by, project_id, published_to_project
    INTO v_owner, v_project, v_published
    FROM public.theo_conversations
   WHERE id = p_conversation_id;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  IF v_owner = v_caller THEN
    RETURN 'owner';
  END IF;
  IF v_published = true AND v_project IS NOT NULL
     AND v_project IN (
       SELECT id FROM public.theo_projects WHERE created_by = v_caller
       UNION
       SELECT project_id FROM public.theo_project_members WHERE member_oid = v_caller
     ) THEN
    RETURN 'member';
  END IF;
  RETURN NULL;
END;
$fn$;
REVOKE ALL ON FUNCTION public.theo_conversation_access(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_conversation_access(uuid) TO authenticated;

-- ============================================================================
-- REVERSIBILITY (manual, if ever needed; not run at deploy):
--   DROP FUNCTION IF EXISTS public.theo_conversation_access(uuid);
-- ============================================================================
```

## §VERIFY — post-deploy read-only catalog probe (Claude Code runs via `.local\run-reporting-ro-query.ps1`)
```sql
-- SPW Phase 2b-3a — post-deploy verification (read-only; catalog only).
-- Claude Code runs this via .local\run-reporting-ro-query.ps1 after Walter deploys the migration.

-- 1) the access helper exists, is SECURITY DEFINER, pins search_path=public, returns text.
SELECT p.proname,
       pg_get_function_identity_arguments(p.oid) AS args,
       p.prosecdef                                AS security_definer,
       pg_get_function_result(p.oid)              AS returns,
       (SELECT array_agg(cfg) FROM unnest(p.proconfig) cfg
         WHERE cfg LIKE 'search_path=%')          AS search_path
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname = 'theo_conversation_access'
ORDER BY p.proname;
-- Expect: prosecdef = t; search_path = {search_path=public};
--   theo_conversation_access(p_conversation_id uuid) -> text

-- 2) EXECUTE granted to `authenticated` and NOT to PUBLIC (privileged gate discipline).
SELECT p.proname, r.rolname AS grantee, a.privilege_type
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
CROSS JOIN LATERAL aclexplode(p.proacl) a
JOIN pg_roles r ON r.oid = a.grantee
WHERE n.nspname = 'public'
  AND p.proname = 'theo_conversation_access'
ORDER BY r.rolname;
-- Expect: grantee `authenticated` with EXECUTE; NO row for `PUBLIC` (empty grantee).

-- 3) no RLS policy changed by this migration — the §11 policy set is intact (4 + 4).
SELECT c.relname AS tbl, count(*) AS policies
FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid
WHERE c.relname IN ('theo_conversations','theo_messages')
GROUP BY c.relname
ORDER BY c.relname;
-- Expect: theo_conversations = 4, theo_messages = 4 (unchanged).

-- 4) the publish columns the helper reads are present (unchanged by this migration).
SELECT a.attname
FROM pg_attribute a
WHERE a.attrelid = 'public.theo_conversations'::regclass
  AND a.attname IN ('published_to_project','project_id','created_by')
  AND NOT a.attisdropped
ORDER BY a.attname;
```

## §DEPLOY — Walter deploy steps
1. Run `spw_phase2b3a_migration.sql` against the shared `vaultgpt` Postgres **as `pgadmin_vault`** (the owner; same as every prior theo migration — NOT via the RO tool).
2. Reply "SPW Phase 2b-3a deployed" → Claude Code runs §VERIFY (helper present, `prosecdef=t`, `search_path=public`, EXECUTE to `authenticated` not PUBLIC; §11 columns intact; RLS policy counts unchanged), then prepares the schema-doc §11 helper-note Role-C (G-2) and the Phase-2b-3b read-broadening handler VEP (G-3).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Shared Project Workspace Phase 2b-3a Conversation-Access-Helper Pass-1 Backend VEP (plan only).*
