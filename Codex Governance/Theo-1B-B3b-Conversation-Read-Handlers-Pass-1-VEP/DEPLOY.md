# DEPLOY — Theo B3b Conversation Read Handlers (Azure)

> Apply after Codex APPROVES. Two **new** functions on the shared `vaultgpt-func-premium` app. No migration, no new dependency (`pg` + `POSTGRES_CONNECTION_STRING` already present).

## Step 1 — Create `theo_list_conversations`
New HTTP function `theo_list_conversations` → `index.js` = `theo_list_conversations.index.js` (this folder); `function.json` = `theo_list_conversations.function.json` (GET/OPTIONS, route `theo_list_conversations`, anonymous).

## Step 2 — Create `theo_get_conversation`
New HTTP function `theo_get_conversation` → `index.js` = `theo_get_conversation.index.js`; `function.json` = `theo_get_conversation.function.json` (GET/OPTIONS, route `theo_get_conversation`, anonymous).

## Step 3 — Tell Claude Code
Reply "B3b deployed" → I run the golden curls: list (includes the B3a conversation) → get (4 ordered messages = per-row confirmation of B3a persistence) → malformed-id 400 → foreign-id 404 → limit=0 400.

## Files (== VEP §HG.3–§HG.6)
- `theo_list_conversations.index.js` / `.function.json`
- `theo_get_conversation.index.js` / `.function.json`
