# Theo — Shared Project Workspace Phase 2b-3d: `theo_get_conversation` per-message author exposure (func-premium) — Pass 1 Backend VEP

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; on APPROVAL Claude Code deploys the one modified handler to `vaultgpt-func-premium` via **Kudu VFS** (PUT + GET-back byte-diff + restart) and runs authenticated golden curls. **Shared Project Workspace, Phase 2b-3d (attribution author exposure — the G-3 follow-on that unblocks the Phase-2c attributed render).** The 2b-3b read broadening returns ALL messages of a published thread (every author), but the messages SELECT omits `created_by`, so the FE cannot label WHO wrote each turn. This microstep adds **one column** — `created_by` — to the `theo_get_conversation` messages SELECT, so each message row carries its author's Entra OID (the FE resolves it to a display name via the deployed People roster `theo_list_people`). For a private single-author conversation this is always the caller's own OID (no new information). No DB/DDL change; no FE change; no authorization change.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding parent (source baseline): `6ba2ab8a66dc3715651898aeeeab3ebffef885e1` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the forward submission note; all currency anchors below are tip-independent blob SHAs. The **Primary Reference is the LIVE deployed handler** pulled from func-premium Kudu VFS this turn (blob `610bb3ed2ea5579082a153bbe7b8bd6116f3ccd2` — the 2b-3b-deployed version).
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP; P1–P8 walked. Single-column read-additive microstep — NO DB/DDL change, NO authorization change (the access gate + conversation-wide message read are the deployed 2b-3b behavior; this adds only the `created_by` column to the returned message rows). The modified `theo_get_conversation` passes `node --check`. Deploy = Kudu VFS (Golden Handler §5.5); curl verification is Claude Code's job. Full Baseline per Conformance §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | -------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§8 Gap Register) | carried grounding (this program; blob-anchored) | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§4/§5) | carried grounding (this program; blob-anchored) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§1A gates) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary reference; §4 allowed deltas; §5.5 deploy + curl) | carried grounding (this program; blob-anchored) | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 5 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_get_conversation` message shape being extended) | `Grep("theo_get_conversation")` this turn | `9291b9eecade963514a9f3854bd7cbeb862d9e2f` |
| 6 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§11 publish substrate; `theo_messages.created_by` = the author) | carried grounding (this program; blob-anchored) | `abe14dc5d45b8a78b4d2b7303f0bd1257da120ec` |
| 7 | **Primary Reference (LIVE deployed handler + function.json)** — func-premium `theo_get_conversation` (2b-3b-deployed; pulled from Kudu VFS this turn) | `curl`(Kudu VFS GET) + `Read`(messages SELECT) + `node --check` this turn | `610bb3ed2ea5579082a153bbe7b8bd6116f3ccd2` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No write SQL / no migration. No FE change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register" | §P2.5 / GR Gap Register |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §P5 — Primary Reference = LIVE `theo_get_conversation` (inlined verbatim) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Curl verification" | §CURLS — Claude runs authenticated golden curls post-deploy |
| spec/THEO_API_SPEC.md | §2.1 | "messages: [{ id, seq, role, content, model, citations, media, created_at }]" | §P3 — the shape gains `created_by` (G-2 Role-C) |

---

## P1 — Feature identification
SPW **Phase 2b-3d (G-3)**: expose each message's author so the Phase-2c FE can render attribution ("who said what") in a shared multi-party thread. The 2b-3b read broadening already returns every author's messages; this adds the `created_by` column to the messages SELECT so the author OID travels to the client. Minimal, read-additive; no authorization or DB change.

## P2 — Architecture & boundary reconciliation
- **One column.** The only change is adding `created_by` to the `theo_get_conversation` messages SELECT column list. The row already comes from `theo_messages`; `created_by` is the deployed author column (set to `auth.uid()` on every insert — the attribution the multi-party render needs).
- **No authorization change.** Access is still gated by the deployed `theo_conversation_access` (2b-3b); the conversation + message reads are unchanged in scope. This microstep only widens the returned COLUMN set, not the row set.
- **Privacy.** `created_by` is an Entra OID. The caller already has access to the conversation (gated); in a shared thread the co-authors' OIDs are exactly the identities the FE resolves to names via the deployed `theo_list_people` roster. For a private conversation every message's `created_by` is the caller's own OID — no new information.
- **Boundary.** One handler on func-premium; no DB change; no `reporting_*`; no FE; deps unchanged.

