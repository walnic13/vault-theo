-- Theo VC-1 — native in-Vault chat backend spine. ADDITIVE + REVERSIBLE. New tables in the Vault DB
-- (vaultgpt-postgres-prod). Participant-scoped RLS. Handlers deploy to the DEDICATED vaultgpt-func-chat
-- app (Windows v4, EP1) — NEVER the monolith. Idempotent; safe to re-run.
--
-- RLS non-recursion (design-critical — the B5c T12 lesson): theo_chat_threads carries member_oids text[]
-- (the participant list), so its SELECT policy is SELF-CONTAINED: `auth.uid() = ANY(member_oids)` — no
-- subquery, no other table. theo_chat_messages and theo_chat_thread_members gate by referencing
-- theo_chat_threads (self-contained), and threads references NEITHER back — so no policy triggers a
-- table whose policy references it. NO SECURITY DEFINER helper, NO new elevated-read class (Golden
-- Handler §3 / API Spec §1 unchanged) — only ordinary ownership-family auth.uid() primitives.

-- 1) Threads — a DM or a channel. member_oids = the current participants (Entra OIDs) and the RLS gate.
CREATE TABLE IF NOT EXISTS public.theo_chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('dm','channel')),
  name text,                                          -- channel display name; NULL for a dm
  member_oids text[] NOT NULL DEFAULT '{}',           -- current participants (Entra OIDs); the RLS gate
  created_by text NOT NULL,                           -- creator's Entra OID
  dm_key text,                                        -- canonical dm identity (sorted oid pair 'a|b'); NULL for channel
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()       -- bumped on each new message (drives thread ordering)
);
-- Canonical DM dedup: at most one dm thread per unordered oid pair.
CREATE UNIQUE INDEX IF NOT EXISTS theo_chat_threads_dm_key_uk
  ON public.theo_chat_threads (dm_key) WHERE dm_key IS NOT NULL;
-- Membership containment lookups (auth.uid() = ANY(member_oids)).
CREATE INDEX IF NOT EXISTS theo_chat_threads_members_gin
  ON public.theo_chat_threads USING gin (member_oids);

-- 2) Per-member read state (unread tracking). Membership AUTHORITY is threads.member_oids; this table
--    holds last_read_seq per member. (Kept in sync with member_oids by the handlers, one transaction.)
CREATE TABLE IF NOT EXISTS public.theo_chat_thread_members (
  thread_id uuid NOT NULL REFERENCES public.theo_chat_threads(id) ON DELETE CASCADE,
  member_oid text NOT NULL,
  last_read_seq bigint NOT NULL DEFAULT 0,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (thread_id, member_oid)
);
CREATE INDEX IF NOT EXISTS theo_chat_members_oid_idx
  ON public.theo_chat_thread_members (member_oid);

-- 3) Messages — seq is a per-thread monotonic sequence (ordering + unread math).
CREATE TABLE IF NOT EXISTS public.theo_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.theo_chat_threads(id) ON DELETE CASCADE,
  seq bigint NOT NULL,
  sender_oid text NOT NULL,
  body text NOT NULL CHECK (length(body) > 0 AND length(body) <= 8000),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (thread_id, seq)
);
CREATE INDEX IF NOT EXISTS theo_chat_messages_thread_seq_idx
  ON public.theo_chat_messages (thread_id, seq);

ALTER TABLE public.theo_chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theo_chat_thread_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theo_chat_messages ENABLE ROW LEVEL SECURITY;

-- ── RLS: participant-scoped, SELF-CONTAINED (no recursion, no SECURITY DEFINER) ──

-- threads: a participant reads; a participant-creator inserts; a participant updates (bump/rename/members
-- — the handler enforces finer rules, e.g. channel rename by creator, dm immutable).
DROP POLICY IF EXISTS "theo_chat_thread_select" ON public.theo_chat_threads;
CREATE POLICY "theo_chat_thread_select" ON public.theo_chat_threads
  FOR SELECT TO authenticated
  USING (auth.uid() = ANY (member_oids));
DROP POLICY IF EXISTS "theo_chat_thread_insert" ON public.theo_chat_threads;
CREATE POLICY "theo_chat_thread_insert" ON public.theo_chat_threads
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND auth.uid() = ANY (member_oids));
DROP POLICY IF EXISTS "theo_chat_thread_update" ON public.theo_chat_threads;
CREATE POLICY "theo_chat_thread_update" ON public.theo_chat_threads
  FOR UPDATE TO authenticated
  USING (auth.uid() = ANY (member_oids))
  WITH CHECK (auth.uid() = ANY (member_oids));

-- members (read state): see your own row, OR any member row of a thread you belong to (via threads,
-- self-contained). Insert a row only into a thread you belong to. Update only YOUR OWN read state.
DROP POLICY IF EXISTS "theo_chat_member_select" ON public.theo_chat_thread_members;
CREATE POLICY "theo_chat_member_select" ON public.theo_chat_thread_members
  FOR SELECT TO authenticated
  USING (
    member_oid = auth.uid()
    OR thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))
  );
DROP POLICY IF EXISTS "theo_chat_member_insert" ON public.theo_chat_thread_members;
CREATE POLICY "theo_chat_member_insert" ON public.theo_chat_thread_members
  FOR INSERT TO authenticated
  WITH CHECK (thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)));
DROP POLICY IF EXISTS "theo_chat_member_update" ON public.theo_chat_thread_members;
CREATE POLICY "theo_chat_member_update" ON public.theo_chat_thread_members
  FOR UPDATE TO authenticated
  USING (member_oid = auth.uid())
  WITH CHECK (member_oid = auth.uid());
DROP POLICY IF EXISTS "theo_chat_member_delete" ON public.theo_chat_thread_members;
CREATE POLICY "theo_chat_member_delete" ON public.theo_chat_thread_members
  FOR DELETE TO authenticated
  USING (thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)));

-- messages: read if you're a participant of the thread (via threads, self-contained); insert only your
-- own message into a thread you belong to. (No UPDATE/DELETE policy in v1 — messages are immutable.)
DROP POLICY IF EXISTS "theo_chat_message_select" ON public.theo_chat_messages;
CREATE POLICY "theo_chat_message_select" ON public.theo_chat_messages
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)));
DROP POLICY IF EXISTS "theo_chat_message_insert" ON public.theo_chat_messages;
CREATE POLICY "theo_chat_message_insert" ON public.theo_chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_oid = auth.uid()
    AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))
  );
