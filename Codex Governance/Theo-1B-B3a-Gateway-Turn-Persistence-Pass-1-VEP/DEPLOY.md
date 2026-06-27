# DEPLOY — Theo B3a Gateway Turn Persistence (Azure copy-paste)

> Deploy package for Walter. Apply **only after Codex APPROVES** (done — `4c4120f`). One handler file changes; `function.json` does not. No migration (B2 schema already deployed).

## Step 1 — Replace the handler
Azure Portal → Function App `vaultgpt-func-premium-…` → Functions → **`theo_message`** → Code + Test → `index.js` → select all → paste the contents of **`b3a_theo_message_index.js`** (in this folder; byte-identical to the approved VEP §HG.3) → **Save**.

It's the deployed B1.7 gateway **plus** turn persistence: after a successful Foundry call it opens a `pg` transaction (`set_config(oid)`), resolves/creates a `theo_conversations` row, inserts the user + assistant `theo_messages` (with `citations`), and returns `conversation_id`. A malformed `conversation_id` is rejected `400` up front (`isUuid`).

## Step 2 — Confirm the app can reach Postgres
The handler now uses `pg`. On `theo_message`'s Function App, confirm:
- **`POSTGRES_CONNECTION_STRING`** is set (connecting as `vaultgpt_app`) — **already present if the `reporting_*` handlers run on this same app**; if `theo` is a separate app, add it.
- **`pg`** is in the app's dependencies (already there if reporting handlers run here; otherwise add `pg` to `package.json` / ensure `node_modules` includes it).

No new secret beyond `POSTGRES_CONNECTION_STRING`; no `function.json` change; no migration.

## Step 3 — Tell Claude Code
Reply **"B3a deployed"** and I'll run the golden curls (token via `az`, never printed) + read-only SQL:
1. New conversation → 200, `conversation_id` returned.
2. Append with that `conversation_id` → 200, same id.
3. RO-SQL: the `theo_conversations` row + 4 ordered `theo_messages` (seq 0–3) persist for the signed-in user.
4. Foreign (valid-UUID) `conversation_id` → 404/403.
5. Malformed `conversation_id` → **400** (no Foundry call).
6. Grounded turn → 200, assistant message persisted with `citations`.

## Files
- `b3a_theo_message_index.js` — the handler to deploy (== VEP §HG.3). **Paste this into `theo_message/index.js`.**
- `function.json` — UNCHANGED (do not edit).
