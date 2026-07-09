# Theo 1B — VCpush C1: Web Push Subscription Storage (Backend, Pass 1 VEP, Plan-Only)

Plan-only Verified Evidence Pack. No handler/migration files are written into the app, no deploy, no commit. This pack delivers the storage substrate + two CRUD handlers for Web Push subscriptions (Apps Phase C, package C1). The sender (C2) and the FE (C3) are out of scope.

**Revision note (C1 v3):** single-owner-per-endpoint via SECURITY DEFINER claim; addresses Codex Pass 2 G4-v2 leak finding. `endpoint` is GLOBALLY `UNIQUE (endpoint)` again, `save` now calls the `SECURITY DEFINER theo_chat_claim_push_subscription` (created_by := `auth.uid()`, never a client value) which atomically reassigns an endpoint to the authenticated caller — so at most one owner ever holds an endpoint and the shared-browser cross-user push leak cannot occur. (v2's per-owner `UNIQUE(created_by, endpoint)` allowed two owners for one still-valid endpoint → leak.) The complete runnable migration also ships as `migration_theo_chat_push_subscriptions.sql` in this package.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `4cea669c7501192194518bf9afbbb47667bc1bd5` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8

Currency anchors below are the git blob SHA of each cited file at HEAD (verifiable via `git cat-file -p <sha>`); the mechanical currency check (§8) is satisfied by literal-substring Rule Anchors at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§2 Local Grounding Workflow; §4 Schema Reality Lock; §6 SQL discipline; §8 VEP Format + Gap Register) | `Grep(pattern="^## §\|VEP Format\|Gap Register\|Never-Guess", path=governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md)` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A P-track spine; §5 Rule Anchor Table; §6 triggers) | `Read(governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md, offset=47, limit=55)` + `Read(offset=104, limit=90)` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 Primary Reference; §4 Allowed Deltas; §5 Structural Mirror + Golden SQL/Curl; §5.5 deploy) | `Grep(pattern="Primary Reference\|Structural Mirror\|Allowed Delta", path=governance/THEO_GOLDEN_HANDLER_STANDARD.md)` this turn | `865afc9fab567fd2ace06f4c26b9ee0203be38b8` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1A role vocabulary; §1B Decision Register; §1E/DR-T7 deploy exception) | `Grep(pattern="Role-C\|role vocab\|Claude Code\|Codex", path=governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md)` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 5 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 conventions; §2 RLS baseline; §5 ownership DDL idiom; §6 B7a; §7 B8a; §8 VC-1) | `Read(spec/THEO_AZURE_POSTGRES_SCHEMA.md, offset=10, limit=25)` + `Grep` §-map this turn | `f916ba72cd668f311e1df92b0929d49708dd8f4b` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§1 route naming; §2.10 in-Vault chat / func-chat contract surface; §3 boundary) | `Grep(pattern="route\|theo_chat_\|convention\|func-chat", path=spec/THEO_API_SPEC.md)` this turn | `b6324c7901ba1a42a17d7649c8e6497920325c92` |
| 7 | Theo Tool Manifest — `spec/THEO_TOOL_MANIFEST.md` (dispatch registry; `reporting_*`-only) | `Grep(pattern="theo_chat\|register\|dispatch\|reporting", path=spec/THEO_TOOL_MANIFEST.md)` this turn | `8af2183755b6e298a4911c3fc75886a56cdea892` |
| 8 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (feature-identification search for Phase C / push) | `Grep(pattern="push\|notif\|phase c\|vapid\|subscription", path=governance/THEO_PHASE_1B_BACKEND_PLAN.md)` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 9 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 repo boundary; §5 theo_ schema + RLS baseline) | referenced via Schema §1/§2 (architecture §5.1/§5.2 truth pointer) read this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 10 | Primary Reference — deployed `theo_chat_send_message` handler `Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_send_message.index.js` | `Read(...theo_chat_send_message.index.js)` this turn | `a8cafbcf9e411cde5b2da304fcd19b7f771ef7b1` |
| 11 | Primary Reference — deployed `theo_chat_send_message.function.json` `Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_send_message.function.json` | `Read(...theo_chat_send_message.function.json)` this turn | `0284d265cd81bec4c34b5513d46c41b7ba6601ff` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | ------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form:" |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive Claude Code or Codex turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "The Gap Register vocabulary is closed:" |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.2 | "Migration files carry no top-level transaction control" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "a SECURITY DEFINER existence helper is explicitly invoked for 403/404 discrimination" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8 | "narrowly-scoped write-path helper" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "Canonical ownership column: **`created_by text NOT NULL`**" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Default family: ownership-based (`created_by = auth.uid()`)" |
| spec/THEO_API_SPEC.md | §1 | "Route naming: `theo_<operation>_<entity>`" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1A | "reviewer (Pass 2) and Role-C inline executor" |

