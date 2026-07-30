# Role-C Verbatim-Edit Handoff — record Shared Project Workspace Phase 1 (Roles) DEPLOYED in the Theo Azure Postgres Schema doc

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. SPW Phase 1 is deployed + read-only-verified (the `role` column + CHECK on `theo_project_members`; five SECURITY DEFINER gate functions with `search_path=public` + EXECUTE to `authenticated` not `PUBLIC`; `theo_project_members` RLS unchanged — its three B5c policies intact). This Role-C updates `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (the data-truth owner) by **appending a new `## §10` DEPLOYED-DDL section** recording the role model + gate functions, citing the canonical committed migration (single source of truth — not re-embedded, to prevent drift). One additive edit; no existing content changes. (B5a `visibility` + the base B5c `theo_project_members` table predate this doc's DEPLOYED sections and remain undocumented here; §10 points a reader at their canonical package DDL but does not retroactively author them — out of this microstep's scope.)

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `e809c4853be4359d4b3ae2edcf37e79e88bec223` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 table set; §8/§9 DEPLOYED sections; doc tail) | `sed -n`/`grep -oF` (exact §9-tail anchor) this turn | `57fa5f2a33e683692c12a41dfe732b92bed101a4` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Read` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed SPW Phase 1 migration (canonical DDL, referenced) — `Codex Governance/Theo-SPW-Phase1-Roles-Substrate-Pass-1-VEP/spw_phase1_migration.sql` | authored + committed this session (`e809c48`) | tracked package file (SPW Phase 1 VEP) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits" | EDIT 1 — Codex applies the §10 append verbatim |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8/§9 | "the governed service write-path idiom" | §10 — the five gate functions are the same SECURITY DEFINER idiom |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "Membership/sharing models are introduced only by explicit Walter-authorized schema update" | §10 — role model = Walter-authorized (2026-07-30) membership extension |

## Rationale
The schema doc is the `theo_*` data-truth owner and records DDL DEPLOYED step-by-step. SPW Phase 1 has landed (deployed + read-only-verified this session; committed migration `e809c48`), so the doc gains a §10 DEPLOYED record — mirroring the §9 (DMS-Push) pattern: status + a canonical-DDL pointer to the committed migration (one authoritative copy, no drift) + as-built specifics (the role model, the five function signatures/guards, the RLS-unchanged/non-recursion note, the SQLSTATE→HTTP map, the Walter authorization). Pure append after §9; no existing byte changes.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once (verified `grep -oF` = 1) or HALT. One file, one additive append. Target file: `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (the final paragraph of §9).

### EDIT 1 — append the §10 Shared Project Workspace Phase 1 DEPLOYED section

**Locate (BEFORE) — the §9 closing sentence, found exactly once:**

```
This is the governed service write-path idiom (mirrors the deployed `theo_chat_claim_push_subscription` SECURITY DEFINER pattern). No file content is stored — only subscription plumbing. Boundary: net-new additive table; no `reporting_*` touched; no `theo_` ownership table altered.
```

**Replace with (AFTER) — the same sentence, then the new §10 section appended:**

