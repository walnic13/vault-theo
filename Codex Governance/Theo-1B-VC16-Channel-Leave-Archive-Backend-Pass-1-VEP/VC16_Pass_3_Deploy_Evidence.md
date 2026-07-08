# VC-16 Channel Leave + Archive — Pass 3 Deploy Evidence

**Feature:** VC-16 — a channel member can **leave** (`theo_chat_leave_channel`); the admin can **archive** (`theo_chat_archive_channel`, soft `archived_at`); `theo_chat_list_threads` hides archived threads.
**VEP:** `Theo_1B_VC16_Channel_Leave_Archive_Backend_VEP.md` — **Codex APPROVED** (Pass 2 R1, HEAD `2f00b22`; lint PASS; `node --check` clean on all three handlers).
**Authority:** Orchestration §1E / DR-T7 (deploy to `vaultgpt-func-chat` only). **Migration run by Walter** (confirmed) BEFORE deploy. **Date:** 2026-07-05.

---

## 1. Sequence
1. **Walter ran** `vc16_leave_archive_migration.sql` (`ADD COLUMN IF NOT EXISTS archived_at timestamptz` + `CREATE OR REPLACE FUNCTION public.theo_chat_leave(uuid)` SECURITY DEFINER + grants) — confirmed by Walter ("sql migration complete") BEFORE any handler deploy.
2. **Claude Code deployed** the handlers via Kudu VFS surgical writes (ARM bearer for `https://management.core.windows.net/`; no token/secret logged):
   - new `theo_chat_leave_channel/{index.js,function.json}` → **201/201**
   - new `theo_chat_archive_channel/{index.js,function.json}` → **201/201**
   - overwrite `theo_chat_list_threads/index.js` → **204**
   - **Baseline captured** before overwrite: deployed `theo_chat_list_threads/index.js` = 5764 bytes, `grep -c archived_at = 0` (⇒ the pre-VC-16 VC-8/1.2 version); rollback copy retained.
   - **Get-back verification:** all three deployed files re-fetched and `diff` (modulo CRLF) **MATCH** the approved package source byte-for-byte; the deployed `list_threads` now contains `archived_at IS NULL` (count 1).
3. Restart → function inventory now **14** (prior 12 + `theo_chat_leave_channel` + `theo_chat_archive_channel`, confirmed via `az functionapp function list`).

## 2. Authenticated golden curls (az-login token for `api://4e1a1e31-…`, as `wmansfield@vault-tax.com`; structural only — no OIDs/bodies)

A well-formed but non-existent thread UUID (`00000000-0000-4000-8000-000000000000`) was used for the not-found paths so **no real teammate, channel, or membership was mutated**. No live channel was left or archived (those are side-effecting; the FE pass will exercise them against real, disposable verification channels).

| # | Endpoint / check | Result | Meaning |
| - | ---------------- | ------ | ------- |
| 1 | `POST leave_channel` — no auth | **401** | EasyAuth identity required |
| 2 | `POST leave_channel` — malformed JSON body | **400** | body-parse guard |
| 3 | `POST leave_channel` — `thread_id:"nope"` | **400** | `isUuid` guard |
| 4 | `POST leave_channel` — non-existent thread UUID | **404** | RLS-scoped: caller not a participant → no existence leak |
| 5 | `POST archive_channel` — no auth | **401** | EasyAuth identity required |
| 6 | `POST archive_channel` — `thread_id:"nope"` | **400** | `isUuid` guard |
| 7 | `POST archive_channel` — non-existent thread UUID | **404** | RLS-scoped `FOR UPDATE` read → not a participant → 404 |
| 8 | `GET list_threads` (regression) | **200** | archived-filter deployed; existing listing unbroken |

**OPTIONS note:** `OPTIONS` on both new routes returns **401**, not the in-code 204 — EasyAuth gates the preflight at the platform layer. This is **identical across all deployed `theo_chat_*` functions** (VC-1 onward) and is not a VC-16 regression; the in-code `OPTIONS → 204` branch sits behind EasyAuth. Browser CORS for the SWA works via the authenticated app flow, as for every prior chat route.

The live admin/channel/membership gates (200 `left:true`/`archived:true`, 400 admin-cannot-leave, 400 non-channel, 403 non-admin-archive) are exercised end-to-end in the VC-16-FE verification against disposable channels; the structural ladder above confirms the routes are live and the deterministic validation order (`401 → 400 → 404`) is correct.

## 3. Boundary
No migration by Claude Code (Walter ran it); no `reporting_*` / monolith (`vaultgpt-func-premium`) / sidecar (`vaultgpt-func-stream`) write. The modified `list_threads` preserves every prior field (`admin_oid`, `members_read`, `last_message`, `unread_count`, …) and only adds `AND t.archived_at IS NULL` to the outer WHERE. RLS unchanged; the self-leave privilege is confined to the migration's SECURITY DEFINER `theo_chat_leave(uuid)` (execution-time safe per the R1 fix — `FOR UPDATE` read + full guard re-asserted in the removal UPDATE).

## 4. Follow-ups
- **Role-C (Pass 4):** API-Spec §2.10 (leave/archive routes + the `list_threads` archived-exclusion note) + Schema §3/§8 (`theo_chat_threads.archived_at` + the `theo_chat_leave` SECURITY DEFINER self-service function; and scoping the stale §8 "connection role bypasses RLS" / "no SECURITY DEFINER helper" note to the read/existence path — the B7 SEC-fix reality the VC-16 leave design depends on). Authored alongside as `Theo-1B-VC16-API-Spec-Schema-RoleC/`.
- **⚠ Pre-req for the Role-C land:** the VC-8 / VC-1.2 / VC-15 Role-C edits are currently present **only as uncommitted working-tree modifications** to `spec/THEO_API_SPEC.md` + `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (HEAD/origin `2f00b22` still carry the pre-application blobs `e3c036d` / `62b898b`). The VC-16 Role-C handoff's BEFORE text is written against that **current working-tree** state (what Codex will apply against). These three prior landings should be committed (per the `[Codex Pass 4]` pattern) together with — or immediately before — the VC-16 land. Surfaced to Walter.
- **VC-16-FE:** in the Members panel — a **Leave channel** action for any non-admin member (calls `theo_chat_leave_channel`, drops the thread from the list on success) and an **Archive channel** action gated to `admin_oid === self` (calls `theo_chat_archive_channel`, removes it from the active list).