Sub-phase Track rationale: **P8 (VEP assembly)** is the established convention for a full backend plan VEP in this repo (47 prior `Theo_1B_*` VEPs declare P8; 3 declare P5). The turn nonetheless walks the full P1–P8 spine below (§4A.1); the Rule Anchor Table carries the Golden Handler anchor (P5), the Governor anchors (P2/P3/P8), the Schema anchors (P3), the API-Spec anchor (P4), and the Conformance §3/§5 anchors (P8) so the pack satisfies the required anchors for both P5 and P8.

---

## P1 — Feature identification

**Microstep:** Apps Phase C, package C1 — Web Push **subscription storage** so Vault Origin can send chat push notifications. C1 scope is storage + CRUD only:

- one table, `theo_chat_push_subscriptions`, in the shared `vaultgpt` Postgres `public` schema;
- two HTTP handlers on the dedicated **`vaultgpt-func-chat`** app: `theo_chat_save_push_subscription` (upsert by `endpoint`) and `theo_chat_delete_push_subscription` (delete by `endpoint`, idempotent);
- a note that C2 (the sender) will read VAPID secrets from func-chat app settings.

Out of scope: the push **sender** (C2) and the FE service-worker/subscribe UI (C3).

**Route naming.** Governed convention is `theo_<operation>_<entity>` (Theo API Spec §1). Every deployed `vaultgpt-func-chat` route is in the `theo_chat_*` family (API Spec §2.10). C1 is Phase C of that same native-chat program and deploys to the same app, so the governed route/table names are `theo_chat_save_push_subscription`, `theo_chat_delete_push_subscription`, and table `theo_chat_push_subscriptions`. These are the governed spellings of the brief's plan-language names `save_push_subscription` / `delete_push_subscription` / `push_subscriptions`.

**Role vocabulary (Orchestration §1A / §1C / DR-T7).** Claude Code authors this VEP (Pass 1). Codex reviews (Pass 2). Walter executes the migration SQL and confirms; Claude Code may deploy the handlers to `vaultgpt-func-chat` only after Codex APPROVED (§1E / DR-T7). Database writes/migrations remain Walter-only.

