# Theo 1B — Tier DMS-Push, MS2: subscription renewal timer (Backend, Pass 1 VEP)

Controlling artifact for Codex review. Self-contained: the single handler under `handlers/dms_renew_subscriptions/`, canonical Primary Reference inlined under `primary-reference/`. MS2 makes the MS1 live-mirror push **durable**: a timer on `vaultgpt-func-chat` renews each Microsoft Graph change-notification subscription before its ~55-minute lifetime lapses, so real-time DMS updates keep flowing without a user re-triggering `dms_subscribe`. No new external interaction (the renewal endpoint `PATCH /v1.0/subscriptions/{id}` is covered by the MS1 Walter authorization), no schema change (the renewal SQL functions were deployed in the MS1 migration), no new secret (keyless managed identity, as MS1).

## Grounding Conformance Receipt

```
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: 12b44dde2316f06cc6d10c5c7c5a3f8c4907a561 (the commit that first adds this package — T29 presence probe resolves here and at every later commit)
```

| # | Document / artifact (path) | Read this turn |
|---|----------------------------|----------------|
| 1 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 canonical Primary Reference; §3 scheduled-timer SECURITY DEFINER enumeration exemption; §4 Allowed Deltas; §5.5 deployed = source of truth; §6 HF-T8) | Read FULL this turn |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A.1 P5; §5 Rule Anchor) | Read §3/§4A/§5 this turn |
| 3 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§9 DEPLOYED DDL — `dms_change_subscriptions` + the SECURITY DEFINER access functions) | Read §9 this turn |
| 4 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.13 DMS-Push — the renewal-timer follow-on is named there) | Read §2.13 this turn |
| 5 | **CANONICAL Primary Reference** — deployed `dms_subscribe.index.js` (func-chat; keyless MI-token + http/https `requestUrl` + pg Pool + Graph call + app-infra SECURITY DEFINER access) — inlined FULL VERBATIM at `primary-reference/dms_subscribe.index.js.md` | Read deployed bytes this turn |
| 6 | CANONICAL Primary Reference — its `dms_subscribe.function.json` — inlined FULL VERBATIM at `primary-reference/dms_subscribe.function.json.md` | Read this turn |
| 7 | func-chat deployed function inventory (29 functions, ALL httpTrigger — no deployed timer precedent → the timer binding is greenfield) | az functions list this turn |
| 8 | MS1 migration `migration_dms_change_subscriptions.sql` — `dms_sub_list_expiring(timestamptz)` / `dms_sub_touch_expiration(text, timestamptz)` / `dms_sub_delete(text)` signatures | Grep this turn |

## Rule Anchor Table

| Source doc (path) | Clause id | Verbatim clause text | Applied in output at |
|-------------------|-----------|----------------------|----------------------|
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | P5 — single canonical Primary Reference is the deployed `dms_subscribe` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "where a **scheduled (timer) handler** invokes an explicit SECURITY DEFINER **enumeration helper**" | The timer invokes `dms_sub_list_expiring` (returns identifiers only — subscription_id/drive_id/expiration, never user content) — the §3 timer exemption, so no caller identity is needed |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "an EXACT mirror against a deployed handler containing that helper" | The keyless MI-token + http/https request helpers are EXACT mirrors of the deployed `dms_subscribe` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "The deployed handler is the source of truth." | Primary Reference is the live deployed `dms_subscribe`, not a drifted artifact |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §9 | "six SECURITY DEFINER functions" | P3 — the renewal functions (`dms_sub_list_expiring`/`_touch_expiration`/`_delete`) are already DEPLOYED; MS2 adds no schema |
| spec/THEO_API_SPEC.md | §2.13 | "renewal timer, before the ~55-min expiry" | P1/P4 — MS2 is the named renewal-timer follow-on; no new HTTP contract |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "Every substantive Claude Code or Codex turn MUST open with a table of the form:" | The GCR opens this pack |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "MUST include, after the GCR, a Rule Anchor Table:" | This Rule Anchor Table follows the GCR |

## Walter authorization (verbatim; predates this VEP — covers the renewal endpoint)

> **Walter authorization (2026-07-19):** Vault DMS / func-chat is authorized to call the Microsoft Graph change-notification **subscription** endpoints — `POST /v1.0/subscriptions`, `PATCH /v1.0/subscriptions/{id}` (renewal), `DELETE /v1.0/subscriptions/{id}` — for drive-root resources, to drive real-time DMS live-mirror updates. Tenant admin-consent for the change-notification application permission is granted + applied.

The renewal `PATCH` (and the stale-drop `DELETE` semantic, realized here as the app-infra `dms_sub_delete` row cleanup rather than a Graph DELETE) are both inside this authorization. No new external interaction is introduced by MS2.

