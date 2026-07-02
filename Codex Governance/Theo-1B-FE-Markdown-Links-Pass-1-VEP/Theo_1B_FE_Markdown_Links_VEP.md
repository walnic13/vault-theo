# Theo 1B — Frontend Markdown Links + Cited-Path Markdown — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2). **Microstep:** grounded answers contain markdown links (`[label](url)`) and bold, but they render **raw**: (1) the shared markdown renderer `inline()` (`lib/markdown.tsx`, ported verbatim from VA-T1) only handles `**bold**` + `` `code` `` — **no link support**; (2) `CitedText` (VA-T5 repro) renders run text as **plain text** (no markdown at all). This VEP adds `[label](url)` → `<a>` to `inline()` and routes `CitedText` run text **through** the markdown renderer. **Walter directive: "the links provided, shouldn't those be hyperlinks?"** Additive VISUAL-AUTHORITY-DEVIATION (VA-T1's renderer has no links; VA-T5 renders run text plain).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `ce557810995e92134e62d4fb379659912ee690b7` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 Frontend VEP. F-P1…F-P7 walked; backend P/I/E track N/A. Both CCT-cited VA-ids (VA-T1, VA-T5) read this turn.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6) | `Grep("model call routes through a gateway abstraction")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§4 matrix; §4B VA-T1/VA-T5) | `Grep("Reproduce faithfully, do not redesign")` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Read(offset=1, limit=40)` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 visual-deviation) | `Grep("must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (§5 acceptance) | `Grep("Acceptance criteria")` this turn | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 6 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 — source of the assistant text being rendered; no endpoint change) | `Grep("may attach a \`citations\` array to text blocks")` this turn | `b5bbd57e1544404ffe98d92fd33e98c8dc4f0289` |
| 7 | **VA-T1** reference surface — `frontend/theo-frontend-reference.jsx` (L59–82 markdown renderer — no link branch) | `Read(offset=55, limit=30)` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 8 | **VA-T5** citation reference — `artifacts/theo-citations-reference.jsx` (`CitedText` renders run text plain) | `Read(offset=135, limit=20)` this turn | `030d69469e7e6c36a700d66e85696ba31158ea67` |
| 9 | ACTIVE (modify) — `src/theo/lib/markdown.tsx` (`inline()` + `Formatted`) | `Read(full)` this turn | `be085abf87f6f0723996f9febe192b9b3cec841a` |
| 10 | ACTIVE (modify) — `src/theo/components/CitedText.tsx` (run rendering) | `Read(full)` this turn | `9345d5e0bda57645b3e4c5019b3ab60d41083aab` |

No ChatGPT advisory cited (§4D / T18). No `corporate-reporting`/`reporting_*` change.

---

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." | §F-P2 — link rendering + cited-path markdown classified VISUAL-AUTHORITY-DEVIATION (Walter-authorized §WA) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "Reproduce faithfully, do not redesign." | §F-P2 — additive only: links become anchors + cited runs gain the same markdown the non-cited path already uses; no surface redesign |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid (T20)." | §F-P5 — CCT rows carry prop interface + VA-id + contract dependency |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 (3) | "1A state is React/in-memory" | §F-P6 — pure render change; no `localStorage`/`sessionStorage` |

---

## §WA — Walter authorization (verbatim, predating this VEP)
> "the links provided, shouldn't those be hyperlinks?"

Authorizes rendering markdown links as anchors (beyond VA-T1's renderer) and rendering cited-path run text via the markdown renderer (beyond VA-T5's plain-text runs).

## F-P1 — Feature identification
Grounded answers (and any markdown reply) include `[label](url)` links + `**bold**`/lists. They render raw because (a) `inline()` (VA-T1-ported) has no link branch and (b) `CitedText` renders run text as plain text. This VEP: **(1)** adds `[label](url)` → `<a target="_blank" rel="noopener noreferrer">` to `inline()` (fixes links in **both** the normal and cited paths); **(2)** routes `CitedText` run text through the markdown renderer — cited runs via `inline()` (inline markdown + chips), non-cited runs via `Formatted` (block markdown: lists/paragraphs/headings).

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (markdown renderer) | `inline()` is ported verbatim from VA-T1 (L59–82), which renders **no** links. Adding `[label](url)` → coral underlined `<a>` is a new rendered element. Additive; bold/code/list rendering unchanged. | **VISUAL-AUTHORITY-DEVIATION** (Rule Anchors 1, 2; Walter-authorized §WA) |
| VA-T5 (cited rendering) | VA-T5's `CitedText` renders `{run.text}` as plain text. We route run text through the **same** markdown renderer the non-cited path already uses (inline for cited runs + chips; `Formatted` for non-cited runs) so bold/links/lists render in grounded answers. Chip structure/behaviour (favicon+index, hover card, sequential index) unchanged. | **VISUAL-AUTHORITY-DEVIATION** (additive markdown; chips unchanged — Rule Anchors 1, 2; §WA) |

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | Link `<a>` opens `target="_blank"` to an arbitrary model-provided URL. | **PROCEED** — `rel="noopener noreferrer"` set; same posture as the citation-chip anchors (already approved); no model credential, no app data. |
| **G-2** | `inline()` link regex (`\[[^\]]+\]\([^)]+\)`) does not handle nested brackets/parens in URLs. | **PROCEED** — covers the standard `[label](url)` Claude emits; degrades to literal text on non-match (no breakage). |
| **G-3** | Cited runs render via `inline()` (inline markdown), so a list **inside a cited run** renders as inline text, not `<ul>`. | **PROCEED** — cited runs are sentence-level claims; block markdown (lists) lands in non-cited runs rendered via `Formatted`. Matches observed gateway output. |

