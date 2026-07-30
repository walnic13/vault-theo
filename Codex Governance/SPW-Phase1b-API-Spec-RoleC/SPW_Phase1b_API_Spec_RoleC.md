# Role-C Verbatim-Edit Handoff — record SPW Phase 1b (role-aware sharing) as-built in the Theo API Spec

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. SPW Phase 1b is DEPLOYED + golden-verified on `vaultgpt-func-projects` (vault-projects `93e83c1`; pkg-93e83c1; role round-trip create→add[member]→promote[owner]→remove→delete all 200, permission edges 401/403/404/400). This Role-C updates `spec/THEO_API_SPEC.md` (the contract-truth owner) by **appending a Phase-1b DEPLOYED clause** to the existing §2 share/unshare/list-members row, recording: `theo_share_project`/`theo_unshare_project` are now creator-**or-owner** callable (add/remove Members; owner-status mutation stays Creator-only), responses gain `added`/`removed`; `theo_list_project_members` returns each member's `role` + the caller's `self_role`; and the **NEW** `theo_set_project_member_role` (Creator-only). One additive edit to one cell; no other change. Grounds any future FE (role-management UI) per T22 (contract before the FE cites it).

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Grounding parent (the API-spec + governance state this edit applies against): vault-theo `59b06874030422764a4b6c0902f5abdda2fbed12` (`development`). The handoff package is carried at the review tip (named in the Codex forward note, not baked here). Target + governance currency anchors below are concrete git blob SHAs.
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2 share/unshare/list-members row) | `grep -F "Writes (share/unshare) stay owner-only"` (exact append anchor) this turn | `60a2d548d75022c01595d6e5860c5003b76abe20` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Read` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed Phase-1b handlers (as-built source, referenced) — vault-projects `Codex Governance/SPW-Phase1b-Role-Aware-Sharing-Handlers-Pass-1-VEP/` | Codex-APPROVED + deployed this session (vault-projects `93e83c1`) | `theo_share_project` blob `ae57565d894cc6ad0d8ddaf38e6f665d0f63a69a` (pre-role primary ref); gate migration `75659097d611ba833741b2fb8383f7050c534334` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits" | EDIT 1 — Codex applies the §2 cell append verbatim |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| spec/THEO_API_SPEC.md | §2 | "Writes (share/unshare) stay owner-only; only the owner invites/revokes." | EDIT 1 — the append anchor (Phase-1b clause follows it) |

## Rationale
The API Spec is the contract-truth owner. Phase 1b changed the deployed share/unshare/list-members contracts (owner-capable + role fields) and added `theo_set_project_member_role`, so the §2 row must record the as-built behavior — mirroring the inline `**VC-16 — DEPLOYED**`-style addenda already used in that table. Additive append within the existing cell; no other byte changes. The deployed handler source + the gate-fn migration are the canonical implementation (referenced, not duplicated).

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once (verified `grep -cF` = 1) or HALT. One file, one additive in-cell append. Target: `spec/THEO_API_SPEC.md`, the §2 "share / unshare / list members" row.

### EDIT 1 — append the Phase-1b DEPLOYED clause to the share/unshare/list-members cell

**Locate (BEFORE) — found exactly once:**

```
Writes (share/unshare) stay owner-only; only the owner invites/revokes.
```

**Replace with (AFTER) — the same sentence, then the appended Phase-1b clause (single line, stays inside the table cell):**

```
Writes (share/unshare) stay owner-only; only the owner invites/revokes. **SPW Phase 1b — DEPLOYED 2026-07-30** (relocated to the dedicated `vaultgpt-func-projects` app, DR-T12/T13; the pre-role premium copies are dormant; golden-curl-verified — permission edges 401/403/404/400 + a create→add→promote→remove→delete role round-trip): these handlers now delegate to the deployed **SECURITY DEFINER role gate functions** (Schema §10), widening sharing to the **Creator / Owner / Member** model. `theo_share_project` (→ `theo_project_add_member`) and `theo_unshare_project` (→ `theo_project_remove_member`) are now callable by the **creator OR any `role='owner'` member** to add/remove **Members** — response gains `added` / `removed` — while an Owner may never remove another Owner: **owner-status mutation (promote/demote/remove an owner) is Creator-only**. `theo_list_project_members` (→ `theo_project_list_members`) now returns each member's `role` plus the caller's `self_role` (`creator`\|`owner`\|`member`\|null); creator/owner only. **NEW `POST /api/theo_set_project_member_role` `{ project_id, member_oid, role ∈ {'owner','member'} }` → 200 `{ project_id, member_oid, role, updated:true }` — Creator-only** promote/demote (→ `theo_project_set_member_role`). All four are thin wrappers: set the request-claim context, call the gate function, map SQLSTATE → HTTP (`28000`→401, `42501`→403, `22023`→400, `P0002`→404); none writes `theo_project_members` directly.
```

## Note
Records SPW Phase 1b as-built in the API Spec via one additive in-cell clause on the §2 share/unshare/list-members row. No table-structure change, no other row/byte change, no schema change (the gate functions + `role` column are already recorded in Schema §10). The deployed handler source (vault-projects `SPW-Phase1b-…`, `93e83c1`) and the gate-fn migration (`spw_phase1_migration.sql`, blob `75659097`) are the canonical implementation. A future FE role-management VEP grounds on this clause (T22).

Scope attestation: this edit is enumerated here, limited to `spec/THEO_API_SPEC.md`, appends only the Phase-1b DEPLOYED clause for the already-deployed + golden-verified handlers, and alters no existing content, VEP, schema, or migration.

## Codex activation note (Walter forwards)

```
Codex is activated to execute the SPW Phase 1b API-Spec Role-C handoff (vault-theo, "Codex Governance/SPW-Phase1b-API-Spec-RoleC/SPW_Phase1b_API_Spec_RoleC.md"). The handoff is carried at vault-theo development HEAD <review tip>; the GCR names 59b0687 as the grounding parent and 60a2d548 as the target API-spec blob (concrete anchors, no baked package HEAD). Open with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Grounding Conformance §3/§5). Apply EDIT 1 to spec/THEO_API_SPEC.md verbatim — the BEFORE anchor is the §2 sentence "Writes (share/unshare) stay owner-only; only the owner invites/revokes.", which MUST be found exactly once; append the Phase-1b clause per the AFTER text (single line, inside the table cell); HALT on any mismatch. One file, one additive in-cell append — no line-ending normalization, no other edits. Emit APPROVED or REJECTED only.
```
