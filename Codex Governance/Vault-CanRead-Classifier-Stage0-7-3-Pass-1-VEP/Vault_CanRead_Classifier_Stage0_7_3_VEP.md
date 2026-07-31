# Vault `theo_can_read` READ Classifier (Stage-0 §7.3) — the Postgres access-policy engine function — Pass-1 VEP

Backend implementation VEP (Pass 1) for **Stage-0 §7.3** of the Codex-APPROVED access-policy engine design ([[Vault_Access_Policy_Engine_Stage0_Design.md]] §3.1, §7 item 3). Delivers the **DB half of the engine**: a single audited SECURITY DEFINER classifier `public.theo_can_read(...)` that answers "may the caller read this item?" for the DB-knowable dimensions — L1 ownership; L1.5 membership × info-type × firm-role floor; the Rule-3 lowest-participant **membership** filter — absorbing `theo_project_effective_role` (§10) and `theo_conversation_access` (§11) as helpers. **Migration-only — Walter-run (`pgadmin_vault`); NO handler.** The app-layer Graph reachability probe (Rule 5) and the firm-role lowest-participant filter over *other* participants are the separate §7.4 orchestrated engine. Read authority is **one policy** with the §7.2 Tag Guard write floors (design §4).

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Verified Evidence Pack (backend implementation package — schema migration, no handler)
Grounding parent (source baseline): `51efa0ed4b9d6cf932f82a58e59b4f4a0a39c5fe` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; currency anchors below are tip-independent blob SHAs
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Stage-0 DESIGN (this VEP implements §3.1 / §7 item 3) — `Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md` | Codex-APPROVED (`33f5655`); §2/§3.1/§5/§7 re-read this turn | `0e6779235c9b39935c4e63688f06a27ae92a8175` |
| 2 | GOVERNING VISION — `governance/VAULT_MEMORY_ARCHITECTURE.md` (§3 info-type × access; §7.1 L1 inviolable; §7.3 lowest-participant; §8 mixed-room) | `Read`(§3/§7/§8) this turn | `d17ddd0d97887b38e6db3297c56db9d6b3cfe9cf` |
| 3 | Backend Governor — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3 Never-Guess; §4 Schema Reality Lock; §6 SQL/authorization; §8 VEP format + Gap Register) | `Grep("Never-Guess")` + `Grep("Schema Reality Lock")` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 4 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 5 | Golden Handler — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (Golden SQL: SECURITY DEFINER, pinned search_path, REVOKE/GRANT, SQLSTATE; §5.2 no top-level txn) | `Grep("SECURITY DEFINER")` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 6 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1C Walter-runs-migrations; §1D ordered pass) | `Grep("migrations/merges remain Walter-only")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 7 | SCHEMA TRUTH — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§10 `theo_project_effective_role`; §11 `theo_conversation_access`; §12 `theo_project_context_items` + Tag Guard; §6 `theo_user_memory` — the §7 Role-C target) | `Read`(§10/§11/§12) this turn | `feed798726983da4def5400ace806a885aa83469` |
| 8 | DEPLOYED IDIOM (SQL mirror — absorbed as helpers) — `theo_project_effective_role` (spw_phase1) + `theo_conversation_access` (spw_phase2b3a) + Tag Guard authority (l1_5) | governed migrations, catalog-verified: spw_phase1 `75659097d611ba833741b2fb8383f7050c534334`; spw_phase2b3a `4d589f83b4954b43196bd7074b1fe29075df0c8f`; l1_5 `bb09e0964528cacdbebbc41198760a08a2e6b03d` | those blob SHAs @ HEAD |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Never-Guess" | §3 — DDL mirrored from deployed classifiers, not invented |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §3 — reads only deployed tables/helpers |
| Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md | §3.1 | "never a parameter" | §4 — caller from the JWT claim, never a parameter |
| Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md | §4 | "one policy" | §2 — read authority = the §7.2 Tag Guard floors |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §3 | "sign-off authority only" | §2/§4 — governance-tag read floor |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §3 | "partner + director + senior manager only" | §2/§4 — commercial-tag read floor |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | Golden SQL | "SECURITY DEFINER" | §4 — the classifier function idiom |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1C | "migrations/merges remain Walter-only" | §8 — Walter runs the migration |

---

## §1 — Feature + design

**Feature.** One net-new SECURITY DEFINER function, `public.theo_can_read(p_item_layer text, p_item_type text, p_item_id uuid, p_project_id uuid, p_firm_role text, p_room_oids text[]) RETURNS boolean` (design §3.1 signature, exact). It is the single audited read decision for the DB-knowable dimensions:
- **L1 (personal memory):** allow iff `created_by = caller` — inviolable (Rule 1 / vision §7.1). Reads `theo_user_memory` (scope='user').
- **L1.5 (project context):** for a `theo_project_context_items` row — the owner always reads their own; a non-owner needs project membership (`theo_project_effective_role` non-NULL) AND the item's **info-type firm-role floor** (the same floors as the §7.2 Tag Guard: commercial = partner/director/senior_manager; governance = manager-and-above; personnel = director-and-above; factual/technical/deliberative = membership). If the item is not a context item, it falls back to `theo_conversation_access` (the published-conversation L1.5 kind). Plus the **Rule-3 lowest-participant** filter: with `p_room_oids`, every room participant must also be a project member (the DB-knowable half).
- **L2 / L3:** reserved — their schemas do not exist yet; **fail-closed (return false)** until they land.

**Fail-closed everywhere (design §5):** NULL caller ⇒ false; item not found ⇒ false; unresolved firm role ⇒ restricted tags denied; no matching allow ⇒ false. Returns **boolean** (false = deny, **no RAISE** — mirrors `theo_conversation_access`'s NULL). Caller from `current_setting('request.jwt.claim.sub', true)` — **never a parameter**. `p_item_type`/`p_project_id` are advisory; the **authoritative** type/project are read from the row (a caller cannot pass a benign type for a sensitive item).

## §2 — Architecture & boundary reconciliation

**Where this sits.** This is the DB classifier of the engine (design §2.1 — generalising `theo_conversation_access`). It does NOT touch L1's inviolable data beyond the owner-equality check; it introduces no new table. It **absorbs `theo_project_effective_role` + `theo_conversation_access` as helpers it calls** (design §7 item 3 / Amendment 1 — one audited read home). Read authority is **one policy** with the §7.2 Tag Guard write-path (design §4): identical info-type firm-role floors, so write-authority and read-access cannot drift.

**The DB-vs-app split (design §2.2 key consequence).** The engine is a *composition*: this Postgres classifier (DB dimensions) AND the §7.4 app-layer Graph reachability probe (Rule 5), combined strict-AND. Two things are deliberately **NOT** in this function because Postgres cannot resolve them:
- **Rule 5 (SharePoint-Graph reachability)** — needs an OBO Graph call; §7.4.
- **The firm-role lowest-participant filter over OTHER participants** — only the CALLER's firm role is PG-resident (passed as `p_firm_role`); other participants' firm roles come from Graph, so that filter is §7.4. This function does the **membership** lowest-participant filter (DB-knowable) now.

**Boundary.** No `reporting_*`; no Blob; no Graph; no write. Reads only deployed `theo_*` tables + calls two deployed SECURITY DEFINER helpers. Net-new additive function; no existing object altered.

**Authority table (read side — one policy with §7.2):**

| info_type | Read floor (non-owner member) | Basis |
| --------- | ----------------------------- | ----- |
| factual / technical / deliberative | project membership | vision §3 "broad" / "by role" / "participants" |
| commercial | firm ∈ {partner, director, senior_manager} | vision §3 "partner + director + senior manager only" (fixed) |
| governance | firm ∈ {partner, director, senior_manager, manager} | vision §3 "sign-off authority only" (manager+ — tunable, matches §7.2) |
| personnel | firm ∈ {partner, director} | vision §3 need-to-know (director+ — tunable, matches §7.2) |

Deferred refinements (flagged, not blocking): the vision's deliberative "levels above" nuance and personnel per-item need-to-know ACL are future narrowings on top of these floors (as in §7.2); L2/L3 read semantics land with those layers' schemas.

## §3 — Schema Reality Lock (deployed grounding)

The function mirrors DEPLOYED idioms (Governor §3/§4) — nothing invented:
- **Function idiom** = the deployed classifier shape: `LANGUAGE plpgsql SECURITY DEFINER SET search_path = public`, caller from `current_setting('request.jwt.claim.sub', true)`, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated` — from `theo_conversation_access` (spw_phase2b3a, blob `4d589f83`) and `theo_project_effective_role` (spw_phase1, blob `75659097`).
- **Helpers called** = the deployed `theo_project_effective_role(uuid)` (§10) and `theo_conversation_access(uuid)` (§11) — unchanged, invoked as-is.
- **Tables read** = `theo_user_memory` (§6, blob context in schema doc), `theo_project_context_items` (§12, the §7.2 table), `theo_projects` + `theo_project_members` (§10). No new table.
- **Authority floors** = byte-for-byte the deployed §7.2 Tag Guard floors (`theo_tag_guard_write_context_item`, l1_5 blob `bb09e096`) — one policy.