No `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
No backend/contract change. The rendered text is the gateway assistant reply (API Spec §2.1); links are client-side markdown rendering only. `gateway.live.ts`/`theoClient` unchanged.

## F-P4 — Component reference grounding
VA-T1 (`inline()`/`Formatted` markdown renderer, L59–82) and VA-T5 (`CitedText`) read this turn. ACTIVE modify-targets read full this turn: `src/theo/lib/markdown.tsx`, `src/theo/components/CitedText.tsx`. `Formatted` (already exported from `lib/markdown`) is reused for non-cited runs.

## F-P5 — Component Contract Table
Format: Golden Pack §3 (Rule Anchor 3). `no any`; required-before-optional.

| # | Component (ownership; ACTIVE/NEW) | Prop / input interface (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| CC-1 | `inline` (`lib/markdown.tsx`; **ACTIVE**, modify) | `export function inline(s: string): ReactNode`. Signature unchanged. Add a third split branch: `[label](url)` → `<a href={url} target="_blank" rel="noopener noreferrer" style={{ color: C.coral, textDecoration: "underline" }}>{label}</a>`. Split regex extended to `/(\*\*[^*]+\*\*|\`[^\`]+\`|\[[^\]]+\]\([^)]+\))/g`; bold + code branches unchanged. `Formatted` unchanged (already calls `inline`). | VA-T1 (markdown renderer; links = additive DEVIATION) | none (client-side render) | PROCEED |
| CC-2 | `CitedText` (`components/CitedText.tsx`; **ACTIVE**, modify) | `export function CitedText({ runs, startIndex }: { runs: CitedRun[]; startIndex?: number }): JSX.Element`. Signature unchanged. Container `<span>` → `<div>`. Per run: `run.citations.length ? <span>{inline(run.text)}{…chips}</span> : <Formatted text={run.text} />`. `CitationMarker`/`Favicon`/`Globe` unchanged. Imports `inline`, `Formatted` from `../lib/markdown`. | VA-T5 (cited rendering; markdown = additive DEVIATION) | gateway `data.content[].citations` (B1.7 DEPLOYED) | PROCEED |

**Infra:** none. No dependency, `vite.config`, route, storage, or Tailwind change.

## F-P6 — Repository & active-surface grounding
Targets read this turn, ACTIVE @ vault-theo `ce55781`: `lib/markdown.tsx` (`inline` +link branch), `CitedText.tsx` (run text via markdown). Guardrails (Rule Anchor 4): pure render change, in-memory only; links `rel="noopener noreferrer"`; no Tailwind; no `reporting_*`/`corporate-reporting` change.

## F-P7 — VEP assembly
GCR + Rule Anchors open the pack; §WA quotes the authorization; F-P1→F-P6 walked; Gap Disclosure present (all PROCEED); CCT locked (2 ACTIVE modify). No implementation begun. On Codex APPROVAL, Pass 3 adds the `inline()` link branch + routes `CitedText` runs through the markdown renderer (verified `tsc`/`build` green); Origin's runtime remote picks up the rebuilt vault-theo → **markdown links render as hyperlinks in both grounded and normal answers** (Walter SWA acceptance = Visual Acceptance Evidence).

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-FE-Markdown-Links-Pass-1-VEP/Theo_1B_FE_Markdown_Links_VEP.md" --repo-root .
PASS  Codex Governance/Theo-1B-FE-Markdown-Links-Pass-1-VEP/Theo_1B_FE_Markdown_Links_VEP.md
exit code: 0
```
(Codex re-runs the same command per its §1A hard gates.)

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of Frontend Markdown Links + Cited-Path Markdown Pass-1 Frontend VEP (plan only).*