## P2.5 / GR — Gap Register
Grounded against Governor §8 (`PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`).
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Deploy (Claude Code, Kudu VFS).** PUT the modified `theo_get_conversation/index.js` to func-premium; GET-back byte-diff; restart. `function.json` unchanged. Rollback = re-PUT the retained LIVE baseline (blob `610bb3e`). | **PRE-LAND** — §DEPLOY; Claude runs §CURLS after. |
| G-2 | **API-Spec §2.1 Role-C.** The §2.1 `theo_get_conversation` message shape gains `created_by`; the same Role-C also trues-up the §2.1 wording, which still says "owner-scoped" / "not-owned → 403" although 2b-3b broadened READ to owner OR published-project member (the stamp-on-open stays owner-scoped). | **PRE-LAND** — a short API-Spec Role-C follows deploy, before the 2c FE cites the field (T22). |
| G-3 | **Member project-RAG (unchanged from 2b-3c-ii G-4).** A member's turn does not yet get the shared project's indexed knowledge (needs a project access-check). | **PROCEED (future)** — separate governed VEP. |

No write SQL. No `reporting_*` change.

## P3 — Backend / contract grounding
The deployed contract (API Spec §2.1 — Rule Anchor): `GET /api/theo_get_conversation?conversationId=<uuid>` → `{ conversation, messages: [{ id, seq, role, content, model, citations, media, created_at }] }`. This microstep adds `created_by` to each message object: `{ id, seq, role, created_by, content, model, citations, media, created_at }`. The API-Spec §2.1 Role-C (G-2) records the new field + trues-up the read-scope wording (2b-3b) post-deploy. Errors/behavior otherwise unchanged.

## P4 — Schema definition
None. `theo_messages.created_by` is a deployed column (the author, `auth.uid()` on insert). This microstep only returns it.

## P5 — Component reference grounding (Primary Reference + handler delta)
**Primary Reference (Golden Handler §2 — exactly one deployed handler + function.json, inlined verbatim):** the **LIVE** `theo_get_conversation` on func-premium (the 2b-3b-deployed version; blob `610bb3e`), pulled from Kudu VFS this turn. The **ALLOWED DELTA (§4 — the RLS-scoped query shape)** is exactly the unified diff below (a comment + the `created_by` column in the messages SELECT). Staged AFTER file: `handlers/theo_get_conversation.index.js` (`node --check` clean). `function.json` unchanged.

Unified diff (LIVE → staged), the complete change set:
```diff
@@ -447,12 +447,16 @@
     // SPW Phase 2b-3b: access to the conversation is already confirmed above, so read ALL messages
     // in the thread (every author) — no created_by filter. In a published multi-party thread each
     // message keeps its own created_by (the author), which is the attribution the FE renders.
+    // SPW Phase 2b-3d: created_by (the author Entra OID) is RETURNED per message so the FE can label
+    // who wrote each turn in a shared thread (resolved to a display name via the People roster). For a
+    // private single-author conversation this is always the caller's own OID (no new information).
     const messagesResult = await client.query(
       `
       SELECT
         id,
         seq,
         role,
