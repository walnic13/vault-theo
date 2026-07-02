# Role-C Verbatim-Edit Handoff — Theo API Spec §2.2 (B5c per-member invite)

> Pass 4 documentation-update package (Conformance §4 Pass 4). Author = Claude Code (Role-C). Inline executor = Codex. Authority = the B5c per-member-invite backend deployed + golden-verified 2026-07-02 (backend VEP Codex-APPROVED `8200683`; golden curl: owner path share/unshare/list_members 200 + 400/401 negatives; member path via RO SQL impersonation — member sees shared private project, non-member + ex-member 0 rows). Two edits to one target: (1) update the stale "Phase 2" forward-reference in the B5a visibility row; (2) insert a §2.2 row documenting `theo_share_project` / `theo_unshare_project` / `theo_list_project_members` + the member-shared read semantics + the `shared_with_me` field. Closes B5c-backend Gap Register G-2.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (Pass 4 documentation update)
Turn issued against HEAD: `8200683` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Role-C handoff adding the deployed B5c per-member-invite contract to Theo API Spec §2.2. Exact before/after for two edits to one target (`spec/THEO_API_SPEC.md`). No source/handler/schema change; documentation only. Codex executes verbatim per Codex Review §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `git grep -F "emits a Role-C Verbatim-Edit Handoff"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Pass 4 row; §3/§5) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `git grep -F "executes the directed edits"` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 Projects) | `Read(offset=33, limit=12)` this turn | `30f1cacb83458acf636f44113ddbbf72d09859d0` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No `CLAUDE.local.md` edit (Conformance §12).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff" | This handoff's before/after edit format |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "executes the directed edits" | Execution instruction to Codex |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 Pass 4 | "Verbatim documentation edits to Governor" | Pass-4 turn type; edits the named target only |
| spec/THEO_API_SPEC.md | §2.2 | "Per-member invite (`theo_project_members`) + roster/presence are Phase 2." | EDIT 1 anchor (stale forward-reference, updated) |

---

## Edit set (2 verbatim edits, 1 target document)

Target `spec/THEO_API_SPEC.md` at HEAD `8200683` (blob `30f1cac`). Codex executes the edits verbatim; no substantive additions beyond the AFTER text.

---

### EDIT 1 — update the stale "Phase 2" forward-reference in the B5a visibility row

**Locate (BEFORE)** — the trailing sentence of the visibility row's contract cell:

```
Writes (create/update/delete/visibility) stay owner-only. Per-member invite (`theo_project_members`) + roster/presence are Phase 2.
```

**Replace with (AFTER):**

```
Writes (create/update/delete/visibility) stay owner-only. Per-member invite (`theo_project_members`) is **now DEPLOYED** (B5c — next row); roster/presence backs the vault-origin People panel (`theo_list_people`, §2.9).
```

---

### EDIT 2 — INSERT the B5c per-member-invite row after the visibility row

**Locate (BEFORE)** — the end of the visibility row immediately followed by the knowledge row:

```
 SELECT-only RLS broadened on `theo_projects` + `theo_project_knowledge` |
| add / list / remove project knowledge |
```

**Replace with (AFTER)** — the same visibility-row ending, the new B5c row, then the unchanged knowledge row:

```
 SELECT-only RLS broadened on `theo_projects` + `theo_project_knowledge` |
| share / unshare / list members (per-member invite) | `1B-deployed` — **DEPLOYED 2026-07-02** (B5c; golden-verified): `POST /api/theo_share_project` `{ project_id, member_oid }` (**owner-only**; `member_oid` = an Entra object id — the identity `theo_list_people` (§2.9) returns; self-invite → 400; idempotent `ON CONFLICT DO NOTHING`) → **200** `{ shared: true, project_id, member_oid }`; `POST /api/theo_unshare_project` `{ project_id, member_oid }` (**owner-only**; idempotent) → **200** `{ unshared: true, project_id, member_oid }`; `GET /api/theo_list_project_members?projectId=<uuid>` (**owner-only**) → `{ members: [{ project_id, member_oid, invited_by, created_at }] }` chronological. Owner 0-row check → 403 (existing-foreign) / 404 (absent) via `theo_project_exists_unscoped`; bad uuid → 400; unauthenticated → 401. A project **shared with** the caller (a `theo_project_members` row) is readable exactly like a group-visible one — **config-only sharing**: `theo_conversations`/`theo_messages` RLS is **unchanged** (members chat with their own conversations; no transcript exposure). Consequent read broadening (B5c): `theo_list_projects` returns `owner ∨ group-visible ∨ shared-with-me` rows, each additionally carrying `shared_with_me` (boolean) beside `is_owner`/`visibility`; `theo_list_project_knowledge` and `theo_set_conversation_project` accept an `owned ∨ group-visible ∨ shared-with-me` project. Writes (share/unshare) stay owner-only; only the owner invites/revokes. | `theo_project_members` (new; PK `(project_id, member_oid)`, FK→`theo_projects` ON DELETE CASCADE; B5c migration); SELECT-only RLS on `theo_projects` + `theo_project_knowledge` broadened to add the member clause (self-contained membership SELECT policy — no SECURITY DEFINER helper) |
| add / list / remove project knowledge |
```

---

## Companion note (NOT executed here)

The Schema doc records `theo_projects` + `theo_project_knowledge` + the ownership-RLS family; the new `theo_project_members` table + the member-clause SELECT-policy broadening are captured in the B5c migration (`b5c_migration.sql`, committed in the B5c backend package) and can be folded into the Schema doc's as-built section by a later Role-C if desired — not required for this §2.2 contract edit.

---

*End of Role-C Verbatim-Edit Handoff.*
