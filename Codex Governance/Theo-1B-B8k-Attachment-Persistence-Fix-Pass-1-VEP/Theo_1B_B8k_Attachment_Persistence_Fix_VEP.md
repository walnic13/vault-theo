# Theo 1B B8k — Attachment Persistence Fix (conversation-scoped injection) — Verified Evidence Pack

> Theo backend regime. Pass 1 VEP. Author = Claude Code. Reviewer = **Codex**. Authority = Walter (2026-07-08 — attachments must persist across a conversation). Fixes a live bug: Theo only "sees" an attached file on the exact turn it is attached; on later turns it reports no access. Modifies BOTH deployed gateway handlers — `theo_message` (`vaultgpt-func-premium`, classic) and `theo_message_stream` (`vaultgpt-func-stream`, v4) — to inject **every** file attached anywhere in the conversation, on every turn.

## Grounding Conformance Receipt
Turn Type: Pass 1 — Verified Evidence Pack (backend handler modification)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Repo / HEAD: vault-theo `development` @ `2a8ebde`

Primary References (deployed source, Kudu-GET this turn — byte-complete in-package, no ellipsis; the deployed handler is the source of truth per Golden Handler §5.5, as the repo's B8i/B9 artifacts have drifted behind):
- `Codex Governance/Theo-1B-B8k-Attachment-Persistence-Fix-Pass-1-VEP/theo_message.LIVE.index.js` (live `theo_message`, 37830 B) + `theo_message.function.json` (live).
- `Codex Governance/Theo-1B-B8k-Attachment-Persistence-Fix-Pass-1-VEP/theo_message_stream.LIVE.js` (live `theo_message_stream`, 40926 B).

Replacements (fixed; `node --check` clean; diff vs LIVE = only the B8k edits):
- `…/theo_message.index.js` (premium replacement) + `…/theo_message_stream.js` (stream replacement).

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "The deployed handler is the source of truth" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "Allowed Deltas" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E/DR-T7 | "after a Codex-APPROVED VEP" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | theo_attachments | "is the storage substrate for files" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | theo_attachments | "message_seq int" |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5 | "ownership column" |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "Tier B8 — attachments" |
| Codex Governance/Theo-1B-B8k-Attachment-Persistence-Fix-Pass-1-VEP/theo_message.LIVE.index.js | current-turn-only fetch (the bug) | "WHERE id = ANY($1::uuid[]) AND created_by = $2" |
| Codex Governance/Theo-1B-B8k-Attachment-Persistence-Fix-Pass-1-VEP/theo_message_stream.LIVE.js | single-turn injection (the bug) | "if (i !== lastUserIndex) return m;" |
| Codex Governance/Theo-1B-B8k-Attachment-Persistence-Fix-Pass-1-VEP/theo_message.index.js | the fix | "CONVERSATION-SCOPED attachments" |

## Architecture & boundary reconciliation

Confirmed against the Theo architecture authorities (P2). The change stays inside the model-gateway seam (Architecture §2): it only alters how owned `theo_attachments` rows are assembled into the upstream Anthropic `messages[]` payload. It reads only `theo_` tables, owner-scoped by the explicit `created_by` **ownership column** (Architecture §5 RLS baseline) via the deployed `set_config` triad — no new table, column, policy, endpoint, or contract (so P3 schema / P4 contract are unchanged; `theo_attachments` and its `message_seq int` linkage already exist per the Schema and Tier B8 plan). No Reporting-API surface touched. The seq→message-index mapping relies on the deployed invariant that a user turn's attachments are linked at `message_seq = baseSeq` (the count of prior messages), which equals that turn's index in the client `messages[]` history. No boundary crossing; the wide/no-attachment path is byte-unchanged.

## Gap Disclosure

**PROCEED.** Two foreseeable items, neither blocking:
1. **Deploy authority (DR-T7).** Orchestration §1E/DR-T7 currently scopes Claude Code's deploy exception to `vaultgpt-func-chat` only, but this fix also deploys `theo_message_stream` to `vaultgpt-func-stream`. Walter has authorized Claude Code to deploy chat **and** stream (2026-07-08, and the B9 stream handler was so deployed). PROCEED under that Walter authorization; an Orchestration Role-C should ratify the DR-T7 text (future-trigger, not in this VEP's scope). `theo_message` (premium monolith) is Walter-self-deployed (copy-paste), unchanged.
2. **No cap (Walter-directed).** Attachments are now re-sent every turn with no application cap; the only bound is the upstream Anthropic request/token limit, which surfaces as a clear error, not a silent drop. Prompt caching (one ephemeral breakpoint at the last historical attachment turn) keeps the repeated document blocks cheap. Accepted per Walter's "no cap" decision.

## Component / Handler change (Structural Mirror — P5, Golden Handler §5.1)

Primary Reference = the two LIVE handlers (in-package). Every region is **EXACT** to the LIVE reference except the four edited regions in each handler, classified **ALLOWED DELTA** (Golden Handler §4 — a behavior change confined to attachment assembly, backed by this VEP), identical logic in both handlers:

| Region | Classification | Change |
| ------ | -------------- | ------ |
| `buildAttachmentBlocks` native branch | ALLOWED DELTA | Remove the per-message size-budget omission (no-cap): always inject the full document block. |
| `buildAttachmentBlocks` extract branch | ALLOWED DELTA | Remove the per-message extracted-text omission (no-cap): inject the full extracted text. |
| Attachment fetch block | ALLOWED DELTA | Fetch the conversation's already-linked attachments (`message_seq IS NOT NULL`) **plus** this turn's `attachment_ids`, into a `message_seq → rows` map (`rowsBySeq`), owner-scoped. |
| Upstream message assembly | ALLOWED DELTA | Inject each turn's blocks onto **its own** user message (`messages[seq]`), not just the last; one ephemeral `cache_control` breakpoint at the last historical attachment turn. |

All other regions (auth, ruleset, memory/history injection, ownership checks, persistence incl. the `message_seq` linkage, SSE relay) are byte-unchanged (EXACT). `node --check` passes on both replacements; `diff LIVE↔replacement` shows only the four regions above.

## Verification plan (Golden Curl + FE-observed acceptance)

The endpoints are EasyAuth-gated and attachment verification requires two uploaded files + a multi-turn conversation (runtime state), so full validation is **FE-observed** in the SWA (consistent with prior Theo deploys where the EasyAuth bearer is not held here). Deterministic checks:
- **Deploy integrity (Claude, post-deploy):** Kudu GET-back byte-diff == the in-package replacement; `az functionapp restart`; unauth `curl` each endpoint → **401** EasyAuth (a 500 = handler load/syntax error). `node --check` already green.
- **FE acceptance (Walter, reproduces the report):** in one chat, attach **two** PDFs on turn 1 → Theo summarises **both**; on a later turn (no new attachment) ask about the **first** PDF → Theo still answers from it (no "I don't have access"); ask about the **second** → likewise. Reload the conversation → both remain readable. Confirms conversation-scoped persistence + the two-file fix.

## Deploy (post-Codex APPROVED)
- `theo_message_stream` → **Claude Code** via Kudu VFS PUT to `vaultgpt-func-stream-cyb4g8bhatddencs.scm.uksouth-01.azurewebsites.net` `/api/vfs/site/wwwroot/src/functions/theo_message_stream.js` (If-Match:*, ARM bearer; GET-back diff; restart; 401 probe). Per Walter's chat+stream deploy authorization.
- `theo_message` + `function.json` → **Walter** copy-paste into `vaultgpt-func-premium` (Azure Portal UI); files delivered in-package.
