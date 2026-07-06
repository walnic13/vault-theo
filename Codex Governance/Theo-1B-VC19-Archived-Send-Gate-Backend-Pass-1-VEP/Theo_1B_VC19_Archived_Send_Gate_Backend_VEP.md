# Theo 1B — VC-19 Archived-Thread Write-Gate Backend (MODIFY `theo_chat_send_message` + `theo_chat_forward_message` to reject a NEW message into an archived channel) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **No migration** (the `archived_at` column shipped in VC-16). On APPROVED, Claude Code deploys the two overwrites to the dedicated `vaultgpt-func-chat` app (§1E / DR-T7) + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 note. Plan-only.
>
> **Scope (VC-19 = soft-archive write-gate hardening):** an **archived channel is closed to NEW messages**. Today `theo_chat_send_message` and `theo_chat_forward_message` gate only membership — a stale or racing client that still holds an archived thread's id can still land a message in it. VC-19 adds a deterministic **409 `CONVERSATION_ARCHIVED`** to BOTH write paths: the membership-gate `SELECT` now also reads `archived_at`, and a non-NULL `archived_at` is rejected before any insert. **Two MODIFY handlers; no migration; no schema/RLS/contract-envelope change; one new error code.**
>
> **Why now:** VC-16 added the soft-archive marker and hid archived channels from `theo_chat_list_threads`, but the write handlers were never taught to honour it — a Codex-flagged gap. Reading an archived channel's history stays allowed; only landing a NEW message (send or forward-in) is blocked. Forwarding OUT of an archived channel stays allowed (the source read is unaffected).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `f64473b817dff6b995bd57a4879f8596aa5e27c6` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-19 archived-thread write-gate. P1–P8 walked; NO migration (the `theo_chat_threads.archived_at` column is DEPLOYED — VC-16); Primary Reference = the DEPLOYED `theo_chat_send_message` (VC-13 state, carrying `forwarded:false`) inlined byte-verbatim + its function.json; two MODIFY handlers (`send_message` + `forward_message`) inlined full — each adds `archived_at` to its existing membership-gate `SELECT` and a `409 CONVERSATION_ARCHIVED` reject before the insert. No schema change, no RLS change, no new external system, no envelope change. No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `grep -F "VEP Format"` + `grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A P-track) | `grep -F "MUST open with a Grounding Conformance Receipt"` + `awk §4A.1` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 external-system) | `grep -F "selects **exactly one** deployed handler file"` + `grep -F "It MUST NOT read or write"` + `grep -F "new-domain or new-external-system helper"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception) | `grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (ownership/sharing posture → VC tier recorded VC-1) | `grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_threads` row — `archived_at` soft-archive marker, DEPLOYED VC-16) | `Read(§3 rows)` + `grep -F "soft-archive marker; NULL = active"` this turn | `b53d043f6a97f9e8ccc71ca73a88dcc88ae1c630` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — the 409 archived note lands at Pass 4) | `grep -F "read / send messages"` this turn | `181f8207411a9e77a481669e674e2b0c0425e9a2` |
| 10 | **Primary Reference handler** (DEPLOYED message send — the insert+seq+publish + membership-gate pattern VC-19 extends) — `Codex Governance/Theo-1B-VC13-Forward-Message-Backend-Pass-1-VEP/theo_chat_send_message.index.js` | `Read(full)` this turn; deployed get-back byte-matches | `5e3ea7a8b2b197d400909998497d588dc52bdb94` |
| 11 | **Primary Reference function.json** (DEPLOYED) — `Codex Governance/Theo-1B-VC13-Forward-Message-Backend-Pass-1-VEP/theo_chat_send_message.function.json` | `Read(full)` this turn | `0284d265cd81bec4c34b5513d46c41b7ba6601ff` |
| 12 | **Modify basis 2** — DEPLOYED `theo_chat_forward_message.index.js` (the second write path VC-19 gates) — `Codex Governance/Theo-1B-VC13-Forward-Message-Backend-Pass-1-VEP/theo_chat_forward_message.index.js` | `Read(full)` this turn; deployed get-back byte-matches | `56b48cbeee732140574175c3db34a55b46e9be16` |
| 13 | **Archive basis** — DEPLOYED `theo_chat_archive_channel.index.js` (sets `archived_at = now()`; only a channel is archivable → the gate can only ever fire for a channel) — `Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_archive_channel.index.js` | `Read(full)` this turn | `f60ed69132880d6bc796961d0ab0a404912e23b1` |
| 14 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_message_insert` WITH CHECK — unchanged; RLS does NOT gate archived) | `Read(full)` this turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + streaming sidecar `vaultgpt-func-stream` READ-ONLY — deploy targets `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §SM + §HG + §API-SPEC + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P2.5 — VC tier Walter-directed; recorded VC-1 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed `theo_chat_send_message` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — no new external system |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-19 touches only `theo_chat_*`; no `reporting_*` |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped write-gate is an ownership-family extension; no RLS change |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "soft-archive marker; NULL = active" | §P3 / §P6 — the gate reads the existing `archived_at`; no schema change |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | §API-SPEC — the 409 archived note lands on this row |
| Codex Governance/Theo-1B-VC13-Forward-Message-Backend-Pass-1-VEP/theo_chat_send_message.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.1 — the gate is added inside the deployed handler; triad unchanged |
| Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/theo_chat_archive_channel.index.js | archive write | "archived_at = now()" | §P6 — archive sets `archived_at`; only a channel is archivable |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | insert policy | "theo_chat_message_insert" | §P8 — RLS insert policy is column/state-agnostic; unchanged (does NOT gate archived) |
| Codex Governance/Theo-1B-VC13-Forward-Message-Backend-Pass-1-VEP/theo_chat_send_message.function.json | binding | "httpTrigger" | §SM-FJ — anonymous httpTrigger binding (EasyAuth gates identity); unchanged |

