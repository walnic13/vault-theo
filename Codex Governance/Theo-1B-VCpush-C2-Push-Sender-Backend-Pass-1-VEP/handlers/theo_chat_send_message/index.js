const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");
const crypto = require("crypto"); // VCpush-C2: self-contained Web Push (no npm dependency; HF-T5 pattern)
const https = require("https");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload.

// VC-9: chat attachments. Supported types + per-class caps MIRROR the deployed theo_create_attachment_upload
// allow-list (the upload SAS is only ever issued for these types, so send accepts exactly the same set).
const NATIVE_MAX_BYTES = 10 * 1024 * 1024;
const EXTRACT_MAX_BYTES = 50 * 1024 * 1024;
const ATTACHMENT_MAX_BYTES = {
  "application/pdf": NATIVE_MAX_BYTES,
  "image/png": NATIVE_MAX_BYTES,
  "image/jpeg": NATIVE_MAX_BYTES,
  "image/webp": NATIVE_MAX_BYTES,
  "image/gif": NATIVE_MAX_BYTES,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": EXTRACT_MAX_BYTES,
  "application/vnd.ms-excel": EXTRACT_MAX_BYTES,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": EXTRACT_MAX_BYTES,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": EXTRACT_MAX_BYTES,
  "text/csv": EXTRACT_MAX_BYTES,
  "text/plain": EXTRACT_MAX_BYTES,
};
const ALLOWED_ATTACHMENT_TYPES = Object.keys(ATTACHMENT_MAX_BYTES);
const STORAGE_ACCOUNT = process.env.THEO_BLOB_ACCOUNT || "vaultgptstorage01";
const STORAGE_CONTAINER = process.env.THEO_BLOB_CONTAINER || "theo-content";

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
// VC-9: normalize/clean the client-declared attachment metadata (filename is cosmetic; content-type gates
// the allow-list; byte size is NOT trusted from the client — it is read authoritatively from the blob).
function normalizeContentType(ct) { return String(ct || "").split(";")[0].trim().toLowerCase(); }
function cleanFileName(name) {
  if (name === undefined || name === null) return null;
  const raw = String(name).trim();
  if (!raw.length) return null;
  const cleaned = raw.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned.slice(0, 180) : null;
}
// VC-9: shape the attachment projection returned/published — the raw blob_path is NEVER exposed (a read SAS
// is issued per-request by theo_chat_attachment_download after a membership check).
function attachmentPreview(row) {
  if (!row || row.attachment_blob_path == null) return null;
  return {
    filename: row.attachment_filename,
    content_type: row.attachment_content_type,
    byte_size: row.attachment_byte_size == null ? null : Number(row.attachment_byte_size),
  };
}

// VC-9: managed-identity blob HEAD (mirrors the deployed theo_finalize_attachment technique) — reads the
// AUTHORITATIVE byte size + confirms the blob exists. Pure https + MI token; no @azure/storage-blob dep.
function requestUrl(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require("http");
    const https = require("https");
    const url = new URL(urlStr);
    const lib = url.protocol === "http:" ? http : https;
    const rq = lib.request(
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
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, headers: res.headers || {}, body: data }); });
      }
    );
    rq.on("error", reject);
    if (body) rq.write(body);
    rq.end();
  });
}
async function getManagedIdentityAccessToken(resource) {
  const identityEndpoint = process.env.IDENTITY_ENDPOINT;
  const identityHeader = process.env.IDENTITY_HEADER;
  if (!identityEndpoint || !identityHeader) {
    throw new Error("Managed Identity endpoint not available (IDENTITY_ENDPOINT/IDENTITY_HEADER missing).");
  }
  const tokenUrl = `${identityEndpoint}?resource=${encodeURIComponent(resource)}&api-version=2019-08-01`;
  const r = await requestUrl(tokenUrl, { method: "GET", headers: { "X-IDENTITY-HEADER": identityHeader } });
  if (r.statusCode < 200 || r.statusCode >= 300) {
    throw new Error(`Managed Identity token endpoint failed (${r.statusCode}): ${r.body}`);
  }
  const payload = JSON.parse(r.body || "{}");
  if (!payload.access_token) throw new Error("Managed Identity token endpoint did not return access_token.");
  return payload.access_token;
}
function encodeBlobPath(blobKey) { return blobKey.split("/").map(encodeURIComponent).join("/"); }
function blobUrlFor(accountName, containerName, blobKey) {
  return `https://${accountName}.blob.core.windows.net/${containerName}/${encodeBlobPath(blobKey)}`;
}
// HEAD the blob → AUTHORITATIVE byte size (+ stored content-type). Returns null when absent (not uploaded).
async function getBlobProperties(accountName, containerName, blobKey) {
  const accessToken = await getManagedIdentityAccessToken("https://storage.azure.com/");
  const r = await requestUrl(blobUrlFor(accountName, containerName, blobKey), {
    method: "HEAD",
    headers: { Authorization: `Bearer ${accessToken}`, "x-ms-version": "2022-11-02" },
  });
  if (r.statusCode === 404) return null;
  if (r.statusCode < 200 || r.statusCode >= 300) throw new Error(`HEAD blob failed (${r.statusCode})`);
  const len = Number(r.headers["content-length"]);
  return { contentLength: Number.isFinite(len) ? len : 0, contentType: r.headers["content-type"] || null };
}

