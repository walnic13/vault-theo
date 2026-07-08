-- Theo VC-13 — forward-a-message. ADDITIVE + REVERSIBLE. Run by Walter at Pass 3 BEFORE the VC-13
-- handler deploy. ONE addition: theo_chat_messages.forwarded_from_message_id (a self-referential
-- nullable pointer to the ORIGINAL message a forward was copied from). Idempotent; safe to re-run.
--
-- Design notes:
--  * Self-FK to theo_chat_messages(id), ON DELETE SET NULL (the origin may later be deleted; a forward
--    keeps its own copied body regardless). Non-NULL only for a forwarded message.
--  * NO RLS change. The existing theo_chat_message_insert policy
--    WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads
--    WHERE auth.uid() = ANY (member_oids))) is column-agnostic — a forward is an ordinary INSERT the
--    caller is authorized to make (as themselves, into a target thread they belong to).
--    theo_chat_forward_message reads the SOURCE message under RLS (so a caller can only forward a
--    message they can already see) and copies its body server-side.
--  * The API exposes only a `forwarded` BOOLEAN (= forwarded_from_message_id IS NOT NULL); the raw
--    origin id is NEVER projected to clients (it points into the source thread, which the target
--    participants may not be able to read — no cross-thread leak).
--  * NO new index: provenance is written on INSERT and read only as the boolean.

ALTER TABLE public.theo_chat_messages
  ADD COLUMN IF NOT EXISTS forwarded_from_message_id uuid NULL
  REFERENCES public.theo_chat_messages(id) ON DELETE SET NULL;
