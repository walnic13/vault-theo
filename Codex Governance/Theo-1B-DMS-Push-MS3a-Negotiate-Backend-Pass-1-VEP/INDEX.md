# Theo 1B — Tier DMS-Push, MS3a: DMS realtime negotiate (Backend, Pass 1 VEP)

Controlling artifact for Codex review. Self-contained: the single handler under `handlers/dms_negotiate/`, canonical Primary Reference inlined under `primary-reference/`. MS3a issues the **receive-only** Azure Web PubSub client token the DMS live-mirror subscriber needs to hear the MS1 fan-out. It deliberately does **not** touch the deployed `theo_chat_negotiate` or the live chat connection — a DMS feature must not put chat realtime at risk — so `dms_negotiate` is a new, isolated endpoint that issues a token auto-joined to only the constant `dms-changes` broadcast group. No DB, no schema change, no new external interaction (Web PubSub token issuance is already the deployed chat idiom).

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: b41d30fb6e0eff118cdaf646b5056900bce47a1f
```

| # | Document / artifact (path) | Read this turn |
|---|----------------------------|----------------|
| 1 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 canonical Primary Reference; §4 Allowed Deltas; §5.5 deployed = source of truth) | Read this turn |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A.1 P5; §5 Rule Anchor) | Read §3/§4A/§5 this turn |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.13 DMS-Push — the FE subscriber follow-on is named there) | Read §2.13 this turn |
| 4 | **CANONICAL Primary Reference** — deployed `theo_chat_negotiate.index.js` (func-chat; `WebPubSubServiceClient.getClientAccessToken` receive-only token issuer, hub `vaultchat`) — inlined FULL VERBATIM at `primary-reference/theo_chat_negotiate.index.js.md` | Kudu-GET this turn (HTTP 200) |
| 5 | CANONICAL Primary Reference — its `theo_chat_negotiate.function.json` — inlined FULL VERBATIM at `primary-reference/theo_chat_negotiate.function.json.md` | Kudu-GET this turn (HTTP 200) |
| 6 | Deployed `dms_notifications` fan-out target (hub `vaultchat`, group `dms-changes`) — the group `dms_negotiate` must auto-join to match | Grounded via MS1 pack + Golden Handler §6 HF-T8 this turn |

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | P5 — single canonical Primary Reference is the deployed `theo_chat_negotiate` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "an EXACT mirror against a deployed handler containing that helper" | P5 — the `getClientAccessToken` receive-only token idiom is an EXACT mirror of the deployed `theo_chat_negotiate` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "The deployed handler is the source of truth." | Primary Reference is the live deployed `theo_chat_negotiate` |
| spec/THEO_API_SPEC.md | §2.13 | "join `dms-changes` → delegated `dms_delta` on a ping" | P1/P4 — MS3a issues the token that lets the FE join `dms-changes` |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form:" | The GCR opens this pack |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "MUST include, after the GCR, a Rule Anchor Table:" | This Rule Anchor Table follows the GCR |

## P1 — Feature identification
Tier DMS-Push, microstep **MS3a — DMS realtime negotiate** (the backend half of the "vault-dms FE subscriber" follow-on named in API Spec §2.13). Deliverable: one HTTP handler `dms_negotiate` on `vaultgpt-func-chat`. The vault-dms FE subscriber that consumes this token is MS3b (separate FE VEP).

## P2 — Architecture & boundary reconciliation
- **New isolated endpoint — chat untouched.** `dms_negotiate` is net-new; it does not modify `theo_chat_negotiate` or the live chat Web PubSub connection. A DMS feature carries no risk to chat realtime.
- **Receive-only token (server-authoritative).** `getClientAccessToken({ userId, groups: ["dms-changes"] })` is issued with **NO roles** — identical posture to `theo_chat_negotiate` — so the client can receive but never publish or mutate groups. All `dms_changed` signals are fanned server-side by `dms_notifications`; no client can spoof a change event.
- **Broadcast group, no per-user scoping needed.** Unlike chat threads (RLS-scoped per participant), the DMS signal is an **opaque `drive_id`** on a single constant group `dms-changes`. Every employee joins the same group and each client filters to the drive it is viewing; an unentitled user learns nothing (employees-only hub; no file data in the signal). Hence the `pg` Pool + `set_config` + membership query of the reference are correctly REMOVED.
- **Hub + group match the fan-out.** `HUB = "vaultchat"` and `DMS_GROUP = "dms-changes"` are pinned to the deployed `dms_notifications` fan-out target (Golden Handler §6 HF-T8) — a mismatch would silently drop signals.
- **Boundary.** Deploy target `vaultgpt-func-chat` only. No `reporting_*`, no `theo_` table, no schema, no monolith/sidecar/func-dms change. No new external system (Web PubSub is already the deployed chat transport).

## Gap Register
**NO-GAPS.** No schema/contract/secret/external-interaction change; the token idiom is the deployed chat pattern; hub/group are pinned to the deployed fan-out. The MS3b FE subscriber (vault-dms) consumes this token and is the named follow-on (not a gap — a planned separate microstep). No API Spec row change is required for MS3a beyond the §2.13 note already landed (the negotiate is an internal realtime-transport endpoint); MS3b's FE VEP will reference it.

## P3 — Schema grounding
None. `dms_negotiate` touches no database (the reference's `pg` Pool + `set_config` + `theo_chat_threads` query are removed).

## P4 — Contract grounding
PROPOSED func-chat route: `GET /api/dms_negotiate` (no body) → **200** `{ data: { url, hub, groups: ["dms-changes"] } }` — a receive-only Web PubSub client-access URL for hub `vaultchat`. `OPTIONS` → 204. Missing EasyAuth identity → **401 `UNAUTHORIZED`**; realtime unconfigured → **500**. Same response envelope as `theo_chat_negotiate`. Route naming `dms_<operation>` per API Spec §1. (API Spec §2.13 already names the FE subscriber; the negotiate row lands with the MS3b FE VEP so the FE-consumed contract is recorded alongside its consumer.)

## P5 — Handler grounding (Structural Mirror)
Handler in-pack at `handlers/dms_negotiate/`. **Canonical Primary Reference (exactly one, Golden Handler §2): the deployed `theo_chat_negotiate`**, inlined FULL VERBATIM at `primary-reference/theo_chat_negotiate.index.js.md` + `.function.json.md`.

| Handler region | Primary reference region | Classification | Basis |
|---|---|---|---|
| `getPrincipal` / `getClaimValue` / `send` / `errorBody` / `successBody` / `nowIso` + `corsHeaders` | `theo_chat_negotiate` same helpers | EXACT | byte-identical envelope + identity helpers |
| EasyAuth `oid` gate → 401; `WebPubSubConnectionString` presence → 500; `OPTIONS` → 204 | `theo_chat_negotiate` same gates | EXACT | identical gating |
| `new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB)` + `getClientAccessToken({ userId: oid, groups })` (NO roles → receive-only) | `theo_chat_negotiate` same calls | EXACT (idiom) | byte-identical receive-only token issuance; `HUB="vaultchat"` unchanged |
| `groups: ["dms-changes"]` (constant broadcast group) | `groups: threadIds` (RLS-scoped) | ALLOWED DELTA | same token API, a constant broadcast group instead of per-user thread groups (P2 rationale) |
| `function.json` — `route: "dms_negotiate"` | `route: "theo_chat_negotiate"` | ALLOWED DELTA | route name only; anonymous httpTrigger get/options otherwise identical |
| `pg` Pool + `pool.connect()` + `set_config(...)` + `theo_chat_threads` membership query + `finally client.release()` + `42501`→403 | present in reference | **REMOVED** | no per-user data scoping for an opaque-drive-id broadcast group — no DB access at all (P2) |

## P6 — SQL grounding
None. No database access.

## P7 — Curl grounding (deterministic; Claude Code runs post-deploy)
```
# dms_negotiate (EasyAuth bearer) -> 200 with a receive-only client-access url for hub vaultchat,
# groups=["dms-changes"]. Token/url never printed (assert shape only).
TOKEN=$(az account get-access-token --resource "api://4e1a1e31-5c20-4480-99e4-098901707d9e" --query accessToken -o tsv)
curl -sS -w '\nHTTP %{http_code}\n' \
  -H "Authorization: Bearer $TOKEN" \
  "https://vaultgpt-func-chat.azurewebsites.net/api/dms_negotiate"
