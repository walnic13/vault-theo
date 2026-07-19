const crypto = require("crypto");
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

// dms_notifications (Tier DMS-Push MS1) — the public Microsoft Graph change-notification webhook for
// the DMS live mirror. TWO jobs:
//   1) VALIDATION HANDSHAKE: on subscription create/renew, Graph calls this endpoint with
//      ?validationToken=… and requires a 200 text/plain echo of the (decoded) token within ~10s.
//   2) NOTIFICATION: Graph POSTs { value: [ { subscriptionId, clientState, … } ] } when a drive
//      changes. We AUTHENTICATE each notification by constant-time-comparing clientState against the
//      stored secret for that subscription, resolve the drive, and fan a TRIGGER-ONLY signal
//      ({ type:"dms_changed", drive_id }) over the chat Web PubSub to the "dms-changes" group.
//      NO file data leaves here — each client reacts by pulling its OWN delegated dms_delta
//      (per-user SharePoint trimming preserved in vault-dms). Anonymous route: auth IS the clientState
//      secret (Graph can't present an EasyAuth identity).
const HUB = process.env.WEBPUBSUB_HUB; // MUST match the deployed chat hub (theo_chat_send_message)
const DMS_GROUP = "dms-changes";

let pool = null;
function getPool() {
  // EXACT match to the deployed func-chat handlers (theo_chat_send_message / theo_distill_memory):
  // POSTGRES_CONNECTION_STRING + ssl.rejectUnauthorized:false. A different env/ssl would fail to connect.
  if (!pool) pool = new Pool({ connectionString: process.env.POSTGRES_CONNECTION_STRING, ssl: { rejectUnauthorized: false }, max: 2 });
  return pool;
}

function parseJsonSafe(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// Constant-time secret compare (avoids leaking match length/timing). Unequal lengths → false.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  try { return crypto.timingSafeEqual(ba, bb); } catch { return false; }
}

module.exports = async function (context, req) {
  // 1) Validation handshake — Graph sends ?validationToken=… (URL-decoded by the query parser).
  //    Respond 200 text/plain with the raw token. Applies to both GET and POST validation probes.
  const validationToken =
    (req.query && (req.query.validationToken || req.query.validationtoken)) || null;
  if (validationToken) {
    context.res = { status: 200, headers: { "Content-Type": "text/plain" }, body: String(validationToken) };
    return;
  }

  // 2) Notification batch. ACK fast; do the DB + fan-out inline but keep it lean. On any internal
  //    error we still return 202 (Graph retries are undesirable for a best-effort live-mirror ping).
  const payload = parseJsonSafe(req.rawBody || (typeof req.body === "string" ? req.body : JSON.stringify(req.body || {})));
  const notifications = payload && Array.isArray(payload.value) ? payload.value : [];

  try {
    const db = getPool();
    const drivesToSignal = new Set();

    for (const n of notifications) {
      if (!n || typeof n.subscriptionId !== "string") continue;
      // Authenticate: the stored client_state for this subscription MUST match the one Graph echoes.
      let row;
      try {
        const r = await db.query("SELECT subscription_id, drive_id, client_state FROM public.dms_sub_get($1)", [n.subscriptionId]);
        row = r.rows[0];
      } catch (e) {
        context.log.warn("dms_notifications: sub lookup failed", e);
        continue;
      }
      if (!row) continue; // unknown subscription — ignore (do not trust an unrecognised sender)
      if (!safeEqual(typeof n.clientState === "string" ? n.clientState : "", row.client_state)) {
        context.log.warn("dms_notifications: clientState mismatch for", n.subscriptionId);
        continue; // failed auth — ignore this notification
      }
      drivesToSignal.add(row.drive_id);
    }

    if (drivesToSignal.size > 0 && HUB && process.env.WebPubSubConnectionString) {
      const svc = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
      for (const driveId of drivesToSignal) {
        // Trigger-only: drive_id, no names/content/metadata. Clients viewing this drive pull their
        // own delegated dms_delta; others ignore it.
        await svc.group(DMS_GROUP).sendToAll({ type: "dms_changed", drive_id: driveId });
      }
    }
  } catch (err) {
    context.log.error("dms_notifications processing failed", err);
  }

  context.res = { status: 202, headers: { "Content-Type": "application/json" }, body: { ok: true } };
};
