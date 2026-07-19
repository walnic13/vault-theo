# Theo 1B — Tier DMS-Push, MS1: subscription + notification spine (Backend, Pass 1 VEP)

Controlling artifact for Codex review. Self-contained: handlers under `handlers/`, migration in-pack. Layer 3 of the OneDrive-grade DMS live mirror (L1+L2 shipped in `vault-dms`). MS1 gives `vaultgpt-func-chat` the stateful plumbing the stateless DMS gateway can't hold: an app-level Microsoft Graph change-notification **subscription** per DMS drive + a public **notification receiver** that fans a **trigger-only** "drive changed" signal over the existing chat Web PubSub. Each client reacts by pulling its OWN delegated `dms_delta` (per-user SharePoint trimming preserved in `vault-dms`); no file data crosses the app-context path.

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Turn issued against HEAD: fc68508ae63d3cae570e422e7761e4e17b01dd37 (the commit that first adds this package — T29 presence probe resolves here + at every later commit; grounding reads against parent 6e0d50d)
```

Currency anchors are the git blob SHA of each cited file at parent HEAD (verifiable via `git cat-file -p <sha>`); the §8 mechanical check is satisfied by literal-substring Rule Anchors at HEAD.

| # | Document (name + absolute path) | Read this turn | Currency anchor (blob SHA) |
|---|---------------------------------|----------------|----------------------------|
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register; deploy authority) | Grep this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A P-track; §5 Rule Anchor) | Read §3/§4A this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 Primary Reference; §3 structure; §4 Allowed Deltas; §5 mirror/SQL/curl) | Read §3/§4/§5 this turn | `49aa225aa6145adced121846de990725da5fe0f0` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (DR-T7 deploy exception; roles) | Grep this turn | `be066f12147d1eb13b51f025b275f5413ab51f0e` |
| 5 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§1 conventions; §2 RLS baseline; §8 SECURITY DEFINER write-path idiom) | Read §1/§2/§8 this turn | `dd3f274e6cd57ed1c870dce2585867cc753c0dab` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§1 route naming; func-chat contract surface; §3 boundary) | Grep this turn | `ce1ad227ca4f66a5c9c74ccdb185f3d2c3974cd3` |
| 7 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 **Tier DMS-Push** — the P1 anchor) | Read §7 Tier DMS-Push this turn | `28183604ddfcfe80fa3f3dda6f78e437b88d32d6` |
| 8 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (repo boundary; schema/RLS baseline) | referenced via Schema §1/§2 this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 9 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | Grep this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 10 | Primary Reference — deployed `theo_chat_send_message.index.js` (Web PubSub send idiom) `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/theo_chat_send_message.index.js` | Read this turn | `483a0b4dfbeeff882b5d73055914f76e8024601a` |
| 11 | Primary Reference — deployed `theo_distill_memory.index.js` (app-level `client_credentials` token idiom) `Codex Governance/Theo-1B-B7-Distillation-Engine-Pass-1-VEP/theo_distill_memory.index.js` | Read this turn | `cc47b6bab5931b2dc519448a5e89c27e90c6390a` |

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "A **new-domain or new-external-system helper**" | The Graph `/v1.0/subscriptions` create/renew/delete — authorized verbatim by Walter (below); Web PubSub send + client_credentials mirror deployed handlers |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier DMS-Push | "hosts the *stateful infrastructure*" | P1 feature identification — MS1 is the Tier DMS-Push spine microstep |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier DMS-Push | "the fan-out signal is **trigger-only**" | P2 — dms_notifications fans only `{ type, drive_id }`; delegated dms_delta does the trimmed pull |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8 | "SECURITY DEFINER SET search_path = public" | P3/P6 — SECURITY DEFINER service-access functions for the app-infra table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §8 | "Gap Register vocabulary is closed:" | Gap Register (P8/P2) — PRE-LAND declared per the closed vocabulary |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form:" | P8 — the GCR opens this pack |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "MUST include, after the GCR, a Rule Anchor Table:" | P8 — this Rule Anchor Table follows the GCR |

## Walter authorization (verbatim; predates this VEP — Golden Handler §4)

> **Walter authorization (2026-07-19):** Vault DMS / func-chat is authorized to call the Microsoft Graph change-notification **subscription** endpoints — `POST /v1.0/subscriptions`, `PATCH /v1.0/subscriptions/{id}` (renewal), `DELETE /v1.0/subscriptions/{id}` — for drive-root resources, to drive real-time DMS live-mirror updates. Tenant admin-consent for the change-notification application permission is granted + applied.

## P1 — Feature identification
Tier DMS-Push, microstep **MS1 — subscription + notification spine** (Theo Phase 1B Backend Plan §7, the Codex-APPROVED P1 anchor). Deliverables: migration `dms_change_subscriptions` + `dms_notifications` receiver + `dms_subscribe`. MS2 (renewal timer) and the vault-dms FE subscriber are separate.

## P2 — Architecture & boundary reconciliation
- **App-level subscription, delegated pull (BINDING trigger-only invariant).** `dms_subscribe` creates ONE Graph subscription per drive with an **app** `client_credentials` Graph token (the OBO app now carries the consented change-notification permission) — not a user token. `dms_notifications` fans only `{ type:"dms_changed", drive_id }` to the `dms-changes` Web PubSub group; NO names/content/metadata. Each client pulls its own delegated `dms_delta` (vault-dms OBO) → per-user SharePoint trimming preserved; an unentitled user learns nothing beyond an opaque drive_id (employees-only hub).
- **Notification authentication.** The webhook is anonymous (Graph can't present EasyAuth); each notification is authenticated by **constant-time comparing `clientState`** against the per-subscription secret stored at create. Unknown subscription or mismatched secret → ignored.
- **Validation handshake.** `dms_notifications` echoes Graph's `?validationToken=` as 200 `text/plain` (create/renew handshake). `dms_subscribe` must therefore be called only after `dms_notifications` is deployed + publicly reachable (external prereq, recorded in the tier).
- **App-infra table, service access (Schema §8 idiom).** `dms_change_subscriptions` is app-level (one row per drive), NOT user-owned: no `created_by`, RLS ENABLED with NO `authenticated` policies, all access via SECURITY DEFINER functions (migration-role-owned; `REVOKE ALL FROM PUBLIC`; `GRANT EXECUTE TO authenticated`; pinned `search_path`) — the governed service write-path, mirroring the deployed `theo_chat_claim_push_subscription`.
- **Deploy target.** `vaultgpt-func-chat` only (DR-T7). No change to `func-dms`/`func-premium`/`func-stream`/`func-theo-tools`.

## Gap Register
**PRE-LAND** — the API Spec rows for `dms_subscribe` / `dms_notifications` and the Schema row for `dms_change_subscriptions` do not yet exist; this VEP lands them via scoped Role-C edits on approval (recorded in the Implementation Package). The Graph subscription endpoints are authorized verbatim above (Golden Handler §4), so not an ESCALATE. External prereqs (Walter, recorded in Tier DMS-Push): admin-consent applied (done 2026-07-19); the func-chat `dms_notifications` URL publicly reachable for Graph's handshake; two app settings — `DMS_NOTIFICATION_URL` (the public receiver URL) and `WEBPUBSUB_HUB` (= the deployed chat hub) — set before the live subscribe test.

## P3 — Schema grounding (DEPLOYED vs PROPOSED)
PROPOSED: table `public.dms_change_subscriptions` + 6 SECURITY DEFINER functions (`dms_sub_upsert`/`_get_by_drive`/`_get`/`_list_expiring`/`_touch_expiration`/`_delete`). App-infra deviation from the §5 per-user `created_by`/RLS idiom is deliberate + justified (P2); the service-access DEFINER pattern is the §8 idiom. Full DDL: `migration_dms_change_subscriptions.sql` (P6). No existing table altered.

## P4 — Contract grounding
PROPOSED func-chat routes: `POST /api/dms_subscribe` (body `{siteId, driveId}` → `{ data: { dms_subscribe: { drive_id, ensured, refreshed, expiration? } } }`); `GET|POST /api/dms_notifications` (Graph webhook: `?validationToken` echo; notification batch → 202). API Spec rows land Role-C on approval (Gap Register). Route naming `dms_<operation>` per API Spec §1.

## P5 — Handler grounding (Structural Mirror)
Handlers in-pack under `handlers/`. Primary references: deployed `theo_chat_send_message` (Web PubSub send) + `theo_distill_memory` (app `client_credentials` token).

| Handler region | Primary reference region | Classification | Basis |
|---|---|---|---|
| `dms_subscribe`/`dms_notifications`: `require("pg")` Pool, `parseJsonSafe`, `getPrincipal`/`getClaimValue`, `requestUrl` | same helpers in the deployed handlers | EXACT | frozen Family-B helper block |
| `dms_subscribe` `getAppGraphToken()` (`client_credentials`, `scope=https://graph.microsoft.com/.default`) | `theo_distill_memory` client_credentials token exchange (`scope=https://ai.azure.com/.default`) | ALLOWED DELTA | same idiom, Graph scope instead of Foundry |
| `dms_subscribe` `POST https://graph.microsoft.com/v1.0/subscriptions` (+ idempotent ensure via `dms_sub_get_by_drive`/`dms_sub_upsert`) | (none) | ALLOWED DELTA (Walter-authorized new interaction) | Golden Handler §4 / T12 — verbatim authorization above |
| `dms_notifications` `WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB).group("dms-changes").sendToAll({...})` | `theo_chat_send_message` `serviceClient.group(threadId).sendToAll(...)` | ALLOWED DELTA | same Web PubSub send idiom; a fixed DMS group instead of a thread group |
| `dms_notifications` validation-token echo + `clientState` `crypto.timingSafeEqual` auth + `dms_sub_get` | (none) | ALLOWED DELTA (Walter-authorized new interaction) | webhook contract for the authorized subscription endpoints; constant-time secret compare |
| RLS/`created_by`/`set_config` per-user table access | present in per-user reference handlers | **REMOVED / REPLACED (app-infra)** | Schema §8 SECURITY DEFINER service access; app-level rows, not user-owned (P2) |

