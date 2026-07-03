# Theo 1B — VC-1 Native In-Vault Chat Backend Spine — Pass 1 Backend VEP (package index)

**Regime:** Theo backend governance. **Pass:** 1 (Claude Code VEP, plan-only). **Reviewer:** Codex (Pass 2, APPROVED / REJECTED only). **Deploy target:** the dedicated `vaultgpt-func-chat` Function App (Windows, Node 22, Functions v4, on the existing EP1 plan) — **NEVER** the read-only monolith or streaming sidecar.

**Microstep:** VC-1 — the realtime backend spine for native in-Vault chat (People panel → Teams-style DMs + group channels), delivered over Azure Web PubSub. Walter-directed; scope (realtime-via-Web-PubSub + DMs-and-channels) locked 2026-07-03.

## Contents

| File | Role |
| ---- | ---- |
| `Theo_1B_VC1_Chat_Backend_Spine_VEP.md` | The Pass 1 VEP (GCR + Rule Anchor Table + P1–P8 + §MIGRATION + §SM/§SM-FJ Primary Reference + §HG.1–§HG.7 handlers + §PARITY + §DEPLOY + §CURL). Lint: PASS (`tools/lint_microstep_submission.mjs`). |
| `vc1_chat_migration.sql` | Additive + reversible migration — 3 `theo_chat_*` tables + indexes + participant-scoped, non-recursive RLS. Run by Walter at Pass 3. |
| `vc1_chat_verify.sql` | Read-only V1–V5 catalog verification (tables/RLS, columns, constraints, indexes, policies). |
| `theo_chat_negotiate.index.js` / `.function.json` | Web PubSub client token scoped to the caller's thread groups (GET). |
| `theo_chat_create_dm.index.js` / `.function.json` | Canonical DM get-or-create by sorted-OID `dm_key` (POST). |
| `theo_chat_create_channel.index.js` / `.function.json` | Named group channel create; creator auto-included (POST). |
| `theo_chat_list_threads.index.js` / `.function.json` | Caller's threads + last-message + unread count (GET). |
| `theo_chat_list_messages.index.js` / `.function.json` | Seq-cursor paged message history; membership-gated (GET). |
| `theo_chat_send_message.index.js` / `.function.json` | Atomic per-thread seq → persist → publish to the thread's Web PubSub group (POST). |
| `theo_chat_mark_read.index.js` / `.function.json` | Monotonic `last_read_seq` upsert for unread tracking (POST). |

## Key governance facts

- **Primary Reference** (Golden §2, inlined byte-verbatim in §SM/§SM-FJ): the deployed **`theo_share_project`** pair (B5c) — owner/participant-scoped mutation, set_config triad, exists-unscoped 403/404, `{data,meta}`/`{error}` envelope.
- **RLS**: participant-scoped via `theo_chat_threads.member_oids text[]`; **self-contained, non-recursive** (the B5c T12 lesson); **no SECURITY DEFINER helper, no new elevated-read class** — a cited extension of the ownership family (Architecture §5.2).
- **Web PubSub**: classified a **P3 DEVIATION** (new external system, no deployed mirror), justified by Walter's verbatim directive + provisioned infra (VC-1a) + server-SDK research; isolated to `vaultgpt-func-chat`.
- **Gap Register**: native chat is **not yet in** the Phase 1B Backend Plan / API Spec / Schema → **PROCEED** with a mandatory Role-C (Pass 4) future-trigger to amend all three, sequenced after Pass 3 deploy + golden curls.
- **Boundary**: touches only the 3 new `theo_chat_*` tables; no `reporting_*`, no Blob/Graph/Foundry, no monolith/sidecar write, no touch of `theo_message`/`theo_conversations`/`theo_messages`.
