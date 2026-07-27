# Theo 1B — Artifact rules: route spreadsheet/Excel requests to the export tool — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** user feedback (Agustin + Jared) — asking Theo for an Excel file produces a markdown table, not a real `.xlsx` download. Root cause (confirmed in-repo): the FE system-prompt's `ARTIFACT_RULES` ([swapBlock.ts]) instructs the model to wrap a **"table"** deliverable as a markdown `[[ARTIFACT type="document"]]`, and neither `ARTIFACT_RULES` nor the backend `THEO_RULESET` (v1.2) mentions the deployed `theo_export_spreadsheet` tool — so the model follows the explicit artifact rule and inlines a table instead of calling the tool (which exists, is offered to the model, and renders a download card via `event: vault_export`). This VEP amends `ARTIFACT_RULES`: **drop "table" from the artifact-deliverable list** and **add an explicit rule** that spreadsheet/Excel/"export"/"download" requests MUST call `theo_export_spreadsheet` (typed columns/rows) rather than inline a table or artifact; a small read-only table stays inline Markdown. One file (`swapBlock.ts`), a prompt-string constant. No visual-surface change, no new state, no browser storage, no backend/contract/schema change (the system prompt is already sent to `theo_message_stream`; `theo_export_spreadsheet` is already deployed).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `bda497a905ba2fd2e9ef8ccbb33506399fe69772` (vault-theo, `development`, base at authoring; the commit that CONTAINS this package is given in the Codex note)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix; Pass-1 row = Full Baseline Grounding). Frontend sub-phases F-P1…F-P6 walked; the backend P/I/E track does not apply → `N/A`. Amends the `ARTIFACT_RULES` constant in `src/theo/swapBlock.ts` (consumed by `buildSystemPrompt` in `src/theo/lib/prompt.ts`, whose output is passed to `theo_message_stream` as `systemPrompt` and appended into the effective system prompt after `THEO_RULESET`). Verified this turn: (a) the deployed `theo_export_spreadsheet` tool is offered to the model (`theo_message_stream` builds `tools: [...buildGroundingTools(), ...CHAT_TOOL_SCHEMAS]`) and its schema description already says "Call this when the user wants their data AS a spreadsheet / Excel file to download"; (b) `THEO_RULESET` v1.2 contains no spreadsheet/export guidance; (c) the current `ARTIFACT_RULES` lists "table" among artifact deliverables. Delta = remove "table" from that list + append a spreadsheet/Excel → `theo_export_spreadsheet` directive. No visual surface, prop, state, storage, or contract change. The proposed file was applied to `src` this turn and passes `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`, exit 0) + `eslint` (exit 0, no warnings on `swapBlock.ts`) + `npm run build` (vite; TheoSurface 325.81 kB / 95.84 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>` / `git hash-object`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4B; §6 classification) | `Read`/`Grep` this turn | `aca008660566997795a991a5816f4011d757c942` (current HEAD — post VA-T11 landing `a206e5d`) |
| 2 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT) | `Grep` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 3 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6.1 gateway; §6.3 no browser storage; §2 plan-only) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 4 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (chat surface) | `Grep` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 7 | **VA-T9** (registered §4B) — `artifacts/theo-download-card-reference.jsx` (the download card `vault_export` renders — the target affordance) | `Grep` this turn | `b37c0304cc4176e4f75dd1e6504bb0fcbc30df18` |
| 8 | ACTIVE (modify) — `src/theo/swapBlock.ts` (`ARTIFACT_RULES`) | `Read`/`Edit` this turn | `3707995c18301dc98225cecb41013c55d9c33bd3` |
| 9 | **PROPOSED** — `proposed-src/theo/swapBlock.ts` | authored + validated this turn | `c0f5abebedbffe031fb8f93049117a92ca454a37` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. **No `localStorage`/`sessionStorage`** (Governor §6.3). No Tailwind/CSS-in-JS. No new backend/contract/schema. No new dependency.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Every structural/visual classification (EXACT, ALLOWED DELTA, DEVIATION, APPROVED, REJECTED, DEPLOYED, PROPOSED, NOT_IMPLEMENTED, VISUAL-AUTHORITY-MATCH, VISUAL-AUTHORITY-DEVIATION) MUST be backed by at least one Rule Anchor" | §F-P2 classification anchored |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation" | §F-P2 cites only registered VA-T1/VA-T9 |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "One row per component in scope. Each row locks three surfaces:" | §F-P5 CCT (1 row, no interface change) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`; 1A state is React/in-memory" | §F-P4 — prompt-string constant only, no storage |

---

## F-P1 — Feature identification
**Microstep:** fix the "Theo makes a markdown table instead of a real Excel file" feedback by steering spreadsheet/Excel requests to the deployed `theo_export_spreadsheet` tool in the system prompt.
- **Remove "table"** from the `ARTIFACT_RULES` standalone-deliverable list (a data table the user wants as a file is a spreadsheet, not a prose artifact; a small read-only table stays inline Markdown).
- **Append a spreadsheet/Excel directive:** "when the user wants data AS a spreadsheet or Excel file — to download, to 'export', or 'in Excel/.xlsx' — do NOT inline a markdown table and do NOT wrap it in an artifact. Call the `theo_export_spreadsheet` tool with typed columns and rows (numbers as JSON numbers, dates as ISO date strings)… after it returns, briefly confirm the file is ready (the download card is shown automatically — never paste the raw link)."

**Why it works:** `theo_export_spreadsheet` is already deployed, already in the model's tool set (`CHAT_TOOL_SCHEMAS`), and already renders a download card (`event: vault_export` → VA-T9). The only gap was that the prompt told the model to treat tabular deliverables as markdown artifacts and never named the tool; this removes the mis-steer and names the tool with a clear trigger.

**Out of scope / unchanged:** the artifact mechanism for prose/code/html deliverables; `THEO_RULESET` (backend, unchanged); the export tool + its schema (backend, unchanged); the download-card rendering (VA-T9, unchanged); the "(no response)" backend behaviour (a separate backend fix — Track B). No visual surface change; no new state/storage; no contract field added.

## F-P2 — UI Authority Reconciliation
| VA-id (registered §4B) | Reconciliation | Classification (anchored) |
| --- | --- | --- |
| VA-T1 (Theo chat surface) | No change to the rendered surface, layout, or any component. This is a system-prompt content change that steers the model's tool choice; the chat surface is unchanged. | **VISUAL-AUTHORITY-MATCH** (surface unchanged; behavioural/prompt change, FE Conformance §6) |
| VA-T9 (download card) | The change makes the model reach the EXISTING download-card path (`theo_export_spreadsheet` → `vault_export` → VA-T9) for Excel requests, instead of a markdown artifact. The card itself is unchanged; this VEP only increases how often the model routes to it correctly. | **VISUAL-AUTHORITY-MATCH** (VA-T9 unchanged; the target affordance already exists) |

No Tailwind/CSS-in-JS. No `localStorage`/`sessionStorage`.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Model-behaviour lever (prompt), not a hard guarantee.** Steering is probabilistic — the model *should* now call the tool for Excel requests, but a prompt cannot force it 100%. | **PROCEED** — this is the correct lever (the tool + card already exist; only the prompt mis-steered); it removes the explicit "table → artifact" conflict and names the tool with a clear trigger, matching the tool's own description. Any residual mis-routing is a prompt-tuning follow-up, not a structural defect. |
| **G-2** | **Interaction with the "(no response)" bug (Track B).** A very large export tool-call can still be truncated by `max_tokens` in the backend loop (separate root cause). | **PROCEED (out of scope, tracked)** — this VEP fixes the *routing* (model now calls the tool); the backend truncation/empty-turn handling is Track B (a separate backend VEP). They are complementary. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting`; no backend/contract/schema change.

