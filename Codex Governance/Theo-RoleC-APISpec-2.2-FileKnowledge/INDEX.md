# Role-C Verbatim-Edit Handoff — API Spec §2.2: file-backed project knowledge (DEPLOYED)

Pass-4 Role-C documentation amendment. Records in the Theo API Spec §2.2 that **file-backed project knowledge is now DEPLOYED** — the `theo_add_project_knowledge_file` handler shipped to `vaultgpt-func-projects` (Projects Phase C, 2026-07-24; DR-T12 deploy authority, DR-T13 run-from-package model) and golden-curl-verified live **end-to-end** (GC1 401 / GC2 400 unknown-field / GC3 400 bad-uuid / GC4 404 ownership / **GC5 201** file-knowledge happy-path — uploaded a `.txt`, finalize-extracted, `201` with `source_type='file'` + the extracted text as `content` / **GC6 400** `UNSUPPORTED_MEDIA_TYPE` on a native no-text `.png` — full contract confirmed; test project + attachments deleted after). Two edits to `spec/THEO_API_SPEC.md` §2.2: (1) flip the existing "file-backed knowledge … deferred" note to DEPLOYED (RAG retrieval remains deferred); (2) add the `theo_add_project_knowledge_file` contract row. No code/schema/handler change — this documents the already-deployed contract so the Phase C FE VEP may cite the route (per the "FE VEP citing a fresh route needs the API-Spec Role-C applied first" sequence).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `d75b19122671a30de76cd2f30b40585b97b9d336` (vault-theo, `development`; grounding parent `9368e662f812d42a658081c43b613c5ca473bcd3`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding (Governor documentation-update sections + target document + this Standard). Deploy evidence: `theo_add_project_knowledge_file` live on `vaultgpt-func-projects`; **golden curls GC1–GC6 run this session end-to-end** — 401 (no bearer) / 400 (unknown field) / 400 (bad uuid) / 404 (unowned project) / **201** (happy path: created a project, uploaded a `.txt` via `theo_create_attachment_upload`→`theo_finalize_attachment`, then `201` `source_type='file'`, `content` = extracted text) / **400 `UNSUPPORTED_MEDIA_TYPE`** (native `.png`, no extracted text). Test project + both attachments deleted after verification.

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo API Spec (target — §2.2 project knowledge) — `spec/THEO_API_SPEC.md` | `Read`+`Grep` this turn | `4d2e23d096dbc6b89e0f48bc009ebfc5cf283215` |
| 2 | Claude Code Theo Governor Standard (Verbatim-Edit Handoff) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11) | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.2 | "reusing the B8 upload pipeline" | Edit 1 — the deferred-note sentence being flipped to DEPLOYED |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.2 | "add / list / remove project knowledge" | Edit 2 — new file-knowledge contract row inserted after this row |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | Edits 1–2 below are exact before/after blocks (Edit 2 is a pure new-row insertion) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edits to `spec/THEO_API_SPEC.md`

### Edit 1 — §2.2 existing "add / list / remove project knowledge" row: flip the deferred note (replace the sentence)
BEFORE (exact substring within the row):
```
Text knowledge only (`source_type='text'`, inline `content`); file-backed knowledge (`source_type='file'` + Blob pointer, reusing the B8 upload pipeline) and RAG retrieval (HF-T4, Tier B6) are deferred.
```
AFTER:
```
Text knowledge via this endpoint (`source_type='text'`, inline `content`); **file-backed knowledge** (`source_type='file'` + Blob pointer, reusing the B8 upload pipeline) is **DEPLOYED** via `theo_add_project_knowledge_file` (next row; Projects Phase C, 2026-07-24). RAG retrieval (HF-T4, Tier B6) remains deferred.
```

### Edit 2 — §2.2: insert a new contract row immediately after the "add / list / remove project knowledge" row
INSERT (new table row directly below that row):
```
| add project knowledge from a file (file-backed) | `1B-deployed` — **DEPLOYED 2026-07-24** (Projects Phase C; on the dedicated `vaultgpt-func-projects` app, DR-T12 deploy authority + DR-T13 run-from-package model; golden-curl-verified end-to-end, full contract 401/400/400/404/201/400): `POST /api/theo_add_project_knowledge_file` `{ project_id (uuid), attachment_id (uuid), title? (≤200) }` → **201** `{ knowledge: { id, project_id, title, source_type, content, created_at } }` with `source_type='file'`. Verifies the parent project is owned (404 else); owner-scoped-looks-up the `theo_attachments` row; reads its `extracted_text_path` sibling blob via managed identity; INSERTs a `theo_project_knowledge` row with `source_type='file'`, the extracted text as `content` (capped 100 000 chars, truncation-marked), and the original file's blob pointer carried through (`blob_container`/`blob_path`/`byte_size`/`content_type`). Reuses the B8 upload pipeline (`theo_create_attachment_upload` → `theo_finalize_attachment`, which extracts text at finalize). Only attachments with extracted text (extract-class Excel/Word/PPT/CSV/TXT + PDFs > 3 MB) are accepted; native PDFs ≤ 3 MB / images → **400** `UNSUPPORTED_MEDIA_TYPE`. Unknown body field / bad uuid → 400; project not owned or attachment absent → 404; extracted-text blob read failure → 502; no OID → 401. Response shape mirrors `theo_add_project_knowledge`, so the FE `toKnowledge` mapping + `theo_list_project_knowledge` are unchanged. | `theo_project_knowledge` (HF-T2; file-backed via `source_type='file'` + blob-pointer columns, already deployed in b2_migration.sql) + Blob `theo-content` (managed identity) |
```

## Boundary / no-drift
- One governed doc edited (`spec/THEO_API_SPEC.md` §2.2), two additive edits. No code/schema/handler change; documents an already-deployed + golden-curl-verified contract.
- The `theo_add_project_knowledge` / `theo_list_project_knowledge` / `theo_remove_project_knowledge` rows are otherwise unchanged; only the deferred-note sentence is flipped (RAG retrieval remains correctly deferred to Tier B6 / Phase D).
- After landing, the Phase C FE VEP (drop-zone) may cite `POST /api/theo_add_project_knowledge_file`.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-RoleC-APISpec-2.2-FileKnowledge/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review of these two verbatim edits (APPROVED / REJECTED only). On APPROVED, Claude Code applies them byte-faithfully to `spec/THEO_API_SPEC.md` and commits, then authors the Phase C FE drop-zone VEP citing the now-documented route.
