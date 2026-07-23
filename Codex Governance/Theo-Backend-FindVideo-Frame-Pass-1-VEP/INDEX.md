# Theo Backend — FindVideo chat-tools registration + `event: vault_video` frame — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. The func-stream half of the video program (paired with the APPROVED + DEPLOYED `theo_find_video` handler on `vaultgpt-func-theo-tools`, API §2.16 / Golden Handler HF-T11). Two additive edits on `vaultgpt-func-stream`: (1) **`engine/chat-tools.js`** — register `theo_find_video` in `CHAT_TOOLS` so the model can call it, with a description that (mirroring the deployed `theo_find_image` fix) tells the model to **pass the FULL descriptive request** as `subject` and that the app displays the result AUTOMATICALLY (so it must NOT paste a URL/markdown); (2) **`functions/theo_message_stream.js`** — emit an additive **`event: vault_video`** SSE frame from the tool result (mirroring the existing `event: vault_image` emission) carrying `{ videoUrl, embedUrl, title, thumbnail, source, duration, date }` so the paired **FE** (VEP B2) can render an in-chat player / link-card. Self-contained: both edited files + their deployed LIVE snapshots under `primary-reference/`. **Inert without regression**: registering the tool + emitting a new frame does not change any existing behaviour; the frame is ignored until VEP B2 adds the FE render + the YouTube CSP allowance.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `<PKG_COMMIT_SHA>` (the commit that first contains this package; grounding reads against pre-package parent `e2fbabf8be2bce6fbd2797e20599aae23ed6f705` — the commit that lands the DEPLOYED `theo_find_video` handler's Role-C, API §2.16 + Golden Handler HF-T11). The paired handler is APPROVED + deployed + golden-verified on `vaultgpt-func-theo-tools` (2026-07-23). Both edited files' LIVE snapshots were GET-verified from Kudu this turn; cited-doc blob SHAs are resolved at the grounding parent.
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary References — deployed `chat-tools.js` + `theo_message_stream.js` copied verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — the `event: vault_video` frame `data` mirrors the deployed handler's response shape (API §2.16) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "DR-T11" | §1 — the general-chat tool-loop that dispatches `theo_find_video` + side-emits the SSE frame |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | tool-dispatch | "tool-dispatch" | §1 — the loop dispatches the tool then side-emits an app SSE frame from the result |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "event: vault_export" | §1/§4 — `event: vault_video` is a new additive SSE frame in the same idiom documented alongside `event: vault_export` / `event: vault_image` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FindVideo-Frame-Pass-1-VEP/primary-reference/chat-tools.LIVE.js.md | primary-ref | "const CHAT_TOOLS" | §4 — one additive `CHAT_TOOLS` registry entry (`theo_find_video`); the registry mechanism/dispatch is unchanged |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FindVideo-Frame-Pass-1-VEP/primary-reference/theo_message_stream.LIVE.js.md | primary-ref | "event: vault_image" | §4 — the new `event: vault_video` emission mirrors the existing `event: vault_image` block byte-for-byte apart from the event name + payload fields |

