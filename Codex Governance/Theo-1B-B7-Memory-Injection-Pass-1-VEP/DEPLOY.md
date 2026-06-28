# DEPLOY — Theo B7 Memory Injection

> Apply after Codex APPROVES. Replace ONE handler's index.js. function.json UNCHANGED. No env var, no dependency, no migration.

1. `theo_message` → replace `index.js` with this folder's `theo_message.index.js` (== VEP §FIX). Leave `function.json` as-is.
2. Reply "B7 injection deployed" → Claude Code runs the golden curls (seed a memory → recall it in a fresh conversation → isolation → baseline-unchanged → cleanup).

The replacement adds only a non-fatal, user-scoped memory-fetch before the Foundry call + augments the system prompt; everything else is byte-identical to the deployed SEC version.
