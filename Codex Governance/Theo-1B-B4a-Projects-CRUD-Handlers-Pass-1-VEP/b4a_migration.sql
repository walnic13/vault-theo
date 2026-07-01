-- Theo Tier B4a — additive: project description column.
-- theo_projects gained name / instructions / app_key in B2 (§5). The Projects surface (and the
-- Claude-parity project cards) also carry a short, optional description. This adds it additively:
-- nullable, no CHECK (promotable, same posture as app_key / ingestion_class / message_seq).
-- New columns inherit the table's four ownership RLS policies automatically (RLS is table-scoped),
-- so no policy change is required. No top-level transaction control per the Golden SQL Standard
-- (§5.2); Walter executes.
ALTER TABLE public.theo_projects ADD COLUMN IF NOT EXISTS description text;
