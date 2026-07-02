# Theo 1B — FE Markdown Rendering Polish (Claude-quality output) — Pass 1 VEP

> Pipeline: Vault Theo **frontend** regime. Author = Claude Code (Pass 1 Plan). Reviewer = **Codex** (Pass 2). This is the **plan** (Component Contract Table + UI-authority reconciliation + gap disclosure); the code is the Pass-3 Implementation Package. **Microstep:** upgrade Theo's markdown renderer so its (now well-structured, ruleset-driven) output *looks* as polished as Claude. The current `src/theo/lib/markdown.tsx` is a ~33-line regex parser that handles only `**bold**`, inline `` `code` ``, `[links]`, `#`–`###` headings, and `-`/`*` bullets — it drops ordered/nested lists, tables, fenced code blocks, blockquotes, horizontal rules, italics, and strikethrough (exactly what makes Theo's answers look rough). The fix replaces the **block** renderer `Formatted` with **`react-markdown` + `remark-gfm`** plus a styled element map in the VA-T1 token system. `Formatted` is consumed by chat answers (`TheoMain.renderAssistant`) and artifacts (`ArtifactPanel`) directly, and — **corrected after Pass-2 review** — by **web-grounded (cited) answers** too: `CitedText` is updated so a **cited run's body renders through `Formatted`** (with the citation chips appended as a trailing row), instead of the old lightweight inline path. The now-orphaned `inline` helper is **removed** (no remaining consumer), which also resolves the file's prior react-refresh warning (it now exports only a component). So **two files change** — `markdown.tsx` (renderer) + `CitedText.tsx` (route cited bodies through it) — and all three answer surfaces (plain chat, cited chat, artifacts) get the upgrade. XSS-safe (markdown only; no raw HTML). Implementation **drafted + `tsc`+`eslint`+`build`-clean** in `proposed-src/`.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Turn issued against HEAD: `b18961a85e4d2a0fc0b5c0a9862318e9159e0e39` (vault-theo, `development`)
Detail: Pass 1 frontend VEP; §4A.1 sub-phases F-P1, F-P2, F-P2.5, F-P4, F-P5, F-P7 walked. Primary Reference component (Golden Component Pack §2) = the **ACTIVE** `src/theo/lib/markdown.tsx` (blob `855b3510`) — the renderer being upgraded. The richer rendering (tables, ordered/nested lists, fenced code, blockquotes, rules, full inline) is **beyond the lightweight VA-T1 renderer** (`frontend/theo-frontend-reference.jsx` L59–82) → classified **VISUAL-AUTHORITY-DEVIATION**, Walter-directed (§WALTER-AUTH). Two new dependencies (`react-markdown`, `remark-gfm`) — §DEPS. Two files change: `markdown.tsx` now exports only `Formatted` (the `inline` helper is removed — no remaining consumer) and `CitedText.tsx` is updated to render a cited run's body via `Formatted` (citation chips appended as a trailing row), so web-grounded answers get the same fidelity (this corrects the Pass-2 finding that cited answers bypassed the new renderer). `TheoMain` + `ArtifactPanel` are untouched (they already consume `Formatted`). Implementation drafted + validated this turn (`npm run typecheck` + `eslint` exit 0 [the prior react-refresh warning is now gone] + `npm run build` → clean) in `proposed-src/`. No browser storage (1A handover §2.5).

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §4 UI reconciliation; §5 gap) | `Grep("Component Contract Table")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 gap) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited; unchanged blob @ HEAD | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary ref; §3 CCT) | `Grep("existing component file as the structural mirror target")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§0.1 no-redesign; §2.5 no storage) | `Grep("Do not redesign it")` this turn | `aad6396703b5a2b6d204986e5064504cec939895` |
| 6 | **VA-T1** Theo Frontend Reference Surface — `frontend/theo-frontend-reference.jsx` (lightweight renderer L59–82) | `Grep("vo-send")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 7 | **Primary Reference component (ACTIVE)** — `src/theo/lib/markdown.tsx` | `Read(full)` this turn | `855b35109577a495883c64958dd08a13ccfccdda` |
| 8 | **Changed** — `src/theo/components/CitedText.tsx` (cited-run body → `Formatted`; `inline` import dropped) | `Read(full)` this turn | `7c4e566009a08a4a5f703ab0777eb45655516e52` |
| 9 | Consumer (unchanged) — `src/theo/components/TheoMain.tsx` (`renderAssistant` wraps `Formatted`) | `Read` this turn | `1169565099bd5f98d56b44de7a8211f359e30ed8` |

No ChatGPT advisory cited. No `reporting_*` / `corporate-reporting` change. No backend/handler/schema change. No browser storage introduced (1A handover §2.5).

## §WALTER-AUTH — verbatim directive authorizing the richer rendering (beyond VA-T1)
Walter, current feature directive:
> "the current api isn't great, certainly doesn't look nice and polished like claude!" … (on the recommended approach, react-markdown + remark-gfm with a styled element map) "let's go with your recommendation".
This authorizes upgrading the renderer to full CommonMark + GFM rendering — a VISUAL-AUTHORITY-DEVIATION from VA-T1's lightweight renderer — reproduced in VA-T1's token system, and the two supporting dependencies.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "Component Contract Table" | §F-P5 — CCT for the renderer |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "existing component file as the structural mirror target" | §F-P4 — Primary Reference = ACTIVE markdown.tsx |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §0.1 | "Do not redesign it." | §F-P2 — surface unchanged; richer rendering classified VISUAL-AUTHORITY-DEVIATION |
| frontend/theo-frontend-reference.jsx | renderer | "vo-send" | §F-P2 — styled in VA-T1 tokens |

---

## §F-P1 — Feature identification
Upgrade the markdown renderer so Theo's output is Claude-quality. The current `Formatted`/`inline` regex parser renders only bold/code/links/headings/bullets; it drops ordered + nested lists, **tables**, fenced **code blocks**, blockquotes, horizontal rules (`---`, which Theo uses constantly), italics, and strikethrough. With the Operating Ruleset now driving structured tax output (headings, tables, stepwise lists), the renderer is the bottleneck between "well-structured" and "looks polished." This replaces the block renderer with `react-markdown` + `remark-gfm` (full CommonMark + GitHub-flavored markdown), styled in VA-T1 tokens.

## §F-P2 — UI Authority Reconciliation
- **VA-T1 — not redesigned.** The surrounding surface (bubble, composer, layout, palette) is unchanged (1A handover §0.1). Only the *contents* of an assistant message render with fuller fidelity. All styling uses VA-T1 tokens (`C` palette, `MONO`) and the inline-style idiom — no CSS-framework classes, no palette change.
- **VISUAL-AUTHORITY-DEVIATION (Walter-directed, §WALTER-AUTH).** VA-T1's renderer (reference L59–82) is intentionally lightweight; rendering tables/nested lists/code blocks/blockquotes/rules is additive fidelity beyond it. Classified VISUAL-AUTHORITY-DEVIATION per Governor §4; authority = §WALTER-AUTH. The styled element map keeps each element visually consistent with the surface (e.g., code blocks reuse `C.bubble`/`C.line2`; links use `C.coral`; tables use the existing border tokens).
- **Renderer chokepoint + the cited-answer fix.** `Formatted` keeps its signature; `TheoMain.renderAssistant` and `ArtifactPanel` are untouched (they already consume it). `CitedText` is updated so a cited run's **body** renders through `Formatted` too (citation chips appended as a trailing row) — closing the Pass-2 finding that cited (web-grounded) answers bypassed the new renderer via the lightweight inline path. The now-orphaned `inline` helper is removed (no remaining consumer).

## §F-P2.5 — Gap Disclosure
Vocabulary `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Two new dependencies** (`react-markdown ^9.1.0`, `remark-gfm ^4.0.1`) → the `TheoSurface` federated bundle grows ~48 KB gzip (to ~66 KB gzip total). | **PROCEED** — expected cost of robust LLM-markdown rendering; light for a chat surface; §DEPS. The SWA build's `npm install` picks them up from `package.json` (no workflow change). |
| G-2 | **VISUAL-AUTHORITY-DEVIATION** — richer rendering beyond VA-T1's lightweight renderer. | **PROCEED** — Walter-directed (§WALTER-AUTH); token-consistent (F-P2). |
| G-3 | **No syntax highlighting** in v1 — fenced code blocks are styled (monospace, background, border, horizontal scroll) but not language-highlighted. | **PROCEED (future-trigger)** — a highlighter is a heavier dep; not needed for "polished." Add later if wanted. |
| G-4 | **XSS posture.** react-markdown renders markdown only; raw HTML is **not** enabled (no `rehype-raw`), so model output cannot inject markup. | **PROCEED** — safe by design; this is a deliberate control, not a gap. |
| G-5 | **Streaming partial markdown.** Mid-stream, incomplete tables/code fences render as react-markdown best-effort (it does not crash); the final delta resolves them. | **PROCEED** — accepted; matches streaming-chat behavior. |
| G-6 | **Cited answers now use the block renderer (Pass-2 fix).** `CitedText` renders a cited run's body via `Formatted`, with the citation chips as a trailing row — so structured web-grounded answers (the ruleset's typical output: authority → rule → application → conclusion, often with tables) get full fidelity. The orphaned `inline` helper is removed. | **PROCEED** — resolves the Pass-2 blocking finding; citation chips preserved. |

