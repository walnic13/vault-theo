# Vault L1.5 Schema + Tag Guard (Stage-0 §7.2) — API-Spec §2.18 + Schema-doc §3/§12 — Pass-4 Role-C

Documentation-update (Role-C) handoff closing the **G-APISPEC + G-SCHEMADOC PRE-LAND gaps** from the Codex-APPROVED Pass-1 VEP ([[Vault_L1_5_Schema_TagGuard_Stage0_7_2_VEP.md]], commit `3525b68`). The migration is **run** (Walter, `pgadmin_vault`, 2026-07-31) and `theo_create_project_context_item` is **DEPLOYED to `vaultgpt-func-projects`** (run-from-package `pkg-5a5270f`) and **golden-curl-verified** end-to-end. Per the standard deploy→document ordering this Role-C records the contract + schema. **Documentation-only — no code/schema/deploy.** Three additive edits across two spec files; no existing line modified except the one additive table row insertion point.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Role-C documentation update (API-Spec §2 row + Schema-doc §3/§12; deploy→document, post-verified)
Grounding parent (source baseline): `3525b689f5b07e2c03b9a1cbdf579ca15627e513` (vault-theo, `development`) — the commit carrying the Codex-APPROVED Pass-1 VEP; currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | CONTRACT TRUTH (edit target A) — `spec/THEO_API_SPEC.md` (§2 Contract Surface; §2.17 firm-role sibling format mirrored; `## §3 Boundary` = insertion anchor) | `sed`(§2.17 block + §3 anchor) this turn | `f86d3594da7ed3a165b37887de99e6dfa1228593` |
| 2 | SCHEMA TRUTH (edit target B) — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 Structural Table Set; §10/§11 SPW DDL-section format mirrored; EOF = §12 insertion) | `Read`(§3 + §5/§6/§10/§11) this turn | `abe14dc5d45b8a78b4d2b7303f0bd1257da120ec` |
| 3 | APPROVED PASS-1 VEP (declares the gaps; defines the row + DDL) — `Codex Governance/Vault-L1_5-Schema-TagGuard-Stage0-7-2-Pass-1-VEP/Vault_L1_5_Schema_TagGuard_Stage0_7_2_VEP.md` | Codex-APPROVED (approval commit `3525b68`); §7/§8 re-read this turn | `867ff1f6762f5fb0db8aa04f72a6e1e743f98197` |
| 4 | GOVERNING VISION — `governance/VAULT_MEMORY_ARCHITECTURE.md` (§3 info-type × access — the documented enum + authority; Amendment 7) | `Read`(§3) this turn | `d17ddd0d97887b38e6db3297c56db9d6b3cfe9cf` |
| 5 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 6 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1D ordered pass — deploy precedes the API/schema Role-C) | `Grep("ordered, non-skippable")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| spec/THEO_API_SPEC.md | §2 | "## §2 Contract Surface (1A) → Deployed Endpoints (1B)" | Edit A — §2.18 appended to §2 |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Structural Table Set" | Edit B1 — new table row in §3 |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1D | "ordered, non-skippable" | deploy→document ordering: rows added only AFTER migration-run + deploy + golden curls |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §3 | "sign-off authority only" | §2.18 + §12 — governance-tag authority |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §3 | "partner + director + senior manager only" | §2.18 + §12 — commercial-tag authority |

---

## §1 — What this Role-C lands (gap closure + evidence)

The Pass-1 VEP §8 declared **G-APISPEC + G-SCHEMADOC** as PRE-LAND (Role-C, post-deploy). Preconditions now met:
- **Migration run** by Walter as `pgadmin_vault` (2026-07-31).
- **Handler deployed** to `vaultgpt-func-projects` via run-from-package (`pkg-5a5270f`); all 19 functions register.
- **Golden-curl verified** (`az` bearer, audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`, as wmansfield@vault-tax.com — a partner): factual/commercial/governance/personnel → **201**; no-content/bad-tag/bad-uuid → **400**; unauth → **401**; absent project → **403** (fail-closed). C2–C4 (restricted tags → 201) confirm the OBO firm-role resolution + Tag Guard authority path executed end-to-end.

The contract/DDL wording below is taken from the deployed behaviour + the Codex-APPROVED migration, not invented.

## §2 — Exact verbatim doc edits (Codex applies byte-for-byte)

### Edit A — `spec/THEO_API_SPEC.md`: append §2.18
**Operation:** INSERT a new subsection immediately **before** the line `## §3 Boundary` (found exactly once), preserving one blank line above and below. No existing line changed.

Insert exactly this block:

