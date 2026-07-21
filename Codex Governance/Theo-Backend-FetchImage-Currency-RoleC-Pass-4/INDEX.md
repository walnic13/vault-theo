# Theo Backend — FetchImage (IMG-2) documentation currency → DEPLOYED — Role-C (Pass-4)

A documentation-currency Role-C. Both IMG-2 packages are deployed and end-to-end verified (2026-07-21): the `theo_fetch_image` handler on `vaultgpt-func-theo-tools` (golden curls PASS incl. SSRF/type/size) and the func-stream tool-loop image-passthrough + `chat-tools` registration (live chat: Theo called `theo_fetch_image`, received the image as a vision block, and described it). This lands the spec/registry currency: (1) API Spec §2.1 documents the `tool_result` image-content-block contract + adds `theo_fetch_image` to the exposed tools; (2) a new API Spec §2.14 records the `theo_fetch_image` endpoint contract as DEPLOYED; (3) Golden Handler §6 appends **HF-T9** (outbound image-fetch broker) as DEPLOYED. Doc-only; no code.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 4 — Documentation-update package (Role-C authoring)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Turn issued against HEAD: vault-theo `0dafacc72177bccd8f6f3b5107f8e8c044e8ba36` (the commit that first contains this package; grounding reads against parent `efcd9dd9e763f605806dbaeaea2cb4b06d6d2a98`). Working tree carried 4 untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not grounding).
Currency-anchor form: git blob SHA at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec (edit target) — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md (§2.1 tool-loop; §2.12 export tool; §2 end / §3 boundary) | `sed`/`grep` of §2.1, §2.12, §2.13→§3 this turn | `dd0460ec5692f363d4096eed61de8117dae62a2a` |
| 2 | Theo Golden Handler Standard (edit target) — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md (§6 Handler Family Registry; HF-T8 row; append rule) | `sed`/`grep` of §6 HF-T7/T8 + append rule this turn | `d2b240dd14ba8f678c5d75488a2225d53791ccce` |
| 3 | Deployed evidence — FetchImage-MS1 Package A VEP (theo_fetch_image handler; APPROVED + deployed; golden curls PASS) — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo-tools/Codex Governance/Theo-Tools-FetchImage-MS1-Pass-1-VEP/INDEX.md | grounded this session (deploy + curls) | sibling-repo package (blob n/a cross-repo) |
| 4 | Deployed evidence — FetchImage LoopPassthrough-MS1 Package B VEP (loop + registry; APPROVED + deployed) — c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FetchImage-LoopPassthrough-MS1-Pass-1-VEP/INDEX.md | grounded this session (deploy + E2E) | `54618866` package commit |

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "feeds the `tool_result` back" | §2 Edit 1 — amends the §2.1 tool-loop row to document the image `tool_result` content-block contract + add `theo_fetch_image` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.12 | "`POST /api/theo_export_spreadsheet` on `vaultgpt-func-theo-tools`" | §2 Edit 2 — new §2.14 `theo_fetch_image` row mirrors the sibling tool-on-func-theo-tools contract shape |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 | "DMS change-subscription broker" | §2 Edit 3 — HF-T9 appended immediately after the HF-T8 row |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 | "monotonically increasing `HF-Tn`" | §2 Edit 3 — the append-rule authority for adding HF-T9 (monotonic id, Role-C landing) |

### Currency anchors (blob SHAs @ HEAD)
- THEO_API_SPEC.md `dd0460ec5692f363d4096eed61de8117dae62a2a`; THEO_GOLDEN_HANDLER_STANDARD.md `d2b240dd14ba8f678c5d75488a2225d53791ccce`.

## §1 What + why
IMG-2 (fetch an image from a URL so Theo can see it) is DEPLOYED and verified end-to-end. The specs still describe the tool-loop's `tool_result` as effectively text-only and list only `theo_export_spreadsheet`; the `theo_fetch_image` endpoint and the HF-T9 family are unrecorded. This Role-C brings the API Spec + Golden Handler current with the shipped reality. No code (both handlers already deployed + golden/E2E verified this session).

## §2 The edits (verbatim OLD → NEW)

### Edit 1 — API Spec §2.1 tool-loop row (two targeted substitutions within the `theo_message_stream` row)

**1a — add `theo_fetch_image` to the exposed tools. OLD → NEW:**

OLD: `(\`engine/chat-tools.js\`; first \`theo_export_spreadsheet\`)`

NEW: `(\`engine/chat-tools.js\`; \`theo_export_spreadsheet\` + \`theo_fetch_image\`)`

**1b — document the image `tool_result` contract. OLD → NEW:**

OLD: `feeds the \`tool_result\` back, and loops up to \`MAX_TOOL_TURNS\`.`

NEW: `feeds the \`tool_result\` back, and loops up to \`MAX_TOOL_TURNS\`. **Image tool_result (FetchImage-MS1, DEPLOYED 2026-07-21):** a tool that returns \`{ image:{ media_type, data(base64), … } }\` (\`theo_fetch_image\`, §2.14) has its \`tool_result.content\` delivered to the model as an Anthropic **image content-block array** (\`[{type:"image",source:{type:"base64",media_type,data}},{type:"text",…}]\`) so the model SEES the image; every other tool's result stays a JSON string (byte-unchanged).`

