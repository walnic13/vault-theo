# Role-C Verbatim-Edit Handoff — 1B Backend Plan: add Tier B8 (Attachments)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Amends `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (v0.4 → v0.5) to add **Tier B8 — Attachments**: users attach files (PDF/image) to a chat and Theo reads them via Anthropic **document/image content blocks**. The capability was **golden-curl-verified 2026-06-28** (the deployed Foundry-Claude gateway accepts document blocks with current headers — no beta — and extracts PDF text). Stored owner-scoped in Blob (the existing `theo-content` container), injected at the gateway. Plan-only: adds scope, a PROPOSED schema row, a 1A→1B seam row, the new tier (B8a–B8d), Decision-Register entry D-8 (upload mechanism + limits), and the PRE-LAND note. Walter is the plan-content authority (he chose to add attachments next).

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `5d6de6af44fa605a08db5de6636a6afcd7eab612` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§1/§5/§6/§7/§8) | `sed §1/§5/§6/§7/§8` this turn | `f433158a9ef37789ae3a7133906d3c08c31c1783` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDITs 1–7 — Codex applies verbatim |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §8 | "Remaining open items are" | EDIT 7 — PRE-LAND summary updated for D-8 |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
After the memory layer completed, Walter prioritized **attachments** — the core tax-assistant capability ("upload this document and analyse it"). A capability golden curl confirmed the deployed Foundry-Claude gateway accepts Anthropic document content blocks (current headers; Claude read a generated PDF's text). Attachments are *input* files, which the plan does not yet cover (it has *output* `theo_artifacts`), so this adds Tier B8. Additive only; existing tiers/decisions unchanged.

## Edit set (7 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `governance/THEO_PHASE_1B_BACKEND_PLAN.md`.

### EDIT 1 — status line: v0.4 → v0.5
**Locate (BEFORE) — found once:**
```
**Status: DRAFT v0.4 — NOT YET AUTHORITATIVE.**
```
**Replace with (AFTER):**
```
**Status: DRAFT v0.5 — NOT YET AUTHORITATIVE.**
```

### EDIT 2 — status paragraph: note the v0.5 attachments addition
**Locate (BEFORE) — found once:**
```
 operationalizing the architecture's named 1B *memory* pillar (Architecture §8.2). It is **pending Codex Pass-2 review and Walter approval** before it governs.
```
**Replace with (AFTER):**
```
 operationalizing the architecture's named 1B *memory* pillar (Architecture §8.2); **v0.5** adds **Tier B8 — attachments** (users attach files to a chat; Theo reads them via Anthropic document/image content blocks — capability golden-curl-verified 2026-06-28). It is **pending Codex Pass-2 review and Walter approval** before it governs.
```

### EDIT 3 — §1 In scope: add the Attachments item
**Locate (BEFORE) — found once:**
```
6. **Memory** (option C; HF-T4 + system-prompt assembly) — a distilled per-user **memory profile** (`theo_user_memory`) surfaced across all chats/projects, plus **cross-chat history-RAG** over the user's own `theo_messages`; both RLS-scoped and injected at HF-T1 system-prompt assembly. Operationalizes the architecture's 1B `memory` pillar (Architecture §8.2). Gated by D-3 (ZDR), the D-5 Azure AI Search sub-item, and D-7 (distillation policy).
```
**Replace with (AFTER):**
```
6. **Memory** (option C; HF-T4 + system-prompt assembly) — a distilled per-user **memory profile** (`theo_user_memory`) surfaced across all chats/projects, plus **cross-chat history-RAG** over the user's own `theo_messages`; both RLS-scoped and injected at HF-T1 system-prompt assembly. Operationalizes the architecture's 1B `memory` pillar (Architecture §8.2). Gated by D-3 (ZDR), the D-5 Azure AI Search sub-item, and D-7 (distillation policy).
7. **Attachments** (Tier B8) — users attach files (PDF/image) to a chat; Theo reads them via Anthropic **document/image content blocks** at the gateway (capability golden-curl-verified — Foundry accepts document blocks with current headers). Stored owner-scoped in Blob (`theo_attachments` + the `theo-content` container). Gated by D-8 (upload mechanism + limits); D-3 (ZDR, RESOLVED) covers attachment content reaching the model.
```

### EDIT 4 — §5 schema: add the `theo_attachments` PROPOSED row
**Locate (BEFORE) — found once:**
```
| `theo_user_memory` *(B7, option C)* | distilled cross-chat memory item | `created_by` (Entra OID), `scope text` (`'user'`\|`'project'`), `project_id uuid NULL` (set when `scope='project'`), `kind text`, `content text`, `source_conversation_id uuid NULL`, `salience`/`updated_at`; user-viewable/editable; injected at system-prompt assembly; ownership RLS |
```
**Replace with (AFTER):**
```
| `theo_user_memory` *(B7, option C)* | distilled cross-chat memory item | `created_by` (Entra OID), `scope text` (`'user'`\|`'project'`), `project_id uuid NULL` (set when `scope='project'`), `kind text`, `content text`, `source_conversation_id uuid NULL`, `salience`/`updated_at`; user-viewable/editable; injected at system-prompt assembly; ownership RLS |
| `theo_attachments` *(B8)* | file attached to a chat | `created_by` (Entra OID), `conversation_id uuid NULL`, `filename`, `content_type`, `byte_size`, `blob_container`/`blob_path` (pointer into `theo-content`), `created_at`; ownership RLS + `_exists_unscoped(uuid)`; injected as document/image content blocks at the gateway |
```

### EDIT 5 — §6 seam: add the Attachments surface row
**Locate (BEFORE) — found once:**
```
| Memory (option C) | *absent in 1A* | distilled per-user profile (`theo_user_memory`) + cross-chat history-RAG over `theo_messages`, RLS-scoped, injected at system-prompt assembly (B7) |
```
**Replace with (AFTER):**
```
| Memory (option C) | *absent in 1A* | distilled per-user profile (`theo_user_memory`) + cross-chat history-RAG over `theo_messages`, RLS-scoped, injected at system-prompt assembly (B7) |
| Attachments (B8) | *absent in 1A* | upload files → Blob (`theo_attachments` / `theo-content`), injected as document/image content blocks to Foundry-Claude (HF-T1), owner-scoped |
```

### EDIT 6 — §7: add Tier B8 after Tier B7 (before §8)
**Locate (BEFORE) — found once:**
```
- **Completion.** A fact stated in one chat is recalled in another (profile); a question about a past discussion retrieves the relevant prior turns (history-RAG); the user can inspect and edit their memory; all strictly RLS-scoped to the signed-in user. **Gated:** D-3 ZDR (distillation + indexing are client-PII flows), the D-5 Azure AI Search sub-item (history-RAG index), and D-7 (distillation policy) — no live client-PII memory traffic before these resolve.

---

## 8. Open decisions (Walter) — Decision Register seed
```
**Replace with (AFTER):**
```
- **Completion.** A fact stated in one chat is recalled in another (profile); a question about a past discussion retrieves the relevant prior turns (history-RAG); the user can inspect and edit their memory; all strictly RLS-scoped to the signed-in user. **Gated:** D-3 ZDR (distillation + indexing are client-PII flows), the D-5 Azure AI Search sub-item (history-RAG index), and D-7 (distillation policy) — no live client-PII memory traffic before these resolve.

### Tier B8 — Attachments (file upload → document/image content blocks)
- **Purpose.** Let users attach files (PDF/image/etc.) to a chat so Theo can read and reason over them — the core tax-assistant use case ("analyse this K-1 / statement / workpaper"). Capability verified 2026-06-28: the deployed Foundry-Claude gateway accepts Anthropic document content blocks with current headers (no beta) and extracts PDF text.
- **Deliverables.**
  - **B8a — schema.** `theo_attachments` table (§5) + 4-policy ownership RLS + `theo_attachment_exists_unscoped(uuid)`; Blob pointer into the existing `theo-content` container.
  - **B8b — upload handler.** `theo_upload_attachment` — store the file in Blob + insert the owner-scoped metadata row; return the attachment id. Upload mechanism + size/type limits per D-8.
  - **B8c — gateway integration.** `theo_message` accepts `attachment_ids`; for each **owned** attachment, fetch the blob, base64-encode, and inject a `document`/`image` content block alongside the user text (handle array-content `userText`/title persistence).
  - **B8d — frontend.** Composer attach control + upload + attachment chips (Theo FE regime).
- **Completion.** A user uploads a document and Theo answers questions grounded in it; attachments are owner-scoped (RLS + explicit `created_by`); content reaches the model only via the gateway (D-3 ZDR resolved). **Gated:** D-8 (upload mechanism + limits) gates B8b; B8a schema is not gated.

---

## 8. Open decisions (Walter) — Decision Register seed
```

### EDIT 7 — §8: add D-8 + extend the PRE-LAND summary
**Locate (BEFORE) — found once:**
```
Remaining open items are **PRE-LAND** for their tiers: the AI-Search sub-item of D-5 gates B6 **and the B7b history-RAG index**; D-6 gates B5. **D-3 (ZDR) and D-7 (memory distillation policy) are RESOLVED (2026-06-28)** — B7 distillation + system-prompt injection are no longer gated; B7b history-RAG still awaits the D-5 Azure AI Search resource. No tier proceeds on a guessed decision.
```
**Replace with (AFTER):**
```
| **D-8** | Attachment upload mechanism (direct base64 through the handler vs a short-lived SAS for direct-to-Blob) + max file size + allowed content types + retention. | **OPEN.** Walter confirms the mechanism + limits; Claude Code recommends in the B8b VEP. Gates B8b (upload handler); B8a schema is not gated. |

Remaining open items are **PRE-LAND** for their tiers: the AI-Search sub-item of D-5 gates B6 **and the B7b history-RAG index**; D-6 gates B5; **D-8 gates B8b (attachment upload mechanism + limits)**. **D-3 (ZDR) and D-7 (memory distillation policy) are RESOLVED (2026-06-28)** — B7 distillation + system-prompt injection are no longer gated. No tier proceeds on a guessed decision.
```

## Note
Seven verbatim edits to one file (`governance/THEO_PHASE_1B_BACKEND_PLAN.md`): v0.4→v0.5 status + clause; §1 Attachments scope item; §5 `theo_attachments` PROPOSED row; §6 Attachments seam row; §7 new Tier B8; §8 D-8 row inserted before the PRE-LAND summary + the summary updated. Additive; no existing tier/decision text removed. Plan remains DRAFT / NOT-YET-AUTHORITATIVE pending Walter approval.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-Plan-Attachments-B8-Amendment-RoleC/Theo_1B_Plan_Attachments_B8_Amendment_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-Plan-Attachments-B8-Amendment-RoleC/Theo_1B_Plan_Attachments_B8_Amendment_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-Plan-Attachments-B8 Role-C. Apply EDITs 1–7 to `governance/THEO_PHASE_1B_BACKEND_PLAN.md` verbatim (each BEFORE anchor found exactly once; HALT on mismatch): v0.4→v0.5 status + clause, §1 Attachments item, §5 `theo_attachments` row, §6 Attachments seam row, §7 Tier B8, §8 D-8 + updated PRE-LAND. Additive only — no existing tier/decision removed."*

*End of Role-C Verbatim-Edit Handoff.*