+        created_by,
         content,
         model,
         citations,
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
// the media prefix `images/<ownerOid>/` (ownerOid = ANY Entra object id, not necessarily the caller).
// SPW Phase 2b-3b: a project member viewing a PUBLISHED conversation must see the owner's + co-authors'
// persisted images, so this is no longer restricted to the caller's own prefix. Safe because the
// re-sign is minted by the Function's managed identity and resignPersistedMedia runs ONLY after
// theo_conversation_access has confirmed the caller may read THIS conversation — access to the
// conversation (whose messages carry this media) is the authorization boundary. Non-blob / public
// URLs, or anything outside images/<uuid>/, return null and are left unchanged.
function blobKeyInContainer(rawUrl) {
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
  // images/<ownerOid>/<file...> — ownerOid is a uuid-shaped Entra object id (any author).
  if (!/^images\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/.+/i.test(blobKey)) return null;
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
async function resignPersistedMedia(messages, context) {
  const targets = [];
  for (const m of messages) {
    const media = m && m.media;
    if (!media || typeof media !== "object") continue;
    const img = media.image;
    if (!img || typeof img !== "object") continue;
    if (blobKeyInContainer(img.url)) {
      targets.push({ get: () => img.url, set: (v) => { img.url = v; } });
    }
    if (Array.isArray(img.images)) {
      for (const it of img.images) {
        if (it && typeof it === "object" && blobKeyInContainer(it.imageUrl)) {
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
    const blobKey = blobKeyInContainer(t.get());
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

    // SPW Phase 2b-3b: access is decided by the deployed SECURITY DEFINER classifier
    // theo_conversation_access — 'owner' (the caller authored it) or 'member' (it is published to a
    // project the caller participates in) grants read; NULL means no access. The shared Functions
    // connection role bypasses RLS, so this explicit gate (not RLS) is the authorization boundary.
    // NULL is then discriminated 403 (exists, no access) vs 404 (absent) via the existence helper.
    const accessResult = await client.query(
      `SELECT public.theo_conversation_access($1::uuid) AS role`,
      [conversationId]
    );
    const accessRole = accessResult.rows[0] ? accessResult.rows[0].role : null; // 'owner' | 'member' | null

    if (!accessRole) {
      const existsResult = await client.query(
        `SELECT public.theo_conversation_exists_unscoped($1::uuid) AS e`,
        [conversationId]
      );
      const exists = existsResult.rows[0] && existsResult.rows[0].e === true;
      return exists
        ? send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403))
        : send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
    }

    // Access confirmed (owner or published-project member). Read the conversation by id — no
    // created_by filter, so a member reads a conversation they do not own but may access via publish.
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
      WHERE id = $1
      `,
      [conversationId]
    );

    if (convResult.rowCount === 0) {
      // Improbable race: access classified non-null but the row vanished. Treat as absent.
      return send(context, 404, errorBody("NOT_FOUND", "Conversation not found.", 404));
    }

    // Restore-on-reopen: stamp last_opened_at now that read access is confirmed. The stamp stays
    // owner-scoped (created_by = the signed-in OID; the deployed theo_conversation_update_own policy
    // permits it), so a member open updates 0 rows — a correct no-op that never touches the owner's
    // Recents ordering. Best-effort — a stamp failure MUST NOT fail the read, so it is caught and logged only. The
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

    // SPW Phase 2b-3b: access to the conversation is already confirmed above, so read ALL messages
    // in the thread (every author) — no created_by filter. In a published multi-party thread each
    // message keeps its own created_by (the author), which is the attribution the FE renders.
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
      WHERE conversation_id = $1
      ORDER BY seq ASC, created_at ASC
      `,
      [conversationId]
    );

    const messages = messagesResult.rows;
    // Chat Media Persistence — re-mint fresh read-SAS for persisted blob images before returning
    // (their stored SAS token has expired though the blob is durable). Best-effort: a signing
    // failure MUST NOT fail the read; the stored URLs are left intact and logged.
    try {
      await resignPersistedMedia(messages, context);
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

## P6 — Repository & active-surface grounding
Pass-3 deploys the staged `handlers/theo_get_conversation.index.js` to func-premium via Kudu VFS (overwrite `/site/wwwroot/theo_get_conversation/index.js`), GET-back byte-diff, restart. The LIVE baseline (blob `610bb3e`) is retained in `primary-reference/` for rollback. Guardrails: no `reporting_*`; no DB change; `function.json`/other handlers untouched; modified handler `node --check` clean. Verified via §CURLS.

## P7 — Risk / regression
- **Read-additive, one column.** No row-set change, no authorization change, no write. Every existing client field is byte-preserved; clients that ignore unknown fields are unaffected.
- **Privacy bounded.** `created_by` is exposed only for a conversation the caller may already read (access-gated); for a private conversation it is the caller's own OID.
- **Rollback is instant.** Re-PUT the retained LIVE baseline via VFS + restart. `node --check` clean; no dependency/config change.
- **Determinism:** authenticated golden curls (§CURLS) assert owner-200 with `created_by` present on each message row post-deploy.

## P8 — VEP assembly
GCR + Rule Anchors open the pack; P1–P8 walked; Gap Register (G-1 deploy PRE-LAND; G-2 API-Spec Role-C PRE-LAND; G-3 project-RAG PROCEED); Primary Reference = LIVE handler inlined verbatim + the complete unified diff + staged AFTER handler (`node --check` clean); Kudu VFS §DEPLOY; golden curls §CURLS. Plan-only. On Codex APPROVAL, Claude Code executes Pass-3 (VFS PUT + GET-back diff + restart, run §CURLS), commits to `development`; then the API-Spec §2.1 Role-C (G-2).

---

## §DEPLOY — Kudu VFS deploy (Claude Code; Golden Handler §5.5)
1. Management token (`az account get-access-token --resource https://management.core.windows.net/`); SCM host `vaultgpt-func-premium-a7agb7f5a8d8eeet.scm.uksouth-01.azurewebsites.net`.
2. **PUT** the staged `handlers/theo_get_conversation.index.js` → `/api/vfs/site/wwwroot/theo_get_conversation/index.js` (`If-Match: *`).
3. **GET-back** the same VFS path and byte-diff against the staged file (MUST be identical).
4. `az functionapp restart -n vaultgpt-func-premium -g Vault-Tax`.
5. **Rollback:** PUT the retained LIVE baseline `primary-reference/theo_get_conversation.LIVE.index.js` (blob `610bb3e`) back + restart.

## §CURLS — authenticated golden curls (Claude Code; §5.5)
Auth: `az account get-access-token --resource api://4e1a1e31-5c20-4480-99e4-098901707d9e` (Bearer; never printed). Base `https://vaultgpt-func-premium-a7agb7f5a8d8eeet.uksouth-01.azurewebsites.net`. Edges:
- **Owner path (regression + new field):** `GET theo_get_conversation?conversationId=<owned>` → **200**; each object in `messages[]` now carries `created_by` (the author OID) alongside the existing fields.
- **Error edges (regression):** absent → 404; bad uuid → 400; unauth → 401.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of SPW Phase 2b-3d `theo_get_conversation` author-exposure Pass-1 Backend VEP (plan only).*
