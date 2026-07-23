# Theo Backend — FindImage Inline Display (`event: vault_image`) — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. Makes `theo_find_image` display **reliably**. Today the model must transcribe the returned image URL into a markdown `![](url)`; it does so correctly for short/clean URLs (Wikipedia "golden retriever" rendered) but **mangles long / percent-encoded ones** — e.g. a Nadal URL containing `%282%29` is emitted by the model as literal `(2)`, whose `)` terminates the markdown link early → broken-image icon (observed live 2026-07-23). Fix (Walter-chosen **Option A**): render the image **directly from the tool result**, mirroring the existing `event: vault_export` download-card mechanism, so the model never transcribes the URL. Two coordinated files on **`vaultgpt-func-stream`**: (1) `functions/theo_message_stream.js` — emit `event: vault_image` from a `theo_find_image` tool result (one additive block next to the `vault_export` emission); (2) `engine/chat-tools.js` — update the `theo_find_image` description so the model knows the app shows the image automatically and **must not** emit a markdown image or paste the URL. Self-contained: both edited files + their deployed LIVE snapshots under `primary-reference/`. The paired **FE** VEP (render the `vault_image` frame) is separate and **deploys first** (§2/§6 sequencing).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `<PKG_COMMIT_SHA>` (the commit that contains this package; grounding reads against pre-package parent `8f7112d6e363fd8aa0e1e2f70f290076675a8b9e`). Cited-doc blob SHAs below are HEAD-stable.
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary References — deployed `theo_message_stream.js` + `chat-tools.js` copied verbatim (full, no ellipsis) under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — the new `event: vault_image` SSE frame `{ url, title, source, pageUrl, license, creator }` mirrors the `event: vault_export` frame shape |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "DR-T11" | §1 — the general-chat tool-loop that dispatches `theo_find_image` + emits the SSE frame |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | tool-dispatch | "tool-dispatch" | §1 — the loop dispatches the tool then side-emits an app SSE frame from the result |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "event: vault_export" | §1/§4 — the new `event: vault_image` frame is modelled exactly on the existing `event: vault_export` download-card frame documented in §2.1 |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FindImage-InlineDisplay-Pass-1-VEP/primary-reference/theo_message_stream.LIVE.js.md | primary-ref | "event: vault_export" | §4 — the `vault_image` block is inserted immediately after this `vault_export` emission, same idiom |

### Currency anchors (blob SHAs @ HEAD `8f7112d`)
- THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `c3f2267b751d5e9f4f025331359c4d3013bcbe8a`; CODEX_THEO_BACKEND_REVIEW_STANDARD.md `d2e1b9881b6e2ed7d77921a055feffb0852257fd`; THEO_GOLDEN_HANDLER_STANDARD.md `8fbd67665e4fe01056ce79641cdd0c7194762e31`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `be066f12147d1eb13b51f025b275f5413ab51f0e`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`; THEO_API_SPEC.md `39aac571f29f94ebfb468902b41a0bb8d2c80329`; THEO_AZURE_POSTGRES_SCHEMA.md `e6143cf55839120b696e03c6702a1144ac3cc2c9`. (Both THEO_GOLDEN_HANDLER_STANDARD.md and THEO_API_SPEC.md were updated by the FindImage Role-C landed at HEAD 8f7112d — their SHAs above are resolved AT 8f7112d; the §2.1 `event: vault_export` clause and Golden Handler §2/§4 clauses are unchanged by that Role-C.)

### Full Baseline doc set (Conformance §4 backend) — grounded this turn
Governor (deploy/authority), Conformance (this GCR/Rule-Anchor/lint), Codex Review, Golden Handler (§2 primary-ref, §4 shape), Orchestration (DR-T11 tool-loop), Architecture (tool-dispatch), API Spec (§2.1 SSE-frame contract; §2.15 theo_find_image), Schema — **N/A (no DB/schema/migration; a loop-emission + tool-description edit)**, cited for completeness per Conformance §4.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Problem:** `theo_find_image` returns a real, loadable URL, but display depends on the **model** copying that URL into `![alt](url)`. Long / percent-encoded Wikimedia URLs get mangled (the model decodes `%28`/`%29` → `(`/`)`, and `)` closes the markdown link early) → broken image. Clean short URLs render; encoded/long ones don't. Reproduced live 2026-07-23 (Nadal broken, golden retriever fine); the handler URL itself is HTTP-200-verified, confirming the failure is transcription, not the URL.
- **Fix (Option A — render from the tool result, no model transcription):** exactly the pattern already used for downloadable results. In the tool-loop (`theo_message_stream.js`), right after the existing `event: vault_export` emission, add: when a **non-downloadable** tool returns a string `imageUrl` starting `https://` (i.e. `theo_find_image`), emit `event: vault_image` / `data: { url, title, source, pageUrl, license, creator }`. The FE renders the image straight from that frame (paired FE VEP). The tool result still flows to the model as JSON (`JSON.stringify(out)` — unchanged; the model reads `title`/`source`/`license` to write a caption).
- **Tool-description change (same package, `chat-tools.js`):** update the `theo_find_image` description so the model knows the app displays the image automatically and **must not** emit a markdown image or paste the URL — just confirm/describe (and mention creator/license for Openverse). Mirrors the `theo_export_spreadsheet` guidance ("shown as a download card … do not paste the raw link"). This removes the double-render (FE card + model markdown) and the broken-icon failure at its source.
- **Boundary:** two files on `vaultgpt-func-stream` (the streaming loop + its tool registry). No new endpoint, no DB/schema/migration/Blob/MI/keys, no premium. The `theo_find_image` **handler is unchanged** (already deployed + verified). Duck-typed on `out.imageUrl` — consistent with the existing `out.image` duck-typing for the image-passthrough branch (only `theo_find_image` returns `imageUrl`).

