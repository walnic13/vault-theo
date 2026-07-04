# Theo 1B — VC-2d Chat Typing Indicator (backend: `theo_chat_typing` — ephemeral, server-relayed typing signal) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2, APPROVED / REJECTED only). Claude Code deploys the handler at Pass 3 to the **dedicated `vaultgpt-func-chat`** app under the Orchestration Standard §1E / DR-T7 scoped deployment exception (never the monolith/sidecar); golden curls after. Plan-only pack.
>
> **Scope (VC-2d backend):** ONE new HTTP handler `theo_chat_typing` on `vaultgpt-func-chat` — a participant-gated, **ephemeral** typing signal: it validates the caller is a member of the thread, then best-effort publishes `{ type:'typing', thread_id, sender_oid }` to the thread's Azure Web PubSub group (`vaultchat`). **No persistence** — no `theo_chat_messages` row, no seq, no DB write, no migration. Enables the WhatsApp-style "…typing" indicator (the FE debounces the ping and renders the bubble — a separate vault-origin FE increment). Client tokens remain **receive-only** (server-authoritative publish), so typing must be server-relayed rather than client-broadcast.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `3e38d08` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for the VC-2d typing signal; P1–P8 walked; Primary Reference (`theo_chat_send_message` pair) inlined byte-verbatim; 1 greenfield handler + function.json inlined byte-verbatim. Ephemeral — NO migration, NO schema change, NO `theo_chat_messages` write. Web PubSub is the already-deployed VC-1 chat transport (not a new external system). Deploy by Claude Code under Orchestration §1E/DR-T7 to `vaultgpt-func-chat`. No `reporting_*` / monolith / sidecar change.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register; §1E/§6 authorization boundary + deploy exception) | `git grep -F "VEP Format"` + `git grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A.1 P-track) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary/no-leakage) | `git grep -F "selects **exactly one** deployed handler file"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E/DR-T7 scoped deploy exception) | `git grep -F "Pass 1 (Claude Code VEP)"` + `git grep -F "Scoped Deployment Authority Exception"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (native chat not yet in plan → Gap Register) | `git grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `git grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 In-Vault chat; typing to be added by Role-C) | `git grep -F "theo_chat_send_message"` this turn | `f2475efe720dbba0ebb58e2fd0018095c9a6c931` |
| 9 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§8 `theo_chat_*`; no change — typing is ephemeral) | `git grep -F "theo_chat_threads"` this turn | `62b898b881ad64023f99ae10414093681aaa84c8` |
| 10 | **Primary Reference handler** (deployed participant-gated Web PubSub publisher) — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.index.js` | `Read(full)` this turn | `483a0b4dfbeeff882b5d73055914f76e8024601a` |
| 11 | **Primary Reference function.json** (deployed) — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.function.json` | `Read(full)` this turn | `0284d265cd81bec4c34b5513d46c41b7ba6601ff` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + sidecar `vaultgpt-func-stream` READ-ONLY. No `theo_chat_messages` / `theo_conversations` / `theo_messages` write. Deploy by Claude Code under §1E/DR-T7 to `vaultgpt-func-chat`.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3, §5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §SM + §HG + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR — Gap Register |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "Scoped Deployment Authority Exception" | §DEPLOY — Claude Code deploys to `vaultgpt-func-chat` under §1E/DR-T7 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_send_message` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — reads only `theo_chat_threads` (membership); no `reporting_*`; no write |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped gate is the cited chat extension (self-contained) |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P2.5 — native chat / typing not yet in the Plan → PROCEED w/ future-trigger |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.1 — typing reuses the Primary Reference set_config triad + membership gate |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.function.json | binding | "httpTrigger" | §SM-FJ + §FJ.1 — anonymous httpTrigger binding (EasyAuth gates identity) |

## P1 — Feature identification
**Microstep:** VC-2d backend — `theo_chat_typing`, an ephemeral typing signal for the native chat. `POST /api/theo_chat_typing { thread_id }` → validates the caller is a participant → best-effort publishes `{ type:'typing', thread_id, sender_oid }` to the thread's Web PubSub group → `200 { typing:true }`. No persistence.
**Consumers:** the vault-origin chat FE (a separate VC-2d FE increment) debounces the ping while composing and renders the "…typing" bubble in the conversation, auto-clearing on timeout / next message.
**Out of scope:** presence (online/away — that's the People roster's Graph presence), read receipts, message persistence, any schema change.

## P2 — Architecture & boundary reconciliation
Family-B HTTP handler mirroring the deployed `theo_chat_send_message` **minus persistence**: `pg` Pool on the libpq `PG*` env; `getPrincipal`/`getClaimValue` OID from EasyAuth; validate-before-SQL (`isUuid`); connect → `set_config` triad → **participant gate** (`SELECT 1 FROM theo_chat_threads WHERE id=$1 AND $2 = ANY(member_oids)`; 0 rows → 404) → best-effort `serviceClient.group(threadId).sendToAll({type:'typing',…})`. **Boundary:** reads only `theo_chat_threads` (membership); per Golden §3 "It MUST NOT read or write" `reporting_*` — none touched; no Blob, no Graph, no gateway; **no write to any table** (ephemeral); no `theo_chat_messages`/`theo_conversations` touch. Deploy target = `vaultgpt-func-chat` (Claude Code under §1E/DR-T7); monolith + sidecar untouched.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| `theo_chat_typing` is not represented in the Theo API Spec (§2.10) or the Phase 1B Backend Plan. | Native chat is the Walter-directed VC programme (VC-1 deployed; typing = VC-2d, Walter-directed this turn). The Plan's posture is ownership-only; chat/typing are the sanctioned extension. Documentation-currency gap, not a missing decision. | **PROCEED** with a mandatory Role-C (Pass 4) future-trigger: add `theo_chat_typing` to `spec/THEO_API_SPEC.md` §2.10 (ephemeral; **no** Schema change — no table/row), sequenced after Pass-3 deploy + golden curls, as VC-1's routes were. |

## P3 — External-system reconciliation
Azure Web PubSub is the **already-deployed VC-1 chat transport** (hub `vaultchat`, resource `vaultgpt-webpubsub`) — not a new external system. `theo_chat_typing` uses the same `@azure/web-pubsub` server SDK + `WebPubSubConnectionString` already present on `vaultgpt-func-chat` to `serviceClient.group(threadId).sendToAll(...)`, exactly as `theo_chat_send_message` does. The published payload is a transient `{type:'typing',…}` (not persisted). Client tokens remain **receive-only** (VC-1 R1) — typing is server-relayed, never client-broadcast. No new resource, no new dependency.

## P4 — Contract reconciliation
`POST /api/theo_chat_typing` `{ thread_id }` → **200** `{ data: { typing: true }, meta }`. Envelope identical to the Primary Reference (`{data,meta}` / `{error}`). Inbound realtime event (to other group members): `{ type:'typing', thread_id, sender_oid }`. No response body beyond the ack.

## P5 — Error-model reconciliation
Missing/invalid EasyAuth → **401** `UNAUTHORIZED`; invalid JSON → **400** `BAD_REQUEST`; missing/invalid `thread_id` → **400** `INVALID_REQUEST`; caller not a participant → **404** `NOT_FOUND` (isKnown; no existence leak, no typing to a non-member thread); Postgres `42501` (RLS) → **403** `FORBIDDEN`; else **500**. No `23xxx` mapping — there is no write. A Web PubSub publish failure is **non-fatal** (logged; typing is transient) and does not change the 200.

## P6 — Data-shape reconciliation
**None.** `theo_chat_typing` performs no write and defines no new table/column. It reads one boolean-existence row from the deployed `theo_chat_threads` (membership gate) and publishes a transient signal. No `theo_chat_*` schema change (Schema §8 unchanged).

## P7 — Idempotency / concurrency
Naturally idempotent and stateless: a typing signal is transient; repeated calls simply re-broadcast (the FE debounces to ~1 ping / few seconds). No sequence, no row, no ordering concern. Concurrent calls are independent group publishes.

## P8 — Security / RLS reconciliation
`set_config` triad sets the connection identity so RLS on `theo_chat_threads` evaluates as the signed-in user. **Participant gate:** `auth.uid() = ANY(member_oids)` (RLS SELECT policy + explicit predicate); a non-participant reads 0 rows → **404** and **no publish** — a user cannot emit typing into a thread they don't belong to. **No new SECURITY DEFINER / elevated-read class** — only the ordinary participant primitive (the cited chat extension of "Default family: ownership-based"). **Receive-only client tokens preserved** (VC-1 R1): clients cannot `sendToGroup`, so typing MUST be server-relayed — this handler is that relay, keeping the durability/no-eavesdrop posture. No token/OID/transcript leakage (the payload carries only the thread id + the sender's OID, which participants already share via the roster).

## §MIGRATION — None
VC-2d is **ephemeral**: no schema change, no new table/column, no migration, no `theo_chat_messages` write. `theo_chat_threads` is read-only here (membership existence check). Schema §8 (`theo_chat_*`) is unchanged; the read-only verification for those tables was landed at VC-1.

## §SM — Primary Reference (deployed `theo_chat_send_message.index.js`, byte-verbatim)
Per Golden §2 ("selects **exactly one** deployed handler file"), the canonical Primary Reference is the deployed **`theo_chat_send_message`** handler (VC-1) — the closest deployed analog: a participant-gated handler that publishes to the thread's Web PubSub group. `theo_chat_typing` is that pattern minus the persist/seq step. Inlined full-verbatim (blob `483a0b4dfbeeff882b5d73055914f76e8024601a`):

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

## §SM-FJ — Primary Reference function.json (deployed `theo_chat_send_message.function.json`, byte-verbatim)
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

## §HG — Handler (1 GREENFIELD full replacement)

### §HG.1 — `theo_chat_typing` (GREENFIELD)
Participant-gated ephemeral typing relay — reuses the Primary Reference boilerplate verbatim (envelope, `getPrincipal`/`getClaimValue`, `parseBody`, `buildKnownError`, `isUuid`, set_config triad, error map, best-effort publish) and removes the persistence (no seq compute, no INSERT, no thread bump); returns `{ typing:true }`.

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

    // Membership gate: only a participant may broadcast a typing signal to the thread's group.
    // Not a participant → 404 (no existence leak, and no typing signal to a thread you're not in).
    // Read-only (no write); the connection role enforces RLS and this predicate is the gate.
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Ephemeral typing signal — NO persistence (no theo_chat_messages row, no seq). Best-effort
    // publish to the thread's Web PubSub group; a publish failure is non-fatal (typing is transient).
    // Clients ignore their own echo (sender_oid === self) and auto-clear the indicator after a short
    // timeout / on the next real message. Server-authoritative: the client token is receive-only.
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "typing",
          thread_id: threadId,
          sender_oid: oid,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_typing publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 200, successBody({ typing: true }));
  } catch (err) {
    context.log.error("theo_chat_typing failed", err);
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

**§FJ.1 — `theo_chat_typing.function.json`**

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_typing"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §PARITY — Structural mirror parity
- **Boilerplate reuse (EXACT):** `send`/`nowIso`/`errorBody`/`successBody`/`getPrincipal`/`getClaimValue`/`parseBody`/`buildKnownError`/`isUuid` + the `pg` Pool + the set_config triad + the membership gate (`SELECT 1 … WHERE id=$1 AND $2 = ANY(member_oids)` → 404) + the `42501→403` / `isKnown` / `else 500` error map + the best-effort `WebPubSubServiceClient(...).group(threadId).sendToAll(...)` publish are reused verbatim from `theo_chat_send_message`.
- **Auth idiom (EXACT):** `x-ms-client-principal` OID + anonymous `httpTrigger` binding with explicit `route` ("httpTrigger").
- **ALLOWED DELTA (no persistence):** removes the `INSERT … COALESCE(MAX(seq)…) … RETURNING` + the `UPDATE theo_chat_threads SET updated_at` + the 23505 retry loop; the published payload `type` is `"typing"` (vs `"message"`) and there is no `message` object; the ack is `{ typing:true }` (vs `{ message }`). No new external system, no new dependency.
- **No DEVIATION.**

## §DEPLOY (Claude Code, Pass 3, under Orchestration §1E / DR-T7)
Target = **`vaultgpt-func-chat`** (NEVER the monolith/sidecar). DB writes/migrations remain Walter-only — VC-2d has none.
1. Confirm `@azure/web-pubsub` + `pg` are already in the chat app's deployed `node_modules` (present since VC-1); no dependency change.
2. Deploy the 1 function `theo_chat_typing` (`theo_chat_typing/index.js` + `theo_chat_typing/function.json`) via `az functionapp deployment source config-zip` (additive to the existing 7 chat functions), or Kudu.
3. Restart; confirm `theo_chat_typing` is listed + healthy alongside the other `theo_chat_*` functions.
4. No migration, no verify SQL (ephemeral; no schema change).

## §CURL (Claude Code golden verification, post-deploy)
Bearer via `az account get-access-token` for the chat app audience (`api://4e1a1e31-…`); tokens never printed.
1. **Typing (200):** `POST /api/theo_chat_typing { thread_id: <a thread the caller belongs to> }` → **200** `{ data: { typing:true } }`.
2. **Not-a-participant (404):** same POST with a thread the caller is not a member of (or a random uuid) → **404** `NOT_FOUND`.
3. **Validation (400):** `{}` (missing) and `{ thread_id:"not-a-uuid" }` → **400** each.
4. (Realtime receipt of the `{type:'typing'}` event is verified in the VC-2d FE two-window test — a WS subscriber is required to observe the broadcast.)

*End of Pass 1 Backend VEP.*
