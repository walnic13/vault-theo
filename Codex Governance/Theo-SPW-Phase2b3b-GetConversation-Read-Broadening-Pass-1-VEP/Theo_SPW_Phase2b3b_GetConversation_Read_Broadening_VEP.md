# Theo — Shared Project Workspace Phase 2b-3b: `theo_get_conversation` read broadening (func-premium) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; on APPROVAL Claude Code deploys the one modified handler to `vaultgpt-func-premium` via **Kudu VFS** (PUT + GET-back byte-diff + restart) and runs authenticated golden curls. **Shared Project Workspace, Phase 2b-3b (the first live chat-handler read broadening).** The deployed `theo_get_conversation` gates on explicit `created_by = $oid` app-SQL (the shared Functions role BYPASSES RLS), so a published conversation is not yet readable by a member. This microstep rewires its read path onto the deployed Phase-2b-3a `theo_conversation_access(uuid)` classifier: **(A)** gate access via the helper (`'owner'|'member'|NULL`; NULL → the existing 403/404 discrimination); **(B)** read the conversation by id once access is confirmed (drop the `created_by` filter); **(C)** read **all** messages in the thread (drop `created_by` — the attributed multi-party render, each message keeps its author); **(D)** generalize the persisted-image re-sign to any author's `images/<ownerOid>/` blob in the thread (the re-sign is minted by the Function's managed identity, and conversation access — confirmed above — is the authorization boundary), so a member sees the owner's + co-authors' images. **READ-ONLY microstep** — no INSERT/continue change (that is Phase 2b-3c); `last_opened_at` stays owner-only (a member open is a correct no-op). No DB/DDL change; no FE change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding parent (source baseline): `da92ed883d853ecf6dce30e795d25b6dbec41dbd` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the forward submission note; all currency anchors below are tip-independent blob SHAs. The **Primary Reference is the LIVE deployed handler** pulled from func-premium Kudu VFS this turn (blob `149e080df83e25bd6ee87d9bb267be11eba14abd`), which DIFFERS from the July-26 in-repo snapshot — so the modified handler is diffed against the true deployed bytes, not a stale copy.
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Single-handler read-broadening microstep — NO DB/DDL change (the `theo_conversation_access` helper + publish columns are already DEPLOYED + verified, schema §11). The modified `theo_get_conversation` preserves the entire deployed scaffolding (pg Pool, EasyAuth OID, CORS, `set_config` RLS context, the MI user-delegation SAS re-sign machinery, `{data,meta}`/`errorBody` envelopes, `theo_conversation_exists_unscoped` 403/404 discrimination) and changes ONLY the read authorization: helper-gated access + conversation-wide reads + generalized image re-sign (§P5 diff). The modified handler passes `node --check`. Deploy = Kudu VFS (Golden Handler §5.5); curl verification is Claude Code's job. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | -------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | `Grep("Gap Register")` (this program) | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§4/§5) | carried grounding (this program; blob-anchored) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary reference; §4 allowed deltas; §5.5 deploy + curl) | `Grep("selects **exactly one** deployed handler file")` + `Grep("Curl verification")` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1E deploy authority) | carried grounding (this program; blob-anchored) | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 6 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§11 `theo_conversation_access` helper + publish columns) | `Grep("theo_conversation_access")` this turn | `abe14dc5d45b8a78b4d2b7303f0bd1257da120ec` |
| 7 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 publish contracts — the read path this opens) | carried grounding (this program; blob-anchored) | `9291b9eecade963514a9f3854bd7cbeb862d9e2f` |
| 8 | **Primary Reference (LIVE deployed handler + function.json)** — func-premium `theo_get_conversation` (pulled from Kudu VFS this turn) | `curl`(Kudu VFS GET) + `Read(full)` + `node --check` this turn | `149e080df83e25bd6ee87d9bb267be11eba14abd` (index.js; function.json `11257bb1733f0f351b04fc58e2355119c754902b`) |
| 9 | Deployed access-helper migration (referenced) — `Codex Governance/Theo-SPW-Phase2b3a-Conversation-Access-Helper-Pass-1-VEP/spw_phase2b3a_migration.sql` | `Read` this turn (2b-3a) | `4d589f83b4954b43196bd7074b1fe29075df0c8f` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL / no migration (helper already deployed). No FE change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §P5 — Primary Reference = LIVE `theo_get_conversation` (inlined verbatim) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Curl verification" | §CURLS — Claude runs authenticated golden curls post-deploy |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §11 | "theo_conversation_access" | §P2/§P5 — the read path is rewired onto the deployed classifier |