## P1 — Feature identification
**Microstep:** VC-19 — soft-archive **write-gate** hardening. A channel archived by its admin (VC-16) is "closed for new messages": it is already hidden from `theo_chat_list_threads`, but the two message-write handlers never honoured `archived_at`. VC-19 teaches both to reject a NEW message into an archived thread.

**No migration** (`theo_chat_threads.archived_at` is DEPLOYED — VC-16).
**Modified (2), on `vaultgpt-func-chat`:** `theo_chat_send_message` + `theo_chat_forward_message` — each membership-gate `SELECT` now also reads `archived_at`; a non-NULL value → **409 `CONVERSATION_ARCHIVED`** before any insert.

**Out of scope (VC-19):** the FE (a disabled composer + "This channel is archived" banner + the 409→friendly-message mapping = vault-origin **VC-19-FE**); un-archiving / re-open (no such endpoint today); blocking READS of an archived channel (reading history stays allowed); blocking forwarding OUT of an archived channel (only landing a NEW copy in an archived TARGET is gated); any change to `mark_read` / `typing` / `list_messages` (read/side-channel ops, not new-message writes).

**Plan status:** VC tier Walter-directed, reconciled at VC-1 ("sharing/membership RLS models (ownership-only unless Walter authorizes)"). Doc delta = API-Spec §2.10 `read / send messages` row (the 409 archived note) — Role-C, Pass 4. No schema delta (the column is already documented in Schema §3).