#   expect: HTTP 200, body { data: { url: "wss://...", hub: "vaultchat", groups: ["dms-changes"] } } (url value not logged).
# Unauthenticated (no EasyAuth) -> 401 (platform + handler oid gate).
curl -sS -o /dev/null -w 'unauth HTTP %{http_code}\n' "https://vaultgpt-func-chat.azurewebsites.net/api/dms_negotiate"
#   expect: HTTP 401.
```
Assertion: (1) 200 with `hub:"vaultchat"` + `groups:["dms-changes"]` and a `url` present (never printed); (2) 401 unauth.

## P8 — VEP assembly
This document + the in-pack handler (`index.js` + `function.json`) + the inlined Primary Reference.

## Parity checklist (Golden Handler §5.4)
- [x] EXACTLY ONE canonical Primary Reference (`theo_chat_negotiate`) inlined FULL VERBATIM (handler + function.json).
- [x] Envelope/identity helpers + gates + `getClientAccessToken` receive-only idiom are EXACT mirrors of the deployed `theo_chat_negotiate`.
- [x] Receive-only token — NO roles granted (server-authoritative; client cannot publish/mutate groups).
- [x] `HUB`/`DMS_GROUP` pinned to the deployed `dms_notifications` fan-out (`vaultchat` / `dms-changes`).
- [x] No DB (pg Pool + set_config + membership query removed — no per-user scoping for an opaque broadcast).
- [x] chat negotiate + live chat connection untouched (isolated new endpoint).
- [x] No schema, no new secret, no new external interaction.
- [x] Deterministic golden curl (200 shape + 401 unauth); token/url never printed.
- [x] Mechanical lint PASS (below).

## Complete file list
- `Codex Governance/Theo-1B-DMS-Push-MS3a-Negotiate-Backend-Pass-1-VEP/INDEX.md`
- `…/handlers/dms_negotiate/index.js`
- `…/handlers/dms_negotiate/function.json`
- `…/primary-reference/theo_chat_negotiate.index.js.md` (canonical Primary Reference, FULL VERBATIM)
- `…/primary-reference/theo_chat_negotiate.function.json.md` (its function.json, FULL VERBATIM)

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-DMS-Push-MS3a-Negotiate-Backend-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested verdict
**APPROVED** — on approval: Claude Code deploys `dms_negotiate` (index.js + function.json) to `vaultgpt-func-chat` (Kudu, DR-T7), runs the golden curls (200 shape + 401 unauth), then proceeds to MS3b (the vault-dms FE subscriber that consumes this token, joins `dms-changes`, and fires `revalidateSiteViaDelta` on a `dms_changed` ping) — with the API Spec `dms_negotiate` row landed alongside MS3b.
