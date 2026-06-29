# Role-C Verbatim-Edit Handoff — Doc alignment: record B8b–B8e + B8h DEPLOYED (Plan + API Spec)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Brings the two authority docs current with deployed + verified reality: the **Plan** still marks B8b–B8e "buildable" and has no B8h; the **API Spec §2.8** still says gateway injection is "sequenced." All of B8a–B8e + the B8h large-document-handling enhancement are **deployed and golden-curl/SWA-verified**. Eight verbatim edits across two files (Plan ×7, API Spec ×1); additive/status-only — no behaviour described that isn't deployed. (Schema doc §3/§7 and Golden-Handler §6 are already current. This **supersedes** the unapplied `Theo-1B-B8d-API-Spec-ReadPath-RoleC`.)

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `01684f6a2b91a37566a6b5556192f53e16540f23` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET (1/2)** Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8 deliverables + completion) | `Read(offset=170,limit=20)` this turn | `ebdf4d73306190ab5b44f61fb2db08932b1f3638` |
| 2 | **TARGET (2/2)** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 read-path row) | `Grep("read uploaded files into a chat")` this turn | `be621ba62396a12c8ddd873d4805e433bc1d82cc` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDITs 1–8 — Codex applies verbatim |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "Deliverables" | EDITs 1–6 — B8b–B8e/B8h status + B8h deliverable |
| spec/THEO_API_SPEC.md | §2.8 | "read uploaded files into a chat" | EDIT 8 — §2.8 read-path DEPLOYED |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
B8a–B8e are deployed; B8h (large-document handling) is deployed + golden-curl-verified (a >3 MB text-dense PDF promoted to extract via `pdf-parse@1.1.1` → Theo answered in ~8.6 s, no timeout; small PDFs stay native), and B8e's composer is SWA-verified. The Plan + API Spec (deployed-state truth owners) must record this so they reflect reality and so B8h (authored as a fix microstep) appears in the plan. Documentation-only; additive/status.

## Edit set (8 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT.

### EDIT 1 — Plan: B8b DEPLOYED
**Locate (BEFORE) — found once:**
```
  - **B8b — upload handlers.** `theo_create_attachment_upload` (issue the scoped write SAS + the intended blob path) + `theo_finalize_attachment`
```
**Replace with (AFTER):**
```
  - **B8b — upload handlers.** ✅ **DEPLOYED (2026-06-29).** `theo_create_attachment_upload` (issue the scoped write SAS + the intended blob path) + `theo_finalize_attachment`
```

### EDIT 2 — Plan: B8c DEPLOYED
**Locate (BEFORE) — found once:**
```
  - **B8c — extraction at upload.** For extract-class types, extract text at finalize
```
**Replace with (AFTER):**
```
  - **B8c — extraction at upload.** ✅ **DEPLOYED (2026-06-29).** For extract-class types, extract text at finalize
```

### EDIT 3 — Plan: B8d DEPLOYED
**Locate (BEFORE) — found once:**
```
  - **B8d — gateway integration.** `theo_message` accepts `attachment_ids`; for each **owned** attachment:
```
**Replace with (AFTER):**
```
  - **B8d — gateway integration.** ✅ **DEPLOYED (2026-06-29).** `theo_message` accepts `attachment_ids`; for each **owned** attachment:
```

### EDIT 4 — Plan: B8e DEPLOYED + add the B8h deliverable
**Locate (BEFORE) — found once:**
```
  - **B8e — frontend.** Composer attach control + upload (SAS PUT) + attachment chips (Theo FE regime).
```
**Replace with (AFTER):**
```
  - **B8e — frontend.** ✅ **DEPLOYED (2026-06-29; SWA-verified).** Composer attach control + upload (SAS PUT) + attachment chips, plus **large-paste-to-attachment** (a paste ≥ ~1,500 chars becomes a collapsed, expandable "Pasted text" attachment) (Theo FE regime).
  - **B8h — large-document handling.** ✅ **DEPLOYED (2026-06-30).** Keeps large/text-dense documents within the synchronous request budget: `theo_finalize_attachment` promotes a **PDF larger than `THEO_PDF_NATIVE_MAX_BYTES` (3 MB)** from native to **extract-class** (text-extracted via `pdf-parse@1.1.1`; PDFs ≤ 3 MB stay native for visual fidelity); `theo_message` injects strictly by the row's `ingestion_class` (a promoted PDF injects budgeted text, **never** a giant document block — and an extract-class row never falls back to native), plus an extract-text token budget + tightened native byte budget. Fixes the big-document "Couldn't reach the assistant" timeout.
```

