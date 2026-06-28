# Role-C Verbatim-Edit Handoff — API Spec §2.7: document the Memory contract (B7)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Adds a new **§2.7 Memory** section to `spec/THEO_API_SPEC.md` documenting the **deployed + golden-curl-verified** B7a memory CRUD endpoints (`theo_list/create/update/delete_user_memory`) plus the planned distillation + B7b history-RAG, so the contract is locked before any FE memory-controls VEP cites it (un-spec'd contract = T22). One additive edit; no existing row changes.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `32dd319de56737f5151ef331e4e0ec48cfecba03` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo API Spec — `spec/THEO_API_SPEC.md` (§2.6 → §3 boundary) | `sed -n '47,56p'` this turn | `010133b146b5fa8c5ed1820f6b25b40f6bb1656b` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDIT 1 — Codex applies verbatim |
| spec/THEO_API_SPEC.md | §2.6 | "Tool dispatch + RAG" | EDIT 1 anchor (new §2.7 inserted after §2.6, before §3) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
B7a (deployed 2026-06-28, golden-curl-verified) added four memory CRUD endpoints over the deployed `theo_user_memory` table. §2 of the API Spec does not yet document a Memory contract. This edit adds §2.7 recording the deployed endpoints + the planned distillation/injection and B7b history-RAG, so the cited contract exists before the FE memory-controls VEP (T22 prevention). Additive only — inserted between §2.6 and §3.

## Edit set (1 verbatim edit)
Codex executes verbatim; the BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `spec/THEO_API_SPEC.md`.

### EDIT 1 — insert §2.7 Memory (after §2.6, before §3)

**Locate (BEFORE) — found once:**
```
| RAG retrieval (Azure AI Search; tax corpus + project knowledge, RLS-scoped) | `1A-contract` (mocked, stub results — architecture §6) / `1B-deployed` | HF-T4 |

## §3 Boundary
```

**Replace with (AFTER):**
```
| RAG retrieval (Azure AI Search; tax corpus + project knowledge, RLS-scoped) | `1A-contract` (mocked, stub results — architecture §6) / `1B-deployed` | HF-T4 |

### §2.7 Memory (option C; B7) — backs the memory controls + cross-chat recall
| Contract | Status | Backing |
|----------|--------|---------|
| list / create / update / delete user memory | `1B-deployed` — **DEPLOYED 2026-06-28** (B7a): `GET /api/theo_list_user_memory` (`?scope`=user\|project, `?projectId`), `POST /api/theo_create_user_memory`, `POST /api/theo_update_user_memory`, `POST /api/theo_delete_user_memory`. Per-user `created_by`-scoped (explicit predicate; the connection role bypasses RLS). Item shape `{ id, scope, project_id, kind, content, source_conversation_id, salience, created_at, updated_at }`; create validates the scope⟺project_id invariant + FK ownership (project / source conversation owned by the caller). | `theo_user_memory` (HF-T2; B7a) |
| distilled memory written from completed turns; injected at system-prompt assembly | `1B` (sequenced; D-7 distillation policy RESOLVED, D-3 ZDR RESOLVED) | distillation step → `theo_user_memory` (B7) |
| cross-chat history-RAG over the user's own `theo_messages` | `1B` (PRE-LAND; needs Azure AI Search `vaultgpt-search` + embeddings) | HF-T4 over `theo_messages`, `created_by`-scoped (B7b) |

## §3 Boundary
```

## Note
One additive edit to `spec/THEO_API_SPEC.md`: a new §2.7 Memory section between §2.6 and §3. No existing row/section changes. Documents the deployed B7a contract + the planned B7 distillation/B7b history-RAG. After this lands, an FE memory-controls VEP can cite §2.7 (T22 resolved).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-API-Spec-Memory-RoleC/Theo_1B_API_Spec_Memory_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-API-Spec-Memory-RoleC/Theo_1B_API_Spec_Memory_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-API-Spec-Memory Role-C. Apply EDIT 1 to `spec/THEO_API_SPEC.md` verbatim (BEFORE anchor — the §2.6 RAG row + `## §3 Boundary` — found exactly once; HALT on mismatch). Inserts a new §2.7 Memory section documenting the deployed B7a endpoints + planned B7/B7b. Additive only; no existing section changes."*

*End of Role-C Verbatim-Edit Handoff.*
