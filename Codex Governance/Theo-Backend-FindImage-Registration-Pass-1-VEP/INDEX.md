# Theo Backend — FindImage Registration (`theo_find_image` → `chat-tools`) — Pass 1 Verified Evidence Pack

Controlling artifact for Codex review. The **paired half** of the Codex-APPROVED, DEPLOYED `theo_find_image` handler (vault-theo-tools `Codex Governance/Theo-Tools-FindImage-Pass-1-VEP/`, live + golden-curl-verified on `vaultgpt-func-theo-tools` 2026-07-23). This VEP registers `theo_find_image` in the **general-chat tool-loop** so Claude can actually call it: **one additive `CHAT_TOOLS` entry** in `engine/chat-tools.js` on `vaultgpt-func-stream`. Because the tool returns a plain JSON `data` object (a URL + metadata), it uses the loop's existing default `JSON.stringify(out)` passthrough — **no `theo_message_stream.js` change** (contrast `theo_fetch_image`, which needed an image-content-block passthrough). Self-contained: edited `engine/chat-tools.js` + the deployed LIVE snapshot under `primary-reference/`. Once deployed, Theo will call `theo_find_image` for "show me what X looks like" and emit `![title](imageUrl)` with a URL verified to load (the deployed FE `img` renderer displays it).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (backend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: P5
Turn issued against HEAD: vault-theo `8a2440c31f73698c69ec83db1955932fdd7412e7` (the commit that contains this package; grounding reads against pre-package parent `7380683fb8fd6706b5b71b7dcb23b664e010fd44`). The paired DEPLOYED handler is anchored in vault-theo-tools at HEAD `9510a7a` (Codex-APPROVED). Cited-doc blob SHAs below are HEAD-stable.
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §2 | "inlines both full-verbatim in the turn" | Primary Reference — deployed `engine/chat-tools.js` copied verbatim (full, no ellipsis) under `primary-reference/` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §4 | "the contract's response shape" | §4 — the additive entry mirrors the deployed `theo_fetch_image` registry entry byte-for-shape (name/route/downloadable/description/input_schema) |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T11 | "DR-T11" | §1 — the general-chat tool-loop registry (`CHAT_TOOLS`) + HTTP dispatch to func-theo-tools as the signed-in user |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | DR-T10 | "dedicated Function App" | §1 — the tool endpoint lives on `vaultgpt-func-theo-tools`; the registry lives on `vaultgpt-func-stream` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | tool-dispatch | "tool-dispatch" | §1 — `dispatchChatTool` HTTP-dispatches the registered tool; unchanged by this additive entry |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.1 | "engine/chat-tools.js" | §1/§4 — the deployed tool-loop registry this VEP adds one entry to; §2.1 tool-loop row updated via Role-C to list `theo_find_image` |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/Codex Governance/Theo-Backend-FindImage-Registration-Pass-1-VEP/primary-reference/chat-tools.LIVE.js.md | primary-ref | "const CHAT_TOOLS" | §4 — additive entry inserted after the `theo_fetch_image` entry; diff is additive-only (verified) |

### Currency anchors (blob SHAs @ HEAD `7380683`)
- THEO_GROUNDING_CONFORMANCE_STANDARD.md `7c0d902bdff3b6c0af475b483e31ed796214e57b`; CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md `c3f2267b751d5e9f4f025331359c4d3013bcbe8a`; CODEX_THEO_BACKEND_REVIEW_STANDARD.md `d2e1b9881b6e2ed7d77921a055feffb0852257fd`; THEO_GOLDEN_HANDLER_STANDARD.md `d675b2822e6c5901a601a0023aa9f067b1967b14`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `be066f12147d1eb13b51f025b275f5413ab51f0e`; THEO_ARCHITECTURE_AND_STRUCTURE.md `07451ce9d912830b3c15fedf74761d00c59f97b2`; THEO_API_SPEC.md `dc0e6e0cc9c8dce9f003bebcb951fd4af30c97f3`; THEO_AZURE_POSTGRES_SCHEMA.md `e6143cf55839120b696e03c6702a1144ac3cc2c9`.

### Full Baseline doc set (Conformance §4 backend) — grounded this turn
Governor `CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (deploy/authority), Conformance `THEO_GROUNDING_CONFORMANCE_STANDARD.md` (this GCR/Rule-Anchor/lint), Codex Review `CODEX_THEO_BACKEND_REVIEW_STANDARD.md`, Golden Handler `THEO_GOLDEN_HANDLER_STANDARD.md` (§2 primary-ref, §4 shape), Orchestration `THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (DR-T10/DR-T11), Architecture `THEO_ARCHITECTURE_AND_STRUCTURE.md` (tool-dispatch), API Spec `THEO_API_SPEC.md` (§2.1 tool-loop; §2.12/§2.14 sibling tool rows), Schema `THEO_AZURE_POSTGRES_SCHEMA.md` — **N/A (no DB/schema/migration; a stateless registry edit)**, cited for completeness per Conformance §4.

