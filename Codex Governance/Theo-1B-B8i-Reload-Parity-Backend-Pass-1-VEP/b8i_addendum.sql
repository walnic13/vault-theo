-- Tier B8i addendum: record which user-turn the attachment was sent with (reload parity). ADDITIVE; idempotent.
-- Run as pgadmin_vault. No RLS change (inherits theo_attachments' four ownership policies). No backfill
-- (theo_message sets it on send going forward; pre-existing rows keep NULL → they group at the chat level).
ALTER TABLE public.theo_attachments
  ADD COLUMN IF NOT EXISTS message_seq int;

COMMENT ON COLUMN public.theo_attachments.message_seq IS
  'The theo_messages.seq of the user turn this attachment was sent with (set by theo_message at send); NULL if not sent in a message. Lets a reloaded thread show chips on the right message (B8i).';
