-- Theo VC-9 — chat attachments (attachment IS a message). ADDITIVE + REVERSIBLE. Run by Walter at
-- Pass 3 BEFORE the VC-9 handler deploy. Adds four nullable attachment columns to theo_chat_messages
-- and relaxes the body CHECK so a live message may carry an attachment with NO caption (body NULL).
-- Idempotent; safe to re-run.
--
-- Design notes:
--  * One file per message ("attachment IS a message"): a send with a file persists a normal message row
--    whose attachment_* columns point at a blob in the existing `theo-content` container. No new table.
--  * The blob body lives in Blob; the row holds only the pointer (mirrors theo_attachments, §7).
--  * attachment_blob_path is the owner-scoped key `attachments/<sender-oid>/<id>` written by the caller's
--    own upload SAS (theo_create_attachment_upload); theo_chat_send_message re-asserts the caller owns it
--    and HEADs the blob for the AUTHORITATIVE byte size + content-type (client-claimed values are ignored).
--  * NO RLS change. The theo_chat_message_insert WITH CHECK is column-agnostic; the attachment columns
--    ride the existing participant-scoped policy. The raw blob_path is NEVER projected to clients — a
--    read SAS is issued per-request by theo_chat_attachment_download after a membership check.
--  * body CHECK amendment: a live row (deleted_at IS NULL) must now have EITHER a non-empty body (1..8000)
--    OR an attachment; a tombstone (deleted_at IS NOT NULL) is unconstrained (body already nulled).
--  * attachment coherence CHECK: the four attachment columns are all-NULL (no attachment) or all-present.

-- 1) Additive columns (idempotent).
ALTER TABLE public.theo_chat_messages
  ADD COLUMN IF NOT EXISTS attachment_blob_path    text   NULL,
  ADD COLUMN IF NOT EXISTS attachment_filename     text   NULL,
  ADD COLUMN IF NOT EXISTS attachment_content_type text   NULL,
  ADD COLUMN IF NOT EXISTS attachment_byte_size    bigint NULL;

-- 2) Relax the body CHECK: a live message may be body-only OR attachment-only OR both.
--    Drop the VC-12 constraint and re-add the widened one (guarded so a re-run is a no-op).
DO $mig$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_body_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages DROP CONSTRAINT theo_chat_messages_body_ck;
  END IF;

  ALTER TABLE public.theo_chat_messages
    ADD CONSTRAINT theo_chat_messages_body_ck
    CHECK (
      -- tombstone: body already nulled by the soft-delete; unconstrained here.
      (deleted_at IS NOT NULL)
      OR
      -- live: body (if present) is 1..8000, AND at least one of body / attachment is present.
      (
        (body IS NULL OR (length(body) >= 1 AND length(body) <= 8000))
        AND (body IS NOT NULL OR attachment_blob_path IS NOT NULL)
      )
    );
END
$mig$;

-- 3) Attachment coherence: the four attachment columns are all-NULL or all-present (guarded).
DO $mig$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_attachment_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages
      ADD CONSTRAINT theo_chat_messages_attachment_ck
      CHECK (
        (attachment_blob_path IS NULL AND attachment_filename IS NULL
           AND attachment_content_type IS NULL AND attachment_byte_size IS NULL)
        OR
        (attachment_blob_path IS NOT NULL AND attachment_filename IS NOT NULL
           AND attachment_content_type IS NOT NULL AND attachment_byte_size IS NOT NULL
           AND attachment_byte_size >= 0)
      );
  END IF;
END
$mig$;
