# DEPLOY — Theo B3 Security Fix (per-user isolation)

> Apply after Codex APPROVES. Replace three existing handlers in place on `vaultgpt-func-premium`. No migration, no env var, no dependency, no connection change.

1. `theo_list_conversations` → replace `index.js` with this folder's `theo_list_conversations.index.js`.
2. `theo_get_conversation` → replace `index.js` with `theo_get_conversation.index.js`.
3. `theo_message` → replace `index.js` with `theo_message.index.js`.
4. Reply "SEC fix deployed" → Claude Code runs the golden curls (self-list, cross-user 404, append-isolation, self happy-path, validation).

Each file == the VEP §FIX.1/§FIX.2/§FIX.3 inline (byte-identical) and is `node --check` clean.