```markdown
### §2.18 L1.5 Project Context write (Memory Architecture Stage-0 §7.2) — backs the engine's Tag Guard write-path

| Capability | Contract | Status | Backing |
|---|---|---|---|
| create a tagged L1.5 Project Context item (Tag Guard write-path) | `DEPLOYED` (L1.5-TagGuard, 2026-07-31; golden-verified): `POST /api/theo_create_project_context_item` on `vaultgpt-func-projects` — body `{ project_id (uuid), info_type, content, sharepoint_ref?, source_conversation_id? }` → **201** `{ data:{ item:{ id, project_id, info_type, content, sharepoint_ref, source_conversation_id, created_by, created_at, updated_at } }, meta }` (standard `{data,meta}` envelope). `info_type` ∈ `factual` \| `technical` \| `deliberative` \| `governance` \| `commercial` \| `personnel` (VAULT_MEMORY_ARCHITECTURE.md §3 information-types). Enforcement is the **Tag Guard** SECURITY DEFINER `theo_tag_guard_write_context_item` (schema §12): (1) project membership is required for EVERY write (the caller's `theo_project_effective_role` must be non-NULL, else **403**); (2) the three **restricted** tags carry a firm-role floor — `commercial` requires partner/director/senior_manager (vision §3, fixed); `governance` requires manager-and-above (sign-off authority); `personnel` requires director-and-above (need-to-know) — the latter two a tunable Vault policy value; `factual`/`technical`/`deliberative` need only membership. The caller's firm role is resolved IN THE HANDLER via the §7.1 delegated Graph **OBO** → `resolveFirmRole` path (byte-faithful mirror of the deployed `theo_get_my_role`, §2.17); an unresolved firm role (OBO failure / non-fee-earner) ⇒ **least-privileged** ⇒ restricted tags **403** (fail-closed, never a leak). Caller identity is the EasyAuth OID (`current_setting('request.jwt.claim.sub')` in the guard — never a parameter). `OPTIONS` → **204**. Validation before SQL: missing/blank `content`, unknown `info_type`, non-UUID `project_id`, or non-UUID `source_conversation_id` → **400 `INVALID_REQUEST`**; missing EasyAuth identity → **401 `UNAUTHORIZED`**; unauthorised tag / non-member → **403 `FORBIDDEN`**; absent project → **403** (indistinguishable from non-member — fail-closed, no existence leak); unexpected → **500** (`{error:{code,message,status,timestamp}}` envelope). Golden-curl verified 2026-07-31 (`az` bearer, audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`, as wmansfield@vault-tax.com — a partner): factual/commercial/governance/personnel → **201** (partner authorised for all restricted tags, confirming the OBO firm-role path); no-content/bad-tag/bad-uuid → **400**; unauth → **401**; absent project → **403**. Deployed run-from-package (`pkg-5a5270f`). Read access (through `theo_can_read`) is the separate §7.3 endpoint — this is the write-path only. | `1B-deployed` | Vault Memory Architecture **Stage-0 §7.2 L1.5 schema + Tag Guard** (`VAULT_MEMORY_ARCHITECTURE.md` §3 info-types + `Vault_Access_Policy_Engine_Stage0_Design` §4/§7 item 2); schema §12 (`theo_project_context_items` + `theo_tag_guard_write_context_item`); firm role via the §7.1 / §2.17 OBO `resolveFirmRole` in-process |
```

### Edit B1 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3: add the table row
**Operation:** INSERT one new table row immediately **after** the `theo_user_memory` row (the row ending `| DEPLOYED — B7a (§6) |`). No existing row changed.

Insert exactly this row:

```markdown
| `theo_project_context_items` | L1.5 Project Context item (Memory Architecture Stage-0 §7.2) | `project_id uuid NOT NULL` FK→`theo_projects` ON DELETE CASCADE, `info_type text NOT NULL` CHECK `IN ('factual','technical','deliberative','governance','commercial','personnel')` (vision §3), `content text NOT NULL` (non-empty), `sharepoint_ref text NULL` (Rule-5 hook), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, plus `id`/`created_by`/`created_at`/`updated_at` per §1. Ownership RLS + membership SELECT broadening; **writes go only through the Tag Guard** SECURITY DEFINER `theo_tag_guard_write_context_item` (§12). | DEPLOYED — L1.5 §12 |
```

### Edit B2 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md`: append new §12 section
**Operation:** APPEND at the END of the file (after the last line of §11), preserving one blank line before it.

Insert exactly this block:

```markdown
## §12 DEPLOYED DDL — L1.5 Project Context + Tag Guard (Memory Architecture Stage-0 §7.2, 2026-07-31)

**Status:** DEPLOYED against `vaultgpt-postgres-prod` (schema `public`; run by Walter as `pgadmin_vault` 2026-07-31). Golden-curl-verified end-to-end via the deployed `theo_create_project_context_item` handler on `vaultgpt-func-projects` (a partner writes factual/commercial/governance/personnel → 201; no-content/bad-tag/bad-uuid → 400; unauth → 401; absent project → 403 fail-closed).

**Canonical DDL (single source of truth):** `Codex Governance/Vault-L1_5-Schema-TagGuard-Stage0-7-2-Pass-1-VEP/l1_5_migration.sql` (Codex-APPROVED at `3525b68`; deployed by Walter). Additive + idempotent (`CREATE TABLE IF NOT EXISTS` / `CREATE OR REPLACE FUNCTION` / policy `IF NOT EXISTS` guards; **no top-level `BEGIN`/`COMMIT`** per Golden Handler §5.2). Not duplicated here.

**As-built specifics (Vault Memory Architecture Stage-0 §7.2 — the L1.5 Project Context substrate + Tag Guard write-path):** `theo_project_context_items` is the net-new L1.5 shared-project-memory table (information-typing is greenfield). Columns: `project_id uuid NOT NULL` FK→`theo_projects` ON DELETE CASCADE, `info_type text NOT NULL` CHECK `IN ('factual','technical','deliberative','governance','commercial','personnel')` (VAULT_MEMORY_ARCHITECTURE.md §3), `content text NOT NULL` (non-empty CHECK), `sharepoint_ref text NULL` (the Rule-5 SharePoint-Graph reachability hook, §7.4 — NULL = pure-DB item), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, plus `id`/`created_by`/`created_at`/`updated_at` per §1 (mutable). Three btree indexes (`project_id`; `project_id, info_type`; `created_by`). **RLS** (mirrors the §5 ownership baseline + the §11 membership SELECT-broadening): four `TO authenticated` policies — SELECT broadened to project membership (`created_by = auth.uid() OR project_id ∈ (creator ∪ member)`, the byte-for-byte §11 subquery), INSERT/UPDATE/DELETE bare `created_by = auth.uid()`. **Writes are never broadened via RLS** — the Functions connection role bypasses RLS, so write authority lives in the Tag Guard. **Tag Guard write-path (design §4):** `theo_tag_guard_write_context_item(p_project_id uuid, p_info_type text, p_content text, p_firm_role text, p_sharepoint_ref text DEFAULT NULL, p_source_conversation_id uuid DEFAULT NULL) RETURNS public.theo_project_context_items` — `LANGUAGE plpgsql SECURITY DEFINER SET search_path = public`, migration-role-owned, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated`. Caller OID from `current_setting('request.jwt.claim.sub')` (never a parameter). Enforcement order, fail-closed at every branch: authenticated (`28000`) → content present (`22023`) → tag present & known (`22023`) → caller is a project member via `theo_project_effective_role` (§10), else `42501` → **tag authority**: `commercial` requires firm role ∈ {partner,director,senior_manager} (vision §3, fixed); `governance` requires {partner,director,senior_manager,manager} (sign-off authority — tunable); `personnel` requires {partner,director} (need-to-know — tunable); `factual`/`technical`/`deliberative` need only membership; unauthorised → `42501`; an unresolved firm role (NULL) ⇒ restricted tags rejected (least-privileged) → INSERT (owner = caller). `p_firm_role` is passed IN (resolved in the handler from the §7.1 OBO source — firm role is not Postgres-resident). SQLSTATE→HTTP for the handler: `28000`→401, `42501`→403, `22023`→400, `P0002`→404 (+ handler `23503`→404 FK / `23514`→400 CHECK). **Read-only helper:** `theo_project_context_item_exists_unscoped(uuid) → boolean` (`LANGUAGE sql SECURITY DEFINER`; the §5 `_exists_unscoped` idiom) for the §7.3 read path's 403/404 discrimination. **No new elevated-read class** — the write authority is the function-gated idiom (§8/§9/§10); reads stay on the §2 ownership baseline + §11 membership branch. Boundary: net-new additive table + two functions; no `reporting_*` touched; no existing `theo_*` table/policy altered. Handler wiring (`theo_create_project_context_item` on func-projects, run-from-package `pkg-5a5270f`) is this same §7.2 package; read access (`theo_can_read`) is §7.3.
```

## §3 — Confirmations

- **Scope:** three additive insertions — API §2.18 (before §3 Boundary), schema §3 table row (after `theo_user_memory`), schema §12 (EOF). Zero edits to existing lines; no renumbering (§2.18 follows the current last §2.17; §12 follows the current last §11).
- **No code/schema/deploy** — the handler + migration are already live; this only records their contract + DDL.
- On Codex APPROVAL, Claude applies the three edits byte-faithfully and commits (verified-Role-C landing).
