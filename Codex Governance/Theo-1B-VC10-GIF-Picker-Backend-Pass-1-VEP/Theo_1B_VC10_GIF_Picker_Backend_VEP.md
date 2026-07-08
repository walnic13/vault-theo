# Theo 1B — VC-10 GIF Picker Backend (Path A: hardened server-side GIPHY proxy — migration: gif columns on `theo_chat_messages` + NEW `theo_chat_gif_search` + NEW `theo_chat_send_gif` + MODIFY `theo_chat_send_message`/`theo_chat_list_messages`) — Pass 1 Backend VEP

> **Pipeline:** Theo backend governance regime. Author = Claude Code (Pass 1, plan-only). Reviewer = Codex (Pass 2). **Walter runs the migration at Pass 3 FIRST** (it MUST run after the VC-9 migration — it extends VC-9's body CHECK), then Claude Code deploys to the dedicated `vaultgpt-func-chat` app (§1E / DR-T7) + runs golden curls; Role-C (Pass 4) lands the API-Spec §2.10 + Schema §3 deltas. Plan-only.
>
> **Scope (VC-10 = WhatsApp-style GIF picker, Walter-decided Path A):** a searchable GIF picker backed by GIPHY, proxied server-side. (1) a **migration** adding seven nullable `gif_*` columns to `theo_chat_messages` + widening the body CHECK so a live message may be GIF-only + a gif coherence CHECK + an attachment/gif mutual-exclusion CHECK; (2) NEW `theo_chat_gif_search` — a **server-side GIPHY search proxy** (the API key never leaves the backend; results sanitized; `rating` pinned workplace-safe; short-TTL cache to spare the beta quota); (3) NEW `theo_chat_send_gif` `{ thread_id, gif_id, body? }` — **resolves the gif by id against GIPHY server-side** (the client sends only the id, never a URL — no injection) and persists a message with the canonical GIPHY URLs; (4) MODIFY `theo_chat_list_messages` (project `gif`, masked on tombstone) + `theo_chat_send_message` (carry `gif:null` for shape parity).
>
> **Security (Walter-decided Path A tradeoff, documented §P3/§P8):** GIPHY is a NEW external system (Golden §4). Path A was chosen over a fully-self-hosted import after weighing the residual exposure: (a) search-query text egresses to GIPHY; (b) clients hotlink GIPHY's CDN (`media*.giphy.com`) for the picker AND for historical GIF messages (ToS-compliant — nothing rehosted); (c) a dependency on GIPHY's CDN/uptime. Hardening: key server-side only (`GIPHY_API_KEY`, already set); search proxied + sanitized; `rating=pg-13`; send resolves by id (no client URL); a strict CSP (`media*.giphy.com` only) + "Powered by GIPHY" attribution are VC-10-FE obligations.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Turn issued against HEAD: `5da33d5e181d50237faf8d70a55c43b90f5c1608` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P8
Detail: Pass 1 backend VEP for VC-10 GIF picker (Path A hardened GIPHY proxy). P1–P8 walked; additive+reversible migration (seven nullable `gif_*` columns + a gif-aware widened body CHECK + a gif coherence CHECK + an attachment/gif mutual-exclusion CHECK) — MUST run after the VC-9 migration (extends VC-9's `theo_chat_messages_body_ck`); Primary Reference = the DEPLOYED VC-9 `theo_chat_send_message` inlined byte-verbatim + its function.json; two NEW handlers (`theo_chat_gif_search` server-side GIPHY proxy; `theo_chat_send_gif` resolve-by-id + insert) + two MODIFY (`list_messages` projects `gif` masked-on-tombstone; `send_message` carries `gif:null`) inlined full. GIPHY is a new external system (Golden §4) — justified §P3 (Walter Path A). The client never supplies a URL; the key stays server-side. No RLS change (justified §P8). No `reporting_*` / monolith / sidecar change. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` / `theo_attachments` NOT touched.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`; verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (VEP Format; Gap Register) | `grep -F "VEP Format"` + `grep -F "Gap Register"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table; §4A P-track) | `grep -F "MUST open with a Grounding Conformance Receipt"` + `awk §4A.1` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (review gates) | cited (regime reviewer) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary ref; §3 boundary; §4 new external-system) | `grep -F "selects **exactly one** deployed handler file"` + `grep -F "It MUST NOT read or write"` + `grep -F "new-domain or new-external-system helper"` this turn | `f9123546b6b1112a9c0c7e66ef776b2c75751593` |
| 5 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (four-pass axis; §1E deploy exception) | `grep -F "Pass 1 (Claude Code VEP)"` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (ownership/sharing posture → VC tier recorded VC-1) | `grep -F "sharing/membership RLS models (ownership-only unless Walter authorizes)"` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 7 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§5.2 RLS ownership family) | `grep -F "Default family: ownership-based"` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |
| 8 | **Contract basis** — Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_messages` row — new gif columns; VC-9 attachment reality) | `Read(§3 row)` + `grep -F "Message within a chat thread"` this turn | `0c5c5a713984be22f7e9144eccbfb0c33bce7e69` |
| 9 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 `read / send messages` row — the gif routes + gif field land at Pass 4) | `grep -F "read / send messages"` this turn | `b0976ff8fbccaf28495cc0f1e7594893221bf844` |
| 10 | **Primary Reference handler** (DEPLOYED VC-9 message send — insert+seq+publish+gate `send_gif` mirrors) — `Codex Governance/Theo-1B-VC9-Chat-Attachments-Backend-Pass-1-VEP/theo_chat_send_message.index.js` | `Read(full)` this turn; deployed get-back byte-matches | `92053b2414602f98fe84231264a1f3e3f2c30f40` |
| 11 | **Primary Reference function.json** (DEPLOYED) — `Codex Governance/Theo-1B-VC9-Chat-Attachments-Backend-Pass-1-VEP/theo_chat_send_message.function.json` | `Read(full)` this turn | `0284d265cd81bec4c34b5513d46c41b7ba6601ff` |
| 12 | **Modify basis 2** — DEPLOYED VC-9 `theo_chat_list_messages.index.js` (the `gif` projection extends this) — `Codex Governance/Theo-1B-VC9-Chat-Attachments-Backend-Pass-1-VEP/theo_chat_list_messages.index.js` | `Read(full)` this turn; deployed get-back byte-matches | `38f835acd4366f00c868dc58648ff41aa7625291` |
| 13 | **RLS basis** — `Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql` (`theo_chat_message_insert` WITH CHECK column-agnostic) | `Read(full)`/`sed` this turn; cited | `67ff9b5f654e146c01590d9ce0f9286969e54103` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*` / `corporate-reporting` change. Monolith `vaultgpt-func-premium` + streaming sidecar `vaultgpt-func-stream` READ-ONLY — deploy targets `vaultgpt-func-chat`. `theo_message` / `theo_message_stream` / `theo_conversations` / `theo_messages` / `theo_attachments` NOT touched.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this pack) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | VEP Format | "VEP Format" | §P1–§P8 + §MIGRATION + §SM + §HG + §API-SPEC + §DEPLOY + §CURL structure |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | Gap Register | "Gap Register" | §P2.5 / GR |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | pass axis | "Pass 1 (Claude Code VEP)" | Pipeline preamble — Pass 1; Codex reviews at Pass 2 |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Out of scope | "sharing/membership RLS models (ownership-only unless Walter authorizes)" | §P1 / §P2.5 — VC tier Walter-directed; recorded VC-1 |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "selects **exactly one** deployed handler file" | §SM — Primary Reference = deployed VC-9 `theo_chat_send_message` |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "new-domain or new-external-system helper" | §P3 — GIPHY is a NEW external system (Path A), justified + hardened |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §3 | "It MUST NOT read or write" | §P2 — VC-10 touches only `theo_chat_*` + the GIPHY REST API (outbound) |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §5.2 | "Default family: ownership-based" | §P8 — participant-scoped send is an ownership-family extension; no RLS change |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "Message within a chat thread" | §P6 — the `theo_chat_messages` row gains seven nullable gif columns |
| spec/THEO_API_SPEC.md | §2.10 | "read / send messages" | §API-SPEC — the gif routes + `gif` field land on this row |
| Codex Governance/Theo-1B-VC9-Chat-Attachments-Backend-Pass-1-VEP/theo_chat_send_message.index.js | set_config triad | "set_config('app.current_user_id'" | §HG.4 — `send_gif` keeps the deployed set_config triad + membership/archived gate |
| Codex Governance/Theo-1B-VC1-Chat-Backend-Spine-Pass-1-VEP/vc1_chat_migration.sql | insert policy | "theo_chat_message_insert" | §P8 — the column-agnostic INSERT WITH CHECK is unchanged |

