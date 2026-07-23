# Theo Backend — conversation Star (starred flag + set handler + list field) — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. Backend for the chat "Star" menu item (Walter-directed 2026-07-23; the paired FE chat-header menu is a follow-on `vault-theo` FE VEP). Three parts on `vaultgpt-func-premium` (the monolith that hosts the deployed Theo conversation handlers): (1) **migration** — additive `theo_conversations.starred boolean NOT NULL DEFAULT false` (**run by Walter** — write SQL is Walter-only; provided as a runnable `.sql`); (2) **new handler `theo_set_conversation_starred`** `{ conversation_id, starred }` — owner-scoped star toggle mirroring `theo_set_conversation_project`; (3) **`theo_list_conversations`** returns `starred` (one column added to the SELECT; rows are returned raw). **Premium deploy is the Walter-authorized exception (2026-07-23) to the standing "don't touch premium" rule (2026-07-22)**, scoped to this Star work; deploy is surgical (Kudu VFS overwrite + GET-back diff + golden-curl, rollback-ready). Star deliberately does **not** bump `updated_at` (metadata, not activity — so it never re-orders Recents). `node --check` PASS on both handlers.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `344243e00e84421261eb17f10174c7248a4eb926` (the commit that first contains this package; grounding parent `d347cb3dacc7d3528beaa0f637fa885667c1e566`). The two edited/mirrored handlers' LIVE snapshots were GET-verified from `vaultgpt-func-premium` Kudu this turn (the deployed Theo conversation handlers are confirmed present on premium: `theo_list_conversations`/`theo_set_conversation_project`/etc. all resolve on premium VFS). Cited-doc blob SHAs resolved at the grounding parent.
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary References — deployed `theo_set_conversation_project` + `theo_list_conversations` copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "as the signed-in user" | §4 — EasyAuth OID gate (401) + owner-scoped `created_by = $oid` predicate on the UPDATE |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — `{ conversation_id, starred }` envelope; `theo_list_conversations` gains `starred` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "theo_list_conversations" | §1 — the list response gains `starred`; the new set-starred endpoint sits in this family (Role-C at Pass-3) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §theo_conversations | "theo_conversations" | §1 — additive `starred boolean NOT NULL DEFAULT false` column (Schema Role-C at Pass-3) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-Conversation-Star-Pass-1-VEP/primary-reference/theo_set_conversation_project.DEPLOYED.index.js.md | primary-ref | "function getPrincipal(req)" | §4 — Family-B helpers + pool + `isUuid` reused byte-identical from the deployed sibling |

### Currency anchors (blob SHAs @ grounding parent `d347cb3`)
- THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `c3f2267b751d5e9f4f025331359c4d3013bcbe8a`; CODEX_THEO_BACKEND_REVIEW_STANDARD.md `d2e1b9881b6e2ed7d77921a055feffb0852257fd`; THEO_GOLDEN_HANDLER_STANDARD.md `521442379b47d8bf43b877b4feb5b420065b5cfe`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `be066f12147d1eb13b51f025b275f5413ab51f0e`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`; THEO_API_SPEC.md `c20e254e7aa020a3594026b0863a085c0d3f525d`; THEO_AZURE_POSTGRES_SCHEMA.md `e6143cf55839120b696e03c6702a1144ac3cc2c9`.

### Full Baseline doc set (Conformance §4 backend) — grounded this turn
Governor, Conformance (this GCR/Rule-Anchor/lint), Codex Review, Golden Handler (§2 primary-ref, §3 signed-in-user, §4 shape), Orchestration (deploy home), Architecture (tool-dispatch), API Spec (§2.1 conversation family), **Schema (§theo_conversations — the additive column)**. All cited.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Migration (Walter runs):** `ALTER TABLE public.theo_conversations ADD COLUMN IF NOT EXISTS starred boolean NOT NULL DEFAULT false;` (`migration_theo_conversations_starred.sql`). Additive, idempotent, backfills existing rows to `false`. Write SQL → Walter-only.
- **New handler `theo_set_conversation_starred`:** `POST { conversation_id (uuid), starred (boolean) }` → **200** `{ data:{ conversation_id, starred } }`. Owner-scoped `UPDATE public.theo_conversations SET starred = $1 WHERE id = $2 AND created_by = $3 RETURNING starred`; 0 rows → 403 (existing-foreign) / 404 (absent) via `theo_conversation_exists_unscoped`. Mirrors `theo_set_conversation_project` (Family-B helpers + pool + `isUuid` byte-identical); drops the project-access check + the set-once guard (star is a free toggle); **does NOT bump `updated_at`** (star is metadata — must not re-order the last-touched Recents sort). Validation: 401 no OID, 400 bad JSON / non-uuid `conversation_id` / non-boolean `starred`.
- **`theo_list_conversations`:** add `starred` to the SELECT column list (after `last_opened_at`); rows are returned raw, so `starred` flows into `{ conversations: [...] }`. ORDER BY unchanged.
- **Boundary:** `vaultgpt-func-premium` (the deployed Theo-conversation-handler home). One new function dir + one one-line edit to an existing handler + one additive column. No other handler, no Blob/MI, no `reporting_*`. **Premium deploy = Walter-authorized exception (2026-07-23)** to the 2026-07-22 "don't touch premium" rule, scoped to this work; surgical VFS + GET-back + golden-curl + rollback-ready.
- **Paired FE (out of scope):** the chat-header title + dropdown menu (Rename/Add-to-project/Delete/**Star**) is a follow-on `vault-theo` FE VEP grounding on this deployed contract.

## §2 Gap Register
**PROCEED.**
- **(1) Premium deploy — Walter-authorized this turn.** Explicit grant 2026-07-23, scoped to the Star work; supersedes the 2026-07-22 standing rule for this package only. Surgical + rollback-ready. Disclosed, PROCEED.
- **(2) Migration is Walter-run.** Provided as a runnable idempotent `.sql`; Walter executes before the handler deploy (the list handler's `starred` SELECT + the set-starred UPDATE require the column). Sequenced in §6. PROCEED.
- **(3) Star does not bump `updated_at`.** Deliberate — starring is metadata, not activity; the UPDATE sets only `starred`, so Recents (last-touched order) is unaffected. Disclosed, PROCEED.
- **(4) Role-C (API §2.1 + Schema).** After the golden curls: API Spec §2.1 (`starred` in the list response + the new `theo_set_conversation_starred` endpoint) + Schema §theo_conversations (the additive column). PROCEED.
- **(5) Helpers byte-identical.** Family-B + pool + `isUuid` reused verbatim from `theo_set_conversation_project` (diff-verified). §4. PROCEED.
- **(6) No premium package churn.** Surgical VFS PUT of the one new dir + the one edited file; `node_modules`/other handlers untouched. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1 Feature:** §1 — starred column + set handler + list field.
- **P2 Architecture/boundary:** premium; one new handler + one one-line list edit + one column; owner-scoped RLS idiom. (§1.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API §2.1 (conversation family; list shape); Schema §theo_conversations (the column).
- **P5 Handler grounding:** Primary References = deployed `theo_set_conversation_project` + `theo_list_conversations` (LIVE snapshots, GET-verified from premium, verbatim). Structural Mirror §4.
- **P6 Boundary re-check:** new handler (helpers EXACT, new owner-scoped UPDATE body) + `+ starred` in the list SELECT; `node --check` PASS on both; migration additive/idempotent.
- **P7 Golden curls:** §5 (post-deploy, after the migration).
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary References = deployed `theo_set_conversation_project` + `theo_list_conversations` (LIVE, GET-verified this turn).

| Region | vs Primary Reference (LIVE) | Classification | Anchor |
|---|---|---|---|
| `theo_set_conversation_starred`: Family-B helpers + `pool` + `send`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid` | byte-identical to `theo_set_conversation_project` (diff-verified: the file prefix through `isUuid`) | **EXACT** | Golden Handler §2 |
| `theo_set_conversation_starred` `module.exports` | owner-scoped set-field mirroring the sibling: OID gate (401), `conversation_id` uuid + `starred` boolean validation (400), `SET starred` UPDATE, exists-unscoped 403/404; **drops** the project-access check + set-once guard + the `updated_at` bump | **ALLOWED DELTA** (the star toggle) | Golden Handler §3/§4 |
| `theo_list_conversations`: add `starred` to the SELECT column list | one column added; rows returned raw; ORDER BY / filters / everything else unchanged | **ALLOWED DELTA** (additive response field) | Golden Handler §4 + API §2.1 |
| `function.json` (new handler) | mirrors `theo_set_conversation_project`'s binding, route renamed `theo_set_conversation_starred` | **ALLOWED DELTA** (endpoint name) | Golden Handler §4 |
| migration | additive `starred` column, idempotent | **ALLOWED DELTA** (additive schema) | Schema §theo_conversations |

