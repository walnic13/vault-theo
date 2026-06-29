# THEO API SPEC

Scope: Vault Theo backend API. **Contract truth** owner — written before handlers exist (architecture §8.1).
Filename / location: `spec/THEO_API_SPEC.md`.

> **Status: v0.1 SKELETON — contract surface for 1A; deployed contracts finalized in 1B.** Per architecture §8.1, the frontend builds against **contracts, not handlers**. This document enumerates the contract surface the 1A frontend codes against; in 1A the gateway + persistence are **mocked** behind a single service module (1A handover §2.2/§2.3), and the real handlers are authored 1B (architecture §8.4). Each entry carries a status: **`1A-contract`** (thin request/response the 1A surface builds against, mocked) and/or **`1B-deployed`** (becomes a real `theo_*` handler in 1B). Field-level shapes are locked in 1A against the **canonical reference surface** (VA-T1, pending byte-preserving delivery) and finalized in 1B; nothing here invents a deployed shape. The Corporate Reporting endpoints Theo *calls* are NOT specified here — they live in the canonical Corporate Reporting API Spec and are referenced via `spec/THEO_TOOL_MANIFEST.md`.

---

## §1 Conventions

- Route naming: `theo_<operation>_<entity>` (e.g. `theo_create_project`).
- Every endpoint executes **as the signed-in user** (Entra OID), honouring deployed RLS (architecture §3.3 / §5.2). No service-credential reads except (a) an explicit SECURITY DEFINER existence helper, or (b) an explicit SECURITY DEFINER enumeration helper invoked only by scheduled (timer) handlers, returning ONLY identifiers + owner ids (no user content), whose results are processed per-owner under that owner's session context.
- The **model gateway** request/response is the **standard Anthropic Messages API shape** (architecture §2.2) so tool wiring / streaming / prompt caching are model-agnostic; the gateway is the only credential holder and the model swap point.
- Status codes, validation (reject unknown/extra fields), and no-leakage responses follow the Theo Golden Handler Standard.

## §2 Contract Surface (1A) → Deployed Endpoints (1B)

Grouped by the 1A handover §2.3 contract list. Operation-level only at v0.1; request/response field shapes are locked during 1A against the canonical reference surface and finalized in 1B.

### §2.1 Chat / model gateway — backs Chats surface
| Contract | Shape | Status | Backing |
|----------|-------|--------|---------|
| Send message → assistant reply | Standard Anthropic Messages API (`model`, `max_tokens`, `system`, `messages[]`); response `content[]` filtered to `type:"text"`; `web_search`/`web_fetch` grounding (B1.7) may attach a `citations` array to text blocks — each entry `{ type:"web_search_result_location", url, title, cited_text, encrypted_index }` (additive, backward-compatible); artifact markers `[[ARTIFACT …]]` parsed client-side | `1A-contract` (mock gateway) / `1B-deployed` — **DEPLOYED 2026-06-26** (`POST /api/theo_message`) | HF-T1 model gateway broker |
| Persist turn (durable chats) | request additionally accepts optional `conversation_id` (UUID; omit to start a new thread), `app_key`, `app_context`; response returns `conversation_id`; the new user turn + assistant reply (with any `citations`) are persisted under ownership RLS; invalid `conversation_id` → 400, not-owned → 403, not-found → 404 | `1B-deployed` — **DEPLOYED 2026-06-27** (B3a; `POST /api/theo_message`) | `theo_conversations` + `theo_messages` (HF-T2) |
| List conversations → Recents | `GET /api/theo_list_conversations` (optional `?limit`, integer 1..200, default 50; malformed → 400); response `{ conversations: [{ id, title, model, project_id, app_key, created_at, updated_at }] }` newest-first, RLS-scoped to the signed-in user | `1B-deployed` — **DEPLOYED 2026-06-27** (B3b) | `theo_conversations` (HF-T2) |
| Get conversation → reload thread | `GET /api/theo_get_conversation?conversationId=<uuid>`; response `{ conversation, messages: [{ id, seq, role, content, model, citations, created_at }] }` ordered by `seq`; persisted `citations` returned for assistant turns; invalid id → 400, not-found → 404, not-owned → 403 | `1B-deployed` — **DEPLOYED 2026-06-27** (B3b) | `theo_conversations` + `theo_messages` (HF-T2) |

### §2.2 Projects — backs Projects surface
| Contract | Status | Backing |
|----------|--------|---------|
| list / create / patch-instructions projects | `1A-contract` (in-memory) / `1B-deployed` | `theo_projects` (HF-T2) |
| add / remove project knowledge | `1A-contract` / `1B-deployed` | `theo_project_knowledge` (HF-T2); RAG-indexed in 1B |

### §2.3 Artifacts — backs Artifacts surface + side panel
| Contract | Status | Backing |
|----------|--------|---------|
| create (from reply markers) / list / fetch version | `1A-contract` (in-memory; versioned by reused title) / `1B-deployed` | `theo_artifacts` + `theo_artifact_versions` (HF-T2); versioned in Blob, indexed in Postgres in 1B |

### §2.4 Settings — backs Customize surface
| Contract | Status | Backing |
|----------|--------|---------|
| read / write style preset + custom instructions | `1A-contract` (in-memory; fed into system prompt) / `1B-deployed` | `theo_user_settings` (HF-T2) |

### §2.5 App-context — backs the header chip
| Contract | Status | Backing |
|----------|--------|---------|
| receive `{app_key, app_context}` from Origin; carry on conversation | `1A-contract` (presentational; carried on conversation, in-memory) / `1B-deployed` | `theo_conversations.app_key` / `app_context`; drives 1B tool-dispatch |

### §2.6 Tool dispatch + RAG (1B)
| Contract | Status | Backing |
|----------|--------|---------|
| App-action tool dispatch (published `reporting_*` etc. as the user) | `1B-deployed` (mocked-absent in 1A) | HF-T3 via `spec/THEO_TOOL_MANIFEST.md` |
| RAG retrieval (Azure AI Search; tax corpus + project knowledge, RLS-scoped) | `1A-contract` (mocked, stub results — architecture §6) / `1B-deployed` | HF-T4 |

### §2.7 Memory (option C; B7) — backs the memory controls + cross-chat recall
| Contract | Status | Backing |
|----------|--------|---------|
| list / create / update / delete user memory | `1B-deployed` — **DEPLOYED 2026-06-28** (B7a): `GET /api/theo_list_user_memory` (`?scope`=user\|project, `?projectId`), `POST /api/theo_create_user_memory`, `POST /api/theo_update_user_memory`, `POST /api/theo_delete_user_memory`. Per-user `created_by`-scoped (explicit predicate; the connection role bypasses RLS). Item shape `{ id, scope, project_id, kind, content, source_conversation_id, salience, created_at, updated_at }`; create validates the scope⟺project_id invariant + FK ownership (project / source conversation owned by the caller). | `theo_user_memory` (HF-T2; B7a) |
| distilled memory written from completed turns; injected at system-prompt assembly | `1B` (sequenced; D-7 distillation policy RESOLVED, D-3 ZDR RESOLVED) | distillation step → `theo_user_memory` (B7) |
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

No Theo endpoint reads/writes `reporting_*` tables. Corporate Reporting data is obtained only by calling the published Reporting API as the signed-in user, per `spec/THEO_TOOL_MANIFEST.md` (architecture §0a/§1.3/§4.3).