**Plan currency note.** `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (grep this turn) contains no explicit "Phase C" / "Web Push" / "VAPID" feature row — the plan predates the native-chat (VC) program, which has run as a Walter-directed extension (VC-1 … VC-19) under the DR-T7 deployment exception and the native-chat directive, none of which carry a plan row either. C1 continues that program on the same footing. See Gap Register G1.

---

## P2 — Architecture & boundary reconciliation

- **Repository / app boundary (Architecture §1; Orchestration §1E/DR-T7).** C1 is net-new-additive on `vaultgpt-func-chat` (Windows v4, EP1) — the same app that hosts all `theo_chat_*` handlers. The monolith `vaultgpt-func-premium` and streaming sidecar `vaultgpt-func-stream` are untouched. No `reporting_*` table or Corporate Reporting surface is read or written.
- **theo_ schema + RLS baseline (Architecture §5.1/§5.2, owned by Schema §1/§2).** `theo_chat_push_subscriptions` uses the `theo_` prefix, plural snake_case, `id uuid PK DEFAULT gen_random_uuid()`, `created_by text NOT NULL` (Entra OID), `created_at timestamptz DEFAULT now()`, RLS ENABLED with **four separate** `TO authenticated` policies keyed on `created_by = auth.uid()`, policy names `theo_<entity>_<verb>_own`. This is the deployed ownership-family idiom (Schema §5 B2; §6 B7a `theo_user_memory`; §7 B8a `theo_attachments`).
- **Ownership model vs the participant-scoped chat tables (deliberate, grounded choice).** The chat content tables (`theo_chat_threads` / `theo_chat_messages` / `theo_chat_thread_members`, Schema §8) are participant-scoped — a Walter-authorized deviation from the §2 baseline. A push subscription is **not** shared chat content; it is a **per-user device registration**. The correct family is therefore the §2 **ownership baseline** (`created_by = auth.uid()`), exactly like `theo_user_memory` (§6) and `theo_attachments` (§7), which are per-user tables consumed by the chat/Theo surfaces but ownership-scoped. No new sharing/membership model is introduced, so no Walter schema-deviation authorization is required for the RLS family.
- **Model gateway seam (Architecture §2).** Not touched — these are plain EasyAuth HTTP CRUD handlers, not the Foundry gateway.
- **Tool dispatch / Tool Manifest (Architecture §4; Tool Manifest).** Not touched — the Tool Manifest governs only `reporting_*` dispatch tools called through the gateway. C1 consumes no `reporting_*` endpoint, so no manifest row is added.
- **Identity + RLS enforcement idiom (Schema §6/§7 notes; Golden Handler §3).** Handlers execute as the signed-in user: OID is read from the EasyAuth `x-ms-client-principal` header (never a body field), then session context is set with the three-key `set_config` triad, and **every** query additionally carries an explicit `created_by = $oid` predicate (defence-in-depth), exactly as the deployed `theo_chat_*` and B7a/B8a handlers do.
- **One SECURITY DEFINER write-path helper (single-owner claim), no existence helper.** No `theo_<entity>_exists_unscoped(uuid)` helper is needed — `delete` is owner-scoped + idempotent (200 whether or not a row existed), so there is no 403/404 existence question to discriminate. But a **single-owner-per-endpoint** invariant (endpoint globally UNIQUE) requires re-registration on a shared browser to atomically reassign the endpoint across owners, and direct-table ownership RLS (`created_by = auth.uid()`) forbids a cross-owner write. C1 therefore adds one narrowly-scoped `SECURITY DEFINER` function `theo_chat_claim_push_subscription`, the governed write-path idiom mirroring the deployed `theo_chat_leave` / `theo_chat_delete_message` (migration-role-owned; `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated`; pinned `search_path`; caller derived from `auth.uid()`, NEVER a parameter; a caller can only claim an endpoint TO THEMSELVES). Grounded in Golden Handler §3 and Schema §8 (see Rule Anchors). This is not a new elevated-*read* class.

---

## Gap Register

Vocabulary is closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §8.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G1 | The Phase 1B Backend Plan has no explicit Phase C / Web Push feature row. | PROCEED | The native-chat (VC) program has run entirely as a Walter-directed extension under DR-T7 without plan rows; C1 continues it on identical footing. A plan Role-C row is an optional documentation follow-up, not a blocker for this microstep. |
| G2 | **C2 fan-out read across owners.** The sender (C2) must read *other* users' subscriptions to deliver a push, but C1's ownership RLS (`created_by = auth.uid()`) scopes reads to the caller's own rows; the shared func-chat connection role does not grant a cross-owner read. | PROCEED | C1 is storage + per-user CRUD only, so ownership RLS is correct here. C2 will add a narrowly-scoped `SECURITY DEFINER` enumeration helper that returns only `{ endpoint, p256dh, auth }` for a target recipient (the Golden Handler §3(b) scheduled/enumeration pattern), owned by the migration role, `REVOKE … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated`, pinned `search_path`. Explicitly deferred to C2; disclosed now so the C1 table shape already supports it. |
| G3 | **VAPID secrets** (`VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT`). | PROCEED | Already provisioned by Walter as `vaultgpt-func-chat` **app settings** (secrets — never in the repo). C1 (storage) does not read them; C2 (sender) will. No key values appear anywhere in this VEP. |
| G4 | **Shared-browser cross-user notification leak.** If uniqueness were per-owner `(created_by, endpoint)`, the same still-valid endpoint could exist under two owners (A logs out, B logs in on the same browser and re-subscribes → both `(A,ep)` and `(B,ep)` rows). The push service keeps returning 200 for that endpoint, so 410/404 pruning never fires → messages to A are pushed to the browser B now uses = cross-user leak. | PROCEED | **Single-owner-per-endpoint is now a hard invariant:** `endpoint` is GLOBALLY `UNIQUE (endpoint)`, and re-registration goes through the `SECURITY DEFINER theo_chat_claim_push_subscription`, which atomically reassigns the endpoint to the authenticated caller (`created_by := auth.uid()`, never a client value) — the prior owner's row-access is removed in the same statement, so at most one owner holds an endpoint at any time and the shared-browser leak cannot occur. C2's `410 Gone` / `404` pruning is now only a **secondary** cleanup for genuinely-expired endpoints, not the ownership guarantee. No pre-land needed. |

---

## P3 — Schema grounding (DEPLOYED vs PROPOSED)

DEPLOYED truth (Schema §1/§2/§5/§6/§7/§8): `auth.uid()` and the per-request `set_config` session context pre-exist in the shared instance; the ownership four-policy `TO authenticated` idiom keyed on `created_by = auth.uid()` is deployed on `theo_user_memory` (§6) and `theo_attachments` (§7); the `theo_chat_*` participant tables plus the deployed write-path `SECURITY DEFINER` helpers `theo_chat_leave` / `theo_chat_delete_message` (migration-role-owned; `REVOKE`/`GRANT authenticated`; pinned `search_path`) are deployed on func-chat (§8). `gen_random_uuid()` / `pgcrypto` is available (used by every deployed table).

PROPOSED (this microstep): one net-new additive table `theo_chat_push_subscriptions` (ownership family; endpoint GLOBALLY UNIQUE), one supporting index, four ownership RLS policies, and one `SECURITY DEFINER` single-owner claim function `theo_chat_claim_push_subscription(text,text,text,text)` (the governed cross-owner write-path, mirroring the deployed `theo_chat_leave` idiom). No change to any deployed object; no FK into chat tables (a subscription is device-level, not thread-level).

Column plan (matches the brief):

| column | type | notes |
| ------ | ---- | ----- |
| `id` | `uuid PK DEFAULT gen_random_uuid()` | Schema §1 |
| `created_by` | `text NOT NULL` | owner Entra OID; Schema §1 canonical ownership column |
| `endpoint` | `text NOT NULL` | the Push API endpoint URL (validated https); **globally** `UNIQUE (endpoint)` — exactly one owner per endpoint at a time; cross-owner re-registration goes through the SECURITY DEFINER claim fn |
| `p256dh` | `text NOT NULL` | client public key (base64url) |
| `auth` | `text NOT NULL` | client auth secret (base64url) |
| `ua` | `text NULL` | optional user-agent string |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | Schema §1 |

Immutable-metadata table (like `theo_attachments`, §7) — no `updated_at`; a changed subscription is re-upserted.

---

## P4 — Contract grounding

Two new endpoints on `vaultgpt-func-chat`, EasyAuth (Entra OID from `x-ms-client-principal`), executing as the signed-in user. Response envelope mirrors the deployed `theo_chat_*` shape: success `{ data, meta:{ timestamp, version } }`; error `{ error:{ code, message, status, timestamp } }`.

- `POST /api/theo_chat_save_push_subscription` — body `{ endpoint, p256dh, auth, ua? }` → **201** `{ subscription: { id, endpoint, created_at } }`. Missing/invalid identity → **401**; non-JSON body → **400 BAD_REQUEST**; `endpoint` not a non-empty https URL, or `p256dh` / `auth` blank → **400 INVALID_REQUEST** (deterministic, before any SQL).
- `POST /api/theo_chat_delete_push_subscription` — body `{ endpoint }` → **200** `{ endpoint, deleted:<bool> }` (idempotent — 200 whether or not a row existed). **401** / **400** as above.

Method is **POST + OPTIONS** for both, matching every deployed `theo_chat_*` handler (including the delete-family `theo_chat_delete_message`, which is POST).

**API-Spec sequencing (deploy → Role-C → FE).** These two routes are NOT added to `spec/THEO_API_SPEC.md` in this VEP. Per the governed sequence, the API-Spec §2.10 rows are landed by a **separate Pass-4 Role-C after Pass-3 deploy + golden-curl verification** (deploy → API-Spec Role-C applied → then any FE VEP). C3 (FE) therefore depends on that Role-C landing and is not part of C1.

---

## P5 — Handler grounding

**Primary Reference (Golden Handler §2 — exactly one deployed handler + its function.json, inlined full verbatim below):** the deployed `theo_chat_send_message` handler on `vaultgpt-func-chat` (source captured at `Codex Governance/Theo-1B-VC12-Delete-Message-Backend-Pass-1-VEP/theo_chat_send_message.index.js`, blob `a8cafbcf9e411cde5b2da304fcd19b7f771ef7b1`). It is the fullest deployed write handler: CORS/OPTIONS, `getPrincipal` + `getClaimValue` OID extraction, `parseBody`, validate-before-SQL, the three-key `set_config` triad, an owner/participant-scoped write, and the deployed error-code mapping. `theo_chat_save_push_subscription` mirrors it directly; `theo_chat_delete_push_subscription` mirrors the same skeleton with a delete body (the deployed `theo_chat_delete_message` is the sibling precedent for the POST-delete method and idempotent-delete shape, cited as corroboration only — the single canonical Primary Reference is `theo_chat_send_message`).

### Structural Mirror Table (Golden Handler §5.1)

| Handler region | Primary Reference region | Classification | Basis |
| -------------- | ------------------------ | -------------- | ----- |
| `pg` Pool init (`POSTGRES_CONNECTION_STRING`, `ssl.rejectUnauthorized:false`) | send_message L4–7 | EXACT | byte-identical |
| `corsHeaders` (`POST, OPTIONS`) | send_message L13–17 | EXACT | byte-identical |
| `send` / `nowIso` / `errorBody` / `successBody` | send_message L19–24 | EXACT | byte-identical |
| `getPrincipal` / `getClaimValue` / `parseBody` / `buildKnownError` | send_message L25–46 | EXACT | byte-identical |
| OPTIONS short-circuit + OID gate (401) | send_message L64–76 | EXACT | byte-identical |
| `parseBody` try/catch → 400 | send_message L78–79 | EXACT | byte-identical |
| Field validation before any SQL | send_message L81–100 (`thread_id`/`body`) | ALLOWED DELTA | validated field set differs: `endpoint` (non-empty https URL) + `p256dh`/`auth` non-empty (save); `endpoint` only (delete). Golden Handler §4 permits "the specific validated field set". |
| `set_config` triad | send_message L108–116 | EXACT | byte-identical three-key `set_config` |
| Write query | send_message L145–164 (insert) | ALLOWED DELTA | `save` calls `SELECT public.theo_chat_claim_push_subscription($1,$2,$3,$4)` (single-owner claim); `delete` runs `DELETE … WHERE endpoint=$1 AND created_by=$2` under ownership RLS. Golden Handler §4 permits "the specific RLS-scoped query". |
| SECURITY DEFINER claim helper `theo_chat_claim_push_subscription` | deployed `theo_chat_leave` / `theo_chat_delete_message` write-path helpers (Schema §8) | ALLOWED DELTA (EXACT mirror of a deployed helper class) | migration-role-owned, `SECURITY DEFINER SET search_path`, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated`, caller from `auth.uid()` never a parameter, cross-owner write bypassing ownership RLS. Golden Handler §4: a new-domain helper classified ALLOWED DELTA requires "an EXACT mirror against a deployed handler containing that helper" — satisfied by the deployed `theo_chat_leave` / `theo_chat_delete_message` write-path definer class (Schema §8). No Walter authorization needed (not a novel class). |
| Success response | send_message L192 (`201`) / delete → `200` | ALLOWED DELTA | response shape per contract (§4). Golden Handler §4 permits "the contract's response shape". |
| catch → `42501`→403, known-error passthrough, `500` | send_message L193–207 | EXACT (save) / ALLOWED DELTA (delete drops the `23514` branch — no CHECK constraint) | error mapping mirrored |
| `finally { client.release() }` | send_message L205–207 | EXACT | byte-identical |
| No Web PubSub publish | send_message L179–190 | ALLOWED DELTA (region omitted) | C1 has no realtime broadcast; the `@azure/web-pubsub` import + publish block are simply not present. Omitting a region is not a deviation. |

