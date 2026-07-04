# Theo 1B — VC-8 Teams-Style Read Receipts Backend (`theo_chat_list_threads` projects peers' read positions; `theo_chat_mark_read` publishes a live `read` event) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2, APPROVED / REJECTED only). Walter deploys the two modified handlers at Pass 3 (to the **dedicated `vaultgpt-func-chat`** app — **never** the monolith); Claude Code runs golden curls after deploy; Role-C (Pass 4) lands the API-Spec §2.10 documentation delta. This pack is **plan-only** — no code is deployed by authoring it.
>
> **Scope (VC-8 = the backend for Teams-style "Seen"):** modify **two** deployed VC-1 handlers, **no schema change, no migration**. (1) `theo_chat_list_threads` projects each thread's OTHER participants' read positions as `members_read` (so a sender can render "Seen" on load); (2) `theo_chat_mark_read` publishes a transient `{type:"read", thread_id, reader_oid, last_read_seq}` to the thread's Web PubSub group (so the sender's "Seen" moves live when a peer reads). **DM-first**: the FE renders a single "Seen" indicator under the sender's latest message the peer has read (group "Seen by N" is deferred). The FE surface is a separate vault-origin FE VEP (VC-8-FE).
>
> **No migration.** The VC-1 schema already stores per-member `last_read_seq` in `theo_chat_thread_members`, and the deployed `theo_chat_member_select` RLS policy already permits a participant to read **any** member row of a thread they belong to. VC-8 therefore reads data that already exists under a policy that already allows it — there is **no DDL, no new column, no new policy, no migration** for Walter to run. Deploy of the two handlers is the only Pass-3 action.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `e6fae63191f7a8ae9510f3072dafb65cae9423d9` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP modifying two deployed VC-1 chat handlers for Teams-style read receipts. P1–P8 walked; NO migration (schema + RLS already support the read — analysis in §NO-MIGRATION); Primary Reference = deployed `theo_chat_send_message` pair (the exact Web PubSub publish idiom reused in `mark_read`), inlined byte-verbatim; both modified handlers inlined as full replacements alongside their deployed CURRENT source; function.json bindings unchanged (method/route identical). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + sidecar `vaultgpt-func-stream` READ-ONLY. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `grep -F "VEP Format"` + `grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A P-track) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates; reviewer regime) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 external-system) | `grep -F "selects **exactly one** deployed handler file"` + `grep -F "new-domain or new-external-system helper"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis) | `grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (ownership-only posture → VC gap already recorded VC-1) | `grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_` conventions; `theo_chat_*` already documented VC-1 Role-C) | `grep -F "theo_projects"` this turn | `62b898b881ad64023f99ae10414093681aaa84c8` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — the response delta lands here at Pass 4; separate-app/v4 precedent) | `grep -F "the monolith \`theo_message\` is unchanged"` this turn | `e3c036d782f58f08c43405c7d384d9b71ae181cc` |
| 10 | **Primary Reference handler** (deployed; the Web PubSub publish idiom reused in `mark_read`) — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.index.js` | `Read(full)` this turn | `483a0b4dfbeeff882b5d73055914f76e8024601a` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.function.json` | `Read(full)` this turn | `0284d265cd81bec4c34b5513d46c41b7ba6601ff` |
| 12 | **MODIFY target A (deployed CURRENT)** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_mark_read.index.js` | `Read(full)` this turn | `cd813b36b466f5a63a88e064861a52169f9d718e` |
| 13 | **MODIFY target B (deployed CURRENT)** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_list_threads.index.js` | `Read(full)` this turn | `97a3c3a6b15b13d8f007c478f08c0ffe3137a02a` |
| 14 | **Schema basis (read-state storage + RLS)** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_thread_members.last_read_seq`; `theo_chat_member_select` policy) | `Read(full)` this turn | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` and sidecar `vaultgpt-func-stream` are READ-ONLY (Walter hard rule) — the deploy targets the existing `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §NO-MIGRATION + §SM + §HG + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P2.5 — VC tier is Walter-directed; the Plan gap was recorded at VC-1 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_send_message` pair |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no NEW external system (Web PubSub already deployed VC-1; publish idiom reused verbatim) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-8 touches only `theo_chat_*`; no `reporting_*`, no monolith |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped RLS (unchanged) is the cited extension of the ownership family |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "theo_projects" | §P6 / §NO-MIGRATION — `theo_chat_*` follow the `theo_` conventions; no schema change |
| spec/THEO_API_SPEC.md | separate-app | "the monolith `theo_message` is unchanged" | §P2 — dedicated `vaultgpt-func-chat`; monolith untouched |
| spec/THEO_API_SPEC.md | v4 precedent | "Runs on the **v4 sidecar**" | §P2 — chat app is the deployed dedicated v4 app; deploy target unchanged |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.index.js | publish idiom | "serviceClient.group(threadId).sendToAll" | §HG.1 — `mark_read` reuses the exact server-authoritative publish idiom |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.* — both handlers keep the deployed set_config triad |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.function.json | binding | "httpTrigger" | §FJ — bindings unchanged (method/route identical) |

## P1 — Feature identification

**Microstep:** VC-8, Teams-style read receipts ("Seen"). When a participant reads a conversation, the OTHER participant(s) should see that their messages have been read — the Microsoft Teams "Seen" idiom (Walter-preferred over WhatsApp per-message ticks). This maps directly onto the per-member `last_read_seq` the VC-1 schema already tracks.

**Two deployed handlers modified (both on `vaultgpt-func-chat`); NO new endpoint, NO schema change:**
- `GET /api/theo_chat_list_threads` — **add** `members_read: [{ oid, last_read_seq }]` per thread (the other participants' read positions), so a client can render "Seen" on load without waiting for a live event.
- `POST /api/theo_chat_mark_read` — **add** a best-effort publish of `{ type:"read", thread_id, reader_oid, last_read_seq }` to the thread's Web PubSub group, so the sender's "Seen" indicator advances live.

**Out of scope (VC-8):** the FE "Seen" indicator + new-messages divider (separate vault-origin **VC-8-FE** VEP); group-channel "Seen by N" (DM-first — the projection carries all members, but the v1 FE renders DM "Seen" only); WhatsApp 3-state ticks / a "delivered" state (needs per-device acks we do not track); message reactions/edit/delete (VC-11/12/13).

**Plan status:** the VC (native-chat) tier is a Walter-directed project already reconciled against the Plan's ownership-only posture at VC-1 (recorded there as a PROCEED gap with a Role-C future-trigger). VC-8 adds no new Plan surface; its only documentation delta is the API-Spec §2.10 response shape (Role-C, Pass 4 — §API-SPEC below).

## P2 — Architecture & boundary reconciliation

**Handler family.** Both handlers are the existing Family-B HTTP handlers, unchanged in shape: `pg` Pool on the chat app's libpq `PG*` env; EasyAuth `x-ms-client-principal` OID; `set_config` triad; participant-scoped predicate; `{data,meta}` / `{error}` envelope; anonymous `httpTrigger` (EasyAuth gates identity). VC-8 adds only (A) an extra read-only `LATERAL` projection in `list_threads`, and (B) a best-effort Web PubSub publish in `mark_read` — the SAME idiom already deployed in `theo_chat_send_message` (Primary Reference).

**RLS family — unchanged.** No policy is added or altered. `list_threads`' new `members_read` projection reads `theo_chat_thread_members` rows that the deployed `theo_chat_member_select` policy **already** exposes to a participant ("see your own row, OR any member row of a thread you belong to"). Participant-scoped RLS remains the cited extension of the ownership family ("Default family: ownership-based").

**Boundary.** VC-8 reads/writes **only** the existing `theo_chat_*` tables (in fact: `list_threads` change is read-only; `mark_read` writes only the caller's own read-state row exactly as today). Per Golden §3 ("It MUST NOT read or write" `reporting_*`), there is no `reporting_*` / `corporate-reporting` access, no Blob, no Graph, no Foundry. Deploy target is the dedicated `vaultgpt-func-chat`; the monolith and sidecar are READ-ONLY (mirrors "the monolith `theo_message` is unchanged"; the chat app is the deployed dedicated v4 app, cf. "Runs on the **v4 sidecar**").

**Validation before SQL.** Both handlers keep their deployed input validation (UUID `thread_id`; strict `^[0-9]+$` before `parseInt` for `seq`) and deterministic 400s before any SQL or publish.

## P2.5 / GR — Gap Register

Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| The VC (native-chat) tier's Plan/Schema documentation currency was already handled at VC-1 (PROCEED gap + Role-C future-trigger); the API-Spec §2.10 chat contract will change (add `members_read`; document the `read` event). | This is a documentation-currency delta on an already-authorized, already-deployed surface, not a missing decision. The read-state storage + RLS already exist (VC-1); VC-8 only projects/streams data already permitted. | **PROCEED** with mandatory future-trigger: a Role-C (Pass 4) amendment MUST update `spec/THEO_API_SPEC.md` §2.10 — `list_threads` response gains `members_read: [{ oid, last_read_seq }]`, and `mark_read` is documented to publish a transient `{type:"read", …}` group event. Sequenced after Pass 3 deploy + golden curls (documents deployed reality), as prior tiers. |

No other gaps. Not a `NO-GAPS` certification (this one PROCEED gap stands).

## P3 — External-system reconciliation

**No NEW external system.** Azure Web PubSub was introduced and justified as a DEVIATION at VC-1, is provisioned (`vaultgpt-webpubsub`, hub `vaultchat`), and is already used by the deployed `theo_chat_send_message` / `theo_chat_typing`. VC-8's `mark_read` publish reuses that **exact** deployed idiom verbatim — `new WebPubSubServiceClient(process.env.WebPubSubConnectionString, "vaultchat")` then `serviceClient.group(threadId).sendToAll({...})`, best-effort, gated on `process.env.WebPubSubConnectionString`. Per Golden §4 a "new-domain or new-external-system helper" would need justification; VC-8 introduces **no** new system or helper — it is a same-idiom reuse within the same app. Durability posture is unaffected: the `read` event is transient presence-class metadata (no message body, no seq assignment); the durable read state is the Postgres upsert, committed before the publish, and peers reconcile from `members_read` on their next `list_threads`.

## P4 — Contract reconciliation

**Envelope unchanged** (`{data,meta}` / `{error}`).

Response deltas:
- `theo_chat_list_threads` → `200 { threads: [{ …existing fields…, members_read: [{ oid, last_read_seq }] }] }`. `members_read` excludes the caller's own row; `[]` when the caller has no peers with a read-state row. All existing fields (`last_read_seq`, `unread_count`, `last_message`, …) are unchanged and byte-order-stable; the field is purely additive (FE clients that ignore unknown fields are unaffected).
- `theo_chat_mark_read` → `200 { read_state: { thread_id, member_oid, last_read_seq } }` — **unchanged** HTTP response. New **side effect only**: a transient group publish `{ type:"read", thread_id, reader_oid, last_read_seq }`.

Inputs unchanged: `mark_read { thread_id, seq }`; `list_threads` no params.

## P5 — Error-model reconciliation

Unchanged from the deployed handlers. `mark_read`: 401 (no identity) / 400 (bad `thread_id`/`seq`) / 404 (non-participant, `isKnown`) / 403 (`42501`) / 500. `list_threads`: 401 / 403 (`42501`) / 500. The added `mark_read` publish is wrapped in its own try/catch and **cannot** change the HTTP outcome (best-effort, logged on failure). The added `list_threads` `LATERAL` is a plain read within RLS — a failure would surface as the existing 500 path.

## P6 — Data-shape reconciliation

**No schema change.** `members_read` is derived at query time from the existing `theo_chat_thread_members(thread_id, member_oid, last_read_seq)` rows (VC-1 schema; anchor `theo_projects` conventions). `last_read_seq` is `bigint`; the projection normalizes it to a JS number in the handler (`Number(x.last_read_seq)`), matching the existing `last_read_seq`/`unread_count` normalization. See §NO-MIGRATION.

## P7 — Idempotency / concurrency

- `mark_read` upsert semantics are unchanged (`GREATEST(existing, incoming)` — monotonic, backward-safe). The publish carries the post-upsert `last_read_seq`, so a duplicate/stale mark republishes a value that never regresses a peer's "Seen".
- `list_threads` is a pure read; concurrent reads are consistent within each request's snapshot.
- The `read` event is transient and idempotent to apply on the client (set peer's `last_read_seq = max(current, event)`).

## P8 — Security / RLS reconciliation

**set_config triad — unchanged.** Both handlers open with the deployed triad (`set_config('app.current_user_id'|'request.jwt.claim.sub'|'request.jwt.claim.oid', <OID>, false)`).

**No RLS change; the peer read-state is already permitted.** The `members_read` projection reads `theo_chat_thread_members` rows under the **deployed** `theo_chat_member_select` policy, which already allows a participant to read any member row of a thread they belong to (`member_oid = auth.uid() OR thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids))`). VC-8 adds **no** SECURITY DEFINER helper and **no** new elevated-read class — only ordinary participant-scoped `auth.uid()` reads (the cited extension of "Default family: ownership-based").

**No leakage.** `members_read` returns only participant OIDs (the same identities the FE already resolves via the People roster) + their `last_read_seq` integers — no message bodies, tokens, or URLs. The `read` event carries only `thread_id` + `reader_oid` + `last_read_seq` (no body). Non-participants see nothing (RLS + the unchanged 404 gate on `mark_read`).

## §NO-MIGRATION — why VC-8 requires no DDL / no Walter migration

The VC-1 migration (`vc1_chat_migration.sql`, blob `67ff9b5f654e146c01590d9ce0f9286969e54103`, inlined-by-reference here) already:
1. Stores per-member read position — `CREATE TABLE ... theo_chat_thread_members (thread_id, member_oid, last_read_seq bigint ...)`; and
2. Grants a participant read access to peers' rows — `CREATE POLICY "theo_chat_member_select" ... USING (member_oid = auth.uid() OR thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))`.

VC-8 reads data that already exists under a policy that already permits it, and publishes a transient event with an already-deployed idiom. Therefore: **no `CREATE`/`ALTER`/`DROP`, no new column, no new index, no new policy — no migration.** The only Pass-3 action is deploying the two modified handlers to `vaultgpt-func-chat`. (Optional post-deploy read-only spot check in §CURL confirms `members_read` is populated; it is SELECT-only.)

## §SM — Primary Reference (deployed `theo_chat_send_message.index.js`, byte-verbatim)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the deployed **`theo_chat_send_message`** — the closest deployed analog and the exact source of the Web PubSub publish idiom VC-8 reuses in `mark_read`. Blob `483a0b4dfbeeff882b5d73055914f76e8024601a`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const threadId = typeof body.thread_id === "string" ? body.thread_id.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'thread_id' is required and must be a valid UUID.", 400));
  }
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'body' is required and must be non-empty.", 400));
  }
  if (text.length > MAX_BODY) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Message exceeds ${MAX_BODY} characters.`, 400));
  }

  let client = null;
  let saved = null;
  try {
    client = await pool.connect();

    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Membership gate: the caller must be a participant of the thread (RLS + explicit predicate). Not a
    // participant → 404 (no leakage of thread existence). The connection role enforces RLS; this is the gate.
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Insert with the next per-thread seq computed atomically in the INSERT…SELECT; the UNIQUE(thread_id,
    // seq) guards against a concurrent sender — retry a few times on a 23505 race, then bump the thread.
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages (thread_id, seq, sender_oid, body)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3 FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at
          `,
          [threadId, oid, text]
        );
        await client.query(`UPDATE public.theo_chat_threads SET updated_at = now() WHERE id = $1`, [threadId]);
        await client.query("COMMIT");
        saved = ins.rows[0];
      } catch (e) {
        try { await client.query("ROLLBACK"); } catch {}
        if (e && e.code === "23505") continue; // seq race — recompute and retry
        throw e;
      }
    }
    if (!saved) {
      throw buildKnownError("CONFLICT", "Could not assign a message sequence; please retry.", 409);
    }

    // Publish to the thread's Web PubSub group so every connected participant receives it instantly.
    // Best-effort: the message is already durably persisted; a publish failure must not fail the send
    // (recipients still get it on their next list/reconnect).
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_send_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_send_message failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    if (err && err.code === "23514") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Message violates a field constraint.", 400));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

### §SM-FJ — Primary Reference function.json (deployed `theo_chat_send_message.function.json`, byte-verbatim)

Blob `0284d265cd81bec4c34b5513d46c41b7ba6601ff`:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_send_message"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.1 — `theo_chat_mark_read` (MODIFY: add best-effort `read` publish)

**Delta:** add `const { WebPubSubServiceClient } = require("@azure/web-pubsub");` + `const HUB = "vaultchat";`; capture the upsert row in `readState`; after the upsert, publish `{ type:"read", thread_id, reader_oid, last_read_seq }` to `group(threadId)` best-effort (gated on `process.env.WebPubSubConnectionString`, wrapped in try/catch — cannot change the HTTP outcome). Everything else identical to the deployed CURRENT.

**CURRENT (deployed, blob `cd813b36b466f5a63a88e064861a52169f9d718e`):**

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const threadId = typeof body.thread_id === "string" ? body.thread_id.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'thread_id' is required and must be a valid UUID.", 400));
  }
  // seq to mark read up to (inclusive). Strict-regex before parseInt.
  const rawSeq = body.seq != null ? String(body.seq).trim() : "";
  if (!/^[0-9]+$/.test(rawSeq)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'seq' is required and must be a non-negative integer.", 400));
  }
  const seq = parseInt(rawSeq, 10);

  let client = null;
  try {
    client = await pool.connect();
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Membership gate — not a participant → 404.
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Upsert the caller's read state; never move last_read_seq backwards (GREATEST). The member INSERT/UPDATE
    // RLS policies restrict this to the caller's own row within a thread they belong to.
    const upd = await client.query(
      `
      INSERT INTO public.theo_chat_thread_members (thread_id, member_oid, last_read_seq)
      VALUES ($1, $2, $3)
      ON CONFLICT (thread_id, member_oid)
      DO UPDATE SET last_read_seq = GREATEST(public.theo_chat_thread_members.last_read_seq, EXCLUDED.last_read_seq)
      RETURNING thread_id, member_oid, last_read_seq
      `,
      [threadId, oid, seq]
    );

    return send(context, 200, successBody({ read_state: upd.rows[0] }));
  } catch (err) {
    context.log.error("theo_chat_mark_read failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

**MODIFIED (full replacement — file `theo_chat_mark_read.index.js` in this package):**

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}
function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === "string") return JSON.parse(req.body);
  if (typeof req.body === "object") return req.body;
  return {};
}
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let body;
  try { body = parseBody(req); } catch { return send(context, 400, errorBody("BAD_REQUEST", "Request body is not valid JSON.", 400)); }

  const threadId = typeof body.thread_id === "string" ? body.thread_id.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'thread_id' is required and must be a valid UUID.", 400));
  }
  // seq to mark read up to (inclusive). Strict-regex before parseInt.
  const rawSeq = body.seq != null ? String(body.seq).trim() : "";
  if (!/^[0-9]+$/.test(rawSeq)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'seq' is required and must be a non-negative integer.", 400));
  }
  const seq = parseInt(rawSeq, 10);

  let client = null;
  let readState = null;
  try {
    client = await pool.connect();
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Membership gate — not a participant → 404.
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Upsert the caller's read state; never move last_read_seq backwards (GREATEST). The member INSERT/UPDATE
    // RLS policies restrict this to the caller's own row within a thread they belong to.
    const upd = await client.query(
      `
      INSERT INTO public.theo_chat_thread_members (thread_id, member_oid, last_read_seq)
      VALUES ($1, $2, $3)
      ON CONFLICT (thread_id, member_oid)
      DO UPDATE SET last_read_seq = GREATEST(public.theo_chat_thread_members.last_read_seq, EXCLUDED.last_read_seq)
      RETURNING thread_id, member_oid, last_read_seq
      `,
      [threadId, oid, seq]
    );
    readState = upd.rows[0];

    // VC-8 Teams-style read receipts: publish a transient `read` event to the thread's Web PubSub group so
    // the OTHER participants' clients can move their "Seen" indicator live (the reader advanced last_read_seq).
    // Best-effort and post-commit — the durable read state is already persisted; a publish failure must not
    // fail the request (peers reconcile from list_threads.members_read on their next fetch/reconnect). The
    // event carries no message body — only the reader's OID + how far they've now read.
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "read",
          thread_id: readState.thread_id,
          reader_oid: readState.member_oid,
          last_read_seq: Number(readState.last_read_seq),
        });
      } catch (pubErr) {
        context.log.error("theo_chat_mark_read publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 200, successBody({ read_state: readState }));
  } catch (err) {
    context.log.error("theo_chat_mark_read failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }
    if (err && err.isKnown === true && typeof err.status === "number" && typeof err.code === "string") {
      return send(context, err.status, errorBody(err.code, err.message, err.status));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

**§FJ.1 — `theo_chat_mark_read.function.json` (UNCHANGED; in package for the deploy bundle):**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_mark_read"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.2 — `theo_chat_list_threads` (MODIFY: project peers' `members_read`)

**Delta:** add a read-only `LEFT JOIN LATERAL` that aggregates the OTHER members' `(member_oid, last_read_seq)` into a JSON array `members_read`, select `COALESCE(reads.members_read, '[]'::json)`, and project a normalized `members_read: [{ oid, last_read_seq:Number }]` on each thread. No other change.

**CURRENT (deployed, blob `97a3c3a6b15b13d8f007c478f08c0ffe3137a02a`):**

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // RLS returns only the caller's threads. For each: the caller's read state (last_read_seq), the last
    // message (for the list preview), and the unread count (messages after last_read_seq not sent by the
    // caller). All joins stay within RLS-visible rows.
    const rows = await client.query(
      `
      SELECT
        t.id, t.kind, t.name, t.member_oids, t.created_by, t.dm_key, t.created_at, t.updated_at,
        COALESCE(mem.last_read_seq, 0) AS last_read_seq,
        lm.seq        AS last_seq,
        lm.body       AS last_body,
        lm.sender_oid AS last_sender_oid,
        lm.created_at AS last_message_at,
        COALESCE(unread.cnt, 0) AS unread_count
      FROM public.theo_chat_threads t
      LEFT JOIN public.theo_chat_thread_members mem
        ON mem.thread_id = t.id AND mem.member_oid = $1
      LEFT JOIN LATERAL (
        SELECT m.seq, m.body, m.sender_oid, m.created_at
        FROM public.theo_chat_messages m
        WHERE m.thread_id = t.id
        ORDER BY m.seq DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::bigint AS cnt
        FROM public.theo_chat_messages m2
        WHERE m2.thread_id = t.id
          AND m2.seq > COALESCE(mem.last_read_seq, 0)
          AND m2.sender_oid <> $1
      ) unread ON true
      WHERE $1 = ANY (t.member_oids)
      ORDER BY t.updated_at DESC
      LIMIT 1000
      `,
      [oid]
    );

    const threads = rows.rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      name: r.name,
      member_oids: r.member_oids,
      created_by: r.created_by,
      dm_key: r.dm_key,
      created_at: r.created_at,
      updated_at: r.updated_at,
      last_read_seq: Number(r.last_read_seq),
      unread_count: Number(r.unread_count),
      last_message: r.last_seq == null ? null : {
        seq: Number(r.last_seq),
        body: r.last_body,
        sender_oid: r.last_sender_oid,
        created_at: r.last_message_at,
      },
    }));

    return send(context, 200, successBody({ threads }));
  } catch (err) {
    context.log.error("theo_chat_list_threads failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list conversations.", 403));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

**MODIFIED (full replacement — file `theo_chat_list_threads.index.js` in this package):**

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-ms-client-principal",
};

function send(context, status, body) {
  context.res = { status, headers: { ...corsHeaders, "Content-Type": "application/json" }, body };
}
function nowIso() { return new Date().toISOString(); }
function errorBody(code, message, status) { return { error: { code, message, status, timestamp: nowIso() } }; }
function successBody(data) { return { data, meta: { timestamp: nowIso(), version: "1.0" } }; }
function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;
  try { return JSON.parse(Buffer.from(raw, "base64").toString("utf8")); } catch { return null; }
}
function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;
  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) return match.val.trim();
  }
  return null;
}

module.exports = async function (context, req) {
  if (req.method === "OPTIONS") {
    return send(context, 204, "");
  }

  const principal = getPrincipal(req);
  const oid = getClaimValue(principal, [
    "http://schemas.microsoft.com/identity/claims/objectidentifier",
    "oid",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ]);
  if (!oid) {
    return send(context, 401, errorBody("UNAUTHORIZED", "Missing or invalid EasyAuth identity.", 401));
  }

  let client = null;
  try {
    client = await pool.connect();
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // RLS returns only the caller's threads. For each: the caller's read state (last_read_seq), the last
    // message (for the list preview), the unread count (messages after last_read_seq not sent by the
    // caller), and — VC-8 Teams-style read receipts — the OTHER participants' read positions (members_read).
    // All joins stay within RLS-visible rows (the theo_chat_member_select policy lets a participant read any
    // member row of a thread they belong to). members_read excludes the caller's own row.
    const rows = await client.query(
      `
      SELECT
        t.id, t.kind, t.name, t.member_oids, t.created_by, t.dm_key, t.created_at, t.updated_at,
        COALESCE(mem.last_read_seq, 0) AS last_read_seq,
        lm.seq        AS last_seq,
        lm.body       AS last_body,
        lm.sender_oid AS last_sender_oid,
        lm.created_at AS last_message_at,
        COALESCE(unread.cnt, 0) AS unread_count,
        COALESCE(reads.members_read, '[]'::json) AS members_read
      FROM public.theo_chat_threads t
      LEFT JOIN public.theo_chat_thread_members mem
        ON mem.thread_id = t.id AND mem.member_oid = $1
      LEFT JOIN LATERAL (
        SELECT m.seq, m.body, m.sender_oid, m.created_at
        FROM public.theo_chat_messages m
        WHERE m.thread_id = t.id
        ORDER BY m.seq DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::bigint AS cnt
        FROM public.theo_chat_messages m2
        WHERE m2.thread_id = t.id
          AND m2.seq > COALESCE(mem.last_read_seq, 0)
          AND m2.sender_oid <> $1
      ) unread ON true
      LEFT JOIN LATERAL (
        SELECT json_agg(
                 json_build_object('oid', om.member_oid, 'last_read_seq', om.last_read_seq)
                 ORDER BY om.member_oid
               ) AS members_read
        FROM public.theo_chat_thread_members om
        WHERE om.thread_id = t.id AND om.member_oid <> $1
      ) reads ON true
      WHERE $1 = ANY (t.member_oids)
      ORDER BY t.updated_at DESC
      LIMIT 1000
      `,
      [oid]
    );

    const threads = rows.rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      name: r.name,
      member_oids: r.member_oids,
      created_by: r.created_by,
      dm_key: r.dm_key,
      created_at: r.created_at,
      updated_at: r.updated_at,
      last_read_seq: Number(r.last_read_seq),
      unread_count: Number(r.unread_count),
      last_message: r.last_seq == null ? null : {
        seq: Number(r.last_seq),
        body: r.last_body,
        sender_oid: r.last_sender_oid,
        created_at: r.last_message_at,
      },
      // VC-8: other participants' read positions (Teams-style "Seen"). Empty array when alone / no peers.
      members_read: Array.isArray(r.members_read)
        ? r.members_read.map((x) => ({ oid: x.oid, last_read_seq: Number(x.last_read_seq) }))
        : [],
    }));

    return send(context, 200, successBody({ threads }));
  } catch (err) {
    context.log.error("theo_chat_list_threads failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have permission to list conversations.", 403));
    }
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    if (client) client.release();
  }
};
```

**§FJ.2 — `theo_chat_list_threads.function.json` (UNCHANGED; in package for the deploy bundle):**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_chat_list_threads"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §API-SPEC — Role-C (Pass 4) documentation delta

After Pass 3 deploy + golden curls, a Role-C amendment lands in `spec/THEO_API_SPEC.md` §2.10:
- `theo_chat_list_threads` response: add `members_read: [{ oid: string, last_read_seq: number }]` per thread (other participants' read positions; excludes the caller; `[]` when none).
- `theo_chat_mark_read`: document the transient side-effect — on success it publishes `{ type:"read", thread_id, reader_oid, last_read_seq }` to the thread's `vaultchat` group (best-effort; HTTP body unchanged).

No Schema or Plan delta (no DDL; the VC tier is already recorded).

## §DEPLOY — Pass 3 (Walter-authorized; `vaultgpt-func-chat` only)

Deploy the two modified handlers to the **existing** `vaultgpt-func-chat` app (never the monolith/sidecar). `config-zip` replaces the whole wwwroot, so the deploy bundle is the full current chat app with these two `index.js` files swapped in (function.jsons unchanged). No app-setting change (`WebPubSubConnectionString` already present; that's what `send_message`/`typing` use). No migration. Restart + confirm the function list, then run §CURL.

## §CURL — post-deploy verification (Claude Code, read-only + a benign mark)

1. `GET /api/theo_chat_list_threads` (as a user in a DM) → confirm each thread now carries `members_read` (array; the peer's `last_read_seq`).
2. `POST /api/theo_chat_mark_read { thread_id, seq }` as user B → 200 `{ read_state }` unchanged; a connected user A receives a `{ type:"read", … }` group frame (observed via the FE console during VC-8-FE testing).
3. Read-only spot check (SELECT-only) that B's `last_read_seq` advanced. No writes beyond the ordinary mark.

## §SM-NOTE — structural mirror

Both handlers keep the Primary Reference's boilerplate (envelope, principal/claim parsing, set_config triad, error map) verbatim. `mark_read`'s publish is the byte-identical idiom from the Primary Reference (`new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB)` → `serviceClient.group(threadId).sendToAll({...})`, best-effort, gated). `list_threads`' addition is a read-only `LATERAL` in the same style as its existing `lm`/`unread` laterals. No new dependency (`@azure/web-pubsub` already in the chat app for `send_message`/`typing`).

## Requested Pass 2 verdict
APPROVED / REJECTED (Codex). On APPROVED: Walter deploys the two handlers to `vaultgpt-func-chat` (Pass 3); Claude Code runs §CURL; Role-C lands the §API-SPEC delta (Pass 4); the FE "Seen" indicator + new-messages divider follow as the vault-origin **VC-8-FE** VEP.

*End of Pass 1 Backend VEP (plan-only).*
