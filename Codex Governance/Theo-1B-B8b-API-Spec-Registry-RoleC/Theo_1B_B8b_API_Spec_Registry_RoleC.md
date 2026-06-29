# Role-C Verbatim-Edit Handoff — Record B8b attachment endpoints (API Spec §2.8 + Golden-Handler §6 registry)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Records the **deployed + golden-curl-verified** B8b attachment upload endpoints (`theo_create_attachment_upload` / `theo_finalize_attachment` / `theo_delete_attachment`) in the two authority docs that track deployed contracts/families: a new **§2.8 Attachments** block in `spec/THEO_API_SPEC.md`, and the Golden-Handler **§6 family registry** (new family `HF-T5` Blob upload SAS broker + `theo_attachments` added to `HF-T2`'s scope). Four verbatim edits across two files; no behaviour/handler/schema change. (The schema-doc `theo_attachments` DEPLOYED row already landed via the B8a G-2 Role-C.)

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `fc7108832947a2c7113c9be1e6049bf08fcc55fd` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET (1/2)** Theo API Spec — `spec/THEO_API_SPEC.md` (§2 contract surface; §2.7 last block; §3) | `Read(offset=54,limit=14)` + `Grep("§2\\.")` this turn | `f491b3986dd1fdbcaa91346def08520217fc9370` |
| 2 | **TARGET (2/2)** Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§6 family registry + append rule) | `Read(offset=38,limit=22)` this turn | `af4ef9fd93ce886ad968d3644599e54e29c67220` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDITs 1–4 — Codex applies verbatim |
| spec/THEO_API_SPEC.md | §2 | "Contract Surface" | EDIT 1 — new §2.8 Attachments block |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 | "new families are added with a monotonically increasing `HF-Tn` id by a Walter-approved Role-C landing" | EDIT 3 — new `HF-T5` family row |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
B8b is deployed and golden-curl-verified (create → SAS PUT → finalize → delete, plus the misdeclaration + oversize guards; evidence `.local/b8b_attachment_upload_verify_2026-06-29.txt`). The two deployed-contract authority docs must record it: the API Spec enumerates the deployed endpoint contracts (mirrors how §2.7 records B7a memory), and the Golden-Handler §6 registry tracks handler families — the `theo_create_attachment_upload` SAS broker is a genuinely new family (managed-identity user-delegation SAS, no DB), added under the §6 append rule as `HF-T5`, while `theo_finalize_attachment` / `theo_delete_attachment` are `HF-T2` CRUD over the new `theo_attachments` table. Documentation-only; additive.

## Edit set (4 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT.

### EDIT 1 — `spec/THEO_API_SPEC.md`: add §2.8 Attachments before §3
**Locate (BEFORE) — found once:**
```
| cross-chat history-RAG over the user's own `theo_messages` | `1B` (PRE-LAND; needs Azure AI Search `vaultgpt-search` + embeddings) | HF-T4 over `theo_messages`, `created_by`-scoped (B7b) |

## §3 Boundary
```
**Replace with (AFTER):**
```
| cross-chat history-RAG over the user's own `theo_messages` | `1B` (PRE-LAND; needs Azure AI Search `vaultgpt-search` + embeddings) | HF-T4 over `theo_messages`, `created_by`-scoped (B7b) |

### §2.8 Attachments (Tier B8) — backs file upload to chats
| Contract | Status | Backing |
|----------|--------|---------|
| create attachment upload (issue write SAS) | `1B-deployed` — **DEPLOYED 2026-06-29** (B8b): `POST /api/theo_create_attachment_upload` `{ filename, content_type }` (`content_type` ∈ the ingestion-class allow-list — native PDF/PNG/JPEG/WebP/GIF ≤10 MB; extract XLSX/XLS/DOCX/PPTX/CSV/TXT ≤50 MB; else 400 `UNSUPPORTED_MEDIA_TYPE`). Returns `{ attachmentId, filename, contentType, ingestionClass, maxBytes, upload: { account, container, blobKey, blobUrl, uploadUrl, method:"PUT", requiredHeaders, expiresAt } }` — a 15-min, single-blob, owner-scoped (`attachments/<oid>/<attachmentId>`) managed-identity **user-delegation write SAS** the client PUTs the bytes to directly. | Blob `theo-content` (HF-T5) |
| finalize attachment | `1B-deployed` — **DEPLOYED 2026-06-29** (B8b): `POST /api/theo_finalize_attachment` `{ attachment_id, filename, conversation_id? }`. HEADs the uploaded blob and enforces the allow-list + ingestion class + per-class cap against the blob's **actual** Content-Type and Content-Length (the client cannot misdeclare); a disallowed / empty / over-cap blob → 400 (`UNSUPPORTED_MEDIA_TYPE` / `INVALID_REQUEST` / `PAYLOAD_TOO_LARGE`) + blob deleted. Inserts the owner-scoped row (`id = attachmentId`); returns `{ attachment: { id, conversation_id, filename, content_type, byte_size, blob_container, blob_path, created_at, ingestion_class } }`. A referenced `conversation_id` must be owned by the caller (else 404). | `theo_attachments` (HF-T2) + Blob `theo-content` |
| delete attachment | `1B-deployed` — **DEPLOYED 2026-06-29** (B8b): `POST /api/theo_delete_attachment` `{ id }`. Owner-scoped permanent delete (403/404 split via `theo_attachment_exists_unscoped`) + best-effort blob reclaim; returns `{ deleted: true, id }`. | `theo_attachments` (HF-T2) + Blob `theo-content` |
| read uploaded files into a chat (PDF/image as document/image content blocks; Excel/Word/PPT/CSV/TXT extracted to text) | `1B` (sequenced; B8c extraction-at-upload + B8d gateway injection) | HF-T1 gateway + `theo_attachments` |

All attachment endpoints execute as the signed-in user; every query is explicit `created_by`-scoped, with ownership RLS the second layer (per §1). The Blob body lives in the existing `theo-content` container; the row holds only the pointer.

## §3 Boundary
```