## P1 — Feature identification
Tier DMS-Push, microstep **MS2 — subscription renewal timer** (the durability follow-on named in MS1 and API Spec §2.13). Deliverable: one timer handler `dms_renew_subscriptions` on `vaultgpt-func-chat`. The vault-dms FE subscriber is a separate later step.

## P2 — Architecture & boundary reconciliation
- **Scheduled handler, no caller identity.** `dms_renew_subscriptions` is a timer — there is no user and no EasyAuth principal. It invokes the app-infra SECURITY DEFINER **enumeration** helper `dms_sub_list_expiring` (returns ONLY identifiers — `subscription_id`/`drive_id`/`expiration`, never user content), which is exactly the scheduled-timer exemption in Golden Handler §3. The app connection role (member of `authenticated`) may execute the deployed `GRANT EXECUTE … TO authenticated` functions; SECURITY DEFINER runs as the migration owner and bypasses RLS on the app-infra table — no user session required.
- **No new external interaction.** The only outbound call is `PATCH https://graph.microsoft.com/v1.0/subscriptions/{id}` (renewal) with the SAME keyless managed-identity app-only Graph token as MS1 (`Sites.Read.All` Application). This endpoint is inside the verbatim Walter authorization above.
- **No schema change.** `dms_sub_list_expiring` / `dms_sub_touch_expiration` / `dms_sub_delete` were deployed by the MS1 migration (Schema §9). MS2 adds no table, column, policy, or function.
- **No new secret.** Keyless MI, identical to MS1 / HF-T6.
- **Boundary.** Deploy target `vaultgpt-func-chat` only. No `reporting_*` touched; no `theo_` ownership table touched; monolith/sidecar/func-dms unchanged. The signal path is unchanged (MS2 only keeps subscriptions alive; `dms_notifications` fan-out and delegated `dms_delta` trimming are untouched).

## Gap Register
**NO-GAPS.** The renewal endpoint is pre-authorized; the SQL functions are deployed; the token path is the deployed keyless MI idiom; no schema/contract/secret change. No foreseeable downstream gap is surfaced. (Operational note, not a gap: a `timerTrigger` on the EP1 plan runs on the always-warm instance; no app-setting change is required — `IDENTITY_ENDPOINT`/`IDENTITY_HEADER`/`POSTGRES_CONNECTION_STRING`/`PG*` already present and exercised by MS1.)

## P3 — Schema grounding (DEPLOYED)
No PROPOSED schema. Uses only DEPLOYED functions (Schema §9): `public.dms_sub_list_expiring(p_before timestamptz)` (near-expiry enumeration), `public.dms_sub_touch_expiration(p_subscription_id text, p_expiration timestamptz)` (record renewed expiration), `public.dms_sub_delete(p_subscription_id text)` (drop a row Graph 404s). All SECURITY DEFINER, `GRANT EXECUTE … TO authenticated`.

## P4 — Contract grounding
No HTTP contract — a timer has no route. No API Spec delta (§2.13 already names the renewal timer as the follow-on; the two DMS-Push HTTP routes are unchanged). Schedule: NCRONTAB `0 */15 * * * *` (every 15 min); renews anything expiring within `RENEW_LOOKAHEAD_MINUTES` (20) to a fresh `SUBSCRIPTION_MINUTES` (55) lifetime — comfortably inside the window (a sub becomes eligible with <20 min left and is renewed by the next tick with >5 min to spare).

## P5 — Handler grounding (Structural Mirror)
Handler in-pack at `handlers/dms_renew_subscriptions/`. **Canonical Primary Reference (exactly one, Golden Handler §2): the deployed `dms_subscribe` handler** (the closest deployed structural match — same pg Pool, keyless MI-token + http/https `requestUrl`, `GRAPH_RESOURCE`, app-only Graph call, app-infra SECURITY DEFINER access), inlined FULL VERBATIM at `primary-reference/dms_subscribe.index.js.md` + `.function.json.md`.

