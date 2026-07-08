# Theo 1B — VC-16 Channel Leave + Archive: API-Spec §2.10 + Schema §3/§8 Delta — Role-C Verbatim-Edit Handoff

> **Pipeline:** Theo backend governance regime. Role-C Verbatim-Edit Handoff (Backend Governor Standard §11) authored by Claude Code for **Codex to execute inline** (Pass-4). Documents the DEPLOYED VC-16 reality. **APPROVED / REJECTED only.**
>
> **⚠ Baseline dependency (read first).** The VC-8 / VC-1.2 / VC-15 Role-C edits are present **only as uncommitted working-tree modifications** to `spec/THEO_API_SPEC.md` + `spec/THEO_AZURE_POSTGRES_SCHEMA.md` — HEAD/origin `2f00b22` still carry the pre-application committed blobs (`e3c036d` / `62b898b`). The BEFORE substrings in this handoff are quoted from that **current working-tree** state (i.e. post-VC-8/1.2/15, which is what Codex will apply against). **Codex should commit the three pending landings (VC-8/1.2/15) together with — or immediately before — landing this VC-16 handoff**, so the committed spec advances cleanly from `2f00b22` in one coherent step. This dependency has been surfaced to Walter.

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (governance/spec amendment)
Turn issued against HEAD: `2f00b22de252a170fd2ee157c2d9dcf177b1fa19` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Records DEPLOYED (2026-07-05) VC-16 reality — API-Spec §2.10 gains the `theo_chat_leave_channel` / `theo_chat_archive_channel` routes + a `list_threads` archived-exclusion note; Schema §3 `theo_chat_threads` gains `archived_at`, and §8 documents the `theo_chat_leave(uuid)` SECURITY DEFINER self-service function + scopes the stale "connection role bypasses RLS" / "no SECURITY DEFINER helper" note to the read/existence path (the B7 SEC-fix reality the leave design depends on). Verbatim before/after against the current working-tree spec. Migration was run by Walter; handlers deployed + golden-verified (see the sibling deploy-evidence).
Currency anchors: blob SHA via `git rev-parse HEAD:<path>` (committed baseline); working-tree deltas noted in the baseline-dependency banner.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (committed blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | ------------------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 chat contract — edit targets: line 91 list_threads note + a new row after line 95) | `grep -n` §2.10 lines 87–97 this turn (working-tree text) | `e3c036d782f58f08c43405c7d384d9b71ae181cc` |
| 2 | Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_chat_threads` row line 38; §8 as-built RLS note line 85) | `grep -n` §3/§8 this turn (working-tree text) | `62b898b881ad64023f99ae10414093681aaa84c8` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3/§5 GCR + Rule Anchor Table) | `grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Role-C verbatim-edit mechanism) | `grep -F "Role-C"` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 5 | VC-16 backend VEP (deployed source of truth) — `Codex Governance/Theo-1B-VC16-Channel-Leave-Archive-Backend-Pass-1-VEP/Theo_1B_VC16_Channel_Leave_Archive_Backend_VEP.md` | `Read(full)` prior turns; cited | (this-package file @ working tree) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (this handoff) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | This table |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "Role-C Verbatim-Edit Handoff (exact before/after text for each edit) for Codex to execute" | This handoff's mechanism |
| spec/THEO_API_SPEC.md | §2.10 | "channel admin lifecycle (rename / transfer)" | EDIT 1 (list_threads note) + EDIT 2 (new leave/archive row after it) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §3 | "`created_by text` (creator OID), `admin_oid text`" | EDIT 3 — `theo_chat_threads.archived_at` |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §8 | "the shared Functions connection role bypasses RLS" | EDIT 4 — leave SECURITY DEFINER fn + scope the RLS-bypass note |

## Verbatim edits (Codex to apply inline)

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.10, the "open / list DMs + channels" row — add the archived-exclusion note to `list_threads`

**BEFORE (exact substring, current working-tree text):**
```
Self/invalid `peer_oid`, blank channel name, or non-OID members → **400**. **VC-1.2 — DEPLOYED 2026-07-05:** `POST /api/theo_chat_add_member`
```
**AFTER (exact):**
```
Self/invalid `peer_oid`, blank channel name, or non-OID members → **400**. **VC-16 — DEPLOYED 2026-07-05:** `list_threads` now excludes **archived** channels (`archived_at IS NOT NULL`) from the result. **VC-1.2 — DEPLOYED 2026-07-05:** `POST /api/theo_chat_add_member`
```

### EDIT 2 — `spec/THEO_API_SPEC.md` §2.10 — add a NEW contract row immediately AFTER the "channel admin lifecycle (rename / transfer)" row (current line 95), before the trailing "All `theo_chat_*` endpoints…" paragraph

