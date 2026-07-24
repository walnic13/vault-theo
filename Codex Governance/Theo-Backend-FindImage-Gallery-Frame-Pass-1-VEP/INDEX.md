# Theo Backend — FindImage full-descriptive-query + gallery frame — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. The func-stream half of the gallery program (paired with the APPROVED vault-theo-tools gallery handler). Two edits on `vaultgpt-func-stream`: (1) **`engine/chat-tools.js`** — flip the `theo_find_image` guidance from *"pass a CONCISE subject noun … not a whole sentence"* to **"pass the FULL descriptive request the user made"** (the fix for Walter's "the moment Nadal won → generic trophy shot": the handler already forwards `subject` to SerpAPI verbatim, so the *model* must send the full descriptive query, not a bare noun; also generalises the attribution instruction beyond Openverse and notes the gallery); (2) **`functions/theo_message_stream.js`** — carry the handler's `images[]` array on the existing `event: vault_image` SSE frame so the paired **FE gallery** (VEP 3) can render it. Self-contained: both edited files + their deployed LIVE snapshots under `primary-reference/`. Backward-compatible + deployable before VEP 3: the frame still carries the flat `url`, so the FE keeps rendering the single top image (now from the full query) until the gallery render ships.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `efc650d0925037f3967fd77f4ad37822ce10bc07` (the commit that contains this package; grounding reads against pre-package parent `3f5bca3c83c202f7e2d0ccdae1818b48d4fdb85d`). The paired gallery handler is at vault-theo-tools `Codex Governance/Theo-Tools-FindImage-Gallery-Pass-1-VEP/` (APPROVED + deployed). Cited-doc blob SHAs below are HEAD-stable.
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary References — deployed `chat-tools.js` + `theo_message_stream.js` copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — `images[]` added to the `event: vault_image` frame data (additive); the flat `url` etc. unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "DR-T11" | §1 — the general-chat tool-loop that dispatches `theo_find_image` + emits the SSE frame |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | tool-dispatch | "tool-dispatch" | §1 — the loop dispatches the tool then side-emits an app SSE frame from the result |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "event: vault_export" | §1/§4 — `images[]` rides the existing `event: vault_image` frame (the additive-SSE-frame idiom documented alongside `event: vault_export`) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FindImage-Gallery-Frame-Pass-1-VEP/primary-reference/chat-tools.LIVE.js.md | primary-ref | "const CHAT_TOOLS" | §4 — only the `theo_find_image` `description` + `subject` schema text change; the registry/dispatch is unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FindImage-Gallery-Frame-Pass-1-VEP/primary-reference/theo_message_stream.LIVE.js.md | primary-ref | "event: vault_image" | §4 — one additive `images` field on the existing `vault_image` emission; nothing else changes |