| Handler region | Primary reference region | Classification | Basis |
|---|---|---|---|
| `require("pg")` Pool: `connectionString: POSTGRES_CONNECTION_STRING`, `ssl: { rejectUnauthorized: false }` + `getPool()` | `dms_subscribe` `getPool()` | EXACT | byte-identical deployed connection idiom |
| `requestUrl(urlStr, options, body)` http/https-aware helper | `dms_subscribe` `requestUrl` | EXACT | byte-identical (needed for http MI endpoint + https Graph) |
| `getManagedIdentityAccessToken(resource)` + `GRAPH_RESOURCE` | `dms_subscribe` same helper + constant | EXACT | byte-identical keyless MI-token idiom |
| `parseJsonSafe` | `dms_subscribe` `parseJsonSafe` | EXACT | byte-identical |
| `dms_sub_list_expiring` enumeration + loop renewing each | (none in reference) | ALLOWED DELTA (Golden Handler §3 timer exemption) | scheduled-timer enumeration helper returning identifiers only — §3 exemption cited above |
| `PATCH https://graph.microsoft.com/v1.0/subscriptions/{id}` (renewal) + `dms_sub_touch_expiration` / stale-`dms_sub_delete` | `dms_subscribe` `POST /subscriptions` + `dms_sub_upsert` | ALLOWED DELTA (Walter-authorized interaction) | renewal `PATCH` inside the verbatim authorization; same app-infra service-access idiom |
| `timerTrigger` binding + `module.exports(context, myTimer)` | `dms_subscribe` `httpTrigger` + `(context, req)` | **GREENFIELD** | no deployed timer handler on any func app (29 func-chat functions all httpTrigger, verified this turn); standard Azure Functions v4 classic `timerTrigger` shape, NCRONTAB schedule |
| EasyAuth `oid` gate / CORS / `send`/`errorBody`/`successBody` HTTP-envelope helpers | present in `dms_subscribe` | **REMOVED** | a timer has no caller and no HTTP response — envelope + identity gate are correctly absent (Golden Handler §3 scheduled-handler class) |

## P6 — SQL grounding
None. MS2 executes only DEPLOYED SECURITY DEFINER functions (P3). No migration in this pack.

## P7 — Verification grounding (timer — no HTTP surface, so no curl)
A timer has no route, so §5.3 golden-curl determinism does not apply; verification is an on-demand trigger + effect check:
```
# 1) Manual on-demand trigger via the Functions admin API (Kudu master key / ARM bearer):
#    POST https://vaultgpt-func-chat.azurewebsites.net/admin/functions/dms_renew_subscriptions  {}
#    expect: HTTP 202 (accepted); the invocation log records "examined N, renewed R, dropped D, failed F".
# 2) Effect check (read-only): the live MS1 subscription created 2026-07-19 (expiration ~18:26Z) has its
#    expiration advanced ~55 min after a tick — verify via a read of dms_sub_get_by_drive(<driveId>) that
#    `expiration` moved forward. (Read-only; write path is the SECURITY DEFINER dms_sub_touch_expiration.)
# 3) Negative: a subscription id unknown to Graph -> 404 -> dropped via dms_sub_delete (log "dropped").
```
Claude Code runs the on-demand trigger + read-only effect check post-deploy (no token printed).

## P8 — VEP assembly
This document + the in-pack handler (`index.js` + `function.json`) + the inlined Primary Reference.

## Parity checklist (Golden Handler §5.4)
- [x] EXACTLY ONE canonical Primary Reference (`dms_subscribe`) inlined FULL VERBATIM (handler + function.json).
- [x] pg Pool + keyless MI-token + http/https `requestUrl` + `parseJsonSafe` are EXACT byte-mirrors of the deployed `dms_subscribe`.
- [x] Timer binding classified GREENFIELD (no deployed timer precedent); standard v4 `timerTrigger` NCRONTAB.
- [x] Scheduled-handler SECURITY DEFINER enumeration use grounded in Golden Handler §3 (identifiers only, no user content).
- [x] No new external interaction — renewal `PATCH` inside the verbatim Walter authorization.
- [x] No schema change — renewal functions already DEPLOYED (Schema §9).
- [x] No new secret — keyless MI, `Sites.Read.All` (Application) already granted + verified.
- [x] Verification is on-demand-trigger + read-only effect check (timer has no curl surface); token never printed.
- [x] Mechanical lint PASS (below).

## Complete file list
- `Codex Governance/Theo-1B-DMS-Push-MS2-Renewal-Backend-Pass-1-VEP/INDEX.md`
- `…/handlers/dms_renew_subscriptions/index.js`
- `…/handlers/dms_renew_subscriptions/function.json` (timerTrigger)
- `…/primary-reference/dms_subscribe.index.js.md` (canonical Primary Reference, FULL VERBATIM)
- `…/primary-reference/dms_subscribe.function.json.md` (its function.json, FULL VERBATIM)

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-DMS-Push-MS2-Renewal-Backend-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested verdict
**APPROVED** — on approval: Claude Code deploys `dms_renew_subscriptions` (index.js + function.json) to `vaultgpt-func-chat` (Kudu, DR-T7), runs the on-demand trigger + read-only effect check, then Role-C appends the MS2 renewal-timer note to Golden Handler HF-T8 / API Spec §2.13. Then the vault-dms FE subscriber (join `dms-changes` → delegated `dms_delta` on a ping) completes the OneDrive-grade DMS.
