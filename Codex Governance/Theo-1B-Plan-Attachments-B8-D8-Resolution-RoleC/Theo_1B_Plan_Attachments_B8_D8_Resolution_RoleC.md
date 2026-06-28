# Role-C Verbatim-Edit Handoff — Plan: D-8 RESOLVED + Tier B8 restructured (Attachments ingestion classes)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Records Walter's **D-8 resolution** and restructures **Tier B8** in `governance/THEO_PHASE_1B_BACKEND_PLAN.md` to reflect the agreed attachments design: ingestion classes (native-read vs extract-then-inject vs stored-only), two-tier size caps (10 MB native / 50 MB extract), SAS upload, and deferred follow-on tiers (spreadsheet read-tool, Office/Visio converter). Six verbatim edits to one file. No handler/schema/source change; B8a stays DEPLOYED as recorded.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `c713f232c95680c88be576b2b480548b8a1e57bb` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§1 item 7; §5 table; §6 1A→1B delta; §7 Tier B8; §8 D-8 + gating) | `Read(offset=116,limit=85)` + `Grep("D-8\|theo_upload_attachment\|attachment")` this turn | `f9ff44111298469a9b3771eb815d2b14524b2345` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDITs 1–6 — Codex applies verbatim |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §8 | "D-8" | EDIT 5 — D-8 marked RESOLVED |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
Walter resolved D-8 (2026-06-28): files upload via a short-lived, single-blob, owner-scoped **write SAS** (direct-to-Blob, finalize handler reads actual size/type and enforces caps); **native-read** formats (PDF/images) cap at **10 MB** (reading accurate at/below); **extract-then-inject** formats (Excel/Word/PPT/CSV/TXT) cap at **50 MB** and are read via in-process server-side extraction (SheetJS / mammoth / office parser / native) injected at the gateway, token-budgeted, with Excel→markdown per sheet + per-sheet selection; `.doc/.ppt/.vsdx` are **stored-only** in v1 (converter deferred); retention indefinite + user-deletable. The model-callable spreadsheet read-tool is a **deferred follow-on** (extraction-and-inject is the better default for an Excel-heavy analytical workload; the tool is the oversized-file fallback). The plan must record this so Tier B8 and the Decision Register reflect the agreed design before B8b is authored. Documentation-only; additive intent — B8a stays DEPLOYED.

## Edit set (6 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `governance/THEO_PHASE_1B_BACKEND_PLAN.md`.

### EDIT 1 — §1 item 7 (Attachments summary): reflect ingestion classes + D-8 resolved
**Locate (BEFORE) — found once:**
```
7. **Attachments** (Tier B8) — users attach files (PDF/image) to a chat; Theo reads them via Anthropic **document/image content blocks** at the gateway (capability golden-curl-verified — Foundry accepts document blocks with current headers). Stored owner-scoped in Blob (`theo_attachments` + the `theo-content` container). Gated by D-8 (upload mechanism + limits); D-3 (ZDR, RESOLVED) covers attachment content reaching the model.
```
**Replace with (AFTER):**
```
7. **Attachments** (Tier B8) — users attach files to a chat; Theo reads **native** formats (PDF/images, ≤10 MB) via Anthropic **document/image content blocks** and **extract-class** formats (Excel/Word/PPT/CSV/TXT, ≤50 MB) via in-process server-side text extraction injected at the gateway (capability golden-curl-verified — Foundry accepts document blocks with current headers). Stored owner-scoped in Blob (`theo_attachments` + the `theo-content` container) via a scoped write SAS. **D-8 RESOLVED** (mechanism + limits + ingestion classes); D-3 (ZDR, RESOLVED) covers attachment content reaching the model.
```

### EDIT 2 — §5 table: the `theo_attachments` row
**Locate (BEFORE) — found once:**
```
| `theo_attachments` *(B8)* | file attached to a chat | `created_by` (Entra OID), `conversation_id uuid NULL`, `filename`, `content_type`, `byte_size`, `blob_container`/`blob_path` (pointer into `theo-content`), `created_at`; ownership RLS + `_exists_unscoped(uuid)`; injected as document/image content blocks at the gateway |
```
**Replace with (AFTER):**
```
| `theo_attachments` *(B8)* | file attached to a chat | `created_by` (Entra OID), `conversation_id uuid NULL`, `filename`, `content_type`, `byte_size`, `blob_container`/`blob_path` (pointer into `theo-content`), `created_at`; ownership RLS + `_exists_unscoped(uuid)`. Native (PDF/image, ≤10 MB) injected as content blocks; extract-class (Excel/Word/PPT/CSV/TXT, ≤50 MB) extracted to text at upload + injected — see Tier B8 |
```

