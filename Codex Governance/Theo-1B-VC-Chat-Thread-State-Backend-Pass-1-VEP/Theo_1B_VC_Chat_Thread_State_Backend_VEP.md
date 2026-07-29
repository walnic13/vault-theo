# Theo 1B — VC Chat per-user thread-state backend (migration `theo_chat_thread_members.hidden`/`muted` + new `theo_chat_set_thread_state` + `theo_chat_list_threads` hidden-filter/flags) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **Walter runs the migration at Pass 3 FIRST**, then Claude Code deploys the handlers to the dedicated **`vaultgpt-func-chat`** app (§1E / DR-T7) via Kudu VFS + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema deltas. Plan-only.
>
> **Scope:** server-persisted per-user-per-thread state so a user can (a) **remove** a DM from their Orbit list and (b) **mute** a thread. (1) a **migration** adding two additive booleans `hidden` / `muted` to the existing per-user table `theo_chat_thread_members`; (2) NEW `theo_chat_set_thread_state` (`{ thread_id, hidden?, muted? }` — the caller toggles their own flags); (3) MODIFY `theo_chat_list_threads` to return `hidden`/`muted` per thread and to **exclude hidden threads UNLESS they have unread** (a new message resurfaces a hidden DM — WhatsApp-archive semantics).
>
> **Why no new table / no new RLS / no SECURITY DEFINER:** `theo_chat_thread_members` (PK `(thread_id, member_oid)`) is already the per-user-per-thread table (it holds `last_read_seq`). Its deployed UPDATE policy is **"your own read-state row"** (`member_oid = auth.uid()`); two additive columns inherit it unchanged — a self-service toggle of one's own row needs no new policy and no privileged bypass (unlike VC-16 `leave`, which had to *remove* the caller from `member_oids`). The write path is a byte-faithful mirror of the deployed `theo_chat_mark_read` (which already upserts the caller's own `theo_chat_thread_members` row).
>
> **Three design calls (Walter-directed, flagged for Pass 2):** (a) **hidden resurfaces on unread** (recommended — never hide a live message) — implemented in the `list_threads` WHERE via the existing `unread.cnt` LATERAL; (b) **mute is stored + returned here**; the FE (Increment C) applies it to the in-app badge; true server-side **push suppression** (the push sender skipping muted recipients) is a small **follow-up** (not in this pack); (c) the columns are thread-generic, so **channels can be muted too** (free); **hide** is DM-oriented in the FE.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `b09bd2d36db360c597874b470cbdd25265ac19f4` (vault-theo, `development`)
Revision: R1 — Codex Pass 2 (@ `163dc03`) REJECTED on T13 / backend hard gate: the handler mirrored the deployed `theo_chat_mark_read` thread-group WebPubSub publish, but every participant auto-joins the thread group, so that publish would LEAK a member's private `hidden`/`muted` state to all other participants (read receipts are intentionally participant-visible; per-user hide/mute is not). **Fixed:** removed the WebPubSub publish entirely (dropped the `@azure/web-pubsub` require + `HUB`); the handler now persists + returns `{ thread_state }` only, and the caller's other sessions reconcile via `list_threads` (a user-scoped realtime channel is a future concern). `theo_chat_set_thread_state/index.js` blob `62b408c6…` → `cfaea80b4644b209ee56cbde5c7e1d60d7e0730a`; §P3, §HG.1 Structural Mirror, §SM-NOTE, and the Gap Register updated. No other change; `node --check` OK; lint re-PASS.
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for chat per-user thread-state (hidden/muted). P1–P8 walked; additive+reversible+idempotent migration (two booleans on `theo_chat_thread_members`) with read-only verify SQL; Primary Reference = the **deployed** `theo_chat_mark_read` (the per-user-per-thread upsert to the SAME table), fetched byte-verbatim from `vaultgpt-func-chat` Kudu this turn (deployed blob `450be900f600c310b757d71671d7179168df5279`) and inlined in `primary-reference/`; ONE NEW handler (`theo_chat_set_thread_state`) mirroring it + ONE MODIFY (`theo_chat_list_threads` — patched off the **deployed** copy, Kudu blob `385e3943660e06a961b58e066417bc6007a2a78d`, fetched this turn, since the repo copies drift behind live per Golden Handler §"deployed = truth"). No new table, no new RLS policy, no SECURITY DEFINER. No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>` (docs) / `git hash-object <path>` (in-pack proposed); verifiable via `git cat-file -p <sha>`. Deployed baselines cited by their Kudu VFS blob (GET this turn).

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register; Walter executes migrations) | `grep`/`sed` (VEP Format; Gap Register; migration authority) this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor; §4A P-track; lint C-list) | `sed`/`grep` (§4A; lint C1–C12) this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 external-system; deployed=truth; Kudu deploy) | `grep` (primary-ref selection; deployed=truth; deploy mechanics) this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception; Walter runs migrations) | `grep` (pass axis; §1E) this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 6 | Microstep source — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (chat VC tier posture) | `grep` (VC tier) this turn | `97645ecd0bc9e3c25082dd2a333c82ab83446584` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS families) | `grep` (RLS family) this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | Contract basis — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§8 `theo_chat_thread_members` PK + per-member read-state + participant RLS; UPDATE = your own row) | `grep` (§8 thread_members + policies) this turn | `a698d85692b3ccaf052e639f226c76d31c20c0df` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — list_threads projection + mark_read; new set_thread_state lands here at Pass 4) | `grep` (§2.10 list_threads/mark_read) this turn | `a667f4174659b0d7b6e7aa54709047249627420a` |
| 10 | Primary Reference handler (DEPLOYED `theo_chat_mark_read`, byte-verbatim from Kudu — the per-user-per-thread upsert to `theo_chat_thread_members` + set_config triad + WebPubSub publish) — `Codex Governance/Theo-1B-VC-Chat-Thread-State-Backend-Pass-1-VEP/primary-reference/theo_chat_mark_read.index.js.md` | Kudu GET (deployed blob `450be900…`) + `Read(full)` this turn | `e8d601cee67456f1b93cdad9e9fc5ac384659a39` |
| 11 | Primary Reference function.json (DEPLOYED `theo_chat_mark_read`) — `Codex Governance/Theo-1B-VC-Chat-Thread-State-Backend-Pass-1-VEP/primary-reference/theo_chat_mark_read.function.json.md` | Kudu GET + `Read(full)` this turn | `f1d98a2732d4086254939c6881caedb484261e1b` |

No ChatGPT advisory cited. No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + streaming sidecar `vaultgpt-func-stream` READ-ONLY — deploy target `vaultgpt-func-chat`.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_mark_read` |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped self-service toggle is an ownership-family extension |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8 | "theo_chat_thread_members" | §MIGRATION / §P6 — additive `hidden`/`muted` on that table |
| Codex Governance/Theo-1B-VC-Chat-Thread-State-Backend-Pass-1-VEP/primary-reference/theo_chat_mark_read.index.js.md | set_config triad | "set_config('app.current_user_id'" | §HG.1 — the new handler keeps the deployed set_config triad + membership gate + own-row upsert |
| Codex Governance/Theo-1B-VC-Chat-Thread-State-Backend-Pass-1-VEP/primary-reference/theo_chat_mark_read.function.json.md | binding | "httpTrigger" | §FJ — anonymous httpTrigger POST binding (EasyAuth gates identity) |