No region is classified DEVIATION. No new external-system helper is introduced (Golden Handler §4).

### PROPOSED handler — `theo_chat_save_push_subscription` (design; NOT written to the app)

```javascript
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const MAX_UA = 1000;

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
function isHttpsUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  let u;
  try { u = new URL(value.trim()); } catch { return false; }
  return u.protocol === "https:";
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

  // Validate the full field set BEFORE any SQL (deterministic 400).
  const endpoint = typeof body.endpoint === "string" ? body.endpoint.trim() : "";
  if (!isHttpsUrl(endpoint)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'endpoint' is required and must be a non-empty https URL.", 400));
  }
  const p256dh = typeof body.p256dh === "string" ? body.p256dh.trim() : "";
  if (!p256dh) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'p256dh' is required and must be non-empty.", 400));
  }
  const auth = typeof body.auth === "string" ? body.auth.trim() : "";
  if (!auth) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'auth' is required and must be non-empty.", 400));
  }
  let ua = null;
  if (body.ua != null) {
    if (typeof body.ua !== "string") {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'ua' must be a string when provided.", 400));
    }
    ua = body.ua.trim().slice(0, MAX_UA) || null;
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

    // Single-owner-per-endpoint claim (endpoint is GLOBALLY UNIQUE). The SECURITY DEFINER function
    // theo_chat_claim_push_subscription atomically reassigns the endpoint to the authenticated caller
    // (created_by := auth.uid(), NEVER a client value), removing any prior owner's access in the same
    // statement — so a shared-browser re-subscribe cannot leave two owners for one endpoint. The
    // reassignment is a cross-owner write, which direct-table RLS (created_by = auth.uid()) forbids;
    // the definer function (owned by the migration role, REVOKE FROM PUBLIC / GRANT EXECUTE authenticated,
    // pinned search_path) is the governed way to perform it, mirroring the deployed theo_chat_leave /
    // theo_chat_delete_message write-path idiom (Schema §8; Golden Handler §3).
    const claim = await client.query(
      `SELECT public.theo_chat_claim_push_subscription($1, $2, $3, $4) AS id`,
      [endpoint, p256dh, auth, ua]
    );

    return send(context, 201, successBody({ subscription: { id: claim.rows[0].id, endpoint } }));
  } catch (err) {
    context.log.error("theo_chat_save_push_subscription failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this subscription.", 403));
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

Proposed `theo_chat_save_push_subscription.function.json`:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_save_push_subscription"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### PROPOSED handler — `theo_chat_delete_push_subscription` (design; NOT written to the app)

```javascript
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
function isHttpsUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  let u;
  try { u = new URL(value.trim()); } catch { return false; }
  return u.protocol === "https:";
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

  const endpoint = typeof body.endpoint === "string" ? body.endpoint.trim() : "";
  if (!isHttpsUrl(endpoint)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'endpoint' is required and must be a non-empty https URL.", 400));
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

    // Idempotent owner-scoped delete: 0 rows removed is still a 200 (deleted:false). Explicit
    // created_by predicate = defence-in-depth alongside the ownership DELETE RLS policy.
    const del = await client.query(
      `DELETE FROM public.theo_chat_push_subscriptions WHERE endpoint = $1 AND created_by = $2`,
      [endpoint, oid]
    );
    const deleted = del.rowCount > 0;

    return send(context, 200, successBody({ endpoint, deleted }));
  } catch (err) {
    context.log.error("theo_chat_delete_push_subscription failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this subscription.", 403));
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