### Currency anchors (blob SHAs @ grounding parent `e2fbabf`)
- THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `c3f2267b751d5e9f4f025331359c4d3013bcbe8a`; CODEX_THEO_BACKEND_REVIEW_STANDARD.md `d2e1b9881b6e2ed7d77921a055feffb0852257fd`; THEO_GOLDEN_HANDLER_STANDARD.md `5ce25a120605cc67e02bc094835484614d8f8bf7`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `be066f12147d1eb13b51f025b275f5413ab51f0e`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`; THEO_API_SPEC.md `c1ad5aab3bc23289ed4f055d1e8a7c3e0d1515dc`; THEO_AZURE_POSTGRES_SCHEMA.md `e6143cf55839120b696e03c6702a1144ac3cc2c9`.

### Full Baseline doc set (Conformance §4 backend) — grounded this turn
Governor, Conformance (this GCR/Rule-Anchor/lint), Codex Review, Golden Handler (§2 primary-ref, §4 shape + HF-T11), Orchestration (DR-T11), Architecture (tool-dispatch), API Spec (§2.1 SSE-frame family + §2.16 `theo_find_video`), Schema — **N/A (no DB/schema/migration; a registry entry + one additive frame)**, cited for completeness per Conformance §4.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Edit A — `chat-tools.js` register `theo_find_video`:** add one `CHAT_TOOLS` entry (`name`/`route` `theo_find_video`, `downloadable: false`, `description` + `subject` `input_schema`) so the streaming loop exposes it to the model and dispatches it to the deployed handler (DR-T11, forwarded bearer, shared audience — the identical mechanism `theo_find_image` uses). The description mirrors the deployed `theo_find_image` fix: **"pass the FULL descriptive request the user made … do NOT reduce it to a bare noun"** (so the full query reaches SerpAPI Google Videos), and it states the app displays the video AUTOMATICALLY (in-chat player when embeddable, else a thumbnail link-card) so the model MUST NOT paste a URL/markdown — just confirm what it found.
- **Edit B — `theo_message_stream.js` `event: vault_video` emission:** after the existing `event: vault_image` block, add a sibling block: `if (!isDownloadable(tu.name) && out && typeof out.videoUrl === "string" && out.videoUrl.startsWith("https://")) { stream.write('event: vault_video' … { videoUrl, embedUrl, title, thumbnail, source, duration, date }) }`. Byte-for-byte the `vault_image` idiom apart from the guard field (`videoUrl`), event name, and payload fields — so the model never transcribes the URL (render-from-frame). `JSON.stringify` carries `embedUrl:""` when the top result is non-embeddable (FE link-card).
- **Boundary:** two files on `vaultgpt-func-stream` (the tool registry + the streaming loop). No new endpoint, no DB/schema/migration/Blob/MI, no premium. The `theo_find_video` **handler is unchanged** (already deployed). Registry/dispatch (`BY_NAME`/`CHAT_TOOL_SCHEMAS`/`dispatchChatTool`, DR-T11) unchanged. Deploy target `vaultgpt-func-stream`.
- **Inert without regression.** Registering the tool + emitting a new frame changes nothing existing: the model only calls the tool when the user asks for a video; the `event: vault_video` frame is a new event name the current FE ignores. No render (in-chat player) and no CSP `frame-src` allowance until VEP B2. `theo_find_image`/`theo_export_spreadsheet`/normal chat are byte-unchanged.

## §2 Gap Register
**PROCEED.**
- **(1) Full-descriptive-`subject` is the model-side relevance lever.** The deployed handler forwards `subject` to SerpAPI verbatim; this description makes the model send the full descriptive query (parallels the deployed `theo_find_image` fix), so video results are relevant. Disclosed, PROCEED.
- **(2) `event: vault_video` additive.** A new SSE event name; the current FE ignores unknown events, so no regression. Rendered once VEP B2 ships. PROCEED.
- **(3) Inert until FE package (VEP B2).** The in-chat player / link-card render + the YouTube CSP `frame-src` allowance are VEP B2. Recorded, PROCEED.
- **(4) Role-C — already landed for the handler.** API §2.16 + Golden Handler HF-T11 are DEPLOYED (grounding parent). The `event: vault_video` frame is documented in §2.1 when VEP B2 lands the render (mirrors the image sequencing: the frame is documented alongside its FE consumer). PROCEED.
- **(5) No schema/migration/keys/npm.** PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** §1 — register `theo_find_video` + emit `event: vault_video`.
- **P2 Architecture/boundary:** one registry entry + one additive frame on func-stream; DR-T11 loop/dispatch unchanged. (§1.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API §2.1 SSE-frame family; §2.16 `theo_find_video` (the deployed handler's response shape the frame mirrors).
- **P5 Primary-reference grounding:** deployed `chat-tools.js` + `theo_message_stream.js` (LIVE snapshots, GET-verified from Kudu, verbatim under `primary-reference/`). Structural Mirror §4.
- **P6 Boundary re-check:** two additive edits (one registry entry, one frame block); `node --check` PASS on both; no other change (diff-verified additive-only vs the LIVE snapshots).
- **P7 Verification:** post-deploy live SSE inspection (§5).
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary References = deployed `chat-tools.js` + `theo_message_stream.js` (LIVE, GET-verified this turn).

| Region | vs Primary Reference (LIVE) | Classification | Anchor |
|---|---|---|---|
| Both files except the two additive blocks | byte-identical | **EXACT** (diff-verified additive-only: chat-tools = one new `CHAT_TOOLS` entry; stream = one new `if`-block) | Golden Handler §2 |
| `chat-tools.js` new `theo_find_video` `CHAT_TOOLS` entry | new registry entry mirroring the `theo_find_image` entry shape (`name`/`route`/`downloadable:false`/`description`/`input_schema{subject}`); video-specific description + example | **ALLOWED DELTA** (additive registry entry; `BY_NAME`/`CHAT_TOOL_SCHEMAS`/dispatch mechanism unchanged) | Golden Handler §4 + API §2.16 |
| `theo_message_stream.js` new `event: vault_video` emission block | mirrors the `event: vault_image` block byte-for-byte apart from the guard field (`videoUrl` vs `imageUrl`), the event name, and the payload fields (`{ videoUrl, embedUrl, title, thumbnail, source, duration, date }`) | **ALLOWED DELTA** — additive SSE frame in the existing render-from-frame idiom | API §2.1 (`event: vault_export`/`vault_image` frame idiom) |
| `BY_NAME` / `CHAT_TOOL_SCHEMAS` / `dispatchChatTool` / the tool-loop / all existing emissions (`vault_image`/`vault_export`/`vault_tokens`/passthrough) | unchanged | **EXACT** | Architecture tool-dispatch |

No DEVIATION rows.

## §5 Verification (post-deploy on func-stream; never print the token)
1. **Video request:** "show me a video of how the offside rule works" → the model calls `theo_find_video` with a FULL descriptive `subject` (visible `event: tool`), and the SSE stream carries an `event: vault_video` frame with a YouTube `embedUrl` (`youtube-nocookie.com/embed/<id>`), https `videoUrl`/`thumbnail`. (No visible in-chat player yet — that's VEP B2 — but the frame is inspectable in the raw stream.)
2. **Regression:** a normal no-tool chat turn streams unchanged (no `vault_video`); `theo_find_image` still emits `vault_image`; `theo_export_spreadsheet` still emits `vault_export`.

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (NOT premium)
1. SCM `vaultgpt-func-stream-cyb4g8bhatddencs.scm.uksouth-01.azurewebsites.net`. GET both current files as rollback baselines (match this pack's LIVE snapshots).
2. Kudu VFS PUT `engine/chat-tools.js` → `/site/wwwroot/src/engine/chat-tools.js` and `functions/theo_message_stream.js` → `/site/wwwroot/src/functions/theo_message_stream.js` (GET the ETag first and PUT with `If-Match:<etag>` per the func-stream 409 gotcha; expect 204; GET-back + diff = the two additive blocks only).
3. `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax` (restart AGAIN after the last PUT lands).
4. Run §5 verification.

## §7 Out of scope
The FE **in-chat player / thumbnail link-card render** (from `event: vault_video`) + the YouTube **CSP `frame-src` allowance** (`https://www.youtube-nocookie.com`) are the paired **Theo-FE** VEP B2 (salmon-river). The `theo_find_video` handler is the deployed vault-theo-tools VEP. The `event: vault_video` frame is documented in API §2.1 when VEP B2 lands the render. No `theo_*` schema. No premium.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-FindVideo-Frame-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys both files to `vaultgpt-func-stream` per §6 + runs §5 verification; the paired FE render + CSP (VEP B2) follow.