## P1 — Feature identification
**Microstep:** per-user-per-thread state for the Orbit chat list — `hidden` (remove a DM from *my* list) + `muted` (silence *my* notifications for a thread). NEW `POST /api/theo_chat_set_thread_state { thread_id, hidden?, muted? }`; MODIFY `theo_chat_list_threads` to return the two flags and to drop hidden-with-no-unread threads.
**Migration:** `theo_chat_thread_members.hidden boolean NOT NULL DEFAULT false` + `.muted boolean NOT NULL DEFAULT false`.
**Out of scope:** the FE ⋯ menu (vault-origin Increment C); server-side push suppression for muted recipients (a small follow-up on the send/push path); unhide UI / an "Archived" grouping (future, reuses the returned `hidden` flag); channel hide (channels use leave/archive).

## P2 — Architecture & boundary reconciliation
**Handler family.** `theo_chat_set_thread_state` is a Family-B HTTP handler that is a byte-faithful mirror of the deployed `theo_chat_mark_read`: `pg` Pool on `POSTGRES_CONNECTION_STRING`; EasyAuth `x-ms-client-principal` OID (401 if absent); `parseBody`; `isUuid(thread_id)` validate-before-SQL; `set_config` triad; membership gate (`SELECT 1 … $2 = ANY(member_oids)` → 404); an own-row upsert into `theo_chat_thread_members`; `{data,meta}`/`{error}` envelope; `42501`→403. The deltas vs the reference are the validated field set (`hidden`/`muted` booleans instead of `seq`) and the upserted columns; and — a deliberate **removal** — the reference's thread-group WebPubSub publish is NOT carried (per-user `hidden`/`muted` is private and must not reach other participants; §P3/§P8). `theo_chat_list_threads` is patched off its **deployed** copy: two columns added to the SELECT + mapped object, and one `WHERE` conjunct.
**Boundary.** Reads/writes only `theo_chat_*`. No `reporting_*` / monolith / Blob / Graph / Foundry. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY.
**Validation before SQL.** UUID `thread_id`; each of `hidden`/`muted` a strict `typeof === "boolean"` when present; at least one required; deterministic 400 before any SQL.

