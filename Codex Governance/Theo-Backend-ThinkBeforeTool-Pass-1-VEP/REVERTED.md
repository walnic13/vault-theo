# ⚠️ REVERTED 2026-07-18 — this package's handler change is NOT live

This package (display:"summarized" + the `TOOL_PLANNING_SYSTEM` plan-before-tool nudge) was
Codex-APPROVED and deployed to `vaultgpt-func-stream` on 2026-07-18, then **operationally rolled
back the same day.**

**Why reverted:** the plan-before-tool nudge forced the model to plan a file export exhaustively
before calling the tool. On a real, complex K-1 ("extract … including footnotes") that produced
~32k tokens of planning — it hit the `max_tokens` ceiling (32,768) and took 5+ minutes, adding
un-needed latency (Walter). The golden curl only exercised a trivial synthetic export, which planned
briefly, so it didn't catch this. Conclusion: **do not force thinking on mechanical tool calls** —
adaptive thinking already self-scales thinking to ~0 for a straightforward tool call, which is the
efficient behavior we want.

**Live state after the revert** = the prior Codex-APPROVED **AdaptiveThinking** package
(`Codex Governance/Theo-Backend-AdaptiveThinking-Pass-1-VEP/functions/theo_message_stream.js`):
- `thinking: { type: "adaptive" }` + `output_config: { effort: "medium" }` (env `THEO_THINKING_EFFORT=medium`);
- `max_tokens` tool-loop floor 32768;
- **no** `TOOL_PLANNING_SYSTEM` nudge; **no** explicit `display: "summarized"` (Sonnet 4.6 returns
  summarized thinking by default, so visible thinking is unaffected).

Net effect that IS live: reasoning turns stream visible thinking with a climbing token counter;
mechanical tool calls (e.g. `theo_export_spreadsheet`) think ~0 and just build the file.

**If the `display: "summarized"` robustness pin is wanted later** (it only matters if the Foundry
deployment moves off Sonnet 4.6), re-add it on its own — WITHOUT the nudge — via a fresh VEP.

Rollback deploy: Kudu VFS PUT of the AdaptiveThinking handler to func-stream (baseline-matched,
restarted, 401 health, live-verified nudge=absent / adaptive=present).
