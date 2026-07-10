-- Theo VC-Reactions (#6a-BE) — chat message emoji reactions. ADDITIVE + REVERSIBLE. New table in the
-- Vault DB (vaultgpt-postgres-prod). Participant-scoped RLS mirroring the VC-1 theo_chat_messages idiom.
-- Handlers deploy to the DEDICATED vaultgpt-func-chat app (Windows v4, EP1) — NEVER the monolith.
-- Idempotent; safe to re-run. NO top-level transaction control (Theo Golden Handler Standard §5.2);
-- Walter executes at Pass 3 BEFORE the handler deploy.
--
-- RLS non-recursion (the VC-1 design-critical idiom): theo_chat_message_reactions gates by referencing
-- theo_chat_threads (self-contained — auth.uid() = ANY(member_oids)); theo_chat_threads references
-- NEITHER back, so no policy triggers a table whose policy references it. NO SECURITY DEFINER helper,
-- NO new elevated-read class — only ordinary ownership-family auth.uid() primitives, exactly as the
-- VC-1 theo_chat_message_select / _insert policies use.

-- 1) Reactions — one row per (message, reactor OID, emoji). thread_id is denormalised from the message
--    (its own NOT NULL FK) so the RLS gate is self-contained (no join to theo_chat_messages in policy).
CREATE TABLE IF NOT EXISTS public.theo_chat_message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.theo_chat_messages(id) ON DELETE CASCADE,
  thread_id uuid NOT NULL REFERENCES public.theo_chat_threads(id) ON DELETE CASCADE,
  oid text NOT NULL,                                   -- reactor's Entra OID
  emoji text NOT NULL CHECK (length(emoji) BETWEEN 1 AND 32),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (message_id, oid, emoji)                      -- a user reacts with a given emoji at most once
);
-- Aggregate-by-message (list_messages projection) + cascade-on-thread-delete lookups.
CREATE INDEX IF NOT EXISTS theo_chat_message_reactions_message_idx
  ON public.theo_chat_message_reactions (message_id);
CREATE INDEX IF NOT EXISTS theo_chat_message_reactions_thread_idx
  ON public.theo_chat_message_reactions (thread_id);

ALTER TABLE public.theo_chat_message_reactions ENABLE ROW LEVEL SECURITY;

-- ── RLS: participant-scoped, SELF-CONTAINED (mirrors VC-1 theo_chat_messages exactly) ──

-- SELECT: a participant of the reaction's thread reads it (self-contained via threads — the exact
-- theo_chat_message_select idiom: thread_id IN (SELECT id FROM theo_chat_threads WHERE auth.uid() = ANY(member_oids))).
DROP POLICY IF EXISTS "theo_chat_message_reaction_select" ON public.theo_chat_message_reactions;
CREATE POLICY "theo_chat_message_reaction_select" ON public.theo_chat_message_reactions
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)));

-- INSERT: you may add ONLY your OWN reaction (oid = auth.uid()) into a thread you belong to.
DROP POLICY IF EXISTS "theo_chat_message_reaction_insert" ON public.theo_chat_message_reactions;
CREATE POLICY "theo_chat_message_reaction_insert" ON public.theo_chat_message_reactions
  FOR INSERT TO authenticated
  WITH CHECK (
    oid = auth.uid()
    AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))
  );

-- DELETE: you may remove ONLY your OWN reaction (oid = auth.uid()) from a thread you belong to.
DROP POLICY IF EXISTS "theo_chat_message_reaction_delete" ON public.theo_chat_message_reactions;
CREATE POLICY "theo_chat_message_reaction_delete" ON public.theo_chat_message_reactions
  FOR DELETE TO authenticated
  USING (
    oid = auth.uid()
    AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))
  );