```
This is the governed service write-path idiom (mirrors the deployed `theo_chat_claim_push_subscription` SECURITY DEFINER pattern). No file content is stored — only subscription plumbing. Boundary: net-new additive table; no `reporting_*` touched; no `theo_` ownership table altered.

## §10 DEPLOYED DDL — Shared Project Workspace Phase 1: Roles (2026-07-30)

**Status:** DEPLOYED against `vaultgpt-postgres-prod` (schema `public`; run by Walter as `pgadmin_vault` 2026-07-30). Read-only-verified (catalog): `theo_project_members.role` present — `text NOT NULL DEFAULT 'member'` + CHECK `role IN ('owner','member')`; five SECURITY DEFINER gate functions present with `prosecdef=t` + `search_path=public`; EXECUTE granted to `authenticated` (and the owner `pgadmin_vault`), **not** `PUBLIC`; `theo_project_members` RLS unchanged (its three B5c policies — `theo_project_member_select_own`/`_insert_own`/`_delete_own` — intact, no new policy).

**Canonical DDL (single source of truth):** `Codex Governance/Theo-SPW-Phase1-Roles-Substrate-Pass-1-VEP/spw_phase1_migration.sql` (Codex-APPROVED; deployed by Walter). Additive + reversible + idempotent (`ADD COLUMN IF NOT EXISTS` + guarded CHECK + `CREATE OR REPLACE FUNCTION`; no top-level `BEGIN`/`COMMIT`). Not duplicated here.

**As-built specifics (Shared Project Workspace program, Phase 1 — the Creator / Owner / Member role model):** adds `role text NOT NULL DEFAULT 'member'` + `CHECK (role IN ('owner','member'))` to the deployed B5c per-member-invite table `public.theo_project_members` (existing rows backfill to `'member'` via the default). The base `theo_project_members` table + its self-contained non-recursive RLS are defined by the B5c migration `Codex Governance/Theo-1B-B5c-Per-Member-Invite-Backend-Pass-1-VEP/b5c_migration.sql` (B5a `visibility` + B5c predate this doc's DEPLOYED sections; their canonical DDL lives in those packages). **Role model:** the project **Creator** = `theo_projects.created_by` (implicit top authority; never a member row); `role='owner'` = a promoted **Owner**; `role='member'` = a **Member**. Five gate functions — all `LANGUAGE plpgsql SECURITY DEFINER SET search_path = public`, migration-role-owned, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated`, caller OID from `current_setting('request.jwt.claim.sub')` (never a parameter — the `theo_chat_leave` idiom): `theo_project_effective_role(uuid)` → `'creator'|'owner'|'member'|NULL`; `theo_project_list_members(uuid)` (creator/owner only; raises 42501 for a member); `theo_project_add_member(uuid, text)` (creator/owner adds a `member`; idempotent; the creator cannot be added); `theo_project_set_member_role(uuid, text, text)` (**CREATOR-only** promote/demote between `owner`/`member`); `theo_project_remove_member(uuid, text)` (creator/owner removes; an Owner may remove only **Members** — removing an Owner is Creator-only). **Invariant:** Owner status (promote / demote / remove) is mutated only by the Creator, never by another Owner. **RLS is UNCHANGED** — the `role` column is additive and the privileged writes are function-gated (the governed service write-path idiom; §8/§9), adding **no** new `projects`↔`members` policy subquery, so the B5c non-recursion invariant is preserved exactly. SQLSTATE→HTTP map for the Phase-1b handlers: `28000`→401, `42501`→403, `22023`→400, `P0002`→404. **Authorization:** sharing/membership RLS is out of default 1B scope "unless Walter authorizes" (Backend Plan; §1) — Walter authorized this role extension 2026-07-30 (precedent: B5a/B5c). Boundary: additive column + additive functions on an existing `theo_*` table; no `reporting_*` touched; no existing RLS policy altered. Handler wiring is Phase 1b.
```

## Note
Records SPW Phase 1 as DEPLOYED in the schema doc via one additive §10 section. No §3 table-set change (that table already omits B5a/B5c/DMS-Push tables — a pre-existing gap out of this microstep's scope), no banner change, no existing-byte change. No Phase-1B Plan change. The paired Phase-1b handler VEP (role-aware `theo_share_project`/`theo_list_project_members` + `theo_set_project_member_role`, landing in `vaultgpt-func-projects`) grounds on this §10 + the committed migration.

Scope attestation: this edit is enumerated here, limited to `spec/THEO_AZURE_POSTGRES_SCHEMA.md`, appends only the §10 DEPLOYED record for the already-deployed + verified SPW Phase 1 migration, and alters no existing content, VEP, or migration.

## Codex activation note (Walter forwards)

```
Codex is activated to execute the SPW Phase 1 Schema-Doc DEPLOYED Role-C handoff (vault-theo, "Codex Governance/Theo-SPW-Phase1-Schema-Doc-DEPLOYED-RoleC/Theo_SPW_Phase1_Schema_Doc_DEPLOYED_RoleC.md"). Open with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Grounding Conformance §3/§5). Apply EDIT 1 to spec/THEO_AZURE_POSTGRES_SCHEMA.md verbatim — the BEFORE anchor is the §9 closing sentence ("This is the governed service write-path idiom … no `theo_` ownership table altered."), which MUST be found exactly once; append the new ## §10 section after it per the AFTER text; HALT on any mismatch. One file, one additive append — no line-ending normalization, no other edits. Emit APPROVED or REJECTED only.
```