Proposed `theo_chat_delete_push_subscription.function.json`:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post", "options"],
      "route": "theo_chat_delete_push_subscription"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### Primary Reference — deployed `theo_chat_send_message.index.js` (FULL VERBATIM, no ellipsis)

```javascript
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

### Primary Reference — deployed `theo_chat_send_message.function.json` (FULL VERBATIM, no ellipsis)

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

---

## P6 — SQL grounding (Walter-executable migration; write-SQL is Walter-only)

Plain PostgreSQL SQL, no top-level transaction control, no psql meta-commands (Golden Handler §5.2), idempotent. Walter runs this at Pass 3 **before** the C1 handlers deploy. C1 delivers the SQL; it does not execute it.

```sql
-- ============================================================================
-- Theo 1B — Apps Phase C, C1: theo_chat_push_subscriptions (Web Push subscription storage)
-- Target: shared vaultgpt Azure Postgres instance, schema public. App: vaultgpt-func-chat.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance). Idempotent; safe to re-run.
-- Run by Walter at Pass 3 BEFORE the C1 handlers deploy (write-SQL is Walter-only).
-- Ownership-family idiom (Schema section 1/2; Tier B7a theo_user_memory; Tier B8a theo_attachments):
-- created_by text NOT NULL (Entra OID), four RLS policies TO authenticated keyed on created_by = auth.uid(),
-- policy names theo_<entity>_<verb>_own. Direct table access is own-rows-only; per-user isolation is ALSO
-- enforced by explicit created_by = $oid predicates in the delete handler (RLS = defence-in-depth layer).
-- SINGLE-OWNER-PER-ENDPOINT invariant: endpoint is GLOBALLY UNIQUE, so exactly one owner holds an endpoint
-- at a time. Cross-owner re-registration (shared browser: A logs out, B subscribes) is performed by the
-- SECURITY DEFINER claim function below -- the governed write-path idiom (Schema section 8; Golden Handler
-- section 3) -- which reassigns the endpoint to the AUTHENTICATED CALLER only (created_by := auth.uid(),
-- NEVER a client value), atomically removing the prior owner's row-access. See Gap Register G4 / Revision note.
-- ============================================================================