## P6 — SQL grounding (Walter-executable migration; write-SQL is Walter-only)
`migration_dms_change_subscriptions.sql` (in-pack): idempotent, no BEGIN/COMMIT; creates the table (drive_id UNIQUE — one subscription per drive), ENABLEs RLS with no `authenticated` policies, and the 6 SECURITY DEFINER functions with `REVOKE ALL FROM PUBLIC` + `GRANT EXECUTE TO authenticated` + pinned `search_path`. Run by Walter as `pgadmin_vault` at Pass 3 BEFORE the handlers deploy.

## P7 — Curl grounding (deterministic; Claude Code runs post-deploy)
```
# 1) Validation handshake — Graph's create probe. Echo the token as text/plain 200.
curl -sS -w '\nHTTP %{http_code} CT:%{content_type}\n' \
  "https://vaultgpt-func-chat.azurewebsites.net/api/dms_notifications?validationToken=abc123"
#   expect: HTTP 200, Content-Type text/plain, body exactly "abc123".

# 2) Notification with an UNKNOWN subscription / wrong clientState -> ignored, still 202 (no fan-out).
curl -sS -X POST -w '\nHTTP %{http_code}\n' \
  -H "Content-Type: application/json" \
  "https://vaultgpt-func-chat.azurewebsites.net/api/dms_notifications" \
  --data '{"value":[{"subscriptionId":"does-not-exist","clientState":"nope"}]}'
#   expect: HTTP 202 { ok:true }; no Web PubSub message (unauthenticated notification dropped).

# 3) dms_subscribe happy path (EasyAuth token) -> 201, subscription created + stored; a follow-up
#    call within the lifetime -> 200 refreshed:false (idempotent). (Run once dms_notifications is live.)
TOKEN=$(az account get-access-token --resource "api://4e1a1e31-5c20-4480-99e4-098901707d9e" --query accessToken -o tsv)
curl -sS -X POST -w '\nHTTP %{http_code}\n' \
  -H "Authorization: Bearer $TOKEN" -H "x-ms-client-principal: <easyauth>" -H "Content-Type: application/json" \
  "https://vaultgpt-func-chat.azurewebsites.net/api/dms_subscribe" \
  --data '{"siteId":"vaulttax.sharepoint.com,a43ef8a2-...,4583d217-...","driveId":"<driveId from dms_delta>"}'
```
Token never printed. Assertion: (1) exact echo; (2) 202 + no fan-out on failed auth; (3) 201 then 200-idempotent, and a `dms_change_subscriptions` row exists (SELECT-only verify).

