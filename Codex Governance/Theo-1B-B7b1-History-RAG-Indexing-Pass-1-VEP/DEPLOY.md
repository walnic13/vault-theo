# DEPLOY — Theo B7b-1 History-RAG Indexing

> Apply after Codex APPROVES. One migration + one NEW timer function + new app settings. Distillation timer untouched.

1. Run `b7b1_migration.sql` as `pgadmin_vault` (adds theo_conversations.last_indexed_at + idx + theo_index_due_conversations SECURITY DEFINER; idempotent).
2. Add app settings on `vaultgpt-func-premium`:
   - THEO_EMBED_ENDPOINT = https://wmans-mqxwlcdp-switzerlandnorth.cognitiveservices.azure.com
   - THEO_EMBED_DEPLOYMENT = text-embedding-3-small
   - THEO_EMBED_API_VERSION = 2023-05-15
   - THEO_SEARCH_ENDPOINT = https://vaultgpt-search.search.windows.net
   - THEO_SEARCH_INDEX = theo-messages
   - THEO_SEARCH_API_VERSION = 2023-11-01
   - (optional) THEO_INDEX_IDLE_MINUTES=30, THEO_INDEX_BATCH=20
3. Create NEW function `theo_index_messages`: index.js = `theo_index_messages.index.js`, function.json = `theo_index_messages.function.json` (timerTrigger `0 5,20,35,50 * * * *`).
4. Reply "B7b-1 deployed" → Claude Code verifies the theo-messages index fills (per-owner doc counts; last_indexed_at stamped), then authors B7b-2 (retrieval + injection).

Files == VEP §DDL/§HG/§FJ (byte-identical); handler node --check clean.