Per-surface status (1A handover §3): rendering is presentational; real-in-1A and 1B alike.

## §F-P4 — Component reference grounding
Primary Reference (Golden Component Pack §2) = the **ACTIVE** `src/theo/lib/markdown.tsx` (blob `855b3510`). The upgraded `Formatted` is a structural replacement of that file's block renderer using `react-markdown` + `remark-gfm`; the orphaned `inline` helper is removed. `CitedText.tsx` (a second changed file, blob `7c4e5660`) routes cited-run bodies through `Formatted` (chips appended); `TheoMain` + `ArtifactPanel` consume the unchanged `Formatted` export (1A handover §2.3 single-boundary spirit) — no new component, no surface bypass.

## §F-P5 — Component Contract Table
Export signatures are the literal TypeScript (**no `any`**), as implemented + `tsc`-validated in `proposed-src/`.

### CCT-1 — `Formatted` (ACTIVE; internals replaced — signature UNCHANGED)
- **Ownership:** Theo surface, ACTIVE. **VA-id:** VA-T1 (renderer L59–82; richer rendering classified VISUAL-AUTHORITY-DEVIATION per §F-P2). **Change:** internals only — now renders via `<Markdown remarkPlugins={[remarkGfm]} components={MD}>` with a styled element map (`MD`) in VA-T1 tokens. Prop interface unchanged → consumers untouched.
- **Signature (literal, unchanged):**
```ts
export function Formatted({ text }: { text: string }): JSX.Element
```
- **Contract dependency:** none (presentational). Consumed by `TheoMain.renderAssistant`, `ArtifactPanel`, and `CitedText` (both non-cited runs and — now — cited-run bodies).