## P2 — Architecture & boundary reconciliation
**Handler family.** Both handlers stay Family-B HTTP handlers byte-identical to their DEPLOYED selves except for the added gate: `pg` Pool; EasyAuth OID; validate-before-SQL; `set_config` triad; the atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` with `23505` retry; best-effort Web PubSub publish; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`. The ONLY change: the existing membership-gate `SELECT 1 …` becomes `SELECT archived_at …`, and a `if (acc.rows[0].archived_at != null) throw 409` is added immediately after the existing 404 check — before the reply-target validation (send) / the seq-insert (both).
**Boundary.** Reads/writes only `theo_chat_*`. Per Golden §3 ("It MUST NOT read or write" outside its domain) no `reporting_*`/monolith/Blob/Graph/Foundry. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY.
**Validation before SQL.** Unchanged — the UUID guards on `thread_id` / `message_id` / `to_thread_id` still produce a deterministic 400 before any SQL.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 will change (the new 409 `CONVERSATION_ARCHIVED` on send + forward). | Documentation-currency delta on the recorded VC tier. | **PROCEED** with a Role-C (Pass 4): `spec/THEO_API_SPEC.md` §2.10 `read / send messages` row. Sequenced after Pass 3 deploy + curls. No Schema delta (the `archived_at` column already documented in §3). |
| **TOCTOU:** an admin could archive the channel in the microseconds between the gate `SELECT` and the seq-`INSERT`, letting one straggler message land in a just-archived channel. | **Deliberately accepted.** Archived is a *cooperative UX write-gate*, not a security boundary — membership/RLS (the real boundary) are unchanged. A straggler landing as the channel is being archived is benign (the message stays visible in history and is removable; the archiver has no expectation of blocking already-in-flight sends). A `FOR UPDATE` row-lock on the thread was considered and **rejected as disproportionate**: it would fork the atomic seq-`INSERT` away from the Primary Reference for zero security benefit. Contrast VC-16's leave TOCTOU, which *was* locked because it guarded **admin authority** (a real integrity boundary). | **PROCEED** — pre-check gate; documented benign race. |
| A stale/racing client still holding an archived thread's id (archived threads are hidden from `list_threads`, so this is the only way to reach the write path). | This is exactly the window VC-19 closes: the gate returns a deterministic 409 the FE can render as "This channel is archived". | **PROCEED** — the gate is the fix. |
| FE does not yet render the archived state (disabled composer / banner) or map the 409. | The backend 409 is well-formed; a current FE would surface a generic error until VC-19-FE lands. | **PROCEED** — future trigger: **VC-19-FE** (disable composer + banner + 409 mapping). Not in this backend scope. |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**No new external system in VC-19.** Both handlers reuse the existing best-effort Web PubSub publish unchanged. Per Golden §4 a "new-domain or new-external-system helper" would need justification; VC-19 introduces none — it reads one already-present column (`archived_at`) on `theo_chat_threads` and adds one guard. Pure Postgres over `theo_chat_*`.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`). Request shapes unchanged (`send_message` `{ thread_id, body, reply_to_message_id? }`; `forward_message` `{ message_id, to_thread_id }`). Success paths unchanged (201 `{ message }`). **One added failure:** posting a NEW message (send, or forward-in) to an archived thread → **409** `{ error: { code:"CONVERSATION_ARCHIVED", … } }`. All existing failures (400 / 401 / 403 / 404 / 409-seq) preserved.

## P5 — Error-model reconciliation
The new `409 CONVERSATION_ARCHIVED` is raised via `buildKnownError("CONVERSATION_ARCHIVED", …, 409)` and flows through the **existing** `isKnown` re-map branch in each handler's `catch` — no new `catch` branch, no change to the `42501`→403 / `23514`→400 / else-500 arms. `CONVERSATION_ARCHIVED` is a new, self-describing error code; it does not collide with the existing `CONFLICT` (seq-exhaustion) code that also uses 409 (distinct codes, distinct messages).

## P6 — Data-shape reconciliation
**No schema change.** The gate reads the existing `theo_chat_threads.archived_at` (`timestamptz NULL` — "soft-archive marker; NULL = active", DEPLOYED VC-16). No new column/table/index/constraint. `archived_at` is set ONLY by `theo_chat_archive_channel` (`archived_at = now()`), and that handler rejects any non-channel — therefore `archived_at` is non-NULL only on channels, so the gate can only ever fire for an archived **channel** (a DM always passes). No message-row shape change; the message projection is untouched.

## P7 — Idempotency / concurrency
- The gate is a pure read added to an existing read; it introduces no new write and no new lock. The seq-`INSERT` loop (atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` + `23505` retry) is **byte-identical** to the Primary Reference.
- TOCTOU against a concurrent archive is disclosed and accepted as benign in §P2.5 (archived is a cooperative gate, not a security boundary; no `FOR UPDATE` added, to preserve Primary-Reference parity).
- Read paths (`list_messages`, `mark_read`, `typing`) are untouched — an archived channel remains fully readable.

