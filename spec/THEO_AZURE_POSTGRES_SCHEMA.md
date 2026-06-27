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

## §3 Structural Table Set (DDL DEPLOYED — Tier B2, §5)

| Table | Purpose | Notes | Status |
|-------|---------|-------|--------|
| `theo_conversations` | Chat thread | `app_key text NULL`, `app_context jsonb NULL`, `project_id uuid NULL` FK→`theo_projects` ON DELETE SET NULL, `title`, `model`. The app-context primitive lives here. | DEPLOYED — B2 (§5) |
| `theo_messages` | Turn within a thread | `conversation_id` FK ON DELETE CASCADE; `seq` (ordering key, UNIQUE per conversation), `role` (CHECK user/assistant), `content`, `model`, `citations jsonb NULL` (web-grounding citations). Immutable — no `updated_at`. | DEPLOYED — B2 (§5) |
| `theo_projects` | Project (instructions + knowledge scope) | `name` (CHECK not-blank), `instructions`, optional `app_key`. | DEPLOYED — B2 (§5) |
| `theo_project_knowledge` | Knowledge source under a project | `project_id` FK ON DELETE CASCADE; `title`, `source_type` (CHECK text/file); inline `content` OR Blob pointer (`blob_container`/`blob_path`/`byte_size`/`content_type`). RAG-indexed. Immutable. | DEPLOYED — B2 (§5) |
| `theo_artifacts` | Artifact record | Optional `conversation_id` / `project_id` (FK ON DELETE SET NULL); `title`, `type` (CHECK document/code/html), `current_version int`. | DEPLOYED — B2 (§5) |
| `theo_artifact_versions` | Versioned artifact content | `artifact_id` FK ON DELETE CASCADE; `version_number` (UNIQUE per artifact); content via Blob pointer (`blob_container`/`blob_path`/`byte_size`/`content_type`). Immutable. | DEPLOYED — B2 (§5) |
| `theo_user_settings` | Per-user style + custom instructions (Customize) | Text PK = Entra OID (`user_oid`); `style_key` (CHECK), `custom_instructions`. RLS keys on `user_oid = auth.uid()`. Prepended to system prompt. | DEPLOYED — B2 (§5) |
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
