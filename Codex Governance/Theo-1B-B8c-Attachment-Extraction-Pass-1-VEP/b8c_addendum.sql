-- Tier B8c addendum migration: extraction metadata on theo_attachments (ADDITIVE; idempotent).
-- Run as pgadmin_vault (owner), same as every prior theo migration. No RLS change — the new
-- columns inherit theo_attachments' existing four ownership policies. No data backfill needed
-- (theo_finalize_attachment sets these on insert going forward; pre-existing rows keep NULL).

ALTER TABLE public.theo_attachments
  ADD COLUMN IF NOT EXISTS ingestion_class text,
  ADD COLUMN IF NOT EXISTS extracted_text_path text;

COMMENT ON COLUMN public.theo_attachments.ingestion_class IS
  'native | extract | stored — how the attachment is fed to the model (B8c). Free-text (no CHECK), mirrors the app_key promotable convention.';
COMMENT ON COLUMN public.theo_attachments.extracted_text_path IS
  'Blob pointer (within blob_container) to the extracted text for extract-class attachments; NULL for native, or when extraction failed/has not run (B8c).';