---

## P1 — Feature identification
SPW **Phase 2b-3b**: make a published conversation READABLE by a project member. The deployed `theo_get_conversation` (func-premium) gates reads on explicit `created_by = $oid` app-SQL (the connection role BYPASSES RLS), so a member cannot open the owner's published thread. This microstep rewires the read path onto the deployed Phase-2b-3a `theo_conversation_access(uuid)` classifier and reads the conversation + all messages thread-wide once access is confirmed, and generalizes the persisted-image re-sign so a member sees every author's images. This is the first of two live chat-handler edits; the continue/INSERT path is Phase 2b-3c. No new surface — the enabling backend read change.

## P2 — Architecture & boundary reconciliation
- **Helper-gated read (single authorization point).** The read authorization moves from `created_by = $oid` to `theo_conversation_access($1) IS NOT NULL` (schema §11 — Rule Anchor). NULL keeps the exact existing 403/404 discrimination via `theo_conversation_exists_unscoped`. The classifier's `'member'` branch is byte-for-byte the §11 access set, so read access matches the RLS model.
- **Conversation-wide reads.** With access confirmed, the conversation is read by id (no `created_by`), and messages are read by `conversation_id` (no `created_by`) — the attributed multi-party render; each message keeps its own `created_by` (author).
- **Owner-only left intact.** `set_config` still carries the caller OID; the `last_opened_at` stamp stays `WHERE id=$1 AND created_by=$2` (owner-only) — a member open updates 0 rows, a correct no-op that never clobbers the owner's Recents ordering. No INSERT/continue change (Phase 2b-3c).
- **Generalized image re-sign (D).** `blobKeyForOid(url, oid)` (caller-prefix-only) → `blobKeyInContainer(url)` (any `images/<uuid>/` under our container). Safe: `resignPersistedMedia` runs ONLY after access is confirmed, the re-sign is minted by the **Function's managed identity**, and every image it touches is attached to a message in a conversation the caller may read. So a member sees the owner's + co-authors' persisted images; the old caller-prefix check was defense-in-depth from the owner-only era, now superseded by the access gate.
- **Boundary.** One handler on func-premium; no DB change; no `reporting_*`; no FE; deps unchanged (`pg`, `crypto`, node `http`/`https`).

