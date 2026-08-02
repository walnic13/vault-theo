# Role-C Verbatim-Edit Handoff — record SPW Phase 2b-1 publish gate functions DEPLOYED in the Theo Azure Postgres Schema doc

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. SPW Phase 2b-1 is deployed + read-only-verified (three SECURITY DEFINER gate functions — `theo_publish_conversation`, `theo_unpublish_conversation`, `theo_list_project_conversations` — all `prosecdef=t`, `search_path=public`, EXECUTE to `authenticated` not `PUBLIC`; the §11 publish columns intact; RLS policy counts unchanged 4+4). This Role-C updates `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (the data-truth owner) by **appending a Phase-2b-1 gate-function note to the end of the existing §11 section**, citing the canonical committed migration (single source of truth — not re-embedded, to prevent drift). One additive edit; no existing content changes.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Grounding parent (source baseline): `e1911212b8b52256cf0146dcf1beb9baaa010aeb` (vault-theo, `development`) — this Role-C package is carried at a later reviewed commit named only in the forward note; all currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | -------------------------- |
| 1 | **TARGET** Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§11 DEPLOYED section + its closing sentence) | `grep -oF` (exact §11-tail anchor, count=1) this turn | `7c629ce10b283e22ebc5e41e4375f238fbd80596` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | carried grounding (this program; blob-anchored) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed SPW Phase 2b-1 migration (canonical DDL, referenced) — `Codex Governance/Theo-SPW-Phase2b1-Publish-Gates-Schema-Pass-1-VEP/spw_phase2b1_migration.sql` | Codex-APPROVED (`e191121`) + deployed + `spw_phase2b1_verify.sql` run clean this turn | `321d368aa3f53f6c2ffb2da13efd66733f0cd450` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits" | EDIT 1 — Codex applies the §11 gate-note append verbatim |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §9 | "the governed service write-path idiom" | §11 note — the three gates are the same SECURITY DEFINER idiom |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §11 | "published_to_project = true" | §11 note — the columns the three gates set/clear/filter on |

## Rationale
The schema doc is the `theo_*` data-truth owner and records DDL DEPLOYED step-by-step. SPW Phase 2b-1 has landed (deployed by Walter as `pgadmin_vault` + read-only-verified this session via `spw_phase2b1_verify.sql`; canonical migration Codex-APPROVED at `e191121`), so §11 gains a gate-function note — mirroring the §10 role-gate pattern: a canonical-DDL pointer to the committed migration (one authoritative copy, no drift) + the three signatures, their guards, the reused `theo_project_effective_role`, and the SQLSTATE→HTTP map. Pure append to the end of §11; no existing byte changes.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once (verified `grep -oF` = 1) or HALT. One file, one additive append. Target file: `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (the final sentence of §11).

### EDIT 1 — append the Phase-2b-1 gate-function note to §11

**Locate (BEFORE) — the §11 closing sentence, found exactly once:**

```
Handlers (publish/unpublish/list + broadened read/post wiring) are Phase 2b; FE is Phase 2c.
```

**Replace with (AFTER) — the same sentence, then the new gate-function note appended:**

```
Handlers (publish/unpublish/list + broadened read/post wiring) are Phase 2b; FE is Phase 2c.

**Phase 2b-1 gate functions (DEPLOYED 2026-07-30; read-only-verified — all `prosecdef=t`, `SET search_path = public`, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated`, not `PUBLIC`):** three SECURITY DEFINER functions operate the publish columns above. **Canonical DDL:** `Codex Governance/Theo-SPW-Phase2b1-Publish-Gates-Schema-Pass-1-VEP/spw_phase2b1_migration.sql` (Codex-APPROVED; deployed by Walter; additive `CREATE OR REPLACE FUNCTION` ×3 + reversible footer; not duplicated here). The caller OID is read from `current_setting('request.jwt.claim.sub')` (never a parameter — the §9/§10 idiom); the function owner bypasses RLS so authorization lives inside each function. `theo_publish_conversation(uuid) → boolean` — **CONVERSATION-owner-only** (`created_by = caller`, else `42501`); requires the conversation be linked to a project (`project_id IS NOT NULL`, else `22023`); sets `published_to_project=true, published_at=now(), published_by=caller`; idempotent (re-publish preserves the original publish metadata, returns `false`). `theo_unpublish_conversation(uuid) → boolean` — **CONVERSATION-owner-only**; clears the three flags (reverts to private; `project_id` left intact); idempotent. `theo_list_project_conversations(uuid) → TABLE(id uuid, title text, created_by text, created_at timestamptz, updated_at timestamptz, published_at timestamptz, published_by text)` — visible to **any project participant** (creator ∪ owner ∪ member, gated via the deployed `theo_project_effective_role` §10; else `P0002`/404), returning the project's published conversations ordered `updated_at DESC`. SQLSTATE→HTTP for the Phase-2b-2 handlers: `28000`→401, `42501`→403, `22023`→400, `P0002`→404. **RLS UNCHANGED** — function-gated writes add no new policy and no new projects↔conversations subquery, preserving the §11 + B5c non-recursion invariants. The func-projects handler wiring is Phase 2b-2; the chat read/post broadening (the deployed chat handlers enforce `created_by = $oid` in application SQL, so the §11 RLS broadening does not by itself enable member read/continue) is Phase 2b-3.
```

## Note
Records SPW Phase 2b-1 as DEPLOYED in the schema doc via one additive note at the end of §11. No §3 table-set change, no banner change, no existing-byte change. No Phase-1B Plan change. The paired Phase-2b-2 handler VEP (publish/unpublish/list thin wrappers on `vaultgpt-func-projects` + its API-Spec §2C Role-C) grounds on this §11 note + the committed migration.

Scope attestation: this edit is enumerated here, limited to `spec/THEO_AZURE_POSTGRES_SCHEMA.md`, appends only the Phase-2b-1 gate-function note for the already-deployed + verified migration, and alters no existing content, VEP, or migration.

## Codex activation note (Walter forwards)

```
Codex is activated to execute the SPW Phase 2b-1 Schema-Doc DEPLOYED Role-C handoff (vault-theo, "Codex Governance/Theo-SPW-Phase2b1-Schema-Doc-DEPLOYED-RoleC/Theo_SPW_Phase2b1_Schema_Doc_DEPLOYED_RoleC.md"). Open with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Grounding Conformance §3/§5). Apply EDIT 1 to spec/THEO_AZURE_POSTGRES_SCHEMA.md verbatim — the BEFORE anchor is the §11 closing sentence ("Handlers (publish/unpublish/list + broadened read/post wiring) are Phase 2b; FE is Phase 2c."), which MUST be found exactly once; append the new gate-function note after it per the AFTER text; HALT on any mismatch. One file, one additive append — no line-ending normalization, no other edits. Emit APPROVED or REJECTED only.
```
