# THEO AZURE POSTGRES SCHEMA

Scope: Vault Theo data layer (the `theo_` section of the shared `vaultgpt` Azure Postgres instance). **Data truth** owner.
Filename / location: `spec/THEO_AZURE_POSTGRES_SCHEMA.md`.

> **Status: v0.2 — Tier B2 DEPLOYED (2026-06-27).** This document fixes the `theo_` conventions, the RLS baseline, and the structural table set, and records the concrete `CREATE TABLE` / policy / function DDL as each Phase 1B tier deploys (architecture §8.4). **Tier B2** (the 7-table persistence substrate + RLS + `_exists_unscoped` helpers) is **DEPLOYED + read-only-verified** — see §5; remaining tiers (B3+ handlers, memory layer) accrete here as they land. The §1 conventions, §2 RLS baseline, and §3 table set are reconciled byte-preserving against `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §5. No DDL is invented; the canonical deployed DDL is the version-controlled migration cited in §5.

---

## §1 Conventions (BINDING — architecture §5.1)

- All Theo tables use the **`theo_` prefix**, plural snake_case nouns.
- Canonical ownership column: **`created_by text NOT NULL`** storing the authenticated **Entra OID** of the row creator. (Legacy early-Theo `user_id` is NOT carried forward.)
- Primary key: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()` (except registry/settings tables keyed on a natural text identifier).
- Timestamps: `created_at timestamptz NOT NULL DEFAULT now()`, `updated_at timestamptz NOT NULL DEFAULT now()` (server-managed; client-supplied `updated_at` ignored). Immutable tables OMIT `updated_at`.
- SECURITY DEFINER existence helper per table supporting update/delete: `theo_<entity>_exists_unscoped(uuid) -> boolean`, for 403/404 discrimination.

## §2 RLS Baseline (BINDING — architecture §5.2)

- RLS ENABLED on every Theo table.
- **Four separate policies per table** (SELECT / INSERT / UPDATE / DELETE). No `FOR ALL`. No `USING (true)`.
- Policies target `authenticated` and key on `auth.uid()` (= the Entra OID in `created_by`); session context set per request.
- Default family: ownership-based (`created_by = auth.uid()`). Membership/sharing models are introduced only by explicit Walter-authorized schema update.

## §3 Structural Table Set (DDL DEPLOYED — Tier B2 §5; Tier B7a §6; Tier B8a §7)

