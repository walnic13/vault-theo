# Vault Orchestrated Engine (Stage-0 §7.4) — API-Spec §2.19 — Pass-4 Role-C

Documentation-update (Role-C) handoff closing the **G-APISPEC PRE-LAND gap** from the Codex-APPROVED Pass-1 VEP ([[Vault_Orchestrated_Engine_Stage0_7_4_VEP.md]], commit `5f16a74`). `theo_get_project_context_item` is **DEPLOYED to `vaultgpt-func-projects`** (run-from-package `pkg-cd596a9`) and **golden-curl-verified** (9/9). Per deploy→document ordering this Role-C records the contract. **Documentation-only — no code/schema/deploy.** One additive edit: a new `### §2.19` inserted before `## §3 Boundary`. No existing line modified.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Role-C documentation update (API-Spec §2 row; deploy→document, post-verified)
Grounding parent (source baseline): `5f16a745bc53dd566251c8d875282bec0f61d119` (vault-theo, `development`) — the commit carrying the Codex-APPROVED Pass-1 VEP; currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | CONTRACT TRUTH (edit target) — `spec/THEO_API_SPEC.md` (§2 Contract Surface; §2.18 L1.5-write sibling format mirrored; `## §3 Boundary` = insertion anchor) | `grep`(§2.18 + §3 anchor) this turn | `758cf1e172d0e6abd86ee3aedf275a05aff9266c` |
| 2 | APPROVED PASS-1 VEP (defines the endpoint + golden curls) — `Codex Governance/Vault-Orchestrated-Engine-Stage0-7-4-Pass-1-VEP/Vault_Orchestrated_Engine_Stage0_7_4_VEP.md` | Codex-APPROVED (approval commit `5f16a74`); §1/§6/§7 re-read this turn | `d6f42e770734e0f62a2d8bbdc5c05d1f21b659d3` |
| 3 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1D ordered pass — deploy precedes the API Role-C) | `Grep("ordered, non-skippable")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| spec/THEO_API_SPEC.md | §2 | "## §2 Contract Surface (1A) → Deployed Endpoints (1B)" | Edit — §2.19 appended to §2 |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1D | "ordered, non-skippable" | deploy→document ordering: §2.19 added only AFTER deploy + golden curls |

---

## §1 — What this Role-C lands (gap closure + evidence)

The Pass-1 VEP §8 declared **G-APISPEC** as PRE-LAND. Preconditions met:
- **Deployed** to `vaultgpt-func-projects` via run-from-package (`pkg-cd596a9`); 20 functions register.
- **Golden-curl verified** (9/9; `az` bearer, audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`, as wmansfield@vault-tax.com — a partner): read own factual/commercial → **200** (theo_can_read positive path); random uuid → **404**; bad uuid → **400**; unauth → **401**; a bogus `sharepoint_ref` → **403** (Rule-5 probe executed → unreachable → deny); `room_oids:[<non-member>]` → **403** (membership lowest-participant); `room_oids:[<self>]` → **200**; `room_oids:[<bad uuid>]` → **400**.

The row wording is taken from the deployed behaviour + the approved VEP, not invented.

## §2 — Exact verbatim doc edit (Codex applies byte-for-byte)

**Target file:** `spec/THEO_API_SPEC.md`
**Operation:** INSERT a new subsection immediately **before** the line `## §3 Boundary` (found exactly once), preserving one blank line above and below. No existing line changed.

Insert exactly this block:

```markdown
### §2.19 Access-policy engine read (Memory Architecture Stage-0 §7.4) — the orchestrated `canRead` composition

| Capability | Contract | Status | Backing |
|---|---|---|---|
| read a single L1.5 Project Context item through the composed access-policy engine | `DEPLOYED` (Orchestrated-Engine, 2026-08-01; golden-verified 9/9): `POST /api/theo_get_project_context_item` on `vaultgpt-func-projects` — body `{ item_id (uuid), room_oids? (uuid[]) }` → **200** `{ data:{ item:{ id, project_id, info_type, content, sharepoint_ref, source_conversation_id, created_by, created_at, updated_at } }, meta }` (standard `{data,meta}` envelope). This is the single composed read decision (Amendment 1 — "no read path implements its own access logic"): (1) resolves the caller's firm role via delegated Graph **OBO** (`/users/{callerOid}?$select=jobTitle` → `resolveFirmRole`, §2.17/§7.1); (2) calls the deployed SECURITY DEFINER **`theo_can_read`** (schema §13 — L1.5 membership × info-type firm-role floor × the Rule-3 **membership** lowest-participant filter over `room_oids`); (3) **Rule 5 (app layer):** if the item carries a `sharepoint_ref` (format `drives/{driveId}/items/{itemId}`), a bounded OBO Graph **reachability probe** (metadata GET of the drive item) — 2xx allows, any 401/403/404/**timeout**/error **denies** (fail-closed, 5 s cap); a NULL ref skips it; (4) **Rule-3 firm-role dimension (app layer):** for a room context, the LEAST-privileged OTHER participant must also clear the item's info-type floor (per-participant Graph `jobTitle`; an unresolvable participant ⇒ least-privileged ⇒ deny). Strict-AND across all four; the item is returned only if EVERY gate allows. The room firm-role floors (`commercial` ≥ senior_manager, `governance` ≥ manager, `personnel` ≥ director) are **one policy** with the §7.2 Tag Guard + §7.3 classifier. Caller identity = the EasyAuth OID (`current_setting('request.jwt.claim.sub')` inside `theo_can_read`, never a parameter). `OPTIONS` → **204**. Missing EasyAuth identity, or no bearer for the OBO exchange → **401 `UNAUTHORIZED`**; non-UUID `item_id`, non-array/oversized (>50) `room_oids`, or a non-UUID room participant → **400 `INVALID_REQUEST`**; access denied (`theo_can_read` false with the item present, or an unreachable `sharepoint_ref`, or a room participant below the floor) → **403 `FORBIDDEN`**; item absent (`theo_project_context_item_exists_unscoped` false) → **404 `NOT_FOUND`**; unexpected → **500** (`{error:{code,message,status,timestamp}}` envelope). Reads only the deployed `theo_project_context_items` row (Functions role bypasses RLS) AFTER the classifier allows; no write. Golden-curl verified 2026-08-01: read-own factual/commercial → 200; random uuid → 404; bad uuid → 400; unauth → 401; bogus `sharepoint_ref` → 403 (Rule-5 probe executed); `room_oids:[<non-member>]` → 403; `room_oids:[<self>]` → 200; `room_oids:[<bad uuid>]` → 400. Deployed run-from-package (`pkg-cd596a9`). This is the reference composition future read handlers adopt (incremental migration of existing reads onto `canRead` is follow-on, design §7 item 4). | `1B-deployed` | Vault Memory Architecture **Stage-0 §7.4 orchestrated engine** (`Vault_Access_Policy_Engine_Stage0_Design` §3.2/§3.3); composes `theo_can_read` (schema §13) + `theo_project_context_item_exists_unscoped` (schema §12) + delegated Graph OBO (caller + participant `jobTitle`; drive-item reachability); mirrors `theo_list_project_knowledge` / `theo_get_my_role` (§2.17) / `dms_resolve_item` |
```

## §3 — Confirmations

- **Scope:** one additive subsection (§2.19); zero edits to existing lines; no renumbering (§2.19 follows the current last §2.18).
- **No code/schema/deploy** — the handler is already live; this only records its contract.
- On Codex APPROVAL, Claude applies the edit byte-faithfully and commits (verified-Role-C landing).