## P1 — Feature identification
**Microstep:** VC-10 — a WhatsApp-style **GIF picker** (Walter-decided **Path A**: use GIPHY via a hardened server-side proxy; the fully-self-hosted import was the alternative). Search a GIF, tap to send; the sent GIF renders inline (hotlinked from GIPHY's CDN, ToS-compliant).

**Migration:** seven nullable `gif_*` columns on `theo_chat_messages` (`gif_provider`, `gif_id`, `gif_url`, `gif_preview_url`, `gif_width`, `gif_height`, `gif_title`) + a gif-aware widened `theo_chat_messages_body_ck` + `theo_chat_messages_gif_ck` (coherence) + `theo_chat_messages_attach_gif_excl_ck` (a message is not both a file and a gif). **Runs AFTER the VC-9 migration** (it extends VC-9's body CHECK).
**New (2), on `vaultgpt-func-chat`:** `POST /api/theo_chat_gif_search` `{ query, limit? }` (server-side GIPHY search proxy) + `POST /api/theo_chat_send_gif` `{ thread_id, gif_id, body? }` (resolve-by-id + insert + publish).
**Modified (2):** `theo_chat_list_messages` (project `gif`, masked on tombstone) + `theo_chat_send_message` (carry `gif:null` for shape parity).

**Out of scope (VC-10):** the FE (search box + animated grid + tap-to-send + "Powered by GIPHY" attribution + CSP lockdown = vault-origin **VC-10-FE**); GIF *upload* (users uploading their own gifs is VC-9's `image/gif` attachment path, already deployed); stickers/emoji/clips-with-sound (GIPHY SDK-only features we deliberately don't use); a fully-self-hosted GIF library (the rejected import alternative); production GIPHY quota upgrade (beta 100/hr suffices for 8 users with the search cache).

**Plan status:** VC tier Walter-directed, reconciled at VC-1. Doc delta = API-Spec §2.10 (gif routes + `gif` field) + Schema §3 (`theo_chat_messages` gif columns) — Role-C, Pass 4.

## P2 — Architecture & boundary reconciliation
**Handler family.** `theo_chat_send_gif` is a Family-B HTTP handler mirroring the Primary Reference (`theo_chat_send_message`): `pg` Pool; EasyAuth OID; validate-before-SQL; `set_config` triad; membership + **archived (VC-19) gate**; the atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` with `23505` retry; best-effort Web PubSub publish; `{data,meta}`/`{error}` envelope; anonymous `httpTrigger`. Its only new logic: resolve the gif by id against GIPHY (server-side) before the insert. `theo_chat_gif_search` is a lighter Family-B handler — EasyAuth + a GIPHY search proxy + sanitize + short-TTL cache; **no DB access** (pure proxy). The two MODIFY handlers add only the `gif` projection / `gif:null` parity.
**Boundary.** Reads/writes only `theo_chat_*` (Postgres) + makes **outbound** calls to the GIPHY REST API (a new external system — §P3). Per Golden §3 no `reporting_*`/monolith/Graph/Foundry/Blob, and NOT `theo_attachments`. Deploy target `vaultgpt-func-chat`; monolith + sidecar READ-ONLY. Outbound-only to GIPHY (no new inbound surface).
**Validation before SQL/upstream.** `thread_id` UUID; `gif_id` strict `^[A-Za-z0-9]{1,64}$` (before it reaches a URL path); `query` non-empty ≤100 chars; `limit` strict-integer 1..50 → deterministic 400 before any SQL or GIPHY call.

## P2.5 / GR — Gap Register
Closed vocabulary: `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.

| Gap | Disclosure | Pivot |
| --- | ---------- | ----- |
| API-Spec §2.10 + Schema §3 will change (gif routes; `gif` field; seven new columns). | Documentation-currency delta on the recorded VC tier. | **PROCEED** with a Role-C (Pass 4): `spec/THEO_API_SPEC.md` §2.10 + `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3. Sequenced after Pass-3 deploy + curls. |
| **Migration ordering:** VC-10's migration DROPs/ADDs `theo_chat_messages_body_ck`, extending VC-9's widened form (adds the `gif_id IS NOT NULL` presence term). | It MUST run AFTER the VC-9 migration (already landed). If run before, the DROP finds VC-1's original CHECK and the re-add still yields a correct gif+attachment-aware form (attachment column exists post-VC-9), so it is order-tolerant given VC-9's columns exist — but the intended order is VC-9 → VC-10. | **PROCEED** — VC-9 migration is landed; §DEPLOY states the ordering. |
| **GIPHY is a NEW external system** (Golden §4). | Walter-decided Path A. Residual exposure (search-term egress; CDN hotlinking incl. historical messages; GIPHY uptime dependency) is deliberately accepted; hardened per §P3/§P8. | **PROCEED** — justified + hardened; the self-hosted-import alternative was weighed and declined by Walter. |
| Client could try to inject an arbitrary URL as a "gif". | `send_gif` takes ONLY a `gif_id` (strict charset) and resolves it against GIPHY server-side; the stored URLs are the ones GIPHY returns, never client-supplied. | **PROCEED** — resolve-by-id (§P8). |
| Beta GIPHY key = 100 calls/hr (shared). | Only *searches* consume quota (viewing a sent GIF is a CDN fetch, 0 API calls); the search handler debounces (FE) + caches (120s per-instance). 8 users won't approach it. | **PROCEED** — cache + FE debounce; upgrade path documented, not needed now. |
| **(Discovered, adjacent — out of scope)** `theo_chat_forward_message` (VC-13) copies only `body`; forwarding an attachment-only (VC-9) OR gif-only (VC-10) message would produce a `body:null` row with no attachment/gif → violates `theo_chat_messages_body_ck` (23514 → 400/500). Pre-exists VC-10 (VC-9 introduced it for attachments); VC-10 adds gif as a second rich type forward can't carry. | Not in VC-10's handler set. Surfaced here for honesty. | **PROCEED** — recommend a future **VC-13.x**: `forward_message` should carry the attachment/gif columns (or reject forwarding a body-less rich message with a clear 400). Flagged to Codex/Walter. |
| FE not yet built. | The backend loop is curl-verifiable without the FE. | **PROCEED** — future trigger: **VC-10-FE** (search box + grid + attribution + CSP). |

Not a `NO-GAPS` certification.

## P3 — External-system reconciliation
**GIPHY is a NEW external system** (Golden §4 "new-domain or new-external-system helper"), introduced deliberately under Walter's Path A decision. Justification + hardening:
- **Key isolation:** `GIPHY_API_KEY` is a `vaultgpt-func-chat` app setting (already set), read only server-side; the browser never sees it and never calls GIPHY for search.
- **Server-side proxy + sanitize:** `theo_chat_gif_search` calls GIPHY `/v1/gifs/search` and returns only `{ provider, id, title, url, preview_url, width, height }` — no passthrough of GIPHY's full payload.
- **Workplace-safe:** `rating=pg-13` (env-overridable `GIPHY_RATING`), `bundle=messaging_non_clips`.
- **Resolve-by-id on send:** `theo_chat_send_gif` fetches `/v1/gifs/{id}` (id strictly validated + URL-encoded) and stores the canonical URLs GIPHY returns — the client never supplies a URL.
- **Egress-only:** outbound HTTPS to `api.giphy.com`; no new inbound surface. Upstream failures degrade gracefully (429 → `RATE_LIMITED`; other non-2xx → `UPSTREAM_ERROR` 502).
- **FE obligations (VC-10-FE):** CSP restricting image loads to `media*.giphy.com`; "Powered by GIPHY" attribution (GIPHY ToS).
No new SDK/dependency in the backend (pure `https` + `JSON.parse`). Web PubSub publish reused unchanged.

## P4 — Contract reconciliation
Envelope unchanged (`{data,meta}`/`{error}`).
- `theo_chat_gif_search` `{ query, limit? }` → **200** `{ query, gifs: [{ provider, id, title, url, preview_url, width, height }], cached }`. Bad query/limit → **400**; upstream 429 → **429 `RATE_LIMITED`**; upstream error → **502 `UPSTREAM_ERROR`**; key missing → **500**.
- `theo_chat_send_gif` `{ thread_id, gif_id, body? }` → **201** `{ message }` where `message.gif` = `{ provider, id, url, preview_url, width, height, title }` (and `attachment:null`, `reply_to:null`, `forwarded:false`). Bad `thread_id`/`gif_id` → **400**; gif not found → **400**; non-participant → **404**; archived thread → **409** (VC-19); oversized caption → **400**.
- `theo_chat_list_messages` / `theo_chat_send_message` → each message now also carries `gif` (`{…} | null`; masked to `null` on a tombstone).

## P5 — Error-model reconciliation
`send_gif` mirrors the Primary Reference's error map exactly (401 / 400 / 404 / 409 archived / 409 seq / 403 `42501` / 23514→400 / else 500), plus new `isKnown` errors (`INVALID_REQUEST` gif-not-found 400, `RATE_LIMITED` 429, `UPSTREAM_ERROR` 502) that ride the existing `isKnown` re-map — no new `catch` arm. `gif_search` uses a self-contained map (400 validation / 429 / 502 / 500-config) with the standard `{error}` envelope.

## P6 — Data-shape reconciliation
Seven additive nullable columns on `theo_chat_messages` (`gif_provider text`, `gif_id text`, `gif_url text`, `gif_preview_url text`, `gif_width int`, `gif_height int`, `gif_title text`). The body CHECK is widened (a live row needs body OR attachment OR gif); `theo_chat_messages_gif_ck` keeps the core three (provider/id/url) all-present-or-all-null; `theo_chat_messages_attach_gif_excl_ck` forbids a message being both an attachment and a gif. A gif message is an ordinary INSERT of a NEW row carrying the gif columns; "Message within a chat thread" gains an external-reference variant. The API exposes a `gif` object; GIPHY width/height (returned as strings) are `parseInt`'d. Full DDL in §MIGRATION.

## P7 — Idempotency / concurrency
- `send_gif` is NOT idempotent (each call is a new message, like a normal send). The seq INSERT keeps the atomic `INSERT … SELECT COALESCE(MAX(seq),0)+1` + `23505` retry.
- The GIPHY resolve is a pure read before the INSERT; a resolve failure fails the send cleanly (no partial row).
- `gif_search` is a pure read + stateless proxy; the per-instance 120s cache is best-effort (multi-instance safe — a miss just re-queries).
- `list_messages` is a pure read; the `gif` projection adds no write and no ordering change.
- TOCTOU vs a concurrent archive: same benign cooperative-gate behaviour as VC-19 (inherited).

## P8 — Security / RLS reconciliation
**No RLS change.** The deployed `theo_chat_message_insert` policy `WITH CHECK (sender_oid = auth.uid() AND thread_id IN (SELECT id FROM public.theo_chat_threads WHERE auth.uid() = ANY (member_oids)))` is column-agnostic — the gif columns ride it unchanged. `send_gif` re-asserts membership + the archived gate before insert; a non-participant → 404, archived → 409. Participant-scoped send is an ownership-family extension ("Default family: ownership-based"). No `SECURITY DEFINER`; no new elevated read.
**GIPHY hardening (Path A).** Key server-side only; search proxied + sanitized + rating-pinned; **send resolves by id** so no client URL is ever stored (no SSRF/stored-XSS); `gif_id` strictly validated before it reaches a URL path. The stored URLs are GIPHY CDN URLs (public content); no secret is persisted.
**Tombstone masking.** A deleted message masks its `gif` to `null` in `list_messages` (VC-12 "delete for everyone" parity, mirroring the VC-9 attachment mask).
**No leakage.** Responses/publishes carry only the sanitized gif object; the API key is never returned; no OIDs/tokens.

## §MIGRATION — `vc10_gif_migration.sql` (additive + reversible; run by Walter at Pass 3, AFTER the VC-9 migration, BEFORE the handler deploy)

Additive columns idempotent (`ADD COLUMN IF NOT EXISTS`); the body CHECK is dropped+re-added (gif-aware); the two new CHECKs are guarded. No top-level transaction control (Golden §5.2); Walter executes. `-- label` comments only (no psql meta-commands).

```sql
-- Theo VC-10 — GIF picker (Path A: hardened GIPHY proxy). ADDITIVE + REVERSIBLE. Run by Walter at
-- Pass 3 BEFORE the VC-10 handler deploy. Adds seven nullable gif_* columns to theo_chat_messages,
-- widens the body CHECK so a live message may be GIF-only (body NULL + a gif), and adds a gif coherence
-- CHECK + an attachment/gif mutual-exclusion CHECK. Idempotent; safe to re-run. MUST run AFTER the VC-9
-- migration (this DROP/ADD of theo_chat_messages_body_ck extends VC-9's widened form).
--
-- Design notes:
--  * A GIF message is an EXTERNAL reference (GIPHY CDN URL), not a self-hosted blob (unlike a VC-9
--    attachment). theo_chat_send_gif resolves the gif by id against GIPHY server-side and stores the
--    canonical GIPHY URLs it gets back; the client never supplies a URL (no injection). Rendering
--    hotlinks the GIPHY CDN (Path A, ToS-compliant) — nothing is rehosted.
--  * NO RLS change. The theo_chat_message_insert WITH CHECK is column-agnostic; a gif is an ordinary
--    INSERT the caller is authorized to make (member of the target thread, as self).
--  * body CHECK widened: a live row needs a non-empty body (1..8000) OR an attachment OR a gif; a
--    tombstone (deleted_at IS NOT NULL) is unconstrained (body already nulled). This DROPs the VC-9
--    constraint and re-adds the gif-aware form — hence the ordering dependency on VC-9.
--  * gif coherence: the core three (provider, id, url) are all-present or all-NULL with the rest;
--    a message is never BOTH an attachment and a gif (mutual-exclusion CHECK).
--  * gif_width / gif_height are int (GIPHY returns them as strings; the handler parseInt's them).

-- 1) Additive columns (idempotent).
ALTER TABLE public.theo_chat_messages
  ADD COLUMN IF NOT EXISTS gif_provider    text NULL,
  ADD COLUMN IF NOT EXISTS gif_id          text NULL,
  ADD COLUMN IF NOT EXISTS gif_url         text NULL,
  ADD COLUMN IF NOT EXISTS gif_preview_url text NULL,
  ADD COLUMN IF NOT EXISTS gif_width       int  NULL,
  ADD COLUMN IF NOT EXISTS gif_height      int  NULL,
  ADD COLUMN IF NOT EXISTS gif_title       text NULL;

-- 2) Widen the body CHECK: a live message may be body-only OR attachment-only OR gif-only (or combos of
--    body+attachment / body+gif). Drop the VC-9 constraint and re-add the gif-aware form (guarded).
DO $mig$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_body_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages DROP CONSTRAINT theo_chat_messages_body_ck;
  END IF;

  ALTER TABLE public.theo_chat_messages
    ADD CONSTRAINT theo_chat_messages_body_ck
    CHECK (
      (deleted_at IS NOT NULL)
      OR
      (
        (body IS NULL OR (length(body) >= 1 AND length(body) <= 8000))
        AND (body IS NOT NULL OR attachment_blob_path IS NOT NULL OR gif_id IS NOT NULL)
      )
    );
END
$mig$;

-- 3) GIF coherence: the core three (provider, id, url) are all-present or the whole gif block is all-NULL
--    (guarded). preview_url / width / height / title are optional within a gif.
DO $mig$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_gif_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages
      ADD CONSTRAINT theo_chat_messages_gif_ck
      CHECK (
        (gif_provider IS NULL AND gif_id IS NULL AND gif_url IS NULL
           AND gif_preview_url IS NULL AND gif_width IS NULL AND gif_height IS NULL AND gif_title IS NULL)
        OR
        (gif_provider IS NOT NULL AND gif_id IS NOT NULL AND gif_url IS NOT NULL)
      );
  END IF;
END
$mig$;

-- 4) A message is never BOTH a self-hosted attachment and a gif (mutual exclusion; guarded).
DO $mig$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
      AND con.conname = 'theo_chat_messages_attach_gif_excl_ck'
  ) THEN
    ALTER TABLE public.theo_chat_messages
      ADD CONSTRAINT theo_chat_messages_attach_gif_excl_ck
      CHECK (attachment_blob_path IS NULL OR gif_id IS NULL);
  END IF;
