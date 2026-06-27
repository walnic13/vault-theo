# Theo 1B — B2 Persistence Substrate (`theo_*` schema + RLS + Blob) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; the complete Walter-executable DDL is provided for Walter to deploy at Pass 3, after which Claude Code verifies via read-only SQL. **Microstep:** Tier B2 — stand up the `theo_*` Postgres persistence substrate (the 7 documented tables + RLS + helpers) and the Blob content container. This is the foundation the whole surface persists to and the base for the memory layer (C). No handler in scope (B3+ wires CRUD); B2 is schema + RLS + Blob only. Mirrors the deployed corporate-reporting ownership-RLS pattern exactly (four policies `TO authenticated` keyed on `auth.uid()`, `_exists_unscoped` SECURITY DEFINER helpers, `set_config` session context — all pre-existing in the shared `vaultgpt` instance).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `9e1620a8d7a12ffb93d3446d4d8e0c1e1e4658b4` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. P5 (handler grounding) is N/A — B2 is a schema/DDL tier with no handler in scope; substance is P3 (schema grounding) + P6 (SQL grounding). Full Baseline per Conformance §4 (backend plan).
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 VEP Format + Gap Register) | `Grep("Gap Register")` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5; §4A.1 P-track) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates; §2/§4) | `Read(offset=1, limit=30)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (SQL-grounding / migration sections) | `Grep("SQL")` this turn | `2ee83c036e21a5dabe3405b6532c3471c680da0b` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A roles; §1B DR-T2) | `Grep("the model swap point")` this turn | `69c8b54ab17211bdd7840ce78a66db55ca9a9c94` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (Tier B2; D-5) | `Grep("Complete Walter-executable DDL for the" / "Azure Blob for artifact-version")` this turn | `1733bdf19053d7173b72bfa9f0cf64e725cfdd3f` |
| 7 | **Data-truth owner** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 conventions; §2 RLS; §3 table set) | `Read(full)` this turn | `32edb90e396c0cf1efd3c4659d7818ae01dccad3` |
| 8 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5 schema/RLS) | `Grep("ownership-based" / "RLS ENABLED" / "set_config")` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 — the persisted message/citation shape) | `Grep("may attach a \`citations\` array to text blocks")` this turn | `b5bbd57e1544404ffe98d92fd33e98c8dc4f0289` |
| 10 | Corporate-reporting RLS pattern (referenced mirror source, not forked) — `../corporate-reporting/REPORTING_AZURE_POSTGRES_SCHEMA.md` (§2 naming; §3 session/`auth.uid()`; §4 RLS matrix; §5 helper) | `Read(offset=94, limit=252)` this turn (firsthand, §2–§5) | blob `02c7503f0afb1555085a408686edbbfab38aab1b` (corporate-reporting `38da0d6a722de6042ece0a6c5979b13dff7da736`; `git cat-file -p` verifiable) |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` table read/write (additive `theo_*` namespace only).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Four separate policies per table" | §B2-DDL — every table gets the SELECT/INSERT/UPDATE/DELETE policy set |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "created_by text NOT NULL" | §B2-DDL — ownership column on every table |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "SECURITY DEFINER existence helper per table supporting update/delete" | §B2-DDL — `theo_<entity>_exists_unscoped(uuid)` helpers |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based (`created_by = auth.uid()`)" | §B2-DDL — all policies key on `auth.uid()` |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B2 | "Complete Walter-executable DDL for the" | §B2-DDL — the complete copy-paste migration |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §8 D-5 | "Azure Blob for artifact-version / knowledge content (pointer-in-Postgres)" | §B2-DDL Blob-pointer columns + §DEPLOY container |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T2 | "the model swap point" | §P1/§P2 — B2 is the persistence substrate beneath the DR-T2 gateway (auth/identity model unchanged) |

---

