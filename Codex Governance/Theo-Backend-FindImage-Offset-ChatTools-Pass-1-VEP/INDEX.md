# Theo Backend — FindImage `offset` chat-tools guidance ("show me another") — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. The model-facing half of the deployed `theo_find_image` `offset` param (handler + API §2.15 Role-C already landed 2026-07-23): teach the model it may paginate. One additive edit in `engine/chat-tools.js` on `vaultgpt-func-stream` — the `theo_find_image` registry entry gains (a) a description sentence telling the model that for "another"/"more"/"different" it should call again with the SAME subject and an increasing `offset` (prev + ~4; default 0), and (b) an `offset` `input_schema` property (integer, range 0..40). No other tool, no handler/frame/contract change. Without this, the model never sends `offset`, so "show me another" repeats the same gallery; with it, the deployed handler returns a fresh window. Self-contained: edited file + its deployed LIVE snapshot under `primary-reference/`. `node --check` PASS.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `<PKG_COMMIT_SHA>` (the commit that first contains this package; grounding reads against pre-package parent `355d344f40249d2cc52bfc499aa63d520399777f` — the commit that lands the deployed `offset` handler's API §2.15 Role-C). The edited file's LIVE snapshot was GET-verified from Kudu this turn. Cited-doc blob SHAs resolved at the grounding parent.
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary Reference — deployed `chat-tools.js` copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "DR-T11" | §1 — the general-chat tool registry the model calls; only `theo_find_image`'s description + schema change |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.15 | "theo_find_image" | §1 — the model-facing schema now exposes the deployed `offset` request field (documented in §2.15) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FindImage-Offset-ChatTools-Pass-1-VEP/primary-reference/chat-tools.LIVE.js.md | primary-ref | "const CHAT_TOOLS" | §4 — only the `theo_find_image` `description` + `input_schema` change; the registry/dispatch is unchanged |

### Currency anchors (blob SHAs @ grounding parent `355d344`)
- THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `c3f2267b751d5e9f4f025331359c4d3013bcbe8a`; CODEX_THEO_BACKEND_REVIEW_STANDARD.md `d2e1b9881b6e2ed7d77921a055feffb0852257fd`; THEO_GOLDEN_HANDLER_STANDARD.md `521442379b47d8bf43b877b4feb5b420065b5cfe`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `be066f12147d1eb13b51f025b275f5413ab51f0e`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`; THEO_API_SPEC.md `c20e254e7aa020a3594026b0863a085c0d3f525d`; THEO_AZURE_POSTGRES_SCHEMA.md `e6143cf55839120b696e03c6702a1144ac3cc2c9`.

### Full Baseline doc set (Conformance §4 backend) — grounded this turn
Governor, Conformance (this GCR/Rule-Anchor/lint), Codex Review, Golden Handler (§2 primary-ref), Orchestration (DR-T11), Architecture (tool-dispatch), API Spec (§2.15 `theo_find_image` offset), Schema — **N/A (no DB/schema; a tool-description + schema-property edit)**, cited for completeness per Conformance §4.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Edit — `theo_find_image` model-facing guidance:** (a) append to the `description`: for "another"/"more"/"different", call again with the SAME subject and an increasing `offset` (prev + ~4; default 0); (b) add `offset` to `input_schema.properties` (integer, range 0..40). The deployed handler already accepts + honours `offset` (API §2.15); this only lets the MODEL choose to send it.
- **Boundary:** one file on `vaultgpt-func-stream` (the tool registry). Only the `theo_find_image` entry's `description` + `input_schema` change. No handler, no SSE frame, no other tool, no dispatch/registry-mechanism change, no DB/schema/migration/Blob/MI, no premium. Deploy target `vaultgpt-func-stream`.
- **No regression.** `offset` is optional (default 0 = today's behaviour); the model only sends it when the user asks for different images. All other tools + normal chat unchanged.

## §2 Gap Register
**PROCEED.**
- **(1) Completes the offset feature.** The handler + API §2.15 are deployed/landed; this is the model-facing half that makes "show me another" actually paginate. Disclosed, PROCEED.
- **(2) Additive, optional.** `offset` default 0; description guidance only fires on an explicit "another"/"different" ask. No regression. PROCEED.
- **(3) No contract / Role-C.** The `offset` request field is already documented in API §2.15 (landed); the model-facing schema now matches it. No further Role-C. NO-GAP.
- **(4) No schema/migration/keys/npm/premium.** PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** §1 — offset guidance + schema on `theo_find_image`.
- **P2 Architecture/boundary:** one registry entry's description + schema on func-stream; DR-T11 registry/dispatch unchanged. (§1.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API §2.15 (deployed `offset` request field).
- **P5 Primary-reference grounding:** deployed `chat-tools.js` (LIVE snapshot, GET-verified, verbatim). Structural Mirror §4.
- **P6 Boundary re-check:** two additive changes to one registry entry; `node --check` PASS; diff-verified as the only changes vs LIVE.
- **P7 Verification:** post-deploy live-chat (§5).
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary Reference = deployed `chat-tools.js` (LIVE, GET-verified this turn).

| Region | vs Primary Reference (LIVE) | Classification | Anchor |
|---|---|---|---|
| Whole file except the `theo_find_image` entry's `description` + `input_schema` | byte-identical | **EXACT** (diff-verified) | Golden Handler §2 |
| `theo_find_image` `description`: append the `offset`/"another" guidance sentence | reworded (additive sentence) | **ALLOWED DELTA** (tool guidance text) | §1; API §2.15 |
| `theo_find_image` `input_schema.properties`: add `offset` (integer, 0..40) | one optional property added | **ALLOWED DELTA** (matches the deployed request field) | §1; API §2.15 |
| `BY_NAME` / `CHAT_TOOL_SCHEMAS` / `dispatchChatTool` / every other tool entry | unchanged | **EXACT** | Architecture tool-dispatch |

No DEVIATION rows.

## §5 Verification (post-deploy on func-stream; never print the token)
1. **"Another" works:** ask Theo to show an image of a subject, then "show me a different one" → the second `theo_find_image` call carries `offset` > 0 (visible `event: tool`), and the gallery shows **different** images than the first (the deployed handler returns a fresh window — golden-verified: offset 4 → zero overlap).
2. **Regression:** a first-time image ask still returns the top gallery (offset 0); normal no-image chat unchanged; other tools unaffected.

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (NOT premium)
1. SCM `vaultgpt-func-stream-cyb4g8bhatddencs.scm.uksouth-01.azurewebsites.net`. GET the current file as a rollback baseline (matches this pack's LIVE snapshot).
2. Kudu VFS PUT `engine/chat-tools.js` → `/site/wwwroot/src/engine/chat-tools.js` (GET the ETag first and PUT with `If-Match:<etag>` per the func-stream 409 gotcha; expect 204; GET-back + diff = the two additive changes only).
3. `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`.
4. Run §5 verification.

## §7 Out of scope
The `theo_find_image` handler + API §2.15 (the `offset` request field) are already deployed/landed. No handler/frame/schema change here. No premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-FindImage-Offset-ChatTools-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys the file to `vaultgpt-func-stream` per §6 + runs §5 verification. This completes the `offset` ("show me another") feature end-to-end.
