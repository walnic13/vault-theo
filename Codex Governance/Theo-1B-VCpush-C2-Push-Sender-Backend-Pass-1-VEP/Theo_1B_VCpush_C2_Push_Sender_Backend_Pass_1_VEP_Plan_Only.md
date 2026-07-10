# Theo 1B — VCpush C2: Web Push SENDER (Backend, Pass 1 VEP, Plan-Only)

Plan-only Verified Evidence Pack. No handler/migration files are written into the app, no deploy, no commit. This pack delivers the Web Push **sender**: two new cross-owner `SECURITY DEFINER` SQL functions and a best-effort push fan-out **delta** on the deployed `theo_chat_send_message` handler. Builds on the DEPLOYED C1 (`theo_chat_push_subscriptions` + single-owner `theo_chat_claim_push_subscription`). The C3 service worker + subscribe UI (FE) are out of scope.

**Revision note (C2 v2):** thread-scoped least-privilege read helper — membership is now enforced INSIDE the `SECURITY DEFINER` function (`theo_chat_get_push_subscriptions_for_thread(p_thread_id uuid)`), which proves the caller is a member via `auth.uid()` and derives recipients itself (`member_oids` MINUS the caller); the old array-of-arbitrary-OIDs signature `theo_chat_get_push_subscriptions(p_oids text[])` is removed entirely. The G-READCLASS authorization has LANDED (`WALTER_AUTHORIZATION_G-READCLASS.md`, committed `2af5ffd`). Addresses Codex Pass 2 findings 1 (procedural — authorization now exists) and 2 (least-privilege — boundary moved into the definer).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `2af5ffddc6d3b02d82dea62142f3bf85622e37ba` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8

Currency anchors below are the git blob SHA of each cited file at HEAD (verifiable via `git cat-file -p <sha>`); the mechanical currency check is satisfied by literal-substring Rule Anchors at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Schema Reality Lock; Gap Register; SQL discipline) | `Grep(pattern="Gap Register vocabulary is closed\|Schema Reality Lock", path=governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md)` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A P-track spine; §5 Rule Anchor Table; §6 triggers) | `Bash(sed -n '/### §4A.1/,/### §4A.4/p' …)` + quote-verify this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 Primary Reference; §3 SECURITY DEFINER; §4 Allowed Deltas; §5.1 Structural Mirror; §5.2 migration no-txn-control) | `Read(governance/THEO_GOLDEN_HANDLER_STANDARD.md)` this turn | `865afc9fab567fd2ace06f4c26b9ee0203be38b8` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (role vocabulary; Decision Register; deploy exception) | `Grep`/verify this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 5 | Theo API Spec — `spec/THEO_API_SPEC.md` (§1 route naming; §2.10 in-Vault chat / func-chat contract surface incl. C1 push rows) | `Bash(sed -n '/2.10/,/^## /p' spec/THEO_API_SPEC.md)` this turn | `576ab56471337ae85764c2f79783f76c6c62e411` |
| 6 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 conventions; §2 RLS baseline; §8 VC-1 chat tables + `member_oids` + write-path SECURITY DEFINER idiom) | `Grep(pattern="theo_chat_threads\|member_oids\|narrowly-scoped write-path helper", path=spec/THEO_AZURE_POSTGRES_SCHEMA.md)` this turn | `f916ba72cd668f311e1df92b0929d49708dd8f4b` |
| 7 | Theo Tool Manifest — `spec/THEO_TOOL_MANIFEST.md` (`reporting_*`-only dispatch registry; not touched by C2) | referenced (no `reporting_*` consumed) this turn | `8af2183755b6e298a4911c3fc75886a56cdea892` |
| 8 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (feature-identification search for Phase C / push / VAPID) | `Grep` feature search this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 9 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§1 repo boundary; §5 theo_ schema + RLS baseline) | referenced via Schema §1/§2/§8 (architecture §5 truth pointer) this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 10 | Primary Reference — best-available committed `theo_chat_send_message` handler `Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/theo_chat_send_message.index.js` (see G-PRIMARY: live wwwroot capture required at Pass 3) | `Read(...theo_chat_send_message.index.js)` this turn | `fc7ef0e4f2a72d14265f3fe4cda86f825bc497d2` |
| 11 | Primary Reference — `theo_chat_send_message.function.json` `Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/theo_chat_send_message.function.json` | `Read(...theo_chat_send_message.function.json)` this turn | `0284d265cd81bec4c34b5513d46c41b7ba6601ff` |
| 12 | C1 package (DEPLOYED substrate) — `Codex Governance/Theo-1B-VCpush-C1-Push-Subscriptions-Backend-Pass-1-VEP/migration_theo_chat_push_subscriptions.sql` + its VEP (Gap G2 foresaw the C2 enumeration helper) | `Read(...migration_theo_chat_push_subscriptions.sql)` + `Read(...C1 VEP)` this turn | `n/a — package artifact (not a governance/spec authority row)` |
| 13 | Walter authorization (G-READCLASS) — `Codex Governance/Theo-1B-VCpush-C2-Push-Sender-Backend-Pass-1-VEP/WALTER_AUTHORIZATION_G-READCLASS.md` (verbatim "yes, i authorize", 2026-07-09; the Golden Handler §4 predating authorization for the elevated cross-owner read class) | `Read(...WALTER_AUTHORIZATION_G-READCLASS.md)` this turn | committed `2af5ffd` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | ------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form:" |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive Claude Code or Codex turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "The Gap Register vocabulary is closed:" |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §4 | "Schema Reality Lock" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "a SECURITY DEFINER existence helper is explicitly invoked for 403/404 discrimination" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "A **new-domain or new-external-system helper** classified as ALLOWED DELTA requires either an EXACT mirror against a deployed handler containing that helper" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.2 | "Migration files carry no top-level transaction control" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8 | "narrowly-scoped write-path helper" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §1 | "Canonical ownership column: **`created_by text NOT NULL`**" |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §2 | "Default family: ownership-based (`created_by = auth.uid()`)" |
| spec/THEO_API_SPEC.md | §1 | "Route naming: `theo_<operation>_<entity>`" |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1A | "reviewer (Pass 2) and Role-C inline executor" |

