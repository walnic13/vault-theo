-- Theo — key a project to an external reference (owner + app_key + source_ref).
-- ---------------------------------------------------------------------------
-- Why: a host app (Sigma's review dock) needs each durable external entity — a K-1 review, keyed by its
-- sigma_review_id — to map to exactly ONE Theo project, idempotently and race-safely, so review chats
-- live in a stable per-review project. `theo_projects` today has `app_key` but no external-entity key.
-- This adds a nullable `source_ref text` + a PARTIAL UNIQUE index on (created_by, app_key, source_ref)
-- WHERE source_ref IS NOT NULL, so theo_get_or_create_review_project can INSERT ... ON CONFLICT DO
-- UPDATE (get-or-create). Generic — any app_key may key a project to its own external ref; existing
-- projects (source_ref NULL) are unconstrained.
--
-- Idempotent; no top-level transaction control (Golden Handler §5.2). Walter executes as pgadmin_vault.
-- RLS unchanged: `source_ref` is a new column on the existing RLS-governed theo_projects; the deployed
-- owner-scoped policies already cover it.

alter table public.theo_projects
  add column if not exists source_ref text;

create unique index if not exists theo_projects_owner_app_ref_uk
  on public.theo_projects (created_by, app_key, source_ref)
  where source_ref is not null;

comment on column public.theo_projects.source_ref is
  'Optional external-entity key: the host app''s durable id for the entity this project represents (e.g. Sigma sigma_review_id). Unique per (created_by, app_key, source_ref) via theo_projects_owner_app_ref_uk (partial, WHERE source_ref IS NOT NULL). Written by theo_get_or_create_review_project; NULL for ordinary user-created projects.';