// VCpush-C2: self-contained Web Push (VAPID ES256 + RFC 8291 aes128gcm) with Node built-ins only —
// no `web-push` npm dependency (HF-T5 no-dependency precedent). The VAPID key is built LAZILY (only on
// first send) so a missing VAPID_* env var can never break handler load.
const _pushB64url = (buf) => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const _pushFromB64url = (s) => Buffer.from(String(s).replace(/-/g, "+").replace(/_/g, "/"), "base64");
let _vapidPrivateKey = null;
function _getVapidPrivateKey() {
  if (_vapidPrivateKey) return _vapidPrivateKey;
  const pubRaw = _pushFromB64url(process.env.VAPID_PUBLIC_KEY); // 0x04 || X(32) || Y(32)
  _vapidPrivateKey = crypto.createPrivateKey({
    key: {
      kty: "EC", crv: "P-256", d: process.env.VAPID_PRIVATE_KEY,
      x: _pushB64url(pubRaw.subarray(1, 33)), y: _pushB64url(pubRaw.subarray(33, 65)),
    },
    format: "jwk",
  });
  return _vapidPrivateKey;
}
function _buildVapidAuth(endpoint) {
  const header = _pushB64url(Buffer.from(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const payload = _pushB64url(Buffer.from(JSON.stringify({
    aud: new URL(endpoint).origin,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
    sub: process.env.VAPID_SUBJECT,
  })));
  const signingInput = header + "." + payload;
  const sig = crypto.sign("sha256", Buffer.from(signingInput), { key: _getVapidPrivateKey(), dsaEncoding: "ieee-p1363" });
  return "vapid t=" + signingInput + "." + _pushB64url(sig) + ", k=" + process.env.VAPID_PUBLIC_KEY;
}
function _encryptPushPayload(plaintext, uaPublic, authSecret) {
  const ecdh = crypto.createECDH("prime256v1");
  const asPublic = ecdh.generateKeys();
  const ecdhSecret = ecdh.computeSecret(uaPublic);
  const salt = crypto.randomBytes(16);
  const keyInfo = Buffer.concat([Buffer.from("WebPush: info\0", "utf8"), uaPublic, asPublic]);
  const ikm = Buffer.from(crypto.hkdfSync("sha256", ecdhSecret, authSecret, keyInfo, 32));
  const cek = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: aes128gcm\0", "utf8"), 16));
  const nonce = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: nonce\0", "utf8"), 12));
  const record = Buffer.concat([Buffer.from(plaintext, "utf8"), Buffer.from([0x02])]);
  const cipher = crypto.createCipheriv("aes-128-gcm", cek, nonce);
  const ct = Buffer.concat([cipher.update(record), cipher.final(), cipher.getAuthTag()]);
  const rs = Buffer.alloc(4); rs.writeUInt32BE(4096, 0);
  return Buffer.concat([salt, rs, Buffer.from([asPublic.length]), asPublic, ct]);
}
// Resolves the statusCode on 2xx; REJECTS with err.statusCode on non-2xx so the 410/404 prune fires.
function sendWebPush(sub, payloadJson) {
  return new Promise((resolve, reject) => {
    let payloadBody;
    try { payloadBody = _encryptPushPayload(payloadJson, _pushFromB64url(sub.p256dh), _pushFromB64url(sub.auth)); }
    catch (encErr) { return reject(encErr); }
    let u;
    try { u = new URL(sub.endpoint); } catch (urlErr) { return reject(urlErr); }
    const r = https.request(
      {
        method: "POST", hostname: u.hostname, path: u.pathname + u.search, port: u.port || 443, timeout: 4000,
        headers: {
          Authorization: _buildVapidAuth(sub.endpoint),
          "Content-Encoding": "aes128gcm",
          "Content-Type": "application/octet-stream",
          "Content-Length": payloadBody.length,
          TTL: 60,
        },
      },
      (res) => {
        res.on("data", () => {});
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) return resolve(res.statusCode);
          const err = new Error("push_http_" + res.statusCode);
          err.statusCode = res.statusCode;
          reject(err);
        });
      }
    );
    r.on("timeout", () => r.destroy(new Error("push_socket_timeout")));
    r.on("error", reject);
    r.write(payloadBody);
    r.end();
  });
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

  // VC-9: optional attachment descriptor { blob_path, filename, content_type }. Structural validation here
  // (deterministic 400 before any SQL); ownership + existence + authoritative size are enforced below.
  // byte_size is intentionally NOT accepted from the client (read from the blob via HEAD).
  let attachment = null;
  if (body.attachment != null) {
    if (typeof body.attachment !== "object" || Array.isArray(body.attachment)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment' must be an object when provided.", 400));
    }
    const blobPath = typeof body.attachment.blob_path === "string" ? body.attachment.blob_path.trim() : "";
    const fname = cleanFileName(body.attachment.filename);
    const ctype = normalizeContentType(body.attachment.content_type);
    // Ownership: a caller may only attach a blob THEY uploaded — the upload SAS writes the deterministic
    // owner-scoped key `attachments/<oid>/<uuid>` (theo_create_attachment_upload). Require exactly that
    // shape: the caller's own OID segment + a UUID id (no extra path segments, no traversal, no cross-OID).
    const ownPrefix = `attachments/${oid}/`;
    const blobSuffix = blobPath.startsWith(ownPrefix) ? blobPath.slice(ownPrefix.length) : null;
    if (blobSuffix == null || !isUuid(blobSuffix)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment.blob_path' is invalid or not owned by the caller.", 400));
    }
    if (!fname) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'attachment.filename' is required and must be a non-empty string.", 400));
    }
    if (!ATTACHMENT_MAX_BYTES[ctype]) {
      return send(context, 400, errorBody("UNSUPPORTED_MEDIA_TYPE", `Field 'attachment.content_type' must be one of: ${ALLOWED_ATTACHMENT_TYPES.join(", ")}.`, 400));
    }
    attachment = { blobPath, filename: fname, contentType: ctype };
  }

  // VC-9: body is now an optional caption when an attachment is present; otherwise it is still required.
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text && !attachment) {
    return send(context, 400, errorBody("INVALID_REQUEST", "A message must have a non-empty 'body' or an 'attachment'.", 400));
  }
  if (text.length > MAX_BODY) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Message exceeds ${MAX_BODY} characters.`, 400));
  }
  const bodyParam = text.length ? text : null; // attachment-only message persists body NULL (allowed by the amended CHECK)

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

    // VC-9: for an attachment message, HEAD the blob (managed identity) to confirm it exists and to read the
    // AUTHORITATIVE byte size (client-claimed size is never trusted); enforce the per-type cap. Runs only
    // after auth + membership, so an unauthenticated/non-member caller never triggers a blob HEAD.
    let attachmentByteSize = null;
    if (attachment) {
      const props = await getBlobProperties(STORAGE_ACCOUNT, STORAGE_CONTAINER, attachment.blobPath);
      if (props == null) {
        throw buildKnownError("ATTACHMENT_NOT_FOUND", "The attachment has not been uploaded.", 400);
      }
      const cap = ATTACHMENT_MAX_BYTES[attachment.contentType];
      if (props.contentLength > cap) {
        throw buildKnownError("PAYLOAD_TOO_LARGE", `Attachment exceeds the ${Math.floor(cap / (1024 * 1024))} MB limit for its type.`, 400);
      }
      attachmentByteSize = props.contentLength;
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
    // VC-9: carry the attachment columns (all NULL for a normal message; the coherence CHECK enforces the
    // all-or-nothing shape).
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages
            (thread_id, seq, sender_oid, body, reply_to_message_id,
             attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4, $5, $6, $7, $8
          FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id,
                    attachment_blob_path, attachment_filename, attachment_content_type, attachment_byte_size
          `,
          [
            threadId, oid, bodyParam, replyToId,
            attachment ? attachment.blobPath : null,
            attachment ? attachment.filename : null,
            attachment ? attachment.contentType : null,
            attachment ? attachmentByteSize : null,
          ]
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
    // VC-9: project the attachment (filename/content_type/byte_size) or null; the raw blob_path is never
    // exposed (a read SAS is issued per-request by theo_chat_attachment_download). Then drop the raw column
    // from the returned/published row so it can never leak.
    saved.attachment = attachmentPreview(saved);
    delete saved.attachment_blob_path;
    delete saved.attachment_filename;
    delete saved.attachment_content_type;
    delete saved.attachment_byte_size;
    // VC-10: a normally-sent message is never a GIF — carry gif:null for shape parity with list_messages /
    // theo_chat_send_gif (GIF messages are created only by theo_chat_send_gif).
    saved.gif = null;

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

    // VCpush-C2: best-effort Web Push fan-out to recipients' registered devices. FULLY isolated —
    // any failure/timeout is swallowed so the 201 + persist + Web PubSub publish above are unaffected.
    // Recipients + membership are enforced INSIDE theo_chat_get_push_subscriptions_for_thread
    // (SECURITY DEFINER; caller passes only the thread id). Each send is hard-bounded (Promise.race
    // + the https socket timeout); a 410/404 prunes the dead endpoint.
    try {
      if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
        const subsRes = await client.query(
          `SELECT created_by, endpoint, p256dh, auth FROM public.theo_chat_get_push_subscriptions_for_thread($1)`,
          [threadId]
        );
        if (subsRes.rows.length > 0) {
          const meta = await client.query(`SELECT kind, name FROM public.theo_chat_threads WHERE id = $1`, [threadId]);
          const tKind = meta.rows[0] ? meta.rows[0].kind : null;
          const tName = meta.rows[0] ? meta.rows[0].name : null;
          const senderName = getClaimValue(principal, [
            "name",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
          ]) || "New message";
          const title = tKind === "channel" && tName ? tName : senderName;
          const src = typeof saved.body === "string" ? saved.body : "";
          const bodyPreview = src.length > 140 ? src.slice(0, 137) + "..." : (src || "Sent you a message");
          const base = process.env.VAULT_ORIGIN_BASE_URL || "";
          const payloadJson = JSON.stringify({ title, body: bodyPreview, url: base + "/?chat=" + threadId, tag: threadId });
          const PUSH_SEND_TIMEOUT_MS = 5000;
          const withTimeout = (p, ms) => Promise.race([
            p,
            new Promise((_, reject) => setTimeout(() => reject(new Error("push_send_timeout")), ms)),
          ]);
          await Promise.allSettled(
            subsRes.rows.map(async (s) => {
              try {
                await withTimeout(sendWebPush(s, payloadJson), PUSH_SEND_TIMEOUT_MS);
              } catch (e) {
                if (e && (e.statusCode === 410 || e.statusCode === 404)) {
                  await client.query(`SELECT public.theo_chat_prune_push_subscription($1)`, [s.endpoint]).catch(() => {});
                } else {
                  context.log.error("theo_chat_send_message push send (non-fatal) failed", e && (e.statusCode || e.message));
                }
              }
            })
          );
        }
      }
    } catch (pushErr) {
      context.log.error("theo_chat_send_message push fan-out (non-fatal) failed", pushErr);
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
