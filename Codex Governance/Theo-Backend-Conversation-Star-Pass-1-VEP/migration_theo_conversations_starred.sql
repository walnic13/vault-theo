-- Theo conversation Star — additive column. Run by Walter (write SQL is Walter-only).
-- Adds a per-conversation boolean star flag, default false, NOT NULL (backfills existing rows to false).
ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS starred boolean NOT NULL DEFAULT false;
