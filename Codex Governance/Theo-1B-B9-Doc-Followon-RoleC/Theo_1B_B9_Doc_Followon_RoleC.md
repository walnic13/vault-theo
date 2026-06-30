# Role-C Verbatim-Edit Handoff — B9 streaming DEPLOYED: Plan §7 tier + API Spec §2.1 endpoint

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Records the **deployed + golden-verified** B9 streaming backend (`theo_message_stream` on the `vaultgpt-func-stream` sidecar) in the two authority docs: (1) `governance/THEO_PHASE_1B_BACKEND_PLAN.md` §7 — promote the streaming follow-on note to a formal B9 tier with deployment status; (2) `spec/THEO_API_SPEC.md` §2.1 — add a `theo_message_stream` contract row. Two verbatim edits; documentation-only; the monolith and all handlers are unchanged.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `bdd60ee4fe9edc971f0c8d03b73325c0e84a8e6a` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET 1** Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Completion / streaming follow-on) | `Read(§7)` this turn | `54f22fe12b5bc0c6e3c089be2474ff0226d1497c` |
| 2 | **TARGET 2** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 gateway contract rows) | `Grep("theo_message")` this turn | `1f166aad5f56635fb850f0e2376bda9f2adc8bc2` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDIT 1 + EDIT 2 — Codex applies verbatim |
| spec/THEO_API_SPEC.md | §2 | "Contract Surface" | EDIT 2 — §2.1 new streaming endpoint row |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
B9 streaming backend is deployed + golden-curl-verified (evidence `.local/b9_streaming_verify_2026-06-30.txt`): `theo_message_stream` on the Windows v4 sidecar `vaultgpt-func-stream` (existing EP1 plan; monolith untouched) relays Foundry-Claude SSE token-by-token through Easy-Auth and persists the full turn on completion (same tables; reload-compatible). The Plan's streaming note should become a formal B9 tier with deployment status, and the API Spec should carry the new endpoint row. Documentation-only; two edits.

## Edit set (2 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT.

### EDIT 1 — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` §7: record B9 streaming as a deployed tier
**Locate (BEFORE) — found once:**
```
and streaming (a deliberate sidecar — see the streaming assessment).
```
**Replace with (AFTER):**
```
and **B9 streaming** — a deliberate sidecar: a 2nd **Windows v4** Function App `vaultgpt-func-stream` on the existing EP1 plan (≈$0; the monolith stays v3 and untouched). `theo_message_stream` relays Foundry-Claude SSE token-by-token to the browser and persists the full turn on completion (same `theo_conversations`/`theo_messages` tables incl. B8i `message_seq`; reload-compatible). **B9 backend DEPLOYED + golden-verified (2026-06-30)** through Easy-Auth; **B9-FE** (live tokens + rotating status words + collapsible Thinking panel, Foundry `thinking_delta` passthrough verified) in Codex review. See the streaming assessment.
```

### EDIT 2 — `spec/THEO_API_SPEC.md` §2.1: add the `theo_message_stream` row (after the Persist-turn row)
**Locate (BEFORE) — found once:**
```
| Persist turn (durable chats) | request additionally accepts optional `conversation_id` (UUID; omit to start a new thread), `app_key`, `app_context`; response returns `conversation_id`; the new user turn + assistant reply (with any `citations`) are persisted under ownership RLS; invalid `conversation_id` → 400, not-owned → 403, not-found → 404 | `1B-deployed` — **DEPLOYED 2026-06-27** (B3a; `POST /api/theo_message`) | `theo_conversations` + `theo_messages` (HF-T2) |
```
**Replace with (AFTER):**
```
| Persist turn (durable chats) | request additionally accepts optional `conversation_id` (UUID; omit to start a new thread), `app_key`, `app_context`; response returns `conversation_id`; the new user turn + assistant reply (with any `citations`) are persisted under ownership RLS; invalid `conversation_id` → 400, not-owned → 403, not-found → 404 | `1B-deployed` — **DEPLOYED 2026-06-27** (B3a; `POST /api/theo_message`) | `theo_conversations` + `theo_messages` (HF-T2) |
| Stream a chat reply (low-latency) | `POST /api/theo_message_stream` — **same request shape** as `theo_message`; responds `text/event-stream`, relaying the upstream Anthropic SSE (`message_start` → `content_block_delta` … → `message_delta`; plus `thinking_delta` when extended thinking is enabled) token-by-token, then a final app event `event: vault_meta` / `data: { conversation_id, model }`; persists the full turn on stream completion (same tables as `theo_message`, incl. B8i `message_seq`). Pre-stream failures (auth/validation/ownership/gateway) return a JSON error with the right status; a mid-stream failure → `event: vault_error`. Runs on the **v4 sidecar** `vaultgpt-func-stream` (Windows, existing EP1 plan); the monolith `theo_message` is unchanged. | `1B-deployed` — **DEPLOYED 2026-06-30** (B9; golden-verified) | HF-T1 gateway (sidecar) + `theo_conversations`/`theo_messages` (HF-T2) |
```

## Note
Two verbatim edits, documentation-only: Plan §7 records B9 streaming as a deployed tier; API Spec §2.1 adds the `theo_message_stream` endpoint row. Both reflect deployed + golden-curl-verified behaviour. No code, no schema, no other docs; the monolith is unchanged.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-B9-Doc-Followon-RoleC/Theo_1B_B9_Doc_Followon_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-B9-Doc-Followon-RoleC/Theo_1B_B9_Doc_Followon_RoleC.md
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-B9-Doc-Followon Role-C. Apply EDIT 1 to `governance/THEO_PHASE_1B_BACKEND_PLAN.md` and EDIT 2 to `spec/THEO_API_SPEC.md` verbatim (each BEFORE anchor found exactly once; HALT on mismatch): Plan §7 records B9 streaming as a deployed tier; API §2.1 gains the `theo_message_stream` row. Documentation-only."*

*End of Role-C Verbatim-Edit Handoff.*
