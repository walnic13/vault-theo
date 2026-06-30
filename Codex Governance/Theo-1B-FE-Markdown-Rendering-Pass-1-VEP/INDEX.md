# Codex Governance Package — Theo 1B FE Markdown Rendering Pass-1 VEP

- **Main artifact:** `Theo_1B_FE_Markdown_Rendering_VEP.md` — Pass-1 frontend VEP (plan). Reviewer = Codex (Pass 2).
- **Scope:** upgrade `src/theo/lib/markdown.tsx` to Claude-quality rendering via `react-markdown` + `remark-gfm` with a VA-T1-token-styled element map (tables, ordered/nested lists, fenced code, blockquotes, rules, full inline). Single chokepoint → lifts chat (`renderAssistant`), cited answers (`CitedText`), and artifacts (`ArtifactPanel`) with no consumer changes. `inline` retained verbatim. XSS-safe (markdown only; no raw HTML).
- **Changed (in `proposed-src/theo/lib/`):** `markdown.tsx` (renderer rewrite). **Deps (§DEPS):** `react-markdown ^9.1.0` + `remark-gfm ^4.0.1` added to package.json. NOT applied to `src/` (Pass 3 on approval).
- **Validation:** `npm run typecheck` + `eslint` (exit 0; only the pre-existing FR warning) + `npm run build` → clean (TheoSurface bundle 66 KB gzip). Microstep lint → PASS.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2).
- **HEAD:** vault-theo `b18961a85e4d2a0fc0b5c0a9862318e9159e0e39`.
