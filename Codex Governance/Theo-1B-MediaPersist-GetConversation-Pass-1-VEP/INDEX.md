# Theo Backend — `theo_get_conversation` returns `media` (Chat Media Persistence / Part 3): Pass-1 Verified Evidence Pack

Backend Verified Evidence Pack (plan). Chat Media Persistence Part 3: `theo_get_conversation` (on the shared monolith `vaultgpt-func-premium`) adds the new `theo_messages.media` column to its message projection, so a reloaded thread returns each assistant turn's persisted inline media (images/videos written by Part 2). **One additive line** — `media,` in the messages `SELECT` (+1 / −0). No new dependency, no schema change (the column is Part 1's Walter-executed migration), no other contract change. The response `messages[]` gains an additive nullable `media` field — documented by the **companion API Spec §2.1 Role-C in this submission** (`Theo-RoleC-APISpec-2.1-getconversation-media`), sequenced with this landing (post-deploy documentation, D3 §2.1 precedent). Deploys to premium via the **DR-T15** surgical Kudu VFS carve-out (approved + applied `0ee7ba8`). `node --check` PASS this turn. **Deploy precondition: the `theo_messages.media` migration (Part 1) must be live.**

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5

Turn issued against HEAD: `a5506d4bbee37604e85a532f0d6ec50e43d7cd45` (vault-theo, `development`; grounding parent `429de3439f826daa19fd0c7eb629ba11a33047d2`). Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Baseline-verification note: the Primary Reference was fetched **live** from `vaultgpt-func-premium` (Kudu VFS `site/wwwroot/theo_get_conversation/{index.js,function.json}`, ARM-bearer GET, HTTP 200) this turn (index.js blob `48a330cec1f3cf3c887a0c8192c8bb40868c0b1e`, function.json blob `11257bb1733f0f351b04fc58e2355119c754902b`); both inlined verbatim (spliced from disk).