### EDIT 3 — §6 1A→1B delta table: the Attachments row
**Locate (BEFORE) — found once:**
```
| Attachments (B8) | *absent in 1A* | upload files → Blob (`theo_attachments` / `theo-content`), injected as document/image content blocks to Foundry-Claude (HF-T1), owner-scoped |
```
**Replace with (AFTER):**
```
| Attachments (B8) | *absent in 1A* | upload files → Blob (`theo_attachments` / `theo-content`) via scoped write SAS; native (PDF/image) injected as content blocks + extract-class (Excel/Word/PPT/CSV/TXT) extracted to text and injected to Foundry-Claude (HF-T1), owner-scoped |
```

### EDIT 4 — §7 Tier B8 block: full restructure
**Locate (BEFORE) — found once:**
```
### Tier B8 — Attachments (file upload → document/image content blocks)
- **Purpose.** Let users attach files (PDF/image/etc.) to a chat so Theo can read and reason over them — the core tax-assistant use case ("analyse this K-1 / statement / workpaper"). Capability verified 2026-06-28: the deployed Foundry-Claude gateway accepts Anthropic document content blocks with current headers (no beta) and extracts PDF text.
- **Deliverables.**
  - **B8a — schema.** `theo_attachments` table (§5) + 4-policy ownership RLS + `theo_attachment_exists_unscoped(uuid)`; Blob pointer into the existing `theo-content` container.
  - **B8b — upload handler.** `theo_upload_attachment` — store the file in Blob + insert the owner-scoped metadata row; return the attachment id. Upload mechanism + size/type limits per D-8.
  - **B8c — gateway integration.** `theo_message` accepts `attachment_ids`; for each **owned** attachment, fetch the blob, base64-encode, and inject a `document`/`image` content block alongside the user text (handle array-content `userText`/title persistence).
  - **B8d — frontend.** Composer attach control + upload + attachment chips (Theo FE regime).
- **Completion.** A user uploads a document and Theo answers questions grounded in it; attachments are owner-scoped (RLS + explicit `created_by`); content reaches the model only via the gateway (D-3 ZDR resolved). **Gated:** D-8 (upload mechanism + limits) gates B8b; B8a schema is not gated.
```
**Replace with (AFTER):**
```
### Tier B8 — Attachments (file upload → model-readable content)
- **Purpose.** Let users attach files (PDF / images / Excel / Word / etc.) to a chat so Theo can read and reason over them — the core tax-assistant use case ("analyse this K-1 / TB / workpaper"). Capability verified 2026-06-28: the deployed Foundry-Claude gateway accepts Anthropic document/image content blocks with current headers (no beta) and extracts PDF text.
- **Ingestion classes + limits (D-8 RESOLVED 2026-06-28).**
  - **Native-read** (`application/pdf`, `image/png|jpeg|webp|gif`): injected directly as document/image content blocks. **≤ 10 MB** (native reading is accurate at/below this).
  - **Extract-then-inject** (Excel `.xlsx/.xls`, Word `.docx`, PowerPoint `.pptx`, CSV, TXT): in-process server-side text extraction at upload (SheetJS for Excel, `mammoth` for Word, an office text parser for PPT, native for CSV/TXT); extracted text injected at the gateway, **token-budgeted**. **≤ 50 MB.** Excel → markdown/CSV per sheet + a sheet manifest (names, row/col counts, est. tokens); full-workbook injection is the default when it fits the budget, with **per-sheet selection** when large.
  - **Stored-only (v1)** (Visio `.vsdx`, legacy binary `.doc/.ppt`): stored + downloadable; Theo replies it cannot yet read the format. Readability deferred to the converter follow-on (B8g).
  - **Upload mechanism:** a short-lived, single-blob, owner-scoped **write SAS** (direct-to-Blob); the finalize handler reads the blob's **actual** size + content-type from Blob properties and enforces the per-class cap (the client cannot misdeclare). **Retention:** indefinite (user-owned data), user-deletable; no auto-TTL.
- **Deliverables.**
  - **B8a — schema.** ✅ **DEPLOYED (2026-06-28).** `theo_attachments` table (§5) + 4-policy ownership RLS + `theo_attachment_exists_unscoped(uuid)`; Blob pointer into the existing `theo-content` container.
  - **B8b — upload handlers.** `theo_create_attachment_upload` (issue the scoped write SAS + the intended blob path) + `theo_finalize_attachment` (verify the blob, read actual size/type, enforce the per-class cap + ingestion-class allow-list, insert the owner-scoped row, return the attachment id) + `theo_delete_attachment` (delete blob then row; RLS `delete_own`). SAS mechanism + 10/50 MB caps per D-8.
  - **B8c — extraction at upload.** For extract-class types, extract text at finalize (SheetJS / mammoth / PPT parser / native) and store it as a sibling Blob pointer in `theo-content`; Excel → per-sheet markdown + sheet manifest. A small **additive schema addendum** records the extraction pointer + ingestion class on `theo_attachments`.
  - **B8d — gateway integration.** `theo_message` accepts `attachment_ids`; for each **owned** attachment: native classes → fetch blob, base64-encode, inject a `document`/`image` content block; extract classes → inject the stored extracted text (token-budgeted; per-sheet selection for large Excel); stored-only → a short "cannot read this format yet" note. Handle array-content `userText`/title persistence.
  - **B8e — frontend.** Composer attach control + upload (SAS PUT) + attachment chips (Theo FE regime).
- **Follow-on tiers (deferred — flagged, not v1 scope).**
  - **B8f — spreadsheet read-tool.** A model-callable, owner-scoped attachment read-tool (list sheets → read range → search) for workbooks too large to inject. Triggered when real large-workbook usage appears; touches Theo's tool-dispatch surface (Tool Manifest, D-6-adjacent) as a **Theo-internal attachment tool family** (reads the user's own uploaded file; never a `reporting_*` endpoint).
  - **B8g — Office/Visio converter.** LibreOffice-headless (or a conversion service) rendering `.doc/.ppt/.vsdx` (and other non-OOXML formats) to PDF/image for native reading. Real infra; deferred until needed.
- **Completion.** A user uploads a PDF / Excel / Word file and Theo answers questions grounded in it; attachments are owner-scoped (RLS + explicit `created_by`); content reaches the model only via the gateway (D-3 ZDR resolved). **Gates:** D-8 RESOLVED — **B8b–B8e are buildable**; B8f/B8g are deferred follow-ons.
```