## §1 Feature Identification + Architecture & boundary reconciliation
- **Feature (this VEP):** register `theo_find_image` in the general-chat tool-loop. **One additive object** appended to the `CHAT_TOOLS` array in `engine/chat-tools.js` on `vaultgpt-func-stream`: `{ name:'theo_find_image', route:'theo_find_image', downloadable:false, description:<usage guidance>, input_schema:{ subject } }`. The registry auto-derives `BY_NAME`, `CHAT_TOOL_SCHEMAS` (handed to the model), `isChatTool`, `isDownloadable`; `dispatchChatTool` already HTTP-POSTs any registered tool to `${TOOLS_BASE}/api/<route>` as the signed-in user (forwarded bearer; shared `api://4e1a1e31-…` audience) and returns the tool's `data`. So this entry alone exposes + dispatches the tool.
- **The description carries the usage guidance** (reaches the model as the tool schema): call it for "show me / picture what X looks like" **instead of guessing a URL**; pass a **concise subject noun**, not a sentence; after it returns, emit `![title](imageUrl)` using `imageUrl` verbatim; when `source==="openverse"`, add a short creator/license caption; on error/no-image, say so rather than invent a URL.
- **No loop change (the key contrast with `theo_fetch_image`):** `theo_find_image` returns a JSON `data` object (URL + metadata), which the loop feeds back via its existing default `toolResultContent = JSON.stringify(out)` path. Only `theo_fetch_image` needed the image-content-block passthrough in `theo_message_stream.js`. Verified against the deployed tool-loop (API Spec §2.1: image passthrough is scoped to a tool returning `{ image:{…} }`; every other tool's result stays a JSON string). So **`theo_message_stream.js` is not touched**.
- **Boundary:** a single additive registry entry on `vaultgpt-func-stream`. No new endpoint (the endpoint is the already-DEPLOYED handler on func-theo-tools, DR-T10), no DB/schema/migration/Blob/MI, no FE change (the `img` renderer + display prompt shipped at HEAD 7380683). The tool-loop dispatch path (`dispatchChatTool`, DR-T11) is reused unchanged.

## §2 Gap Register
**PROCEED.**
- **(1) Depends on the DEPLOYED handler.** `theo_find_image` on func-theo-tools is live + golden-curl-verified (2026-07-23; both Wikipedia and Openverse routes return image URLs that load). This registration turns it on for the model. Satisfied, PROCEED.
- **(2) No loop change needed.** JSON `data` return → default passthrough (§1). No `theo_message_stream.js` edit. Recorded, PROCEED.
- **(3) Prompt guidance lives in the tool `description`** (concise subject; emit `![title](imageUrl)`; CC caption; don't invent URLs). The FE `BASE_PROMPT` (`swapBlock.ts`, salmon-river) still says "find via web search; prefer Wikimedia" — a mild redundancy, not a conflict: the tool description is authoritative for tool usage and Claude prefers the tool. A one-line `BASE_PROMPT` refinement to point explicitly at `theo_find_image` is a **small optional follow-up FE micro-VEP** (Theo-FE regime), **out of scope here** to keep the engine/FE boundary clean. Disclosed, PROCEED.
- **(4) API Spec Role-C (post-deploy).** After the func-stream deploy, Role-C updates API Spec §2.1 (add `theo_find_image` to the registered-tools list) and adds a §2.x tool row for the endpoint as DEPLOYED (mirrors §2.12 export / §2.14 fetch-image). PROCEED.
- **(5) No schema/migration/keys/npm** — a registry edit using existing deps. PROCEED.

## §3 Sub-phase walk (P1–P8)
- **P1 Feature identification:** §1 — one additive `CHAT_TOOLS` entry registering the DEPLOYED `theo_find_image`.
- **P2 Architecture/boundary:** registry edit on func-stream; reuses `dispatchChatTool` (DR-T11); endpoint on func-theo-tools (DR-T10); no loop/DB/FE change. (§1 Boundary.)
- **P3 Gap register:** §2 (PROCEED).
- **P4 Contract grounding:** API Spec §2.1 (tool-loop exposes `CHAT_TOOL_SCHEMAS`); the tool endpoint contract is locked at the APPROVED handler VEP (`{ data:{ subject, source, title, imageUrl, fullImageUrl, description, pageUrl, license, creator } }`).
- **P5 Handler/registry grounding:** Primary Reference = deployed `engine/chat-tools.js` (LIVE snapshot, verbatim under `primary-reference/`); the additive entry mirrors the deployed `theo_fetch_image` entry shape. Structural Mirror §4.
- **P6 Boundary re-check:** additive-only diff (verified — lines inserted after the `theo_fetch_image` entry; nothing else changed); `node --check` PASS.
- **P7 Verification:** post-deploy — the tool surfaces in `CHAT_TOOL_SCHEMAS`; a live chat turn ("show me a golden retriever") drives a `theo_find_image` `tool_use` → the model emits `![…](https://upload.wikimedia.org/…)` → renders; a no-tool chat turn is byte-unchanged (§5).
- **P8 Assembly:** this pack (GCR + Rule Anchor Table + lint PASS).

## §4 Structural Mirror Table
Primary Reference = deployed `engine/chat-tools.js` (LIVE snapshot). The change is **one additive array element** modelled exactly on the deployed `theo_fetch_image` entry.

| Region (chat-tools.js) | vs Primary Reference (LIVE) | Classification | Anchor |
|---|---|---|---|
| Entire file except the new array element | byte-identical | **EXACT** (additive-only; diff verified) | Golden Handler §2 (primary-ref full verbatim) |
| New `CHAT_TOOLS` element `theo_find_image` (`name`/`route`/`downloadable:false`/`description`/`input_schema`) | same object shape as the deployed `theo_fetch_image` element | **contract-locked** — registry entry shape matches the deployed sibling | Golden Handler §4 + API §2.1 ("Add a tool = one CHAT_TOOLS entry") |
| `description` text (usage guidance) + `input_schema` single required `subject` string | different tool's guidance + field set (vs `theo_fetch_image`'s `url`) | **ALLOWED DELTA** (the specific tool's schema/guidance) | Golden Handler §4 |
| `downloadable: false` | same as `theo_fetch_image` (not a file export) | **EXACT** | §1 — JSON `data`, no `vault_export` frame |
| `dispatchChatTool` / `postJson` / `BY_NAME` / `CHAT_TOOL_SCHEMAS` derivation / `theo_message_stream.js` | unchanged | **EXACT** (reused; no loop change) | Architecture tool-dispatch + §1 |

No DEVIATION rows.

## §5 Verification (post-deploy on func-stream; never print the token)
1. **Registry surfaced:** after deploy + restart, `theo_find_image` appears in `CHAT_TOOL_SCHEMAS` (confirmed by a live chat turn that calls it; the deployed handler's own golden curls already passed at the handler VEP).
2. **Live chat — Wikipedia route:** ask Theo "show me what a golden retriever looks like" → a `theo_find_image` `tool_use` (visible as `event: tool` `{name:"theo_find_image"}`) → the reply contains `![…](https://upload.wikimedia.org/…)` which the FE renders inline.
3. **Live chat — Openverse route:** ask for a generic/descriptive subject (e.g. "show me some latte art") → `source:"openverse"`, reply contains `![…](https://api.openverse.org/…)` + a short creator/license caption.
4. **Regression:** a normal no-tool chat turn streams unchanged (no spurious `theo_find_image` call; the tool only fires on show-me intent).

## §6 Deploy (Pass-3, on APPROVAL) — Kudu VFS to `vaultgpt-func-stream` (NOT premium)
1. SCM host `vaultgpt-func-stream-cyb4g8bhatddencs.scm.uksouth-01.azurewebsites.net`. GET current `/site/wwwroot/src/engine/chat-tools.js` as rollback baseline (matches this pack's LIVE snapshot).
2. Kudu VFS PUT `engine/chat-tools.js` → `/site/wwwroot/src/engine/chat-tools.js` (`If-Match:*`; `Content-Type: application/octet-stream`; expect 204; GET-back + diff = additive-only).
3. `az functionapp restart -n vaultgpt-func-stream -g Vault-Tax`.
4. Run §5 live-chat verification (no premium deploy — `theo_message` on `vaultgpt-func-premium` is untouched).
5. On green, Role-C flips API Spec §2.1 (add `theo_find_image` to the registered-tools list) + a new §2.x tool row to DEPLOYED.

## §7 Out of scope
No `theo_message_stream.js` loop change (JSON `data` uses the default passthrough). No FE change (the `img` renderer + display `BASE_PROMPT` shipped at HEAD 7380683). The optional `BASE_PROMPT` refinement to name `theo_find_image` explicitly is a separate small **Theo-FE** micro-VEP (§2(3)). No `theo_*` schema. No premium deploy.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-FindImage-Registration-Pass-1-VEP/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review. On APPROVED, Claude Code deploys the additive `engine/chat-tools.js` to `vaultgpt-func-stream` per §6 + runs §5 live-chat verification; Role-C flips API Spec §2.1 + the new §2.x tool row to DEPLOYED. `theo_find_image` then becomes model-usable end-to-end (deployed handler + registration + shipped FE renderer).