## P2.5 / GR — Gap Register
**PROCEED.**
- **G-1 — no privileged path.** Unlike VC-16 `leave` (which mutated `member_oids` and needed a SECURITY DEFINER bypass), this toggles the caller's OWN `theo_chat_thread_members` row, which the deployed UPDATE policy already permits — no new policy, no definer, no elevated-read class. **PROCEED.**
- **G-2 — hidden resurfaces on unread.** The `list_threads` WHERE excludes hidden threads only when `unread.cnt = 0`, so a new message from the other party re-surfaces a hidden DM (no missed messages). Uses the existing unread LATERAL — no new subquery cost class. **PROCEED.**
- **G-3 — mute is state-only here.** This pack persists + returns `muted`; the in-app badge suppression is the FE (Increment C), and server-side push suppression is a disclosed follow-up on the push path (not this pack). No half-wired behavior ships. **PROCEED.**
- **G-5 — no realtime for private state (R1).** `hidden`/`muted` are per-user PRIVATE state; the handler deliberately does NOT publish to the thread's WebPubSub group (unlike the read-receipt reference), because every participant auto-joins that group and a publish would leak the flag to them (T13 / backend hard gate). The caller's other sessions reconcile via `list_threads`; a user-scoped realtime channel is a separate future concern. **PROCEED.**
- **G-4 — additive/reversible migration, no data backfill.** Both columns default `false`; existing rows and threads with no member row (COALESCE default) behave exactly as today. **PROCEED.**

## P3 — External-system reconciliation
No new external system, and — unlike the Primary Reference — **no realtime at all**. `theo_chat_mark_read` publishes a read-receipt event to the thread's WebPubSub group; this handler does **not** publish, because the deployed chat realtime contract auto-joins every participant to the thread group and per-user `hidden`/`muted` is private (a group publish would leak it — T13 / backend hard gate, R1). The handler uses `pg` only. No Graph/Blob/Foundry/WebPubSub. The caller's other sessions reconcile the flags on their next `list_threads`.