### CCT-2 — `CitedText` (ACTIVE; changed — cited-run body now via `Formatted`)
- **Ownership:** Theo surface, ACTIVE. **VA-id:** VA-T1 (web-grounding citation affordance; the `CitationMarker` chips are unchanged). **Change:** a cited run's body now renders via `<Formatted text={run.text} />` (was the lightweight `inline`), with the citation chips appended as a trailing flex row; the `inline` import is dropped. Non-cited runs already used `Formatted` (unchanged). This is the Pass-2 fix.
- **Prop interface (literal, unchanged):**
```ts
export function CitedText({ runs, startIndex = 1 }: { runs: CitedRun[]; startIndex?: number }): JSX.Element
```
- **Contract dependency:** consumes the upgraded `Formatted`. The `inline` export is removed from `markdown.tsx` (no remaining consumer) — which also resolves that file's prior `react-refresh/only-export-components` warning, since it now exports only a component.

### Element style map (`MD`) — non-visual-contract surface (internal to markdown.tsx)
Styled components for: `h1`–`h4`, `p`, `ul`/`ol`/`li`, `a` (target=_blank, `C.coral`), `strong`/`em`/`del`, `hr`, `blockquote`, `pre` + `code` (inline chip vs block box, `C.bubble`/`C.line2`/`MONO`), and `table`/`th`/`td` (border-collapse, `C.line2` borders, `C.bubble` header, wrapped in an `overflow-x:auto` container so wide tables scroll). All inline-style, VA-T1 tokens.

