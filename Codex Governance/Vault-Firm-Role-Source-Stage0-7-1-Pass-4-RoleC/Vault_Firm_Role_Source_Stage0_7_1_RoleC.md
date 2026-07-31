# Vault Firm-Role Source (Stage-0 §7.1) — API-Spec §2 contract row — Pass-4 Role-C

Documentation-update (Role-C) handoff that closes the **G-APISPEC PRE-LAND gap** declared in the Codex-APPROVED Pass-1 VEP ([[Vault_Firm_Role_Source_Stage0_7_1_VEP.md]], commit `0038403`). The `theo_get_my_role` handler is now **DEPLOYED to `vaultgpt-func-theo-tools` and golden-curl-verified** (2026-07-31), so per the standard deploy→document ordering this Role-C adds its contract row to `spec/THEO_API_SPEC.md` §2. **Documentation-only — no code, no schema, no deploy.** The edit is a single new subsection **§2.17** inserted immediately before `## §3 Boundary`; no existing line is modified.

## Grounding Conformance Receipt
Role: Claude Code
Turn Type: Role-C documentation update (API-Spec §2 contract row; deploy→document, post-verified)
Grounding parent (source baseline): `0038403d0b84e2bebcc7d58b81698db03eb50f96` (vault-theo, `development`) — the commit carrying the Codex-APPROVED Pass-1 VEP; currency anchors below are tip-independent blob SHAs
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | CONTRACT TRUTH (edit target) — `spec/THEO_API_SPEC.md` (§2 Contract Surface; §2.9 roster + §2.15/§2.16 func-theo-tools entry format mirrored; `## §3 Boundary` = insertion anchor) | `sed`(§2 index + §2.9/§2.16 rows + §3 anchor) this turn | `ccab715b326ab365551e2e13db7292a1ba1d7dd4` |
| 2 | APPROVED PASS-1 VEP (declares G-APISPEC, defines the row) — `Codex Governance/Vault-Firm-Role-Source-Stage0-7-1-Pass-1-VEP/Vault_Firm_Role_Source_Stage0_7_1_VEP.md` | Codex-APPROVED (`0038403`); §5 Gap G-APISPEC re-read this turn | tip: `0038403` |
| 3 | GOVERNING VISION — `governance/VAULT_MEMORY_ARCHITECTURE.md` (Amendment 7 firm_role rank hierarchy — the documented enum) | `Grep`(Amendment 7 rank order) this turn | `d17ddd0d97887b38e6db3297c56db9d6b3cfe9cf` |
| 4 | Grounding Conformance — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchor) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 5 | Execution Orchestration — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1D ordered pass sequence — deploy precedes API-Spec Role-C) | `Grep("ordered, non-skippable")` this turn | `565559b699c1309f8e750b0dbbac859c13d807c8` |
| 6 | Golden Handler — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§13 Golden Curl = the verification cited in the row) | `Grep`(§13 Golden Curl) this turn | `f8f0e5ea36447502e35fb87b373c94e376f05cbb` |

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt" | GCR (head) |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Rule Anchor Table" | this table |
| spec/THEO_API_SPEC.md | §2 | "## §2 Contract Surface (1A) → Deployed Endpoints (1B)" | §2 — the section this Role-C appends §2.17 to |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1D | "ordered, non-skippable" | deploy→document ordering: the row is added only AFTER Pass-3 deploy + golden curls |
| governance/VAULT_MEMORY_ARCHITECTURE.md | §A-7 | "partner > director > senior manager > manager > associate > preparer" | the `firm_role` enum documented in the §2.17 row |

---

## §1 — What this Role-C lands (gap closure + evidence)

**Gap closed: G-APISPEC.** The Pass-1 VEP §5 declared G-APISPEC as PRE-LAND: *"this VEP authors the handler now and adds the §2 contract row … via a Role-C handoff **after** the Pass-3 deploy + golden curls pass."* Those preconditions are now met:

- **Deployed** to `vaultgpt-func-theo-tools` (classic v4 layout `theo_get_my_role/{index.js,function.json}`) via Kudu VFS on 2026-07-31 — folder + both files `201`, GET-back byte-identical, `syncfunctiontriggers` + restart, function registered.
- **OBO precondition satisfied** (was the §3 gap): the three OBO app settings now exist on func-theo-tools (`AAD_TENANT_ID`/`AAD_CLIENT_ID` plain; `AAD_CLIENT_SECRET` = the same `@Microsoft.KeyVault(SecretUri=…/kv-vaultgpt-uks/secrets/aad-client-secret/)` reference func-stream/func-premium use), and func-theo-tools' system-assigned managed identity was granted **Key Vault Secrets User** on `kv-vaultgpt-uks` so the reference resolves. No secret bytes were copied or handled.
- **Golden-curl verified** (Golden Handler §13; `az` bearer, audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`, as wmansfield@vault-tax.com): own profile → **HTTP 200** `{ "data": { "oid": "225f17d0-18bb-48f1-b4e2-addd4048c2b8", "job_title": "Co-Founder and Partner", "firm_role": "partner" }, "meta": { … } }`; unauthenticated → **401**. The full OBO→Graph→`resolveFirmRole` chain executed end-to-end (KV-referenced secret resolved, most-senior-first substring map returned `partner`).

The row's contract wording is taken verbatim from the deployed handler behaviour (envelope, edges, backing), not invented.

## §2 — Exact verbatim doc edit (Codex applies byte-for-byte)

**Target file:** `spec/THEO_API_SPEC.md`
**Operation:** INSERT a new subsection. No existing line is changed or removed.
**Anchor:** the line `## §3 Boundary` (currently the last section header). Insert the block below **immediately before** that `## §3 Boundary` line, preserving one blank line above and below.

Insert exactly this block:

```markdown
### §2.17 Firm-role source (Memory Architecture Stage-0 §7.1) — backs the access-policy engine's firm-role dimension

| Capability | Contract | Status | Backing |
|---|---|---|---|
| resolve the SIGNED-IN caller's firm role from their Entra `jobTitle` | `DEPLOYED` (Firm-Role-Source, 2026-07-31; golden-verified): `GET /api/theo_get_my_role` on `vaultgpt-func-theo-tools` (no body) → **200** `{ data:{ oid, job_title, firm_role }, meta }` (standard `{data,meta}` envelope). `firm_role` ∈ `partner` > `director` > `senior_manager` > `manager` > `associate` > `preparer` > `null` (VAULT_MEMORY_ARCHITECTURE.md Amendment 7 rank hierarchy), derived from the caller's own Graph `jobTitle` by a case-insensitive **most-senior-first** substring map (`resolveFirmRole`, in-process); any unmapped / non-fee-earner title (e.g. "Administrative Assistant") or absent `jobTitle` → **`firm_role: null`** — **fail-closed / least-privileged**, never a guess. Reads ONLY the caller's OWN profile via a delegated Microsoft Graph **on-behalf-of** exchange (EasyAuth bearer → `getOboInputToken` → `exchangeGraphToken` against the "Vault GPT API" app, `AAD_TENANT_ID`/`AAD_CLIENT_ID`/`AAD_CLIENT_SECRET`) then `GET {graph}/v1.0/users/{callerOid}?$select=id,jobTitle` — the same OBO technique + app registration as the deployed `theo_list_people` roster handler (§2.9). **No DB, no Blob, no storage MI; stores nothing.** `OPTIONS` preflight → **204**. Missing/invalid EasyAuth identity, or no bearer for the OBO exchange → **401 `UNAUTHORIZED`**; a failed Graph token exchange / Graph call → **403 `FORBIDDEN`**; unexpected → **500 `INTERNAL_SERVER_ERROR`** (`{error:{code,message,status,timestamp}}` envelope). Executes as the signed-in user (Entra OID from EasyAuth `x-ms-client-principal`). The `AAD_CLIENT_SECRET` app setting is a **Key Vault reference** (`@Microsoft.KeyVault(SecretUri=…/kv-vaultgpt-uks/secrets/aad-client-secret/)` — no secret bytes on the app); func-theo-tools' system-assigned managed identity holds **Key Vault Secrets User** on `kv-vaultgpt-uks` so the reference resolves. Golden-curl verified 2026-07-31 (`az` bearer, audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`, as wmansfield@vault-tax.com): own profile → `{ oid:"225f17d0-…", job_title:"Co-Founder and Partner", firm_role:"partner" }` (HTTP 200); unauth → 401. This is the first endpoint of the Vault Memory Architecture Stage-0 access-policy engine (§7.1 firm-role source); the engine's read-handlers (§7.3+) reuse the same `resolveFirmRole` mapping in-process. | `1B-deployed` | Vault Memory Architecture **Stage-0 §7.1 firm-role source** (`VAULT_MEMORY_ARCHITECTURE.md` Amendment 7 + `Vault_Access_Policy_Engine_Stage0_Design` §7.1); delegated Graph OBO (Vault GPT API app; KV-referenced secret; func-theo-tools MI = Key Vault Secrets User) — mirrors `theo_list_people` §2.9; `resolveFirmRole` in-process map |
```

## §3 — Confirmations

- **Scope:** single additive subsection (§2.17); zero edits to existing rows; no renumbering (it is appended after the current last subsection §2.16).
- **No code/schema/deploy** in this handoff — the handler is already live; this only records its contract.
- **Placement rationale:** a dedicated §2.17 (not folded into §2.9 roster or §2.15/§2.16 image/video) because this is the first of the memory-architecture access-policy-engine endpoints; §7.2–§7.5 endpoints will append here as they land.
- On Codex APPROVAL, Claude applies the edit byte-faithfully and commits (verified-Role-C landing).
