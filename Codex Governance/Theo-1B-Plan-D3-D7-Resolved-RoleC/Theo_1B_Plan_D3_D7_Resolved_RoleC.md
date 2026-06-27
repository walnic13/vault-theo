# Role-C Verbatim-Edit Handoff — 1B Backend Plan: resolve D-3 (ZDR) + D-7 (memory distillation policy)

> Pass 4 documentation-update (Theo backend regime). Author = Claude Code (Role-C). Inline executor = **Codex**. Records two Walter decisions made 2026-06-28 in the Decision Register of `governance/THEO_PHASE_1B_BACKEND_PLAN.md`: **D-3 ZDR RESOLVED** (Walter has contractually confirmed Anthropic zero-data-retention) and **D-7 memory-distillation-policy RESOLVED** (the agreed option-C defaults). Lifts the D-3/D-7 gates on Tier B7 (distillation engine + system-prompt injection); the B7b history-RAG index still awaits the D-5 Azure AI Search resource. Three verbatim edits; no other plan text changes.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Documentation-update package (Role-C)
Turn issued against HEAD: `631c9a54d0a0f018b6872a4c360396eba6a63dad` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | **TARGET** Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§8 Decision Register; PRE-LAND summary) | `Grep("\*\*D-3\*\*" / "\*\*D-7\*\*" / "Remaining open items are")` this turn | `d3d02ccfaf9f244c60e71438972397e994b08330` |
| 2 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C inline execution) | `Grep("executes the directed edits")` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 3 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR / §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim**" | EDITs 1–3 — Codex applies verbatim |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §8 | "Remaining open items are" | EDIT 3 — PRE-LAND summary updated for D-3/D-7 resolved |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |

## Rationale
Walter (2026-06-28) confirmed: (a) Anthropic **zero-data-retention** is contractually in place → **D-3 RESOLVED**; live client-PII traffic, including B7 memory distillation + history-RAG, may proceed. (b) The **D-7 memory-distillation policy** defaults are accepted: distill on conversation idle/close; extract via the same Foundry-Claude gateway (cheap pass → ≤N stable items as JSON); store durable facts/preferences only; user view/edit/delete (Claude-style); user-global scope by default, project-scoped in a project; ownership-only RLS. This records both in the Decision Register so the B7 distillation + injection microsteps are no longer gate-blocked (B7b history-RAG still needs the D-5 Azure AI Search resource).

## Edit set (3 verbatim edits)
Codex executes verbatim; each BEFORE anchor MUST be found exactly once or HALT. Target repo: `vault-theo`. Target file: `governance/THEO_PHASE_1B_BACKEND_PLAN.md`.

### EDIT 1 — §8: D-3 RESOLVED
**Locate (BEFORE) — found once:**
```
| **D-3** | Foundry-Claude **ZDR** posture before any client-PII traffic. | **OPEN.** Zero-data-retention must be contractually confirmed; region limits apply (Theo Architecture §2.4). Non-PII dev/test (B0–B1.5) may proceed; gates live **client-PII** traffic. |
```
**Replace with (AFTER):**
```
| **D-3** | Foundry-Claude **ZDR** posture before any client-PII traffic. | **RESOLVED (2026-06-28).** Walter has contractually confirmed Anthropic zero-data-retention; live client-PII traffic — including B7 memory distillation + history-RAG — may proceed. |
```

### EDIT 2 — §8: D-7 RESOLVED
**Locate (BEFORE) — found once:**
```
| **D-7** | Memory distillation policy (option C): trigger (post-turn / periodic / on-demand), extraction model, retention + salience, and user memory controls (view/edit/delete). | **OPEN.** Walter sets the distillation policy + model + retention; ownership-only RLS unless Walter authorizes otherwise. Gates B7. |
```
**Replace with (AFTER):**
```
| **D-7** | Memory distillation policy (option C): trigger, extraction model, retention + salience, and user memory controls. | **RESOLVED (2026-06-28).** Distill on conversation idle/close (not per-turn); extraction via the same Foundry-Claude gateway (a cheap pass emitting ≤N stable items as JSON); store durable facts/preferences only (never transient content); user can view/edit/delete every item (Claude-style; delete is permanent); scope user-global by default, project-scoped when the chat is in a project; ownership-only RLS. Gates lifted for B7. |
```

### EDIT 3 — §8: PRE-LAND summary
**Locate (BEFORE) — found once:**
```
Remaining open items are **PRE-LAND** for their tiers: D-3 gates live client-PII traffic (non-PII dev test proceeds earlier); the AI-Search sub-item of D-5 gates B6 **and the B7 history-RAG index**; D-6 gates B5; **D-7 gates B7 (memory distillation policy)**. B7's memory traffic is client-PII, so it is additionally gated by D-3. No tier proceeds on a guessed decision.
```
**Replace with (AFTER):**
```
Remaining open items are **PRE-LAND** for their tiers: the AI-Search sub-item of D-5 gates B6 **and the B7b history-RAG index**; D-6 gates B5. **D-3 (ZDR) and D-7 (memory distillation policy) are RESOLVED (2026-06-28)** — B7 distillation + system-prompt injection are no longer gated; B7b history-RAG still awaits the D-5 Azure AI Search resource. No tier proceeds on a guessed decision.
```

## Note
Three verbatim edits to one file (`governance/THEO_PHASE_1B_BACKEND_PLAN.md` §8). No tier body, schema, handler, or other text changes. Records Walter's 2026-06-28 D-3/D-7 decisions. Plan remains DRAFT / NOT-YET-AUTHORITATIVE pending Walter approval.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-Plan-D3-D7-Resolved-RoleC/Theo_1B_Plan_D3_D7_Resolved_RoleC.md" --repo-root .
PASS  Codex Governance/Theo-1B-Plan-D3-D7-Resolved-RoleC/Theo_1B_Plan_D3_D7_Resolved_RoleC.md
exit code: 0
```

## Codex activation note (Walter forwards)
*"Codex is activated to execute the Theo-1B-Plan-D3-D7-Resolved Role-C. Apply EDITs 1–3 to `governance/THEO_PHASE_1B_BACKEND_PLAN.md` §8 verbatim (each BEFORE anchor found exactly once; HALT on mismatch). Records D-3 ZDR RESOLVED + D-7 distillation policy RESOLVED + updated PRE-LAND summary. No other text changes."*

*End of Role-C Verbatim-Edit Handoff.*