## §2 Gap Register
**PROCEED.**
- **(1) FE must render the `vault_image` frame — and deploy FIRST.** This backend change emits the frame + stops the model markdown. If it shipped **before** the FE handler, images would neither render as a card (FE can't yet) nor as markdown (model told not to) → a blank gap. Therefore the **paired FE VEP deploys first** (its handler lies dormant until frames arrive — images meanwhile still render the old markdown way because this backend change isn't live yet); THEN this backend change deploys. Sequencing is explicit in §6. Disclosed, PROCEED.
- **(2) Frame contract.** `event: vault_image` / `data: { url, title, source, pageUrl, license, creator }` — `url` is the guaranteed-loadable `imageUrl` (upload.wikimedia.org or api.openverse.org, verified at the handler VEP). The FE VEP consumes exactly this shape. Locked here. PROCEED.
- **(3) Duck-typing.** The emit fires on `!isDownloadable(name) && out.imageUrl` (https string). Only `theo_find_image` returns `imageUrl` today; a future image tool would opt in simply by returning `imageUrl`. If two result families ever need to diverge, add a registry flag (like `downloadable`) — not needed now. Disclosed, PROCEED.
- **(4) API Spec Role-C (post-deploy).** Document `event: vault_image` in §2.1 (alongside `vault_export`) and note in §2.15 that `theo_find_image` displays via the frame (not model markdown). PROCEED.
- **(5) No schema/migration/keys/npm.** PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** §1 — inline image display via a new SSE frame; kills the model-transcription failure.
- **P2 Architecture/boundary:** loop-emission + tool-description edit on func-stream; mirrors `vault_export`; handler untouched; DR-T11. (§1.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API Spec §2.1 SSE-frame family (`vault_export`, `tool`, `tool_result`, `vault_tokens`, `vault_meta`, `vault_error`); `vault_image` joins it, same `event:`/`data:` idiom.
- **P5 Primary-reference grounding:** deployed `theo_message_stream.js` + `chat-tools.js` (LIVE snapshots, verbatim under `primary-reference/`). Structural Mirror §4.
- **P6 Boundary re-check:** additive 7-line emission block (diff verified) + one description string edit; `node --check` PASS on both; no other change.
- **P7 Verification:** post-deploy live-chat (§5).
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary References = deployed `theo_message_stream.js` + `chat-tools.js` (LIVE). The change mirrors the `vault_export` download-card mechanism.

| Region | vs Primary Reference (LIVE) | Classification | Anchor |
|---|---|---|---|
| Both files except the two edits | byte-identical | **EXACT** (diffs verified) | Golden Handler §2 |
| New `event: vault_image` emission (7 lines, immediately after the `event: vault_export` block) | same `stream.write(`event: …\ndata: ${JSON.stringify({…})}\n\n`)` idiom as `vault_export`; guarded by `!isDownloadable && out.imageUrl.startsWith("https://")` | **ALLOWED DELTA** — new SSE app-frame modelled on `vault_export`; additive, no existing behavior changed | API §2.1 (`event: vault_export`) + Golden Handler §4 |
| `theo_find_image` description: "app displays automatically; MUST NOT emit markdown/URL; describe + caption" | replaces the prior "emit `![title](imageUrl)`" instruction | **ALLOWED DELTA** (tool guidance text) — mirrors the `theo_export_spreadsheet` "do not paste the raw link" posture | Golden Handler §4 |
| `dispatchChatTool` / `toolResultContent` / `out.image` passthrough / `isDownloadable` / relay | unchanged | **EXACT** | Architecture tool-dispatch |

No DEVIATION rows.

## §5 Verification (post-deploy on func-stream; after the FE VEP is live; never print the token)
1. **Nadal (the regression case):** "show me an image of Nadal winning the French Open" → `theo_find_image` fires → an `event: vault_image` frame with a `upload.wikimedia.org` URL → the FE renders the image inline (no broken icon), and the model's text is a short confirmation/caption with **no** markdown image and **no** pasted URL.
2. **Openverse route:** a generic subject → `source:"openverse"` frame (`api.openverse.org` URL) → renders inline + the model mentions creator/license in prose.
3. **Regression:** a normal no-image chat turn streams unchanged (no `vault_image` frame); a `theo_export_spreadsheet` turn still emits `vault_export` (download card) unaffected.

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (NOT premium)
**Order: the paired FE VEP deploys FIRST** (renders `vault_image`; dormant until frames arrive), THEN this backend change.
1. SCM `vaultgpt-func-stream-cyb4g8bhatddencs.scm.uksouth-01.azurewebsites.net`. GET both current files as rollback baselines (match this pack's LIVE snapshots).
2. Kudu VFS PUT `functions/theo_message_stream.js` → `/site/wwwroot/src/functions/theo_message_stream.js` and `engine/chat-tools.js` → `/site/wwwroot/src/engine/chat-tools.js` (`If-Match:*`; `Content-Type: application/octet-stream`; expect 204; GET-back + diff = the two edits only).
3. `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`.
4. Run §5 live-chat verification (no premium deploy).
5. On green, Role-C: API Spec §2.1 documents `event: vault_image`; §2.15 notes display-via-frame.

## §7 Out of scope
The FE render of the `vault_image` frame is the paired **Theo-FE** VEP (salmon-river) — deploys first. No `theo_find_image` handler change (already deployed). No `theo_*` schema. No premium deploy.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-FindImage-InlineDisplay-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys the paired FE VEP first, then this backend change to `vaultgpt-func-stream` per §6, runs §5 verification, and lands the API-Spec Role-C.