## P4 — Contract reconciliation
NEW `POST /api/theo_chat_set_thread_state` `{ thread_id, hidden?, muted? }` → **200** `{ thread_state: { thread_id, member_oid, hidden, muted } }`. Non-participant → **404**; missing/!UUID `thread_id`, neither flag present, or a non-boolean flag → **400**; RLS deny (`42501`) → **403**. MODIFY `theo_chat_list_threads` → each thread object gains `hidden` + `muted` (booleans); hidden-with-no-unread threads are omitted. Both land in API-Spec §2.10 at Pass 4 (Role-C).

## P5 — Error-model reconciliation
Identical to the Primary Reference: shared `errorBody`/`successBody`; 400 (validation), 401 (no EasyAuth OID), 404 (non-participant, no existence leak), 403 (`42501`), 500 (fallback). `buildKnownError` for the 404 throw. No new error codes.

## P6 — Data-shape reconciliation
`theo_chat_thread_members` (§8) gains `hidden boolean NOT NULL DEFAULT false`, `muted boolean NOT NULL DEFAULT false`. PK `(thread_id, member_oid)` unchanged; FK→`theo_chat_threads` ON DELETE CASCADE unchanged; the additive columns follow the `theo_` conventions. `list_threads` returns them as JSON booleans (`r.hidden === true`).

## P7 — Idempotency / concurrency
The set-state upsert is idempotent — `ON CONFLICT (thread_id, member_oid) DO UPDATE` with `COALESCE($n::boolean, existing)`, so setting the same value twice is a no-op and an omitted field is preserved (no read-modify-write race: the COALESCE keeps the current column value atomically within the single UPSERT). No `FOR UPDATE` needed — a single-row own-row write, no cross-row invariant (contrast VC-16 `leave`/`transfer_admin`, which guard the admin∈members invariant).

## P8 — Security / RLS reconciliation
The write targets the caller's OWN row (`member_oid = $2 = the EasyAuth OID`); the deployed `theo_chat_thread_members` UPDATE policy is "your own read-state row" and INSERT is "into a thread you belong to", so RLS permits the toggle with no change. Defence-in-depth (the shared app role bypasses RLS): the handler ALSO enforces participant scope with the explicit `SELECT 1 … = ANY(member_oids)` gate (→404) and writes only `member_oid = $2`, exactly as `mark_read` does. No SECURITY DEFINER, no new elevated-read class, no existence leak.

## §MIGRATION — `chat_thread_state_migration.sql` (additive + reversible + idempotent; run by Walter at Pass 3 BEFORE the handler deploy)

```sql
-- VC — Chat per-user-per-thread state (hidden / muted). Additive + reversible + idempotent.
-- Golden SQL: no top-level transaction control, no psql meta-commands. Walter executes BEFORE the handler deploy.
-- Extends the existing per-user-per-thread table theo_chat_thread_members (PK (thread_id, member_oid)).
-- Inherits that table's deployed RLS policies unchanged (UPDATE = your own row); no new policy, no SECURITY DEFINER.
ALTER TABLE public.theo_chat_thread_members ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;
ALTER TABLE public.theo_chat_thread_members ADD COLUMN IF NOT EXISTS muted  boolean NOT NULL DEFAULT false;
```

Verify (read-only; Claude Code runs after Walter confirms) — `chat_thread_state_verify.sql`:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_thread_members'
  AND column_name IN ('hidden', 'muted')