Sub-phase Track rationale: **P8 (VEP assembly)** is the established convention for a full backend plan VEP in this repo (the sibling C1 VEP and 40+ prior `Theo_1B_*` VEPs declare P8). The turn nonetheless walks the full P1–P8 spine below; the Rule Anchor Table carries the Golden Handler anchors (P5: §2/§3/§4/§5.2), the Governor anchors (§4/§8), the Schema anchors (P3: §1/§2/§8), the API-Spec anchor (P4: §1), the Orchestration anchor (§1A), and the Conformance §3/§5 anchors (P8), so the pack satisfies the required anchors for the declared track and evidences P2–P7.

---

## P1 — Feature identification

**Microstep:** Apps Phase C, package C2 — the Web Push **sender**. When a chat message is sent (DM or channel), fire a Web Push notification to each RECIPIENT's registered devices so they are notified even when Vault Origin is closed. C2 scope:

- two net-new `SECURITY DEFINER` SQL functions on the shared `vaultgpt` Postgres `public` schema:
  - `theo_chat_get_push_subscriptions_for_thread(p_thread_id uuid) RETURNS TABLE(created_by, endpoint, p256dh, auth)` — thread-scoped cross-owner read: the caller passes only the thread id, the function proves membership (`auth.uid()`) and derives recipients (`member_oids` MINUS the caller) itself;
  - `theo_chat_prune_push_subscription(p_endpoint text) RETURNS boolean` — cross-owner delete of a dead endpoint (410/404);
- a best-effort push fan-out **delta** appended to the deployed `theo_chat_send_message` handler on `vaultgpt-func-chat` (additive; the existing persist + realtime publish + 201 response are byte-unchanged);
- the `web-push` npm dependency (installed into the func-chat wwwroot at Pass 3) + the VAPID app-settings read (secrets — not in the repo).

Out of scope: the C3 service worker + subscribe UI (FE); message-body content beyond a short preview.

**Route / object naming.** Governed convention is `theo_<operation>_<entity>` (Theo API Spec §1). C2 adds no new HTTP route — it modifies the existing `theo_chat_send_message` route and adds two `theo_chat_*` SQL helpers, matching the deployed C1 spellings `theo_chat_push_subscriptions` / `theo_chat_claim_push_subscription`.

**Role vocabulary (Orchestration §1A).** Claude Code authors this VEP (Pass 1). Codex reviews (Pass 2). Walter executes the migration SQL and confirms; Claude Code deploys the handler delta to `vaultgpt-func-chat` only after Codex APPROVED. The G-READCLASS Walter authorization has LANDED (`WALTER_AUTHORIZATION_G-READCLASS.md`), so that gate is satisfied. Database writes/migrations remain Walter-only.

