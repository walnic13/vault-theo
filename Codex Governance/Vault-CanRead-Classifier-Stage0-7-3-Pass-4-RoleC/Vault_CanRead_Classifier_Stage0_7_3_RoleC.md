# Vault `theo_can_read` (Stage-0 §7.3) — Schema-doc §13 — Pass-4 Role-C

Documentation-update (Role-C) handoff closing the **G-SCHEMADOC PRE-LAND gap** from the Codex-APPROVED Pass-1 VEP ([[Vault_CanRead_Classifier_Stage0_7_3_VEP.md]], commit `7261693`). The migration is **run** (Walter, `pgadmin_vault`, 2026-08-01) and `theo_can_read` is **catalog-verified + fail-closed-functionally-verified** read-only. Per deploy→document ordering this Role-C records the DDL. **Documentation-only — no code/schema/deploy.** One additive edit: a new `## §13` appended at EOF of the schema doc. No existing line modified. (No API-Spec edit — the classifier has no endpoint; it is exercised by the §7.4 handler, documented then.)

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Role-C documentation update (Schema-doc §13; deploy→document, post-verified)
Grounding parent (source baseline): `726169334583f5131c0b5d8c0d28ca90ac7fcdc9` (vault-theo, `development`) — the commit carrying the Codex-APPROVED Pass-1 VEP; currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | SCHEMA TRUTH (edit target) — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5–§12 DEPLOYED-DDL section format mirrored; §10 `theo_project_effective_role`; §11 `theo_conversation_access`; §12 `theo_project_context_items`; EOF = §13 insertion) | `Read`(§10/§11/§12 + tail) this turn | `feed798726983da4def5400ace806a885aa83469` |
| 2 | APPROVED PASS-1 VEP (defines the function + verification) — `Codex Governance/Vault-CanRead-Classifier-Stage0-7-3-Pass-1-VEP/Vault_CanRead_Classifier_Stage0_7_3_VEP.md` | Codex-APPROVED (approval commit `7261693`); §1–§6 re-read this turn | `4a25e9b4abd3a742bef66dd605132613f03cf9e1` |
| 3 | CANONICAL DDL — `Codex Governance/Vault-CanRead-Classifier-Stage0-7-3-Pass-1-VEP/theo_can_read_migration.sql` (the deployed function body the §13 entry describes) | `Read`(full) this turn | `aad2d6f66effdbb472fa8db83d7603432ecde59b` |
| 4 | Stage-0 DESIGN — `Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md` (§3.1 signature/semantics) | Codex-APPROVED (`33f5655`); §3.1 this turn | `0e6779235c9b39935c4e63688f06a27ae92a8175` |
| 5 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 6 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1D ordered pass — deploy precedes schema Role-C) | `Grep("ordered, non-skippable")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §12 | "DEPLOYED DDL — L1.5 Project Context + Tag Guard" | the §12 section this §13 follows |
| Codex Governance/Vault-Access-Policy-Engine-Stage0-Design-Pass-1-VEP/Vault_Access_Policy_Engine_Stage0_Design.md | §3.1 | "never a parameter" | §13 — caller from the JWT claim, never a parameter |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1D | "ordered, non-skippable" | deploy→document ordering: §13 added only AFTER the Walter-run migration + verification |

---

## §1 — What this Role-C lands (gap closure + evidence)

The Pass-1 VEP §7 declared **G-SCHEMADOC** as PRE-LAND (Role-C, post-migration). Preconditions met:
- **Migration run** by Walter as `pgadmin_vault` (2026-08-01).
- **Catalog-verified** (read-only, via the codex_reporting_ro read path on the shared instance): `theo_can_read` present, `prosecdef = t`, `search_path=public`, exact 6-arg signature `(text, text, uuid, uuid, text, text[])`, ACL `authenticated=X/pgadmin_vault` (EXECUTE to authenticated + owner, not PUBLIC).
- **Fail-closed functional** (read-only, RLS-independent): `theo_can_read('L2'|'L3', …)` → false (reserved); L1/L1.5 not-found → false; null caller → false. The positive path (owner/member reads + info-type floor matrix) needs the authenticated-role RLS visibility to seed fixtures and is exercised end-to-end by the §7.4 handler (documented in the VEP §6).

The §13 wording is taken from the deployed function + the Codex-APPROVED migration, not invented.

## §2 — Exact verbatim doc edit (Codex applies byte-for-byte)

**Target file:** `spec/THEO_AZURE_POSTGRES_SCHEMA.md`
**Operation:** APPEND a new `## §13` section at the END of the file (after the last line of §12), preserving one blank line before it. No existing line changed.

