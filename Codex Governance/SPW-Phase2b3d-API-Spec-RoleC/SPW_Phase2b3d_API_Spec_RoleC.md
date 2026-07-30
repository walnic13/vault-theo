# Role-C Verbatim-Edit Handoff — record `theo_get_conversation` per-message `created_by` + true-up the read-scope wording in the Theo API Spec (§2.1)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. SPW Phase 2b-3d is deployed to `vaultgpt-func-premium` (Kudu VFS; golden-curl-verified — owner-200 with `created_by` present on every message row; absent 404 / bad 400 / unauth 401) and adds `created_by` to each `theo_get_conversation` message object. This Role-C updates `spec/THEO_API_SPEC.md` §2.1 (the contract-truth owner) with **two edits**: (1) add `created_by` to the message shape + a note; (2) true-up the §2.1 read-scope wording, which still says "owner-scoped read" / "not-owned → 403" although SPW Phase 2b-3b broadened READ to owner OR published-project member (the stamp-on-open stays owner-scoped). No existing behavior misstated after this; no other section touched.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Grounding parent (source baseline): `1e9b73614e61d72c724d359cd8afa6c46f1af706` (vault-theo, `development`) — this Role-C package is carried at a later reviewed commit named only in the forward note; all currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | -------------------------- |
| 1 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_get_conversation` row) | `grep -oF` (both exact anchors, count=1 each) this turn | `9291b9eecade963514a9f3854bd7cbeb862d9e2f` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | carried grounding (this program; blob-anchored) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed handler package (as-built) — `Codex Governance/Theo-SPW-Phase2b3d-GetConversation-Author-Exposure-Pass-1-VEP/` | Codex-APPROVED (`1e9b736`) + deployed + golden-curl-verified this turn | tracked package (blob `7a571dfcf5ad8e199b604c139b65526f0aade3d6`) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits" | EDIT 1 + EDIT 2 — Codex applies both §2.1 edits verbatim |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| spec/THEO_API_SPEC.md | §2.1 | "not-owned → 403" | EDIT 2 — trued-up to no-access (not owner AND not published-project member) |

## Rationale
The API Spec is the contract-truth owner. SPW Phase 2b-3d has landed (deployed + golden-curl-verified this session; handler Codex-APPROVED at `1e9b736`), so §2.1's `theo_get_conversation` row gains `created_by` on each message object. The same row still describes the read as "owner-scoped" with "not-owned → 403", which became inaccurate when Phase 2b-3b broadened READ to owner OR published-project member (the stamp-on-open remained owner-scoped); EDIT 2 trues that up in the same pass, so §2.1 matches the deployed handler. Two surgical edits; no other content touched.

## Edit set (2 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once (verified `grep -oF` = 1) or HALT. One file, two in-place edits, both in the §2.1 `theo_get_conversation` row. Target file: `spec/THEO_API_SPEC.md`.

### EDIT 1 — add `created_by` to the message shape + a note

**Locate (BEFORE) — found exactly once:**

```
response `{ conversation, messages: [{ id, seq, role, content, model, citations, media, created_at }] }`
```

**Replace with (AFTER):**

```
response `{ conversation, messages: [{ id, seq, role, created_by, content, model, citations, media, created_at }] }` (**SPW Phase 2b-3d — DEPLOYED 2026-07-30:** each message additionally carries `created_by`, the author's Entra OID, so a shared multi-party thread renders per-turn attribution — the FE resolves the OID to a display name via `theo_list_people` (§2.9); for a private single-author conversation `created_by` is always the caller's own OID)
```

### EDIT 2 — true-up the read-scope wording (2b-3b broadened READ to members; stamp stays owner-scoped)

**Locate (BEFORE) — found exactly once:**

```
**Stamp-on-open (restore-on-reopen):** on a successful owner-scoped read the handler additionally performs a best-effort owner-scoped `UPDATE theo_conversations SET last_opened_at = now()` (permitted by the deployed `theo_conversation_update_own` policy; wrapped so a stamp failure never fails the read — the returned `conversation.last_opened_at` is the pre-stamp value). invalid id → 400, not-found → 404, not-owned → 403
```

**Replace with (AFTER):**

```
**Read access (SPW Phase 2b-3b — DEPLOYED 2026-07-30):** the read is gated by the deployed SECURITY DEFINER classifier `theo_conversation_access` (Schema §11) — the caller reads a conversation they OWN **or** one PUBLISHED to a project they participate in (creator ∪ owner ∪ member); a member reads the full multi-party thread (every author's messages). **Stamp-on-open (restore-on-reopen):** on a successful read the handler additionally performs a best-effort **owner-scoped** `UPDATE theo_conversations SET last_opened_at = now()` (permitted by the deployed `theo_conversation_update_own` policy; wrapped so a stamp failure never fails the read — the returned `conversation.last_opened_at` is the pre-stamp value), so a member open updates 0 rows (a correct no-op that never touches the owner's Recents ordering). invalid id → 400, not-found → 404, no-access (neither owner nor a published-project member) → 403
```

## Note
Records `theo_get_conversation`'s `created_by` field + trues-up the read-scope wording in §2.1 via two in-place edits. No §2.2 change (the publish contracts row is already current), no banner change, no other section touched. This is the T22 authority the Phase 2c FE cites before rendering attribution / relying on member read.

Scope attestation: these edits are enumerated here, limited to `spec/THEO_API_SPEC.md` §2.1, record only the deployed + verified 2b-3d field addition + the 2b-3b read-scope reality, and alter no other content, VEP, or migration.

## Codex activation note (Walter forwards)

```
Codex is activated to execute the SPW Phase 2b-3d API-Spec Role-C handoff (vault-theo, "Codex Governance/SPW-Phase2b3d-API-Spec-RoleC/SPW_Phase2b3d_API_Spec_RoleC.md"). Open with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Grounding Conformance §3/§5). Apply EDIT 1 and EDIT 2 to spec/THEO_API_SPEC.md §2.1 verbatim — each BEFORE anchor MUST be found exactly once; apply the AFTER text in place; HALT on any mismatch. One file, two in-place edits — no line-ending normalization, no other edits. Emit APPROVED or REJECTED only.
```