**Plan currency note.** `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (grep this turn) carries no explicit "Phase C" / "Web Push" / "VAPID" feature row — the native-chat (VC) program has run as a Walter-directed extension (VC-1 … VC-19, then Apps B/C) without plan rows. C1 (the C2 substrate) is DEPLOYED 2026-07-09 per API Spec §2.10. C2 continues that program on identical footing. See Gap Register G1.

---

## P2 — Architecture & boundary reconciliation

- **Repository / app boundary (Architecture §1; Orchestration deploy exception).** C2 is net-new-additive on `vaultgpt-func-chat` (Windows v4, EP1) — the app that hosts all `theo_chat_*` handlers and the C1 push table/claim fn. The monolith `vaultgpt-func-premium` and streaming sidecar `vaultgpt-func-stream` are untouched. No `reporting_*` table or Corporate Reporting surface is read or written.
- **theo_ schema + RLS baseline (Architecture §5, owned by Schema §1/§2/§8).** C2 adds no table. It adds two `SECURITY DEFINER` functions over the DEPLOYED C1 ownership table `theo_chat_push_subscriptions` (`created_by` OID; `endpoint` globally UNIQUE); the thread-scoped read helper reads the DEPLOYED participant-scoped `theo_chat_threads.member_oids` array (Schema §8) INTERNALLY to prove membership and resolve recipients.
- **Membership authority is `theo_chat_threads.member_oids` (Schema §8; API Spec §2.10).** Recipients = the target thread's members MINUS the sender. There is a `theo_chat_thread_members` table, but Schema §8 states membership **authority** is `theo_chat_threads.member_oids` (that table tracks per-member read-state). **v2 least-privilege:** the recipient set is derived INSIDE the `SECURITY DEFINER theo_chat_get_push_subscriptions_for_thread(p_thread_id uuid)` — the caller passes only the thread id, the function proves `auth.uid() = ANY(member_oids)` (a non-member is denied `42501`, an unknown thread returns no rows), and derives `member_oids` MINUS the caller itself. The caller can never pass arbitrary OIDs to harvest credentials, so the enforcement boundary lives at the data layer, not merely in the handler. A single handler (`theo_chat_send_message`) covers BOTH DM and channel sends — a DM and a channel are both `theo_chat_threads` rows differing only by `kind` — so exactly one send path is modified (API Spec §2.10: `theo_chat_send_message` is the sole server-authoritative send route for both).
- **Cross-owner access requires SECURITY DEFINER (Schema §8 write-path idiom; Golden Handler §3).** The sender must read OTHER users' subscriptions (to encrypt/deliver) and delete OTHER users' dead endpoints (410/404). C1's ownership RLS (`created_by = auth.uid()`) scopes direct-table access to the caller's own rows, and the shared func-chat connection role has no cross-owner grant. C2 therefore adds two migration-role-owned `SECURITY DEFINER` functions (each `SET search_path = public, pg_temp`, `REVOKE ALL … FROM PUBLIC`, `GRANT EXECUTE … TO authenticated`, caller identity from `auth.uid()` never a parameter), the same justified class as the deployed `theo_chat_leave` / `theo_chat_delete_message` / `theo_chat_claim_push_subscription`. **The READ helper returns another user's push credentials, which exceeds the Golden Handler §3(a)/(b) exceptions — resolved by the LANDED Walter authorization (`WALTER_AUTHORIZATION_G-READCLASS.md`) per Golden Handler §4; see Gap Register G-READCLASS.**
- **Model gateway seam (Architecture §2) / Tool dispatch (Architecture §4; Tool Manifest).** Not touched. `web-push` talks to the browser push services (WNS / FCM / Apple) directly via VAPID; no `reporting_*` endpoint and no manifest row is involved.
- **Realtime boundary unchanged.** The existing best-effort Web PubSub publish (`serviceClient.group(threadId).sendToAll(...)`) is byte-unchanged. Push is a SECOND, independent best-effort delivery channel for when the app is closed; it is appended after the publish and before the 201, and is wrapped entirely in try/catch so it can never affect either.
- **No secrets in the pack.** VAPID keys live only in `vaultgpt-func-chat` app settings. No key value appears anywhere in this VEP or in the repo.

---

## Gap Register

Vocabulary is closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §8.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-READCLASS | `theo_chat_get_push_subscriptions_for_thread` returns ANOTHER user's push credentials (`endpoint` + `p256dh` + `auth`) to an **HTTP** handler (`theo_chat_send_message`). Golden Handler §3 permits elevated reads only for (a) an existence helper for 403/404 discrimination, or (b) a **scheduled (timer)** handler using an enumeration helper that returns "ONLY identifiers + owner ids (never user content)". This helper is HTTP-triggered (not a timer) and returns credentials (not just ids), and no deployed handler contains an EXACT mirror of a cross-owner content-returning read helper. Per §4, a new-domain helper classified ALLOWED DELTA needs an EXACT deployed mirror OR a verbatim Walter authorization predating the package. | **PROCEED** (was ESCALATE — now resolved) | **RESOLVED — the authorization has LANDED.** `Codex Governance/Theo-1B-VCpush-C2-Push-Sender-Backend-Pass-1-VEP/WALTER_AUTHORIZATION_G-READCLASS.md` (committed `2af5ffd`) carries Walter's verbatim authorization ("yes, i authorize", 2026-07-09) for the elevated cross-owner Web Push credential read class, predating this C2 Implementation Package per Golden Handler §4. The credentials are the irreducible RFC 8291 encryption inputs (they cannot be reduced to identifiers). **The v2 design STRENGTHENS the authorization's bound mitigations:** membership is enforced INSIDE the `SECURITY DEFINER` via `theo_chat_get_push_subscriptions_for_thread(p_thread_id uuid)` — the caller passes only the thread id, the function proves `auth.uid() = ANY(member_oids)` (non-member → `42501`, unknown thread → no rows) and derives recipients (`member_oids` MINUS the caller) itself, so an authenticated caller can never pass arbitrary OIDs to harvest credentials (the old `p_oids text[]` signature is removed). The helper returns only the encryption-necessary fields and is `REVOKE ALL FROM PUBLIC` / `GRANT EXECUTE TO authenticated`. Gate satisfied; design review-ready. |
| G-PRIMARY | No committed `theo_chat_send_message` snapshot is byte-faithful to the LIVE deployed handler. The VC-19 snapshot (Primary Reference here) carries reply/delete/forward + the archived-send gate, but NOT the VC-9 attachment and VC-10 gif projection (both DEPLOYED 2026-07-07 per API Spec §2.10, postdating every committed snapshot). Golden Handler §5.5 states "The deployed handler is the source of truth … the repo's `Codex Governance/` artifacts drift behind what is deployed." | **PRE-LAND** | The additive C2 fan-out block is **position-independent**: it reads only `oid`, `principal`, `saved.thread_id`, and calls the thread-scoped read helper with `saved.thread_id`, and is inserted between the existing publish block and the `return 201`. It does not touch or depend on any attachment/gif/reply field, so it composes cleanly onto the live handler regardless of which projection features it carries. **Precondition for the Implementation Package:** Kudu-GET the live `theo_chat_send_message` wwwroot copy, re-emit the Structural Mirror against it (byte-exact Primary Reference), and confirm the insertion point (after the Web PubSub publish, before the 201) still holds. The delta below is expressed against the VC-19 committed snapshot as the best-available reference. |
| G1 | The Phase 1B Backend Plan has no explicit Phase C / Web Push feature row. | PROCEED | The VC program has run as a Walter-directed extension without plan rows; C1 is deployed; C2 continues it. A plan Role-C row is an optional documentation follow-up, not a blocker. |
| G-VAPID | The sender needs `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT`. | PROCEED | Already provisioned as `vaultgpt-func-chat` app settings (secrets — never in the repo). The handler guards on all three being present before it attempts any push. No key value appears in this VEP. |
| G-DEP | `web-push` is not yet in the func-chat wwwroot `node_modules`. | PROCEED | Installed at Pass 3 via Kudu (`npm install web-push@3.6.7`), the pdf-parse precedent (npm in Kudu CMD, pinned version, `require('web-push')`). This is a deploy step, not a plan-only VEP file. See "web-push dependency" below. |
| G-PRUNE-CAP | `theo_chat_prune_push_subscription(p_endpoint)` deletes by endpoint regardless of owner and is `GRANT EXECUTE TO authenticated`, so the endpoint string acts as a capability. | PROCEED | Cross-owner delete is REQUIRED (the sender is not the owner). It is invoked ONLY on a push the service reported 410/404 (a confirmed-dead endpoint); an `auth.uid()` guard rejects an unauthenticated caller. A future hardening (restrict prune to endpoints the caller just failed to push) is noted but not required for C2. |

---

## P3 — Schema grounding (DEPLOYED vs PROPOSED)

DEPLOYED truth (Schema §1/§2/§8; API Spec §2.10): `auth.uid()` + the per-request `set_config` triad pre-exist; `theo_chat_push_subscriptions` (ownership family; `created_by text NOT NULL`; `endpoint` globally `UNIQUE`; `p256dh`/`auth` NOT NULL) is DEPLOYED (C1, 2026-07-09) with four ownership RLS policies + the single-owner `SECURITY DEFINER theo_chat_claim_push_subscription`; `theo_chat_threads.member_oids text[]` is the participant-scoped membership authority (SELECT policy `auth.uid() = ANY(member_oids)`), with the deployed write-path `SECURITY DEFINER` helpers `theo_chat_leave` / `theo_chat_delete_message`; the tables are ENABLE- not FORCE-RLS and are owned by the migration role.

PROPOSED (this microstep): two net-new `SECURITY DEFINER` functions over the DEPLOYED C1 table; **no table/column/policy DDL**, no change to any deployed object.

| function | signature | class | basis |
| -------- | --------- | ----- | ----- |
| `theo_chat_get_push_subscriptions_for_thread` | `(p_thread_id uuid) RETURNS TABLE(created_by text, endpoint text, p256dh text, auth text)` | thread-scoped cross-owner enumeration read (elevated-read class — G-READCLASS, authorization LANDED) | `SECURITY DEFINER`, `SET search_path = public, pg_temp`, `REVOKE ALL FROM PUBLIC`, `GRANT EXECUTE TO authenticated`, `auth.uid()` guard; proves `auth.uid() = ANY(member_oids)` INSIDE the fn (non-member → `42501`; unknown thread → no rows); returns rows where `created_by = ANY(member_oids) AND created_by <> auth.uid()` — the caller never passes OIDs |
| `theo_chat_prune_push_subscription` | `(p_endpoint text) RETURNS boolean` | cross-owner write-path delete (mirrors deployed `theo_chat_leave` / `theo_chat_delete_message` class) | same definer envelope; deletes the `endpoint` row regardless of owner; returns true iff a row was removed |

The complete runnable migration ships as a standalone file in this package: **`Codex Governance/Theo-1B-VCpush-C2-Push-Sender-Backend-Pass-1-VEP/migration_theo_chat_push_sender_functions.sql`** and is reproduced verbatim in P6.

---

## P4 — Contract grounding

C2 adds **no new HTTP route**. It modifies the existing `POST /api/theo_chat_send_message` (`{ thread_id, body, reply_to_message_id? }` → **201** `{ message }`, API Spec §2.10). The response envelope, status codes, persist, and the best-effort Web PubSub publish are **byte-unchanged**; the push fan-out is a purely additive best-effort side-effect appended after the publish and before the 201 (never affects the response).

**Notification payload** (the encrypted data the C3 service worker renders): a small JSON object `{ title, body, url, tag }`:

- `title` — for a **channel**, the channel name (`theo_chat_threads.name`); for a **DM**, the sender's display name (EasyAuth `name` claim), fallback `"New message"`.
- `body` — a short (≤140-char) preview of `saved.body`; fallback `"Sent you a message"` when there is no text body (e.g. an attachment/gif-only message on the live handler).
- `url` — a deep link to the DM/channel in vault-origin, built from `VAULT_ORIGIN_BASE_URL` (env; fallback `https://vault-origin.com`) + `?chat=<thread_id>`. The exact vault-origin chat route is a C3/FE contract; C2 also passes `thread_id` via `tag` so the SW can resolve it.
- `tag` — `saved.thread_id` (per-thread dedupe/replace in the SW).

