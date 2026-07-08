# Codex Governance Package — Theo 1B B8k Attachment Persistence Fix

**Pipeline:** Theo backend regime · Pass 1 VEP · Author = Claude Code · Reviewer = **Codex** · Authority = Walter (2026-07-08)
**Lint:** PASS (`tools/lint_microstep_submission.mjs`)
**vault-theo HEAD:** `2a8ebde` (`development`)

## The bug
Theo only sees an attached file on the turn it's attached; later turns report no access; with 2 PDFs one is often dropped. Root cause (in the LIVE handlers): attachment blocks are fetched for the current `attachment_ids` only and injected onto the last user message only; a per-message size budget silently omits an over-budget 2nd file.

## The fix (both handlers — `theo_message` premium + `theo_message_stream` v4)
Conversation-scoped re-injection: fetch every file linked anywhere in the conversation (by `message_seq`) + this turn's, inject each turn's blocks onto its own user message; **no cap** (Walter-directed); one ephemeral `cache_control` breakpoint at the last historical attachment turn.

## Files
- `Theo_1B_B8k_Attachment_Persistence_Fix_VEP.md` — the VEP (lint PASS).
- `theo_message.LIVE.index.js` / `theo_message_stream.LIVE.js` — Primary References (live deployed source, Kudu-GET).
- `theo_message.index.js` / `theo_message_stream.js` — fixed replacements (`node --check` clean; diff vs LIVE = only the 4 B8k edits).
- `theo_message.function.json` — live premium binding (unchanged; for the copy-paste deploy).

## Deploy (post-APPROVED)
`theo_message_stream` → Claude via Kudu (func-stream, region-stamped host). `theo_message` + function.json → Walter copy-paste into `vaultgpt-func-premium`. Then FE-observed acceptance (attach 2 PDFs, converse across turns + reload).
