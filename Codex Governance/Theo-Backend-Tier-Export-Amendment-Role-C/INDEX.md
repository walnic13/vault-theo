# Theo Backend — Tier Export amendment (Role-C plan amendment) — for Codex

Amendment-first (Voice pattern). Adds a new **Tier Export** to the Theo Phase 1B plan and its companion contract/family/decision rows so `theo_export_spreadsheet` (Theo → downloadable, typed/formatted `.xlsx`) can be authored as governed microsteps. Best-in-class design Walter-directed 2026-07-17. **This turn is the plan amendment only** — no handler authored, no code, no deploy. Four verbatim edits (before/after) for the Pass-4 inline executor to land after APPROVAL.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 4 — Documentation-update package (Role-C authoring)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A
Turn issued against HEAD: vault-theo `6b92ae9d615b47092f037d0ca88cd82700d8a596` (package-present; the four target docs are unmodified here; blob SHAs below). This package's own commit adds only this INDEX.
Currency-anchor form: git blob SHA at HEAD (Conformance §8 fallback). Absolute paths in the Rule Anchor Table.

## Rule Anchor Table

| Source doc (absolute path) | Clause id | Verbatim clause text | Applied in output at |
|----------------------------|-----------|----------------------|----------------------|
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier Voice | "PROPOSED until their VEPs land DEPLOYED" | Edit 1 — Tier Export mirrors the Tier Voice amendment shape |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 HF-T6 | "Deploys to `vaultgpt-func-chat` (DR-T7)." | Edit 3 — HF-T7 export broker mirrors the HF-T6 func-chat/stateless posture |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B DR-T8 | "Deploys to `vaultgpt-func-chat` (DR-T7); stateless (no `theo_*` table, no migration)." | Edit 4 — DR-T9 export decision mirrors DR-T8 |
| c:/Users/WalterMansfield/Vault Group LLP/Innovate - Documents/Tax Workpapers Project/2026/vault-theo/spec/THEO_API_SPEC.md | §2.11 | "Both Voice I/O routes execute as the signed-in user on `vaultgpt-func-chat`" | Edit 2 — §2.12 Export section mirrors the §2.11 format |

### Currency anchors (blob SHAs @ HEAD `b972ce7`)
- THEO_PHASE_1B_BACKEND_PLAN.md `4697cb574ba53023bb5d60aef65793317f28f197`; THEO_API_SPEC.md `8ae244ea5d716afd4cf2b4b8f53658e59d361cea`; THEO_GOLDEN_HANDLER_STANDARD.md `7e11595f8067c2b023dc5c295700e75ce78a21fd`; THEO_EXECUTION_ORCHESTRATION_STANDARD.md `131e6e62772b0bca46468473556418651e3a6660`.