### §4 Documents grounded this turn (Full Baseline)
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Claude Code Theo Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§3/§4/§7) | `Grep` this turn | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2/§4/§5/§5.5 + DR-T15) | `Read` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5/§10) | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1E DR-T15 — theo_get_conversation named) | `Read`+`Grep` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 5 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 boundary, §5 RLS) | `Grep` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_get_conversation` — additive `media` field, companion Role-C) | `Grep` this turn | `c99a66f39b4ec03644701c266e49aaf2bf52c2ed` |
| 7 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5 `theo_messages.media` — Part 1) | `Read`+`Grep` this turn | `fa9aad4c75019de0b621e31b5d33ef97f3689639` |
| 8 | Primary Reference (deployed, live-fetched) — `theo_get_conversation/index.js` (premium) — blob `48a330cec1f3cf3c887a0c8192c8bb40868c0b1e` | `Read` this turn (+ live Kudu fetch) | `48a330cec1f3cf3c887a0c8192c8bb40868c0b1e` (inlined verbatim below) |
| 8b | Primary Reference (deployed) — `theo_get_conversation/function.json` (paired binding — Golden Handler §2) — blob `11257bb1733f0f351b04fc58e2355119c754902b` | `Read` this turn (+ live Kudu fetch) | `11257bb1733f0f351b04fc58e2355119c754902b` (inlined verbatim below) |

## Premium deploy authority: DR-T15
DR-T15 (Walter-granted 2026-07-25; Role-C APPROVED + applied `0ee7ba8`) names `theo_get_conversation` as the premium chat-read handler Claude Code MAY deploy via surgical Kudu VFS after a Codex-APPROVED VEP, for exactly this Chat Media Persistence reload-read.

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "exactly one" | §Primary Reference — deployed theo_get_conversation (handler + function.json) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "ALLOWED DELTA" | §Structural Mirror — the one added SELECT column is an ALLOWED DELTA |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "EXCEPTION (DR-T14, 2026-07-24; DR-T15, 2026-07-25)" | §Deploy — premium surgical Kudu VFS of theo_get_conversation |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §10 | "Primary reference artifact cited without full verbatim inline this turn" | §Primary Reference — handler + function.json full verbatim inline below |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T15 | "theo_get_conversation" | §Deploy — the authority naming this handler |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_AZURE_POSTGRES_SCHEMA.md | §5 | "theo_messages" | §P3 — the media column read (Part 1 migration) |

## Architecture & boundary reconciliation (§4A.1 P2)
- **§1 boundary** — reads only `theo_messages` (adds the `media` column to the existing owner-scoped SELECT). No `reporting_*`. No new external system.
- **§5 theo_ schema + RLS** — unchanged owner-scoped read (`WHERE conversation_id = $1 AND created_by = $2`); `media` inherits the table's ownership policies. No RLS change.
- **Deploy** — premium classic per-fn; DR-T15 surgical Kudu VFS overwrite of `theo_get_conversation/index.js` ONLY.

## §1 Feature Identification + boundary
- **Change:** add `media,` to the `theo_get_conversation` messages `SELECT` (after `citations,`), so each returned assistant message row includes the persisted `media` jsonb (parsed object or `null`).
- **Boundary:** one handler edit (+1 line); no new dep; no schema change; no ownership/status-code change. The response `messages[]` gains an additive nullable `media` field (documented by the companion §2.1 Role-C). `node --check` PASS. Handler blob `9fad1acb00387c757ad5ea936ddad70b5575dae8`.

## §2 Gap Register
**PROCEED.**
- **(1) Additive response field — documented.** `messages[].media` is documented by the companion API Spec §2.1 Role-C in this submission, sequenced with this landing (post-deploy, D3 §2.1 precedent). PROCEED.
- **(2) Schema dependency.** Reads the `theo_messages.media` column (Part 1 migration, Walter-executed). If read before the column exists, the SELECT errors → the read fails (400/500) — so **DO NOT deploy Part 3 until the migration is live** (disclosed in §Deploy). PROCEED (gated).
- **(3) End-to-end with Part 2.** Media is only populated by Part 2's persist; a turn persisted before Part 2 deploys has `media = null` (renders as today — text only). New turns after both deploy carry media. PROCEED (intended).
- **(4) Premium deploy is DR-T15-scoped.** Surgical Kudu VFS of this one handler; approved + applied `0ee7ba8`. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1:** Chat Media Persistence Part 3 — return persisted media on reload.
- **P2:** architecture reconciliation above (theo_messages only; no reporting_*).
- **P2.5:** Gap Register (PROCEED, deploy gated on migration).
- **P3:** no schema change *in this package* — reads the Part 1 `media` column.
- **P4:** additive response field `messages[].media`; companion §2.1 Role-C documents it (post-deploy).
- **P5:** Primary Reference = live-fetched deployed `theo_get_conversation` (handler + function.json inlined verbatim); the one added SELECT column is an ALLOWED DELTA; Structural Mirror + unified diff below.
- **P6:** no migration; the read SQL adds one existing column to the owner-scoped SELECT.
- **P7:** golden curls below (reload returns media end-to-end with Part 2; regression 400/403/404/401).
- **P8:** this pack.

## Primary Reference (deployed, live-fetched `theo_get_conversation`) — FULL VERBATIM (Conformance T9)
Byte-faithful content of the deployed premium handler (blob `48a330cec1f3cf3c887a0c8192c8bb40868c0b1e`), fetched live this turn and spliced from disk — no reconstruction:
```javascript
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
  context.res = {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
    body,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function errorBody(code, message, status) {
  return {
    error: {
      code,
      message,
      status,
      timestamp: nowIso(),
    },
  };
}

function successBody(data) {
  return {
    data,
    meta: {
      timestamp: nowIso(),
      version: "1.0",
    },
  };
}

function getPrincipal(req) {
  const raw = req.headers["x-ms-client-principal"];
  if (!raw || typeof raw !== "string") return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function getClaimValue(principal, claimTypes) {
  if (!principal || !Array.isArray(principal.claims)) return null;

  for (const claimType of claimTypes) {
    const match = principal.claims.find((c) => c.typ === claimType);
    if (match && typeof match.val === "string" && match.val.trim()) {
      return match.val.trim();
    }
  }

  return null;
}

function isUuid(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
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

  const conversationId =
    req.query && typeof req.query.conversationId === "string" ? req.query.conversationId.trim() : "";
  if (!isUuid(conversationId)) {
    return send(
      context,
      400,
      errorBody("INVALID_REQUEST", "Query parameter 'conversationId' is required and must be a valid UUID.", 400)
    );
  }

  const client = await pool.connect();

  try {
    await client.query(
      `
      SELECT
        set_config('app.current_user_id', $1, false),
        set_config('request.jwt.claim.sub', $1, false),
        set_config('request.jwt.claim.oid', $1, false)
      `,
      [oid]
    );

    // Explicit ownership scope: the shared Functions connection role bypasses RLS, so the
    // by-id read MUST also filter created_by = the signed-in OID. A non-owned id yields 0 rows
    // here and is then discriminated 403 (exists, not owned) vs 404 (absent) via the helper.
    const convResult = await client.query(
      `
      SELECT
        id,
        title,
        model,
        project_id,
        app_key,
        app_context,
        created_at,
        updated_at,
        last_opened_at
      FROM public.theo_conversations
      WHERE id = $1 AND created_by = $2
      `,
      [conversationId, oid]
    );

    if (convResult.rowCount === 0) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      return exists
        ? send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403))
        : send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
    }

    // Restore-on-reopen: stamp last_opened_at now that ownership is confirmed. Owner-scoped
    // (created_by = the signed-in OID; the deployed theo_conversation_update_own policy permits it).
    // Best-effort — a stamp failure MUST NOT fail the read, so it is caught and logged only. The
    // returned conversation row above reflects the pre-stamp value; the frontend does not depend on
    // the stamp being reflected in this response (it reorders via theo_list_conversations).
    try {
      await client.query(
        `UPDATE public.theo_conversations SET last_opened_at = now() WHERE id = $1 AND created_by = $2`,
        [conversationId, oid]
      );
    } catch (stampErr) {
      context.log.error("theo_get_conversation last_opened_at stamp failed (non-fatal)", stampErr);
    }

    const messagesResult = await client.query(
      `
      SELECT
        id,
        seq,
        role,
        content,
        model,
        citations,
        created_at
      FROM public.theo_messages
      WHERE conversation_id = $1 AND created_by = $2
      ORDER BY seq ASC, created_at ASC
      `,
      [conversationId, oid]
    );

    return send(
      context,
      200,
      successBody({ conversation: convResult.rows[0], messages: messagesResult.rows })
    );
  } catch (err) {
    context.log.error("theo_get_conversation failed", err);

    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
    }

    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred.", 500));
  } finally {
    client.release();
  }
};
```

### Primary Reference paired `function.json` (deployed) — FULL VERBATIM (Golden Handler §2 / Conformance T9)
Blob `11257bb1733f0f351b04fc58e2355119c754902b` (deployed premium; route binding UNCHANGED by this VEP — index.js-only deploy):
```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_get_conversation"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## Exact unified diff vs the live-fetched baseline (authoritative delta)
```diff
--- deployed baseline (48a330ce)
+++ Part3 handler (9fad1acb)
@@ -173,4 +173,5 @@
         model,
         citations,
+        media,
         created_at
       FROM public.theo_messages
```