## §DEPS — new dependencies (package.json)
Added to `dependencies`: **`react-markdown` `^9.1.0`** and **`remark-gfm` `^4.0.1`**. Both pure-JS ESM, no native build. The Theo SWA build (`npm install` → `npm run build`) picks them up from `package.json` — **no workflow change**. XSS-safe default (no `rehype-raw`). Validated: `npm install` clean (97 transitive packages, mostly micromark/mdast), `tsc` + `eslint` + `npm run build` clean.

## §F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) + §WALTER-AUTH open the pack; F-P1/F-P2/F-P2.5/F-P4/F-P5/F-P7 walked; UI-authority reconciliation done (surface unchanged; richer rendering classified VISUAL-AUTHORITY-DEVIATION, Walter-authorized); Gap Disclosure (G-1 deps PROCEED; G-2 deviation PROCEED; G-3..G-6 PROCEED); CCT with literal signatures (CCT-1/2) + the element style map + §DEPS. **Implementation drafted + validated** — see §IMPL. On Codex APPROVAL → Pass 3 applies `proposed-src/` to `src/` + adds the two deps to `package.json`, re-runs typecheck/eslint/build → Walter merges to `development` → dev-SWA visual acceptance.

## §IMPL — drafted + validated implementation (Pass-3 payload)
Both changed files are written and **validated against the live toolchain this turn**: with the deps installed, `npm run typecheck` → **clean**; `eslint` on `markdown.tsx` + `CitedText.tsx` + the other consumers → **clean (exit 0)** — and the prior `react-refresh/only-export-components` warning on `markdown.tsx` is now **gone** (with `inline` removed, the file exports only the `Formatted` component); `npm run build` → **clean** (`TheoSurface` bundle ~217 KB / 66 KB gzip). Staged at `…/proposed-src/theo/lib/markdown.tsx` + `…/proposed-src/theo/components/CitedText.tsx`; the package.json dep additions are §DEPS. NOT yet applied to `src/` (Pass 3 on approval). Region classification (Golden Component Pack §4): surrounding surface = **VISUAL-AUTHORITY-MATCH** (unchanged); the richer element rendering = **VISUAL-AUTHORITY-DEVIATION** (additive fidelity, §WALTER-AUTH); the renderer swap + deps = **ALLOWED DELTA**.

## §DEPLOY / Pass-3 path
1. Codex Pass 2 reviews this VEP + CCT. 2. On APPROVAL, Pass 3 applies **both** `proposed-src/theo/lib/markdown.tsx` and `proposed-src/theo/components/CitedText.tsx` to `src/`, and adds `react-markdown`/`remark-gfm` to `package.json` `dependencies`; re-runs `typecheck`+`eslint`+`build`. 3. Walter merges to `development` → the SWA build `npm install`s the deps and rebuilds. 4. Dev-SWA visual acceptance: a structured answer (table, headings, ordered + nested lists, fenced code block, `---` rule) renders cleanly — **including a web-grounded (cited) answer**, which now renders its body through the block renderer with the citation chips as a trailing row. No backend touch.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of FE Markdown Rendering Pass-1 Frontend VEP (plan).*
