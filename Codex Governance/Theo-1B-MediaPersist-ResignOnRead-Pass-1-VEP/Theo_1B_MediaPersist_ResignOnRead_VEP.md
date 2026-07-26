# Theo 1B — Chat Media Persistence: re-sign persisted images on read (durable reload) — Pass 1 Backend VEP (PLAN ONLY)

> Pipeline: Vault Theo backend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only; on APPROVAL, Pass 3 deploys the single handler `theo_get_conversation/index.js` to `vaultgpt-func-premium` via **surgical Kudu VFS** under the **DR-T15** carve-out (Golden Handler §5.5), then Claude Code runs the golden curls. **Bug:** `theo_find_image` caches fetched images to our own Blob and returns a **60-minute read-SAS** URL; that exact URL is persisted in `theo_messages.media`. The blob is durable but the SAS token expires, so after a hard refresh past the hour the reloaded chat's images render as **broken frames** (403). **Fix:** on the reload read, `theo_get_conversation` re-mints a **fresh read-SAS** for each persisted image URL that points at our own storage container under the requesting user's own `images/<oid>/` prefix (one shared user-delegation key per reload). Public URLs (Wikimedia/Commons, YouTube thumbnails) pass through unchanged. Best-effort: a signing failure logs and returns the stored URLs — the read never fails. **No contract/schema/migration/FE change; `function.json` unchanged.**

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `ece849407370ec9bb8713eb76eda0417cc6969a6` (vault-theo, `development`; main == development)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — backend Verified Evidence Pack (Conformance §4 matrix, "Verified Evidence Pack (backend plan)" row = Full Baseline Grounding). The **Primary Reference** (Golden Handler §2) is the **deployed `theo_get_conversation` `index.js` + its `function.json`** — both committed full-verbatim in this package under `primary-reference/`, byte-identical to the live premium handler (their blob SHAs match the deployed blobs `9fad1acb` / `11257bb1`). The MI user-delegation-SAS helpers are **reused byte-verbatim** (T12 authorized-helper reuse) from the **deployed premium `theo_create_attachment_upload`** (committed `primary-reference/theo_create_attachment_upload.DEPLOYED.index.js`, blob `bc1aa7c51ad5b55e84d4fa625b443cab70dc8175`) — premium already mints user-delegation SAS against this exact account/container for attachments, so the re-sign needs **no new role grant, capability, or dependency**. The change is **additive** (one baseline line changed: the success-return `messages` binding); verified via `diff` this turn. `node -c` syntax check passes on the proposed handler. **No contract change** (API Spec §2.1 `messages[].media` shape is unchanged — only the SAS token inside `media.image.url`/`images[].imageUrl` is refreshed); **no schema/migration change** (heals existing rows in place); **no FE change** (`<img>` renders whatever URL is returned).
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>` / `git hash-object`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 Primary Reference; §5.1 Structural Mirror; §5.3 Golden Curl; §5.5 Deploy/Kudu + DR-T15) | `Read`/`Grep` this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§4/§5; T9/T10/T12/T13) | `Read`/`Grep` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (DR-T15 premium deploy carve-out) | `Grep` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` | cited (regime governor) | `e44cdd85d3d0e5df332dc754cdec731e2e68022e` |
| 5 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_get_conversation` → `messages[].media`; UNCHANGED by this VEP) | `Grep` this turn | `a667f4174659b0d7b6e7aa54709047249627420a` |
| 7 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§5 `theo_messages.media`; UNCHANGED) | `Grep` this turn | `a698d85692b3ccaf052e639f226c76d31c20c0df` |
| 8 | **PRIMARY REFERENCE (handler)** — deployed `theo_get_conversation/index.js` — `Codex Governance/Theo-1B-MediaPersist-ResignOnRead-Pass-1-VEP/primary-reference/theo_get_conversation.DEPLOYED.index.js` (byte-identical to live) | `Read(full)` this turn | `9fad1acb00387c757ad5ea936ddad70b5575dae8` |
| 9 | **PRIMARY REFERENCE (function.json)** — deployed `theo_get_conversation/function.json` — `.../primary-reference/theo_get_conversation.function.json` | `Read(full)` this turn | `11257bb1733f0f351b04fc58e2355119c754902b` |
| 10 | **T12 authorized-helper source** — deployed premium `theo_create_attachment_upload` (MI/UDK/SAS helpers) — `.../primary-reference/theo_create_attachment_upload.DEPLOYED.index.js` | `Read(full)` this turn | `bc1aa7c51ad5b55e84d4fa625b443cab70dc8175` |
| 11 | **PROPOSED (deploy artifact)** — `theo_get_conversation/index.js` (baseline + re-sign) | authored + syntax-checked this turn | `149e080df83e25bd6ee87d9bb267be11eba14abd` |

No ChatGPT advisory cited. No `corporate-reporting`/`reporting_*` change. No DB write/migration (heals in place). No branch merge. No app-setting/resource change on premium. Credentials never printed.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "A grounding mode requiring broad document-level review of all authority documents required for a new feature/microstep plan" | GCR grounding mode = Full Baseline |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Verified Evidence Pack (backend plan)" | GCR turn type / grounding basis |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file and **exactly one** deployed `function.json` file as the canonical Primary Reference, and inlines both full-verbatim in the turn" | §P4 Primary Reference (committed full-verbatim) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "A **new-domain or new-external-system helper** classified as ALLOWED DELTA requires either an EXACT mirror against a deployed handler containing that helper" | §P4/§P5 — SAS helpers EXACT-mirror the deployed `theo_create_attachment_upload` (T12) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.1 | "mapping every handler region to the Primary Reference region with its EXACT / ALLOWED DELTA / DEVIATION classification" | §P5 Structural Mirror Table |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Claude Code MAY deploy directly via **surgical Kudu VFS overwrite**" | §P7 Deploy (DR-T15, Kudu VFS) |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §5.5 | "Curl verification is ALWAYS Claude Code's job" | §P6 Golden curls |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T15 | "Claude Code MAY deploy its `index.js` (+ `function.json` only if changed) via **surgical Kudu VFS overwrite**" | §P7 — deploy `index.js` only (`function.json` unchanged) |

---

## P1 — Feature identification
**Microstep:** Chat Media Persistence durability. Persisted `theo_messages.media` for a fetched-image turn stores `media.image.url` and/or `media.image.images[].imageUrl`. For SerpAPI/Google-Images results these are **our own Blob** URLs (`vaultgptstorage01/theo-content/images/<oid>/<uuid>.<ext>`) carrying a **60-minute read-SAS** (`theo_find_image` `IMAGE_SAS_TTL_MINUTES = 60`). The blob is durable; the token is not. On reload past the hour, `<img>` → 403 → broken frame (and the lightbox, using the same URL, breaks identically). This VEP makes the reload read **re-mint a fresh read-SAS** for those URLs so they always resolve.

**Out of scope:** `theo_find_image` (live display already returns fresh SAS — unchanged); the FE (renders whatever URL is returned — unchanged); videos (YouTube embeds are public — unchanged); Wikimedia/Commons images (public URLs — unchanged, and skipped by the host check).

## P2 — Contract grounding
- **API Spec §2.1** (`theo_get_conversation` → `messages: [{ …, media, … }]`) is the consumed contract and is **UNCHANGED**: `media` remains the additive nullable `{ image?, video? }`. This VEP only refreshes the SAS **token** inside `media.image.url` / `media.image.images[].imageUrl` — the field shape, presence, and all other fields are untouched. No API Spec edit (no Role-C).
- **Schema §5** (`theo_messages.media jsonb`) is **UNCHANGED** — no DDL, no migration, no backfill. Existing rows heal in place on read.
- **Transport/auth** unchanged: same EasyAuth GET, same response envelope. The re-signed URLs are direct Blob URLs (storage token-authorized; reachable by `<img>` cross-origin without EasyAuth — verified: `func-*` apps 401 unauthenticated, but `blob.core.windows.net` serves on the SAS token).

## P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **60-min re-sign TTL.** Re-minted SAS is fresh for 60 min from the reload. A tab left open >60 min without reloading would see images expire again. | **PROCEED (accepted)** — matches the live-display TTL; any (re)load re-mints. Evergreen serving would need an anonymous proxy, which `func-theo-tools` EasyAuth blocks (probed 401) — deferred. |
| **G-2** | **Only our-storage blob URLs are re-signed.** Public URLs (Wikimedia/Commons, YouTube) are passed through. | **PROCEED (intended)** — public URLs are already durable; the host check (`vaultgptstorage01.blob.core.windows.net` + `/theo-content/` + `images/<oid>/`) skips everything else. |
| **G-3** | **Best-effort.** If the UDK fetch/sign fails, the stored (stale) URLs are returned. | **PROCEED (fail-open on display, not on read)** — a signing failure must never 500 the reload; a broken image is strictly better than a failed conversation load. Logged via `context.log.error`. |
| **G-4** | **Ownership scope.** The blob path embeds the owner OID; the re-sign only touches keys under `images/<oid>/` for the requesting OID. | **PROCEED (defense-in-depth)** — never mints a token for another user's blob even if a stored URL were malformed; messages are already `created_by = oid` scoped. |
| **G-5** | **Signer-source correction.** An earlier deploy of this handler (superseded blob `6653a8c`) spliced the SAS signer from the **pre-fix** B8b attachment package, whose `computeUserDelegationSignature` hand-counted newlines and omitted the `ses` (signedEncryptionScope) field — a 23-field string-to-sign that Azure rejected (`AuthenticationFailed — Signature did not match`, confirmed against a live re-signed URL). | **CORRECTED** — the T12 donor is now the **deployed SAS-Signature-Fix** handler (`bc1aa7c`), whose signer is the explicit **24-field** array (`ses` + `rscl` present) that mints working SAS for attachments/`theo_find_image`. This VEP's proposed `149e080` supersedes `6653a8c`. GC-3 below now **mandates** a live `HEAD 200` on an actual re-signed URL before this deploy is declared successful. |

No other gaps. No `localStorage`/`sessionStorage`; no `reporting_*`/`corporate-reporting`; no DB write/migration; no `function.json` change.

## P3 — Golden SQL
No SQL change. The existing `messages` SELECT (which already returns `media`) is unchanged; the re-sign operates on the returned rows in memory. (The deployed SELECT + RLS-ownership scoping — `WHERE conversation_id = $1 AND created_by = $2` — is in the Primary Reference, unchanged.)

## P4 — Primary Reference (Golden Handler §2)
**PRIMARY REFERENCE (T9 pair), committed full-verbatim in this package, byte-identical to the deployed premium handler:**
- Handler: `primary-reference/theo_get_conversation.DEPLOYED.index.js` — blob `9fad1acb00387c757ad5ea936ddad70b5575dae8` (== deployed).
- `function.json`: `primary-reference/theo_get_conversation.function.json` — blob `11257bb1733f0f351b04fc58e2355119c754902b` (== deployed; **unchanged** by this VEP — the proposed `function.json` is byte-identical, so per DR-T15 only `index.js` deploys).

**T12 AUTHORIZED-HELPER SOURCE (Golden Handler §4 — EXACT mirror against a deployed handler containing the helper):** the **deployed premium SAS-Signature-Fix** handler — `primary-reference/theo_create_attachment_upload.DEPLOYED.index.js` — blob `bc1aa7c51ad5b55e84d4fa625b443cab70dc8175`. The MI/UDK/SAS helpers — `requestUrl`, `getManagedIdentityAccessToken`, `xmlEscape`, `encodeBlobPath`, `decodeXmlTag`, `toIsoNoMillis`, `getUserDelegationKey`, `computeUserDelegationSignature` — are **spliced byte-verbatim** into the proposed handler (verified this turn: the donor's lines 95–235 appear verbatim in the proposed `index.js`). The signer is the **24-field** user-delegation string-to-sign (explicit array with `ses`/`signedEncryptionScope` + `rscl` present, per sv=2022-11-02) — the version that mints **working** read-SAS for attachments and `theo_find_image` (see G-5: the superseded first deploy used the pre-fix 23-field signer and failed). Premium's MI already holds the storage access these use (it mints attachment SAS against the same account/container), so **no new grant**.

## P5 — Structural Mirror Table (Golden Handler §5.1)
| Proposed region (`theo_get_conversation/index.js`) | Primary Reference region | Classification |
| --- | --- | --- |
| Lines 1–199 baseline (requires, `pool`, `send`/`errorBody`/`successBody`, `getPrincipal`/`getClaimValue`/`isUuid`, the whole `module.exports` flow incl. ownership scoping + `messages` SELECT) | deployed `theo_get_conversation` (same lines) | **EXACT** (byte-identical; the sole baseline change is the success-return `messages` binding) |
| `const crypto = require("crypto");` + `STORAGE_ACCOUNT`/`STORAGE_CONTAINER`/`IMAGE_RESIGN_TTL_MINUTES` consts | deployed `theo_create_attachment_upload` (same `crypto` + `STORAGE_*` consts) | **EXACT** (mirror of the deployed premium storage handler) |
| MI/UDK/SAS helper block (`requestUrl` … `computeUserDelegationSignature`, incl. the 24-field `ses`/`rscl` signer) | deployed SAS-Signature-Fix `theo_create_attachment_upload` lines 95–235 | **EXACT** (byte-verbatim splice; T12 authorized-helper reuse) |
| `readSasFromUdk` (shared-UDK read-SAS query builder) | deployed `theo_create_attachment_upload` `buildUserDelegationSas` (query-assembly) + deployed `theo_find_image` shared-UDK idiom | **ALLOWED DELTA** — decomposition of the deployed `buildUserDelegationSas` (UDK fetched once, signed per blob), mirroring the deployed `theo_find_image` shared-UDK path (Golden Handler §4; the read-SAS/`sp="r"` is the "specific validated field set" delta) |
| `blobKeyForOid` / `mimeFromKey` / `resignPersistedMedia` (traversal + host/prefix guard + in-place re-sign) | new orchestration over the reused helpers | **ALLOWED DELTA** — feature-specific glue; no new external system (same storage account/API as the deployed helpers); each blob URL guarded to `vaultgptstorage01/theo-content/images/<oid>/` |
| `try { await resignPersistedMedia(messages, oid, context); } catch { log }` before the success return | deployed success-return path | **ALLOWED DELTA** — additive best-effort step; the response envelope + `successBody({ conversation, messages })` shape is unchanged |

No DEVIATION. No new dependency (pure `crypto` + `https`, already used by the donor). No `function.json` change.

## P6 — Golden Curls (Golden Handler §5.3/§5.5 — Claude Code runs these)
Authenticated `az` bearer as `wmansfield@vault-tax.com`, audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e/access_as_user` (Golden Handler Pack §13). Deterministic assertions:

1. **GC-1 (health / EasyAuth):** unauthenticated `GET https://vaultgpt-func-premium.azurewebsites.net/api/theo_get_conversation` → **401** (EasyAuth; a 500 = load/syntax error). *(Confirms the deploy didn't break module load.)*
2. **GC-2 (unchanged contract, no media):** authenticated `GET …/api/theo_get_conversation?conversationId=<owned conv with no image turns>` → **200**, `data.messages[*].media` null/absent exactly as before (no UDK fetch triggered). Assert envelope `{ data: { conversation, messages }, meta }` unchanged.
3. **GC-3 (re-sign heals — MANDATORY runtime proof, gates success):** authenticated `GET …?conversationId=<a persisted image conversation>` → **200**; assert each `data.messages[*].media.image[.images[*]].(url|imageUrl)` that targets `vaultgptstorage01.blob.core.windows.net/theo-content/images/<oid>/…` carries a **fresh** `se=` (≈ now + 60 min) and a `sig=`; then **`HEAD` the returned re-signed URL → 200** (blob actually served). **This deploy is NOT declared successful until GC-3's HEAD returns 200** (the superseded `6653a8c` deploy passed GC-1/2/4 but GC-3's HEAD was 403 — the signer bug, G-5). Only then is Walter's hard-refresh of a persisted-image chat the runtime Visual Acceptance.
4. **GC-4 (403/404 discrimination unchanged):** a non-owned id → **403**; an absent id → **404** (baseline behaviour preserved).

