# Theo 1B — VCpush C1: API-Spec Role-C Verbatim-Edit Handoff (Pass 4)

Registers the two DEPLOYED + curl-verified C1 routes (`theo_chat_save_push_subscription`, `theo_chat_delete_push_subscription`) in `spec/THEO_API_SPEC.md` §2.10 so C3 (FE) can cite them. **Codex executes verbatim; Claude Code authors only.** This handoff makes no substantive contract change — it documents the already-deployed reality.

## Grounding Conformance Receipt

Role: Claude Code (Role-C authoring)
Turn Type: Documentation-update package (Role-C Verbatim-Edit Handoff)
Turn issued against HEAD: `67617edf09a8b8214394b81583ff4bd050322ff7` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Targeted grounding is authorized for a documentation-update package by Conformance §4 (Claude Code | Documentation-update package → Targeted Current-Turn Grounding).

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.10 In-Vault chat / channels — the edit target + house style) | `Read(spec/THEO_API_SPEC.md, offset=87, limit=14)` this turn | `b6324c7901ba1a42a17d7649c8e6497920325c92` |
| 2 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff / Pending Role-C) | `Grep(pattern="Verbatim-Edit Handoff\|Role-C", path=governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md)` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4C Pass 4 Role-C documentation-update pass) | `Grep(pattern="Role-C documentation-update pass\|Pass 4", path=governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C Inline Execution — verbatim edit discipline) | `Grep(pattern="Role-C\|verbatim", path=governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | ------- |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit)" |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4C | "Role-C documentation-update pass" |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim** (exact before/after text)" |
| spec/THEO_API_SPEC.md | §2.10 | "In-Vault chat / channels (Tier VC-1)" |

> Section-number note: the two new routes are registered under Theo API Spec **§2.10**. The Role-C mechanics anchor to the *actual* section numbers at HEAD — Governor **§11** (Verbatim-Edit Handoff / Pending Role-C) and Codex Review **§4** (Role-C Inline Execution). (The commissioning note's "Governor §15 / Codex §8" do not exist in these documents at HEAD; the real sections are anchored above.)

---

## EDIT 1 (only edit) — append two route entries to `spec/THEO_API_SPEC.md` §2.10

Target file: `spec/THEO_API_SPEC.md`, section §2.10 (`In-Vault chat / channels (Tier VC-1)`), the `| Contract | Status | Backing |` table. Insert **one new table row** as the LAST row of the table (immediately after the existing `channel leave / archive` row, before the blank line that precedes the "All `theo_chat_*` endpoints execute…" summary paragraph). House style mirrored exactly from the sibling rows: `` `1B-deployed` `` + `**DEPLOYED <date>**`, backticked routes/bodies, bolded status codes, a Backing cell.

### BEFORE (verbatim; found EXACTLY ONCE in the file — the tail of the `channel leave / archive` row)

```
Archived channels drop out of `theo_chat_list_threads`. | `theo_chat_threads` + `theo_chat_thread_members` |
```

### AFTER (the same anchor line, immediately followed by the new row on the next line)

```
Archived channels drop out of `theo_chat_list_threads`. | `theo_chat_threads` + `theo_chat_thread_members` |
| push notification subscriptions (Web Push) | `1B-deployed` — **DEPLOYED 2026-07-09** (VCpush-C1; golden-verified): `POST /api/theo_chat_save_push_subscription` `{ endpoint, p256dh, auth, ua? }` → **201** `{ subscription: { id, endpoint, created_at } }` — registers/refreshes the caller's Web Push subscription. **Single-owner-per-endpoint:** `endpoint` is **globally UNIQUE** and the write goes through the `SECURITY DEFINER theo_chat_claim_push_subscription`, which reassigns the endpoint to the authenticated caller (`created_by = auth.uid()`, NEVER a client value) — a re-subscribe on a shared browser cannot leave two owners for one endpoint (no cross-user push leak). `endpoint` must be a non-empty **https** URL and `p256dh`/`auth` non-empty (else **400 `INVALID_REQUEST`**); missing identity → **401 `UNAUTHORIZED`**; RLS denial (`42501`) → **403 `FORBIDDEN`**; unexpected → **500**. `POST /api/theo_chat_delete_push_subscription` `{ endpoint }` → **200** `{ deleted, endpoint }` — idempotent owner-scoped unsubscribe (deletes the caller's OWN row for that `endpoint` under ownership RLS; `deleted:true` when a row was removed, `deleted:false` when nothing matched); bad/missing `endpoint` → **400 `INVALID_REQUEST`**, missing identity → **401**. Storage only (Apps Phase C, C1); the push **sender** (C2, separate) reads `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` from `vaultgpt-func-chat` app settings (secrets — not in the repo). | `theo_chat_push_subscriptions` (ownership-family; `created_by` OID; `endpoint` globally UNIQUE) + the `SECURITY DEFINER public.theo_chat_claim_push_subscription` |
```

The BEFORE block's leading text `Archived channels drop out of \`theo_chat_list_threads\`.` occurs only once in the file, so the find target is unambiguous. The edit is a pure insertion (the BEFORE line is preserved verbatim; only the new row is added after it), keeping the new row inside the same markdown table (no blank line introduced before it).

---

## Note

- This is a documentation-only Role-C landing recording DEPLOYED + curl-verified reality (VCpush-C1, verified 2026-07-09: save 201, idempotent re-save 201, missing `p256dh` 400, delete 200 `deleted:true`, delete-again 200 `deleted:false`, no-auth 401). No contract behavior changes.
- The two routes are on `vaultgpt-func-chat` (POST + OPTIONS, EasyAuth `x-ms-client-principal` → OID, `{ data, meta }` / `{ error }` envelope) — identical infrastructure to the other `theo_chat_*` routes covered by the §2.10 trailing summary paragraph, so that paragraph needs no change.
- No Schema Role-C is bundled here: the C1 migration (`theo_chat_push_subscriptions` + `theo_chat_claim_push_subscription`) is registered separately per the schema-doc landing; this handoff touches only the API Spec.
- After this lands, C3 (FE) may cite the two §2.10 routes per the "deploy → API-Spec Role-C applied → FE VEP" sequence.

## Codex activation note

Open your Role-C turn with a governance-bound GCR + Rule Anchor Table (Conformance §3–§5; Codex Review §4). Then apply EDIT 1 **verbatim**: locate the found-once BEFORE anchor in `spec/THEO_API_SPEC.md` §2.10 and replace it with the AFTER text (a pure insertion of the one new table row after the preserved anchor line). Edit only `spec/THEO_API_SPEC.md`; make no substantive additions of your own. **HALT** and report if the BEFORE anchor is not found exactly once, or if any Rule Anchor quote is not a literal substring at HEAD. Verdict is APPROVED or REJECTED only.