### Currency anchors (blob SHAs @ HEAD `3f5bca3`)
- THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `c3f2267b751d5e9f4f025331359c4d3013bcbe8a`; CODEX_THEO_BACKEND_REVIEW_STANDARD.md `d2e1b9881b6e2ed7d77921a055feffb0852257fd`; THEO_GOLDEN_HANDLER_STANDARD.md `1496c10b78e690508e516cb1d8b632e95a8d8e8d`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `be066f12147d1eb13b51f025b275f5413ab51f0e`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`; THEO_API_SPEC.md `a3bf3607cb5d4a9391f80c7e33b97305eb3707bc`; THEO_AZURE_POSTGRES_SCHEMA.md `e6143cf55839120b696e03c6702a1144ac3cc2c9`.

### Full Baseline doc set (Conformance §4 backend) — grounded this turn
Governor, Conformance (this GCR/Rule-Anchor/lint), Codex Review, Golden Handler (§2 primary-ref, §4 shape), Orchestration (DR-T11), Architecture (tool-dispatch), API Spec (§2.1 SSE frame family + §2.15 theo_find_image), Schema — **N/A (no DB/schema/migration; a registry-text + one additive frame field)**, cited for completeness per Conformance §4.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Edit A — `chat-tools.js` `theo_find_image` guidance (the query-specificity fix):** replace "pass a CONCISE subject noun … not a whole sentence" with **"pass the FULL descriptive request the user made — a specific phrase or sentence is BEST (e.g. 'Rafael Nadal collapsing to the clay winning the 2008 French Open final', NOT just 'Nadal'); the image search handles descriptive queries well, so do NOT reduce it to a bare noun."** Also: note the result is shown as a **small gallery**; generalise the attribution instruction from Openverse-only to **any result with a creator/license** (Commons results are CC-licensed too); document the `images[]` return field. The `subject` `input_schema` description is updated to match. **Root cause fix:** the handler passes `subject` to SerpAPI verbatim, so a generic result was purely the model compressing the request — this stops that.
- **Edit B — `theo_message_stream.js` `event: vault_image` emission:** add one field, `images: Array.isArray(out.images) ? out.images : undefined`, to the emitted frame `data` (alongside the existing `url`/`title`/`source`/`pageUrl`/`license`/`creator`). `JSON.stringify` omits it when absent, so non-gallery results are byte-unchanged. Carries the deployed gallery handler's `images[]` to the FE for VEP 3.
- **Boundary:** two files on `vaultgpt-func-stream` (the tool registry + the streaming loop). No new endpoint, no DB/schema/migration/Blob/MI, no premium. The `theo_find_image` **handler is unchanged** (the gallery handler is already deployed). Registry/dispatch (`BY_NAME`/`CHAT_TOOL_SCHEMAS`/`dispatchChatTool`, DR-T11) unchanged. Deploy target `vaultgpt-func-stream`.
- **Deployable before the FE gallery (VEP 3), no regression.** The frame still carries the flat `url`, so the deployed FE keeps rendering the single top image — now sourced from the FULL descriptive query (the immediate quality win) — and ignores the additive `images[]` until VEP 3 adds the gallery render.

## §2 Gap Register
**PROCEED.**
- **(1) The description is the model-side half of the full-query fix.** The gallery handler (deployed) forwards `subject` verbatim; this edit makes the model *send* the full descriptive `subject`. Together they get the right shot. Disclosed, PROCEED.
- **(2) `images[]` additive on the frame.** The FE renders the single top image until VEP 3; the extra field is ignored by the current render (and by `JSON.stringify` when absent). No regression. PROCEED.
- **(3) Attribution generalised.** Commons + Openverse results carry `license`/`creator`; the guidance now tells the model to caption any licensed result (not just Openverse). PROCEED.
- **(4) Role-C deferred.** API Spec §2.15 + §2.1 will be updated once the FE gallery (VEP 3) lands, so the gallery is documented end-to-end at once. PROCEED.
- **(5) No schema/migration/keys/npm.** PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** §1 — full-descriptive-query guidance + `images[]` frame carry.
- **P2 Architecture/boundary:** registry-text + one additive frame field on func-stream; DR-T11 loop/dispatch unchanged. (§1.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API §2.1 SSE-frame family (`vault_image` additive field); §2.15 `theo_find_image` (the deployed gallery handler returns `images[]`).
- **P5 Primary-reference grounding:** deployed `chat-tools.js` + `theo_message_stream.js` (LIVE snapshots, verbatim under `primary-reference/`). Structural Mirror §4.
- **P6 Boundary re-check:** two edits (one registry-text block, one additive frame field); `node --check` PASS on both; no other change.
- **P7 Verification:** post-deploy live-chat (§5).
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary References = deployed `chat-tools.js` + `theo_message_stream.js` (LIVE).

| Region | vs Primary Reference (LIVE) | Classification | Anchor |
|---|---|---|---|
| Both files except the two edits | byte-identical | **EXACT** (diffs verified: chat-tools = the `theo_find_image` description + `subject` desc only; stream = one line) | Golden Handler §2 |
| `chat-tools.js` `theo_find_image` `description` + `subject` `input_schema` description | reworded: "CONCISE noun" → "FULL descriptive request"; + gallery note + generalised attribution + `images[]` documented | **ALLOWED DELTA** (tool guidance text; the registry entry's `name`/`route`/`downloadable`/schema-shape unchanged) | Golden Handler §4 + API §2.15 |
| `theo_message_stream.js` `event: vault_image` emission | add `images: Array.isArray(out.images) ? out.images : undefined` to the frame `data` | **ALLOWED DELTA** — additive frame field; omitted when absent (non-gallery results byte-unchanged) | API §2.1 (`event: vault_export` frame idiom) |
| `BY_NAME` / `CHAT_TOOL_SCHEMAS` / `dispatchChatTool` / the tool-loop / all other emissions | unchanged | **EXACT** | Architecture tool-dispatch |

No DEVIATION rows.

## §5 Verification (post-deploy on func-stream; never print the token)
1. **Descriptive single-image (immediate win, pre-VEP-3):** "show me the moment Nadal won the French Open" → the model calls `theo_find_image` with a FULL descriptive `subject` (visible `event: tool`), and the reply shows a **relevant** image (a celebration/collapse shot, not the generic trophy) — proving the full query reached SerpAPI. The frame now also carries `images[]` (inspectable in the SSE), rendered as a gallery once VEP 3 ships.
2. **Regression:** a normal no-image chat turn streams unchanged (no `vault_image`); `theo_export_spreadsheet` still emits `vault_export`.

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (NOT premium)
1. SCM `vaultgpt-func-stream-cyb4g8bhatddencs.scm.uksouth-01.azurewebsites.net`. GET both current files as rollback baselines (match this pack's LIVE snapshots).
2. Kudu VFS PUT `engine/chat-tools.js` → `/site/wwwroot/src/engine/chat-tools.js` and `functions/theo_message_stream.js` → `/site/wwwroot/src/functions/theo_message_stream.js` (`If-Match:*`; expect 204; GET-back + diff = the two edits only).
3. `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`.
4. Run §5 verification. Deployable before VEP 3 (single image from the full query; gallery after VEP 3).

## §7 Out of scope
The FE **gallery render** (thumbnail row + lightbox from `images[]`) is the paired **Theo-FE** VEP 3 (salmon-river). The gallery handler itself is the deployed vault-theo-tools VEP. Role-C (API §2.15/§2.1 gallery documentation) lands with VEP 3. No `theo_*` schema. No premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-FindImage-Gallery-Frame-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys both files to `vaultgpt-func-stream` per §6 + runs §5 verification; the paired FE gallery render (VEP 3) + Role-C follow.
