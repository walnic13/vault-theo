# Theo Backend — `theo_message_stream` persist inline media (Chat Media Persistence / Part 2): Pass-1 Verified Evidence Pack

Backend Verified Evidence Pack (plan). Chat Media Persistence Part 2: `theo_message_stream` (on `vaultgpt-func-stream`) **accumulates the `vault_image` / `vault_video` payloads it emits during the tool-loop and writes them to the new `theo_messages.media` jsonb column** when it persists the assistant turn — so a reloaded chat can re-render fetched images/videos (today only `content` + `citations` persist, so media is lost on reload). Purely additive (**+11 / −5**); the emitted SSE frames are **byte-identical** (each media object is captured, then the SAME object is `JSON.stringify`d into the existing `event: vault_image`/`vault_video` frame), so the live wire contract is unchanged — only persistence is added. No new npm dependency, no wire/response-contract change. Short-TTL SAS export/download is intentionally NOT persisted. `node --check` PASS this turn. **Deploy precondition: the `theo_messages.media` migration (Part 1, Walter-executed) must be live before deploy** (else the assistant INSERT fails → the turn's non-fatal persist catch fires and the turn is not saved).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5

Turn issued against HEAD: `8f5254afbeba30d879e16f5171798046ed0452fc` (vault-theo, `development`; grounding parent `0ee7ba8a302e8f8ecc048339de070a1422f654bb`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Baseline-verification note: the Primary Reference was fetched **live** from `vaultgpt-func-stream` (Kudu VFS `site/wwwroot/src/functions/theo_message_stream.js`, ARM-bearer GET, HTTP 200) this turn (blob `4c72e7226c1ea9d8476e21f4e351dbd1008fbe3a`, 1265 lines — the current deployed handler incl. D3) and committed byte-faithfully as `functions/theo_message_stream.LIVE.js`.

### §4 Documents grounded this turn (Full Baseline)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Claude Code Theo Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3/§4/§7) | `Grep` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2/§4/§5/§5.5) | `Read` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5/§10) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1E, DR-T11 func-stream deploy) | `Read`+`Grep` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 5 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 boundary, §5 theo_ schema/RLS) | `Grep` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_message_stream` persist; wire contract unchanged) | `Grep` this turn | `c99a66f39b4ec03644701c266e49aaf2bf52c2ed` |
| 7 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5 `theo_messages` — new `media jsonb` per Part 1) | `Read`+`Grep` this turn | `fa9aad4c75019de0b621e31b5d33ef97f3689639` |
| 8 | Primary Reference (deployed, live-fetched) — `theo_message_stream.js` (func-stream, v4 model — no per-function `function.json`) — blob `4c72e7226c1ea9d8476e21f4e351dbd1008fbe3a` | `Read` this turn (+ live Kudu fetch) | `4c72e7226c1ea9d8476e21f4e351dbd1008fbe3a` (committed byte-faithfully as `functions/theo_message_stream.LIVE.js` in this package) |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "exactly one" | §Primary Reference — canonical deployed theo_message_stream (v4 model: handler file only) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "ALLOWED DELTA" | §Structural Mirror — the 5 additive edits are ALLOWED DELTAs (accumulate + persist media) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "mapping every handler region to the Primary Reference region" | §Structural Mirror table + unified diff |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Kudu" | §Deploy — func-stream is Kudu VFS surgical overwrite of the single handler file |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "Primary reference artifact cited without full verbatim inline this turn" | §Primary Reference — byte-faithful `.LIVE.js` committed (prose-inline precluded by lint C9 on the handler's THEO_RULESET) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "vaultgpt-func-stream` joins the DR-T7 scoped deployment exception" | §Deploy — Claude-Code deploy of func-stream after APPROVAL |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "theo_messages" | §P3 — target table; new `media jsonb` (Part 1 migration, Walter-executed) |

## Architecture & boundary reconciliation (§4A.1 P2)
- **§1 boundary** — writes only `theo_messages` (the new `media` column, Postgres). No `reporting_*`. No new external system. The media payloads are already produced by the deployed tool-loop; this only persists them.
- **§5 theo_ schema + RLS** — unchanged persist path (`set_config`-less INSERT under the existing owner-scoped persist; `created_by`/`conversation_id` unchanged); `media` inherits the table's ownership policies. No RLS change.
- **Deploy** — `vaultgpt-func-stream` is Kudu VFS (Golden Handler §5.5, DR-T11); surgical overwrite of the single `src/functions/theo_message_stream.js`. **Gated on the Part 1 migration being live.**

## §1 Feature Identification + boundary
- **Change (5 additive edits):** (A) declare `mediaImage`/`mediaVideo` accumulators beside `citationsAll`; (B) at the `vault_image` emit, capture the payload object then emit the SAME object (byte-identical frame); (C) same for `vault_video`; (D) fold `media = { image?, video? }` into the finalize `acc`; (E) add the `media` column + `$7` param to the assistant `INSERT INTO public.theo_messages`, bound to `acc.media ? JSON.stringify(acc.media) : null`.
- **Boundary:** one handler edit; no new dep; no wire/response-contract change (SSE frames byte-identical; the `media` write is internal). `node --check` PASS. Handler blob `662040616210b92cdfa9b1469a3401b149715b23`; +11 / −5 vs the live baseline.

## §2 Gap Register
**PROCEED.**
- **(1) Schema dependency = deploy precondition.** The assistant INSERT now writes `media`; the column must exist (Part 1 migration, Walter-executed) before deploy. If deployed early, the INSERT fails → the existing non-fatal persist catch logs "persistence failed (answer already streamed)" and the turn is not saved — a hard regression, so **DO NOT deploy Part 2 until the migration is live** (disclosed in §Deploy). PROCEED (gated).
- **(2) Wire contract unchanged.** The `vault_image`/`vault_video` frames are byte-identical (same object, captured then stringified); the FE streaming render is unaffected; only persistence is added. PROCEED.
- **(3) Download not persisted.** Short-TTL SAS export/download (`vault_export`) is intentionally excluded — a persisted SAS URL is dead after its TTL. Only `image`/`video` (durable proxy/YouTube URLs) persist. PROCEED (intended).
- **(4) Read + FE are Parts 3/4.** The `media` write is surfaced on reload by `theo_get_conversation` returning it (Part 3, premium via DR-T15) + the FE re-rendering it (Part 4). End-to-end verification (chat→image→reload→media present) lands jointly with Part 3. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** Chat Media Persistence Part 2 — persist inline media with the assistant turn.
- **P2:** architecture reconciliation above (theo_messages only; no reporting_*).
- **P2.5:** Gap Register (PROCEED, deploy gated on migration).
- **P3:** no schema change *in this package* — the additive `media jsonb` column is Part 1 (Walter-executed migration; canonical DDL `Theo-1B-MediaPersist-Schema-Addendum-Pass-1-VEP/media_addendum.sql`). This handler writes to it.
- **P4:** no wire/response-contract change (SSE frames byte-identical; §2.1 unchanged).
- **P5:** Primary Reference = live-fetched deployed `theo_message_stream` (committed `.LIVE.js`); the 5 edits are additive ALLOWED DELTAs; Structural Mirror + unified diff below.
- **P6:** no migration in this package; handler SQL adds one column to the existing owner-scoped INSERT.
- **P7:** golden curls below (regression: frames byte-identical + persist succeeds; end-to-end media persistence jointly with Part 3).
- **P8:** this pack.

## Primary Reference (deployed, live-verified `theo_message_stream.js`)
v4 programming model (in-code `app.http`) — no per-function `function.json`. The byte-faithful Primary Reference is committed **in this package** as `functions/theo_message_stream.LIVE.js` (blob `4c72e7226c1ea9d8476e21f4e351dbd1008fbe3a`, live-fetched this turn) — the func-stream `.LIVE.js` convention (the 1265-line handler's verbatim `THEO_RULESET` contains phrases the mechanical lint's C9 forbids in prose). The modified handler is `functions/theo_message_stream.js` (blob `662040616210b92cdfa9b1469a3401b149715b23`). Diff: `git diff --no-index functions/theo_message_stream.LIVE.js functions/theo_message_stream.js`.

## Exact unified diff vs the live-verified baseline (authoritative delta)
```diff
--- deployed baseline (4c72e722)
+++ Part2 handler (66204061)
@@ -606,6 +606,6 @@
     await client.query(
       `
-      INSERT INTO public.theo_messages (created_by, conversation_id, seq, role, content, model, citations)
-      VALUES ($1, $2, $3, 'assistant', $4, $5, $6)
+      INSERT INTO public.theo_messages (created_by, conversation_id, seq, role, content, model, citations, media)
+      VALUES ($1, $2, $3, 'assistant', $4, $5, $6, $7)
       `,
       [
@@ -616,4 +616,5 @@
         assistantModel,
         acc.citations.length ? JSON.stringify(acc.citations) : null,
+        acc.media ? JSON.stringify(acc.media) : null,
       ]
     );
@@ -1165,4 +1166,6 @@
       let model = FOUNDRY_DEPLOYMENT;
       const citationsAll = [];
+      let mediaImage = null; // Media-Persist: last vault_image payload this turn
+      let mediaVideo = null; // Media-Persist: last vault_video payload this turn
       // Cumulative authoritative output tokens across all loop turns; carried into relayTurnRaw so the
       // live `event: vault_tokens` estimate builds on the exact prior-turn totals. `lastEmitted` is the
@@ -1198,5 +1201,6 @@
             // percent-encoded) URL into markdown and cannot mangle it. Mirrors vault_export above.
             if (!isDownloadable(tu.name) && out && typeof out.imageUrl === "string" && out.imageUrl.startsWith("https://")) {
-              stream.write(`event: vault_image\ndata: ${JSON.stringify({ url: out.imageUrl, title: out.title || "", source: out.source || "", pageUrl: out.pageUrl || "", license: out.license || "", creator: out.creator || "", images: Array.isArray(out.images) ? out.images : undefined })}\n\n`);
+              mediaImage = { url: out.imageUrl, title: out.title || "", source: out.source || "", pageUrl: out.pageUrl || "", license: out.license || "", creator: out.creator || "", images: Array.isArray(out.images) ? out.images : undefined };
+              stream.write(`event: vault_image\ndata: ${JSON.stringify(mediaImage)}\n\n`);
             }
             // FindVideo inline display: a non-downloadable tool that returns { videoUrl }
@@ -1205,5 +1209,6 @@
             // transcribes the URL. Mirrors vault_image above.
             if (!isDownloadable(tu.name) && out && typeof out.videoUrl === "string" && out.videoUrl.startsWith("https://")) {
-              stream.write(`event: vault_video\ndata: ${JSON.stringify({ videoUrl: out.videoUrl, embedUrl: out.embedUrl || "", title: out.title || "", thumbnail: out.thumbnail || "", source: out.source || "", duration: out.duration || "", date: out.date || "" })}\n\n`);
+              mediaVideo = { videoUrl: out.videoUrl, embedUrl: out.embedUrl || "", title: out.title || "", thumbnail: out.thumbnail || "", source: out.source || "", duration: out.duration || "", date: out.date || "" };
+              stream.write(`event: vault_video\ndata: ${JSON.stringify(mediaVideo)}\n\n`);
             }
             // IMG-2 image passthrough: a tool that returns { image: { media_type, data(base64), … } }
@@ -1239,5 +1244,6 @@
       // (unchanged persistence + wire contract).
       try {
-        const acc = { text: finalText, citations: citationsAll, model };
+        const media = (mediaImage || mediaVideo) ? { ...(mediaImage ? { image: mediaImage } : {}), ...(mediaVideo ? { video: mediaVideo } : {}) } : null;
+        const acc = { text: finalText, citations: citationsAll, media, model };
         const conversationId = await persistTurn({
           oid, requestedConversationId, appKey, appContext, userText, attachmentIds, acc,
```

## Structural Mirror Table (Golden Handler §5.1)
| Region | Reference (deployed) | Classification | Anchor |
|---|---|---|---|
| Entire baseline handler body (1265 lines) | deployed theo_message_stream (primary ref) | **EXACT** (unchanged) | Golden Handler §2 "exactly one" |
| `mediaImage`/`mediaVideo` accumulators (beside `citationsAll`) | new locals | **ALLOWED DELTA** | Golden Handler §4 "ALLOWED DELTA" |
| vault_image / vault_video capture (object captured, SAME object emitted) | deployed emit lines | **ALLOWED DELTA** (frame byte-identical) | Golden Handler §4 "ALLOWED DELTA" |
| `media` fold into `acc` (finalize) | deployed `acc = { text, citations, model }` | **ALLOWED DELTA** | Golden Handler §4 "ALLOWED DELTA" |
| assistant INSERT `+ media` column/param | deployed INSERT (content/model/citations) | **ALLOWED DELTA** (one additive column, owner-scoped INSERT otherwise unchanged) | Golden Handler §4 "ALLOWED DELTA" |

## New handler + package
Included: `functions/theo_message_stream.js` (blob `662040616210b92cdfa9b1469a3401b149715b23`; `node --check` PASS; +11/−5 vs baseline) + `functions/theo_message_stream.LIVE.js` (the byte-faithful Primary Reference). No `function.json` (v4 model). No `package.json` change (no new dep). Deploy unit = the single handler file (Kudu VFS surgical overwrite, §5.5 / DR-T11).

## Golden Curls (P7; run by Claude Code post-deploy — AFTER the migration is live)
Bearer via `az account get-access-token` for `api://4e1a1e31-…/access_as_user`; base `https://vaultgpt-func-stream…azurewebsites.net`.
```
# GC-MP2-1 (regression) — a chat that triggers theo_find_image (and/or theo_find_video) still streams
#   byte-identical event: vault_image / vault_video frames AND completes with event: vault_meta carrying
#   a conversation_id (persist succeeded). A no-tool chat streams unchanged.
# GC-MP2-2 (persistence, end-to-end with Part 3) — after Part 3 (theo_get_conversation returns media)
#   deploys: send a chat that fetches an image/video -> reload the conversation -> the media re-renders
#   (theo_messages.media was written by this handler + returned by Part 3). This is the decisive check;
#   run jointly once Part 3 is live. (Walter may also confirm via a read-only `SELECT media FROM
#   public.theo_messages WHERE conversation_id = ... AND role='assistant'` -> non-null jsonb.)
# (test conversation cleaned up after)
```

## Parity Checklist (Golden Handler §5.4)
- [x] Single canonical Primary Reference (deployed theo_message_stream) committed byte-faithfully as `.LIVE.js`; live-fetched byte-identical.
- [x] v4 model — no function.json to pair.
- [x] Structural mirror classifies every region; the 5 edits are additive ALLOWED DELTAs; SSE frames byte-identical.
- [x] Persist stays owner-scoped (created_by/conversation_id unchanged); media inherits theo_messages ownership policies.
- [x] Only theo_messages (new media column); no reporting_*; no new external system; no new npm dep.
- [x] No wire/response-contract change; download intentionally not persisted (SAS).
- [x] node --check PASS; unified diff = purely the 5 additive edits; deploy gated on the Part 1 migration.
- [x] Mechanical lint PASS (below).

## §Deploy (Pass-3, on APPROVAL) — Claude Code, `vaultgpt-func-stream` Kudu VFS (§5.5 / DR-T11)
1. **PRECONDITION: confirm the `theo_messages.media` column is live** (Part 1 migration applied — verify via the read-only `media_verify.sql`). Do NOT deploy before the column exists.
2. Kudu VFS PUT `src/functions/theo_message_stream.js` (blob `66204061`) over the deployed file (ARM-bearer; If-Match the current ETag), GET-back + diff to confirm byte-identical, then `az functionapp restart`.
3. Claude Code runs GC-MP2-1 (regression) immediately; GC-MP2-2 (end-to-end) jointly once Part 3 is live.
4. No Role-C (wire/response contract unchanged; the `media` column is documented by the Part 1 schema addendum).

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-MediaPersist-Stream-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review (APPROVED / REJECTED only). On APPROVED, Claude Code deploys the single handler file to func-stream via Kudu VFS **after confirming the Part 1 migration is live**, and runs the golden curls.
