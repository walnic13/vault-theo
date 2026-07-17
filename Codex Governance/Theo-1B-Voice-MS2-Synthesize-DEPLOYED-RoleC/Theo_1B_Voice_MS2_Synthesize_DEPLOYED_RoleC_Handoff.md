# Theo 1B — Voice-MS2 `theo_synthesize_speech` DEPLOYED: Role-C Verbatim-Edit Handoff (Pass 4)

Records DEPLOYED + golden-verified reality for **Voice-MS2** (`theo_synthesize_speech`, Codex-APPROVED VEP at `f6e827d`, deployed to `vaultgpt-func-chat` 2026-07-17). Flips the Theo API Spec §2.11 synthesize row + its summary, the Golden Handler §6 HF-T6 status (→ fully DEPLOYED), and the Phase 1B Plan Voice-MS2 bullet. **Codex executes verbatim; Claude Code authors only.** No contract behavior change — documents already-deployed reality. **With this landing, the entire Tier Voice backend (dictation + read-aloud) is DEPLOYED.**

**Deployed facts (this turn, post-APPROVAL):** app settings `THEO_TTS_ENDPOINT=https://wmans-mqxwlcdp-switzerlandnorth.cognitiveservices.azure.com` (custom subdomain) + `THEO_TTS_DEFAULT_VOICE=en-US-AvaMultilingualNeural` set; `THEO_TTS_RESOURCE_ID` removed (plain-bearer auth, no `aad#`); handler deployed via Kudu VFS (GET-back byte-identical); no new MI role, no model deploy (func-chat MI already `Cognitive Services User` on the resource). **Golden curls:** unauth → 401; OPTIONS → 204; missing/empty `text` & unsupported `voice` → 400; happy-path → **200** `{ data: { audio_base64, content_type:"audio/mpeg", voice:"en-US-AvaMultilingualNeural" } }` (24 KB MP3, `fff364` frame header); `voice` override `en-GB-SoniaNeural` → **200**.

## Grounding Conformance Receipt

Role: Claude Code (Role-C authoring)
Turn Type: Documentation-update package (Role-C Verbatim-Edit Handoff)
Turn issued against HEAD: `f6e827dc71cef01848bfca02c1bfd7a5ec8c6027` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Targeted grounding is authorized for a documentation-update package by Conformance §4 (Claude Code | Documentation-update package → Targeted Current-Turn Grounding).

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.11 synthesize row + summary — edit target) | `Grep(pattern="synthesize response text → speech audio", path=spec/THEO_API_SPEC.md)` this turn | `cc3988e2c58567eafd39273203cec5c8afd49035` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§6 HF-T6 status — edit target) | `Grep(pattern="PARTIAL — .theo_transcribe_audio. DEPLOYED", path=governance/THEO_GOLDEN_HANDLER_STANDARD.md)` this turn | `4cadb2813a72b0ee83e38b72dce925ffe626621b` |
| 3 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Voice-MS2 bullet — edit target) | `Grep(pattern="Voice-MS2 — .theo_synthesize_speech.", path=governance/THEO_PHASE_1B_BACKEND_PLAN.md)` this turn | `cbd0246ef8b3d5c85cde7740764908ab39aacc9e` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `Read(governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md)` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 5 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 doc-update turn-type; §4C Pass 4) | `Read(governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 6 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C verbatim execution) | `Read(governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit)" |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4C | "Role-C documentation-update pass" |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim** (exact before/after text)" |
| spec/THEO_API_SPEC.md | §2.11 | "synthesize response text → speech audio (read-aloud)" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 | "Audio gateway broker" |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §7 | "Tier Voice — Voice I/O: dictation + read-aloud" |

---

## EDIT 1 — flip the §2.11 synthesize row to DEPLOYED (`spec/THEO_API_SPEC.md`)

### BEFORE (verbatim; found EXACTLY ONCE)

```
| synthesize response text → speech audio (read-aloud) | `1B-PROPOSED` — `POST /api/theo_synthesize_speech` on `vaultgpt-func-chat`: proposed body `{ text, voice? }` → synthesized audio (proposed `{ audio_base64, content_type }` or an `audio/mpeg` stream). The handler brokers to in-tenant **Azure AI Speech** neural voices with the Function's **managed identity** (keyless), default voice = an Azure neural HD voice; no third-party TTS, no audio leaves the tenant. Executes as the signed-in user. **Stateless** — no `theo_*` table, no persistence. Field shapes (default voice, streaming vs. buffered delivery) are finalized in the read-aloud VEP. | HF-T6 audio gateway broker (Azure AI Speech) |
```

### AFTER