**BEFORE (exact substring — the end of the line-95 row + the blank line before the summary paragraph):**
```
VC-15 also hardened `theo_chat_add_member` / `theo_chat_remove_member` with the same execution-time admin guard (member_oids preserved → the thread UPDATE `WITH CHECK (auth.uid() = ANY(member_oids))` holds). | `theo_chat_threads` |

All `theo_chat_*` endpoints execute as the signed-in user
```
**AFTER (exact):**
```
VC-15 also hardened `theo_chat_add_member` / `theo_chat_remove_member` with the same execution-time admin guard (member_oids preserved → the thread UPDATE `WITH CHECK (auth.uid() = ANY(member_oids))` holds). | `theo_chat_threads` |
| channel leave / archive | `1B-deployed` — **DEPLOYED 2026-07-05** (VC-16): `POST /api/theo_chat_leave_channel` `{ thread_id }` → **200** `{ thread_id, left }` — a channel member removes **themselves** (`member_oids` + read-state row); the admin **cannot** leave (transfer admin first → **400**); non-participant → **404**, non-channel (dm) → **400**. The privileged self-removal runs in the `SECURITY DEFINER` `public.theo_chat_leave(uuid)` (the thread UPDATE `WITH CHECK (auth.uid() = ANY(member_oids))` blocks self-removal for the app role) — execution-time safe: the function reads the row `FOR UPDATE` (serializing against the VC-15 `transfer_admin` `FOR UPDATE` path) and re-asserts `kind='channel' AND caller = ANY(member_oids) AND caller <> admin_oid` in the removal UPDATE (0 rows → membership untouched, `left:false`), so the admin ∈ members invariant cannot break. `POST /api/theo_chat_archive_channel` `{ thread_id }` → **200** `{ thread_id, archived:true }` — **admin-gated** soft-archive (`archived_at`), idempotent, execution-time safe (`SELECT … FOR UPDATE` + `admin_oid = caller` in the UPDATE + re-read guard); non-participant → **404**, non-channel → **400**, non-admin → **403**. Archived channels drop out of `theo_chat_list_threads`. | `theo_chat_threads` + `theo_chat_thread_members` |

All `theo_chat_*` endpoints execute as the signed-in user
```

### EDIT 3 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3, the `theo_chat_threads` row (line 38) — add `archived_at`

**BEFORE (exact substring, current working-tree text):**
```
`created_by text` (creator OID), `admin_oid text` (channel administrator OID — **VC-1.2, DEPLOYED 2026-07-05**; backfilled `= created_by`; null semantics for a dm), `dm_key text NULL`
```
**AFTER (exact):**
```
`created_by text` (creator OID), `admin_oid text` (channel administrator OID — **VC-1.2, DEPLOYED 2026-07-05**; backfilled `= created_by`; null semantics for a dm), `archived_at timestamptz NULL` (**VC-16, DEPLOYED 2026-07-05** — soft-archive marker; NULL = active, non-NULL = archived and hidden from `theo_chat_list_threads`), `dm_key text NULL`
```

### EDIT 4 — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §8 as-built note (line 85) — document the `theo_chat_leave` SECURITY DEFINER function AND scope the stale RLS-bypass / no-helper statement to the read/existence path

**BEFORE (exact substring, current working-tree text):**
```
Deliberately **no `theo_chat_*_exists_unscoped` SECURITY DEFINER helper and no new elevated-read class**: a non-participant read returns 0 rows → the handler maps to **404** (no existence leak).
```
**AFTER (exact):**
```
Deliberately **no `theo_chat_*_exists_unscoped` SECURITY DEFINER helper and no new elevated-*read* class**: a non-participant read returns 0 rows → the handler maps to **404** (no existence leak). **VC-16 — DEPLOYED 2026-07-05** adds ONE narrowly-scoped write-path helper, `public.theo_chat_leave(p_thread_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public` (`REVOKE ALL … FROM PUBLIC`; `GRANT EXECUTE … TO authenticated`), owned by the migration role. It exists because RLS **is enforced for the app connection role** (participant scoping is enforced by RLS AND explicit predicates — see the defence-in-depth note below; the tables are `ENABLE`- not `FORCE`-RLS and owned by the migration role, so a `SECURITY DEFINER` function owned there bypasses the thread UPDATE `WITH CHECK (auth.uid() = ANY(member_oids))` that would otherwise block a member from removing themselves). It is safe: it removes ONLY the authenticated caller (`current_setting('request.jwt.claim.sub')`, never a parameter), only from a channel they belong to and do NOT administer, reads the row `FOR UPDATE` and re-asserts the full guard in the removal UPDATE (execution-time safe against a concurrent `transfer_admin`). No new elevated-read class is introduced.
```

## Scope note
API-Spec §2.10 (list_threads note + one new leave/archive row) + Schema §3 (line 38 `archived_at`) and §8 (line 85 leave-fn documentation + RLS-note scoping) only. No Plan delta (the VC tier is recorded). No handler/code change (documents deployed reality). **Depends on the VC-8/1.2/15 landings being committed** (see the baseline-dependency banner) — this handoff's BEFORE text is the current working-tree state.

*End of Role-C Verbatim-Edit Handoff.*