Insert exactly this block:

```markdown
## §13 DEPLOYED DDL — Access-Policy Engine READ Classifier (Memory Architecture Stage-0 §7.3, 2026-08-01)

**Status:** DEPLOYED against `vaultgpt-postgres-prod` (schema `public`; run by Walter as `pgadmin_vault` 2026-08-01). Read-only-verified (catalog): `theo_can_read` present, `prosecdef = t`, `SET search_path = public`, 6-arg signature `(text, text, uuid, uuid, text, text[]) RETURNS boolean`, EXECUTE granted to `authenticated` (and owner `pgadmin_vault`), not `PUBLIC`. Fail-closed branches functionally verified read-only (L2/L3 reserved, L1/L1.5 not-found, null-caller → all false); the positive path (owner/member reads + the info-type floor matrix) is exercised end-to-end by the §7.4 handler (the classifier's item reads are RLS-independent — SECURITY DEFINER — but the authenticated-role RLS visibility needed to seed positive fixtures belongs to the handler).

**Canonical DDL (single source of truth):** `Codex Governance/Vault-CanRead-Classifier-Stage0-7-3-Pass-1-VEP/theo_can_read_migration.sql` (Codex-APPROVED at `7261693`; deployed by Walter). Additive `CREATE OR REPLACE FUNCTION` only; idempotent + reversible (commented `DROP FUNCTION` footer); no top-level `BEGIN`/`COMMIT` (Golden Handler §5.2). Read-only verification `…/theo_can_read_verify.sql`. Not duplicated here.

**As-built specifics (Vault Memory Architecture Stage-0 §7.3 — the DB half of the access-policy engine):** `public.theo_can_read(p_item_layer text, p_item_type text, p_item_id uuid, p_project_id uuid, p_firm_role text, p_room_oids text[]) RETURNS boolean` (design §3.1) — `LANGUAGE plpgsql SECURITY DEFINER SET search_path = public`, migration-role-owned, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated`. The single audited "may the caller read this item?" for the DB-knowable dimensions. Caller OID from `current_setting('request.jwt.claim.sub', true)` (never a parameter); `p_item_type`/`p_project_id` are ADVISORY — the authoritative type/project are read from the row. RETURNS **boolean** (false = deny; NO RAISE — mirrors `theo_conversation_access`); the calling handler discriminates 403/404 via `theo_project_context_item_exists_unscoped` / `theo_conversation_exists_unscoped`. Semantics: **L1** (`theo_user_memory`, scope='user') → allow iff `created_by = caller` (Rule 1 inviolable). **L1.5** — for a `theo_project_context_items` row: the owner always; else project membership (`theo_project_effective_role` §10 non-NULL) AND the info-type firm-role floor (**ONE POLICY** with the §7.2 Tag Guard: commercial = partner/director/senior_manager, fixed; governance = manager-and-above; personnel = director-and-above; factual/technical/deliberative = membership); if the id is not a context item it falls back to `theo_conversation_access` (§11) for the published-conversation L1.5 kind. **Both** L1.5 kinds then converge on the Rule-3 **lowest-participant membership** filter: with `p_room_oids`, every room participant must also be a project member (else deny — do not surface). **L2/L3** → reserved (fail-closed/deny until their schemas land). Fail-closed everywhere: NULL caller / not-found / unresolved firm role (restricted tags) / no-match → false. **Absorbs** `theo_project_effective_role` (§10) + `theo_conversation_access` (§11) as helpers (design Amendment 1 — one audited read home); introduces **no new table** and alters no existing object. The app-layer composition — the Rule-5 SharePoint-Graph reachability probe AND the firm-role lowest-participant filter over OTHER participants (their roles are not PG-resident) — is the §7.4 orchestrated engine. Boundary: net-new additive function; reads only deployed `theo_*` tables; no `reporting_*` touched.
```

## §3 — Confirmations

- **Scope:** one additive section (§13) at EOF. Zero edits to existing lines; no renumbering (§13 follows the current last §12).
- **No code/schema/deploy** — the function is already live; this only records its DDL. No API-Spec change (no endpoint).
- On Codex APPROVAL, Claude applies the edit byte-faithfully and commits (verified-Role-C landing).