### EDIT 2 — `governance/THEO_GOLDEN_HANDLER_STANDARD.md`: add `theo_attachments` to HF-T2 scope
**Locate (BEFORE) — found once:**
```
| HF-T2 | `theo_` CRUD + RLS | Ownership-based CRUD over `theo_conversations` / `theo_messages` / `theo_projects` / `theo_project_knowledge` / `theo_artifacts` / `theo_artifact_versions` / `theo_user_settings` | PROPOSED (architecture §5.3; authored in 1B) |
```
**Replace with (AFTER):**
```
| HF-T2 | `theo_` CRUD + RLS | Ownership-based CRUD over `theo_conversations` / `theo_messages` / `theo_projects` / `theo_project_knowledge` / `theo_artifacts` / `theo_artifact_versions` / `theo_user_settings` / `theo_attachments` | PROPOSED (architecture §5.3; authored in 1B) |
```

### EDIT 3 — `governance/THEO_GOLDEN_HANDLER_STANDARD.md`: add HF-T5 family after HF-T4
**Locate (BEFORE) — found once:**
```
| HF-T4 | RAG retrieval | Azure AI Search hybrid retrieval over tax corpus + project knowledge, RLS-scoped, at the system-prompt assembly seam | PROPOSED (architecture §6; authored in 1B) |
```
**Replace with (AFTER):**
```
| HF-T4 | RAG retrieval | Azure AI Search hybrid retrieval over tax corpus + project knowledge, RLS-scoped, at the system-prompt assembly seam | PROPOSED (architecture §6; authored in 1B) |
| HF-T5 | Blob upload SAS broker | Server-side issuance of short-lived, single-blob, owner-scoped managed-identity **user-delegation** write SAS for direct-to-Blob upload into `theo-content`, plus managed-identity data-plane blob HEAD (actual size/type) and DELETE (reclaim); no `@azure/storage-blob` dependency (managed-identity token → user delegation key → manually-signed SAS) | DEPLOYED 2026-06-29 (B8b; `theo_create_attachment_upload`; the blob-side of `theo_finalize_attachment` / `theo_delete_attachment`) |
```

### EDIT 4 — `governance/THEO_GOLDEN_HANDLER_STANDARD.md`: note HF-T5 in the §6 intro count
**Locate (BEFORE) — found once:**
```
Stable-id registry of Theo backend handler families, populated as families are authored.
```
**Replace with (AFTER):**
```
Stable-id registry of Theo backend handler families, populated as families are authored. (HF-T5 Blob upload SAS broker added 2026-06-29 for Tier B8b attachments.)
```

## Note
Four verbatim edits across two files: API Spec gains §2.8 Attachments (3 deployed endpoints + the sequenced read path); Golden-Handler §6 gains `theo_attachments` in HF-T2 and a new `HF-T5` family (per the §6 append rule) + an intro note. No existing contract/family altered in meaning; additive. Records deployed + golden-curl-verified reality.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B8b-API-Spec-Registry-RoleC/Theo_1B_B8b_API_Spec_Registry_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-B8b-API-Spec-Registry-RoleC/Theo_1B_B8b_API_Spec_Registry_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-B8b-API-Spec-Registry Role-C. Apply EDITs 1–4 verbatim (each BEFORE anchor found exactly once; HALT on mismatch): EDIT 1 adds §2.8 Attachments to `spec/THEO_API_SPEC.md`; EDITs 2–4 update the Golden-Handler §6 registry (`theo_attachments`→HF-T2; new HF-T5 Blob upload SAS broker; intro note). Documentation-only; additive."*

*End of Role-C Verbatim-Edit Handoff.*