## P1 — Feature identification
**Role/Decision Register (Orchestration §1A/§1B):** Claude Code authors (Pass 1); Codex reviews (Pass 2); Walter executes the DDL + provisions Blob (Pass 3); Claude Code verifies (RO-SQL). **Microstep:** Theo Phase 1B **Tier B2** — the `theo_*` persistence substrate. The 1B plan front-loaded the stateless gateway (B0/B1/B1.7, deployed); B2 stands up the data layer everything persists to (the core of 1B) and the foundation for B3 (conversations/messages), B4 (projects/knowledge/artifacts/settings), and the memory layer (C). Per Walter (this turn): proceed with the four design recommendations — `app_key` free-text (no CHECK yet), `citations jsonb` on `theo_messages`, Blob for artifact-version bodies + large knowledge (messages inline), RO-SQL verification.

## P2 — Architecture & boundary reconciliation
- **Schema conventions (architecture §5.1 / schema §1):** `id uuid PK DEFAULT gen_random_uuid()`; ownership `created_by text NOT NULL` (Entra OID); server-managed `created_at`/`updated_at` (immutable tables omit `updated_at`); `theo_` prefix.
- **RLS (architecture §5.2 / schema §2; Rule Anchors 3,6):** RLS ENABLED on every table; **four separate policies** (SELECT/INSERT/UPDATE/DELETE), `TO authenticated`, ownership `created_by = auth.uid()` (settings keys on its `user_oid` PK). No `FOR ALL`, no `USING (true)`. `auth.uid()` + per-request `set_config` session context **pre-exist** in the shared `vaultgpt` instance (used by `reporting_*`); B2 references them, handlers set context in B3+.
- **Boundary (schema §4):** `theo_*` is net-new and additively namespaced; **no `reporting_*` read/write**; legacy early-Theo tables untouched. Mirrors the corporate-reporting ownership-RLS pattern (referenced, not forked).
- **Persistence backing (D-5):** structured → Postgres; large/opaque content (artifact-version bodies, large knowledge) → Blob, pointer-in-Postgres.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (closed vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Blob container (Walter, at deploy).** A storage container (`theo-content`) in the `vaultgpt` storage account is required before B4 writes artifact/knowledge bodies; B2 creates it now so the pointer columns have a target. | **PRE-LAND** — enumerated in §DEPLOY; no row writes Blob until B4, so B2's tables/RLS deploy independently. |
| G-2 | **`app_key` closed set (Walter-approved this turn).** Schema §3 envisions a CHECK-constrained closed set; the real set isn't settled (only `reporting`/`axis` deployed). | **PROCEED** — `app_key text NULL`, **no CHECK** in B2 (free-text), promotable to a CHECK / app-registry FK once the set settles (schema §3 "promotable"). Ownership RLS still fully applies. |
| G-3 | **`citations jsonb` on `theo_messages` (Walter-approved this turn).** Additive column beyond the documented set, to persist grounded-answer citations for reload + the memory layer. | **PROCEED** — additive, nullable; schema doc §3 row to be updated DEPLOYED with the column on land. |
| G-4 | **Memory tables (C).** `theo_user_memory` (distilled profile) + cross-chat history-RAG over `theo_messages` are **not** in B2. | **PROCEED** — by design; the memory layer is a separate tier/plan-amendment built on this substrate (`theo_messages` already carries the content + `citations` it will index). |
| G-5 | **ZDR / client-PII (D-3).** Persisting + replaying real client discussion content (incl. memory) implicates Anthropic-hosted ZDR. | **PRE-LAND** — gates client-PII go-live (same posture as B1 G-3/B1.7 G-4); non-PII dev test proceeds. B2 (schema only) carries no PII itself. |

## P3 — Schema grounding
DEPLOYED vs PROPOSED for every object B2 creates: all PROPOSED → DEPLOYED by this tier. The 7 tables match schema §3 exactly (`theo_conversations`, `theo_messages`, `theo_projects`, `theo_project_knowledge`, `theo_artifacts`, `theo_artifact_versions`, `theo_user_settings`). Additive beyond the documented columns: `theo_messages.seq` (ordering key, schema §3 "ordering key"), `theo_messages.citations jsonb` (G-3), Blob-pointer columns on `theo_artifact_versions` + `theo_project_knowledge` (D-5). `theo_apps`/`theo_app_tools` (CANDIDATE) are **out of scope** (1B decision, not B2). No `reporting_*` object touched. Schema doc updated DEPLOYED on land (Role-C).

## P4 — Contract grounding
No endpoint/contract change in B2 (no handler). The persisted shapes align the existing API Spec §2.1 surface (message `content` + `citations`) with durable storage; CRUD endpoints are authored in B3/B4. Route-naming convention `theo_<operation>_<entity>` unaffected.

## P5 — Handler grounding
**N/A — B2 is a schema/DDL tier with no handler in scope.** The Golden Handler Standard's Primary-Reference-handler requirement (§HG/T9) applies to handler tiers (B3+). B2's substance is the DDL (P6). The RLS/helper **shape** mirrors the deployed corporate-reporting pattern (referenced, not forked) — see §SM.

## SM — Structural Mirror (DDL ↔ corporate-reporting ownership-RLS pattern)
| Region | Classification | Basis |
| --- | --- | --- |
| `id uuid PK DEFAULT gen_random_uuid()`, `created_by text NOT NULL`, `created_at`/`updated_at timestamptz DEFAULT now()` | EXACT | reporting convention (schema §1) |
| `ALTER TABLE … ENABLE ROW LEVEL SECURITY` + four `CREATE POLICY` (SELECT `USING`, INSERT `WITH CHECK`, UPDATE `USING`+`WITH CHECK`, DELETE `USING`) `TO authenticated` keyed on `auth.uid()`, wrapped in idempotent `DO`/`pg_policies` guards; policy names `theo_<entity>_<verb>_own` | EXACT | reporting 4-policy DO-block pattern (schema §2) |
| `theo_<entity>_exists_unscoped(p_id uuid) RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public` + `GRANT EXECUTE … TO authenticated` | EXACT | reporting helper pattern (schema §1) |
| `auth.uid()` + per-request `set_config` session context | EXACT (pre-existing, referenced) | shared instance (reporting) |
| `theo_*` table/column names; FKs (`ON DELETE CASCADE`/`SET NULL`); immutable tables omit `updated_at`; `theo_messages.seq` ordering | ALLOWED DELTA | the microstep's specific schema (schema §3) |
| **Blob-pointer columns** (`blob_container`/`blob_path`/`byte_size`/`content_type`) on `theo_artifact_versions` + `theo_project_knowledge` | ALLOWED DELTA | D-5 (no reporting precedent; Walter-authorized §WA) |
| `theo_messages.citations jsonb`; `app_key text NULL` (no CHECK) | ALLOWED DELTA | Walter-authorized this turn (§WA; G-2/G-3) |
| `theo_user_settings` text PK (`user_oid`) + policies keyed on `user_oid = auth.uid()` | ALLOWED DELTA | settings keyed on the natural OID (schema §3) |

No DEVIATION regions.

## WA — Walter authorization (Conformance §10 T12 / Golden §4) — quoted verbatim, predating this VEP
> "we have azure postgres as our database and we will also use azure blob, we want memory persistence within a project and over the entire user and their own chats and projects"

> "go with your recommendations" (this turn — authorizing: `app_key` free-text no-CHECK; `citations jsonb` on `theo_messages`; Blob for artifact-version bodies + large knowledge with messages inline; RO-SQL verification)

Consistent with D-5 (RESOLVED: Postgres + Blob, pointer-in-Postgres).

## B2-DDL — Complete Walter-executable migration (copy-paste; plain SQL; idempotent; no BEGIN/COMMIT)
```sql
-- ============================================================================
-- Theo 1B — Tier B2: theo_* persistence substrate (schema + RLS + helpers)
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
-- RLS mirrors corporate-reporting ownership pattern: four policies per table
-- TO authenticated keyed on auth.uid() (= Entra OID in created_by). auth.uid() and the
-- per-request set_config session context pre-exist in the shared instance; handlers set
-- context in B3+. Creation order respects FKs.
-- ============================================================================

-- ---------- theo_projects (created first; others FK it) ----------
CREATE TABLE IF NOT EXISTS public.theo_projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by   text NOT NULL,
  name         text NOT NULL CHECK (length(trim(name)) > 0),
  instructions text NOT NULL DEFAULT '',
  app_key      text NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_projects_created_by ON public.theo_projects (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_projects_created_at_desc ON public.theo_projects (created_at DESC);
ALTER TABLE public.theo_projects ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_projects' AND policyname='theo_project_select_own') THEN
    CREATE POLICY "theo_project_select_own" ON public.theo_projects FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_projects' AND policyname='theo_project_insert_own') THEN
    CREATE POLICY "theo_project_insert_own" ON public.theo_projects FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_projects' AND policyname='theo_project_update_own') THEN
    CREATE POLICY "theo_project_update_own" ON public.theo_projects FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_projects' AND policyname='theo_project_delete_own') THEN
    CREATE POLICY "theo_project_delete_own" ON public.theo_projects FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_project_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_projects WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_project_exists_unscoped(uuid) TO authenticated;

-- ---------- theo_conversations ----------
CREATE TABLE IF NOT EXISTS public.theo_conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by  text NOT NULL,
  project_id  uuid NULL REFERENCES public.theo_projects(id) ON DELETE SET NULL,
  title       text NULL,
  model       text NULL,
  app_key     text NULL,
  app_context jsonb NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_conversations_created_by ON public.theo_conversations (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_conversations_created_at_desc ON public.theo_conversations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_theo_conversations_project_id ON public.theo_conversations (project_id);
ALTER TABLE public.theo_conversations ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_conversations' AND policyname='theo_conversation_select_own') THEN
    CREATE POLICY "theo_conversation_select_own" ON public.theo_conversations FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_conversations' AND policyname='theo_conversation_insert_own') THEN
    CREATE POLICY "theo_conversation_insert_own" ON public.theo_conversations FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_conversations' AND policyname='theo_conversation_update_own') THEN
    CREATE POLICY "theo_conversation_update_own" ON public.theo_conversations FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_conversations' AND policyname='theo_conversation_delete_own') THEN
    CREATE POLICY "theo_conversation_delete_own" ON public.theo_conversations FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_conversation_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_conversations WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_conversation_exists_unscoped(uuid) TO authenticated;

-- ---------- theo_messages (immutable: no updated_at) ----------
CREATE TABLE IF NOT EXISTS public.theo_messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      text NOT NULL,
  conversation_id uuid NOT NULL REFERENCES public.theo_conversations(id) ON DELETE CASCADE,
  seq             integer NOT NULL,
  role            text NOT NULL CHECK (role IN ('user','assistant')),
  content         text NOT NULL,
  model           text NULL,
  citations       jsonb NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, seq)
);
CREATE INDEX IF NOT EXISTS idx_theo_messages_conversation_id ON public.theo_messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_theo_messages_created_by ON public.theo_messages (created_by);
ALTER TABLE public.theo_messages ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_messages' AND policyname='theo_message_select_own') THEN
    CREATE POLICY "theo_message_select_own" ON public.theo_messages FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_messages' AND policyname='theo_message_insert_own') THEN
    CREATE POLICY "theo_message_insert_own" ON public.theo_messages FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_messages' AND policyname='theo_message_update_own') THEN
    CREATE POLICY "theo_message_update_own" ON public.theo_messages FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_messages' AND policyname='theo_message_delete_own') THEN
    CREATE POLICY "theo_message_delete_own" ON public.theo_messages FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
-- (immutable + cascade-delete only; no individual update/delete handler → no _exists_unscoped)

-- ---------- theo_project_knowledge (immutable; inline content OR Blob pointer) ----------
CREATE TABLE IF NOT EXISTS public.theo_project_knowledge (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by     text NOT NULL,
  project_id     uuid NOT NULL REFERENCES public.theo_projects(id) ON DELETE CASCADE,
  title          text NOT NULL CHECK (length(trim(title)) > 0),
  source_type    text NOT NULL DEFAULT 'text' CHECK (source_type IN ('text','file')),
  content        text NULL,
  blob_container text NULL,
  blob_path      text NULL,
  byte_size      bigint NULL,
  content_type   text NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_project_knowledge_project_id ON public.theo_project_knowledge (project_id);
CREATE INDEX IF NOT EXISTS idx_theo_project_knowledge_created_by ON public.theo_project_knowledge (created_by);
ALTER TABLE public.theo_project_knowledge ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_knowledge' AND policyname='theo_project_knowledge_select_own') THEN
    CREATE POLICY "theo_project_knowledge_select_own" ON public.theo_project_knowledge FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_knowledge' AND policyname='theo_project_knowledge_insert_own') THEN
    CREATE POLICY "theo_project_knowledge_insert_own" ON public.theo_project_knowledge FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_knowledge' AND policyname='theo_project_knowledge_update_own') THEN
    CREATE POLICY "theo_project_knowledge_update_own" ON public.theo_project_knowledge FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_project_knowledge' AND policyname='theo_project_knowledge_delete_own') THEN
    CREATE POLICY "theo_project_knowledge_delete_own" ON public.theo_project_knowledge FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_project_knowledge_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_project_knowledge WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_project_knowledge_exists_unscoped(uuid) TO authenticated;

-- ---------- theo_artifacts ----------
CREATE TABLE IF NOT EXISTS public.theo_artifacts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      text NOT NULL,
  conversation_id uuid NULL REFERENCES public.theo_conversations(id) ON DELETE SET NULL,
  project_id      uuid NULL REFERENCES public.theo_projects(id) ON DELETE SET NULL,
  title           text NOT NULL CHECK (length(trim(title)) > 0),
  type            text NOT NULL CHECK (type IN ('document','code','html')),
  current_version integer NOT NULL DEFAULT 1,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_theo_artifacts_created_by ON public.theo_artifacts (created_by);
CREATE INDEX IF NOT EXISTS idx_theo_artifacts_conversation_id ON public.theo_artifacts (conversation_id);
CREATE INDEX IF NOT EXISTS idx_theo_artifacts_project_id ON public.theo_artifacts (project_id);
ALTER TABLE public.theo_artifacts ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifacts' AND policyname='theo_artifact_select_own') THEN
    CREATE POLICY "theo_artifact_select_own" ON public.theo_artifacts FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifacts' AND policyname='theo_artifact_insert_own') THEN
    CREATE POLICY "theo_artifact_insert_own" ON public.theo_artifacts FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifacts' AND policyname='theo_artifact_update_own') THEN
    CREATE POLICY "theo_artifact_update_own" ON public.theo_artifacts FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifacts' AND policyname='theo_artifact_delete_own') THEN
    CREATE POLICY "theo_artifact_delete_own" ON public.theo_artifacts FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
CREATE OR REPLACE FUNCTION public.theo_artifact_exists_unscoped(p_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.theo_artifacts WHERE id = p_id);
$$;
GRANT EXECUTE ON FUNCTION public.theo_artifact_exists_unscoped(uuid) TO authenticated;

-- ---------- theo_artifact_versions (immutable; Blob pointer content) ----------
CREATE TABLE IF NOT EXISTS public.theo_artifact_versions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by     text NOT NULL,
  artifact_id    uuid NOT NULL REFERENCES public.theo_artifacts(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  blob_container text NOT NULL,
  blob_path      text NOT NULL,
  byte_size      bigint NULL,
  content_type   text NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (artifact_id, version_number)
);
CREATE INDEX IF NOT EXISTS idx_theo_artifact_versions_artifact_id ON public.theo_artifact_versions (artifact_id);
ALTER TABLE public.theo_artifact_versions ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifact_versions' AND policyname='theo_artifact_version_select_own') THEN
    CREATE POLICY "theo_artifact_version_select_own" ON public.theo_artifact_versions FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifact_versions' AND policyname='theo_artifact_version_insert_own') THEN
    CREATE POLICY "theo_artifact_version_insert_own" ON public.theo_artifact_versions FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifact_versions' AND policyname='theo_artifact_version_update_own') THEN
    CREATE POLICY "theo_artifact_version_update_own" ON public.theo_artifact_versions FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_artifact_versions' AND policyname='theo_artifact_version_delete_own') THEN
    CREATE POLICY "theo_artifact_version_delete_own" ON public.theo_artifact_versions FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
-- (immutable + cascade-delete only → no _exists_unscoped)

-- ---------- theo_user_settings (text PK = Entra OID; keyed on user_oid) ----------
CREATE TABLE IF NOT EXISTS public.theo_user_settings (
  user_oid            text PRIMARY KEY,
  style_key           text NOT NULL DEFAULT 'normal' CHECK (style_key IN ('normal','concise','explanatory','formal')),
  custom_instructions text NOT NULL DEFAULT '',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.theo_user_settings ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_settings' AND policyname='theo_user_settings_select_own') THEN
    CREATE POLICY "theo_user_settings_select_own" ON public.theo_user_settings FOR SELECT TO authenticated USING (user_oid = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_settings' AND policyname='theo_user_settings_insert_own') THEN
    CREATE POLICY "theo_user_settings_insert_own" ON public.theo_user_settings FOR INSERT TO authenticated WITH CHECK (user_oid = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_settings' AND policyname='theo_user_settings_update_own') THEN
    CREATE POLICY "theo_user_settings_update_own" ON public.theo_user_settings FOR UPDATE TO authenticated USING (user_oid = auth.uid()) WITH CHECK (user_oid = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_user_settings' AND policyname='theo_user_settings_delete_own') THEN
    CREATE POLICY "theo_user_settings_delete_own" ON public.theo_user_settings FOR DELETE TO authenticated USING (user_oid = auth.uid());
  END IF;
END $$;
-- (upsert by own PK = user_oid → no _exists_unscoped)
```

## P6 — SQL grounding
The §B2-DDL above is the complete Walter-executable migration (Rule Anchor 7): plain PostgreSQL, no top-level transaction control, idempotent (`CREATE TABLE/INDEX IF NOT EXISTS`, `pg_policies`-guarded `DO` policy blocks, `CREATE OR REPLACE FUNCTION`), RLS + four policies + helper + GRANT co-located per table. No placeholders. Blob bodies are written by B4 handlers; B2 only declares the pointer columns + (via §DEPLOY) the container.

## P7 / VERIFY — Read-only verification (Claude Code runs post-deploy)
Claude Code runs read-only `SELECT`s (no writes) against the shared instance to confirm the substrate, capturing results under `.local/`:
```sql
-- tables present (expect 7)
SELECT table_name FROM information_schema.tables
 WHERE table_schema='public' AND table_name LIKE 'theo\_%' ORDER BY table_name;
-- RLS enabled + policy count per table (expect rowsecurity = true; 4 policies each)
SELECT c.relname, c.relrowsecurity, count(p.policyname) AS policies
  FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  LEFT JOIN pg_policies p ON p.schemaname='public' AND p.tablename=c.relname
 WHERE n.nspname='public' AND c.relname LIKE 'theo\_%' AND c.relkind='r'
 GROUP BY c.relname, c.relrowsecurity ORDER BY c.relname;
-- _exists_unscoped helpers present (expect 4: project, conversation, project_knowledge, artifact)
SELECT proname FROM pg_proc WHERE proname LIKE 'theo\_%\_exists_unscoped' ORDER BY proname;
```

## DEPLOY — Walter deploy steps (DDL + Blob container; no handler, no dependency)
1. Execute the §B2-DDL migration against the shared `vaultgpt` Azure Postgres instance (Azure Portal query editor / psql), as the migration-capable role. No `pgadmin_vault`; no app-role write needed for DDL.
2. Create a Blob **container** named `theo-content` in the `vaultgpt` storage account (private access). No blobs written until B4; B2 only needs the container to exist as the pointer target.
3. Notify Claude Code to run the §VERIFY read-only SQL.

## P8 — VEP assembly + mechanical lint
GCR (§3) + Rule Anchor Table (§5) open the pack; P1–P8 walked (P5 N/A — schema tier); Gap Register present (G-1…G-5); §SM classifies every DDL region (no DEVIATION); §WA quotes the authorization; §B2-DDL is the complete copy-paste migration. On Codex APPROVAL, Walter executes §B2-DDL + creates the Blob container; Claude Code runs §VERIFY.

```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/Theo_1B_B2_Persistence_Substrate_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-B2-Persistence-Substrate-Pass-1-VEP/Theo_1B_B2_Persistence_Substrate_VEP.md
exit code: 0
```
(Codex re-runs the same command per its §1A hard gates.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B2 Persistence Substrate Pass-1 Backend VEP (plan only).*
