# Deploy package — `theo_message` (Theo 1B Tier B1 — thin model gateway, HF-T1)

Copy-paste deployment artifacts for the B1 VEP (`Codex Governance/Theo-1B-B1-Thin-Gateway-Pass-1-VEP/`). The code files are byte-equal to the VEP §HG.3 / §HG.4.

**Token method:** the deployed Family-B raw-`https` token-exchange mechanism (`requestUrl` → `login.microsoftonline.com`, app `AAD_CLIENT_ID`/`SECRET`), with **`grant_type=client_credentials`** → an **app-only token** for `https://ai.azure.com/.default`. **No `@azure/identity` SDK, no managed identity, no per-user consent.** Authorization is by an RBAC role on the app's service principal at the Foundry resource.

## Files
- **`index.js`** — the `theo_message` handler. Stateless: Easy Auth (`x-ms-client-principal` → Entra OID, 401 if missing) → `getFoundryToken()` (client-credentials app token) → `POST {FOUNDRY_BASE}/anthropic/v1/messages` (`anthropic-version: 2023-06-01`) → return Anthropic `content[]` filtered to text in the Family-B envelope. No database. The 10 shared Family-B helpers are byte-identical to `reporting_probe_dms_connection`.
- **`function.json`** — binding: `httpTrigger`, `authLevel: anonymous` (Easy Auth upstream), methods `post`/`options`, route `theo_message` → `POST /api/theo_message`. Identical to `reporting_probe_dms_connection.function.json` except `methods` + `route`.

## Deploy steps (Walter, in Azure — `vaultgpt-func-premium`) — no dependency, no managed identity
1. Re-paste **`index.js`** + **`function.json`** into the `theo_message` function (Azure portal UI). **No npm install** — built-in `https` only.
2. **App settings** (Function App → Configuration): keep `THEO_FOUNDRY_BASE=https://vaultgpt-foundry.services.ai.azure.com` and `THEO_FOUNDRY_DEPLOYMENT=claude-sonnet-4-6`; confirm `AAD_TENANT_ID`, `AAD_CLIENT_ID`, `AAD_CLIENT_SECRET` are present (the working reporting handlers use them).
3. **RBAC grant (the key step):** `vaultgpt-foundry` → **Access control (IAM)** → Add role assignment → **`Cognitive Services User`** → assign to the **service principal of `AAD_CLIENT_ID`** (the **"Vault GPT API"** app, `4e1a1e31-5c20-4480-99e4-098901707d9e`). This authorizes the app-only token to call the model. *(No managed identity, no user consent.)*
4. Save/restart; notify Claude Code to run the golden curl.

## Verification (Claude Code runs)
`POST …/api/theo_message` with `{ "messages": [{ "role": "user", "content": "Reply with exactly the two characters: ok" }], "max_tokens": 64 }` → expect HTTP 200, `data.content[0].text == "ok"`.
- 401 → Easy-Auth · 500 "not configured" → app settings (step 2) · 500 "token request failed" with an AADSTS message → check `AAD_*` settings · 403 from the model call → the service-principal RBAC role (step 3) not yet effective · 502 → Foundry endpoint/deployment name.

## Notes
- Stateless (no persistence) by design — Tier B1. Persistence + RLS land in Tier B3.
- Does not touch `reporting_*` or `theo_*` tables. Holds the model credential server-side only.
- **Architecture note:** this client-credentials method diverges from architecture §2.2/DR-T2 ("managed identity, keyless"); the VEP discloses it (§GR G-5) and a Role-C will align the architecture doc to the deployed method.
