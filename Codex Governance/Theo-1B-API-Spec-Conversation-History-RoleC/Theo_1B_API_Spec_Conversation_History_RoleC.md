# Role-C Verbatim-Edit Handoff — API Spec §2.1 document conversation persistence + history (Recents / reload)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Documents the **deployed, golden-curl-verified** B3a turn-persistence (`conversation_id` round-trip) and the B3b conversation-history read endpoints (`theo_list_conversations`, `theo_get_conversation`) in Theo API Spec §2.1 so the contract is locked before the paired FE durable-chat-wiring VEP cites it (un-spec'd contract = T22). The handlers were Codex-APPROVED (B3a @ 4c4120f; B3b @ 2a121fb4) and verified by golden curls; this edit is purely additive — it adds three rows to the §2.1 table and changes no existing row.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `2a121fb49a3dafdace3042fd16d65feeabe29212` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 chat / model gateway) | `Read(offset=1, limit=55)` this turn | `b5bbd57e1544404ffe98d92fd33e98c8dc4f0289` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed contract — `api/theo_message/index.js` (B3a; `conversation_id`/`app_key`/`app_context` inputs + `conversation_id` output) | `Read(full)` this turn | `549f9a57f8c05ed99b2ce5ac1e586e28109d1deb` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDIT 1 — Codex applies the §2.1 additive rows verbatim |
| spec/THEO_API_SPEC.md | §2.1 | "response `content[]` filtered to" | EDIT 1 anchor row (the §2.1 chat/model-gateway table) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
B3a (deployed, golden-curl-verified) made `theo_message` durable: the request accepts an optional `conversation_id` (UUID) plus `app_key` / `app_context`, the response returns the `conversation_id`, and the user turn + assistant reply (with any `citations`) are persisted under ownership RLS. B3b (deployed 2026-06-27, golden-curl-verified) added two read endpoints — `theo_list_conversations` (backs Recents) and `theo_get_conversation` (backs reload, returning each message's persisted `citations`). §2.1 documents only the stateless send-message contract; it does not yet lock the persistence round-trip or the two read endpoints. The paired **FE durable-chat-wiring VEP** depends on all three; this edit documents them so the cited contract exists (resolves the FE VEP T22). Additive only — the existing send-message row is unchanged.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `spec/THEO_API_SPEC.md`. EDIT 1 appends three rows to the §2.1 table by re-emitting the existing send-message row followed by the three new rows (no existing text altered).

### EDIT 1 — §2.1 table: add persistence + history rows

**Locate (BEFORE) — found once:**

```
| Send message → assistant reply | Standard Anthropic Messages API (`model`, `max_tokens`, `system`, `messages[]`); response `content[]` filtered to `type:"text"`; `web_search`/`web_fetch` grounding (B1.7) may attach a `citations` array to text blocks — each entry `{ type:"web_search_result_location", url, title, cited_text, encrypted_index }` (additive, backward-compatible); artifact markers `[[ARTIFACT …]]` parsed client-side | `1A-contract` (mock gateway) / `1B-deployed` — **DEPLOYED 2026-06-26** (`POST /api/theo_message`) | HF-T1 model gateway broker |
```

**Replace with (AFTER):**

```
| Send message → assistant reply | Standard Anthropic Messages API (`model`, `max_tokens`, `system`, `messages[]`); response `content[]` filtered to `type:"text"`; `web_search`/`web_fetch` grounding (B1.7) may attach a `citations` array to text blocks — each entry `{ type:"web_search_result_location", url, title, cited_text, encrypted_index }` (additive, backward-compatible); artifact markers `[[ARTIFACT …]]` parsed client-side | `1A-contract` (mock gateway) / `1B-deployed` — **DEPLOYED 2026-06-26** (`POST /api/theo_message`) | HF-T1 model gateway broker |
| Persist turn (durable chats) | request additionally accepts optional `conversation_id` (UUID; omit to start a new thread), `app_key`, `app_context`; response returns `conversation_id`; the new user turn + assistant reply (with any `citations`) are persisted under ownership RLS; invalid `conversation_id` → 400, not-owned → 403, not-found → 404 | `1B-deployed` — **DEPLOYED 2026-06-27** (B3a; `POST /api/theo_message`) | `theo_conversations` + `theo_messages` (HF-T2) |
| List conversations → Recents | `GET /api/theo_list_conversations` (optional `?limit`, integer 1..200, default 50; malformed → 400); response `{ conversations: [{ id, title, model, project_id, app_key, created_at, updated_at }] }` newest-first, RLS-scoped to the signed-in user | `1B-deployed` — **DEPLOYED 2026-06-27** (B3b) | `theo_conversations` (HF-T2) |
| Get conversation → reload thread | `GET /api/theo_get_conversation?conversationId=<uuid>`; response `{ conversation, messages: [{ id, seq, role, content, model, citations, created_at }] }` ordered by `seq`; persisted `citations` returned for assistant turns; invalid id → 400, not-found → 404, not-owned → 403 | `1B-deployed` — **DEPLOYED 2026-06-27** (B3b) | `theo_conversations` + `theo_messages` (HF-T2) |
```

## Note
Purely additive: the existing send-message row is re-emitted byte-identical and three rows are appended below it. No route/status/backing of any existing row changes. All field shapes match the deployed, golden-curl-verified B3a/B3b handlers (capture: `.local/b3a_verify_result_2026-06-27.txt`, `.local/b3b_verify_result_2026-06-27.txt`). After this lands, the FE durable-chat-wiring VEP cites the documented §2.1 contract (T22 resolved).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-API-Spec-Conversation-History-RoleC/Theo_1B_API_Spec_Conversation_History_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-API-Spec-Conversation-History-RoleC/Theo_1B_API_Spec_Conversation_History_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-API-Spec-Conversation-History Role-C. Apply EDIT 1 to `spec/THEO_API_SPEC.md` §2.1 verbatim (BEFORE anchor — the send-message row — found exactly once); HALT on mismatch. One file, one edit: re-emit the send-message row byte-identical and append three additive rows (persist-turn, list-conversations, get-conversation). No existing row changes."*

*End of Role-C Verbatim-Edit Handoff.*
