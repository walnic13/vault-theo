# Role-C Verbatim-Edit Handoff — record the SPW Phase 2b-2 publish-to-project contracts in the Theo API Spec (§2.2)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. SPW Phase 2b-2 is deployed to `vaultgpt-func-projects` (run-from-package `pkg-f98f640`; golden-curl-verified — unauth 401 ×3, create→list-empty(200)→delete round-trip, publish/unpublish/list permission edges 400/404) and adds three HTTP contracts: `POST theo_publish_conversation`, `POST theo_unpublish_conversation`, `GET theo_list_project_conversations`. This Role-C updates `spec/THEO_API_SPEC.md` (the contract-truth owner) by **inserting one new table row into §2.2 Projects** recording those contracts AND noting they supersede the prior B5a/B5c "config-only … no chat transcripts are shared" statement (publish-to-project is the first transcript sharing — Walter-authorized). One additive row; no existing content changes.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Grounding parent (source baseline): `48a9dc682ed438c9f86fd698c5b4be2028b75c4c` (vault-theo, `development`) — this Role-C package is carried at a later reviewed commit named only in the forward note; all currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA) |
| - | ---------------------- | ------------------------------ | -------------------------- |
| 1 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 Projects table — the share/unshare row + the project-knowledge row) | `Read`(§2.2) + `grep -oF` (exact insertion anchor, count=1) this turn | `63eae771e7dd9336b57bd26f2c4fa532eb7c685d` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | carried grounding (this program; blob-anchored) | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | carried grounding (this program; blob-anchored) | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 4 | Deployed handler package (as-built contracts) — vault-projects `Codex Governance/SPW-Phase2b2-Publish-Handlers-Pass-1-VEP/` | Codex-APPROVED (`2f749b8`) + deployed (`pkg-f98f640`) + golden-curl-verified this turn | tracked package (vault-projects `f98f640`) |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits" | EDIT 1 — Codex inserts the §2.2 publish row verbatim |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| spec/THEO_API_SPEC.md | §2.2 | "no chat transcripts are shared" | EDIT 1 — the new row records the first transcript sharing, superseding this clause |

## Rationale
The API Spec is the contract-truth owner and records deployed HTTP contracts. SPW Phase 2b-2 has landed (deployed to func-projects + golden-curl-verified this session; handler package Codex-APPROVED at vault-projects `2f749b8`), so §2.2 Projects gains one row recording the three publish contracts + their permission edges + the deployed gate backing. The row also carries the T22-relevant supersession note: publishing a conversation to a project is the FIRST transcript sharing in Theo, so the prior B5a/B5c "config-only … no chat transcripts are shared" statement no longer holds unconditionally — a member of a project can now be exposed to a published conversation's transcript (once the Phase 2b-3 chat read/post broadening lands; disclosed in the row). Pure insertion of one table row before the project-knowledge row; no existing byte changes.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once (verified `grep -oF` = 1) or HALT. One file, one additive table-row insertion. Target file: `spec/THEO_API_SPEC.md` (§2.2 Projects table).

### EDIT 1 — insert the SPW Phase 2b-2 publish-to-project row before the project-knowledge row

**Locate (BEFORE) — the start of the project-knowledge row, found exactly once:**

```
| add / list / remove project knowledge | `1B-deployed` — **DEPLOYED 2026-07-01** (B4b):
```

**Replace with (AFTER) — the new publish row, then the same project-knowledge row start:**