-- 1) Storage table. endpoint is globally UNIQUE -> exactly one owner at a time (no cross-user leak).
CREATE TABLE IF NOT EXISTS public.theo_chat_push_subscriptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by  text NOT NULL,
  endpoint    text NOT NULL,
  p256dh      text NOT NULL,
  auth        text NOT NULL,
  ua          text NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_theo_chat_push_subscriptions_endpoint UNIQUE (endpoint)
);
CREATE INDEX IF NOT EXISTS idx_theo_chat_push_subscriptions_created_by
  ON public.theo_chat_push_subscriptions (created_by);

-- 2) RLS + four ownership policies. Direct table access (delete handler; any future read) = own rows only.
ALTER TABLE public.theo_chat_push_subscriptions ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_chat_push_subscriptions' AND policyname='theo_push_subscription_select_own') THEN
    CREATE POLICY "theo_push_subscription_select_own" ON public.theo_chat_push_subscriptions FOR SELECT TO authenticated USING (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_chat_push_subscriptions' AND policyname='theo_push_subscription_insert_own') THEN
    CREATE POLICY "theo_push_subscription_insert_own" ON public.theo_chat_push_subscriptions FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_chat_push_subscriptions' AND policyname='theo_push_subscription_update_own') THEN
    CREATE POLICY "theo_push_subscription_update_own" ON public.theo_chat_push_subscriptions FOR UPDATE TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='theo_chat_push_subscriptions' AND policyname='theo_push_subscription_delete_own') THEN
    CREATE POLICY "theo_push_subscription_delete_own" ON public.theo_chat_push_subscriptions FOR DELETE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;