ORDER BY column_name;
```

Reversal (if ever needed): `ALTER TABLE public.theo_chat_thread_members DROP COLUMN IF EXISTS hidden, DROP COLUMN IF EXISTS muted;`

## §SM — Primary Reference (deployed `theo_chat_mark_read`, byte-verbatim)
The canonical Primary Reference is the **deployed** `theo_chat_mark_read` (Kudu blob `450be900f600c310b757d71671d7179168df5279`), inlined byte-verbatim (spliced from the live Kudu GET, not retyped) at `primary-reference/theo_chat_mark_read.index.js.md` and `primary-reference/theo_chat_mark_read.function.json.md`. It is the closest deployed handler: a per-user-per-thread own-row upsert into `theo_chat_thread_members`, with the exact auth/set_config/membership-gate/envelope shape the new handler mirrors. The reference's thread-group WebPubSub publish is intentionally **NOT** mirrored (per-user state is private — §P3/§HG.1/R1).

## §HG.1 — `theo_chat_set_thread_state` (NEW; structural mirror of deployed `theo_chat_mark_read`)
Full handler in `theo_chat_set_thread_state/index.js` (blob `cfaea80b4644b209ee56cbde5c7e1d60d7e0730a`) + `function.json` (blob `ec786432f8e2ca14b8c214187e65f228b3e840d5`).

Structural Mirror Table (vs the deployed `theo_chat_mark_read`):

| Region | Classification | Basis |
| ------ | -------------- | ----- |
| `require pg` + Pool | EXACT | frozen chat-handler preamble |
| `require @azure/web-pubsub` + `HUB` const | **REMOVED (privacy)** | the reference's realtime publish is dropped — per-user state must not fan out to the thread group (R1) |
| `corsHeaders` (POST, OPTIONS) | EXACT | same method set as mark_read |
| helper block (`send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid`) | EXACT | frozen Family-B helpers, byte-identical |
| OID extraction + 401 | EXACT | frozen EasyAuth pattern |
| `thread_id` `isUuid` validate → 400 | EXACT | mark_read pattern |
| `seq` strict-regex → int | **REPLACED** with `hidden`/`muted` boolean validation (each optional, `typeof==="boolean"`, ≥1 required) | ALLOWED DELTA — endpoint-specific validated field set (Golden §4 same-shape; no new external system) |
| `set_config` triad | EXACT | frozen RLS session pattern |
| membership gate `SELECT 1 … = ANY(member_oids)` → 404 | EXACT | frozen participant gate |
| own-row upsert into `theo_chat_thread_members` | ALLOWED DELTA — same table + same `ON CONFLICT (thread_id, member_oid)`; sets `hidden`/`muted` via `COALESCE($n::boolean, existing)` instead of `last_read_seq = GREATEST(...)` | endpoint-specific columns, same own-row write |
| WebPubSub best-effort post-commit publish (present in the reference) | **REMOVED (privacy / T13 hard gate)** | the thread-group publish would leak private per-user `hidden`/`muted` to all participants; dropped entirely — caller's other sessions reconcile via `list_threads` (R1) |
| error mapping (`42501`→403; known→status; 500) + `finally release` | EXACT | frozen |

No DEVIATION. No new external system, helper layer, auth surface, or error-to-status mapping.

## §HG.2 — `theo_chat_list_threads` (MODIFY off the deployed copy)
Patched off the **deployed** `theo_chat_list_threads` (Kudu blob `385e3943660e06a961b58e066417bc6007a2a78d`, fetched this turn). Full patched file in `theo_chat_list_threads/index.js` (blob `b222721d4c89a0226d9345f9fe45ea39ca88a529`); `function.json` unchanged (GET/OPTIONS, blob `827c05308062b231da31794b39f620c0e33ed771`). Three edits, all additive to the single LATERAL query:

1. **SELECT** — add `COALESCE(mem.hidden, false) AS hidden, COALESCE(mem.muted, false) AS muted` (after the existing `members_read` column).
2. **WHERE** — add, alongside the deployed `AND t.archived_at IS NULL`:
   `AND NOT (COALESCE(mem.hidden, false) AND COALESCE(unread.cnt, 0) = 0)` — exclude the caller's hidden threads UNLESS they have unread (resurface-on-unread; `unread.cnt` is the existing unread LATERAL).
3. **Mapped object** — add `hidden: r.hidden === true, muted: r.muted === true` (beside `admin_oid`).

No other line changes; `admin_oid`, `members_read`, `unread_count`, `last_message`, ordering, RLS, and error mapping are byte-identical to deployed.

## §API-SPEC — Role-C (Pass 4) documentation delta
After Pass-3 deploy + golden curls: API-Spec §2.10 gains (a) the `theo_chat_set_thread_state` route row and (b) `hidden`/`muted` in the `theo_chat_list_threads` returned thread object + the hidden-exclusion note (mirroring the VC-16 `archived_at` exclusion sentence); Schema §8 records the two additive `theo_chat_thread_members` columns. Codex authors the Role-C; Claude Code lands it byte-faithful.

## §DEPLOY — Pass 3 (Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
1. **Walter** runs `chat_thread_state_migration.sql`; Claude Code runs `chat_thread_state_verify.sql` (expect the two columns) after Walter confirms.
2. **Claude Code** deploys `theo_chat_set_thread_state` (NEW) + overwrites `theo_chat_list_threads` (MODIFY) to `vaultgpt-func-chat` via Kudu VFS (§1E/DR-T7 — after this Pass-2 APPROVAL): resolve SCM host, management-token `PUT` `--data-binary @file` `If-Match:*` (204), GET-back+diff, `az functionapp restart`, confirm the new function + an unauth 401 health probe.
3. Role-C (Pass 4): API-Spec §2.10 + Schema deltas.

## §CURL — post-deploy verification (Claude Code; az-login token; structural only)
```
TOKEN=$(az account get-access-token --resource "api://<chat-app-audience>" --query accessToken -o tsv)
# set-state (hide a DM), expect 200 { data: { thread_state: { thread_id, member_oid, hidden:true, muted:false } } }
curl -sS -w '\nHTTP %{http_code}\n' -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_set_thread_state" \
  -H "Authorization: Bearer $TOKEN" -H "x-ms-token-aad-access-token: $TOKEN" -H "Content-Type: application/json" \
  --data '{"thread_id":"<a-thread-the-caller-is-in>","hidden":true}'
