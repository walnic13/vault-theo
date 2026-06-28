-- ============================================================================
-- Theo 1B — Tier B7 distillation watermark: theo_conversations.last_distilled_at
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
-- Additive: one nullable column + a supporting index. The distillation timer marks a
-- conversation distilled (sets last_distilled_at = now()) after processing it; a thread is
-- re-distilled only when it gains new activity (updated_at advances past last_distilled_at).
-- ============================================================================

ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS last_distilled_at timestamptz NULL;

-- Supports the timer's due-scan (idle + not-yet-distilled-since-last-activity).
CREATE INDEX IF NOT EXISTS idx_theo_conversations_distill_scan
  ON public.theo_conversations (updated_at)
  WHERE last_distilled_at IS NULL OR last_distilled_at < updated_at;