## Structural Mirror Table (Golden Handler §5.1)
| Region | Reference (deployed) | Classification | Anchor |
|---|---|---|---|
| Entire baseline handler body (199 lines) | deployed theo_get_conversation (primary ref) | **EXACT** (unchanged) | Golden Handler §2 "exactly one" |
| `media,` added to the messages `SELECT` projection | deployed SELECT (id/seq/role/content/model/citations/created_at) | **ALLOWED DELTA** (one additive existing column; owner-scoped SELECT otherwise unchanged) | Golden Handler §4 "ALLOWED DELTA" |

## New handler + package
Included: `theo_get_conversation/index.js` (blob `9fad1acb00387c757ad5ea936ddad70b5575dae8`; `node --check` PASS; +1/−0) + `function.json` (blob `11257bb1733f0f351b04fc58e2355119c754902b` — deployed binding, UNCHANGED; the Golden Handler §2 pair, inlined verbatim above; NOT redeployed). No `package.json` change. Deploy unit = the single `index.js` (premium Kudu VFS surgical overwrite, DR-T15 / §5.5).

## Golden Curls (P7; run by Claude Code post-deploy — AFTER the migration + Part 2 are live)
Bearer via `az account get-access-token` for `api://4e1a1e31-…/access_as_user`; premium base.
```
# GC-MP3-1 (end-to-end, with Part 2) — send a chat that fetches an image/video (theo_message_stream,
#   Part 2 persists media) -> GET theo_get_conversation?conversationId=<id> -> the assistant message
#   carries a non-null `media` object with the image/video payload. A turn with no media -> media null.
# GC-MP3-2 (regression) — reload a normal (no-media) conversation -> unchanged {id,seq,role,content,
#   model,citations,media,created_at} rows (media null); bad id -> 400; not-owned -> 403; absent -> 404;
#   no-bearer -> 401.
# (test conversation cleaned up after)
```

