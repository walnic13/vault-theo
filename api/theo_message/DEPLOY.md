# Deploy package — `theo_message` (Theo 1B Tier B1 — thin model gateway, HF-T1)

Copy-paste deployment artifacts for the B1 VEP (`Codex Governance/Theo-1B-B1-Thin-Gateway-Pass-1-VEP/`). The code files are byte-equal to the VEP §HG.3 / §HG.4.

**Token method:** mirrors the deployed Family-B handlers' **OBO client-secret token exchange** (raw `https` to `login.microsoftonline.com`, app `AAD_CLIENT_ID`/`SECRET`) — **no `@azure/identity` SDK, no managed identity**. Only the scope is retargeted to Foundry (`https://ai.azure.com/.default`).

## Files
- **`index.js`** — the `theo_message` handler. Stateless: Easy Auth (`x-ms-client-principal` → Entra OID, 401 if missing) → OBO-exchange the user's token for a Foundry-scoped token (`exchangeFoundryToken`, mirroring the deployed `exchangeGraphToken`) → `POST {FOUNDRY_BASE}/anthropic/v1/messages` (`anthropic-version: 2023-06-01`) → return Anthropic `content[]` filtered to text in the Family-B envelope. No database.
- **`function.json`** — binding: `httpTrigger`, `authLevel: anonymous` (Easy Auth upstream), methods `post`/`options`, route `theo_message` → `POST /api/theo_message`. Identical to `reporting_probe_dms_connection.function.json` except `methods` + `route`.

## Deploy steps (Walter, in Azure — `vaultgpt-func-premium`) — no dependency, no managed identity
1. Create function `theo_message` (HTTP trigger); paste `index.js` and `function.json` verbatim into the Azure portal UI. **No npm install** — the handler uses only built-in `https`.
2. **App settings** (Function App → Configuration):
   - `THEO_FOUNDRY_BASE` = `https://vaultgpt-foundry.services.ai.azure.com`
   - `THEO_FOUNDRY_DEPLOYMENT` = `claude-sonnet-4-6`
   - confirm the existing OBO settings used by the working reporting handlers are present: `AAD_TENANT_ID`, `AAD_CLIENT_ID`, `AAD_CLIENT_SECRET`.
3. **Foundry access for the signed-in user:** the OBO exchange yields a *delegated* token, so the calling user needs **`Cognitive Services User`** on `vaultgpt-foundry` (Walter, as Owner, already passed the B0 user-token test). *(No Function managed-identity step.)*
4. **If the OBO exchange errors (AADSTS consent/permission):** grant the app registration (`AAD_CLIENT_ID`) consent/permission to the Foundry resource `https://ai.azure.com`. The handler surfaces the exact AADSTS message on failure (it won't be an empty 500).
5. Save/restart; notify Claude Code to run the golden curl.

## Verification (Claude Code runs)
Golden curl per VEP §CURL (token via `az login`; non-PII prompt until ZDR confirmed — D-3):
`POST …/api/theo_message` with `{ "messages": [{ "role": "user", "content": "Reply with exactly the two characters: ok" }], "max_tokens": 64 }` → expect HTTP 200, `data.content[0].text == "ok"`.
- 401 → Easy-Auth token/scope · 500 "not configured" → app settings (step 2) · 403/500 with an AADSTS message → OBO consent (step 4) or the user's Foundry role (step 3) · 502 → Foundry endpoint/deployment name.

## Notes
- Stateless (no persistence) by design — Tier B1. Persistence + RLS land in Tier B3.
- Does not touch `reporting_*` or `theo_*` tables. Holds the model credential server-side only.
- **Architecture note:** this OBO method diverges from architecture §2.2/DR-T2 ("managed identity, keyless"); the VEP discloses it (§GR G-5) and a Role-C will align the architecture doc to the deployed OBO method.
