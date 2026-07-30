# Role-C Verbatim-Edit Handoff — record `theo_get_conversation`'s conversation-object `created_by` + `published_to_project` in the Theo API Spec (§2.1)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. SPW Phase 2c-iii-be is deployed to `vaultgpt-func-premium` (Kudu VFS; golden-curl-verified — owner-200 with `created_by` + `published_to_project` present on the `conversation` object; absent 404 / bad 400 / unauth 401) and adds those two fields to the `theo_get_conversation` conversation object. This Role-C updates `spec/THEO_API_SPEC.md` §2.1 (the contract-truth owner) with **one edit**: extend the conversation-object field list to record `created_by` (owner OID) + `published_to_project` (boolean). No other section touched; no existing behavior misstated after this.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Grounding parent (source baseline): `186265946735976e7a471ccad5c2b2afb1cc16e0` (vault-theo, `development`) — this Role-C package is carried at a later reviewed commit named only in the forward note; all currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | -------------------------- |
| 1 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_get_conversation` conversation-object clause) | `grep -oF` (exact conversation-object anchor, count=1) this turn | `fc0443eee2b598d8026cb40e073d4bc115a4a31e` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | carried grounding (this program; blob-anchored) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed handler package (as-built) — `Codex Governance/Theo-SPW-Phase2ciii-be-GetConversation-Publish-State-Pass-1-VEP/` | Codex-APPROVED (`1862659`) + deployed + golden-curl-verified this turn | tracked package (handler blob `7e31d701fbd2404f4dc2cd8d92d1576d5382d71f`) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits" | EDIT 1 — Codex applies the §2.1 field-list extension verbatim |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| spec/THEO_API_SPEC.md | §2.1 | "the `conversation` object includes `last_opened_at`" | EDIT 1 — the clause gains `created_by` + `published_to_project` |

## Rationale
The API Spec is the contract-truth owner. SPW Phase 2c-iii-be has landed (deployed + golden-curl-verified this session; handler Codex-APPROVED at `1862659`), so §2.1's `theo_get_conversation` conversation-object clause gains `created_by` (owner OID) + `published_to_project` (boolean) — the fields the Phase-2c-iii FE cites to gate the owner-only publish control + reflect the shared state. One in-place edit; no other content touched.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once (verified `grep -oF` = 1) or HALT. One file, one in-place edit, in the §2.1 `theo_get_conversation` row. Target file: `spec/THEO_API_SPEC.md`.

### EDIT 1 — extend the conversation-object field list with `created_by` + `published_to_project`

**Locate (BEFORE) — found exactly once:**

```
the `conversation` object includes `last_opened_at` (nullable `timestamptz`)
```

**Replace with (AFTER):**

```
the `conversation` object includes `last_opened_at` (nullable `timestamptz`), plus **`created_by`** (the owner's Entra OID) and **`published_to_project`** (boolean) — **SPW Phase 2c-iii-be, DEPLOYED 2026-07-31**: the FE gates the owner-only publish control on `created_by == self` (People roster §2.9) and reflects the shared state via `published_to_project` (the publish substrate, Schema §11; `theo_publish_conversation` / `theo_unpublish_conversation`, §2.2)
```

## Note
Records `theo_get_conversation`'s `created_by` + `published_to_project` conversation-object fields in §2.1 via one in-place edit. No §2.2 change (the publish contracts row is already current), no other section touched. This is the T22 authority the Phase-2c-iii FE cites before wiring the publish control + shared-state banner.

Scope attestation: this edit is enumerated here, limited to `spec/THEO_API_SPEC.md` §2.1, records only the deployed + verified 2c-iii-be field additions, and alters no other content, VEP, or migration.

## Codex activation note (Walter forwards)

```
Codex is activated to execute the SPW Phase 2c-iii-be API-Spec Role-C handoff (vault-theo, "Codex Governance/SPW-Phase2ciii-be-API-Spec-RoleC/SPW_Phase2ciii_be_API_Spec_RoleC.md"). Open with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Grounding Conformance §3/§5). Apply EDIT 1 to spec/THEO_API_SPEC.md §2.1 verbatim — the BEFORE anchor is "the `conversation` object includes `last_opened_at` (nullable `timestamptz`)", which MUST be found exactly once; apply the AFTER text in place; HALT on any mismatch. One file, one in-place edit — no line-ending normalization, no other edits. Emit APPROVED or REJECTED only.
```