END
$mig$;
```

**Read-only verification (run after the migration):**

```sql
-- Theo VC-10 — read-only verification (run after vc10_gif_migration.sql). SELECT-only.

-- V1) the seven gif columns exist with the expected types/nullability.
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'theo_chat_messages'
  AND column_name IN ('gif_provider','gif_id','gif_url','gif_preview_url','gif_width','gif_height','gif_title')
ORDER BY column_name;

-- V2) the three relevant CHECK constraints exist (gif-aware body CHECK + gif coherence + attach/gif exclusion).
SELECT con.conname
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace n ON n.oid = rel.relnamespace
WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages'
  AND con.contype = 'c'
  AND con.conname IN ('theo_chat_messages_body_ck','theo_chat_messages_gif_ck','theo_chat_messages_attach_gif_excl_ck')
ORDER BY con.conname;

-- V3) confirm the body CHECK now admits a gif-only live message (gif_id present term).
SELECT pg_get_constraintdef(con.oid) AS body_ck_def
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace n ON n.oid = rel.relnamespace
WHERE n.nspname = 'public' AND rel.relname = 'theo_chat_messages' AND con.conname = 'theo_chat_messages_body_ck';
```

## §SM — Primary Reference (DEPLOYED VC-9 `theo_chat_send_message.index.js`, byte-verbatim — the insert+seq+publish+gate pattern `theo_chat_send_gif` mirrors)

Per Golden §2 ("selects **exactly one** deployed handler file"), the Primary Reference is the DEPLOYED VC-9 **`theo_chat_send_message`** (blob `92053b2414602f98fe84231264a1f3e3f2c30f40`) — the message-insert pattern `send_gif` mirrors (set_config triad, membership + archived gate, the atomic seq INSERT with `23505` retry, best-effort publish, `{data,meta}`/`{error}` envelope + error map). It is also the base for the §HG.1 `gif:null` parity modify:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

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

### §SM-FJ — Primary Reference function.json (DEPLOYED, byte-verbatim — UNCHANGED by VC-10)

Blob `0284d265cd81bec4c34b5513d46c41b7ba6601ff`:

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

## §HG.1 — `theo_chat_send_message` (MODIFY: carry `gif:null` for shape parity)

Delta vs DEPLOYED VC-9 (blob `92053b2`): `saved.gif = null;` added after the attachment projection (a normally-sent message is never a gif). Everything else byte-identical. Full — file `theo_chat_send_message.index.js`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

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

### §HG.1-FJ — `theo_chat_send_message.function.json` (UNCHANGED — byte-identical to §SM-FJ)

## §HG.2 — `theo_chat_list_messages` (MODIFY: project the `gif` object on the VC-9 base, masked on tombstone)

Delta vs DEPLOYED VC-9 (blob `38f835a`): the SELECT adds the seven `gif_*` columns and each shaped message gains `gif: {…} | null` (masked to `null` when `deleted_at IS NOT NULL`). Cursor/paging/gate/reply/deleted/forwarded/attachment all unchanged. Full — file `theo_chat_list_messages.index.js`:

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const REPLY_PREVIEW_MAX = 200; // VC-11: cap the quoted-parent snippet to bound the payload (matches send).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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
function buildKnownError(code, message, status) {
  const err = new Error(message); err.code = code; err.status = status; err.isKnown = true; return err;
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
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

  const q = req.query || {};
  const threadId = typeof q.threadId === "string" ? q.threadId.trim() : "";
  if (!isUuid(threadId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'threadId' is required and must be a valid UUID.", 400));
  }

  // Cursor: 'before' (exclusive) returns older messages for infinite scroll. Strict-regex before parseInt
  // (parseInt('1.5') → 1 would silently pass a range check) per the parseInt-drift discipline.
  let before = null;
  if (q.before != null && String(q.before).trim() !== "") {
    const raw = String(q.before).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'before' must be a non-negative integer.", 400));
    }
    before = parseInt(raw, 10);
  }

  let limit = DEFAULT_LIMIT;
  if (q.limit != null && String(q.limit).trim() !== "") {
    const raw = String(q.limit).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Query param 'limit' must be a positive integer.", 400));
    }
    limit = parseInt(raw, 10);
    if (limit < 1) limit = 1;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
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

    // Membership gate — not a participant → 404 (no existence leak).
    const acc = await client.query(
      `SELECT 1 FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }

    // Fetch newest-first for the cursor, then return ascending for display. RLS also enforces the gate.
    // VC-11: LEFT JOIN LATERAL the replied-to parent (same thread → RLS-visible) for the quote preview.
    // VC-12: carry m.deleted_at + the parent's deleted_at so tombstoned messages/quotes render as deleted
    // (body is already NULL in the DB for a tombstoned row — a soft delete removes the content for all).
    // VC-13: carry m.forwarded_from_message_id ONLY to derive a `forwarded` boolean below (the raw origin
    // id is never returned — it points into a thread the caller may not read).
    // VC-9: carry the attachment_* columns to derive an `attachment` preview below (the raw blob_path is
    // never returned — a read SAS is issued per-request by theo_chat_attachment_download).
    const params = [threadId];
    let where = `m.thread_id = $1`;
    if (before != null) { params.push(before); where += ` AND m.seq < $${params.length}`; }
    params.push(limit);
    const rows = await client.query(
      `SELECT m.id, m.thread_id, m.seq, m.sender_oid, m.body, m.created_at, m.reply_to_message_id, m.deleted_at, m.forwarded_from_message_id,
              m.attachment_blob_path, m.attachment_filename, m.attachment_content_type, m.attachment_byte_size,
              m.gif_provider, m.gif_id, m.gif_url, m.gif_preview_url, m.gif_width, m.gif_height, m.gif_title,
              p.id AS p_id, p.seq AS p_seq, p.sender_oid AS p_sender_oid, p.body AS p_body, p.deleted_at AS p_deleted_at
       FROM public.theo_chat_messages m
       LEFT JOIN LATERAL (
         SELECT pm.id, pm.seq, pm.sender_oid, pm.body, pm.deleted_at
         FROM public.theo_chat_messages pm
         WHERE pm.id = m.reply_to_message_id AND pm.thread_id = m.thread_id
         LIMIT 1
       ) p ON true
       WHERE ${where}
       ORDER BY m.seq DESC
       LIMIT $${params.length}`,
      params
    );

    // Shape each row: the message plus a `reply_to` preview (null when not a reply). VC-12: `deleted` +
    // `deleted_at` on both the message and the quoted parent; a tombstoned body is NULL (removed for all).
    const shaped = rows.rows.map((r) => ({
      id: r.id,
      thread_id: r.thread_id,
      seq: Number(r.seq),
      sender_oid: r.sender_oid,
      body: r.body,
      created_at: r.created_at,
      deleted: r.deleted_at != null,
      deleted_at: r.deleted_at,
      // VC-13: expose ONLY the boolean (never the raw origin id — cross-thread privacy).
      forwarded: r.forwarded_from_message_id != null,
      // VC-9: expose the attachment preview (filename/content_type/byte_size) or null; never the raw
      // blob_path (a read SAS is issued per-request by theo_chat_attachment_download after a membership check).
      // VC-9 (Codex R1): a tombstoned message MASKS its attachment too — VC-12 "delete for everyone" nulls
      // the body AND must hide the file. The row keeps the pointer, but it is never projected once deleted.
      attachment: (r.attachment_blob_path == null || r.deleted_at != null) ? null : {
        filename: r.attachment_filename,
        content_type: r.attachment_content_type,
        byte_size: r.attachment_byte_size == null ? null : Number(r.attachment_byte_size),
      },
      // VC-10: expose the GIF (external GIPHY reference) or null; masked to null on a tombstone (VC-12
      // "delete for everyone" parity, mirroring attachment). The stored URLs are canonical GIPHY CDN URLs.
      gif: (r.gif_id == null || r.deleted_at != null) ? null : {
        provider: r.gif_provider,
        id: r.gif_id,
        url: r.gif_url,
        preview_url: r.gif_preview_url,
        width: r.gif_width == null ? null : Number(r.gif_width),
        height: r.gif_height == null ? null : Number(r.gif_height),
        title: r.gif_title,
      },
      reply_to_message_id: r.reply_to_message_id,
      reply_to: r.p_id == null ? null : {
        id: r.p_id,
        seq: Number(r.p_seq),
        sender_oid: r.p_sender_oid,
        body: typeof r.p_body === "string" ? r.p_body.slice(0, REPLY_PREVIEW_MAX) : r.p_body,
        deleted: r.p_deleted_at != null,
      },
    }));

    const ordered = shaped.slice().reverse();
    const hasMore = rows.rowCount === limit;
    const nextBefore = ordered.length > 0 ? Number(ordered[0].seq) : null;

    return send(context, 200, successBody({
      messages: ordered,
      page: { limit, has_more: hasMore, next_before: hasMore ? nextBefore : null },
    }));
  } catch (err) {
    context.log.error("theo_chat_list_messages failed", err);
    if (err && err.code === "42501") {
      return send(context, 403, errorBody("FORBIDDEN", "You do not have access to this conversation.", 403));
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

### §HG.2-FJ — `theo_chat_list_messages.function.json` (UNCHANGED)

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "options"],
      "route": "theo_chat_list_messages"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

## §HG.3 — `theo_chat_gif_search` (GREENFIELD: server-side GIPHY search proxy)

Family-B shape (EasyAuth + envelope) minus the DB (pure proxy). Validates `query`/`limit`; short-TTL per-instance cache; calls GIPHY `/v1/gifs/search` (`rating=pg-13`, `bundle=messaging_non_clips`); sanitizes each hit to `{ provider, id, title, url, preview_url, width, height }` (GIPHY width/height are strings → `parseInt`). Full — file `theo_chat_gif_search.index.js`:

```js
// VC-10 — GIF picker search (Path A: hardened server-side GIPHY proxy). The GIPHY API key lives ONLY in
// the GIPHY_API_KEY app setting (never sent to the client); the browser never talks to GIPHY directly for
// search. Returns a SANITIZED subset (id/title/url/preview/dimensions); rating pinned workplace-safe.
const GIPHY_API_BASE = "https://api.giphy.com/v1/gifs";
const GIPHY_RATING = process.env.GIPHY_RATING || "pg-13"; // workplace-safe default
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 50;
const CACHE_TTL_MS = 120 * 1000; // short-TTL per-instance cache to spare the 100/hr beta quota

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

// GIPHY returns image width/height as STRINGS ("268"); coerce to a positive int or null.
function toInt(v) { const n = parseInt(String(v == null ? "" : v), 10); return Number.isFinite(n) && n > 0 ? n : null; }

// Sanitize one GIPHY search hit → only the fields the client needs (no passthrough of GIPHY's full payload).
function sanitizeGif(g) {
  if (!g || typeof g.id !== "string" || !g.images) return null;
  const disp = g.images.fixed_height || g.images.downsized || g.images.original || {};
  const prev = g.images.fixed_height_small || g.images.preview_gif || disp || {};
  if (!disp.url) return null;
  return {
    provider: "giphy",
    id: g.id,
    title: typeof g.title === "string" ? g.title.slice(0, 200) : "",
    url: disp.url,
    preview_url: prev.url || disp.url,
    width: toInt(disp.width),
    height: toInt(disp.height),
  };
}

const _cache = new Map(); // key -> { at, gifs }
function cacheGet(key) {
  const e = _cache.get(key);
  if (!e) return null;
  if (Date.now() - e.at > CACHE_TTL_MS) { _cache.delete(key); return null; }
  return e.gifs;
}
function cacheSet(key, gifs) {
  if (_cache.size > 200) _cache.clear(); // bounded, best-effort
  _cache.set(key, { at: Date.now(), gifs });
}

function requestJson(urlStr) {
  return new Promise((resolve, reject) => {
    const https = require("https");
    const url = new URL(urlStr);
    const rq = https.request(
      { method: "GET", hostname: url.hostname, path: url.pathname + url.search, headers: { Accept: "application/json" } },
      (res) => {
        let data = "";
        res.on("data", (c) => { data += c; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, body: data }); });
      }
    );
    rq.on("error", reject);
    rq.end();
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

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'query' is required and must be a non-empty string.", 400));
  }
  if (query.length > 100) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'query' must be 100 characters or fewer.", 400));
  }
  // Strict integer limit (parseInt('1.5')→1 would silently pass) per the parseInt-drift discipline.
  let limit = DEFAULT_LIMIT;
  if (body.limit != null && String(body.limit).trim() !== "") {
    const raw = String(body.limit).trim();
    if (!/^[0-9]+$/.test(raw)) {
      return send(context, 400, errorBody("INVALID_REQUEST", "Field 'limit' must be a positive integer.", 400));
    }
    limit = parseInt(raw, 10);
    if (limit < 1) limit = 1;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  }

  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    context.log.error("theo_chat_gif_search: GIPHY_API_KEY not configured");
    return send(context, 500, errorBody("INTERNAL_SERVER_ERROR", "GIF search is not configured.", 500));
  }

  const cacheKey = `${GIPHY_RATING}|${limit}|${query.toLowerCase()}`;
  const cached = cacheGet(cacheKey);
  if (cached) {
    return send(context, 200, successBody({ query, gifs: cached, cached: true }));
  }

  try {
    const url =
      `${GIPHY_API_BASE}/search?api_key=${encodeURIComponent(apiKey)}` +
      `&q=${encodeURIComponent(query)}&limit=${limit}&rating=${encodeURIComponent(GIPHY_RATING)}` +
      `&lang=en&bundle=messaging_non_clips`;
    const r = await requestJson(url);
    if (r.statusCode === 429) {
      return send(context, 429, errorBody("RATE_LIMITED", "GIF search is busy; please try again in a moment.", 429));
    }
    if (r.statusCode < 200 || r.statusCode >= 300) {
      context.log.error("theo_chat_gif_search: GIPHY upstream error", r.statusCode);
      return send(context, 502, errorBody("UPSTREAM_ERROR", "GIF search is temporarily unavailable.", 502));
    }
    let payload;
    try { payload = JSON.parse(r.body || "{}"); } catch { return send(context, 502, errorBody("UPSTREAM_ERROR", "GIF search returned an unexpected response.", 502)); }
    const gifs = Array.isArray(payload.data) ? payload.data.map(sanitizeGif).filter(Boolean) : [];
    cacheSet(cacheKey, gifs);
    return send(context, 200, successBody({ query, gifs, cached: false }));
  } catch (err) {
    context.log.error("theo_chat_gif_search failed", err);
    return send(context, 502, errorBody("UPSTREAM_ERROR", "GIF search is temporarily unavailable.", 502));
  }
};
```

### §HG.3-FJ — `theo_chat_gif_search.function.json` (GREENFIELD)

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_gif_search" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §HG.4 — `theo_chat_send_gif` (GREENFIELD: resolve-by-id + insert + publish)

Mirrors the Primary Reference (set_config triad, membership + archived gate, atomic seq INSERT + `23505` retry, best-effort publish, error map) + resolves the gif by id against GIPHY server-side (id strictly validated; the client never supplies a URL). Full — file `theo_chat_send_gif.index.js`:

```js
const { Pool } = require("pg");
const { WebPubSubServiceClient } = require("@azure/web-pubsub");

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const HUB = "vaultchat";
const MAX_BODY = 8000;
const GIPHY_API_BASE = "https://api.giphy.com/v1/gifs";

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
// GIPHY ids are short alphanumerics; validate strictly before it ever reaches a URL path (no injection).
function isGiphyId(value) { return typeof value === "string" && /^[A-Za-z0-9]{1,64}$/.test(value); }
// GIPHY returns width/height as STRINGS; coerce to a positive int or null.
function toInt(v) { const n = parseInt(String(v == null ? "" : v), 10); return Number.isFinite(n) && n > 0 ? n : null; }

function requestJson(urlStr) {
  return new Promise((resolve, reject) => {
    const https = require("https");
    const url = new URL(urlStr);
    const rq = https.request(
      { method: "GET", hostname: url.hostname, path: url.pathname + url.search, headers: { Accept: "application/json" } },
      (res) => {
        let data = "";
        res.on("data", (c) => { data += c; });
        res.on("end", () => { resolve({ statusCode: res.statusCode || 0, body: data }); });
      }
    );
    rq.on("error", reject);
    rq.end();
  });
}

// Resolve a GIPHY gif by id server-side → canonical URLs. The client sends ONLY the id; the URLs stored are
// the ones GIPHY returns (never a client-supplied URL — no SSRF/stored-XSS vector).
async function resolveGiphyGif(gifId) {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) throw buildKnownError("INTERNAL_SERVER_ERROR", "GIF sending is not configured.", 500);
  const url = `${GIPHY_API_BASE}/${encodeURIComponent(gifId)}?api_key=${encodeURIComponent(apiKey)}`;
  const r = await requestJson(url);
  if (r.statusCode === 404) throw buildKnownError("INVALID_REQUEST", "GIF not found.", 400);
  if (r.statusCode === 429) throw buildKnownError("RATE_LIMITED", "GIF service is busy; please try again in a moment.", 429);
  if (r.statusCode < 200 || r.statusCode >= 300) throw buildKnownError("UPSTREAM_ERROR", "GIF service is temporarily unavailable.", 502);
  let payload;
  try { payload = JSON.parse(r.body || "{}"); } catch { throw buildKnownError("UPSTREAM_ERROR", "GIF service returned an unexpected response.", 502); }
  const g = payload.data;
  if (!g || typeof g.id !== "string" || !g.images) throw buildKnownError("INVALID_REQUEST", "GIF not found.", 400);
  const disp = g.images.fixed_height || g.images.downsized || g.images.original || {};
  const prev = g.images.fixed_height_small || g.images.preview_gif || disp || {};
  if (!disp.url) throw buildKnownError("INVALID_REQUEST", "GIF has no usable rendition.", 400);
  return {
    provider: "giphy",
    id: g.id,
    url: disp.url,
    preview_url: prev.url || disp.url,
    width: toInt(disp.width),
    height: toInt(disp.height),
    title: typeof g.title === "string" ? g.title.slice(0, 200) : "",
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
  const gifId = typeof body.gif_id === "string" ? body.gif_id.trim() : "";
  if (!isGiphyId(gifId)) {
    return send(context, 400, errorBody("INVALID_REQUEST", "Field 'gif_id' is required and must be a valid GIPHY id.", 400));
  }
  // Optional caption. Absent → a GIF-only message (body NULL, allowed by the VC-10 body CHECK).
  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (text.length > MAX_BODY) {
    return send(context, 400, errorBody("PAYLOAD_TOO_LARGE", `Message exceeds ${MAX_BODY} characters.`, 400));
  }
  const bodyParam = text.length ? text : null;

  let client = null;
  let saved = null;
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

    // Membership + archived gate (mirrors theo_chat_send_message / VC-19): not a participant → 404;
    // archived channel is closed to NEW messages → 409. A DM never has archived_at set.
    const acc = await client.query(
      `SELECT archived_at FROM public.theo_chat_threads WHERE id = $1 AND $2 = ANY(member_oids)`,
      [threadId, oid]
    );
    if (acc.rowCount === 0) {
      throw buildKnownError("NOT_FOUND", "Conversation not found.", 404);
    }
    if (acc.rows[0].archived_at != null) {
      throw buildKnownError("CONVERSATION_ARCHIVED", "This conversation is archived; you can no longer post to it.", 409);
    }

    // Resolve the GIF by id against GIPHY (server-side; the client never supplies a URL). Runs after auth +
    // membership so an unauthenticated/non-member caller never triggers an upstream call.
    const gif = await resolveGiphyGif(gifId);

    // Insert with the next per-thread seq computed atomically; UNIQUE(thread_id, seq) guards a concurrent
    // sender — retry on a 23505 race. Mirrors the deployed theo_chat_send_message insert loop.
    for (let attempt = 0; attempt < 5 && !saved; attempt++) {
      try {
        await client.query("BEGIN");
        const ins = await client.query(
          `
          INSERT INTO public.theo_chat_messages
            (thread_id, seq, sender_oid, body,
             gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title)
          SELECT $1, COALESCE(MAX(seq), 0) + 1, $2, $3, $4, $5, $6, $7, $8, $9, $10
          FROM public.theo_chat_messages WHERE thread_id = $1
          RETURNING id, thread_id, seq, sender_oid, body, created_at, reply_to_message_id,
                    gif_provider, gif_id, gif_url, gif_preview_url, gif_width, gif_height, gif_title
          `,
          [threadId, oid, bodyParam, gif.provider, gif.id, gif.url, gif.preview_url, gif.width, gif.height, gif.title]
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

    // Shape to the standard message projection exactly (parity with list_messages / send_message):
    // a GIF message is never a reply/forward/attachment and never (freshly) deleted.
    saved.reply_to = null;
    saved.deleted = false;
    saved.deleted_at = null;
    saved.forwarded = false;
    saved.attachment = null;
    saved.gif = {
      provider: saved.gif_provider,
      id: saved.gif_id,
      url: saved.gif_url,
      preview_url: saved.gif_preview_url,
      width: saved.gif_width == null ? null : Number(saved.gif_width),
      height: saved.gif_height == null ? null : Number(saved.gif_height),
      title: saved.gif_title,
    };
    delete saved.gif_provider; delete saved.gif_id; delete saved.gif_url; delete saved.gif_preview_url;
    delete saved.gif_width; delete saved.gif_height; delete saved.gif_title;

    // Publish to the thread's Web PubSub group so every connected participant receives it instantly.
    // Best-effort: already durably persisted; a publish failure must not fail the send.
    if (process.env.WebPubSubConnectionString) {
      try {
        const serviceClient = new WebPubSubServiceClient(process.env.WebPubSubConnectionString, HUB);
        await serviceClient.group(threadId).sendToAll({
          type: "message",
          thread_id: saved.thread_id,
          message: saved,
        });
      } catch (pubErr) {
        context.log.error("theo_chat_send_gif publish (non-fatal) failed", pubErr);
      }
    }

    return send(context, 201, successBody({ message: saved }));
  } catch (err) {
    context.log.error("theo_chat_send_gif failed", err);
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

### §HG.4-FJ — `theo_chat_send_gif.function.json` (GREENFIELD)

```json
{
  "bindings": [
    { "authLevel": "anonymous", "type": "httpTrigger", "direction": "in", "name": "req", "methods": ["post", "options"], "route": "theo_chat_send_gif" },
    { "type": "http", "direction": "out", "name": "res" }
  ]
}
```

## §API-SPEC — Role-C (Pass 4) documentation delta
`spec/THEO_API_SPEC.md` §2.10 **`read / send messages`** row: add `POST /api/theo_chat_gif_search { query, limit? }` → **200** `{ gifs:[{provider,id,title,url,preview_url,width,height}] }` (server-side GIPHY proxy; key server-side; `rating=pg-13`; 429→`RATE_LIMITED`, upstream→`UPSTREAM_ERROR`); `POST /api/theo_chat_send_gif { thread_id, gif_id, body? }` → **201** `{ message }` (resolve-by-id; gif not found → **400**; non-participant → **404**; archived → **409**); note `list_messages`/`send_message` messages now also carry `gif` (`{…}|null`, masked on tombstone). `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3 `theo_chat_messages` row: add the seven `gif_*` columns + the gif-aware body CHECK + `theo_chat_messages_gif_ck` + `theo_chat_messages_attach_gif_excl_ck`. Authored as a Role-C handoff after Pass-3 deploy + curls.

## §DEPLOY — Pass 3 (Walter migration FIRST, then Claude Code deploy to `vaultgpt-func-chat`)
0. **Prereq (already done):** `GIPHY_API_KEY` is set on `vaultgpt-func-chat`. (No MI/Search role needed — Path A uses GIPHY, not `vaultgpt-search`.)
1. **Walter** runs `vc10_gif_migration.sql` (AFTER the VC-9 migration, which is landed) + the verify SQL (the seven columns + three CHECKs must exist before deploy).
2. **Claude Code** deploys the NEW `theo_chat_gif_search/{index.js,function.json}` + `theo_chat_send_gif/{index.js,function.json}` + overwrites `theo_chat_send_message/index.js` + `theo_chat_list_messages/index.js` via Kudu VFS surgical PUT (ARM bearer; no token logged); restart → confirm the 2 new functions register (inventory 18 → 20); baseline get-back before overwrite; post-deploy get-back byte-matches this pack.

## §CURL — post-deploy verification (Claude Code; az-login token for `api://4e1a1e31-…`; structural only — no OIDs/bodies)
Against a disposable channel the caller owns:
- `POST gif_search` `{ query:"thumbs up", limit:3 }` → **200**, `gifs.length>0`, each `{ id, url, preview_url }`; capture a real `gif_id`.
- `POST gif_search` `{ query:"" }` → **400**; `{ query:"x", limit:"1.5" }` → **400**.
- `POST send_gif` `{ thread_id:T, gif_id:<real> }` (no body) → **201**; `message.gif` = `{ provider:"giphy", id, url, preview_url, width, height }`; no raw `gif_*` columns in the payload.
- `POST send_gif` `{ thread_id:T, gif_id:"!!bad!!" }` → **400**; `{ thread_id:T, gif_id:"zzzzzzzzzzzzzz" }` (well-formed but nonexistent) → **400** (gif not found).
- `POST send_gif` into an archived channel → **409 `CONVERSATION_ARCHIVED`**; into a non-member thread → **404**.
- `GET list_messages?threadId=T` → the gif message carries `gif` + no raw columns; a plain message carries `gif:null`.
- Regression: `POST send_message` (normal) → **201**, `message.gif===null`.
- **Tombstone:** `POST delete_message` on the gif message → **200**; `list_messages` → that message `deleted:true` + `gif:null` (masked).

## §SM-NOTE — structural mirror
`theo_chat_send_gif` is the deployed VC-9 `theo_chat_send_message` insert+seq+publish+gate pattern + a GIPHY resolve-by-id; `theo_chat_gif_search` is the Family-B envelope + a sanitized GIPHY proxy (no DB); `list_messages`/`send_message` add only the `gif` projection / `gif:null` parity. No shared helper/envelope/error-map drift; new `isKnown` errors ride the existing re-map. `node --check` clean on all four (verified this turn). GIPHY width/height (strings) are `parseInt`'d; the client never supplies a URL.

## Requested Pass 2 verdict
**APPROVED** or **REJECTED** only. On APPROVED: Walter runs the migration (after VC-9's), Claude Code deploys the 2 new handlers + 2 overwrites + curls, then the Role-C (Pass 4) + VC-10-FE.