### EDIT 5 — §8 Decision Register: mark D-8 RESOLVED
**Locate (BEFORE) — found once:**
```
| **D-8** | Attachment upload mechanism (direct base64 through the handler vs a short-lived SAS for direct-to-Blob) + max file size + allowed content types + retention. | **OPEN.** Walter confirms the mechanism + limits; Claude Code recommends in the B8b VEP. Gates B8b (upload handler); B8a schema is not gated. |
```
**Replace with (AFTER):**
```
| **D-8** | Attachment upload mechanism + max file size + allowed content types + retention. | **RESOLVED (2026-06-28).** Upload via a short-lived, single-blob, owner-scoped **write SAS** (direct-to-Blob); the finalize handler reads the blob's actual size/type and enforces caps (client cannot misdeclare). **Limits:** native-read (PDF/image) **≤10 MB**; extract-class (Excel/Word/PPT/CSV/TXT) **≤50 MB**. **Allowed types** = a closed ingestion-class allow-list — native: `application/pdf`, `image/png|jpeg|webp|gif`; extract: `.xlsx/.xls/.docx/.pptx`, `text/csv`, `text/plain`; `.doc/.ppt/.vsdx` stored-only in v1 (converter follow-on B8g). **Retention:** indefinite, user-deletable; no auto-TTL. Gates lifted for B8b–B8e. |
```

### EDIT 6 — §8 gating summary sentence: move D-8 to RESOLVED
**Locate (BEFORE) — found once:**
```
Remaining open items are **PRE-LAND** for their tiers: the AI-Search sub-item of D-5 gates B6 **and the B7b history-RAG index**; D-6 gates B5; **D-8 gates B8b (attachment upload mechanism + limits)**. **D-3 (ZDR) and D-7 (memory distillation policy) are RESOLVED (2026-06-28)** — B7 distillation + system-prompt injection are no longer gated. No tier proceeds on a guessed decision.
```
**Replace with (AFTER):**
```
Remaining open items are **PRE-LAND** for their tiers: the AI-Search sub-item of D-5 gates B6 **and the B7b history-RAG index**; D-6 gates B5 (and, when triggered, the B8f spreadsheet read-tool). **D-3 (ZDR), D-7 (memory distillation policy), and D-8 (attachment upload mechanism + limits) are RESOLVED (2026-06-28)** — B7 distillation + system-prompt injection and B8b–B8e attachments are no longer gated. No tier proceeds on a guessed decision.
```

## Note
Six verbatim edits to one file (`governance/THEO_PHASE_1B_BACKEND_PLAN.md`): §1 item 7, §5 table row, §6 delta row, the §7 Tier B8 block (full restructure), the §8 D-8 row (→ RESOLVED), and the §8 gating sentence. Documentation-only — records Walter's D-8 resolution + the agreed attachments ingestion-class design. No handler/schema/source change; B8a stays DEPLOYED.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-Plan-Attachments-B8-D8-Resolution-RoleC/Theo_1B_Plan_Attachments_B8_D8_Resolution_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-Plan-Attachments-B8-D8-Resolution-RoleC/Theo_1B_Plan_Attachments_B8_D8_Resolution_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-Plan-Attachments-B8-D8-Resolution Role-C. Apply EDITs 1–6 to `governance/THEO_PHASE_1B_BACKEND_PLAN.md` verbatim (each BEFORE anchor found exactly once; HALT on mismatch): §1 item 7, §5 table row, §6 delta row, the §7 Tier B8 restructure, the §8 D-8 row (→ RESOLVED), and the §8 gating sentence. Documentation-only — records the D-8 resolution + attachments ingestion-class design."*

*End of Role-C Verbatim-Edit Handoff.*