```
| publish / unpublish conversation to project + list published (SPW Phase 2 — Shared Project Workspace transcript sharing) | `1B-deployed` — **DEPLOYED 2026-07-30** (SPW Phase 2b-2; on the dedicated `vaultgpt-func-projects` app, DR-T12/T13; golden-curl-verified — unauth 401 ×3, a create→list-empty(200)→delete round-trip, and the publish/unpublish/list permission edges 400/404): the **first transcript sharing** in Theo — **superseding the B5a/B5c "config-only … no chat transcripts are shared" note in the rows above**. A conversation the caller **owns** and has linked to a project (`project_id`) may be **published** into that project, exposing its transcript to the project's participants (creator ∪ owner ∪ member). `POST /api/theo_publish_conversation` `{ conversation_id }` (**conversation-owner-only**; the conversation must be project-linked) → **200** `{ conversation_id, published: true }` (idempotent — re-publish preserves the original `published_at`/`published_by`); `POST /api/theo_unpublish_conversation` `{ conversation_id }` (**owner-only**; idempotent) → **200** `{ conversation_id, published: false }` (reverts to private; `project_id` left intact); `GET /api/theo_list_project_conversations?projectId=<uuid>` (**any project participant**) → **200** `{ conversations: [{ id, title, created_by, created_at, updated_at, published_at, published_by }] }` ordered `updated_at DESC`. Non-owner publish/unpublish → 403; publish of an unlinked conversation → 400; absent conversation → 404; no project access on list → 404; bad uuid → 400; unauthenticated → 401. All three are thin wrappers over the deployed **SECURITY DEFINER publish gate functions** (`theo_publish_conversation` / `theo_unpublish_conversation` / `theo_list_project_conversations`, Schema §11): set the request-claim context, call the gate, map SQLSTATE → HTTP (`28000`→401, `42501`→403, `22023`→400, `P0002`→404); none writes `theo_conversations` directly. **Scope note (Phase 2b-2):** publishing sets the flags + surfaces the conversation in the project list; the shared transcript becomes **readable / continuable** by members only once the chat read/post path is broadened (**SPW Phase 2b-3** — the deployed chat handlers enforce `created_by = $oid` in application SQL, so the Schema §11 RLS broadening does not by itself open the transcript). Multi-party attributed continuation + the FE publish control land in Phase 2b-3 / 2c. | `theo_conversations` publish columns (`published_to_project`/`published_at`/`published_by`) + partial index (Schema §11, SPW Phase 2a) + the three SECURITY DEFINER publish gates (SPW Phase 2b-1); broadened `theo_conversations`/`theo_messages` SELECT/INSERT RLS (Schema §11) is inert on the chat read/post path until the Phase 2b-3 handler wiring |
| add / list / remove project knowledge | `1B-deployed` — **DEPLOYED 2026-07-01** (B4b):
```

## Note
Records the SPW Phase 2b-2 publish contracts in the API Spec via one additive §2.2 row. No existing-byte change; no other section touched; no Phase-1B Plan change. This row is the T22 authority the Phase 2c FE cites before wiring the publish control + "Shared in this project" list. The Phase 2b-3 chat read/post broadening (which actually opens the transcript to members) will add its own row/update when it lands.

Scope attestation: this edit is enumerated here, limited to `spec/THEO_API_SPEC.md`, inserts only the SPW Phase 2b-2 publish-contract row for the already-deployed + golden-curl-verified handlers, and alters no existing content, VEP, or migration.

## Codex activation note (Walter forwards)

```
Codex is activated to execute the SPW Phase 2b-2 API-Spec Role-C handoff (vault-theo, "Codex Governance/SPW-Phase2b2-API-Spec-RoleC/SPW_Phase2b2_API_Spec_RoleC.md"). Open with a governance-bound Grounding Conformance Receipt + Rule Anchor Table (Theo Grounding Conformance §3/§5). Apply EDIT 1 to spec/THEO_API_SPEC.md verbatim — the BEFORE anchor is the start of the project-knowledge row ("| add / list / remove project knowledge | `1B-deployed` — **DEPLOYED 2026-07-01** (B4b):"), which MUST be found exactly once; insert the new publish-to-project row before it per the AFTER text; HALT on any mismatch. One file, one additive table-row insertion — no line-ending normalization, no other edits. Emit APPROVED or REJECTED only.
```
