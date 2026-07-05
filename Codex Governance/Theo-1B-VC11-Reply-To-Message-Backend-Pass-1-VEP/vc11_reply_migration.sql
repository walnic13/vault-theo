-- Theo VC-11 — reply-to-message. ADDITIVE + REVERSIBLE. Run by Walter at Pass 3 BEFORE the VC-11
-- handler deploy. ONE addition: theo_chat_messages.reply_to_message_id (a self-referential nullable
-- pointer to the message being replied to). Idempotent; safe to re-run.
--
-- Design notes:
--  * The column is a self-FK to theo_chat_messages(id). ON DELETE SET NULL is DEFENSIVE: messages are
--    immutable today (no UPDATE/DELETE policy) and VC-12 delete is planned as a SOFT delete (the row
--    persists as a tombstone), so SET NULL will not normally fire — a reply keeps pointing at its parent
--    (the FE renders "message deleted" from the tombstone). Should any future HARD delete ever remove a
--    parent, replies degrade gracefully to "no quote" rather than blocking the delete.
--  * NO RLS change. The existing theo_chat_message_insert policy
--    WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads
--    WHERE auth.uid() = ANY (member_oids))) is column-agnostic and still holds — reply_to_message_id is
--    just another column on an INSERT the caller is already authorized to make. Same-thread integrity of
--    the pointer is enforced in the handler (a reply may only target a message in the same thread).
--  * NO new index: the reply preview is fetched by parent PK (reply_to_message_id -> id), a primary-key
--    lookup that needs no index on the child column.

ALTER TABLE public.theo_chat_messages
  ADD COLUMN IF NOT EXISTS reply_to_message_id uuid NULL
  REFERENCES public.theo_chat_messages(id) ON DELETE SET NULL;