## Parity Checklist (Golden Handler §5.4)
- [x] Single canonical Primary Reference (deployed theo_get_conversation) — handler index.js AND paired function.json both inlined full verbatim; live-fetched byte-faithful.
- [x] Structural mirror classifies every region; the one added SELECT column is an ALLOWED DELTA.
- [x] Owner-scoped read unchanged (created_by predicate); media inherits theo_messages ownership policies.
- [x] Only theo_messages; no reporting_*; no new external system; no new npm dep.
- [x] No schema change (reads the Part 1 column); additive response field documented via the companion §2.1 Role-C.
- [x] node --check PASS; unified diff = the one added SELECT column; deploy gated on the Part 1 migration + Part 2.
- [x] Premium deploy scoped to DR-T15 surgical Kudu VFS of this one handler; mechanical lint PASS.

## §Deploy (Pass-3, on APPROVAL) — Claude Code, `vaultgpt-func-premium` surgical Kudu VFS (DR-T15 / §5.5)
1. **PRECONDITION: confirm the `theo_messages.media` column is live** (Part 1 migration). Do NOT deploy before it exists.
2. Kudu VFS PUT `site/wwwroot/theo_get_conversation/index.js` (blob `9fad1acb`) over the deployed file (ARM-bearer; If-Match the current ETag), GET-back + diff to confirm byte-identical, then `az functionapp restart`. **Only** this handler file is touched (DR-T15 scope).
3. Claude Code runs GC-MP3-1..2 (jointly with Part 2 for the end-to-end check) and reports.
4. Apply the **companion API Spec §2.1 Role-C** documenting `messages[].media` — post-deploy documentation sequenced with Part 3.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-MediaPersist-GetConversation-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review of this Part 3 handler VEP (APPROVED / REJECTED only), reviewed **together with** its companion API Spec §2.1 Role-C (`Codex Governance/Theo-RoleC-APISpec-2.1-getconversation-media/`, Pass-4). On APPROVED (both), Claude Code deploys the single handler file to premium via DR-T15 surgical Kudu VFS (after confirming the migration + Part 2 are live), runs the golden curls, then applies the §2.1 Role-C.
