# Role-C Verbatim-Edit Handoff — Theo API Spec §2.2 (B5d owner-gated `member_count`)

> Pass 4 documentation-update package (Conformance §4 Pass 4). Author = Claude Code (Role-C). Inline executor = Codex. Authority = the B5d `member_count` field deployed + golden-verified 2026-07-02 (backend VEP Codex-APPROVED `f3868e6`; golden curl: owner private+invite → `member_count=1`, non-owner row → 0 no-leak). One edit to one target: append the `member_count` read field to the §2.2 B5c row's `theo_list_projects` field list (the non-blocking doc scrap noted in the B5d-backend Gap Register G-3). Documentation-only; the field is already deployed.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Role-C Verbatim-Edit Handoff (Pass 4 documentation update)
Turn issued against HEAD: `cdaf6d6` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Detail: Role-C handoff adding the deployed B5d owner-gated `member_count` field to the Theo API Spec §2.2 `theo_list_projects` field list (within the B5c per-member-invite row). Exact before/after for one edit to one target (`spec/THEO_API_SPEC.md`). No source/handler/schema change; documentation only. Codex executes verbatim per Codex Review §4.
Currency anchors: blob SHA via `git rev-parse HEAD:<path>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `git grep -F "emits a Role-C Verbatim-Edit Handoff"` this turn | `a981056de2ff889b4a7a6436fb8c445e425ca3e6` |
| 2 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Pass 4 row; §3/§5) | `git grep -F "MUST open with a Grounding Conformance Receipt"` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 3 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `git grep -F "executes the directed edits"` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 4 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 Projects — B5c row) | `Read` + `grep` this turn | `0441bc726b3b7bb2cfb52483371d0dff6f24c0bd` |

No ChatGPT advisory cited (§4D / T18). No `reporting_*`/`corporate-reporting` change. No `CLAUDE.local.md` edit (Conformance §12).

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this handoff) |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff" | This handoff's before/after edit format |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "executes the directed edits" | Execution instruction to Codex |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4 Pass 4 | "Verbatim documentation edits to Governor" | Pass-4 turn type; edits the named target only |
| spec/THEO_API_SPEC.md | §2.2 | "each additionally carrying `shared_with_me` (boolean) beside `is_owner`/`visibility`" | EDIT 1 anchor (member_count appended to the same clause) |

---

## Edit set (1 verbatim edit, 1 target document)

Target `spec/THEO_API_SPEC.md` at HEAD `cdaf6d6` (blob `0441bc7`). Codex executes the edit verbatim; no substantive additions beyond the AFTER text.

---

### EDIT 1 — `spec/THEO_API_SPEC.md` §2.2 (B5c row) — append `member_count` to the `theo_list_projects` field list

**Locate (BEFORE)** — the `theo_list_projects` read-broadening clause in the B5c "share / unshare / list members" row (unique substring):

```
returns `owner ∨ group-visible ∨ shared-with-me` rows, each additionally carrying `shared_with_me` (boolean) beside `is_owner`/`visibility`
```

**Replace with (AFTER)** — the same clause, with the `member_count` field appended:

```
returns `owner ∨ group-visible ∨ shared-with-me` rows, each additionally carrying `shared_with_me` (boolean) beside `is_owner`/`visibility`, plus `member_count` (**owner-gated** — the number of members the owner has invited; `0` for non-owner rows, so no co-member count leaks; B5d, golden-verified — the FE grid badges an owner's privately-shared project as "Shared" when `member_count > 0`)
```

---

## Companion note (NOT executed here)

No Schema-doc change: `member_count` is a computed SELECT expression on `theo_list_projects` (owner-gated `CASE`), not a stored column; it reads the existing `theo_project_members` table (B5c migration). This §2.2 clause is the only authority-doc touch needed.

---

*End of Role-C Verbatim-Edit Handoff.*
