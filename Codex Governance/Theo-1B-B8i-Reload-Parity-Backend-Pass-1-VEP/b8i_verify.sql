SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema='public' AND table_name='theo_attachments' AND column_name='message_seq';