## P8 — Security / RLS reconciliation
**No RLS change.** The deployed `theo_chat_message_insert` policy `WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))` is membership-scoped and **state-agnostic** — it does not (and will not) consider `archived_at`. The archived write-gate is therefore an **application-layer cooperative gate**, layered on top of the unchanged RLS boundary; it is not a security control. The real security boundary — who may write to a thread — is membership, enforced by both the explicit gate and RLS, and is unchanged. Participant-scoped write-gating is an ownership-family extension ("Default family: ownership-based"). No `SECURITY DEFINER`; no new elevated read.
**No leakage.** The 409 body carries only the static code/message ("This conversation is archived; you can no longer post to it.") — no tokens, ids, or thread metadata. A non-member still gets the pre-existing 404 (the archived check runs only after the membership gate returns a row), so archived-state is disclosed only to members — no existence leak.

## §SM — Primary Reference (DEPLOYED `theo_chat_send_message.index.js`, byte-verbatim — the membership-gate + insert+seq+publish pattern VC-19 extends)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the DEPLOYED **`theo_chat_send_message`** (current VC-13 state — carries `saved.forwarded = false`). VC-19's gate slots into its membership-gate block; everything else is preserved. Blob `5e3ea7a8b2b197d400909998497d588dc52bdb94`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload.

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
// VC-11: shape a parent-message preview for a reply (bounded body snippet). null when there is no parent.
// VC-12: a tombstoned parent has body NULL + deleted:true (the FE renders "message deleted").
function replyPreview(row) {
  if (!row) return null;
  return {
    id: row.id,
    seq: Number(row.seq),
    sender_oid: row.sender_oid,
    body: typeof row.body === "string" ? row.body.slice(0, REPLY_PREVIEW_MAX) : row.body,
    deleted: row.deleted_at != null,
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
  // VC-11: optional reply target. Absent → a normal message. Present → must be a well-formed UUID here,
  // and (checked under RLS below) an existing message IN THE SAME THREAD.
  let replyToId = null;
  if (body.reply_to_message_id != null && String(body.reply_to_message_id).trim() !== "") {
    replyToId = String(body.reply_to_message_id).trim();
    if (!isUuid(replyToId)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'reply_to_message_id' must be a valid UUID when provided.", 400));
    }
  }

  let client = null;
  let saved = null;
  let parentPreview = null;
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

    // VC-11: validate the reply target is a message IN THIS THREAD (RLS-visible). This both enforces
    // same-thread integrity (a reply can't point at another conversation) and yields the preview columns
    // we return + publish (so the live send and a cold list_messages render an identical `reply_to`).
    // VC-12: carry the parent's deleted_at so replying to a tombstoned message shows a masked preview.
    if (replyToId) {
      const p = await client.query(
        `SELECT id, seq, sender_oid, body, deleted_at FROM public.theo_chat_messages WHERE id = $1 AND thread_id = $2`,
        [replyToId, threadId]
      );
      if (p.rowCount === 0) {
        throw buildKnownError("INVALID_REQUEST", "reply_to_message_id is not a message in this conversation.", 400);
      }
      parentPreview = replyPreview(p.rows[0]);
    }

    // Insert with the next per-thread seq computed atomically in the INSERT…SELECT; the UNIQUE(thread_id,
    // seq) guards against a concurrent sender — retry a few times on a 23505 race, then bump the thread.
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages (thread_id, seq, sender_oid, body, reply_to_message_id)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4 FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id
          `,
          [threadId, oid, text, replyToId]
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

    // VC-11: attach the parent preview so the response + realtime payload carry the same `reply_to` shape
    // as list_messages (null for a normal message). VC-12: a freshly-sent message is never deleted — carry
    // deleted:false + deleted_at:null so the message shape matches list_messages exactly.
    saved.reply_to = parentPreview;
    saved.deleted = false;
    saved.deleted_at = null;
    // VC-13: a normally-sent message is never a forward — carry forwarded:false for shape parity with
    // list_messages / theo_chat_forward_message.
    saved.forwarded = false;

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

### §SM-FJ — Primary Reference function.json (DEPLOYED `theo_chat_send_message.function.json`, byte-verbatim — UNCHANGED by VC-19)

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

## §HG.1 — `theo_chat_send_message` (MODIFY: archived write-gate)

Delta vs DEPLOYED (blob `5e3ea7a8`): the membership-gate `SELECT 1 …` becomes `SELECT archived_at …`, and a `409 CONVERSATION_ARCHIVED` reject is added immediately after the existing 404 (before the reply-target validation). Nothing else changes. Full — file `theo_chat_send_message.index.js`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload.

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
// VC-11: shape a parent-message preview for a reply (bounded body snippet). null when there is no parent.
// VC-12: a tombstoned parent has body NULL + deleted:true (the FE renders "message deleted").
function replyPreview(row) {
  if (!row) return null;
  return {
    id: row.id,
    seq: Number(row.seq),
    sender_oid: row.sender_oid,
    body: typeof row.body === "string" ? row.body.slice(0, REPLY_PREVIEW_MAX) : row.body,
    deleted: row.deleted_at != null,
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
  // VC-11: optional reply target. Absent → a normal message. Present → must be a well-formed UUID here,
  // and (checked under RLS below) an existing message IN THE SAME THREAD.
  let replyToId = null;
  if (body.reply_to_message_id != null && String(body.reply_to_message_id).trim() !== "") {
    replyToId = String(body.reply_to_message_id).trim();
    if (!isUuid(replyToId)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'reply_to_message_id' must be a valid UUID when provided.", 400));
    }
  }

  let client = null;
  let saved = null;
  let parentPreview = null;
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
    // VC-19: read archived_at in the SAME gate query — an archived channel is closed to NEW messages.
    const acc = await client.query(
      `SELECT archived_at FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    // VC-19: reject a send into an archived thread with a deterministic 409. A DM never has archived_at set
    // (only a channel is archivable — see theo_chat_archive_channel), so this only ever fires for an archived
    // channel. Archived = read-only: history stays visible, no NEW message lands. This is a cooperative UX
    // write-gate, NOT a security boundary — membership/RLS are unchanged (see the VEP §P8 TOCTOU note).
    if (acc.rows[0].archived_at != null) {
      throw buildKnownError("CONVERSATION_ARCHIVED", "This conversation is archived; you can no longer post to it.", 409);
    }

    // VC-11: validate the reply target is a message IN THIS THREAD (RLS-visible). This both enforces
    // same-thread integrity (a reply can't point at another conversation) and yields the preview columns
    // we return + publish (so the live send and a cold list_messages render an identical `reply_to`).
    // VC-12: carry the parent's deleted_at so replying to a tombstoned message shows a masked preview.
    if (replyToId) {
      const p = await client.query(
        `SELECT id, seq, sender_oid, body, deleted_at FROM public.theo_chat_messages WHERE id = $1 AND thread_id = $2`,
        [replyToId, threadId]
      );
      if (p.rowCount === 0) {
        throw buildKnownError("INVALID_REQUEST", "reply_to_message_id is not a message in this conversation.", 400);
      }
      parentPreview = replyPreview(p.rows[0]);
    }

    // Insert with the next per-thread seq computed atomically in the INSERT…SELECT; the UNIQUE(thread_id,
    // seq) guards against a concurrent sender — retry a few times on a 23505 race, then bump the thread.
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages (thread_id, seq, sender_oid, body, reply_to_message_id)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4 FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id
          `,
          [threadId, oid, text, replyToId]
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

    // VC-11: attach the parent preview so the response + realtime payload carry the same `reply_to` shape
    // as list_messages (null for a normal message). VC-12: a freshly-sent message is never deleted — carry
    // deleted:false + deleted_at:null so the message shape matches list_messages exactly.
    saved.reply_to = parentPreview;
    saved.deleted = false;
    saved.deleted_at = null;
    // VC-13: a normally-sent message is never a forward — carry forwarded:false for shape parity with
    // list_messages / theo_chat_forward_message.
    saved.forwarded = false;

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

### §HG.1-FJ — `theo_chat_send_message.function.json` (UNCHANGED — byte-identical to §SM-FJ)

## §HG.2 — `theo_chat_forward_message` (MODIFY: archived TARGET write-gate)

Delta vs DEPLOYED (blob `56b48cbe`): the TARGET membership-gate `SELECT 1 …` becomes `SELECT archived_at …`, and a `409 CONVERSATION_ARCHIVED` reject is added immediately after the existing 404 (before the seq-insert). The SOURCE read is untouched — forwarding OUT of an archived channel stays allowed. Full — file `theo_chat_forward_message.index.js`:

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

### §HG.2-FJ — `theo_chat_forward_message.function.json` (UNCHANGED)

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_forward_message" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §API-SPEC — Role-C (Pass 4) documentation delta
`spec/THEO_API_SPEC.md` §2.10 **`read / send messages`** row: add a note that `POST /api/theo_chat_send_message` and `POST /api/theo_chat_forward_message` now return **409 `CONVERSATION_ARCHIVED`** when the (target) thread is archived — an archived channel is read-only; no NEW message (send or forward-in) may land, while reading history and forwarding OUT stay allowed. **No Schema delta** (the `archived_at` column is already documented in Schema §3, VC-16). Authored as a Role-C handoff after Pass-3 deploy + curls.

## §DEPLOY — Pass 3 (no migration; Claude Code deploys two overwrites to `vaultgpt-func-chat`)
1. **No migration** — `theo_chat_threads.archived_at` is DEPLOYED (VC-16); confirm it exists with the read-only check below before deploy.
2. **Claude Code** overwrites `theo_chat_send_message/index.js` + `theo_chat_forward_message/index.js` via Kudu VFS surgical PUT (ARM bearer; no token logged); restart → confirm inventory unchanged (17 functions; no new function); baseline get-back before overwrite; post-deploy get-back byte-matches this pack. `function.json` for both is UNCHANGED (not re-deployed).

**Read-only pre-deploy confirmation (the column the gate reads must already exist):**

```sql
-- VC-19 pre-deploy check (read-only): archived_at (VC-16) exists on theo_chat_threads.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_threads' AND column_name = 'archived_at';
```

## §CURL — post-deploy verification (Claude Code; az-login token for `api://4e1a1e31-…`; structural only — no OIDs/bodies)
Against two disposable channels the caller owns — one ACTIVE (A), one the caller then ARCHIVES (Z), plus a DM (D):
- `POST send_message` bad `thread_id` → **400** (unchanged UUID guard).
- `POST send_message` into ACTIVE A → **201** (regression: archived gate does not affect active threads).
- Archive Z (`POST archive_channel`), then `POST send_message` into Z → **409** `error.code === "CONVERSATION_ARCHIVED"`.
- `POST send_message` into DM D → **201** (a DM has no `archived_at`; the gate never fires).
- `POST forward_message` a real A-message → ACTIVE A (or another active target) → **201** (regression).
- `POST forward_message` a real A-message → archived Z → **409** `CONVERSATION_ARCHIVED`.
- `POST forward_message` a message that lives IN archived Z → an ACTIVE target → **201** (forwarding OUT of an archived channel stays allowed).
- Regression: `GET list_messages?threadId=Z` on the archived channel → **200** (reading archived history is unaffected).

## §SM-NOTE — structural mirror
Both handlers remain byte-identical to their DEPLOYED selves except the membership-gate `SELECT 1`→`SELECT archived_at` and the added `409 CONVERSATION_ARCHIVED` reject. No shared helper/envelope/error-map drift; the new error rides the existing `isKnown` re-map. No `function.json` change. `node --check` clean on both (verified this turn).

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: no migration needed; Claude Code deploys the two overwrites + curls, then the Role-C (Pass 4). VC-19-FE (disabled composer + archived banner + 409 mapping) is a separate vault-origin microstep.
