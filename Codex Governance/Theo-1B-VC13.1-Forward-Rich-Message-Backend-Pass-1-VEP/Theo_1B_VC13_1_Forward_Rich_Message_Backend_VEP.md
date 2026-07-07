# Theo 1B — VC-13.1 Forward carries attachment + gif (fix: `theo_chat_forward_message` copied only `body`) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). On APPROVED, Claude Code deploys the single overwrite to `vaultgpt-func-chat` (§1E / DR-T7) + golden curls; Role-C (Pass 4) lands the API-Spec §2.10 note. **No migration** (the `attachment_*` / `gif_*` columns shipped in VC-9 / VC-10). Plan-only.
>
> **Scope (VC-13.1 = correctness fix):** the DEPLOYED `theo_chat_forward_message` copies only `body` into the forwarded copy. So (a) forwarding an **attachment-only** (VC-9) or **gif-only** (VC-10) message — where `body` is NULL — produces a row with no body/attachment/gif → **violates `theo_chat_messages_body_ck`** (23514 → 400/500); and (b) forwarding a captioned attachment/gif silently **drops the attachment/gif**. VC-13.1 makes the forward **carry the source's `attachment_*` + `gif_*`** into the copy and **project** them (`attachment` / `gif`, VC-9/VC-10 parity). **One MODIFY handler; no migration; no schema/RLS change.**
>
> **Discovery:** flagged in the VC-10 backend VEP §P2.5 as an adjacent gap (VC-13 predates VC-9/VC-10). A plain-text forward is unaffected (works today). No behaviour change except that a forwarded attachment/gif now round-trips.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `e452a71299b36ebf355bedec2b0e118c4dc7c0f5` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-13.1 — `theo_chat_forward_message` MODIFY so a forwarded copy carries the source's `attachment_*` + `gif_*` (fixing the body-CHECK violation for an attachment-only/gif-only source and the silent drop for a captioned one). NO migration (the columns are DEPLOYED — VC-9 attachment_*, VC-10 gif_*); NO schema/RLS change. Primary Reference = the DEPLOYED VC-19 `theo_chat_forward_message` (blob `251853a0`, carrying the archived write-gate) inlined byte-verbatim + its function.json; the MODIFY adds the source read of the rich columns, copies them in the seq-INSERT, and projects `attachment`/`gif` (raw blob_path never exposed — VC-9 parity). Archived gate + deleted-source 400 + membership + seq-retry + error map all preserved. No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` / `theo_attachments` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `grep -F "VEP Format"` + `grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A P-track) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 external-system) | `grep -F "selects **exactly one** deployed handler file"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception) | `grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (VC tier; ownership posture) | `grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` — attachment_* (VC-9) + gif_* (VC-10) + body/coherence CHECKs) | `grep -F "Message within a chat thread"` this turn | `f916ba72cd668f311e1df92b0929d49708dd8f4b` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` — forward route; the "carries attachment/gif" note lands at Pass 4) | `grep -F "read / send messages"` this turn | `77819fb0f179981a3d798cd07bb9918790621733` |
| 10 | **Primary Reference handler** (DEPLOYED forward — VC-19 archived-gate state) — `Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/theo_chat_forward_message.index.js` | `Read(full)` this turn; deployed get-back byte-matches | `251853a0db64b43915e0911d19d03866118295f0` |
| 11 | **Primary Reference function.json** (DEPLOYED) — `Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/theo_chat_forward_message.function.json` | `Read(full)` this turn | `a116dcd04f0af867212fe409c62317a97a8d9f0a` |
| 12 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_message_insert` WITH CHECK — column-agnostic; unchanged) | `Read(full)`/`sed` this turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith + streaming sidecar READ-ONLY — deploy targets `vaultgpt-func-chat`.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §SM + §HG.1 + §API-SPEC + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 — recorded VC tier |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_forward_message` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — touches only `theo_chat_*`; no `reporting_*` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no new external system (Blob/GIPHY unchanged; the copy references an existing blob) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped forward; no RLS change |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Message within a chat thread" | §P6 — the copy carries the existing attachment_*/gif_* columns; CHECKs satisfied |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | §API-SPEC — the "forward carries attachment/gif" note |
| Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/theo_chat_forward_message.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.1 — the fix keeps the deployed set_config triad + gates |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | insert policy | "theo_chat_message_insert" | §P8 — the column-agnostic INSERT WITH CHECK is unchanged |

