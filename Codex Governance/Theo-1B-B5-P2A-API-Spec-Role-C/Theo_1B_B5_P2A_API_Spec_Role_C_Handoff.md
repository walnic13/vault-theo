# Role-C Verbatim-Edit Handoff — Theo API Spec §2.9 (B5 P2A roster/presence)

> Pass 4 documentation-update package (Conformance §4 Pass 4). Author = Claude Code (Role-C). Inline executor = Codex. Authority = the `theo_list_people` endpoint deployed + golden-verified 2026-07-02 (backend VEP Codex-APPROVED `612374a`; golden curl 200 full roster + live presence, 401 unauthenticated). One edit to one target: insert a new **§2.9 People / roster** section documenting `theo_list_people` (delegated Graph OBO; read-only; no Theo DB/Blob). Closes B5 P2A-backend Gap Register documentation follow-up.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (Pass 4 documentation update)
Turn issued against HEAD: `612374a` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Role-C handoff adding the deployed B5 P2A roster/presence contract to Theo API Spec as a new §2.9. Exact before/after for one edit to one target (`spec/THEO_API_SPEC.md`). No source/handler/schema change; documentation only. Codex executes verbatim per Codex Review §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `git grep -F "emits a Role-C Verbatim-Edit Handoff"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Pass 4 row; §3/§5) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `git grep -F "executes the directed edits"` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 trailing paragraph → §3 boundary) | `Read(offset=68, limit=22)` this turn | `6f8723ad54982daea1e7894d4ce7f9da821c824a` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No `CLAUDE.local.md` edit (Conformance §12).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff" | This handoff's before/after edit format |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "executes the directed edits" | Execution instruction to Codex |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 Pass 4 | "Verbatim documentation edits to Governor" | Pass-4 turn type; edits the named target only |
| spec/THEO_API_SPEC.md | §2.8 | "All attachment endpoints execute as the signed-in user" | EDIT 1 anchor (new §2.9 inserted after this paragraph) |

---

## Edit set (1 verbatim edit, 1 target document)

Target `spec/THEO_API_SPEC.md` at HEAD `6f8723a` (blob). Codex executes the edit verbatim; no substantive additions beyond the AFTER text.

---

### EDIT 1 — `spec/THEO_API_SPEC.md` — INSERT a new §2.9 People / roster section between the §2.8 trailing paragraph and `## §3 Boundary`

**Locate (BEFORE)** — the §2.8 closing paragraph immediately followed by the §3 header:

```
All attachment endpoints execute as the signed-in user; every query is explicit `created_by`-scoped, with ownership RLS the second layer (per §1). The Blob body lives in the existing `theo-content` container; the row holds only the pointer.

## §3 Boundary
```

**Replace with (AFTER)** — the same paragraph, the new §2.9 section, then the unchanged §3 header:

```
All attachment endpoints execute as the signed-in user; every query is explicit `created_by`-scoped, with ownership RLS the second layer (per §1). The Blob body lives in the existing `theo-content` container; the row holds only the pointer.

### §2.9 People / roster (Tier B5 Phase 2) — backs the vault-origin roster/presence panel
| Contract | Status | Backing |
|----------|--------|---------|
| list eligible people + live presence | `1B-deployed` — **DEPLOYED 2026-07-02** (B5 P2A; golden-verified): `GET /api/theo_list_people` (no body). Delegated Microsoft Graph **on-behalf-of** as the signed-in user: enumerates the **`Vault Staff`** dynamic group (the employeeId-gated employee roster — the same group that gates vault-origin login) via `GET /groups/{id}/members/microsoft.graph.user`, reads **live presence** via `POST /communications/getPresencesByUserId`, and fetches best-effort 48×48 photos. Returns `{ people: [{ id, displayName, email, jobTitle, availability, activity, photo, isSelf }], self }` — `id` is the member's Entra **object id (OID)**; ordered **self-first then alphabetical**; `photo` is a base64 `data:` URI or `null`; `availability`/`activity` are Graph presence values (best-effort — `null` when presence/photo lookups fail, so a Graph hiccup degrades gracefully rather than failing the roster). Unauthenticated → **401** (platform EasyAuth in front of the function). **Read-only**: no Theo table and no Blob are touched. Reuses the deployed `reporting_dms_tree` OBO technique and the monolith's existing `AAD_TENANT_ID`/`AAD_CLIENT_ID`/`AAD_CLIENT_SECRET`; the Graph delegated scopes `User.Read.All` / `Presence.Read.All` / `GroupMember.Read.All` are admin-consented. The roster is **keyed by OID** so per-member invite (Phase 2C) and the future in-Vault chat key on the same identity. | Microsoft Graph via delegated OBO (no Theo table / no Blob) |

`theo_list_people` reads only directory + presence data the signed-in user is already entitled to see; it stores nothing. Per-member project invite (`theo_project_members`) is Phase 2C.

## §3 Boundary
```

---

## Companion note (NOT executed here)

No Schema-doc change: `theo_list_people` persists nothing (no table, no Blob). The delegated-Graph OBO boundary is already described for `reporting_dms_tree` in the App Host Contract / architecture; this §2.9 row documents the Theo-side contract only.

---

*End of Role-C Verbatim-Edit Handoff.*
