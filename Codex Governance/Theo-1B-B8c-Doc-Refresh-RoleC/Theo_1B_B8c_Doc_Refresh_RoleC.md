# Role-C Verbatim-Edit Handoff — Record B8c extraction columns (schema-doc §3/§7 + API-Spec §2.8)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Records the **deployed + golden-curl-verified** B8c extraction addendum — the additive `ingestion_class` / `extracted_text_path` columns on `theo_attachments`, and `theo_finalize_attachment`'s extract-class text extraction — in the two deployed-contract authority docs. Four verbatim edits across two files; additive, documentation-only. (B8c migration + handler are deployed; evidence `.local/b8c_extraction_verify_2026-06-29.txt`.)

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `ada88353aef376b48e2366867fb4abd84b36c382` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET (1/2)** Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_attachments` row; §7 as-built) | `Grep("theo_attachments")` this turn | `0936b75e47c9f9d48876acbebc2f0d8f750b012b` |
| 2 | **TARGET (2/2)** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 finalize + read rows) | `Grep("finalize attachment \\|")` this turn | `f5eea60a0010822671f05da75b78ba90179afc83` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDITs 1–4 — Codex applies verbatim |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §7 | "theo_attachments" | EDIT 1/2 — §3 row + §7 as-built addendum |
| spec/THEO_API_SPEC.md | §2 | "Contract Surface" | EDIT 3/4 — §2.8 finalize + read rows |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
B8c is deployed and golden-curl-verified: the additive `ingestion_class` / `extracted_text_path` columns exist (RO-verified), and `theo_finalize_attachment` now extracts text for extract-class uploads (Excel via SheetJS proven loaded; CSV pipeline proven) while leaving native (PDF/image) unchanged. The schema doc (deployed DB truth) and the API Spec (deployed contract) must record the new columns + the finalize response shape, and advance the §2.8 read-path status (extraction done; injection pending B8d). Documentation-only; additive.

## Edit set (4 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT.

### EDIT 1 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3: note the B8c columns on the `theo_attachments` row
**Locate (BEFORE) — found once:**
```
| `theo_attachments` | File attached to a chat (Attachments, Tier B8) | `conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `filename text` (non-empty CHECK), `content_type text`, `byte_size bigint` (CHECK `>= 0`), `blob_container`/`blob_path` (pointer into the existing `theo-content` container). Immutable — no `updated_at`. Body lives in Blob; the row holds only the pointer. | DEPLOYED — B8a (§7) |
```
**Replace with (AFTER):**
```
| `theo_attachments` | File attached to a chat (Attachments, Tier B8) | `conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `filename text` (non-empty CHECK), `content_type text`, `byte_size bigint` (CHECK `>= 0`), `blob_container`/`blob_path` (pointer into the existing `theo-content` container), `ingestion_class text` + `extracted_text_path text NULL` (B8c extraction metadata). Body lives in Blob; the row holds only the pointer. | DEPLOYED — B8a (§7) + B8c addendum |
```

### EDIT 2 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §7: append the B8c addendum to the as-built note
**Locate (BEFORE) — found once:**
```
Immutable file metadata — no `updated_at`. The file body lives in Blob; the row holds only the pointer. Per-user isolation is enforced by RLS (this table) AND by explicit `created_by = $oid` predicates in the Tier B8 handlers (next microsteps). Boundary: net-new additive table; no `reporting_*` touched.
```
**Replace with (AFTER):**
```
Immutable file metadata — no `updated_at`. The file body lives in Blob; the row holds only the pointer. Per-user isolation is enforced by RLS (this table) AND by explicit `created_by = $oid` predicates in the Tier B8 handlers. Boundary: net-new additive table; no `reporting_*` touched. **Tier B8c addendum (DEPLOYED 2026-06-29):** additive `ingestion_class text` (`native`\|`extract`\|`stored`; free-text, no CHECK — promotable like `app_key`) + `extracted_text_path text NULL` (Blob pointer to the extracted text for extract-class attachments; NULL for native or when extraction has not run). Set by `theo_finalize_attachment` (B8c): extract-class uploads (Excel/Word/PPT/CSV/TXT) are text-extracted in-process at finalize and stored as a sibling `…/<attachmentId>.extracted.md` blob. The new columns inherit the table's four ownership policies. Canonical DDL: `Codex Governance/Theo-1B-B8c-Attachment-Extraction-Pass-1-VEP/b8c_addendum.sql`.
```

### EDIT 3 — `spec/THEO_API_SPEC.md` §2.8: finalize row — add `extracted_text_path` + the B8c extraction note
**Locate (BEFORE) — found once:**
```
| finalize attachment | `1B-deployed` — **DEPLOYED 2026-06-29** (B8b): `POST /api/theo_finalize_attachment` `{ attachment_id, filename, conversation_id? }`. HEADs the uploaded blob and enforces the allow-list + ingestion class + per-class cap against the blob's **actual** Content-Type and Content-Length (the client cannot misdeclare); a disallowed / empty / over-cap blob → 400 (`UNSUPPORTED_MEDIA_TYPE` / `INVALID_REQUEST` / `PAYLOAD_TOO_LARGE`) + blob deleted. Inserts the owner-scoped row (`id = attachmentId`); returns `{ attachment: { id, conversation_id, filename, content_type, byte_size, blob_container, blob_path, created_at, ingestion_class } }`. A referenced `conversation_id` must be owned by the caller (else 404). | `theo_attachments` (HF-T2) + Blob `theo-content` |
```
**Replace with (AFTER):**
```
| finalize attachment | `1B-deployed` — **DEPLOYED 2026-06-29** (B8b; extraction B8c): `POST /api/theo_finalize_attachment` `{ attachment_id, filename, conversation_id? }`. HEADs the uploaded blob and enforces the allow-list + ingestion class + per-class cap against the blob's **actual** Content-Type and Content-Length (the client cannot misdeclare); a disallowed / empty / over-cap blob → 400 (`UNSUPPORTED_MEDIA_TYPE` / `INVALID_REQUEST` / `PAYLOAD_TOO_LARGE`) + blob deleted. For **extract-class** uploads (Excel/Word/PPT/CSV/TXT) it also extracts text in-process (B8c) and stores it as a sibling blob, recording `extracted_text_path` (`ingestion_class='extract'`); native PDF/image set `ingestion_class='native'`, `extracted_text_path=null` (extraction is non-fatal — on failure the row persists with `extracted_text_path=null`). Inserts the owner-scoped row (`id = attachmentId`); returns `{ attachment: { id, conversation_id, filename, content_type, byte_size, blob_container, blob_path, ingestion_class, extracted_text_path, created_at } }`. A referenced `conversation_id` must be owned by the caller (else 404). | `theo_attachments` (HF-T2) + Blob `theo-content` |
```

### EDIT 4 — `spec/THEO_API_SPEC.md` §2.8: advance the read-path row status
**Locate (BEFORE) — found once:**
```
| read uploaded files into a chat (PDF/image as document/image content blocks; Excel/Word/PPT/CSV/TXT extracted to text) | `1B` (sequenced; B8c extraction-at-upload + B8d gateway injection) | HF-T1 gateway + `theo_attachments` |
```
**Replace with (AFTER):**
```
| read uploaded files into a chat (PDF/image as document/image content blocks; Excel/Word/PPT/CSV/TXT extracted to text) | `1B` — extraction-at-upload **DEPLOYED 2026-06-29** (B8c: extract-class text stored at `extracted_text_path`); gateway injection sequenced (B8d: `theo_message` injects native blocks / extracted text per token budget) | HF-T1 gateway + `theo_attachments` |
```

## Note
Four verbatim edits across two files: schema-doc §3 row + §7 as-built record the B8c `ingestion_class` / `extracted_text_path` columns; API-Spec §2.8 finalize row gains `extracted_text_path` + the extraction note, and the read-path row advances to "extraction DEPLOYED / injection sequenced". Additive; documentation-only; records deployed + golden-curl-verified reality.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B8c-Doc-Refresh-RoleC/Theo_1B_B8c_Doc_Refresh_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-B8c-Doc-Refresh-RoleC/Theo_1B_B8c_Doc_Refresh_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-B8c-Doc-Refresh Role-C. Apply EDITs 1–4 verbatim (each BEFORE anchor found exactly once; HALT on mismatch): EDITs 1–2 record the B8c `ingestion_class`/`extracted_text_path` columns in `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 row + §7 as-built); EDITs 3–4 update `spec/THEO_API_SPEC.md` §2.8 (finalize response shape + read-path status). Documentation-only; additive."*

*End of Role-C Verbatim-Edit Handoff.*
