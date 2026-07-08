-- Theo VC-16 — channel leave + archive. ADDITIVE + REVERSIBLE. Run by Walter at Pass 3 BEFORE the
-- VC-16 handlers deploy. Two additions: (1) theo_chat_threads.archived_at (soft-archive marker);
-- (2) a narrowly-scoped SECURITY DEFINER function theo_chat_leave(uuid) that lets a member remove
-- THEMSELVES from a channel. Idempotent; safe to re-run.
--
-- Why a SECURITY DEFINER function for leave: the deployed thread UPDATE policy is
--   WITH CHECK (auth.uid() = ANY (member_oids))
-- so a member removing THEMSELVES produces a new row that no longer contains auth.uid() → WITH CHECK
-- fails for the (non-owner) app role (RLS is ENFORCED for it; the tables are ENABLE — not FORCE — RLS
-- and are owned by this migration role, so a SECURITY DEFINER function owned here bypasses the policy).
-- The function is SAFE despite the bypass: it removes ONLY the authenticated caller
-- (current_setting('request.jwt.claim.sub'), set by the handler's set_config triad), and only from a
-- channel they belong to and do NOT administer. It cannot remove anyone else. (Same pattern as the
-- deployed B7 SECURITY DEFINER cross-owner helper; the "no SECURITY DEFINER" note in Schema §8 is about
-- the chat READ path / existence helpers, not this write-scoped self-service function.)

-- 1) Soft-archive marker. NULL = active; non-NULL = archived (hidden from list_threads).
ALTER TABLE public.theo_chat_threads ADD COLUMN IF NOT EXISTS archived_at timestamptz;

-- 2) Self-service leave (channel member removes themselves; admin must transfer first).
CREATE OR REPLACE FUNCTION public.theo_chat_leave(p_thread_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_oid     text := current_setting('request.jwt.claim.sub', true);
  v_kind    text;
  v_admin   text;
  v_members text[];
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_leave: no caller identity' USING ERRCODE = '28000';
  END IF;

  -- ROW-LOCK the thread on read (FOR UPDATE) so admin authority / membership cannot change under a
  -- concurrent VC-15 transfer_admin (which itself takes FOR UPDATE): the two serialize on this row.
  SELECT kind, admin_oid, member_oids
    INTO v_kind, v_admin, v_members
    FROM public.theo_chat_threads
   WHERE id = p_thread_id
   FOR UPDATE;

  -- Not found or caller is not a participant → nothing to leave (handler maps the 404).
  IF NOT FOUND OR NOT (v_oid = ANY (v_members)) THEN
    RETURN false;
  END IF;
  -- Only channels can be left; DMs have no leave.
  IF v_kind <> 'channel' THEN
    RAISE EXCEPTION 'theo_chat_leave: not a channel' USING ERRCODE = '22023';
  END IF;
  -- The admin cannot leave — they must transfer admin first. (Under the FOR UPDATE lock above this
  -- reflects the committed admin at lock time; a transfer that made the caller admin lands here → 22023.)
  IF v_oid = v_admin THEN
    RAISE EXCEPTION 'theo_chat_leave: admin cannot leave' USING ERRCODE = '22023';
  END IF;

  -- Remove ONLY the caller (bypasses the thread UPDATE WITH CHECK via definer ownership). The full
  -- guard (channel + still a member + still NOT the admin) is RE-ASSERTED in the UPDATE predicate so the
  -- write is execution-time safe even if the earlier read raced: 0 rows → membership is NOT mutated.
  UPDATE public.theo_chat_threads
     SET member_oids = array_remove(member_oids, v_oid), updated_at = now()
   WHERE id = p_thread_id
     AND kind = 'channel'
     AND v_oid = ANY (member_oids)
     AND v_oid <> admin_oid;
  -- No row updated → state changed under a concurrent transfer (e.g. caller just became admin). Do NOT
  -- delete the membership row; report not-left so the invariant (admin ∈ members) can never break.
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  -- Membership-row delete is tied to the successful guarded UPDATE above.
  DELETE FROM public.theo_chat_thread_members
   WHERE thread_id = p_thread_id AND member_oid = v_oid;

  RETURN true;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_leave(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_leave(uuid) TO authenticated;