## §4 — The migration (Walter runs as `pgadmin_vault`)

Runnable file: `theo_can_read_migration.sql` (in this package). Additive; `CREATE OR REPLACE FUNCTION` only; **no top-level `BEGIN`/`COMMIT`** (Golden Handler §5.2); idempotent + reversible (`DROP FUNCTION IF EXISTS public.theo_can_read(text, text, uuid, uuid, text, text[]);`). Full text:

```sql
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
```

## §5 — SQL mirror (no handler primary reference — migration-only)

This package ships **no handler** (design §7.3 is the Postgres function; the handler-layer composition is §7.4), so Golden Handler §2's handler-primary-reference does not apply. The mirror sources are the DEPLOYED SECURITY DEFINER classifiers, cited + blob-anchored (GCR row 8):

| Region of `theo_can_read` | Mirror source (deployed) | Classification |
| ------------------------- | ------------------------ | -------------- |
| `SECURITY DEFINER SET search_path = public` + caller-from-claim + `REVOKE`/`GRANT` | `theo_conversation_access` (spw_phase2b3a) / `theo_project_effective_role` (spw_phase1) | EXACT idiom |
| membership resolution | calls deployed `theo_project_effective_role(uuid)` (§10) | EXACT reuse (helper) |
| published-conversation fallback | calls deployed `theo_conversation_access(uuid)` (§11) | EXACT reuse (helper) |
| info-type firm-role floors | byte-for-byte the deployed §7.2 `theo_tag_guard_write_context_item` floors | EXACT (one policy) |
| L1 ownership / L2-L3 fail-closed / Rule-3 membership filter | new classifier logic per design §3.1 | ALLOWED DELTA (new fn, design-specified) |