| Table | Purpose | Notes | Status |
|-------|---------|-------|--------|
| `theo_conversations` | Chat thread | `app_key text NULL`, `app_context jsonb NULL`, `project_id uuid NULL` FK→`theo_projects` ON DELETE SET NULL, `title`, `model`. The app-context primitive lives here. | DEPLOYED — B2 (§5) |
| `theo_messages` | Turn within a thread | `conversation_id` FK ON DELETE CASCADE; `seq` (ordering key, UNIQUE per conversation), `role` (CHECK user/assistant), `content`, `model`, `citations jsonb NULL` (web-grounding citations). Immutable — no `updated_at`. | DEPLOYED — B2 (§5) |
| `theo_projects` | Project (instructions + knowledge scope) | `name` (CHECK not-blank), `instructions`, optional `app_key`. | DEPLOYED — B2 (§5) |
| `theo_project_knowledge` | Knowledge source under a project | `project_id` FK ON DELETE CASCADE; `title`, `source_type` (CHECK text/file); inline `content` OR Blob pointer (`blob_container`/`blob_path`/`byte_size`/`content_type`). RAG-indexed. Immutable. | DEPLOYED — B2 (§5) |
| `theo_artifacts` | Artifact record | Optional `conversation_id` / `project_id` (FK ON DELETE SET NULL); `title`, `type` (CHECK document/code/html), `current_version int`. | DEPLOYED — B2 (§5) |
| `theo_artifact_versions` | Versioned artifact content | `artifact_id` FK ON DELETE CASCADE; `version_number` (UNIQUE per artifact); content via Blob pointer (`blob_container`/`blob_path`/`byte_size`/`content_type`). Immutable. | DEPLOYED — B2 (§5) |
| `theo_user_settings` | Per-user style + custom instructions (Customize) | Text PK = Entra OID (`user_oid`); `style_key` (CHECK), `custom_instructions`. RLS keys on `user_oid = auth.uid()`. Prepended to system prompt. | DEPLOYED — B2 (§5) |
| `theo_user_memory` | Distilled per-user memory (Memory Layer, option C) | `scope text` (`'user'`\|`'project'`), `project_id uuid NULL` FK→`theo_projects` ON DELETE CASCADE, `kind text`, `content text` (non-empty), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `salience int`. CHECK: `scope='project'` iff `project_id` set. Mutable. Injected at system-prompt assembly. | DEPLOYED — B7a (§6) |
| `theo_attachments` | File attached to a chat (Attachments, Tier B8) | `conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `filename text` (non-empty CHECK), `content_type text`, `byte_size bigint` (CHECK `>= 0`), `blob_container`/`blob_path` (pointer into the existing `theo-content` container), `ingestion_class text` + `extracted_text_path text NULL` (B8c extraction metadata). Body lives in Blob; the row holds only the pointer. | DEPLOYED — B8a (§7) + B8c addendum |
| `theo_apps` / `theo_app_tools` *(candidate)* | Registry of apps + Theo-callable endpoints (backs the Tool Manifest) | May start as config rather than tables; 1B decides (architecture §9 open item 1). | CANDIDATE — 1B decision |

`app_key` is **`text NULL` (no CHECK)** as deployed in B2 (Walter-approved 2026-06-27) — free-text, promotable to a CHECK-constrained closed set / FK'd app registry once the app set settles.

## §4 Boundary (BINDING)

Theo tables are net-new and additively namespaced in the shared `vaultgpt` instance. Theo MUST NOT read or write Corporate Reporting (`reporting_*`) tables directly (architecture §0a/§1.3/§4.3). Legacy early-Theo tables (`conversations`, `chat_messages`, `theo_users`, etc.) are NOT preserved/migrated and MUST NOT be built on or dropped without explicit Walter direction (architecture §7).

## §5 DEPLOYED DDL — Tier B2 (2026-06-27)

**Status:** DEPLOYED + read-only-verified against the shared `vaultgpt-postgres-prod` instance (schema `public`). Verification (catalog read-only): 7 `theo_*` tables present, each with RLS enabled + 4 policies; 4 `_exists_unscoped` helpers (`theo_project`, `theo_conversation`, `theo_project_knowledge`, `theo_artifact`). Blob container `theo-content` created in storage account `vaultgptstorage01` (UK South).

**Canonical DDL (single source of truth):** the verbatim, Walter-executed migration is the version-controlled file
`Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/b2_migration.sql` (committed `c74445`; authored in the B2 VEP §B2-DDL, Codex-APPROVED at `6eeafcd`). It is **not duplicated here** to avoid two divergent copies; that migration is the authoritative deployed DDL. Read-only verification queries: `…/b2_verify.sql`.

**As-built specifics (mirrors the corporate-reporting ownership-RLS pattern):**
- Conventions (§1): `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`, `created_by text NOT NULL` (Entra OID), `created_at`/`updated_at timestamptz NOT NULL DEFAULT now()`; immutable tables (`theo_messages`, `theo_project_knowledge`, `theo_artifact_versions`) omit `updated_at`.
- RLS (§2): every table RLS-enabled with four `TO authenticated` policies keyed on `auth.uid()` — SELECT `USING`-only, INSERT `WITH CHECK`-only, UPDATE `USING`+`WITH CHECK`, DELETE `USING`-only; policy names `theo_<entity>_<verb>_own`. `theo_user_settings` keys on its `user_oid` PK. `auth.uid()` + per-request `set_config` session context pre-exist in the shared instance (handlers set context in B3+).
- Helpers (§1): `theo_<entity>_exists_unscoped(p_id uuid) RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public` + `GRANT EXECUTE … TO authenticated`, for the four tables supporting individual update/delete (projects, conversations, project_knowledge, artifacts). Immutable + cascade-only tables and the upsert-by-PK settings table carry no helper.
- Additive vs the §3 column sketch (Walter-approved 2026-06-27): `theo_messages.seq` (ordering key) + `theo_messages.citations jsonb` (web-grounding citations); Blob-pointer columns on `theo_artifact_versions` (content body) + `theo_project_knowledge` (large content) per D-5; `app_key text NULL` with no CHECK (free-text, promotable).
- Boundary: no `reporting_*` object touched; the legacy `theo_users`/`conversations`/`chat_messages` tables are untouched (decommission is a separate Walter ops task).

## §6 DEPLOYED DDL — Tier B7a (2026-06-28)

**Status:** DEPLOYED + read-only-verified against `vaultgpt-postgres-prod` (schema `public`). Verification (catalog read-only): `theo_user_memory` present, RLS enabled with four `TO authenticated` policies keyed on `created_by = auth.uid()`; `theo_user_memory_exists_unscoped(uuid)` helper present; CHECKs — `content` non-empty, `scope IN ('user','project')`, and `scope='project'` iff `project_id IS NOT NULL`.

**Canonical DDL (single source of truth):** `Codex Governance/Theo-1B-B7a-Memory-Substrate-Schema-Pass-1-VEP/b7a_migration.sql` (Codex-APPROVED at `631c9a54`); read-only verification `…/b7a_verify.sql`. Not duplicated here.

**As-built specifics (mirrors the §5 ownership-RLS idiom):** `theo_user_memory` is the distilled per-user memory profile (Memory Layer option C). Columns: `scope text` (`'user'`|`'project'`), `project_id uuid NULL` FK→`theo_projects` ON DELETE CASCADE, `kind text`, `content text` (non-empty CHECK), `source_conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL, `salience int`, plus `id`/`created_by`/`created_at`/`updated_at` per §1 (mutable — carries `updated_at`). Per-user isolation is ALSO enforced by explicit `created_by = $oid` predicates in the B7a CRUD handlers (the shared Functions connection role bypasses RLS — see the SEC user-isolation fix); RLS is the defence-in-depth second layer. Boundary: net-new additive table; no `reporting_*` touched.

