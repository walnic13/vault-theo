-- Theo VC-1.2 — first-class channel admin. ADDITIVE + REVERSIBLE. Adds theo_chat_threads.admin_oid
-- (the channel administrator's Entra OID), backfilled = created_by for existing rows. Idempotent;
-- safe to re-run. Run by Walter at Pass 3 BEFORE the VC-1.2 handlers are deployed (the modified
-- create_channel / list_threads and the new add_member / remove_member reference admin_oid). No RLS
-- change: admin authority is enforced in the handlers (admin_oid = caller), consistent with the
-- existing ownership-family pattern; the thread UPDATE policy (auth.uid() = ANY(member_oids)) is
-- unchanged and still holds (the admin is always a member, so add/remove preserve the WITH CHECK).

-- 1) The admin column. Nullable + additive (no default that references another column). For a channel
--    it is the administrator's OID; for a dm it is backfilled to created_by but carries no admin
--    semantics (DMs have no admin surface).
ALTER TABLE public.theo_chat_threads ADD COLUMN IF NOT EXISTS admin_oid text;

-- 2) Backfill: the creator is the administrator of every existing thread.
UPDATE public.theo_chat_threads SET admin_oid = created_by WHERE admin_oid IS NULL;
