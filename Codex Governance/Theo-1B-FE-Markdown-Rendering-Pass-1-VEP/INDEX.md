# Codex Governance Package — Theo 1B FE Markdown Rendering Pass-1 VEP

- **Main artifact:** `Theo_1B_FE_Markdown_Rendering_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2).
- **Scope:** upgrade `src/theo/lib/markdown.tsx` to Claude-quality rendering via `react-markdown` + `remark-gfm` with a VA-T1-token-styled element map (tables, ordered/nested lists, fenced code, blockquotes, rules, rich inline). Single block renderer (`Formatted`) → lifts **all three** answer surfaces: plain chat (`renderAssistant`), **cited chat (`CitedText`)**, and artifacts (`ArtifactPanel`). The old lightweight `inline` helper is **removed** (no remaining consumer). XSS-safe (markdown only; no raw HTML — no `rehype-raw`/`dangerouslySetInnerHTML`).
- **Changed (in `proposed-src/theo/`):** `lib/markdown.tsx` (renderer rewrite; `inline` removed) **and** `components/CitedText.tsx` (cited-run bodies now render through `Formatted`, citation chips appended as a trailing row — Codex Pass-2 fix so web-grounded answers no longer bypass the renderer). **Deps (§DEPS):** `react-markdown ^9.1.0` + `remark-gfm ^4.0.1` added to package.json. NOT applied to `src/` (Pass 3 on approval).
- **Validation:** `npm run typecheck` + `eslint` (**exit 0; FR warning gone** now that `markdown.tsx` exports only `Formatted`) + `npm run build` → clean (TheoSurface bundle ~66 KB gzip). Microstep lint → PASS.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2 — **APPROVED**).
- **HEAD:** vault-theo `02ca4fc` (markdown package).