## P1 — Feature identification
**Microstep:** VC-13.1 — fix `theo_chat_forward_message` so a forwarded copy carries the source message's attachment (VC-9) and gif (VC-10), not just `body`.

**No migration.** **Modified (1), on `vaultgpt-func-chat`:** `theo_chat_forward_message` reads the source's `attachment_*` + `gif_*`, copies them into the seq-INSERT, and projects `attachment` / `gif` on the returned/published message.

**Out of scope (VC-13.1):** the FE (VC-13-FE already renders `forwarded` + the bubble already renders `attachment`/`gif` from `list_messages`, so no FE change is required for a forwarded rich message to display); changing forward semantics (still copy-by-value into the target; still `forwarded:true`); blob re-scoping (the copy references the ORIGINAL sender's blob — download stays message-membership-gated); any other handler.

**Plan status:** correctness fix on the recorded VC tier; discovered + disclosed in the VC-10 VEP §P2.5. Doc delta = API-Spec §2.10 note (Role-C, Pass 4). No schema delta (columns already documented in §3).

## P2 — Architecture & boundary reconciliation
**Handler family.** `theo_chat_forward_message` stays a Family-B HTTP handler byte-identical to its DEPLOYED self except: the source `SELECT` now also reads `attachment_*` + `gif_*`; the seq-`INSERT`'s column list + `SELECT` projection + `RETURNING` carry those columns (params `$5..$15`); and the response/publish shaping adds `attachment` (via `attachmentPreview`) + `gif` (via `gifPreview`) then deletes the raw columns. `set_config` triad, membership gate, the **archived (VC-19) gate**, the deleted-source 400, the atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` with `23505` retry, best-effort publish, and the error map are all preserved.
**Boundary.** Reads/writes only `theo_chat_*`. Per Golden §3 no `reporting_*`/monolith. Deploy target `vaultgpt-func-chat`. The attachment copy references the SAME blob (no new Blob write; no GIPHY call — the gif is a stored reference). No new external system (Golden §4).
**Validation before SQL.** Unchanged — UUID `message_id` / `to_thread_id` → 400 before any SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 will change (forward now carries attachment/gif). | Documentation-currency delta. | **PROCEED** with a Role-C (Pass 4): `spec/THEO_API_SPEC.md` §2.10 `read / send messages`. No Schema delta (columns already in §3). |
| The forwarded attachment references the ORIGINAL sender's owner-scoped blob (`attachments/<original-oid>/…`), not the forwarder's. | Deliberate — a forward is a copy-by-reference of content the forwarder can already see; `theo_chat_attachment_download` gates on the caller being a participant of the (forwarded) message's thread (RLS), NOT on blob ownership, so target participants can download it. The blob is shared by both messages; blob GC is the deferred tier (VC-9). | **PROCEED** — download is message-membership-gated (§P8). |
| A gif forward copies the stored GIPHY URLs (no fresh GIPHY call). | The gif is an external reference already resolved at send; copying the columns is sufficient + avoids a needless GIPHY call. | **PROCEED**. |
| Coherence CHECKs (`theo_chat_messages_gif_ck` / `_attachment_ck` / `_attach_gif_excl_ck`). | The copied columns are a verbatim copy of a VALID source row (which already satisfies the CHECKs + the mutual-exclusion), so the forwarded row satisfies them too. | **PROCEED**. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No new external system.** The forward copies existing columns (`attachment_*` blob pointer; `gif_*` GIPHY URLs) — no new Blob write, no GIPHY call. Per Golden §4 no new-domain/new-external-system helper is introduced. Best-effort Web PubSub publish reused unchanged.

## P4 — Contract reconciliation
Envelope unchanged. `theo_chat_forward_message` `{ message_id, to_thread_id }` → **201** `{ message }`; the `message` projection now also carries `attachment` (`{ filename, content_type, byte_size } | null`) + `gif` (`{ provider, id, url, preview_url, width, height, title } | null`) — matching `list_messages`/`send_message`/`send_gif`. The raw blob_path is never exposed. All existing failures (400 bad uuid / 400 deleted source / 404 not-visible / 404 non-participant target / 409 archived / 409 seq / 403 42501 / else 500) preserved.

## P5 — Error-model reconciliation
Unchanged. The `23514` field-constraint → 400 arm is preserved (and is now not reachable for the previously-broken attachment-only/gif-only forward, since the copy carries a valid shape). No new error code.

## P6 — Data-shape reconciliation
No schema change. The forward INSERT now writes the `attachment_*` + `gif_*` columns (copied from the source) in addition to `body` + `forwarded_from_message_id`. Because the copied values are a verbatim copy of a valid, non-deleted source row, the `theo_chat_messages_body_ck` (body OR attachment OR gif), `theo_chat_messages_attachment_ck`, `theo_chat_messages_gif_ck`, and `theo_chat_messages_attach_gif_excl_ck` constraints are all satisfied. The API exposes `attachment` (no raw blob_path) + `gif`.

## P7 — Idempotency / concurrency
Forward remains non-idempotent (a new copy per call). The seq INSERT keeps the atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` + `23505` retry; the added columns are constants bound to params (no new subquery, no new race). The source read is a single pre-INSERT read.

## P8 — Security / RLS reconciliation
**No RLS change.** The forward INSERT still rides the deployed column-agnostic `theo_chat_message_insert` WITH CHECK (sender = caller, member of target); adding the `attachment_*`/`gif_*` columns doesn't change what it evaluates. The source read rides `theo_chat_message_select` (participant-scoped) — a caller can only forward a message they can see. Participant-scoped forward is an ownership-family extension.
**Attachment download stays gated.** `theo_chat_attachment_download` resolves the (forwarded) message under RLS and issues a per-request read SAS — so a target participant can download the forwarded file, and a non-participant cannot; the forwarded copy referencing the original sender's blob path does not widen access (access is by message visibility, not blob ownership). The raw blob_path is never projected (VC-9 parity).
**No leakage.** The projection carries `attachment` (filename/content_type/byte_size) + `gif` (public GIPHY URLs) + `forwarded:true` — no origin id, no blob_path, no tokens.

## §SM — Primary Reference (DEPLOYED `theo_chat_forward_message.index.js`, byte-verbatim — VC-19 archived-gate state)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the DEPLOYED **`theo_chat_forward_message`** (VC-19 state, blob `251853a0` — carries the archived write-gate). VC-13.1's fix slots into its source-read + seq-INSERT + shaping; everything else is preserved:

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

  const messageId = typeof body.message_id === "string" ? body.message_id.trim() : "";
  if (!isUuid(messageId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'message_id' is required and must be a valid UUID.", 400));
  }
  const toThreadId = typeof body.to_thread_id === "string" ? body.to_thread_id.trim() : "";
  if (!isUuid(toThreadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'to_thread_id' is required and must be a valid UUID.", 400));
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

    // Read the SOURCE message under RLS — theo_chat_message_select only returns it if the caller is a
    // participant of its thread, so a caller can only forward a message they can already see. Absent /
    // not visible → 404 (no existence leak). The body is copied server-side (not client-supplied).
    // VC-19: the SOURCE thread being archived does NOT block forwarding OUT of it — reading is unaffected;
    // only landing a NEW copy in an archived TARGET is gated below.
    const srcRes = await client.query(
      `SELECT body, deleted_at FROM public.theo_chat_messages WHERE id = $1`,
      [messageId]
    );
    if (srcRes.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Message not found.", 404);
    }
    const src = srcRes.rows[0];
    if (src.deleted_at != null) {
      throw buildKnownError("INVALID_REQUEST", "Cannot forward a deleted message.", 400);
    }
    const srcBody = src.body;

    // Target membership: the caller must belong to the destination thread. Not a participant → 404.
    // (The theo_chat_message_insert WITH CHECK independently enforces this on the INSERT below.)
    // VC-19: read the TARGET's archived_at in the same gate — a forward is a NEW message, so an archived
    // target is closed to it (mirrors the theo_chat_send_message write-gate).
    const acc = await client.query(
      `SELECT archived_at FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [toThreadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    // VC-19: reject forwarding INTO an archived thread with a deterministic 409. A DM never has archived_at
    // set (only a channel is archivable), so this only ever fires for an archived channel. Cooperative UX
    // write-gate, not a security boundary (see the VEP §P8 TOCTOU note).
    if (acc.rows[0].archived_at != null) {
      throw buildKnownError("CONVERSATION_ARCHIVED", "This conversation is archived; you can no longer post to it.", 409);
    }

    // Insert the copy into the target thread with the next per-thread seq computed atomically; the
    // UNIQUE(thread_id, seq) guards a concurrent sender — retry on a 23505 race, then bump the thread.
    // forwarded_from_message_id records provenance (the API exposes only the derived `forwarded` bool).
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages (thread_id, seq, sender_oid, body, forwarded_from_message_id)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4 FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id
          `,
          [toThreadId, oid, srcBody, messageId]
        );
        await client.query(`UPDATE public.theo_chat_threads SET updated_at = now() WHERE id = $1`, [toThreadId]);
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

    // Shape to match the list_messages / send_message message projection exactly: a forward is never a
    // reply and never (freshly) deleted; `forwarded` is the ONLY provenance exposed (never the raw origin id).
    saved.reply_to = null;
    saved.deleted = false;
    saved.deleted_at = null;
    saved.forwarded = true;

    // Publish to the TARGET thread's group so its participants receive the forwarded message instantly.
    // Best-effort: already durably persisted; a publish failure must not fail the forward.
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(toThreadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_forward_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_forward_message failed", err);
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

### §SM-FJ — Primary Reference function.json (DEPLOYED, byte-verbatim — UNCHANGED by VC-13.1)

Blob `a116dcd04f0af867212fe409c62317a97a8d9f0a`:

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_forward_message" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.1 — `theo_chat_forward_message` (MODIFY: carry + project attachment + gif)

Delta vs DEPLOYED (blob `251853a0`): (1) `attachmentPreview` + `gifPreview` helpers added; (2) the source `SELECT` reads `attachment_*` + `gif_*`; (3) the seq-`INSERT` column list + `SELECT` + `RETURNING` carry them (params `$5..$15`, copied from the source row); (4) the shaping projects `saved.attachment` + `saved.gif` then deletes the raw columns. The archived gate, membership, deleted-source 400, seq-retry, publish, and error map are byte-identical. Full — file `theo_chat_forward_message.index.js`:

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
// VC-13.1: project the attachment preview (filename/content_type/byte_size) or null — the raw blob_path is
// NEVER exposed (a read SAS is issued per-request by theo_chat_attachment_download; VC-9 parity).
function attachmentPreview(row) {
  if (!row || row.attachment_blob_path == null) return null;
  return {
    filename: row.attachment_filename,
    content_type: row.attachment_content_type,
    byte_size: row.attachment_byte_size == null ? null : Number(row.attachment_byte_size),
  };
}
// VC-13.1: project the gif (external GIPHY reference) or null (VC-10 parity).
function gifPreview(row) {
  if (!row || row.gif_id == null) return null;
  return {
    provider: row.gif_provider,
    id: row.gif_id,
    url: row.gif_url,
    preview_url: row.gif_preview_url,
    width: row.gif_width == null ? null : Number(row.gif_width),
    height: row.gif_height == null ? null : Number(row.gif_height),
    title: row.gif_title,
  };
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

  const messageId = typeof body.message_id === "string" ? body.message_id.trim() : "";
  if (!isUuid(messageId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'message_id' is required and must be a valid UUID.", 400));
  }
  const toThreadId = typeof body.to_thread_id === "string" ? body.to_thread_id.trim() : "";
  if (!isUuid(toThreadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'to_thread_id' is required and must be a valid UUID.", 400));
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

    // Read the SOURCE message under RLS — theo_chat_message_select only returns it if the caller is a
    // participant of its thread, so a caller can only forward a message they can already see. Absent /
    // not visible → 404 (no existence leak). The body is copied server-side (not client-supplied).
    // VC-19: the SOURCE thread being archived does NOT block forwarding OUT of it — reading is unaffected;
    // only landing a NEW copy in an archived TARGET is gated below.
    // VC-13.1: also read the source's attachment_* + gif_* so a forwarded attachment/gif message carries
    // its content (copying only `body` would drop it — and an attachment-only/gif-only source has body NULL,
    // which would violate theo_chat_messages_body_ck on the INSERT). The attachment copy references the SAME
    // blob (owner-scoped to the ORIGINAL sender); download stays message-membership-gated, not owner-gated.
    const srcRes = await client.query(
      `SELECT body, deleted_at,
              attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size,
              gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title
       FROM public.theo_chat_messages WHERE id = $1`,
      [messageId]
    );
    if (srcRes.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Message not found.", 404);
    }
    const src = srcRes.rows[0];
    if (src.deleted_at != null) {
      throw buildKnownError("INVALID_REQUEST", "Cannot forward a deleted message.", 400);
    }

    // Target membership: the caller must belong to the destination thread. Not a participant → 404.
    // (The theo_chat_message_insert WITH CHECK independently enforces this on the INSERT below.)
    // VC-19: read the TARGET's archived_at in the same gate — a forward is a NEW message, so an archived
    // target is closed to it (mirrors the theo_chat_send_message write-gate).
    const acc = await client.query(
      `SELECT archived_at FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [toThreadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    // VC-19: reject forwarding INTO an archived thread with a deterministic 409. A DM never has archived_at
    // set (only a channel is archivable), so this only ever fires for an archived channel. Cooperative UX
    // write-gate, not a security boundary (see the VEP §P8 TOCTOU note).
    if (acc.rows[0].archived_at != null) {
      throw buildKnownError("CONVERSATION_ARCHIVED", "This conversation is archived; you can no longer post to it.", 409);
    }

    // Insert the copy into the target thread with the next per-thread seq computed atomically; the
    // UNIQUE(thread_id, seq) guards a concurrent sender — retry on a 23505 race, then bump the thread.
    // forwarded_from_message_id records provenance (the API exposes only the derived `forwarded` bool).
    // VC-13.1: carry the source's body + attachment_* + gif_* so the forwarded copy preserves the content
    // (the coherence/body CHECKs are satisfied because the copied columns are a valid source row's shape).
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages
            (thread_id, seq, sender_oid, body, forwarded_from_message_id,
             attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size,
             gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
          FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id,
                    attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size,
                    gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title
          `,
          [
            toThreadId, oid, src.body, messageId,
            src.attachment_blob_path, src.attachment_filename, src.attachment_content_type, src.attachment_byte_size,
            src.gif_provider, src.gif_id, src.gif_url, src.gif_preview_url, src.gif_width, src.gif_height, src.gif_title,
          ]
        );
        await client.query(`UPDATE public.theo_chat_threads SET updated_at = now() WHERE id = $1`, [toThreadId]);
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

    // Shape to match the list_messages / send_message message projection exactly: a forward is never a
    // reply and never (freshly) deleted; `forwarded` is the ONLY provenance exposed (never the raw origin id).
    // VC-13.1: project the carried attachment/gif (or null), then drop the raw columns so the blob_path
    // never leaks (VC-9/VC-10 parity).
    saved.reply_to = null;
    saved.deleted = false;
    saved.deleted_at = null;
    saved.forwarded = true;
    saved.attachment = attachmentPreview(saved);
    saved.gif = gifPreview(saved);
    delete saved.attachment_blob_path;
    delete saved.attachment_filename;
    delete saved.attachment_content_type;
    delete saved.attachment_byte_size;
    delete saved.gif_provider;
    delete saved.gif_id;
    delete saved.gif_url;
    delete saved.gif_preview_url;
    delete saved.gif_width;
    delete saved.gif_height;
    delete saved.gif_title;

    // Publish to the TARGET thread's group so its participants receive the forwarded message instantly.
    // Best-effort: already durably persisted; a publish failure must not fail the forward.
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(toThreadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_forward_message publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_forward_message failed", err);
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

### §HG.1-FJ — `theo_chat_forward_message.function.json` (UNCHANGED — byte-identical to §SM-FJ)

## §API-SPEC — Role-C (Pass 4) documentation delta
`spec/THEO_API_SPEC.md` §2.10 **`read / send messages`** row: note that `theo_chat_forward_message` now **carries the source's `attachment` / `gif`** into the forwarded copy (previously copied only `body`) — so forwarding an attachment/gif message preserves it, and an attachment-only/gif-only source no longer 400s on the body CHECK. No Schema delta (the columns are already documented in §3). Authored as a Role-C handoff after Pass-3 deploy + curls.

## §DEPLOY — Pass 3 (no migration; Claude Code deploys one overwrite to `vaultgpt-func-chat`)
1. **No migration** — the `attachment_*` (VC-9) + `gif_*` (VC-10) columns are DEPLOYED.
2. **Claude Code** overwrites `theo_chat_forward_message/index.js` via Kudu VFS surgical PUT (ARM bearer; no token logged); restart → inventory unchanged (21; MODIFY only); baseline get-back before overwrite; post-deploy get-back byte-matches this pack. `function.json` UNCHANGED (not re-deployed).

## §CURL — post-deploy verification (Claude Code; az-login token for `api://4e1a1e31-…`; structural — no OIDs/bodies)
Against disposable channels the caller owns (A with a text msg + an attachment msg + a gif msg; B empty target):
- **Regression:** forward a plain text A-message → B → **201**; `message.forwarded===true`, `attachment===null`, `gif===null`, body copied.
- **Attachment forward (the fix):** forward the **attachment-only** A-message → B → **201** (previously would 400 on the body CHECK); `message.attachment` = `{ filename, content_type, byte_size }`, no raw blob_path, `body===''/null`; a follow-up `attachment_download` on the forwarded message → **200** (target participant can download).
- **GIF forward (the fix):** forward the **gif-only** A-message → B → **201**; `message.gif` = `{ provider, id, url, … }`, `body===''/null`.
- **Captioned attachment forward:** forward an A-message with body + attachment → B → **201**; both `body` and `attachment` present.
- Deleted source → **400** (unchanged); forward into an archived target → **409** (unchanged); non-participant target → **404** (unchanged).

## §SM-NOTE — structural mirror
`theo_chat_forward_message` keeps the deployed source-read + seq-INSERT + publish + gate pattern; the only delta is carrying + projecting `attachment`/`gif` (mirrors the VC-9 attachment projection + VC-10 gif projection). No shared-helper/envelope/error-map drift. `node --check` clean (verified this turn). The copied columns are a verbatim copy of a valid source row, so all `theo_chat_messages` CHECKs hold.

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: no migration; Claude Code deploys the one overwrite + curls, then the Role-C (Pass 4). No FE change required (the bubble already renders `attachment`/`gif` from `list_messages`).
