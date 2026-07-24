# Role-C Verbatim-Edit Handoff — DR-T12: record func-projects MI Key Vault Secrets User grant (D1 deploy provisioning)

Pass-4 Role-C documentation amendment. **Disclosure of a provisioning action taken during the D1 deploy.** While deploying D1 (on-ingest RAG indexing) to `vaultgpt-func-projects`, the added knowledge item returned 201 but the Search index was never created: the app's mirrored `AAD_CLIENT_SECRET` app setting is a `@Microsoft.KeyVault(SecretUri=https://kv-vaultgpt-uks.vault.azure.net/secrets/aad-client-secret/)` reference, and the app's system-assigned MI (`90847272-49a3-4a4c-8dda-598868d4379d`) had **no role on the vault**, so the reference did not resolve at runtime — `getAadToken` threw and the NON-FATAL indexing catch swallowed it. Fix (Walter-approved this turn): granted the func-projects MI **Key Vault Secrets User** on `kv-vaultgpt-uks` (the same role func-stream's MI already holds), restarted, re-verified end-to-end (index created; probe doc indexed with correct `knowledge_id`/`project_id`/`chunk_index`; 401 regression; test data cleaned up).

This is an app **provisioning** grant (a Key Vault RBAC role assignment on a separate resource), consistent with how the dedicated Theo apps were stood up ("Claude Code provisions it via Walter-granted `az`", DR-T10) — it is **not** a §1E run-from-package deploy action (§1E is explicit that "no other app setting, resource, or app is in scope"). It completes the D0 infra that mirrored func-stream. One additive edit to the DR-T12 provisioning facts records it. No code/schema/authority change.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Documentation-update package
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Turn issued against HEAD: `824e142ed117abd4d4c2c57bad5a5c232e0c80e9` (vault-theo, `development` — the commit that contains this package; this stamp is applied in the immediately-following child commit under review, since a commit cannot record its own SHA). All §4 anchors resolve identically at `824e142` and the child commit. Working tree also carried untracked `artifacts/*.xlsx` (Class B disclosed workbook dirt — not source/governance).
Currency-anchor form: git blob SHA at HEAD.
Grounding-mode basis: Conformance §4 "Documentation-update package" row = Targeted Current-Turn Grounding. Provisioning evidence (this turn): ARM role-assignment PUT granting Key Vault Secrets User (`4633458b-17de-408a-b874-0445c86b69e6`) to principal `90847272-…` at scope `.../vaults/kv-vaultgpt-uks`, verified present; func-stream MI (`f522c0ba-…`) independently shown to hold the same role; post-grant re-verify — add → 201, index `theo-project-knowledge` created (HTTP 200), Search query returned the doc, no-bearer → 401; test project + index doc deleted after.

### §4 Documents grounded this turn
| # | Document (name + absolute path) | Read/Grep this turn | Currency anchor (blob SHA @ HEAD) |
|---|---|---|---|
| 1 | Theo Execution Orchestration Standard (target — DR-T12 / §1E) — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` | `Read`+`Grep` this turn | `eb2a40ab3e6b0b51691eb90a313143164c2b05e9` |
| 2 | Claude Code Theo Governor Standard (Verbatim-Edit Handoff §11) — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` | `Grep` this turn | `c3f2267b751d5e9f4f025331359c4d3013bcbe8a` |
| 3 | Theo Grounding Conformance Standard (§3/§5) — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` | `Read` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |

## Rule Anchor Table
| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T12 | "system-assigned MI; EasyAuth on the shared audience" | Edit 1 — the provisioning-facts parenthetical being extended |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "no other app setting, resource, or app is in scope" | Boundary — this is provisioning (a vault RBAC grant), disclosed; not claimed as a §1E deploy action |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "exact before/after text for each edit" | Edit 1 is an exact before/after block |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "after the GCR, a Rule Anchor Table" | this Rule Anchor Table |

## Verbatim edit to `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (DR-T12 row)

### Edit 1 — record the Key Vault Secrets User grant in the DR-T12 provisioning facts
BEFORE (exact substring):
```
system-assigned MI; EasyAuth on the shared audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`; stood up in the Projects best-in-class program, Phase B)
```
AFTER:
```
system-assigned MI (principal `90847272-49a3-4a4c-8dda-598868d4379d`, granted **Key Vault Secrets User** on `kv-vaultgpt-uks` — Walter-approved 2026-07-24, during the Phase D D1 deploy — so the mirrored `@Microsoft.KeyVault` `AAD_CLIENT_SECRET` app setting resolves at runtime, matching func-stream); EasyAuth on the shared audience `api://4e1a1e31-5c20-4480-99e4-098901707d9e`; stood up in the Projects best-in-class program, Phase B)
```

## Boundary / no-drift
- One governed doc edited (`governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md`), one additive provisioning fact inside the existing DR-T12 parenthetical. No authority is created or widened: the grant is app provisioning (a vault RBAC role assignment), disclosed here; the §1E deploy-action scope is unchanged and explicitly not invoked for it.
- No code, schema, API, or handler change. `vaultgpt-func-premium` READ-ONLY and Walter-only DB/migrations/merges unchanged.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-RoleC-DRT12-funcprojects-KV-grant/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-4 Role-C review (APPROVED / REJECTED only). On APPROVED, Claude Code applies Edit 1 byte-faithfully to `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` and commits.
