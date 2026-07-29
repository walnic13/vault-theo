-- VC — Chat per-user-per-thread state (hidden / muted). Additive + reversible + idempotent.
-- Golden SQL: no top-level transaction control, no psql meta-commands. Walter executes BEFORE the handler deploy.
-- Extends the existing per-user-per-thread table theo_chat_thread_members (PK (thread_id, member_oid)).
-- Inherits that table's deployed RLS policies unchanged (UPDATE = your own row); no new policy, no SECURITY DEFINER.
ALTER TABLE public.theo_chat_thread_members ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;
ALTER TABLE public.theo_chat_thread_members ADD COLUMN IF NOT EXISTS muted  boolean NOT NULL DEFAULT false;
