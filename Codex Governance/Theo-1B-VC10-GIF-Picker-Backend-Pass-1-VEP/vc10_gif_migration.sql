-- Theo VC-10 — GIF picker (Path A: hardened GIPHY proxy). ADDITIVE + REVERSIBLE. Run by Walter at
-- Pass 3 BEFORE the VC-10 handler deploy. Adds seven nullable gif_* columns to theo_chat_messages,
-- widens the body CHECK so a live message may be GIF-only (body NULL + a gif), and adds a gif coherence
-- CHECK + an attachment/gif mutual-exclusion CHECK. Idempotent; safe to re-run. MUST run AFTER the VC-9
-- migration (this DROP/ADD of theo_chat_messages_body_ck extends VC-9's widened form).
--
-- Design notes:
--  * A GIF message is an EXTERNAL reference (GIPHY CDN URL), not a self-hosted blob (unlike a VC-9
--    attachment). theo_chat_send_gif resolves the gif by id against GIPHY server-side and stores the
--    canonical GIPHY URLs it gets back; the client never supplies a URL (no injection). Rendering
--    hotlinks the GIPHY CDN (Path A, ToS-compliant) — nothing is rehosted.
--  * NO RLS change. The theo_chat_message_insert WITH CHECK is column-agnostic; a gif is an ordinary
--    INSERT the caller is authorized to make (member of the target thread, as self).
--  * body CHECK widened: a live row needs a non-empty body (1..8000) OR an attachment OR a gif; a
--    tombstone (deleted_at IS NOT NULL) is unconstrained (body already nulled). This DROPs the VC-9
--    constraint and re-adds the gif-aware form — hence the ordering dependency on VC-9.
--  * gif coherence: the core three (provider, id, url) are all-present or all-NULL with the rest;
--    a message is never BOTH an attachment and a gif (mutual-exclusion CHECK).
--  * gif_width / gif_height are int (GIPHY returns them as strings; the handler parseInt's them).

-- 1) Additive columns (idempotent).
ALTER TABLE public.theo_chat_messages
  ADD COLUMN IF NOT EXISTS gif_provider    text NULL,
  ADD COLUMN IF NOT EXISTS gif_id          text NULL,
  ADD COLUMN IF NOT EXISTS gif_url         text NULL,
  ADD COLUMN IF NOT EXISTS gif_preview_url text NULL,
  ADD COLUMN IF NOT EXISTS gif_width       int  NULL,
  ADD COLUMN IF NOT EXISTS gif_height      int  NULL,
  ADD COLUMN IF NOT EXISTS gif_title       text NULL;

-- 2) Widen the body CHECK: a live message may be body-only OR attachment-only OR gif-only (or combos of
--    body+attachment / body+gif). Drop the VC-9 constraint and re-add the gif-aware form (guarded).
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
      (deleted_at IS NOT NULL)
      OR
      (
        (body IS NULL OR (length(body) >= 1 AND length(body) <= 8000))
        AND (body IS NOT NULL OR attachment_blob_path IS NOT NULL OR gif_id IS NOT NULL)
      )
    );
END
$mig$;

-- 3) GIF coherence: the core three (provider, id, url) are all-present or the whole gif block is all-NULL
--    (guarded). preview_url / width / height / title are optional within a gif.
DO $mig$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_gif_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages
      ADD CONSTRAINT theo_chat_messages_gif_ck
      CHECK (
        (gif_provider IS NULL AND gif_id IS NULL AND gif_url IS NULL
           AND gif_preview_url IS NULL AND gif_width IS NULL AND gif_height IS NULL AND gif_title IS NULL)
        OR
        (gif_provider IS NOT NULL AND gif_id IS NOT NULL AND gif_url IS NOT NULL)
      );
  END IF;
END
$mig$;

-- 4) A message is never BOTH a self-hosted attachment and a gif (mutual exclusion; guarded).
DO $mig$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_attach_gif_excl_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages
      ADD CONSTRAINT theo_chat_messages_attach_gif_excl_ck
      CHECK (attachment_blob_path IS NULL OR gif_id IS NULL);
  END IF;
END
$mig$;
