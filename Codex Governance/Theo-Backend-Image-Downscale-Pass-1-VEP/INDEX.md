# Theo Backend — Attachment image downscale (fit the model's per-image limit) — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. Fixes a live bug (Walter-reported): uploading a large photo (7–8MB) to Theo uploads fine but the chat turn errors **"Couldn't reach the assistant. Try again."** **Root cause:** `theo_message_stream`'s `buildAttachmentBlocks` injects the **full image with no cap** ("B8k: no cap — always inject the full file (Walter-directed)") — but Foundry/Claude **rejects images larger than ~5MB each** (base64 adds ~33%, so a 7–8MB photo is ~10MB on the wire) → upstream **400** → the stream dies. The "no cap" directive was for the *Excel/text-extract* path; **images have a hard model-side size limit** the directive didn't account for. Phone photos routinely exceed it, so this trips constantly.

**Fix (one file, `theo_message_stream.js`):** downscale a large image before injecting — resize its long edge to ≤ `IMAGE_MAX_EDGE` (1568px, Anthropic's recommended max) + re-encode — **only when oversized** (dimensions or bytes); small images inject unchanged. A phone photo drops to well under 1MB, far below the model limit, at no quality the model cares about. Uses **`jimp`** (pure-JS — no native binary, so it deploys cleanly over Kudu; **lazy-`require`d** so text-only turns never load it). The text-extract "no cap" path (Walter-directed) is untouched; documents (PDF) inject unchanged. On any resize failure the block degrades to a note (never throws the turn).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend handler modification; no migration; no schema)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Grounding parent (source baseline): vault-theo `8a3daa90dd70b8c1c9755d72ba8425ac08315009` — the pre-package parent; grounding reads taken here; the package files do not exist at this parent.
Package / review HEAD: this pack (controlling `INDEX.md` + `proposed-app/src/functions/theo_message_stream.js` + `primary-reference/`) is committed on top of that parent and is the current vault-theo `development` HEAD (resolve `git rev-parse HEAD` at review time). Per-file currency is anchored to the content-stable blob SHAs below (Conformance §8) — not a self-referential commit SHA.
The base `theo_message_stream.js` LIVE snapshot was **GET-verified from Kudu this turn** (func-stream `/site/wwwroot/src/functions/theo_message_stream.js`, blob `76d69204…`, byte-identical to the primary-reference copy).
Currency-anchor form: git blob SHA (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary Reference — deployed `theo_message_stream.js` copied full-verbatim under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "EXACT mirror" | §4 — everything but the image branch + the new helper/consts is byte-identical to the deployed base |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §3 | "Never-Guess" | §1 — the ~5MB model image limit is Anthropic-documented + the failure is grounded in the deployed no-cap code |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" | §2 — no schema/DB/migration change |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1D | "ordered, non-skippable" | §6 — Codex → deploy (handler + jimp) → golden test with a real large image |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-Image-Downscale-Pass-1-VEP/primary-reference/PRIMARY_REFERENCE.theo_message_stream.DEPLOYED.js | primary-ref | "async function buildAttachmentBlocks" | §4 — the modified function; only the image branch changes |

### Currency anchors (blob SHAs)
- vault-theo standards @ HEAD `8a3daa9`: THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`; THEO_GOLDEN_HANDLER_STANDARD.md `f8f0e5ea36447502e35fb87b373c94e376f05cbb`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `e44cdd85d3d0e5df332dc754cdec731e2e68022e`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `565559b699c1309f8e750b0dbbac859c13d807c8`.
- primary-reference (GET-verified from func-stream Kudu this turn): `PRIMARY_REFERENCE.theo_message_stream.DEPLOYED.js` `76d69204047f60d2d3c1b6ee55b467b33468261f`.
- this package (proposed): `proposed-app/src/functions/theo_message_stream.js` `9ca598785f8a65604badaa4ac6f3129ecf9ada49` (= deployed base + the image-downscale block; `node --check` PASS).

### Full Baseline doc set (Conformance §4 backend)
Governor, Conformance (this GCR/Rule-Anchor/lint), Codex Review, Golden Handler (§2 primary-ref, §4 EXACT-mirror, §5.5 deploy), Orchestration (§1D). Schema / API Spec — **N/A** (no DB/schema/contract change; an internal image-encoding guard). Grounded for completeness per Conformance §4.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Bug (grounded):** `buildAttachmentBlocks` (line ~506) injects the full image (`nativeBytes += buf.length; // B8k: no cap`) as a base64 `image` block. Foundry/Claude rejects images >~5MB/each (Anthropic-documented; base64 inflates ~33%), so a 7–8MB photo → upstream 400 → the stream errors → the FE shows "Couldn't reach the assistant."
- **Fix:** a new `prepareImageForModel(buf, contentType, context)` helper downscales the long edge to ≤ `IMAGE_MAX_EDGE` (1568) + re-encodes (PNG kept when small, else JPEG q82) **only** when the image is oversized (long edge > 1568 OR bytes > `IMAGE_RESIZE_THRESHOLD_BYTES` ≈ 3.75MB); otherwise it returns the original bytes/`media_type` unchanged. The image branch of `buildAttachmentBlocks` calls it; a `null` (resize failure / unreadable) degrades to a text note. Two new env-tunable consts (`THEO_IMAGE_MAX_EDGE`, `THEO_IMAGE_RESIZE_THRESHOLD_BYTES`).
- **Architecture & boundary reconciliation:** one file on `vaultgpt-func-stream`. No endpoint / route / streaming-envelope change; no DB/schema/migration; no `reporting_*`. The **text-extract "no cap" path is untouched** (Walter's directive stands for extracted text); **documents (PDF) inject unchanged**; only the *image* branch gains the resize. New dependency `jimp` (pure-JS, no native binary) — **lazy-`require`d inside the helper**, so it loads only when a large image is actually resized (no cold-start cost for text-only turns). GIFs are never re-encoded (animation) — injected as-is within budget, else skipped. Fail-closed: any resize error → a note, never a thrown turn.
- **Downscale is safe for model quality:** 1568px long edge is Anthropic's recommended max (larger images are downscaled server-side by the model anyway for token counting); the model sees no meaningful loss.

## §2 Gap Register
**PROCEED.**
- **(G-1) `jimp` dependency (new on func-stream).** Pure-JS, no native binary → deploys via the Kudu node_modules path (like `pg`/others). Lazy-required → no cold-start impact on text turns. Deploy step adds it (§6). Disclosed, PROCEED.
- **(G-2) Model image limit is external + documented.** ~5MB/image (Anthropic). The fix targets a 1568px long edge (typically <1MB), comfortably under it regardless of the exact byte limit. Verified at deploy with a real 7–8MB image (§5). PROCEED.
- **(G-3) PNG transparency.** PNGs are re-encoded as PNG when the resized PNG is within budget (alpha preserved); only if still too large do they fall to JPEG (alpha flattened — acceptable for an oversize screenshot). Disclosed, PROCEED.
- **(G-4) Text-extract + document paths unchanged.** The "no cap" extracted-text injection (Walter-directed) and PDF `document` blocks are byte-unchanged; only images resize. PROCEED.
- **(G-5) Dottie has the same latent no-cap image injection.** The paired `vault-dottie` package applies the same guard to `dottie_message_stream` (gpt-5 vision) — out of scope here (§7). PROCEED.
- **(G-6) No schema/migration/keys.** PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1 Feature:** §1 — downscale oversize attachment images so they fit the model limit.
- **P2 Architecture/boundary:** §1 — one handler; image branch only; new lazy `jimp` dep; no DB/contract/route change.
- **P3 Schema grounding:** N/A — no DB/schema.
- **P4 Contract grounding:** N/A — no endpoint/contract change (the model image content-block shape is unchanged; only the bytes are smaller + `media_type` may change PNG→JPEG on re-encode).
- **P5 Handler grounding (declared track):** §4 — Primary Reference = the deployed `theo_message_stream.js` (GET-verified from Kudu, blob `76d69204`), copied verbatim under `primary-reference/`; the change is confined to the image branch + a new helper/consts (Structural Mirror §4).
- **P6 SQL grounding:** N/A.
- **P7 Curl/golden grounding:** §5 — verified post-deploy with a real >5MB image.
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary Reference = the deployed `theo_message_stream.js` (func-stream, blob `76d69204`, GET-verified this turn), copied verbatim under `primary-reference/`.

| Region (proposed) | vs Primary Reference | Classification | Anchor |
|---|---|---|---|
| the entire module except the image-downscale additions | byte-identical to the deployed base | **EXACT** | Golden §4; primary-ref "async function buildAttachmentBlocks" |
| new consts `IMAGE_MAX_EDGE` / `IMAGE_RESIZE_THRESHOLD_BYTES` (env-tunable, same `parsePositiveInt` idiom as the sibling `ATTACH_*` consts) | new; mirrors the existing const idiom | **ALLOWED DELTA (additive)** | §1 |
| new helper `prepareImageForModel` (lazy `require("jimp")`; resize-when-oversized; JPEG/PNG re-encode; fail→null) | new; no primary-ref equivalent | **ALLOWED DELTA (the fix)** | §1 |
| `buildAttachmentBlocks` image branch: routes images through `prepareImageForModel`; document branch + `(above is…)` note preserved | same structure; image bytes now bounded | **ALLOWED DELTA (the fix)** | §1 — documents + extracted-text paths byte-unchanged |

No DEVIATION rows. `node --check` PASS.

## §5 Golden test (Golden §5.3; Claude runs post-deploy, as `wmansfield@vault-tax.com`)
| # | Step | Expect |
| - | ---- | ------ |
| G1 | Upload a **real 7–8MB photo** (jpeg) + a Theo turn "what's in this image?" | `200` stream; Theo describes the image — **no "couldn't reach the assistant"**. (The pre-fix failure reproduced first if feasible, to confirm the bug.) |
| G2 | Upload a small image (<1MB, <1568px) + ask about it | `200`; unchanged behavior (injected as-is; not re-encoded) |
| G3 | Upload a large **PNG screenshot** (>1568px) | `200`; the model sees it (downscaled; PNG kept if small, else JPEG) |
| G4 | Upload a **PDF** (regression) | `200`; PDF still injected as a `document` block, unchanged |
| G5 | Upload a **text/Excel** attachment (regression) | `200`; extracted-text "no cap" path unchanged |

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (Golden §5.5)
1. Resolve the SCM host (`az functionapp show -n vaultgpt-func-stream -g Vault-Tax --query enabledHostNames`).
2. **Add `jimp`:** `npm install jimp --omit=dev` locally; deploy its `node_modules/jimp` (+ transitive deps) into `/site/wwwroot/node_modules/` via the Kudu **zip API** (`PUT /api/zip/site/wwwroot/node_modules/`, which merges — leaves existing modules intact), same technique as the TODO-store `pg` deploy.
3. Kudu VFS GET the current `/site/wwwroot/src/functions/theo_message_stream.js` (rollback baseline; expect blob `76d69204`). PUT the proposed handler (`If-Match:*`; expect 204). GET-back + diff (expect blob `9ca59878`). `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`.
4. Run §5 golden tests (incl. the real >5MB image, G1).

## §7 Out of scope
The paired **`vault-dottie`** package (apply the same downscale guard to `dottie_message_stream`'s image injection — gpt-5 vision). Client-side (FE) resize-on-upload (a possible future optimization; the server-side guard is the robust fix regardless of client).

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-Image-Downscale-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys the handler + `jimp` to `vaultgpt-func-stream` per §6 + runs §5 golden tests (incl. a real 7–8MB photo); then the paired `vault-dottie` package applies the same guard to Dottie.