```
| synthesize response text → speech audio (read-aloud) | `1B-deployed` — **DEPLOYED 2026-07-17** (Voice-MS2; golden-verified: unauth → 401, OPTIONS → 204, missing/empty `text` & unsupported `voice` → 400, over-cap → 400, happy-path → **200** `{ data: { audio_base64, content_type:"audio/mpeg", voice } }` — default `en-US-AvaMultilingualNeural` 24 KB MP3, and `voice` override `en-GB-SoniaNeural` also 200): `POST /api/theo_synthesize_speech` on `vaultgpt-func-chat`; body `{ text (non-empty, ≤ `THEO_TTS_MAX_CHARS`, default 8000), voice? (∈ a curated allow-list of 6 premium neural voices) }` → **200** `{ audio_base64, content_type:"audio/mpeg", voice }` (standard `{data,meta}` envelope). Errors: 401 `UNAUTHORIZED`, 400 `BAD_REQUEST`/`INVALID_REQUEST`/`PAYLOAD_TOO_LARGE`, 502 `UPSTREAM_ERROR`, 500. The handler XML-escapes the text into SSML and brokers to in-tenant **Azure AI Speech** neural voices at the resource's **custom-subdomain** `/tts/cognitiveservices/v1` with the Function's **managed identity** (keyless, plain `Authorization: Bearer` — the same auth pattern the Whisper sibling uses; the regional `aad#` form 401s the MI); default voice `en-US-AvaMultilingualNeural`. Executes as the signed-in user. **Stateless** — no `theo_*` table, no persistence. v1 exposes only the default voice (no FE picker); the backend accepts the optional `voice` override, so a picker is later a FE-only change. | HF-T6 audio gateway broker (Azure AI Speech) |
```

---

## EDIT 2 — update the §2.11 summary paragraph (`spec/THEO_API_SPEC.md`)

### BEFORE (verbatim; found EXACTLY ONCE)

```
Both Voice I/O routes execute as the signed-in user on `vaultgpt-func-chat`; the cognitive credential is held server-side by the Function's managed identity (keyless), never reaching the browser. `theo_transcribe_audio` is **DEPLOYED** (Voice-MS1, 2026-07-17; golden-verified); `theo_synthesize_speech` remains **PROPOSED** — its deployed contract (field shapes, status codes, default voice) is finalized by the Voice-MS2 VEP (Pass 1 → Codex Pass 2 → Pass 3 deploy + provisioning → Role-C to `1B-deployed`). No `theo_*` schema is added for either route.
```

### AFTER

```
Both Voice I/O routes execute as the signed-in user on `vaultgpt-func-chat`; the cognitive credential is held server-side by the Function's managed identity (keyless), never reaching the browser. `theo_transcribe_audio` is **DEPLOYED** (Voice-MS1, 2026-07-17; golden-verified); `theo_synthesize_speech` is **DEPLOYED** (Voice-MS2, 2026-07-17; golden-verified). The entire Tier Voice backend (dictation + read-aloud) is DEPLOYED. No `theo_*` schema is added for either route.
```

---

## EDIT 3 — flip the HF-T6 status cell to fully DEPLOYED (`governance/THEO_GOLDEN_HANDLER_STANDARD.md` §6)

### BEFORE (verbatim; found EXACTLY ONCE — the status cell)

```
| PARTIAL — `theo_transcribe_audio` DEPLOYED 2026-07-17 (func-chat; Whisper, Switzerland North); `theo_synthesize_speech` PROPOSED (Voice-MS2) |
```

### AFTER

```
| DEPLOYED 2026-07-17 (func-chat; Switzerland North) — `theo_transcribe_audio` (Whisper STT) + `theo_synthesize_speech` (Azure AI Speech TTS, custom-subdomain + plain-bearer MI); both golden-verified |
```

---

## EDIT 4 — mark Voice-MS2 DEPLOYED in the plan tier (`governance/THEO_PHASE_1B_BACKEND_PLAN.md` §7)

### BEFORE (verbatim; found EXACTLY ONCE)

```
  - **Voice-MS2 — `theo_synthesize_speech`** (HF-T6): a `vaultgpt-func-chat` handler that accepts response text and returns synthesized audio from in-tenant Azure AI Speech neural voices. Provisioning (post-APPROVAL): confirm the func-chat managed identity's Cognitive Services Speech data role. Stateless — no schema change, no migration.
```

### AFTER

```
  - **Voice-MS2 — `theo_synthesize_speech`** (HF-T6): a `vaultgpt-func-chat` handler that accepts response text and returns synthesized audio from in-tenant Azure AI Speech neural voices. Provisioning (post-APPROVAL): confirm the func-chat managed identity's Cognitive Services Speech data role. Stateless — no schema change, no migration. ✅ **DEPLOYED 2026-07-17** (VEP `f6e827d`, Codex-APPROVED; custom-subdomain `/tts/cognitiveservices/v1` + plain-bearer MI auth — same as the Whisper sibling; default voice `en-US-AvaMultilingualNeural`, optional curated `voice` override; golden-verified: 401/204/400/200 MP3, default + `en-GB-SoniaNeural`). **Tier Voice backend COMPLETE (MS1 + MS2 deployed); FE passes next.**
```

---

## Notes

- Documentation-only Role-C landing recording DEPLOYED + golden-verified reality; no contract behavior changes. Speech auth uses the resource **custom-subdomain** + plain `Bearer` MI token (the Whisper-sibling pattern); the regional `tts.speech.microsoft.com` + `aad#` form 401s the managed identity (Pass-3 finding). No new MI role and no model deployment were required.
- No Schema Role-C: Voice-MS2 is stateless; `spec/THEO_AZURE_POSTGRES_SCHEMA.md` is unchanged.
- After this lands, both §2.11 Voice routes are DEPLOYED and the FE voice passes (composer mic dictation + per-message read-aloud) may cite them. Voice selection is a later FE-only change (backend already accepts the `voice` override).

## Codex activation note

Open your Role-C turn with a governance-bound GCR + Rule Anchor Table (Conformance §3–§5; Codex Review §4). Then apply EDIT 1–4 **verbatim**: locate each found-once BEFORE anchor and replace with the AFTER text. Edit only `spec/THEO_API_SPEC.md`, `governance/THEO_GOLDEN_HANDLER_STANDARD.md`, and `governance/THEO_PHASE_1B_BACKEND_PLAN.md`; make no substantive additions of your own. **HALT** and report if any BEFORE anchor is not found exactly once. Verdict is APPROVED or REJECTED only.