### Edit 2 — API Spec: insert a new §2.14 subsection immediately **before** `## §3 Boundary`

INSERT (a new subsection; the existing `## §3 Boundary` line is unchanged and follows it):
```
### §2.14 Image fetch (Tier Image-Fetch) — backs "Theo sees an image from the web"

| Capability | Contract | Status | Backing |
|---|---|---|---|
| fetch an image from a URL → model vision block | `DEPLOYED` (FetchImage-MS1, 2026-07-21): `POST /api/theo_fetch_image` on `vaultgpt-func-theo-tools`; body `{ url }` → **200** `{ data:{ image:{ media_type, data (base64), byte_size, source_url } } }` (standard `{data,meta}` envelope). SSRF-guarded outbound **https** GET of a URL already in the conversation (user-pasted or web_search-surfaced): https-only; DNS-resolve + reject any non-public address (loopback / private / link-local incl. `169.254.169.254` cloud-metadata / CGNAT / ULA / reserved / multicast, IPv4 + IPv6) and `localhost` / `metadata.google.internal`; pinned-IP TLS with SNI/Host preserved (no DNS-rebinding window); redirects re-validated at every hop (≤3); `content-type` ∈ `image/{png,jpeg,webp,gif}`; 10 MB cap (early `content-length` pre-check + streaming abort); rejects unknown body fields. Errors `{error:{code,message,status,timestamp}}`: 401 `UNAUTHORIZED`, 400 `INVALID_REQUEST` / `URL_NOT_ALLOWED` / `PAYLOAD_TOO_LARGE`, 415 `UNSUPPORTED_MEDIA_TYPE`, 502 `UPSTREAM_ERROR`. Executes as the signed-in user (EasyAuth OID). **Stateless** — no `theo_*` table, no Blob, no MI. Invoked as a Theo tool via the general-chat tool-loop in `theo_message_stream` (`vaultgpt-func-stream`; `chat-tools` registry, DR-T11); the loop delivers the returned image to the model as a vision content-block (§2.1). Golden-curl + live-chat verified 2026-07-21. | `1B-deployed` | HF-T9 outbound image-fetch broker (func-theo-tools) |

```

### Edit 3 — Golden Handler §6: append the HF-T9 row immediately **after** the HF-T8 row

The HF-T8 row ends with `… on-demand-trigger 202 (correct no-op when nothing is within the renewal window) |`. Append this new row on the next line (append-only, monotonic id per the §6 append rule):
```
| HF-T9 | Outbound image-fetch broker | SSRF-guarded server-side **https** GET of a model/user-supplied image URL, returning the bytes base64 for the tool-loop to deliver to the model as a vision content-block. Guards: https-only; DNS-resolve + reject non-public addresses (loopback / private / link-local incl. cloud-metadata `169.254.169.254` / CGNAT / ULA / reserved / multicast, IPv4 + IPv6 incl. IPv4-mapped) + `localhost` / `metadata.google.internal`; pinned-IP TLS (no DNS-rebinding window); per-hop redirect re-validation (≤3); `content-type` ∈ `image/{png,jpeg,webp,gif}`; 10 MB cap (early `content-length` + streaming); rejects unknown body fields; leaks no credentials or internal/protected upstream details (returns only the caller/model-provided `source_url` as provenance). Stateless (no `theo_*` table, no Blob, no MI). Deploys to `vaultgpt-func-theo-tools` (DR-T7/DR-T10). First handler-side outbound-fetch-of-arbitrary-URL pattern (vs the fixed-host HF-T8 / GIPHY brokers) — the SSRF guard is the mitigation. | DEPLOYED 2026-07-21 (`theo_fetch_image`; FetchImage-MS1 landed; golden-curl + live-chat verified) |
```

## §3 Scope / sweep
- Three edits across two docs (API Spec §2.1 + new §2.14; Golden Handler §6 HF-T9). No existing row's meaning is changed except the §2.1 additive amendment (which only ADDS the image-`tool_result` note + the second tool name). Append-only for §2.14 and HF-T9.
- Swept for other stale IMG-2 references: the tool-loop is described only in §2.1 (amended); the tools list "first `theo_export_spreadsheet`" is the only enumeration (amended 1a); no other doc asserts the tool_result is text-only. No `theo_*` schema (stateless tool — Schema doc untouched). API §2.12 (export) is unaffected.

## §4 Gap Register
**PROCEED.** Doc-only currency reflecting two already-APPROVED + deployed + E2E-verified packages (FetchImage-MS1 A + B). No code, no new authority beyond recording HF-T9 (whose handler is deployed). **PROCEED.**

## §5 Requested action
Codex Pass-4 review + execution (or approval to land) of Edits 1–3 against the Grounding Conformance Standard §3/§5 and Golden Handler §6 append rule. On APPROVED, Claude Code lands the verbatim edits in `spec/THEO_API_SPEC.md` and `governance/THEO_GOLDEN_HANDLER_STANDARD.md`.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-FetchImage-Currency-RoleC-Pass-4/INDEX.md" --repo-root .` — expect PASS.
