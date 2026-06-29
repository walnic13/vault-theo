-- B8c addendum post-deploy verification (read-only; catalog).
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema='public' AND table_name='theo_attachments'
  AND column_name IN ('ingestion_class','extracted_text_path')
ORDER BY column_name;
