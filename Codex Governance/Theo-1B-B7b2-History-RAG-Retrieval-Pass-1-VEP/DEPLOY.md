# DEPLOY — Theo B7b-2 History-RAG Retrieval + Injection

> Apply after Codex APPROVES. Replace ONE handler's index.js. function.json + app settings unchanged (THEO_EMBED_*/THEO_SEARCH_* from B7b-1 reused; optional THEO_HISTORY_TOP_K=5).

1. `theo_message` → replace `index.js` with this folder's `theo_message.index.js` (== VEP §FIX). Leave function.json as-is.
2. Reply "B7b-2 deployed" → Claude Code golden-curls: recall a prior indexed discussion in a NEW conversation; baseline-unchanged; isolation; non-fatal-on-no-match.

Adds only a non-fatal history-RAG block (embed latest user msg -> hybrid search theo-messages filtered created_by=$oid, exclude current thread -> inject top-k) + the effectiveSystem fold; else byte-identical to the deployed injection version.
