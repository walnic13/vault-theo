-- ============================================================================
-- Theo Shared Project Workspace — Phase 2a: publish-to-project (conversation sharing substrate).
-- Target: shared `vaultgpt` Azure Postgres instance, schema `public`.
-- Plain PostgreSQL SQL; NO top-level BEGIN/COMMIT (migration governance). Idempotent + reversible.
--
-- WHAT: adds a publish flag to theo_conversations and broadens RLS so a conversation the author
-- PUBLISHES to a project becomes both READABLE and CONTINUABLE (multi-party, attributed) by that
-- project's Creator / Owner / Members. This is the substrate for SPW Phase 2 (publish + attributed
-- multi-party threads); the handlers (2b) and FE (2c) ride on it.
--
-- MODEL (private-by-default): linking a conversation to a project (`project_id`) does NOT publish it.
-- Publishing is an explicit OWNER action that sets `published_to_project=true` (an owner UPDATE — the
-- owner-only UPDATE policy is unchanged). A conversation is shared iff `published_to_project=true` AND
-- `project_id IS NOT NULL`. Only then do the broadened SELECT/INSERT policies expose it to members.
--
-- ATTRIBUTION: theo_messages.created_by is already set to auth.uid() on every insert, so each message
-- records ITS AUTHOR. In a multi-party published thread this attributes each turn automatically — no
-- new column needed. A member may INSERT only as themselves (created_by = auth.uid()).
--
-- RLS NON-RECURSION (mirrors the B5c membership-RLS design): theo_conversations.SELECT references
-- theo_projects + theo_project_members; theo_messages.SELECT/INSERT reference theo_conversations.
-- theo_projects.SELECT references theo_project_members (self-contained), theo_project_members.SELECT is
-- self-contained, and NEITHER references theo_conversations/theo_messages back — so there is no cycle.
-- The project-access subquery (creator ∪ member-row) is identical in every policy for auditability.
--
-- AUTHORIZATION: broadening conversation/message RLS beyond ownership is out of default 1B scope
-- ("sharing/membership RLS models — ownership-only unless Walter authorizes"). Walter authorized the
-- Shared Project Workspace program (design 2026-07-30); Phase 2 read+write was explicitly directed.
-- ============================================================================

-- 1) publish columns (additive; existing rows default unpublished/private).
ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS published_to_project boolean NOT NULL DEFAULT false;
ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS published_at timestamptz NULL;
ALTER TABLE public.theo_conversations
  ADD COLUMN IF NOT EXISTS published_by text NULL;

-- Partial index for the members-view lookup (published conversations per project).
CREATE INDEX IF NOT EXISTS idx_theo_conversations_published
  ON public.theo_conversations (project_id)
  WHERE published_to_project = true;

-- 2) theo_conversations SELECT: own OR a conversation PUBLISHED to a project the caller belongs to
--    (creator ∪ owner/member via a theo_project_members row). INSERT/UPDATE/DELETE stay owner-only,
--    so publish/unpublish is an owner UPDATE and members cannot rename/delete a shared conversation.
DROP POLICY IF EXISTS "theo_conversation_select_own" ON public.theo_conversations;
CREATE POLICY "theo_conversation_select_own" ON public.theo_conversations
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR (
      published_to_project = true
      AND project_id IS NOT NULL
      AND project_id IN (
        SELECT id FROM public.theo_projects WHERE created_by = auth.uid()
        UNION
        SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid()
      )
    )
  );

-- 3) theo_messages SELECT: own OR belongs to a conversation published to a project the caller belongs to.
DROP POLICY IF EXISTS "theo_message_select_own" ON public.theo_messages;
CREATE POLICY "theo_message_select_own" ON public.theo_messages
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR conversation_id IN (
      SELECT c.id FROM public.theo_conversations c
      WHERE c.published_to_project = true AND c.project_id IS NOT NULL
        AND c.project_id IN (
          SELECT id FROM public.theo_projects WHERE created_by = auth.uid()
          UNION
          SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid()
        )
    )
  );

-- 4) theo_messages INSERT (multi-party continuation): the caller's OWN conversation, OR a PUBLISHED
--    conversation in a project the caller belongs to. `created_by = auth.uid()` ALWAYS (attribution —
--    a member posts only as themselves). This is the write-side broadening that lets members continue
--    a shared thread; UPDATE/DELETE stay owner-only (a member cannot edit/delete others' messages).
DROP POLICY IF EXISTS "theo_message_insert_own" ON public.theo_messages;
CREATE POLICY "theo_message_insert_own" ON public.theo_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND (
      conversation_id IN (
        SELECT id FROM public.theo_conversations WHERE created_by = auth.uid()
      )
      OR conversation_id IN (
        SELECT c.id FROM public.theo_conversations c
        WHERE c.published_to_project = true AND c.project_id IS NOT NULL
          AND c.project_id IN (
            SELECT id FROM public.theo_projects WHERE created_by = auth.uid()
            UNION
            SELECT project_id FROM public.theo_project_members WHERE member_oid = auth.uid()
          )
      )
    )
  );

-- ============================================================================
-- REVERSIBILITY (manual, if ever needed; not run at deploy) — restore the strict ownership baseline:
--   DROP POLICY IF EXISTS "theo_message_insert_own" ON public.theo_messages;
--   CREATE POLICY "theo_message_insert_own" ON public.theo_messages FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
--   DROP POLICY IF EXISTS "theo_message_select_own" ON public.theo_messages;
--   CREATE POLICY "theo_message_select_own" ON public.theo_messages FOR SELECT TO authenticated USING (created_by = auth.uid());
--   DROP POLICY IF EXISTS "theo_conversation_select_own" ON public.theo_conversations;
--   CREATE POLICY "theo_conversation_select_own" ON public.theo_conversations FOR SELECT TO authenticated USING (created_by = auth.uid());
--   DROP INDEX IF EXISTS public.idx_theo_conversations_published;
--   ALTER TABLE public.theo_conversations DROP COLUMN IF EXISTS published_by;
--   ALTER TABLE public.theo_conversations DROP COLUMN IF EXISTS published_at;
--   ALTER TABLE public.theo_conversations DROP COLUMN IF EXISTS published_to_project;
-- ============================================================================
