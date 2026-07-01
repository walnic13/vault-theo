# Role-C Verbatim-Edit Handoff — Theo API Spec §2.3 (B4h artifacts persistence)

> Pass 4 documentation-update package (Conformance §4 Pass 4). Author = Claude Code (Role-C). Inline executor = Codex. Authority = the B4h endpoints deployed + golden-verified 2026-07-01 (backend VEP Codex-APPROVED `9c9c4d8`; capture `.local/b4h_artifacts_verify_2026-07-01.txt`). One edit to one target: replace the §2.3 Artifacts **placeholder** row (`1A-contract` skeleton) with the deployed `theo_upsert_artifact` / `theo_list_artifacts` / `theo_get_artifact` / `theo_delete_artifact` contract — mirroring how §2.2 Projects was finalized. Closes B4h-backend Gap Register G-2.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (Pass 4 documentation update)
Turn issued against HEAD: `9c9c4d8` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Role-C handoff finalizing Theo API Spec §2.3 (Artifacts) to the deployed B4h endpoints. Exact before/after for one edit to one target (`spec/THEO_API_SPEC.md`). No source/handler/schema change; documentation only. Codex executes verbatim per Codex Review §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `git grep -F "emits a Role-C Verbatim-Edit Handoff"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Pass 4 row; §3/§5) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `git grep -F "executes the directed edits"` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.3 Artifacts) | `Read(offset=39, limit=5)` this turn | `82cc8153151d9edfb6fd7fd4a6cfc70b0b3ebc49` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No `CLAUDE.local.md` edit (Conformance §12).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff" | This handoff's before/after edit format |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "executes the directed edits" | Execution instruction to Codex |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 Pass 4 | "Verbatim documentation edits to Governor" | Pass-4 turn type; edits the named target only |
| spec/THEO_API_SPEC.md | §2.3 | "Artifacts — backs Artifacts surface" | EDIT 1 target section (placeholder row replaced) |

---

## Edit set (1 verbatim edit, 1 target document)

Target `spec/THEO_API_SPEC.md` at HEAD `82cc815` (blob). Codex executes the edit verbatim; no substantive additions beyond the AFTER text.

---

### EDIT 1 — `spec/THEO_API_SPEC.md` — finalize the §2.3 Artifacts placeholder row to the deployed endpoints

**Locate (BEFORE):**

```
| create (from reply markers) / list / fetch version | `1A-contract` (in-memory; versioned by reused title) / `1B-deployed` | `theo_artifacts` + `theo_artifact_versions` (HF-T2); versioned in Blob, indexed in Postgres in 1B |
```

**Replace with (AFTER):**

```
| upsert / list / get / delete artifacts | `1B-deployed` — **DEPLOYED 2026-07-01** (B4h; golden-verified): `POST /api/theo_upsert_artifact` `{ title, type, content, conversation_id?, project_id? }` → **201** (new) / **200** (new version) `{ artifact: { id, conversation_id, project_id, title, type, current_version, created_at, updated_at, version_number } }` — create-or-add-version keyed by `(created_by, lower(title))` (mirrors the FE upsert; a reused title bumps `current_version`); `type` ∈ {document, code, html}; version **content stored in Blob** (`theo-content`, server-side via managed identity) — `theo_artifact_versions` holds the pointer (`blob_container`/`blob_path` + `byte_size`/`content_type`), not inline text; a supplied `conversation_id`/`project_id` is **verified owned** (`WHERE id AND created_by`) → 404 else (owner-scoped parent link). `GET /api/theo_list_artifacts` (optional `?conversationId=<uuid>`) → `{ artifacts: [{ id, conversation_id, project_id, title, type, current_version, created_at, updated_at }] }` newest-updated-first, RLS `created_by`-scoped (metadata only — no content). `GET /api/theo_get_artifact?artifactId=<uuid>` → `{ artifact: { …, versions: [{ version_number, content, byte_size, content_type, created_at }] } }` (each version's content read back from Blob). `POST /api/theo_delete_artifact` `{ id }` → `{ deleted: true, id }` (permanent; `theo_artifact_versions` cascade per FK, version blobs best-effort deleted). Invalid uuid / blank title / bad type / non-string content / bad `conversationId` → 400; existing-foreign → 403 / absent → 404 via `theo_artifact_exists_unscoped`. | `theo_artifacts` + `theo_artifact_versions` (HF-T2); version content in Blob (`theo-content`), pointer row in Postgres |
```

---

## Companion note (NOT executed here)

No companion edit required. The Schema doc §3/§5 already records `theo_artifacts` + `theo_artifact_versions` (Blob-pointer versions), the `theo_artifact_exists_unscoped` helper, and the child FK (`theo_artifact_versions.artifact_id` ON DELETE CASCADE). Only §2.3's contract text needed finalizing from the `1A-contract` placeholder to the deployed reality.

---

*End of Role-C Verbatim-Edit Handoff.*
