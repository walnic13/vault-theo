# Deploy package — `theo_message` (Theo 1B Tier B1 — thin model gateway, HF-T1)

Copy-paste deployment artifacts for the Codex-APPROVED B1 VEP (`Codex Governance/Theo-1B-B1-Thin-Gateway-Pass-1-VEP/`, approved at vault-theo `9ca9474`). These files are extracted byte-for-byte from the approved VEP §HG.3 / §HG.4.

## Files
- **`index.js`** — the `theo_message` Azure Function handler. Stateless: authenticates the caller via Easy Auth (`x-ms-client-principal` → Entra OID, 401 if missing), then brokers the request to Claude via Azure AI Foundry using the **Function App's managed identity** (scope `https://ai.azure.com/.default`, `anthropic-version: 2023-06-01`), and returns the Anthropic `content[]` filtered to text in the Family-B envelope. No database.
- **`function.json`** — binding: `httpTrigger`, `authLevel: anonymous` (Easy Auth upstream), methods `post`/`options`, route `theo_message` → `POST /api/theo_message`.

## Deploy steps (Walter, in Azure — `vaultgpt-func-premium`)
1. Create function `theo_message` (HTTP trigger); paste `index.js` and `function.json` verbatim into the Azure portal UI.
2. **Dependency:** add `@azure/identity` to the Functions app `package.json` dependencies (the only new dep; `https` is built-in). Example: `"@azure/identity": "^4"`.
3. **Managed identity:** Function App → Identity → **System assigned → On**.
4. **Role:** `vaultgpt-foundry` → Access control (IAM) → Add role assignment → **`Cognitive Services User`** → assign to the Function App's managed identity. *(This principal is distinct from the user that passed the B0 connection test; the handler calls Foundry as the Function's identity.)*
5. **App settings** (Function App → Configuration):
   - `THEO_FOUNDRY_BASE` = `https://vaultgpt-foundry.services.ai.azure.com`
   - `THEO_FOUNDRY_DEPLOYMENT` = `claude-sonnet-4-6`
6. Save/restart; notify Claude Code to run the golden curl.

## Verification (Claude Code runs)
Golden curl per VEP §CURL (token via `az login`; non-PII prompt until ZDR confirmed — D-3):
`POST …/api/theo_message` with `{ "messages": [{ "role": "user", "content": "Reply with exactly the two characters: ok" }], "max_tokens": 64 }` → expect HTTP 200, `data.content[0].text == "ok"`.
- 401 → Easy-Auth token/scope · 500 "not configured" → app settings (step 5) · 502 → managed-identity role grant (step 4) or endpoint.

## Notes
- Stateless (no persistence) by design — Tier B1. Conversation/message persistence + RLS land in Tier B3 (`theo_conversations`/`theo_messages`).
- Does not touch `reporting_*` or `theo_*` tables. Holds the model credential server-side only.