No message body beyond the short preview; no secrets; the raw recipient OIDs / endpoints / keys are NEVER placed in the payload.

**API-Spec sequencing.** No new route is added, so no new §2.10 route row is required. The §2.10 "push notification subscriptions" row already notes "the push **sender** (C2, separate)". An optional Role-C may append a sentence noting the send-handler now fans out Web Push; this is a documentation follow-up, not a C2 blocker (see the deploy → Role-C → FE sequence).

---

## P5 — Handler grounding

**Primary Reference (Golden Handler §2 — exactly one deployed handler + its function.json, inlined full verbatim below).** Best-available committed `theo_chat_send_message` = `Codex Governance/Theo-1B-VC19-Archived-Send-Gate-Backend-Pass-1-VEP/theo_chat_send_message.index.js` (blob `fc7ef0e4f2a72d14265f3fe4cda86f825bc497d2`). **Not byte-faithful to LIVE** — see G-PRIMARY (the live handler additionally carries the VC-9 attachment + VC-10 gif projection deployed 2026-07-07; the authoritative wwwroot copy must be Kudu-GET at Pass 3 and the mirror re-emitted). No composite selection (Golden Handler §2 T10); the two SQL helpers are additive infrastructure, not a second handler.

### The C2 delta (ALLOWED DELTA — additive best-effort push fan-out)

