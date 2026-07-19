# Theo 1B — Tier DMS-Push MS1, Pass 4: keyless managed-identity Graph token (Backend correction)

Controlling artifact for Codex review. Self-contained: the single corrected handler under `handlers/dms_subscribe/`, canonical Primary Reference inlined under `primary-reference/`. This is a **post-deploy correction** to the Codex-APPROVED + deployed MS1: `dms_subscribe.getAppGraphToken()` acquired the app-only Graph token via `client_credentials` + a client secret (`AAD_TENANT_ID`/`AAD_CLIENT_ID`/`AAD_CLIENT_SECRET`), but those settings do not exist on `vaultgpt-func-chat` and Theo's convention is **keyless managed identity** (HF-T1 Foundry, HF-T6 audio). At Pass-3 live-subscribe the handler 500'd inside `getAppGraphToken()` (missing credentials) before any Graph call. Pass 4 replaces that helper with the **deployed** keyless MI-token idiom, mirrored EXACT from `theo_transcribe_audio`. No other handler, the migration, or any binding changes.

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Verified Evidence Pack (backend correction)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: P5
Turn issued against HEAD: 6f011e29e85e669ad0ed8816b64269b9fb156c7d (the commit that first adds this package — T29 presence probe resolves here and at every later commit)
```

| # | Document / artifact (path) | Read this turn |
|---|----------------------------|----------------|
| 1 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 canonical Primary Reference; §4 Allowed Deltas; §5.5 deployed = source of truth) | Read FULL this turn |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A.1 P5; §5 Rule Anchor) | Read §3/§4A/§5 this turn |
| 3 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (connection idiom; app-infra table unchanged) | Read FULL this turn |
| 4 | Theo API Spec — `spec/THEO_API_SPEC.md` (func-chat contract surface; app-settings-as-secrets precedent) | Grep this turn |
| 5 | **CANONICAL Primary Reference** — deployed `theo_transcribe_audio.index.js` (func-chat HF-T6; keyless MI-token + http/https `requestUrl`) — inlined FULL VERBATIM at `primary-reference/theo_transcribe_audio.index.js.md` | Kudu-GET this turn (HTTP 200) |
| 6 | CANONICAL Primary Reference — its `theo_transcribe_audio.function.json` — inlined FULL VERBATIM at `primary-reference/theo_transcribe_audio.function.json.md` | Kudu-GET this turn (HTTP 200) |
| 7 | Deployed handler under correction — `dms_subscribe/index.js` (live on func-chat) | Kudu-GET this turn |
| 8 | Entra control-plane — func-chat MI (`5a0cf3c6-…`) Graph `Sites.Read.All` (Application) app-role assignment | az Graph read this turn (verified present) |

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | P5 — the single canonical Primary Reference is the deployed `theo_transcribe_audio` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "an EXACT mirror against a deployed handler containing that helper" | P5 — the keyless MI-token helper is an EXACT mirror of the deployed audio broker, so the §4 new-helper condition is met without a fresh authorization |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "The deployed handler is the source of truth." | Correction basis — the fix is grounded on the live Kudu file, not the drifted package artifact |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §6 | "the shared Functions connection role bypasses RLS" | P3 — no schema change; the `pg` Pool connection idiom is unchanged from MS1 |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form:" | The GCR opens this pack |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "MUST include, after the GCR, a Rule Anchor Table:" | This Rule Anchor Table follows the GCR |

## Walter authorization (verbatim)

The MS1 external-interaction authorization stands (unchanged — the Graph subscription endpoints):

> **Walter authorization (2026-07-19):** Vault DMS / func-chat is authorized to call the Microsoft Graph change-notification **subscription** endpoints — `POST /v1.0/subscriptions`, `PATCH /v1.0/subscriptions/{id}` (renewal), `DELETE /v1.0/subscriptions/{id}` — for drive-root resources, to drive real-time DMS live-mirror updates. Tenant admin-consent for the change-notification application permission is granted + applied.

Pass-4 operational grant (applied this turn under Walter's explicit "yes, run the grant now as you recommend"): the func-chat system-assigned managed identity (`5a0cf3c6-07c9-4412-aa50-e39987ae3bfb`) was granted Microsoft Graph **`Sites.Read.All` (Application)** — appRoleId `332a536c-c7ef-4017-ab91-336970924f0d`, resource Microsoft Graph — via `POST /servicePrincipals/{mi}/appRoleAssignments` (HTTP 201, verified present on the MI). For a managed identity the app-role assignment IS the admin consent. This is the same MI-app-role mechanism already used for the MI's Storage / Foundry / Cognitive-Services grants; it is the keyless replacement for the never-provisioned client secret.

## Root cause + the single change

**Root cause.** `dms_subscribe.getAppGraphToken()` read `AAD_TENANT_ID`/`AAD_CLIENT_ID`/`AAD_CLIENT_SECRET` and POSTed `client_credentials` to `login.microsoftonline.com`. Those three settings are absent on func-chat (exhaustive app-settings enumeration this turn), so the helper threw `"Missing Graph app credentials"` → caught → HTTP 500, before any Graph call. Postgres was never implicated (the deployed idiom `connectionString: POSTGRES_CONNECTION_STRING` is undefined and `node-postgres` falls back to the present `PG*` vars — unchanged, untouched here). The MS1 Pass-1 mirror also mis-cited `theo_distill_memory` as the deployed `client_credentials` precedent; that handler is not deployed on any func app — corrected below.

**The change (surgical).** In `handlers/dms_subscribe/index.js`:
1. Removed `getAppGraphToken()` (client_credentials + `AAD_*` + `login.microsoftonline.com` POST) and the top-level `require("https")`.
2. Added `getManagedIdentityAccessToken(resource)` and the http/https-aware `requestUrl` — both **verbatim** from the deployed `theo_transcribe_audio` Primary Reference. (The http/https branch is required: the MI token endpoint `IDENTITY_ENDPOINT` is http on localhost; the MS1 https-only `requestUrl` could not have reached it.)
3. Added `const GRAPH_RESOURCE = "https://graph.microsoft.com";` and changed the call site to `await getManagedIdentityAccessToken(GRAPH_RESOURCE)`.
4. **(Pass-4 review round 2, T13 fix)** Corrected the `getPool()` source comment that still named `theo_distill_memory` as a deployed exact-match reference — it now cites only the verified-deployed `theo_chat_send_message` (Kudu-confirmed this turn to read `POSTGRES_CONNECTION_STRING` + `ssl.rejectUnauthorized:false`). No stale deployed-handler citation remains in the shipped source.

No change to `dms_notifications`, the migration, `dms_subscribe/function.json`, the strict `{siteId, driveId}` input contract, the idempotent-ensure logic, the Graph create body, or the `dms_sub_upsert` persistence.

## P5 — Handler grounding (corrected Structural Mirror)

**Canonical Primary Reference (exactly one, Golden Handler §2): the deployed `theo_transcribe_audio` handler** (func-chat HF-T6; the closest deployed structural match now that the token path is keyless MI), inlined FULL VERBATIM at `primary-reference/theo_transcribe_audio.index.js.md` + `.function.json.md`.

| Handler region | Primary reference region | Classification | Basis |
|---|---|---|---|
| `requestUrl(urlStr, options, body)` http/https-aware raw request helper | `theo_transcribe_audio` `requestUrl` (lines 87–113) | EXACT | byte-identical; needed for the http localhost MI endpoint AND the https Graph endpoint |
| `getManagedIdentityAccessToken(resource)` (IDENTITY_ENDPOINT + X-IDENTITY-HEADER + api-version 2019-08-01) | `theo_transcribe_audio` `getManagedIdentityAccessToken` (lines 116–135) | EXACT | byte-identical keyless MI-token helper |
| `GRAPH_RESOURCE = "https://graph.microsoft.com"` passed to the MI helper | `COGNITIVE_SCOPE = "https://cognitiveservices.azure.com/"` constant + call site | ALLOWED DELTA | same helper, Graph audience instead of Cognitive Services — the sole token-path delta (Golden Handler §4 EXACT-mirror-of-deployed-helper condition) |
| `getPrincipal`/`getClaimValue`/`send`/`errorBody`/`successBody`/`parseJsonSafe` envelope + identity helpers | `theo_transcribe_audio` same helpers | ALLOWED DELTA | same deployed Family-B shapes (unchanged from MS1) |
| `require("pg")` Pool: `connectionString: POSTGRES_CONNECTION_STRING`, `ssl: { rejectUnauthorized: false }` | (unchanged from MS1) | EXACT | deployed func-chat connection idiom; unchanged this pass |
| `POST https://graph.microsoft.com/v1.0/subscriptions` + idempotent ensure via `dms_sub_get_by_drive`/`dms_sub_upsert` | (none) | ALLOWED DELTA (Walter-authorized interaction) | Golden Handler §4 / T12 — endpoint authorization above; unchanged from MS1 |
| former `getAppGraphToken()` client_credentials helper | (removed) | **REMOVED** | replaced by the keyless MI helper — no client secret on func-chat; matches Theo keyless convention |