## F-P3 — Backend / contract grounding
- **No backend, contract, API Spec, or schema change.** The system prompt is already assembled by `buildSystemPrompt` and sent as the existing `systemPrompt` field to `theo_message_stream` (appended after `THEO_RULESET`). `theo_export_spreadsheet` is an already-deployed chat tool (in `CHAT_TOOL_SCHEMAS`); this VEP does not add, rename, or alter any tool, endpoint, or field — it only changes prompt text that references the tool by its existing name. No gateway/model-call change (Governor §6.1 preserved).

## F-P4 — Component reference grounding
**PRIMARY REFERENCE:** the existing `ARTIFACT_RULES` constant in `src/theo/swapBlock.ts` (the structural mirror is its current form; the change is an edit to the string + one appended sentence). No new state (Governor §6.3 — a prompt-string constant, no storage). `buildSystemPrompt`/`prompt.ts`, the artifact mechanism for prose/code/html, and every component are **unchanged**.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; the row: interface + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `swapBlock` (Theo prompt constants; **ACTIVE**, modify) | Exports UNCHANGED: `export const ARTIFACT_RULES: string` (a prompt-string constant; also `BASE_PROMPT`, `USER_NAME`, etc.). No signature/type change — only the string literal content of `ARTIFACT_RULES` changes (drop "table" from the deliverable list; append the spreadsheet/Excel → `theo_export_spreadsheet` directive). Consumed by `buildSystemPrompt` (`prompt.ts`), unchanged. | VA-T1 (surface unchanged); VA-T9 (existing download-card target) | None new — `systemPrompt` already sent to `theo_message_stream`; `theo_export_spreadsheet` already deployed | PROCEED |

**Infra:** no `vite.config`/dependency change. Only `swapBlock.ts` touched. `prompt.ts`/`ChatView`/`useTheoState`/gateway/backend **unchanged**.

## F-P6 — Validation (this turn, against `src`, reverted)
- `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`) → **exit 0**.
- `npx eslint src/theo/swapBlock.ts` → **exit 0** (no warnings).
- `npm run build` (vite) → **exit 0**; `__federation_expose_TheoSurface` 325.81 kB (gzip 95.84 kB).
- After validation, `src` reverted to HEAD; the package carries the proposed source only under `proposed-src/`.

## F-P7 — Landing plan (Pass 3, on APPROVAL)
Copy `proposed-src/theo/swapBlock.ts` → `src/theo/swapBlock.ts`; re-verify `tsc`/`eslint`/`build` green; commit to `development`; the Theo dev SWA serves it; Walter accepts (asking for an Excel now produces a real `.xlsx` download card). Track B (the backend "(no response)" fix) follows as a separate backend package.