The ONLY change to the handler is the insertion of one self-contained best-effort block **between** the existing Web PubSub publish block and the final `return send(context, 201, successBody({ message: saved }));`. The existing persist loop, the `saved.reply_to`/`deleted`/`forwarded` shaping, the Web PubSub publish, and the 201 response are **byte-unchanged**. Presented as a unified-style diff against the VC-19 Primary Reference (context lines match L187–L203 of the inlined handler):

```
         } catch (pubErr) {
           context.log.error("theo_chat_send_message publish (non-fatal) failed", pubErr);
         }
       }

+      // ── C2: best-effort Web Push fan-out to recipients' registered devices ────────────
+      // Runs AFTER the durable persist + the realtime publish above. Wrapped ENTIRELY in
+      // try/catch: a push failure NEVER affects the 201 or the realtime publish (log-and-
+      // continue). The cross-owner read/prune go through the SECURITY DEFINER helpers
+      // (VEP Gap G-READCLASS — authorization LANDED). theo_chat_get_push_subscriptions_for_thread
+      // proves the sender's membership and derives recipients (member_oids MINUS the sender)
+      // INSIDE the definer — the handler never enumerates or passes OIDs.
+      try {
+        if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
+          const subs = await client.query(
+            `SELECT created_by, endpoint, p256dh, auth FROM public.theo_chat_get_push_subscriptions_for_thread($1)`,
+            [threadId]
+          );
+          if (subs.rows.length > 0) {
+            const webpush = require("web-push");
+            webpush.setVapidDetails(
+              process.env.VAPID_SUBJECT,
+              process.env.VAPID_PUBLIC_KEY,
+              process.env.VAPID_PRIVATE_KEY
+            );
+            const tRow = await client.query(
+              `SELECT kind, name FROM public.theo_chat_threads WHERE id = $1`,
+              [threadId]
+            );
+            const kind = tRow.rows[0] ? tRow.rows[0].kind : null;
+            const channelName = tRow.rows[0] ? tRow.rows[0].name : null;
+            const senderName = getClaimValue(principal, [
+              "name",
+              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
+            ]);
+            const title = kind === "channel" ? (channelName || "New channel message") : (senderName || "New message");
+            const preview = typeof saved.body === "string" && saved.body ? saved.body.slice(0, 140) : "";
+            const payloadBody = preview || "Sent you a message";
+            const baseUrl = process.env.VAULT_ORIGIN_BASE_URL || "https://vault-origin.com";
+            const url = `${baseUrl}/?chat=${encodeURIComponent(saved.thread_id)}`;
+            const payload = JSON.stringify({ title, body: payloadBody, url, tag: saved.thread_id });
+            await Promise.allSettled(
+              subs.rows.map((s) =>
+                webpush
+                  .sendNotification(
+                    { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
+                    payload,
+                    { TTL: 60 }
+                  )
+                  .catch(async (e) => {
+                    const code = e && e.statusCode;
+                    if (code === 404 || code === 410) {
+                      try {
+                        await client.query(`SELECT public.theo_chat_prune_push_subscription($1)`, [s.endpoint]);
+                      } catch (pruneErr) {
+                        context.log.error("theo_chat_send_message push prune (non-fatal) failed", pruneErr);
+                      }
+                    } else {
+                      context.log.error("theo_chat_send_message push send (non-fatal) failed", code);
+                    }
+                  })
+              )
+            );
+          }
+        }
+      } catch (pushErr) {
+        context.log.error("theo_chat_send_message push fan-out (non-fatal) failed", pushErr);
+      }
+      // ── end C2 fan-out ────────────────────────────────────────────────────────────────
+
       return send(context, 201, successBody({ message: saved }));
```

