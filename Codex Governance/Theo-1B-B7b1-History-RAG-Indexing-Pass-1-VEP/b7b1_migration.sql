-- ============================================================================
-- Theo 1B — Tier B7b-1 indexing watermark + cross-owner due-for-indexing enumeration helper
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent.
--
-- The history-RAG indexer is a scheduled (timer) job with NO signed-in user; like the distillation
-- timer it cannot satisfy the per-user RLS predicate on a cross-owner scan. This adds (1) an
-- independent `last_indexed_at` watermark (separate from last_distilled_at, so already-distilled
-- conversations are still picked up for indexing) and (2) a SECURITY DEFINER enumeration helper — the
-- sanctioned scheduled-job enumeration carve-out (Golden Handler §3 item 1(b) / API Spec §1) — that
-- returns the due (id, created_by) list across all owners (identifiers + owner ids only, no content).
-- ============================================================================

ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS last_indexed_at timestamptz NULL;

CREATE INDEX IF NOT EXISTS idx_theo_conversations_index_scan
  ON public.theo_conversations (updated_at)
  WHERE last_indexed_at IS NULL OR last_indexed_at < updated_at;

CREATE OR REPLACE FUNCTION public.theo_index_due_conversations(p_idle_minutes int, p_limit int)
RETURNS TABLE (id uuid, created_by text)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.created_by
  FROM public.theo_conversations c
  WHERE c.updated_at < now() - ((p_idle_minutes)::text || ' minutes')::interval
    AND (c.last_indexed_at IS NULL OR c.last_indexed_at < c.updated_at)
  ORDER BY c.updated_at ASC
  LIMIT p_limit;
$$;
GRANT EXECUTE ON FUNCTION public.theo_index_due_conversations(int, int) TO authenticated;
