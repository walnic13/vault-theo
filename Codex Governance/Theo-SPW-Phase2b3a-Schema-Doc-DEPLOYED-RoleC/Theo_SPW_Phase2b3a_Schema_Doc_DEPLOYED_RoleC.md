# Role-C Verbatim-Edit Handoff — record the SPW Phase 2b-3a conversation-access helper DEPLOYED in the Theo Azure Postgres Schema doc

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. SPW Phase 2b-3a is deployed + read-only-verified (one read-only SECURITY DEFINER classifier `theo_conversation_access(uuid) → text`; `prosecdef=t`, `search_path=public`, EXECUTE to `authenticated` not `PUBLIC`; RLS policy counts unchanged 4+4; publish columns intact). This Role-C updates `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (the data-truth owner) by **appending a Phase-2b-3a helper note to the end of the existing §11 section**, citing the canonical committed migration (single source of truth — not re-embedded, to prevent drift). One additive edit; no existing content changes.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Grounding parent (source baseline): `08b02a2ec32b4f2025563a8229bd31d3f72143fd` (vault-theo, `development`) — this Role-C package is carried at a later reviewed commit named only in the forward note; all currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | -------------------------- |
| 1 | **TARGET** Theo Azure Postgres Schema — `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (§11 DEPLOYED section + its Phase-2b-1 gate-note tail) | `tail` + `grep -oF` (exact §11-tail anchor, count=1) this turn | `267e962861d9e03a56e51e54060aa91b4dbc5b8a` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | carried grounding (this program; blob-anchored) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed SPW Phase 2b-3a migration (canonical DDL, referenced) — `Codex Governance/Theo-SPW-Phase2b3a-Conversation-Access-Helper-Pass-1-VEP/spw_phase2b3a_migration.sql` | Codex-APPROVED (`08b02a2`) + deployed + `spw_phase2b3a_verify.sql` run clean this turn | `4d589f83b4954b43196bd7074b1fe29075df0c8f` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits" | EDIT 1 — Codex applies the §11 helper-note append verbatim |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §9 | "the governed service write-path idiom" | §11 note — the helper is the same SECURITY DEFINER idiom (read-only classifier) |
| spec/THEO_AZURE_POSTGRES_SCHEMA.md | §11 | "published_to_project = true" | §11 note — the helper's `'member'` branch mirrors the §11 access predicate |

## Rationale
The schema doc is the `theo_*` data-truth owner and records DDL DEPLOYED step-by-step. SPW Phase 2b-3a has landed (deployed by Walter as `pgadmin_vault` + read-only-verified this session via `spw_phase2b3a_verify.sql`; canonical migration Codex-APPROVED at `08b02a2`), so §11 gains a helper note — mirroring the §11 gate-note pattern: a canonical-DDL pointer to the committed migration (one authoritative copy, no drift) + the signature, its return contract, the §11 predicate parity, and why it exists (the chat-handler RLS-bypass reality). Pure append to the end of §11; no existing byte changes.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once (verified `grep -oF` = 1) or HALT. One file, one additive append. Target file: `spec/THEO_AZURE_POSTGRES_SCHEMA.md` (the final sentence of §11).

### EDIT 1 — append the Phase-2b-3a helper note to §11

**Locate (BEFORE) — the §11 closing sentence, found exactly once:**

```
The func-projects handler wiring is Phase 2b-2; the chat read/post broadening (the deployed chat handlers enforce `created_by = $oid` in application SQL, so the §11 RLS broadening does not by itself enable member read/continue) is Phase 2b-3.
```

**Replace with (AFTER) — the same sentence, then the new helper note appended:**

```
The func-projects handler wiring is Phase 2b-2; the chat read/post broadening (the deployed chat handlers enforce `created_by = $oid` in application SQL, so the §11 RLS broadening does not by itself enable member read/continue) is Phase 2b-3.

**Phase 2b-3a access helper (DEPLOYED 2026-07-30; read-only-verified — `prosecdef=t`, `SET search_path = public`, `REVOKE ALL … FROM PUBLIC` + `GRANT EXECUTE … TO authenticated`, not `PUBLIC`):** one **read-only** SECURITY DEFINER classifier `theo_conversation_access(uuid) → text` — the single audited home of the publish-to-project read/continue access predicate. **Canonical DDL:** `Codex Governance/Theo-SPW-Phase2b3a-Conversation-Access-Helper-Pass-1-VEP/spw_phase2b3a_migration.sql` (Codex-APPROVED; deployed by Walter; additive `CREATE OR REPLACE FUNCTION` + reversible footer; not duplicated here). Returns `'owner'` when `created_by = caller`, `'member'` when the conversation is published to a project the caller participates in — **byte-for-byte the §11 access set** (`published_to_project = true AND project_id IS NOT NULL AND project_id ∈ (creator ∪ member)`) — else `NULL`. Caller OID from `current_setting('request.jwt.claim.sub')` (never a parameter); performs **no write**. It exists because the deployed chat read/post handlers (`theo_get_conversation`, `theo_message` on func-premium; `theo_message_stream` on func-stream) connect with a Functions role that **BYPASSES RLS** and gate on explicit `created_by = $oid` application SQL, so the §11 RLS broadening does not by itself open a published transcript; the Phase-2b-3b (`theo_get_conversation` read) + Phase-2b-3c (`theo_message`/`theo_message_stream` continue) handler edits call this helper to gate reads + continuation with one call (NULL → the existing `theo_conversation_exists_unscoped` 403/404 discrimination). **RLS UNCHANGED** — additive read-only function; no policy, table, column, or row change.
```

## Note
Records SPW Phase 2b-3a as DEPLOYED in the schema doc via one additive note at the end of §11. No §3 table-set change, no banner change, no existing-byte change. No Phase-1B Plan change. The paired Phase-2b-3b/2b-3c handler VEPs (the chat read/continue broadening that calls this helper) ground on this §11 note + the committed migration.

Scope attestation: this edit is enumerated here, limited to `spec/THEO_AZURE_POSTGRES_SCHEMA.md`, appends only the Phase-2b-3a helper note for the already-deployed + verified migration, and alters no existing content, VEP, or migration.

## Codex activation note (Walter forwards)

```
Codex is activated to execute the SPW Phase 2b-3a Schema-Doc DEPLOYED Role-C handoff (vault-theo, "Codex Governance/Theo-SPW-Phase2b3a-Schema-Doc-DEPLOYED-RoleC/Theo_SPW_Phase2b3a_Schema_Doc_DEPLOYED_RoleC.md"). Open with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Grounding Conformance §3/§5). Apply EDIT 1 to spec/THEO_AZURE_POSTGRES_SCHEMA.md verbatim — the BEFORE anchor is the §11 closing sentence ("The func-projects handler wiring is Phase 2b-2; the chat read/post broadening … is Phase 2b-3."), which MUST be found exactly once; append the new helper note after it per the AFTER text; HALT on any mismatch. One file, one additive append — no line-ending normalization, no other edits. Emit APPROVED or REJECTED only.
```
