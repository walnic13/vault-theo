-- Migration: add last_opened_at to theo_conversations (restore-last-opened-conversation)
-- Theo 1B backend. Idempotent; NO top-level transaction control (Golden Handler §5.2).
-- Walter executes as pgadmin_vault against vaultgpt-postgres-prod (schema public).
--
-- RLS unchanged: last_opened_at is a new nullable column on the existing RLS-governed
-- theo_conversations; the four deployed owner-scoped policies (theo_conversation_select_own /
-- _insert_own / _update_own / _delete_own, all keyed on created_by = auth.uid()) already cover it.
-- The deployed theo_get_conversation handler stamps it (owner-scoped UPDATE, permitted by
-- theo_conversation_update_own); theo_list_conversations returns + orders by it.

alter table public.theo_conversations
  add column if not exists last_opened_at timestamptz;

-- Supports ORDER BY last_opened_at DESC in the owner-scoped list query.
create index if not exists idx_theo_conversations_created_by_last_opened_desc
  on public.theo_conversations (created_by, last_opened_at desc);

comment on column public.theo_conversations.last_opened_at is
  'Timestamp the owner last OPENED this conversation (stamped by theo_get_conversation on open). '
  'Distinct from updated_at (last message). Frontend restores the newest last_opened_at on reopen. '
  'NULL for conversations not opened since this migration; list ORDER BY uses NULLS LAST.';