## P2.5 / GR — Gap Register
Grounded against Governor §8 (`PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Claude Code, Kudu VFS).** PUT the modified `theo_get_conversation/index.js` to func-premium `/site/wwwroot/theo_get_conversation/index.js` (VFS), GET-back byte-diff to confirm, `az functionapp restart`. `function.json` unchanged (GET/OPTIONS). Rollback = re-PUT the LIVE baseline (blob `149e080`, retained in this package's `primary-reference/`). | **PRE-LAND** — §DEPLOY; Claude runs §CURLS after. |
| G-2 | **Curls.** Owner reads own conversation → 200 (unchanged); a member reads a published conversation in their project → 200 with the owner's messages; a non-participant → 403; absent → 404; unauth → 401. | **PRE-LAND** — §CURLS. |
| G-3 | **Cross-author image re-sign — INCLUDED here (D).** Folded into 2b-3b (Walter-directed): a member now sees every author's persisted images in a shared thread, re-signed via the Function MI, gated by conversation access. | **PROCEED** — implemented in this pack (not deferred). |
| G-4 | **Phase 2b-3c continue broadening.** `theo_message` (func-premium) + `theo_message_stream` (func-stream) gate via the helper, compute seq conversation-wide, bump `updated_at` for a member post, INSERT `created_by = caller` (attribution). | **PROCEED (future-trigger)** — the highest-touch microstep; separate governed VEP. |

No write SQL. No `reporting_*` change.

## P3 — Backend / contract grounding
No contract shape change: `GET /api/theo_get_conversation?conversationId=<uuid>` → **200** `{ conversation, messages }` is unchanged; the change is WHO may read (owner OR published-project member) and WHAT messages return (all authors, attributed). This realizes the read half of the Phase-2b-2 publish contracts (API Spec §2.2 — doc 7); no API-Spec edit needed here (the §2.2 row already flags that member read/continue lands in Phase 2b-3). Errors unchanged: 401/403/404/400.

## P4 — Schema definition
None. The `theo_conversation_access` helper + publish columns are already deployed (schema §11). This microstep consumes them.

## P5 — Component reference grounding (Primary Reference + handler delta)
**Primary Reference (Golden Handler §2 — exactly one deployed handler + function.json, inlined verbatim):** the **LIVE** `theo_get_conversation` on func-premium, pulled from Kudu VFS this turn (blob `149e080`). The modified handler preserves this scaffolding entirely; the **ALLOWED DELTA (§4 — the RLS-scoped query + the deployed governed classifier)** is exactly the unified diff below (A: helper access gate; B: by-id conversation read; C: conversation-wide message read; D: generalized image re-sign). Staged AFTER file: `handlers/theo_get_conversation.index.js` (`node --check` clean). `function.json` is unchanged (GET/OPTIONS).

Unified diff (LIVE → staged), the complete change set:
```diff
@@ -236,9 +236,14 @@
 
 // ---- Re-sign step (this handler's addition) --------------------------------------------------
 // Decode a persisted blob URL to its blobKey iff it targets OUR account+container AND lives under
-// the requesting user's own images/<oid>/ prefix (defense-in-depth: never re-sign another user's
-// blob). Non-blob / public URLs return null and are left unchanged.
-function blobKeyForOid(rawUrl, oid) {
+// the media prefix `images/<ownerOid>/` (ownerOid = ANY Entra object id, not necessarily the caller).
+// SPW Phase 2b-3b: a project member viewing a PUBLISHED conversation must see the owner's + co-authors'
+// persisted images, so this is no longer restricted to the caller's own prefix. Safe because the
+// re-sign is minted by the Function's managed identity and resignPersistedMedia runs ONLY after
+// theo_conversation_access has confirmed the caller may read THIS conversation — access to the
+// conversation (whose messages carry this media) is the authorization boundary. Non-blob / public
+// URLs, or anything outside images/<uuid>/, return null and are left unchanged.
+function blobKeyInContainer(rawUrl) {
   if (typeof rawUrl !== "string" || !rawUrl) return null;
   let parsed;
   try {
@@ -255,7 +260,8 @@
   } catch {
     return null;
   }
-  if (!blobKey || !blobKey.startsWith(`images/${oid}/`)) return null;
+  // images/<ownerOid>/<file...> — ownerOid is a uuid-shaped Entra object id (any author).
+  if (!/^images\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/.+/i.test(blobKey)) return null;
   return blobKey;
 }
 
@@ -301,19 +307,19 @@
 
 // Re-mint fresh read-SAS URLs for persisted blob images across all messages. Mutates media in
 // place. One shared UDK per reload; only fetched when at least one blob image is present.
-async function resignPersistedMedia(messages, oid, context) {
+async function resignPersistedMedia(messages, context) {
   const targets = [];
   for (const m of messages) {
     const media = m && m.media;
     if (!media || typeof media !== "object") continue;
     const img = media.image;
     if (!img || typeof img !== "object") continue;
-    if (blobKeyForOid(img.url, oid)) {
+    if (blobKeyInContainer(img.url)) {
       targets.push({ get: () => img.url, set: (v) => { img.url = v; } });
     }
     if (Array.isArray(img.images)) {
       for (const it of img.images) {
-        if (it && typeof it === "object" && blobKeyForOid(it.imageUrl, oid)) {
+        if (it && typeof it === "object" && blobKeyInContainer(it.imageUrl)) {
           targets.push({ get: () => it.imageUrl, set: (v) => { it.imageUrl = v; } });
         }
       }
@@ -329,7 +335,7 @@
   const udk = await getUserDelegationKey(STORAGE_ACCOUNT, st, se);
 
   for (const t of targets) {
-    const blobKey = blobKeyForOid(t.get(), oid);
+    const blobKey = blobKeyInContainer(t.get());
     if (!blobKey) continue;
     const sas = readSasFromUdk(udk, STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey, st, se, mimeFromKey(blobKey));
     const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;
@@ -376,9 +382,30 @@
       [oid]
     );
 
-    // Explicit ownership scope: the shared Functions connection role bypasses RLS, so the
-    // by-id read MUST also filter created_by = the signed-in OID. A non-owned id yields 0 rows
-    // here and is then discriminated 403 (exists, not owned) vs 404 (absent) via the helper.
+    // SPW Phase 2b-3b: access is decided by the deployed SECURITY DEFINER classifier
+    // theo_conversation_access — 'owner' (the caller authored it) or 'member' (it is published to a
+    // project the caller participates in) grants read; NULL means no access. The shared Functions
+    // connection role bypasses RLS, so this explicit gate (not RLS) is the authorization boundary.
+    // NULL is then discriminated 403 (exists, no access) vs 404 (absent) via the existence helper.
+    const accessResult = await client.query(
+      `SELECT public.theo_conversation_access($1::uuid) AS role`,
+      [conversationId]
+    );
+    const accessRole = accessResult.rows[0] ? accessResult.rows[0].role : null; // 'owner' | 'member' | null
+
+    if (!accessRole) {
+      const existsResult = await client.query(
+        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
+        [conversationId]
+      );
+      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
+      return exists
+        ? send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403))
+        : send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
+    }
+
+    // Access confirmed (owner or published-project member). Read the conversation by id — no
+    // created_by filter, so a member reads a conversation they do not own but may access via publish.
     const convResult = await client.query(
       `
       SELECT
@@ -392,20 +419,14 @@
         updated_at,
         last_opened_at
       FROM public.theo_conversations
-      WHERE id = $1 AND created_by = $2
+      WHERE id = $1
       `,
-      [conversationId, oid]
+      [conversationId]
     );
 
     if (convResult.rowCount === 0) {
-      const existsResult = await client.query(
-        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
-        [conversationId]
-      );
-      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
-      return exists
-        ? send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403))
-        : send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
+      // Improbable race: access classified non-null but the row vanished. Treat as absent.
+      return send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
     }
 
     // Restore-on-reopen: stamp last_opened_at now that ownership is confirmed. Owner-scoped
@@ -422,6 +443,9 @@
       context.log.error("theo_get_conversation last_opened_at stamp failed (non-fatal)", stampErr);
     }
 
+    // SPW Phase 2b-3b: access to the conversation is already confirmed above, so read ALL messages
+    // in the thread (every author) — no created_by filter. In a published multi-party thread each
+    // message keeps its own created_by (the author), which is the attribution the FE renders.
     const messagesResult = await client.query(
       `
       SELECT
@@ -434,10 +458,10 @@
         media,
         created_at
       FROM public.theo_messages
-      WHERE conversation_id = $1 AND created_by = $2
+      WHERE conversation_id = $1
       ORDER BY seq ASC, created_at ASC
       `,
-      [conversationId, oid]
+      [conversationId]
     );
 
     const messages = messagesResult.rows;
@@ -445,7 +469,7 @@
     // (their stored SAS token has expired though the blob is durable). Best-effort: a signing
     // failure MUST NOT fail the read; the stored URLs are left intact and logged.
     try {
-      await resignPersistedMedia(messages, oid, context);
+      await resignPersistedMedia(messages, context);
     } catch (resignErr) {
       context.log.error("theo_get_conversation media re-sign failed (non-fatal)", resignErr);
     }
```

LIVE `theo_get_conversation/index.js` (Primary Reference, verbatim — the deployed bytes):
```js
const { Pool } = require("pg");
const crypto = require("crypto");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

// Chat Media Persistence — persisted image URLs point at our own Blob and were stored with a
// short-TTL read-SAS; the token expires (~60 min) while the blob is durable, so a reloaded
// chat's images 404. On read we re-mint a fresh read-SAS for each persisted image URL under
// this user's own storage prefix (one shared user-delegation key per reload; the shared-UDK
// idiom mirrors the deployed theo_find_image gallery path). Public URLs (Wikimedia/Commons,
// YouTube thumbnails) pass through unchanged. Best-effort: a signing failure never fails the read.
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";
const IMAGE_RESIGN_TTL_MINUTES = 60;

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

// ---- Managed-identity user-delegation SAS — ported VERBATIM from the deployed premium
// theo_create_attachment_upload (pure crypto + https, no @azure/storage-blob dependency; T12
// authorized-helper reuse). Used here to re-mint READ SAS on persisted images. ----
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const req = lib.request(
      {
        method: options.method || "GET",
        hostname: url.hostname,
        port: url.port ? Number(url.port) : undefined,
        path: url.pathname + url.search,
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error(
      "Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing). " +
      "Ensure System Assigned Managed Identity is enabled on the Function App."
    );
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) {
    throw new Error("Managed Identity token endpoint did not return access_token.");
  }
  return payload.access_token;
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function encodeBlobPath(blobKey) {
  return blobKey.split("/").map(encodeURIComponent).join("/");
}

function decodeXmlTag(xml, tagName) {
  const m = xml.match(new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, "i"));
  return m ? m[1] : null;
}

function toIsoNoMillis(d) {
  return new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z");
}

async function getUserDelegationKey(accountName, startTime, expiryTime) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const url = `https://${accountName}.blob.core.windows.net/?restype=service&comp=userdelegationkey`;
  const body =
    `<?xml version="1.0" encoding="utf-8"?>` +
    `<KeyInfo><Start>${xmlEscape(startTime)}</Start><Expiry>${xmlEscape(expiryTime)}</Expiry></KeyInfo>`;
  const r = await requestUrl(
    url,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-ms-version": "2022-11-02",
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(body, "utf8"),
      },
    },
    body
  );
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Get User Delegation Key failed (${r.statusCode}): ${r.body}`);
  }
  const udk = {
    signedOid: decodeXmlTag(r.body, "SignedOid"),
    signedTid: decodeXmlTag(r.body, "SignedTid"),
    signedStart: decodeXmlTag(r.body, "SignedStart"),
    signedExpiry: decodeXmlTag(r.body, "SignedExpiry"),
    signedService: decodeXmlTag(r.body, "SignedService"),
    signedVersion: decodeXmlTag(r.body, "SignedVersion"),
    value: decodeXmlTag(r.body, "Value"),
  };
  if (!udk.signedOid || !udk.signedTid || !udk.signedStart || !udk.signedExpiry || !udk.signedService || !udk.signedVersion || !udk.value) {
    throw new Error("Get User Delegation Key response was missing required fields.");
  }
  return udk;
}

function computeUserDelegationSignature(params, userDelegationKey) {
  // User-delegation SAS canonical string-to-sign for service version >= 2020-12-06
  // (we sign with sv = 2022-11-02). Field order is exact and positional — every field is
  // present (empty string when unused). The block after `sr` is:
  //   sst, ses (signedEncryptionScope, added in 2020-12-06), rscc, rscd, rsce, rscl, rsct.
  // Built as an explicit array (not hand-counted newlines) so the field positions are provable
  // against Azure's canonical (which Azure echoes verbatim in any AuthenticationFailed detail).
  const stringToSign = [
    params.sp,
    params.st,
    params.se,
    params.canonicalizedResource,
    userDelegationKey.signedOid,
    userDelegationKey.signedTid,
    userDelegationKey.signedStart,
    userDelegationKey.signedExpiry,
    userDelegationKey.signedService,
    userDelegationKey.signedVersion,
    "", // signedAuthorizedUserObjectId (saoid)
    "", // signedUnauthorizedUserObjectId (suoid)
    "", // signedCorrelationId (scid)
    "", // signedIP (sip)
    params.spr,
    params.sv,
    params.sr,
    "", // signedSnapshotTime (sst)
    "", // signedEncryptionScope (ses)
    "", // rscc (Cache-Control)
    "", // rscd (Content-Disposition)
    "", // rsce (Content-Encoding)
    "", // rscl (Content-Language)
    params.rsct || "", // rsct (Content-Type)
  ].join("\n");
  const key = Buffer.from(userDelegationKey.value, "base64");
  return crypto.createHmac("sha256", key).update(stringToSign, "utf8").digest("base64");
}

// ---- Re-sign step (this handler's addition) --------------------------------------------------
// Decode a persisted blob URL to its blobKey iff it targets OUR account+container AND lives under
// the requesting user's own images/<oid>/ prefix (defense-in-depth: never re-sign another user's
// blob). Non-blob / public URLs return null and are left unchanged.
function blobKeyForOid(rawUrl, oid) {
  if (typeof rawUrl !== "string" || !rawUrl) return null;
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }
  if (parsed.host !== `${STORAGE_ACCOUNT}.blob.core.windows.net`) return null;
  const prefix = `/${STORAGE_CONTAINER}/`;
  if (!parsed.pathname.startsWith(prefix)) return null;
  let blobKey;
  try {
    blobKey = parsed.pathname.slice(prefix.length).split("/").map(decodeURIComponent).join("/");
  } catch {
    return null;
  }
  if (!blobKey || !blobKey.startsWith(`images/${oid}/`)) return null;
  return blobKey;
}

function mimeFromKey(blobKey) {
  const ext = (blobKey.split(".").pop() || "").toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return null;
}

// Build a read-SAS query for one blob against a PRE-FETCHED shared UDK. A decomposition of the
// deployed premium buildUserDelegationSas (UDK fetched once, signed per blob) — the shared-UDK
// idiom mirrors the deployed theo_find_image gallery path so a reload signs N images with one key.
function readSasFromUdk(udk, accountName, containerName, blobKey, st, se, mimeType) {
  const sv = "2022-11-02";
  const sr = "b";
  const spr = "https";
  const permissions = "r";
  const canonicalizedResource = `/blob/${accountName}/${containerName}/${blobKey}`;
  const sig = computeUserDelegationSignature(
    { sp: permissions, st, se, canonicalizedResource, spr, sv, sr, rsct: mimeType || "" },
    udk
  );
  const qp = new URLSearchParams();
  qp.set("sp", permissions);
  qp.set("st", st);
  qp.set("se", se);
  qp.set("skoid", udk.signedOid);
  qp.set("sktid", udk.signedTid);
  qp.set("skt", udk.signedStart);
  qp.set("ske", udk.signedExpiry);
  qp.set("sks", udk.signedService);
  qp.set("skv", udk.signedVersion);
  qp.set("spr", spr);
  qp.set("sv", sv);
  qp.set("sr", sr);
  if (mimeType) qp.set("rsct", mimeType);
  qp.set("sig", sig);
  return qp.toString();
}

// Re-mint fresh read-SAS URLs for persisted blob images across all messages. Mutates media in
// place. One shared UDK per reload; only fetched when at least one blob image is present.
async function resignPersistedMedia(messages, oid, context) {
  const targets = [];
  for (const m of messages) {
    const media = m && m.media;
    if (!media || typeof media !== "object") continue;
    const img = media.image;
    if (!img || typeof img !== "object") continue;
    if (blobKeyForOid(img.url, oid)) {
      targets.push({ get: () => img.url, set: (v) => { img.url = v; } });
    }
    if (Array.isArray(img.images)) {
      for (const it of img.images) {
        if (it && typeof it === "object" && blobKeyForOid(it.imageUrl, oid)) {
          targets.push({ get: () => it.imageUrl, set: (v) => { it.imageUrl = v; } });
        }
      }
    }
  }
  if (targets.length === 0) return;

  const now = new Date();
  const start = new Date(now.getTime() - 5 * 60 * 1000);
  const expiry = new Date(now.getTime() + IMAGE_RESIGN_TTL_MINUTES * 60 * 1000);
  const st = toIsoNoMillis(start);
  const se = toIsoNoMillis(expiry);
  const udk = await getUserDelegationKey(STORAGE_ACCOUNT, st, se);

  for (const t of targets) {
    const blobKey = blobKeyForOid(t.get(), oid);
    if (!blobKey) continue;
    const sas = readSasFromUdk(udk, STORAGE_ACCOUNT, STORAGE_CONTAINER, blobKey, st, se, mimeFromKey(blobKey));
    const blobUrl = `https://${STORAGE_ACCOUNT}.blob.core.windows.net/${STORAGE_CONTAINER}/${encodeBlobPath(blobKey)}`;
    t.set(`${blobUrl}?${sas}`);
  }
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
        media,
        created_at
      FROM public.theo_messages
      WHERE conversation_id = $1 AND created_by = $2
      ORDER BY seq ASC, created_at ASC
      `,
      [conversationId, oid]
    );

    const messages = messagesResult.rows;
    // Chat Media Persistence — re-mint fresh read-SAS for persisted blob images before returning
    // (their stored SAS token has expired though the blob is durable). Best-effort: a signing
    // failure MUST NOT fail the read; the stored URLs are left intact and logged.
    try {
      await resignPersistedMedia(messages, oid, context);
    } catch (resignErr) {
      context.log.error("theo_get_conversation media re-sign failed (non-fatal)", resignErr);
    }

    return send(
      context,
      200,
      successBody({ conversation: convResult.rows[0], messages })
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
LIVE `theo_get_conversation/function.json` (verbatim; unchanged by this microstep):
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

## P6 — Repository & active-surface grounding
Pass-3 deploys the staged `handlers/theo_get_conversation.index.js` to func-premium via Kudu VFS (overwrite `/site/wwwroot/theo_get_conversation/index.js`), GET-back byte-diff, restart. The LIVE baseline (blob `149e080`) is retained in `primary-reference/` for rollback. Guardrails: no `reporting_*`; no DB change; `function.json`/other handlers untouched; the modified handler `node --check` clean. Verified via §CURLS. (The package also commits the modified handler + the LIVE baseline to `development` for provenance; func-premium is deployed by VFS, not run-from-package.)

## P7 — Risk / regression
- **Live-traffic handler — minimal, additive-authorization delta.** The change is confined to the read authorization: helper gate + drop two `created_by` filters + generalize the image prefix. Owner reads are unchanged behavior (an owner classifies `'owner'`, reads their own conversation + messages exactly as before; their own images match `images/<owner-oid>/`). No path removed; the 403/404 discrimination is byte-preserved.
- **No transcript over-exposure.** A member only ever reaches a conversation the deployed classifier says they may (owner OR published-in-their-project) — the same predicate as the §11 RLS. A non-participant still gets 403; absent still 404.
- **Image re-sign safety.** Generalized re-sign runs only post-access, is minted by the Function MI, and only touches `images/<uuid>/` blobs attached to the readable conversation's messages. A malformed/public URL still returns null (unchanged).
- **Rollback is instant.** Re-PUT the retained LIVE baseline via VFS + restart. `node --check` clean; no dependency/config change.
- **Determinism:** authenticated golden curls (§CURLS) assert owner-200, member-200 (sees owner's messages), non-participant-403, absent-404, unauth-401 post-deploy.

## P8 — VEP assembly
GCR + Rule Anchors open the pack; P1–P8 walked; Gap Register (G-1 deploy PRE-LAND; G-2 curls PRE-LAND; G-3 image re-sign INCLUDED; G-4 continue PROCEED); Primary Reference = LIVE handler inlined verbatim + the complete unified diff + staged AFTER handler (`node --check` clean); Kudu VFS §DEPLOY; golden curls §CURLS. Plan-only. On Codex APPROVAL, Claude Code executes Pass-3 (VFS PUT + GET-back diff + restart, run §CURLS), commits to `development`; then Phase 2b-3c (the continue path).

---

## §DEPLOY — Kudu VFS deploy (Claude Code; Golden Handler §5.5)
1. Acquire a management token (`az account get-access-token --resource https://management.core.windows.net/`); SCM host `vaultgpt-func-premium-a7agb7f5a8d8eeet.scm.uksouth-01.azurewebsites.net`.
2. **PUT** the staged `handlers/theo_get_conversation.index.js` → `/api/vfs/site/wwwroot/theo_get_conversation/index.js` (header `If-Match: *`).
3. **GET-back** the same VFS path and byte-diff against the staged file (MUST be identical) — the deploy-verification idiom.
4. `az functionapp restart -n vaultgpt-func-premium -g Vault-Tax`.
5. **Rollback:** PUT the retained LIVE baseline `primary-reference/theo_get_conversation.LIVE.index.js` (blob `149e080`) back + restart.

## §CURLS — authenticated golden curls (Claude Code; §5.5)
Auth: `az account get-access-token --resource <premium chat API audience>` (Bearer; never printed). Base `https://vaultgpt-func-premium-a7agb7f5a8d8eeet.uksouth-01.azurewebsites.net`. Edges:
- **Owner path (regression):** `GET theo_get_conversation?conversationId=<owned>` → **200** `{ conversation, messages }` (own messages, unchanged).
- **Member path (new):** as a project member, `GET ?conversationId=<a conversation the owner PUBLISHED to my project>` → **200** with the owner's messages present (attributed by `created_by`); the owner's persisted images carry fresh SAS.
- **Non-participant:** `GET ?conversationId=<published to a project I'm NOT in>` → **403**; a private (unpublished) non-owned conversation → **403**.
- **Absent:** random uuid → **404**; bad uuid → **400**; unauth → **401**.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of SPW Phase 2b-3b `theo_get_conversation` read-broadening Pass-1 Backend VEP (plan only).*