### EDIT 5 — Plan: Native-read note about the 3 MB PDF threshold
**Locate (BEFORE) — found once:**
```
  - **Native-read** (`application/pdf`, `image/png|jpeg|webp|gif`): injected directly as document/image content blocks. **≤ 10 MB** (native reading is accurate at/below this).
```
**Replace with (AFTER):**
```
  - **Native-read** (`application/pdf`, `image/png|jpeg|webp|gif`): injected directly as document/image content blocks. **≤ 10 MB** (native reading is accurate at/below this). **(B8h:** a PDF **> 3 MB** (`THEO_PDF_NATIVE_MAX_BYTES`) is instead **text-extracted** and budgeted, so a large text-dense PDF cannot blow the synchronous request; PDFs ≤ 3 MB and all images stay native.**)**
```

### EDIT 6 — Plan: add `pdf-parse` to the extractor list
**Locate (BEFORE) — found once:**
```
in-process server-side text extraction at upload (SheetJS for Excel, `mammoth` for Word, an office text parser for PPT, native for CSV/TXT)
```
**Replace with (AFTER):**
```
in-process server-side text extraction at upload (SheetJS for Excel, `mammoth` for Word, an office text parser for PPT, `pdf-parse` for large PDFs (B8h), native for CSV/TXT)
```

### EDIT 7 — Plan: Completion line
**Locate (BEFORE) — found once:**
```
- **Completion.** A user uploads a PDF / Excel / Word file and Theo answers questions grounded in it; attachments are owner-scoped (RLS + explicit `created_by`); content reaches the model only via the gateway (D-3 ZDR resolved). **Gates:** D-8 RESOLVED — **B8b–B8e are buildable**; B8f/B8g are deferred follow-ons.
```
**Replace with (AFTER):**
```
- **Completion.** ✅ **B8a–B8e + B8h DEPLOYED + verified (2026-06-30).** A user uploads a PDF / Excel / Word file (or a large LP agreement) and Theo answers grounded in it — golden-curl + SWA verified; attachments are owner-scoped (RLS + explicit `created_by`); content reaches the model only via the gateway (D-3 ZDR resolved). **Gates:** D-8 RESOLVED. **Pending follow-ons:** reload-parity (attachment chips on reloaded chats; a small FE + `theo_list_conversation_attachments` step), B8f (spreadsheet read-tool) and B8g (Office/Visio converter), and streaming (a deliberate sidecar — see the streaming assessment).
```

### EDIT 8 — API Spec §2.8: read-path DEPLOYED (B8d + B8h)
**Locate (BEFORE) — found once:**
```
| read uploaded files into a chat (PDF/image as document/image content blocks; Excel/Word/PPT/CSV/TXT extracted to text) | `1B` — extraction-at-upload **DEPLOYED 2026-06-29** (B8c: extract-class text stored at `extracted_text_path`); gateway injection sequenced (B8d: `theo_message` injects native blocks / extracted text per token budget) | HF-T1 gateway + `theo_attachments` |
```
**Replace with (AFTER):**
```
| read uploaded files into a chat (PDF/image as document/image content blocks; Excel/Word/PPT/CSV/TXT — and PDFs > 3 MB — extracted to text) | `1B-deployed` — **DEPLOYED 2026-06-30** (B8c extraction + B8d gateway injection + B8h large-document handling): `theo_message` accepts `attachment_ids` and injects, per the row's `ingestion_class`, a native PDF/image block (≤ 3 MB PDF / image) or the **budgeted extracted text**; a PDF **> 3 MB** is text-extracted (B8h, `pdf-parse`) rather than sent as a giant document block, bounding the synchronous request. Golden-curl + SWA verified; the FE composer (B8e) is live. | HF-T1 gateway + `theo_attachments` |
```

## Note
Eight verbatim edits: Plan (×7 — B8b/B8c/B8d/B8e DEPLOYED markers, the new B8h deliverable, the Native-read 3 MB note, the `pdf-parse` extractor mention, the Completion line) + API Spec §2.8 (×1 — read-path DEPLOYED incl. B8h). Records deployed + verified reality; supersedes the unapplied `Theo-1B-B8d-API-Spec-ReadPath-RoleC`. No behaviour described that isn't deployed.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B8-Doc-Alignment-RoleC/Theo_1B_B8_Doc_Alignment_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-B8-Doc-Alignment-RoleC/Theo_1B_B8_Doc_Alignment_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-B8-Doc-Alignment Role-C. Apply EDITs 1–8 verbatim (each BEFORE anchor found exactly once; HALT on mismatch): Plan B8b/B8c/B8d/B8e → DEPLOYED, add the B8h deliverable, the Native-read 3 MB note + `pdf-parse` extractor mention + the Completion line; API Spec §2.8 read-path → DEPLOYED (B8d + B8h). Documentation-only; supersedes the unapplied B8d-API-Spec-ReadPath Role-C."*

*End of Role-C Verbatim-Edit Handoff.*