Notes on the delta:
- **Best-effort / non-fatal.** The whole block is inside `try { … } catch (pushErr) { context.log.error(...) }`, and each per-subscription send additionally `.catch(...)`es via `Promise.allSettled`, so no push error can propagate to the 201 or the realtime publish. This mirrors the deployed pattern for the Web PubSub publish (already `try/catch` "publish (non-fatal) failed").
- **Bounded await.** The block `await`s `Promise.allSettled(...)` before the 201 because the func-chat classic v4 host does not reliably run background work after the response returns; awaiting keeps the pushes in-flight during the request. Each `webpush.sendNotification` is bounded by the library's HTTP timeout and `TTL:60`. The durable persist and realtime publish have already happened, so the only cost is a small, bounded delay on the 201 ack.
- **Recipient enumeration is inside the definer (least-privilege).** The handler passes ONLY `threadId` to `theo_chat_get_push_subscriptions_for_thread`; the function proves `auth.uid() = ANY(member_oids)` and derives recipients (`member_oids` MINUS the caller) itself. The handler never enumerates members or passes an OID array, so a caller cannot request another thread's or another user's credentials. A non-member call raises `42501` (caught by the outer try/catch, logged non-fatally).
- **Uses the existing connection `client`** (already has the `set_config`/JWT triad applied), so `auth.uid()` inside both `SECURITY DEFINER` helpers resolves to the sender. The `SELECT kind, name` lookup is only for the notification title (channel name vs sender name); it is not the membership boundary — that lives inside the read helper.

### Structural Mirror Table (Golden Handler §5.1)