## §7 DEPLOYED DDL — Tier B8a (2026-06-28)

**Status:** DEPLOYED + read-only-verified against `vaultgpt-postgres-prod` (schema `public`). Verification (catalog read-only): `theo_attachments` present, RLS enabled with four `TO authenticated` policies keyed on `created_by = auth.uid()` (`theo_attachment_<verb>_own`); `theo_attachment_exists_unscoped(uuid)` SECURITY DEFINER helper present; constraints — `conversation_id` FK→`theo_conversations(id)` ON DELETE SET NULL, `byte_size >= 0`, `filename` non-empty.

**Canonical DDL (single source of truth):** `Codex Governance/Theo-1B-B8a-Attachments-Schema-Pass-1-VEP/b8a_migration.sql` (Codex-APPROVED; deployed by Walter); read-only verification `…/b8a_verify.sql`. Not duplicated here.

**As-built specifics (mirrors the §5 ownership-RLS idiom):** `theo_attachments` is the storage substrate for files a user attaches to a chat (Attachments, Tier B8). Columns: `conversation_id uuid NULL` FK→`theo_conversations` ON DELETE SET NULL (an attachment survives deletion of its chat), `filename text` (non-empty CHECK), `content_type text`, `byte_size bigint` (CHECK `>= 0`), `blob_container`/`blob_path` (pointer into the existing `theo-content` Blob container), plus `id`/`created_by`/`created_at` per §1. Immutable file metadata — no `updated_at`. The file body lives in Blob; the row holds only the pointer. Per-user isolation is enforced by RLS (this table) AND by explicit `created_by = $oid` predicates in the Tier B8 handlers. Boundary: net-new additive table; no `reporting_*` touched. **Tier B8c addendum (DEPLOYED 2026-06-29):** additive `ingestion_class text` (`native`\|`extract`\|`stored`; free-text, no CHECK — promotable like `app_key`) + `extracted_text_path text NULL` (Blob pointer to the extracted text for extract-class attachments; NULL for native or when extraction has not run). Set by `theo_finalize_attachment` (B8c): extract-class uploads (Excel/Word/PPT/CSV/TXT) are text-extracted in-process at finalize and stored as a sibling `…/<attachmentId>.extracted.md` blob. The new columns inherit the table's four ownership policies. Canonical DDL: `Codex Governance/Theo-1B-B8c-Attachment-Extraction-Pass-1-VEP/b8c_addendum.sql`. **Tier B8i addendum (DEPLOYED 2026-06-30):** additive `message_seq int` NULL — the `theo_messages.seq` of the user turn an attachment was sent with (set by `theo_message` at send; NULL when never sent in a message, or for pre-B8i rows). No CHECK/FK (a per-conversation ordinal, not a global key — same promotable posture as `ingestion_class`); inherits the table's four ownership policies; no backfill. Lets a reloaded thread draw per-message attachment chips (read via `theo_list_conversation_attachments`). Canonical DDL: `Codex Governance/Theo-1B-B8i-Reload-Parity-Backend-Pass-1-VEP/b8i_addendum.sql`.