## P7 — Deploy (Golden Handler §5.5 / DR-T15)
- **Target:** `vaultgpt-func-premium`, handler `theo_get_conversation`, **`index.js` only** (`function.json` unchanged — DR-T15: "+ `function.json` only if changed"). **DR-T15** authorizes Claude Code to deploy this exact handler via **surgical Kudu VFS overwrite** after Codex APPROVAL.
- **Procedure (§5.5):** `az account get-access-token` (management resource; never printed) → **Kudu-GET the live `index.js` first** (rollback baseline + confirm it matches the committed Primary Reference blob `9fad1acb`; if the live file has drifted, HALT and re-ground on the live bytes) → `PUT` proposed `index.js` (`If-Match: *`, octet-stream, `--data-binary`; expect 204) → **GET-back + byte-diff** (assert == proposed blob `149e080`) → `az functionapp restart -n vaultgpt-func-premium -g Vault-Tax` → unauth health-curl (expect 401) → run GC-1…GC-4.
- **Rollback:** re-PUT the GET-saved baseline `index.js`.
- **Excluded (DR-T15):** no other premium handler; no DB write/migration; no branch merge; no app-setting/resource change.

## P8 — VEP assembly
GCR + Rule Anchors open the pack; P1→P7 walked; Gap Disclosure (G-1…G-4 PROCEED + G-5 CORRECTED — the signer-source fix from the superseded 23-field to the deployed 24-field `ses`/`rscl` signer); Primary Reference = deployed `theo_get_conversation` `index.js`+`function.json` (committed full-verbatim, byte-identical to live); T12 helper reuse from the deployed SAS-Signature-Fix `theo_create_attachment_upload` (byte-verbatim splice, lines 95–235, verified). Change is additive (one baseline line changed, `diff`-verified); `node -c` passes. No contract/schema/migration/FE/`function.json` change. On Codex APPROVAL, Pass 3 deploys `index.js` (blob `149e080df83e25bd6ee87d9bb267be11eba14abd`, superseding the broken `6653a8c`) to premium via DR-T15 Kudu VFS + runs GC-1…GC-4 — the deploy is declared successful only after GC-3's live re-signed-URL `HEAD` returns 200; Walter's hard-refresh of the persisted image chat (images return) = runtime Visual Acceptance.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-MediaPersist-ResignOnRead-Pass-1-VEP/Theo_1B_MediaPersist_ResignOnRead_VEP.md" --repo-root .
PASS
```

*End of Chat Media Persistence re-sign-on-read Pass-1 Backend VEP (plan only).*