# list_threads — the hidden DM is absent while unread=0; each thread object now carries hidden/muted
curl -sS -w '\nHTTP %{http_code}\n' "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_list_threads" \
  -H "Authorization: Bearer $TOKEN" -H "x-ms-token-aad-access-token: $TOKEN"
# un-hide, expect hidden:false and the thread returns to list_threads
curl -sS -w '\nHTTP %{http_code}\n' -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_set_thread_state" \
  -H "Authorization: Bearer $TOKEN" -H "x-ms-token-aad-access-token: $TOKEN" -H "Content-Type: application/json" \
  --data '{"thread_id":"<same-thread>","hidden":false}'
# non-participant thread → 404; missing flags → 400 (structural assertions; token never printed)
```

## §SM-NOTE — structural mirror
The new handler is a Family-B mirror of the deployed `theo_chat_mark_read` with two ALLOWED DELTAs (the endpoint-specific validated field set + the upserted columns) and one deliberate **REMOVAL** — the reference's thread-group WebPubSub publish is dropped (R1: per-user `hidden`/`muted` is private and must not fan out to participants; T13/backend hard gate). The MODIFY is three additive lines on the deployed `theo_chat_list_threads`. No realtime, no new external system, helper, auth surface, table, RLS policy, or SECURITY DEFINER.

## §LINT — mechanical lint PASS (Claude Code this turn; Codex re-runs at Pass 2)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-VC-Chat-Thread-State-Backend-Pass-1-VEP/Theo_1B_VC_Chat_Thread_State_Backend_VEP.md" --repo-root .
PASS  <repo-root>/Codex Governance/Theo-1B-VC-Chat-Thread-State-Backend-Pass-1-VEP/Theo_1B_VC_Chat_Thread_State_Backend_VEP.md
exit code: 0
```

## Requested Pass 2 verdict
Codex Pass-2 review. On APPROVED: Walter runs the migration → Claude Code deploys the two handlers to `vaultgpt-func-chat` + runs the golden curls → Role-C lands §2.10 + Schema. Then vault-origin Increment C (the DM ⋯ menu) consumes `set_thread_state` + the new flags.
