# Vault Six-Plates Lens (Stage-0 §7.5) — Schema-doc §3/§6 — Pass-4 Role-C

Documentation-update (Role-C) handoff closing the **G-SCHEMADOC PRE-LAND gap** from the Codex-APPROVED Pass-1 VEP ([[Vault_SixPlates_Lens_Stage0_7_5_VEP.md]], commit `9d7a965`). The migration is **run** (Walter, `pgadmin_vault`) and the `plate` column is **catalog-verified** read-only. Per deploy→document ordering this Role-C records the DDL. **Documentation-only — no code/schema/deploy.** Two additive edits in `spec/THEO_AZURE_POSTGRES_SCHEMA.md`: a note on the §3 `theo_user_memory` row, and a Six-Plates addendum paragraph in §6 (Tier B7a). No existing structural line removed; the §3 edit appends within the existing row's cells. (No API-Spec change — no endpoint.)

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Role-C documentation update (Schema-doc §3 row note + §6 addendum; deploy→document, post-verified)
Grounding parent (source baseline): `9d7a965554b08eb71a6142ce7f20f94646c60762` (vault-theo, `development`) — the commit carrying the Codex-APPROVED Pass-1 VEP; currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | SCHEMA TRUTH (edit target) — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§3 `theo_user_memory` row = Edit A anchor; §6 Tier B7a "As-built specifics" tail = Edit B anchor) | `grep`(§3 row) + `sed`(§6 tail) this turn | `6b213eb061ac39253d4038e2bee71ef407dadb7f` |
| 2 | APPROVED PASS-1 VEP (defines the migration + verification) — `Codex Governance/Vault-SixPlates-Lens-Stage0-7-5-Pass-1-VEP/Vault_SixPlates_Lens_Stage0_7_5_VEP.md` | Codex-APPROVED (approval commit `9d7a965`); §1/§4/§6 re-read this turn | `09222aaef60fbda557662ed8107becb158a16a4d` |
| 3 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1D ordered pass — deploy precedes the schema Role-C) | `Grep("ordered, non-skippable")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §6 | "DEPLOYED DDL — Tier B7a" | Edit B — the §6 section the addendum extends |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1D | "ordered, non-skippable" | deploy→document ordering: recorded only AFTER the Walter-run migration + verification |

---

## §1 — What this Role-C lands (gap closure + evidence)

The Pass-1 VEP §7 declared **G-SCHEMADOC** as PRE-LAND. Preconditions met:
- **Migration run** by Walter as `pgadmin_vault`.
- **Catalog-verified** (read-only, shared-instance `codex_reporting_ro`): `plate` present — `text`, nullable, no default; **no CHECK** references `plate` (open — C1); the scope CHECKs `theo_user_memory_scope_check` + `theo_user_memory_scope_project_ck` are **unchanged** (no shape change — C2); `idx_theo_user_memory_owner_plate` present (`… WHERE plate IS NOT NULL`); the four ownership RLS policies intact.

The wording below is taken from the deployed reality + the approved migration, not invented.

## §2 — Exact verbatim doc edits (Codex applies byte-for-byte)

### Edit A — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §3: annotate the `theo_user_memory` row
**Operation:** REPLACE the tail of the `theo_user_memory` row (the exact string below appears once) to append the plate note. Only this substring changes.

BEFORE (exact substring):
```
`salience int`. CHECK: `scope='project'` iff `project_id` set. Mutable. Injected at system-prompt assembly. | DEPLOYED — B7a (§6) |
```
AFTER (exact replacement):
```
`salience int`, `plate text NULL` (**§7.5 Six-Plates lens, DEPLOYED 2026-08-01** — open, no CHECK; the opt-in life-plate lens tag, NULL = default Work & Craft; partial index `idx_theo_user_memory_owner_plate` on opted-in rows). CHECK: `scope='project'` iff `project_id` set. Mutable. Injected at system-prompt assembly. | DEPLOYED — B7a (§6) |
```

### Edit B — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` §6: append the Six-Plates addendum
**Operation:** INSERT the paragraph below immediately **after** the §6 "As-built specifics" paragraph (which ends `…no `reporting_*` touched.`) and **before** the blank line preceding `## §7 DEPLOYED DDL — Tier B8a`. One blank line above and below.

Insert exactly this block:

```markdown
**Six-Plates lens addendum (Stage-0 §7.5, DEPLOYED 2026-08-01):** Walter executed the additive/idempotent `theo_user_memory_plate_migration.sql` from `Codex Governance/Vault-SixPlates-Lens-Stage0-7-5-Pass-1-VEP/` (Codex-APPROVED at `9d7a965`; `ADD COLUMN`/`CREATE INDEX IF NOT EXISTS`; no top-level `BEGIN`/`COMMIT`), adding a nullable **`plate text`** column (Vault Memory Architecture Stage-0 §7.5 — the opt-in Six-Plates lens) plus a partial index `idx_theo_user_memory_owner_plate ON (created_by, plate) WHERE plate IS NOT NULL`. **OPEN taxonomy — NO CHECK on `plate`** (design C1): the FE offers the six domains (Body / Inner Life / Close Others / Wider Belonging / Work & Craft / Material World); the DB enforces no closed vocabulary. A **NULL** plate = the DEFAULT Work & Craft lens (work-awareness is default for everyone); a **non-NULL** plate = the user has OPTED IN to filing that memory under a life-plate. **NO substrate-shape change** — the `scope` / `theo_user_memory_scope_project_ck` CHECKs are UNTOUCHED (plates are metadata on the existing `scope='user'` rows, NOT a new scope — design C2), so no `VAULT_MEMORY_ARCHITECTURE.md` §6 amendment is triggered. The new column inherits `theo_user_memory`'s four ownership RLS policies (column-agnostic); **no RLS change**. The lens is a presentation/organisation overlay on the owner's own **L1 (inviolable)** rows — **NOT an access dimension** (the access-policy engine's `theo_can_read` L1 branch is `created_by = caller` and does not read `plate`). Read-only-verified (catalog 2026-08-01): `plate` present (text, nullable, no default); no CHECK references `plate`; the scope CHECKs unchanged; the partial index present; the four ownership policies intact. Deferred follow-on (by design): per-plate MODE (active/settled/delegated/developing) + check-in UI (vision §11), lens consumption (write-plate / lens-filtered prompt assembly), and the C3 history-RAG lens filter. Canonical DDL: the migration file above; read-only verification `…/theo_user_memory_plate_verify.sql`.
```

## §3 — Confirmations

- **Scope:** two additive edits — a note appended within the §3 row's Notes cell (no row added/removed), and a new addendum paragraph in §6 (before §7). No structural line removed; no renumbering.
- **No code/schema/deploy** — the column is already live; this only records its DDL. No API-Spec change (no endpoint).
- On Codex APPROVAL, Claude applies the two edits byte-faithfully and commits (verified-Role-C landing).
