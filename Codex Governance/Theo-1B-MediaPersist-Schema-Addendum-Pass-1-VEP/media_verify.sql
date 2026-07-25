-- Read-only verification (any theo role): confirm the additive media column exists + is jsonb/nullable.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_messages' AND column_name = 'media';
-- Expect exactly one row: media | jsonb | YES
