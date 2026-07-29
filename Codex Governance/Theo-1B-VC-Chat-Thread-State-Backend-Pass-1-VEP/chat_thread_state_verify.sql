-- Read-only verification (Claude Code runs after Walter confirms the migration). Expect two rows: hidden, muted.
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_thread_members'
  AND column_name IN ('hidden', 'muted')
ORDER BY column_name;