No DEVIATION rows.

## §5 Golden Curls (run by Claude Code post-deploy against `vaultgpt-func-premium`, after Walter's migration; never print the token)
Auth: `TOKEN=$(az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e --query accessToken -o tsv)`.
1. **Unauth** → `401`. **`{}`** → `400`. **Non-boolean starred** `{conversation_id:<uuid>, starred:"yes"}` → `400`. **Bad uuid** → `400`.
2. **Star a real owned conversation** `{ conversation_id:<own>, starred:true }` → **200** `{ data:{ conversation_id, starred:true } }`; **unstar** `{…, starred:false }` → `starred:false`.
3. **List reflects it:** `GET /api/theo_list_conversations` → the target row now carries `"starred": true/false` matching the toggle.
4. **Recency unaffected:** starring does NOT move the conversation in the list order (no `updated_at` bump) — confirm its position is unchanged after a star toggle.
5. **Not-owned / absent** `conversation_id` → `403` / `404`.

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-premium` (Walter-authorized exception)
1. **Walter runs the migration FIRST:** `migration_theo_conversations_starred.sql` against `vaultgpt-postgres-prod` (additive, idempotent). Confirm the column exists before the handler deploy.
2. SCM `vaultgpt-func-premium-a7agb7f5a8d8eeet.scm.uksouth-01.azurewebsites.net`. **New dir:** PUT `handlers/theo_set_conversation_starred/` (trailing slash) then `index.js` + `function.json` (expect 201). **Edit:** GET current `theo_list_conversations/index.js` as rollback baseline (matches this pack's LIVE snapshot), then PUT the `+ starred` version (`If-Match:*`; expect 204; GET-back + diff = the one-line change only).
3. `az functionapp restart -n vaultgpt-func-premium -g Vault-Tax`. Confirm the other `theo_*` handlers still load (unauth probe → 401, not 500).
4. Run §5 golden curls. Never print the token.
5. On green, Role-C: API §2.1 (`starred` in list + new endpoint) + Schema §theo_conversations (the column). Then the paired FE chat-header VEP.

## §7 Out of scope
The FE chat-header title + dropdown menu (Rename/Add-to-project/Delete/Star) — follow-on `vault-theo` FE VEP. "Mark as unread" (no read/unread model — deferred/declined). Add-to-project move/remove (the deployed set-once handler is unchanged). No `reporting_*`. No Blob/MI.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-Conversation-Star-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED: Walter runs the migration; Claude Code Kudu-deploys the new handler + the list edit to `vaultgpt-func-premium` (Walter-authorized) + runs the §5 golden curls; then the API §2.1 + Schema Role-C, then the paired FE chat-header VEP.