| Handler region | Primary Reference region | Classification | Basis |
| -------------- | ------------------------ | -------------- | ----- |
| Everything from `require`/Pool through the persist loop, `saved.*` shaping, and the Web PubSub publish block | send_message L1–L201 | EXACT | byte-unchanged; the C2 block is inserted AFTER L201 |
| C2 best-effort push fan-out block (the `+` lines above) | inserted between L201 (end of publish `if`) and L203 (`return 201`) | ALLOWED DELTA (additive best-effort side-effect) | Golden Handler §4 permits an additive best-effort region mirroring an existing best-effort region; this block mirrors the deployed Web PubSub "publish (non-fatal)" try/catch pattern (same log-and-continue shape) and reads `member_oids` (Schema §8) |
| `SELECT … FROM public.theo_chat_get_push_subscriptions_for_thread($1)` call | new SQL helper (thread-scoped cross-owner read) | ALLOWED DELTA (G-READCLASS Walter authorization LANDED) | Golden Handler §4: a new-domain helper classified ALLOWED DELTA needs an EXACT deployed mirror OR a verbatim Walter authorization predating the package. No exact mirror exists (no deployed helper returns other users' content) → satisfied by `WALTER_AUTHORIZATION_G-READCLASS.md` (committed `2af5ffd`, predating this Implementation Package). Membership is proven INSIDE the definer (least-privilege); the caller passes only the thread id |
| `SELECT public.theo_chat_prune_push_subscription($1)` call | deployed `theo_chat_leave` / `theo_chat_delete_message` write-path definer class (Schema §8) | ALLOWED DELTA (EXACT mirror of a deployed definer class) | cross-owner write-path delete; migration-role-owned, `SECURITY DEFINER SET search_path`, `REVOKE`/`GRANT authenticated`, caller from `auth.uid()`; same class as deployed helpers → no new authorization needed |
| `return send(context, 201, successBody({ message: saved }))` | send_message L203 | EXACT | byte-unchanged |
| catch/finally | send_message L204–L218 | EXACT | byte-unchanged |

No region is DEVIATION. The read-helper call's ALLOWED-DELTA classification is satisfied by the LANDED G-READCLASS authorization (`WALTER_AUTHORIZATION_G-READCLASS.md`); with membership now enforced inside the thread-scoped definer, no region is left open. The `function.json` is **unchanged** (same route/methods).

### Primary Reference — `theo_chat_send_message.index.js` (FULL VERBATIM, no ellipsis; best-available committed VC-19 snapshot, blob `fc7ef0e4f2a72d14265f3fe4cda86f825bc497d2`)

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

### Primary Reference — `theo_chat_send_message.function.json` (FULL VERBATIM, no ellipsis; UNCHANGED by C2)

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

Plain PostgreSQL SQL, no top-level transaction control, no psql meta-commands (Golden Handler §5.2), idempotent (`CREATE OR REPLACE FUNCTION`; no DDL on the C1 table). Walter runs this at Pass 3 **before** the C2 handler delta deploys; the G-READCLASS authorization has already LANDED (`WALTER_AUTHORIZATION_G-READCLASS.md`). C2 delivers the SQL; it does not execute it. Shipped as `migration_theo_chat_push_sender_functions.sql` in this package (byte-identical to the block below).

```sql
-- ============================================================================
-- Theo 1B — Apps Phase C, C2: Web Push SENDER — two SECURITY DEFINER helpers (v2)
-- Target: shared vaultgpt Azure Postgres instance, schema public. App: vaultgpt-func-chat.
-- Plain PostgreSQL SQL; no top-level BEGIN/COMMIT (migration governance, Golden Handler section 5.2).
-- Idempotent (CREATE OR REPLACE FUNCTION; no DDL on the C1 table). Safe to re-run.
-- Run by Walter as pgadmin_vault at Pass 3 BEFORE the C2 send-handler delta deploys (write-SQL is Walter-only).
--
-- v2 (thread-scoped least-privilege): the cross-owner read helper now takes the THREAD id, proves the
-- caller is a member INSIDE the function (auth.uid()), and derives recipients itself (member_oids MINUS
-- the caller). The old array-of-arbitrary-OIDs signature is removed entirely. Addresses Codex Pass 2.
--
-- Depends on C1 (DEPLOYED 2026-07-09): table public.theo_chat_push_subscriptions
--   (created_by text, endpoint text UNIQUE, p256dh text, auth text, ...), ownership RLS
--   (created_by = auth.uid()), and the single-owner SECURITY DEFINER theo_chat_claim_push_subscription.
--
-- WHY SECURITY DEFINER (cross-owner access — Schema section 8 write-path idiom; Golden Handler section 3):
-- the message SENDER must read/prune OTHER users' push subscriptions to deliver a push. C1's ownership RLS
-- (created_by = auth.uid()) scopes direct-table access to the caller's OWN rows, and the shared func-chat
-- connection role has no cross-owner grant. Both helpers are owned by the migration role (pgadmin_vault),
-- and because the C1 table is ENABLE- not FORCE-RLS, a SECURITY DEFINER function owned there bypasses the
-- ownership policies. Both pin search_path, REVOKE ALL FROM PUBLIC, GRANT EXECUTE TO authenticated, and
-- derive the caller identity from auth.uid() (never a parameter). This is the same justified write-path
-- class as the deployed theo_chat_leave / theo_chat_delete_message / theo_chat_claim_push_subscription.
--
-- ELEVATED-READ-CLASS NOTE (C2 VEP Gap Register G-READCLASS): theo_chat_get_push_subscriptions_for_thread
-- returns another user's push credentials (endpoint + p256dh + auth) to an HTTP handler. That exceeds the
-- Golden Handler section 3(a) existence-helper and section 3(b) timer-enumeration exceptions, so per
-- Golden Handler section 4 it required an explicit Walter authorization predating the Implementation
-- Package. That authorization has LANDED: WALTER_AUTHORIZATION_G-READCLASS.md (this package). The
-- thread-scoped signature ENFORCES the authorization's bound mitigations (membership proven inside the
-- definer; recipients server-derived from member_oids MINUS the caller) rather than trusting the handler.
-- ============================================================================

-- 1) Thread-scoped cross-owner enumeration read (LEAST-PRIVILEGE). The caller passes ONLY the thread id.
--    The function proves the caller is a member of that thread (auth.uid() = ANY(member_oids)) and derives
--    the recipients itself (member_oids MINUS the caller) — the caller can never pass arbitrary OIDs to
--    harvest credentials. Returns exactly the fields RFC 8291 aes128gcm encryption requires (endpoint plus
--    the p256dh / auth client keys) plus created_by so the sender can attribute a row. A non-member caller
--    is denied (42501); an unknown thread returns no rows; an unauthenticated caller is rejected (28000).
CREATE OR REPLACE FUNCTION public.theo_chat_get_push_subscriptions_for_thread(p_thread_id uuid)
RETURNS TABLE(created_by text, endpoint text, p256dh text, auth text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
DECLARE
  v_oid     text   := auth.uid();
  v_members text[];
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_get_push_subscriptions_for_thread: no caller identity' USING ERRCODE = '28000';
  END IF;

  SELECT t.member_oids INTO v_members
    FROM public.theo_chat_threads t
   WHERE t.id = p_thread_id;

  IF v_members IS NULL THEN
    RETURN;  -- unknown thread -> return no rows
  END IF;

  IF NOT (v_oid = ANY(v_members)) THEN
    RAISE EXCEPTION 'theo_chat_get_push_subscriptions_for_thread: caller not a thread member' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT s.created_by, s.endpoint, s.p256dh, s.auth
    FROM public.theo_chat_push_subscriptions s
   WHERE s.created_by = ANY(v_members)
     AND s.created_by <> v_oid;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_get_push_subscriptions_for_thread(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_get_push_subscriptions_for_thread(uuid) TO authenticated;

-- 2) Cross-owner prune: delete the row for p_endpoint regardless of owner. Called ONLY when the push
--    service returns 410 Gone / 404 for a dead endpoint (a genuinely-expired subscription). SECURITY
--    DEFINER because the sender is not the endpoint's owner; ownership RLS would otherwise forbid the
--    delete. Returns true when a row was removed, false otherwise (idempotent). auth.uid() guard rejects
--    an unauthenticated caller; a NULL / empty p_endpoint is a no-op returning false.
CREATE OR REPLACE FUNCTION public.theo_chat_prune_push_subscription(p_endpoint text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $fn$
DECLARE
  v_oid   text    := auth.uid();
  v_count integer := 0;
BEGIN
  IF v_oid IS NULL OR v_oid = '' THEN
    RAISE EXCEPTION 'theo_chat_prune_push_subscription: no caller identity' USING ERRCODE = '28000';
  END IF;

  IF p_endpoint IS NULL OR p_endpoint = '' THEN
    RETURN false;
  END IF;

  DELETE FROM public.theo_chat_push_subscriptions
   WHERE endpoint = p_endpoint;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count > 0;
END;
$fn$;

REVOKE ALL ON FUNCTION public.theo_chat_prune_push_subscription(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.theo_chat_prune_push_subscription(text) TO authenticated;
```

### Post-migration read-only verification (Pass 3, E2 — SELECT-only)

```sql
-- Both SECURITY DEFINER functions present with prosecdef = true, and the correct arg types. SELECT-only.
SELECT p.proname, p.prosecdef, pg_get_function_identity_arguments(p.oid) AS args
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public'
   AND p.proname IN ('theo_chat_get_push_subscriptions_for_thread', 'theo_chat_prune_push_subscription')
 ORDER BY p.proname;

-- EXECUTE granted to authenticated, REVOKEd from PUBLIC (acl inspection). SELECT-only.
SELECT p.proname, p.proacl
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
 WHERE n.nspname = 'public'
   AND p.proname IN ('theo_chat_get_push_subscriptions_for_thread', 'theo_chat_prune_push_subscription')
 ORDER BY p.proname;
```

---

## P7 — Curl grounding (deterministic golden curls)

C2 adds no new route; the golden curls exercise the MODIFIED `theo_chat_send_message` and assert the send contract is unchanged (the push fan-out is a best-effort side-effect that must not alter the response). Fixed method/path/headers; the EasyAuth `x-ms-client-principal` value is a base64 of a fixed sample principal; no unbound placeholders. (Golden Handler §5.3; determinism at Conformance §4A P7.)

```bash
# 1) send into a thread the caller belongs to -> 201 { data: { message: { id, thread_id, seq, ... } } }
#    (push fan-out fires best-effort in the background; the 201 body is IDENTICAL to pre-C2)
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_send_message" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"thread_id":"11111111-1111-1111-1111-111111111111","body":"hello from the C2 golden curl"}'

# 2) send with NO recipient subscriptions registered -> still 201 (fan-out is a no-op; response unchanged)
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_send_message" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"thread_id":"22222222-2222-2222-2222-222222222222","body":"nobody subscribed yet"}'

# 3) send into a thread the caller is NOT a member of -> 404 NOT_FOUND (unchanged; fan-out never reached)
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_send_message" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"thread_id":"33333333-3333-3333-3333-333333333333","body":"not my thread"}'

# 4) send into an ARCHIVED channel -> 409 CONVERSATION_ARCHIVED (unchanged; archived gate precedes fan-out)
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_send_message" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"thread_id":"44444444-4444-4444-4444-444444444444","body":"posting to an archived channel"}'

# 5) send with blank body -> 400 INVALID_REQUEST (unchanged; validation precedes any SQL / fan-out)
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_send_message" \
  -H "Content-Type: application/json" \
  -H "x-ms-client-principal: ${PRINCIPAL_B64}" \
  -d '{"thread_id":"11111111-1111-1111-1111-111111111111","body":"   "}'

# 6) missing identity -> 401 UNAUTHORIZED (unchanged)
curl -sS -X POST "https://vaultgpt-func-chat.azurewebsites.net/api/theo_chat_send_message" \
  -H "Content-Type: application/json" \
  -d '{"thread_id":"11111111-1111-1111-1111-111111111111","body":"no principal header"}'
```

`PRINCIPAL_B64` is the base64 EasyAuth client-principal for the golden test identity (fixed OID); it is the standard func-chat golden-curl input and carries no secret material. Curls 1–2 additionally assert (via func-chat logs, not the response) that a `theo_chat_send_message push …` error, if any, is logged non-fatally and the 201 is returned regardless.

---

## web-push dependency (Pass-3 deploy step — NOT a plan-only VEP file)

The sender uses the `web-push` library (handles VAPID auth + RFC 8291 `aes128gcm` payload encryption — do NOT hand-roll crypto).

- **Pin:** `web-push@3.6.7` (known-good stable).
- **Install (Kudu, the pdf-parse precedent — run npm in the Kudu CMD/Debug console, NOT PowerShell):**
  - Kudu → Debug console → **CMD** → `cd site\wwwroot` → `npm install web-push@3.6.7`
  - Confirm `node_modules/web-push` is present; the handler does `require("web-push")` (lazily, inside the guarded block).
- This install is part of the Pass-3 deploy, gated on Codex APPROVED + the G-READCLASS authorization. It is intentionally NOT a file in this plan-only package.

---

## VAPID configuration note (secrets — never in the pack)

The sender reads `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` from **`vaultgpt-func-chat` app settings** (already provisioned by Walter; secrets — never committed). The handler calls `webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)` and guards on all three being present before attempting any push. **No key value appears anywhere in this VEP.**

---

## P8 — VEP assembly + mechanical lint

This pack opens with the GCR + Rule Anchor Table (Conformance §3/§5), walks P1–P8, carries the Architecture & boundary reconciliation and the Gap Register (Governor §8; vocabulary `PROCEED`/`PRE-LAND`/`ESCALATE`/`NO-GAPS`), delivers the Walter-executable migration SQL (also shipped as `migration_theo_chat_push_sender_functions.sql`), the FULL-verbatim Primary Reference pair, the additive C2 delta + Structural Mirror, deterministic golden curls, and the web-push/VAPID/API-Spec notes. Plan-only: no app/handler/migration files written, no deploy, no commit.

**Gate status for the reviewer / Walter:** G-READCLASS is RESOLVED — the verbatim Walter authorization has LANDED (`WALTER_AUTHORIZATION_G-READCLASS.md`, committed `2af5ffd`, predating this package per Golden Handler §4), and the v2 thread-scoped read helper additionally enforces membership INSIDE the `SECURITY DEFINER` (least-privilege; the caller passes only the thread id). One PRE-LAND remains: G-PRIMARY — the live `theo_chat_send_message` wwwroot copy must be captured and the mirror re-emitted at Implementation-Package time. The technical design is complete and review-ready now.

Mechanical lint target: `node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-VCpush-C2-Push-Sender-Backend-Pass-1-VEP/Theo_1B_VCpush_C2_Push_Sender_Backend_Pass_1_VEP_Plan_Only.md" --repo-root .` — expected PASS.