## P8 — VEP assembly
This document + the in-pack handlers + migration.

## Parity checklist (Golden Handler §5.4)
- [x] Primary references named + in-repo (theo_chat_send_message, theo_distill_memory).
- [x] Family-B helper block mirrored EXACT.
- [x] New Graph interaction (`/subscriptions`) authorized verbatim by Walter, predating the VEP (§4/T12).
- [x] Web PubSub fan-out trigger-only (drive_id, no data); constant-time clientState auth; validation handshake.
- [x] App-infra table via SECURITY DEFINER (Schema §8); RLS enabled, no authenticated policies; REVOKE/GRANT/search_path.
- [x] `function.json`: `dms_subscribe` post/options; `dms_notifications` get/post; both anonymous.
- [x] Deterministic golden curls (handshake, failed-auth-drop, subscribe idempotent); token never printed.
- [x] Migration idempotent, no BEGIN/COMMIT, Walter-run.
- [x] Mechanical lint PASS (below).

## Complete file list
- `Codex Governance/Theo-1B-DMS-Push-MS1-Backend-Pass-1-VEP/INDEX.md`
- `…/migration_dms_change_subscriptions.sql`
- `…/handlers/dms_subscribe/index.js` + `function.json`
- `…/handlers/dms_notifications/index.js` + `function.json`

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-DMS-Push-MS1-Backend-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested verdict
**APPROVED** — on approval: Role-C lands the API Spec + Schema rows; Walter runs the migration (`pgadmin_vault`) + sets `DMS_NOTIFICATION_URL`/`WEBPUBSUB_HUB`; Claude Code deploys both handlers to `vaultgpt-func-chat` (Kudu, DR-T7) + runs the golden curls (validation handshake, failed-auth drop, idempotent subscribe). Then MS2 (renewal timer) + the vault-dms FE subscriber.