-- 3) Grant: the app role (vaultgpt_app) is a member of `authenticated` and receives table DML via the
-- pgadmin_vault default-privilege ACL (the deployed B2/B7a/B8a migrations add no explicit per-table GRANT).
-- This explicit grant to `authenticated` is a harmless, idempotent superset. Run as pgadmin_vault.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theo_chat_push_subscriptions TO authenticated;

-- 4) SECURITY DEFINER single-owner claim (the governed cross-owner write-path; Schema section 8 idiom).
-- Reassigns the endpoint to the AUTHENTICATED CALLER only (created_by := auth.uid(), never a client value);
-- ON CONFLICT (endpoint) atomically removes any prior owner in the same statement. SECURITY DEFINER (owned
-- by the migration role; tables are ENABLE- not FORCE-RLS) bypasses the ownership UPDATE RLS that would
-- otherwise forbid the cross-owner reassignment -- mirrors the deployed theo_chat_leave /
-- theo_chat_delete_message write-path helpers. Caller identity is derived from auth.uid() (set by the
-- handler's set_config/JWT triad before the call), NEVER a parameter; unauthenticated -> raise 28000.
CREATE OR REPLACE FUNCTION public.theo_chat_claim_push_subscription(
  p_endpoint text,
  p_p256dh   text,
  p_auth     text,
  p_ua       text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
DECLARE
  v_oid text := auth.uid();
  v_id  uuid;
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_claim_push_subscription: no caller identity' USING ERRCODE = '28000';
  END IF;

  INSERT INTO public.theo_chat_push_subscriptions (created_by, endpoint, p256dh, auth, ua)
  VALUES (v_oid, p_endpoint, p_p256dh, p_auth, p_ua)
  ON CONFLICT (endpoint) DO UPDATE
    SET created_by = v_oid,
        p256dh     = EXCLUDED.p256dh,
        auth       = EXCLUDED.auth,
        ua         = EXCLUDED.ua,
        created_at = now()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_claim_push_subscription(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_claim_push_subscription(text, text, text, text) TO authenticated;
```

The complete runnable migration above is also shipped as a standalone file in this package: **`Codex Governance/Theo-1B-VCpush-C1-Push-Subscriptions-Backend-Pass-1-VEP/migration_theo_chat_push_subscriptions.sql`** (byte-identical SQL; plain PostgreSQL, idempotent, no psql meta-commands). Walter runs it as `pgadmin_vault` (VS Code SQL play button) at Pass 3, before the C1 handlers deploy.

### Post-migration read-only verification (Pass 3, E2 — SELECT-only)

```sql
-- Table + RLS present, four ownership policies, GLOBAL UNIQUE (endpoint), SECURITY DEFINER claim fn. SELECT-only.
SELECT relrowsecurity
  FROM pg_class
 WHERE oid = 'public.theo_chat_push_subscriptions'::regclass;

SELECT policyname, cmd
  FROM pg_policies
 WHERE schemaname = 'public' AND tablename = 'theo_chat_push_subscriptions'
 ORDER BY policyname;

SELECT conname, contype
  FROM pg_constraint
 WHERE conrelid = 'public.theo_chat_push_subscriptions'::regclass
 ORDER BY conname;

SELECT proname, prosecdef
  FROM pg_proc
 WHERE proname = 'theo_chat_claim_push_subscription';
```

---

## P7 — Curl grounding (deterministic golden curls)

Fixed method/path/headers; the EasyAuth `x-ms-client-principal` value is a base64 of a fixed sample principal (the caller's Entra OID); no unbound placeholders in the request bodies. Asserted response shapes stated inline. (Golden Handler §5.3; determinism at Conformance §4A P7.)

```bash
# 1) save — happy path -> 201 { data: { subscription: { id, endpoint, created_at } } }
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_save_push_subscription" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"endpoint":"https://wns2-by3p.notify.windows.com/w/?token=AbC123","p256dh":"BEl62iUY...base64url...","auth":"k9xR...base64url...","ua":"Mozilla/5.0"}'

# 2) save — re-subscribe same endpoint (upsert) -> 201, same id/endpoint, keys updated
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_save_push_subscription" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"endpoint":"https://wns2-by3p.notify.windows.com/w/?token=AbC123","p256dh":"BNewKey...","auth":"newAuth..."}'

# 3) save — non-https endpoint -> 400 INVALID_REQUEST (no SQL executed)
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_save_push_subscription" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"endpoint":"http://insecure.example/w","p256dh":"x","auth":"y"}'

# 4) save — missing identity -> 401 UNAUTHORIZED
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_save_push_subscription" \
  -H "Content-Type: application/json" \
  -d '{"endpoint":"https://wns2-by3p.notify.windows.com/w/?token=AbC123","p256dh":"x","auth":"y"}'

# 5) delete — existing -> 200 { data: { endpoint, deleted:true } }
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_delete_push_subscription" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"endpoint":"https://wns2-by3p.notify.windows.com/w/?token=AbC123"}'

# 6) delete — absent (idempotent) -> 200 { data: { endpoint, deleted:false } }
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_delete_push_subscription" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"endpoint":"https://wns2-by3p.notify.windows.com/w/?token=DoesNotExist"}'
```

`PRINCIPAL_B64` is the base64 EasyAuth client-principal for the golden test identity (fixed OID); it is the standard func-chat golden-curl input and carries no secret material.

---

## VAPID configuration note (for C2 — storage-only C1 does NOT use it)

The sender package (C2) will read `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` from **`vaultgpt-func-chat` app settings** (secrets — already provisioned by Walter; never committed to the repo). C1 is storage only and does not read any VAPID value. **No key values appear anywhere in this VEP.**

---

## P8 — VEP assembly + mechanical lint

This pack opens with the GCR + Rule Anchor Table (Conformance §3/§5), walks P1–P8, carries the Architecture & boundary reconciliation and the Gap Register (Governor §8), delivers Walter-executable migration SQL, the two PROPOSED handlers + function.json, the FULL-verbatim Primary Reference pair, deterministic golden curls, and the VAPID/API-Spec-sequencing notes. Plan-only: no app/handler/migration files written, no deploy, no commit.

Mechanical lint target: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-VCpush-C1-Push-Subscriptions-Backend-Pass-1-VEP/Theo_1B_VCpush_C1_Push_Subscriptions_Backend_Pass_1_VEP_Plan_Only.md" --repo-root .` — expected PASS.
