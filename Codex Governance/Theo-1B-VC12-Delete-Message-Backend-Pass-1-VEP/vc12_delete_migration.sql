-- Theo VC-12 — delete-a-message (soft, "delete for everyone" by the sender). ADDITIVE + REVERSIBLE.
-- Run by Walter at Pass 3 BEFORE the VC-12 handlers deploy. Idempotent; safe to re-run.
--
-- What it does:
--  (1) theo_chat_messages.deleted_at / deleted_by — the soft-delete tombstone markers.
--  (2) Relaxes the body constraint so a TOMBSTONED row may have body = NULL — a delete truly removes
--      the content for everyone (not merely masks it in reads). An ACTIVE row keeps the 1..8000 CHECK.
--  (3) A narrowly-scoped SECURITY DEFINER function theo_chat_delete_message(uuid) that lets the SENDER
--      tombstone THEIR OWN message. Same justified class as VC-16's theo_chat_leave: messages carry no
--      UPDATE policy for the app role (they are "immutable — no UPDATE/DELETE policy"), so the app role
--      cannot UPDATE at all; rather than broaden that surface with a sender-UPDATE policy, this definer
--      function (owned by the migration role; tables ENABLE-not-FORCE RLS) performs the single, tightly
--      scoped tombstone write. It is SAFE: it mutates ONLY the caller's own message
--      (current_setting('request.jwt.claim.sub'), never a parameter), reads the row FOR UPDATE and
--      re-asserts sender = caller in the UPDATE (execution-time safe), and only ever sets the tombstone
--      (deleted_at/deleted_by + body NULL) — it can neither edit a message's text nor touch anyone
--      else's message. EXECUTE → authenticated only; REVOKE FROM PUBLIC; search_path pinned.

-- 1) Tombstone markers. deleted_at NULL = live; non-NULL = deleted-for-everyone.
ALTER TABLE public.theo_chat_messages ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.theo_chat_messages ADD COLUMN IF NOT EXISTS deleted_by text;

-- 2) Relax the body constraint: a tombstoned row may have body NULL; a live row keeps 1..8000.
--    Drop the existing body CHECK by DISCOVERING its name (an inline unnamed column CHECK is auto-named,
--    conventionally theo_chat_messages_body_check, but we find it defensively so the migration is robust).
ALTER TABLE public.theo_chat_messages ALTER COLUMN body DROP NOT NULL;
DO $mig$
DECLARE c_name text;
BEGIN
  SELECT con.conname INTO c_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  JOIN pg_namespace n ON n.oid = rel.relnamespace
  WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
    AND con.contype = 'c' AND pg_get_constraintdef(con.oid) ILIKE '%length(body)%';
  IF c_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.theo_chat_messages DROP CONSTRAINT %I', c_name);
  END IF;
END
$mig$;

-- Add the conditional CHECK once (guarded so a re-run is a no-op).
DO $mig$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_body_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages
      ADD CONSTRAINT theo_chat_messages_body_ck
      CHECK (
        (deleted_at IS NULL AND body IS NOT NULL AND length(body) >= 1 AND length(body) <= 8000)
        OR
        (deleted_at IS NOT NULL)
      );
  END IF;
END
$mig$;

-- 3) Self-service soft-delete (sender tombstones their OWN message).
CREATE OR REPLACE FUNCTION public.theo_chat_delete_message(p_message_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_oid    text := current_setting('request.jwt.claim.sub', true);
  v_sender text;
  v_del    timestamptz;
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_delete_message: no caller identity' USING ERRCODE = '28000';
  END IF;

  -- Row-lock the message; capture sender + current tombstone state.
  SELECT sender_oid, deleted_at INTO v_sender, v_del
    FROM public.theo_chat_messages
   WHERE id = p_message_id
   FOR UPDATE;

  -- Not found → nothing to delete (handler maps 404).
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  -- Only the sender may delete their own message.
  IF v_sender <> v_oid THEN
    RAISE EXCEPTION 'theo_chat_delete_message: not the sender' USING ERRCODE = '42501';
  END IF;
  -- Already deleted → idempotent success (no-op).
  IF v_del IS NOT NULL THEN
    RETURN true;
  END IF;

  -- Tombstone: remove the content for everyone. The guard (sender = caller, still live) is RE-ASSERTED
  -- in the UPDATE predicate so the write is execution-time safe; 0 rows → nothing mutated, RETURN false.
  UPDATE public.theo_chat_messages
     SET deleted_at = now(), deleted_by = v_oid, body = NULL
   WHERE id = p_message_id
     AND sender_oid = v_oid
     AND deleted_at IS NULL;
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_delete_message(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_delete_message(uuid) TO authenticated;