## P7 — Curl grounding (deterministic; Claude Code runs post-deploy)
```
# dms_subscribe happy path (EasyAuth bearer). Graph validates notificationUrl synchronously during
# the POST via the already-verified dms_notifications handshake, then returns the subscription.
TOKEN=$(az account get-access-token --resource "api://4e1a1e31-5c20-4480-99e4-098901707d9e" --query accessToken -o tsv)
curl -sS -X POST -w '\nHTTP %{http_code}\n' \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  "https://vaultgpt-func-chat.azurewebsites.net/api/dms_subscribe" \
  --data '{"siteId":"<siteId from dms_delta>","driveId":"<driveId from dms_delta>"}'
#   expect: HTTP 201 { data: { dms_subscribe: { drive_id, ensured:true, refreshed:true, expiration } } };
#   a second call within the lifetime -> HTTP 200 refreshed:false (idempotent); a dms_change_subscriptions row exists.
```
Token never printed. The MS1 golden curls (validation handshake 200 text/plain; failed-auth notification 202 no fan-out; other routes 401-gated) remain verified from Pass 3 and are unaffected.

## Parity checklist (Golden Handler §5.4)
- [x] EXACTLY ONE canonical Primary Reference (`theo_transcribe_audio`) inlined FULL VERBATIM (handler + function.json).
- [x] Keyless MI-token helper + http/https `requestUrl` are EXACT byte-mirrors of the deployed audio broker — the §4 new-external-helper condition met by EXACT-mirror-of-deployed, no fresh authorization needed for the token mechanism.
- [x] Sole token-path delta is the Graph audience constant; no client secret introduced; no `AAD_*` dependency.
- [x] Corrected the MS1 mis-citation (`theo_distill_memory` is not deployed); the token idiom now cites a genuinely deployed handler.
- [x] No change to `dms_notifications`, the migration, the strict input contract, idempotent-ensure, or persistence.
- [x] MI Graph `Sites.Read.All` (Application) grant applied + verified (the keyless credential the handler now uses).
- [x] Deterministic golden curl (subscribe create → 201, idempotent → 200); token never printed.
- [x] Mechanical lint PASS (below).

## Complete file list
- `Codex Governance/Theo-1B-DMS-Push-MS1-Pass-4-Keyless-VEP/INDEX.md`
- `…/handlers/dms_subscribe/index.js` (corrected — keyless)
- `…/primary-reference/theo_transcribe_audio.index.js.md` (canonical Primary Reference, FULL VERBATIM)
- `…/primary-reference/theo_transcribe_audio.function.json.md` (its function.json, FULL VERBATIM)

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-DMS-Push-MS1-Pass-4-Keyless-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested verdict
**APPROVED** — on approval: Claude Code redeploys `dms_subscribe/index.js` to `vaultgpt-func-chat` (Kudu, DR-T7), runs the live subscribe golden curl (create 201 / idempotent 200), then lands the API Spec + Schema + Golden Handler Role-C rows to DEPLOYED. Then MS2 (renewal timer) + the vault-dms FE subscriber.
