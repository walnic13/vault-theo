# THEO AZURE POSTGRES SCHEMA

Scope: Vault Theo data layer (the `theo_` section of the shared `vaultgpt` Azure Postgres instance). **Data truth** owner.
Filename / location: `spec/THEO_AZURE_POSTGRES_SCHEMA.md`.

> **Status: v0.1 SKELETON — header only; DDL finalized in Phase 1B.** This document fixes the `theo_` conventions, the RLS baseline, and the structural table set so 1A can build against contracts shaped to it and 1B has a settled target. The concrete `CREATE TABLE` / policy / function DDL is authored **DEPLOYED** here step-by-step through Phase 1B (architecture §8.4). The content below is relocated from `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` §5 and **MUST be reconciled against that document once its canonical byte-preserving copy lands** (the foundation doc is currently pending delivery; §5 is the interim authority). No DDL is invented here.

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

## §3 Structural Table Set (architecture §5.3; DDL finalized in 1B)

| Table | Purpose | Notes | Status |
|-------|---------|-------|--------|
| `theo_conversations` | Chat thread | `app_key text NULL`, `app_context jsonb NULL`, `project_id uuid NULL`, `title`, `model`. The app-context primitive lives here. | PROPOSED — DDL 1B |
| `theo_messages` | Turn within a thread | `conversation_id` FK ON DELETE CASCADE; `role`, `content`, `model`, ordering key. Immutable — no `updated_at`. | PROPOSED — DDL 1B |
| `theo_projects` | Project (instructions + knowledge scope) | `name`, `instructions`, optional `app_key` scope. | PROPOSED — DDL 1B |
| `theo_project_knowledge` | Knowledge source under a project | `project_id` FK ON DELETE CASCADE; source pointer/title/type. RAG-indexed. | PROPOSED — DDL 1B |
| `theo_artifacts` | Artifact record | Optional `conversation_id` / `project_id`; `title`, `type`, current-version pointer. | PROPOSED — DDL 1B |
| `theo_artifact_versions` | Versioned artifact content | `artifact_id` FK ON DELETE CASCADE; `version_number`, `content`. Immutable version rows. | PROPOSED — DDL 1B |
| `theo_user_settings` | Per-user style + custom instructions (Customize) | Text PK = Entra OID. Prepended to system prompt. | PROPOSED — DDL 1B |
| `theo_apps` / `theo_app_tools` *(candidate)* | Registry of apps + Theo-callable endpoints (backs the Tool Manifest) | May start as config rather than tables; 1B decides (architecture §9 open item 1). | CANDIDATE — 1B decision |

`app_key` begins as a CHECK-constrained closed set; promotable to an FK'd app registry when app count warrants.

## §4 Boundary (BINDING)

Theo tables are net-new and additively namespaced in the shared `vaultgpt` instance. Theo MUST NOT read or write Corporate Reporting (`reporting_*`) tables directly (architecture §0a/§1.3/§4.3). Legacy early-Theo tables (`conversations`, `chat_messages`, `theo_users`, etc.) are NOT preserved/migrated and MUST NOT be built on or dropped without explicit Walter direction (architecture §7).
