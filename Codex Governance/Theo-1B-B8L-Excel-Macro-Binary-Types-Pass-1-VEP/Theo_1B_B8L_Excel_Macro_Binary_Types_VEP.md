# Theo 1B B8L — Accept .xlsm / .xlsb Excel attachments — Verified Evidence Pack

> Theo backend regime. Pass 1 VEP. Author = Claude Code. Reviewer = **Codex**. Authority = Walter (2026-07-08 — an `.xlsm` upload failed; also allow `.xlsb`). Adds macro-enabled (`.xlsm`) and binary (`.xlsb`) Excel to the attachment content-type allowlist, so they upload and extract like `.xlsx`. Two deployed handlers on `vaultgpt-func-premium` (classic): `theo_create_attachment_upload` (the allowlist that rejected the upload) + `theo_finalize_attachment` (allowlist + SheetJS extraction routing).

## Grounding Conformance Receipt
Turn Type: Pass 1 — Verified Evidence Pack (backend handler modification)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Repo / HEAD: vault-theo `development` @ `c13ab70`

Primary References (deployed source, Kudu-GET this turn, byte-complete in-package):
- `…/theo_create_attachment_upload.LIVE.index.js` (13498 B) + fixed `theo_create_attachment_upload.index.js`.
- `…/theo_finalize_attachment.LIVE.index.js` (20453 B) + fixed `theo_finalize_attachment.index.js`.

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "The deployed handler is the source of truth" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "Allowed Deltas" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E/DR-T7 | "after a Codex-APPROVED VEP" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | theo_attachments | "is the storage substrate for files" |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5 | "ownership column" |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "Tier B8 — attachments" |
| Codex Governance/Theo-1B-B8L-Excel-Macro-Binary-Types-Pass-1-VEP/theo_create_attachment_upload.LIVE.index.js | allowlist gate | "const ALLOWED_CONTENT_TYPES = Object.keys(INGESTION_CLASSES);" |
| Codex Governance/Theo-1B-B8L-Excel-Macro-Binary-Types-Pass-1-VEP/theo_create_attachment_upload.LIVE.index.js | normalizeContentType lowercases | ".trim().toLowerCase()" |
| Codex Governance/Theo-1B-B8L-Excel-Macro-Binary-Types-Pass-1-VEP/theo_finalize_attachment.index.js | SheetJS extraction | "XLSX.read(buf, { type: " |

## Architecture & boundary reconciliation

The change is a content-type allowlist extension only (P2 confirmed): no schema, endpoint, function binding, RLS, or contract change. `theo_attachments` (the storage substrate) and its ownership model (`created_by` **ownership column**, Architecture §5) are untouched. `.xlsm` (`application/vnd.ms-excel.sheet.macroenabled.12`) and `.xlsb` (`application/vnd.ms-excel.sheet.binary.macroenabled.12`) are added to `INGESTION_CLASSES` as `extract`-class in **both** handlers (create validates on SAS mint; finalize re-validates + classifies), and to the finalize SheetJS extraction branch (SheetJS `XLSX.read` parses `.xlsm`/`.xlsb` natively). **Keys are lowercase** because `normalizeContentType` lowercases the inbound type (verified — a camelCase `macroEnabled` key would never match). No client-side type filter exists in the Theo composer, so the backend allowlist is the sole gate.

## Gap Disclosure

**PROCEED.** (1) Deploy: both handlers are on the premium monolith → **Walter copy-pastes** them; **Claude Code runs the golden curls** (Golden Handler §5.5). No func-stream/DR-T7 involvement. (2) `.xlsm` macros are never executed — the file is read as a spreadsheet by SheetJS (data only); no macro/security surface. No further gaps.

## Structural Mirror (P5, Golden Handler §5.1)

Primary Reference = the two LIVE handlers (in-package). Every region EXACT except:
| Region | Classification | Change |
| ------ | -------------- | ------ |
| `theo_create_attachment_upload` `INGESTION_CLASSES` | ALLOWED DELTA (§4) | +2 extract-class entries (`.xlsm`, `.xlsb`). |
| `theo_finalize_attachment` `INGESTION_CLASSES` | ALLOWED DELTA (§4) | +2 extract-class entries (parity with create). |
| `theo_finalize_attachment` `extractTextFromBlob` Excel branch | ALLOWED DELTA (§4) | route `.xlsm`/`.xlsb` to the existing SheetJS `XLSX.read` path. |

`node --check` passes on both replacements; `diff LIVE↔replacement` = create +2 lines, finalize +6 lines (2 allowlist + the routing), nothing else.

## Verification plan
- **Deterministic golden curl (Claude, post-deploy):** authenticated `POST …/api/theo_create_attachment_upload` with `content_type: "application/vnd.ms-excel.sheet.macroenabled.12"` + a filename/byte_size → **expect HTTP 200 with a SAS** (previously **400** "must be one of the supported attachment types"). Confirms the allowlist accepts `.xlsm` (same for `.xlsb`). Deploy-integrity: Kudu GET-back byte-diff == in-package; restart; unauth 401 probe.
- **FE acceptance (Walter):** upload a real `.xlsm` (and `.xlsb`) to a Theo chat → upload succeeds → Theo can read the spreadsheet contents.

## Deploy (post-APPROVED)
`theo_create_attachment_upload` + `theo_finalize_attachment` → **Walter** copy-paste into `vaultgpt-func-premium` (classic per-fn; `index.js` only, function.json unchanged). Then **Claude Code** runs the golden curls to verify.