## §6 — Verification (read-only; no golden curls — no handler)

Runnable file: `theo_can_read_verify.sql` (read-only SELECT / session-local `set_config` only). Post-migration checks:
1. **Catalog** — the function exists, `prosecdef = t`, `search_path=public`, EXECUTE granted to `authenticated` (not `PUBLIC`).
2. **Functional (read-only)** — using the deployed §7.2 golden-curl test items in project *Test 2*: owner reads own items (all TRUE); a non-member caller (all FALSE); L1 owner-only (own TRUE / other FALSE); L2/L3 reserved (FALSE). The full info-type firm-role-floor matrix for a non-owner member (associate → restricted tags FALSE) needs a second member identity and is **exercised end-to-end by the §7.4 handler** (which resolves a real member's firm role via OBO) — documented in the verify file §2c/§2d. Claude runs the read-only verification after Walter's migration (or Walter runs it); no write occurs.

Full verify text:

```sql
-- theo_can_read_verify.sql — READ-ONLY verification for Stage-0 §7.3 (theo_can_read). No writes; safe to re-run.
-- Run post-migration. All statements are SELECT / set_config (session-local) only.

-- ── 1) CATALOG: function exists, SECURITY DEFINER, search_path pinned, EXECUTE to authenticated (not PUBLIC) ──
SELECT p.proname,
       p.prosecdef                                                   AS is_security_definer,   -- expect t
       pg_get_function_identity_arguments(p.oid)                     AS args,                  -- 6-arg signature
       (SELECT string_agg(cfg, ', ') FROM unnest(p.proconfig) cfg)   AS settings,              -- expect search_path=public
       pg_catalog.array_to_string(p.proacl, ' ')                     AS acl                    -- expect authenticated=X, no PUBLIC=X
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public' AND p.proname = 'theo_can_read';

-- ── 2) FUNCTIONAL (read-only). Fixtures = the deployed §7.2 golden-curl test items in project 'Test 2'
--       (5e70e748-81f2-423b-8e55-a9bb10717915), all owned by Walter (225f17d0-…, the project creator + a partner).
--       Substitute a real non-owner member OID for the floor matrix (see §2c); the full firm-role-floor matrix is
--       exercised end-to-end by the §7.4 handler (which resolves a real associate's firm role via OBO).

-- 2a) OWNER reads their OWN L1.5 context items of every type ⇒ all TRUE (owner shortcut, any firm role)
SELECT set_config('request.jwt.claim.sub', '225f17d0-18bb-48f1-b4e2-addd4048c2b8', false);
SELECT info_type,
       public.theo_can_read('L1.5', NULL, id, project_id, 'partner', NULL) AS owner_reads   -- expect TRUE for all
  FROM public.theo_project_context_items
 WHERE project_id = '5e70e748-81f2-423b-8e55-a9bb10717915'
 ORDER BY info_type;

-- 2b) A NON-MEMBER caller (random OID, not owner, not a project member) ⇒ FALSE for every item, any firm role
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000ab', false);
SELECT info_type,
       public.theo_can_read('L1.5', NULL, id, project_id, 'partner', NULL) AS nonmember_reads  -- expect FALSE for all
  FROM public.theo_project_context_items
 WHERE project_id = '5e70e748-81f2-423b-8e55-a9bb10717915'
 ORDER BY info_type;

-- 2c) INFO-TYPE FLOOR (needs a real non-owner MEMBER of 'Test 2'). With that member's OID as caller:
--       commercial → TRUE only if firm ∈ {partner,director,senior_manager}; governance → {…,manager};
--       personnel → {partner,director}; factual/technical/deliberative → TRUE on membership alone.
--     Example (replace <MEMBER_OID>): an associate-level member must be DENIED the three restricted tags:
--       SELECT set_config('request.jwt.claim.sub', '<MEMBER_OID>', false);
--       SELECT info_type,
--              public.theo_can_read('L1.5', NULL, id, project_id, 'associate', NULL) AS assoc_member_reads
--         FROM public.theo_project_context_items
--        WHERE project_id = '5e70e748-81f2-423b-8e55-a9bb10717915' ORDER BY info_type;
--       -- expect: factual/technical/deliberative TRUE; commercial/governance/personnel FALSE (fail-closed).

-- 2d) UNRESOLVED firm role (NULL) as a non-owner member ⇒ restricted tags FALSE (least-privileged). Same shape as 2c
--     with p_firm_role => NULL.

-- 2e) L1 personal memory — INVIOLABLE. The owner reads their own row ⇒ TRUE; anyone else ⇒ FALSE.
--       (pick any theo_user_memory row the test caller owns; scope='user')
SELECT set_config('request.jwt.claim.sub', '225f17d0-18bb-48f1-b4e2-addd4048c2b8', false);
SELECT public.theo_can_read('L1', NULL, id, NULL, NULL, NULL) AS owner_reads_own_L1   -- expect TRUE
  FROM public.theo_user_memory
 WHERE created_by = '225f17d0-18bb-48f1-b4e2-addd4048c2b8' AND scope = 'user'
 LIMIT 1;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000ab', false);
SELECT public.theo_can_read('L1', NULL, id, NULL, NULL, NULL) AS other_reads_L1        -- expect FALSE
  FROM public.theo_user_memory
 WHERE created_by = '225f17d0-18bb-48f1-b4e2-addd4048c2b8' AND scope = 'user'
 LIMIT 1;

-- 2f) L2 / L3 (reserved) ⇒ FALSE (fail-closed until those schemas land)
SELECT public.theo_can_read('L2', NULL, gen_random_uuid(), NULL, 'partner', NULL) AS l2_reads,  -- expect FALSE
       public.theo_can_read('L3', NULL, gen_random_uuid(), NULL, 'partner', NULL) AS l3_reads;  -- expect FALSE
```

## §7 — Gap Register

**PROCEED.** No missing CURRENT authority; no ESCALATE.
- **G-1 (L2/L3 reserved): PROCEED** — no L2/L3 tables exist; the branches fail-closed (deny) until those schemas land (design §3.1). Disclosed; correct fail-closed posture.
- **G-2 (Rule-5 Graph probe + firm-role lowest-participant over others): PROCEED (deferred to §7.4)** — Postgres cannot reach Graph and holds only the caller's firm role; the app-layer composition is §7.4 (design §2.2/§3.2). This function does the DB-knowable membership lowest-participant filter now.
- **G-3 (info-type floor tunability): PROCEED** — the governance/personnel floors match §7.2's tunable policy values (one policy); retuning is a future Walter-run migration touching both the Tag Guard and this classifier together.
- **G-SCHEMADOC: PRE-LAND (Role-C, post-migration)** — the new function's `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §12 entry (or a §13) lands via Role-C AFTER the Walter-run migration + read-only verification, per deploy→document ordering. Disclosed; does not block Pass-2.

## §8 — Deploy plan (ordered; §1C/§1D)

1. **Codex Pass-2** review → APPROVED/REJECTED.
2. **Walter** runs `theo_can_read_migration.sql` as `pgadmin_vault` (DB migrations remain Walter-only).
3. **Claude** runs `theo_can_read_verify.sql` read-only (catalog + functional SELECTs) to confirm.
4. **Role-C** lands the schema-doc entry (G-SCHEMADOC). No API-Spec change (no endpoint — the classifier is exercised by §7.4's handler, documented then).

## Codex activation note (Walter forwards)

```
Codex is activated for Pass-2 review of the Vault theo_can_read READ classifier (Stage-0 §7.3), vault-theo,
"Codex Governance/Vault-CanRead-Classifier-Stage0-7-3-Pass-1-VEP/Vault_CanRead_Classifier_Stage0_7_3_VEP.md".
Open your Pass-2 turn with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Grounding
Conformance §3/§5). This is a migration-only backend package (a Walter-run SECURITY DEFINER function; NO handler,
NO golden curls — read-only functional verification instead). Review for: (1) the function (§4) — exact design
§3.1 signature; SECURITY DEFINER + pinned search_path + caller-from-claim (never a parameter) + REVOKE/GRANT;
RETURNS boolean (false = deny, no RAISE) mirroring theo_conversation_access; additive/idempotent/reversible with
no top-level BEGIN/COMMIT (§5.2). (2) fail-closed completeness (§5 of the design) — NULL caller / not-found /
unresolved firm role / L2-L3 all deny; the authoritative type/project are read from the row (not trusted from
params). (3) the authority model — is it ONE POLICY with the §7.2 Tag Guard floors (commercial fixed by vision;
governance/personnel tunable, matching §7.2), and a faithful reading of vision §3? (4) the DB-vs-app split (§2) —
is it correct that Rule-5 Graph reachability + the firm-role lowest-participant filter over OTHER participants are
deferred to §7.4 (Postgres can't reach Graph / holds only the caller's firm role), while the membership
lowest-participant filter is DB-knowable and done here? (5) helper absorption — theo_project_effective_role +
theo_conversation_access called as-is (published-conversation fallback), no duplication. (6) the deploy plan (§8)
— Walter-runs-migration / Claude read-only verify / schema-doc Role-C deferred post-migration (G-SCHEMADOC).
Emit APPROVED or REJECTED only.
```
