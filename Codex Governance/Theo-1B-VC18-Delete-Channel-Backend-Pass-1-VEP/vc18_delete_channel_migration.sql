-- Theo VC-18 — hard-delete a channel (admin-only, PERMANENT; cascades messages + members).
-- ADDITIVE + REVERSIBLE. Run by Walter at Pass 3 BEFORE the VC-18 handler deploy. Idempotent (re-runnable).
--
-- Why only a policy (no SECURITY DEFINER, no column):
--  * theo_chat_thread_members and theo_chat_messages already FK theo_chat_threads(id) ON DELETE CASCADE
--    (VC-1), so deleting the thread row removes its members + messages automatically. A cascade is a
--    referential action performed as the table owner — it is NOT subject to the child tables' RLS.
--  * The app role has NO DELETE policy on theo_chat_threads (VC-1 created SELECT/INSERT/UPDATE only), so
--    it cannot delete at all today. This adds an ADMIN-ONLY DELETE policy. A DM has admin_oid NULL, so
--    USING (admin_oid = auth.uid()) is false for a DM — only a CHANNEL ADMIN can delete; the handler also
--    requires kind = 'channel' and applies the execution-time admin guard (FOR UPDATE + admin predicate
--    in the DELETE + 0-row → 403), mirroring the VC-15/VC-16 admin-mutation discipline. No SECURITY
--    DEFINER is needed (unlike leave/delete-message, where the app role had no policy path at all).

DROP POLICY IF EXISTS "theo_chat_thread_delete" ON public.theo_chat_threads;
CREATE POLICY "theo_chat_thread_delete" ON public.theo_chat_threads
  FOR DELETE TO authenticated
  USING (admin_oid = auth.uid());