## Design summary (what Tier Export is)
Theo → a real **downloadable `.xlsx`** from data it extracts (first use case: prior-year K-1s → current-year workpaper input; the extraction half already works via Tier B8 native document-block reading). **Best-in-class, Walter-directed 2026-07-17:**
- **Typed, formatted output** — numbers as numbers, dates as dates, box numbers/descriptions preserved (kills the "Text-to-Columns" pain); header block (fund · partner · tax year); K-1-organized layout.
- **Review-before-export** — Theo shows the extracted table in chat for confirmation/correction first; a "source box" + low-confidence flag mark values to double-check (tax-accuracy first).
- **Multi-K-1 workbook** — sheet-per-K-1 (or consolidated partner-per-column).
- **In-tenant** — workbook built server-side with SheetJS (already the in-tenant lib Theo uses to *read* Excel in B8; writing is the same lib); no third-party service.
- **Delivery** — owner-scoped Blob (`theo-content`) + a short-TTL read SAS → a Download card (may hand to desktop Excel via the #1b `webDavUrl`/Office-URI path).
- **Stateless v1** — no `theo_*` table, no migration (mirrors Voice). **v1.1 (fast follow):** workpaper-template-shaped export (map K-1 → the current-year workpaper input columns Theo reads from the DMS) + optional Artifacts integration.
- **Deploy split:** the `theo_export_spreadsheet` handler on `vaultgpt-func-chat` (Claude-deployed, DR-T7); the model-facing tool-manifest wiring in `theo_message` (`vaultgpt-func-premium`) is Walter-deployed (the established Theo premium/chat split). Trigger is **tool-driven** (the model calls it when the user asks to export).

## Gap Register
**PROCEED.** No schema/migration (stateless v1). Extraction is already deployed (Tier B8). The func-premium tool-manifest wiring is Walter-deployed (normal Theo split) — recorded, not a blocker. Large-scanned-PDF OCR robustness (>3 MB pdf-parse path) is a separate, optional future item, out of scope here.

---

## Edit 1 — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (insert after the Tier Voice block, before `---` / `## 8. Open decisions`)

**Anchor (before):**
```
- **Completion gate (per microstep).** VEP Codex-APPROVED → Claude Code provisions (model deploy / MI role) + deploys to func-chat → golden-curl-verified → Role-C updates the API Spec §2.11 row + the Golden Handler §6 HF-T6 status to DEPLOYED. No `theo_*` schema change in this tier.

---

## 8. Open decisions (Walter) — Decision Register seed
```
**After (insert the new block between the completion-gate line and `---`):**
```
- **Completion gate (per microstep).** VEP Codex-APPROVED → Claude Code provisions (model deploy / MI role) + deploys to func-chat → golden-curl-verified → Role-C updates the API Spec §2.11 row + the Golden Handler §6 HF-T6 status to DEPLOYED. No `theo_*` schema change in this tier.

### Tier Export — Theo → downloadable Excel (PROPOSED — Walter-directed 2026-07-17)
- **Purpose.** Let Theo emit a real **downloadable `.xlsx`** from data it extracts, so users stop copy/pasting model tables into Excel (Akshay's request). First use case: prior-year **K-1s → current-year workpaper input**. The *extraction* half already works (Tier B8 native document-block reading, incl. scanned PDFs ≤ 3 MB); this tier adds the *emit* half.
- **Best-in-class design (DR-T9).** Typed, formatted output (numbers as numbers, dates as dates, box numbers/descriptions preserved; header block fund · partner · tax year; K-1-organized layout); **review-before-export** (Theo shows the extracted table in chat to confirm/correct first; source-box + low-confidence flags); **multi-K-1 workbook** (sheet-per-K-1 or consolidated); **in-tenant** workbook build (SheetJS, the same lib B8 uses to read Excel); Blob (`theo-content`) + short-TTL read SAS → a Download card (may hand to desktop Excel via the Origin `webDavUrl`/Office-URI open). **Tool-driven** (the model calls the export tool when asked). **Stateless v1** (no `theo_*` table, no migration).
- **Deliverables.**
  - **Export-MS1 — `theo_export_spreadsheet`** (HF-T7): a `vaultgpt-func-chat` handler that accepts structured data (one or more sheets: name + headers + typed rows + optional metadata) and returns an owner-scoped, short-TTL **read SAS** download URL for the generated `.xlsx` (built server-side with SheetJS, uploaded to `theo-content` via the HF-T5 managed-identity user-delegation SAS pattern). Stateless — no schema change, no migration. Invoked as a Theo tool: the model-facing tool-manifest wiring in `theo_message` (`vaultgpt-func-premium`) is Walter-deployed (Theo premium/chat split); the handler on func-chat is Claude-deployed (DR-T7).
  - **Export-MS2 (v1.1) — workpaper-template mapping**: extract K-1 → the current-year workpaper's input columns (Theo reads the template from the DMS), so the export is paste-ready. Optional Artifacts integration (the `.xlsx` as a versioned Theo artifact).
- **Deploy target.** `vaultgpt-func-chat` only (DR-T7); `vaultgpt-func-premium` (tool-manifest wiring, Walter-deployed) and `vaultgpt-func-stream` otherwise untouched. **Frontend** (Download card + in-chat review affordance) follows as Theo-FE passes after the backend microstep lands.
- **Contracts.** Theo API Spec §2.12 (`theo_export_spreadsheet`; PROPOSED until its VEP lands DEPLOYED). Handler family: Theo Golden Handler Standard §6 HF-T7. Decision: Execution Orchestration Standard §1B DR-T9.
- **Completion gate (per microstep).** VEP Codex-APPROVED → Claude Code deploys the handler to func-chat → golden-curl-verified → Role-C updates the API Spec §2.12 row + Golden Handler §6 HF-T7 status to DEPLOYED. No `theo_*` schema change in this tier.

---

## 8. Open decisions (Walter) — Decision Register seed
```

## Edit 2 — `spec/THEO_API_SPEC.md` (insert new §2.12 after the §2.11 closing paragraph, before `## §3 Boundary`)

**Anchor (before):**
```
Both Voice I/O routes execute as the signed-in user on `vaultgpt-func-chat`; the cognitive credential is held server-side by the Function's managed identity (keyless), never reaching the browser. `theo_transcribe_audio` is **DEPLOYED** (Voice-MS1, 2026-07-17; golden-verified); `theo_synthesize_speech` is **DEPLOYED** (Voice-MS2, 2026-07-17; golden-verified). The entire Tier Voice backend (dictation + read-aloud) is DEPLOYED. No `theo_*` schema is added for either route.

## §3 Boundary
```
**After (insert the §2.12 section between that paragraph and `## §3 Boundary`):**
```
Both Voice I/O routes execute as the signed-in user on `vaultgpt-func-chat`; the cognitive credential is held server-side by the Function's managed identity (keyless), never reaching the browser. `theo_transcribe_audio` is **DEPLOYED** (Voice-MS1, 2026-07-17; golden-verified); `theo_synthesize_speech` is **DEPLOYED** (Voice-MS2, 2026-07-17; golden-verified). The entire Tier Voice backend (dictation + read-aloud) is DEPLOYED. No `theo_*` schema is added for either route.

### §2.12 Export (Tier Export) — backs Theo → downloadable Excel

| Capability | Contract | Status | Backing |
|---|---|---|---|
| export structured data → downloadable `.xlsx` | `PROPOSED` (Export-MS1): `POST /api/theo_export_spreadsheet` on `vaultgpt-func-chat`; body `{ filename?, sheets: [{ name, columns: [{ key, header, type?:'text'\|'number'\|'date' }], rows: [ { <key>: value } ] }] (1..N sheets), meta? }` → **200** `{ downloadUrl, filename, expiresAt }` (standard `{data,meta}` envelope) — the handler builds a typed/formatted workbook server-side with SheetJS (numbers/dates as real cell types; bold headers; a fund/partner/year header block; K-1-organized ordering when supplied), uploads it owner-scoped to `theo-content` (`exports/<oid>/<uuid>.xlsx`) via the HF-T5 managed-identity user-delegation write SAS, and returns a short-TTL **read** SAS download URL. Errors `{error:{code,message,status,timestamp}}`: 401 `UNAUTHORIZED`, 400 `INVALID_REQUEST`/`PAYLOAD_TOO_LARGE` (row/cell caps), 502 `UPSTREAM_ERROR`, 500. Executes as the signed-in user (EasyAuth OID). **Stateless** — no `theo_*` table, no persistence. Invoked as a Theo tool (model-facing tool-manifest wiring in `theo_message` on `vaultgpt-func-premium`, Walter-deployed). Final request/response shape is locked at the Export-MS1 VEP. | `1B-proposed` | HF-T7 spreadsheet export broker (SheetJS + Blob `theo-content`) |

The Export route executes as the signed-in user on `vaultgpt-func-chat`; the workbook is generated server-side (in-tenant SheetJS) and delivered via a short-TTL owner-scoped read SAS (bytes never persisted beyond the TTL blob). PROPOSED until the Export-MS1 VEP lands DEPLOYED. No `theo_*` schema is added.

## §3 Boundary
```

## Edit 3 — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §6 (insert HF-T7 row after the HF-T6 row)

**Anchor (before — end of the HF-T6 row):**
```
| HF-T6 | Audio gateway broker | Server-side keyless (managed-identity) broker for speech I/O: **speech-to-text** (transcribe a user-supplied audio clip → text via an in-tenant Azure OpenAI **Whisper** deployment) and **text-to-speech** (synthesize Theo response text → audio via in-tenant **Azure AI Speech** neural voices); holds the cognitive credential server-side (managed identity, keyless; scope `https://cognitiveservices.azure.com/.default`), leaks no credential/endpoint to the browser, and returns only transcript text / synthesized audio bytes. Stateless (no `theo_*` table). Deploys to `vaultgpt-func-chat` (DR-T7). | DEPLOYED 2026-07-17 (func-chat; Switzerland North) — `theo_transcribe_audio` (Whisper STT) + `theo_synthesize_speech` (Azure AI Speech TTS, custom-subdomain + plain-bearer MI); both golden-verified |
```
**After (append the HF-T7 row immediately below):**
```
| HF-T6 | Audio gateway broker | Server-side keyless (managed-identity) broker for speech I/O: **speech-to-text** (transcribe a user-supplied audio clip → text via an in-tenant Azure OpenAI **Whisper** deployment) and **text-to-speech** (synthesize Theo response text → audio via in-tenant **Azure AI Speech** neural voices); holds the cognitive credential server-side (managed identity, keyless; scope `https://cognitiveservices.azure.com/.default`), leaks no credential/endpoint to the browser, and returns only transcript text / synthesized audio bytes. Stateless (no `theo_*` table). Deploys to `vaultgpt-func-chat` (DR-T7). | DEPLOYED 2026-07-17 (func-chat; Switzerland North) — `theo_transcribe_audio` (Whisper STT) + `theo_synthesize_speech` (Azure AI Speech TTS, custom-subdomain + plain-bearer MI); both golden-verified |
| HF-T7 | Spreadsheet export broker | Server-side builder that turns structured data (typed sheets: headers + rows) into a formatted `.xlsx` in-process (SheetJS — numbers/dates as real cell types, header/section formatting), uploads it owner-scoped to Blob `theo-content` via the HF-T5 managed-identity user-delegation write-SAS pattern, and returns a short-TTL **read** SAS download URL. No credential/endpoint leaks to the browser. Stateless (no `theo_*` table). Deploys to `vaultgpt-func-chat` (DR-T7). | PROPOSED (Tier Export; `theo_export_spreadsheet`; authored at Export-MS1) |
```

## Edit 4 — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1B (insert DR-T9 row after the DR-T8 row)

**Anchor (before — end of the DR-T8 row):**
```
| DR-T8 | **In-tenant Voice I/O** (Walter-directed 2026-07-17): Theo gains speech-to-text (dictation) and text-to-speech (read-aloud) via a keyless managed-identity **audio gateway broker** (Golden Handler HF-T6) to in-tenant Azure Cognitive Services — Azure OpenAI **Whisper** (STT) and **Azure AI Speech** neural voices (TTS). No third-party voice service; no client audio leaves the tenant; distinct from the Anthropic-hosted Claude *text* model (architecture §2.4). Deploys to `vaultgpt-func-chat` (DR-T7); stateless (no `theo_*` table, no migration). | `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Voice; Golden Handler Standard §6 HF-T6 |
```
**After (append the DR-T9 row immediately below):**
```
| DR-T8 | **In-tenant Voice I/O** (Walter-directed 2026-07-17): Theo gains speech-to-text (dictation) and text-to-speech (read-aloud) via a keyless managed-identity **audio gateway broker** (Golden Handler HF-T6) to in-tenant Azure Cognitive Services — Azure OpenAI **Whisper** (STT) and **Azure AI Speech** neural voices (TTS). No third-party voice service; no client audio leaves the tenant; distinct from the Anthropic-hosted Claude *text* model (architecture §2.4). Deploys to `vaultgpt-func-chat` (DR-T7); stateless (no `theo_*` table, no migration). | `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Voice; Golden Handler Standard §6 HF-T6 |
| DR-T9 | **Theo → downloadable Excel** (Walter-directed 2026-07-17): Theo emits a typed/formatted `.xlsx` from data it extracts (first use case: prior-year K-1 → current-year workpaper input), built **in-tenant** with SheetJS via a **spreadsheet export broker** (Golden Handler HF-T7), delivered as a short-TTL owner-scoped read-SAS download. Tool-driven (the model calls it on request), with a review-before-export step (accuracy-first). Deploys to `vaultgpt-func-chat` (DR-T7); stateless (no `theo_*` table, no migration); the model-facing tool-manifest wiring in `theo_message` (`vaultgpt-func-premium`) is Walter-deployed. v1.1 adds workpaper-template mapping. | `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Export; Golden Handler Standard §6 HF-T7; API Spec §2.12 |
```

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-Backend-Tier-Export-Amendment-Role-C/INDEX.md" --repo-root .` — expect PASS.

## Requested action
Codex Pass-2 review of this Role-C plan amendment. On APPROVED, the four edits land (Pass-4 inline) and Export-MS1 (`theo_export_spreadsheet`) is authored as a backend VEP against the amended plan.
