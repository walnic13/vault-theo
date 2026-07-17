# Theo 1B — Voice-MS1 `theo_transcribe_audio` DEPLOYED: Role-C Verbatim-Edit Handoff (Pass 4)

Records DEPLOYED + golden-verified reality for **Voice-MS1** (`theo_transcribe_audio`, Codex-APPROVED VEP at `d266866`, deployed to `vaultgpt-func-chat` 2026-07-17). Flips the Theo API Spec §2.11 transcribe row + its summary, the Golden Handler §6 HF-T6 status, and the Phase 1B Plan Voice-MS1 bullet from PROPOSED to DEPLOYED. **Codex executes verbatim; Claude Code authors only.** No contract behavior change — it documents the already-deployed reality.

**Deployed facts (this turn, post-APPROVAL, az authority granted 2026-07-17):** Whisper (`001`, Standard) deployed on the in-tenant **Switzerland North** AI-Services resource `wmans-mqxwlcdp-switzerlandnorth` (UK South offers no deployable whisper SKU — Gap G-ENDPOINT-RESOURCE provisioning latitude); the `vaultgpt-func-chat` managed identity (`5a0cf3c6-07c9-4412-aa50-e39987ae3bfb`) granted `Cognitive Services User` on that resource; app settings `THEO_AOAI_AUDIO_ENDPOINT` / `THEO_WHISPER_DEPLOYMENT=whisper` / `THEO_AOAI_AUDIO_API_VERSION=2024-06-01` set; handler deployed via Kudu VFS (GET-back byte-identical). **Golden curls:** unauth → 401; OPTIONS → 204; bad `content_type` → 400 `UNSUPPORTED_MEDIA_TYPE`; missing / empty `audio_base64` → 400 `INVALID_REQUEST`; happy-path (2 s WAV) → **200** `{ data: { text: "Beep." } }`.

## Grounding Conformance Receipt

Role: Claude Code (Role-C authoring)
Turn Type: Documentation-update package (Role-C Verbatim-Edit Handoff)
Turn issued against HEAD: `d266866881c3efae4591fd4f8d8521cb15111616` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Targeted grounding is authorized for a documentation-update package by Conformance §4 (Claude Code | Documentation-update package → Targeted Current-Turn Grounding).

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.11 Voice I/O rows — edit target) | `Grep(pattern="transcribe an audio clip", path=spec/THEO_API_SPEC.md)` this turn | `a91542c853efa11887dd5abd2673f7081c4ff5cc` |
| 2 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§6 HF-T6 status — edit target) | `Grep(pattern="PROPOSED \\(Voice I/O tier", path=governance/THEO_GOLDEN_HANDLER_STANDARD.md)` this turn | `eb7c54e8b2d7300ec0786c1bd5ca66e71973dcdd` |
| 3 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier Voice, Voice-MS1 bullet — edit target) | `Grep(pattern="returns the transcript from the in-tenant Whisper", path=governance/THEO_PHASE_1B_BACKEND_PLAN.md)` this turn | `00358d1fc2b112938f3f00ce42c20d2419168311` |
| 4 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff) | `Read(governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md)` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 5 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 doc-update turn-type; §4C Pass 4) | `Read(governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 6 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C verbatim execution) | `Read(governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit)" |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4C | "Role-C documentation-update pass" |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim** (exact before/after text)" |
| spec/THEO_API_SPEC.md | §2.11 | "Voice I/O (Tier Voice)" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 | "Audio gateway broker" |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §7 | "Tier Voice — Voice I/O: dictation + read-aloud" |

---

## EDIT 1 — flip the §2.11 transcribe row to DEPLOYED (`spec/THEO_API_SPEC.md`)

### BEFORE (verbatim; found EXACTLY ONCE)

```
| transcribe an audio clip → text (dictation) | `1B-PROPOSED` — `POST /api/theo_transcribe_audio` on `vaultgpt-func-chat`: a short audio clip in (proposed body `{ audio_base64, content_type }`, `content_type` ∈ a closed audio allow-list, e.g. `audio/webm|audio/mp4|audio/mpeg|audio/wav|audio/ogg`, enforced per-clip byte cap) → `{ text }`. The handler base64-decodes and brokers to an in-tenant Azure OpenAI **Whisper** deployment (`/audio/transcriptions`) with the Function's **managed identity** (keyless; scope `https://cognitiveservices.azure.com/.default`), returning only the transcript. Executes as the signed-in user (EasyAuth `x-ms-client-principal` → OID). **Stateless** — no `theo_*` table, no persistence. Field shapes (inline body vs. reuse of the B8 upload SAS for larger clips) are finalized in the voice-input VEP. | HF-T6 audio gateway broker (Whisper) |
```

### AFTER

```
| transcribe an audio clip → text (dictation) | `1B-deployed` — **DEPLOYED 2026-07-17** (Voice-MS1; golden-verified: unauth → 401, OPTIONS → 204, bad `content_type` / missing / empty `audio_base64` → 400, happy-path 2 s WAV → **200** `{ data: { text } }`): `POST /api/theo_transcribe_audio` on `vaultgpt-func-chat`; body `{ audio_base64, content_type }` (`content_type` ∈ `audio/webm|audio/ogg|audio/mp4|audio/mpeg|audio/wav|audio/x-wav`; decoded-byte cap `THEO_TRANSCRIBE_MAX_BYTES`, default 8 MB) → **200** `{ text }` (standard `{data,meta}` envelope). Error envelope `{error:{code,message,status,timestamp}}`: 401 `UNAUTHORIZED`, 400 `BAD_REQUEST` / `UNSUPPORTED_MEDIA_TYPE` / `INVALID_REQUEST` / `PAYLOAD_TOO_LARGE`, 502 `UPSTREAM_ERROR`, 500 `INTERNAL_SERVER_ERROR`. The handler base64-decodes and brokers to the in-tenant Azure OpenAI **Whisper** deployment (`/audio/transcriptions`; resource `wmans-mqxwlcdp-switzerlandnorth`, **Switzerland North**, deployment `whisper`, api-version `2024-06-01`) with the Function's **managed identity** (keyless, `Cognitive Services User`), returning only the transcript. Executes as the signed-in user (EasyAuth `x-ms-client-principal` → OID). **Stateless** — no `theo_*` table, no persistence. | HF-T6 audio gateway broker (Whisper) |
```

---

## EDIT 2 — update the §2.11 summary paragraph (`spec/THEO_API_SPEC.md`)

### BEFORE (verbatim; found EXACTLY ONCE)

```
Both Voice I/O routes execute as the signed-in user on `vaultgpt-func-chat`; the cognitive credential is held server-side by the Function's managed identity (keyless), never reaching the browser. Both are **PROPOSED** — the deployed contract (request/response field shapes, status codes, caps, default voice) is finalized by the per-microstep Voice VEPs (Pass 1 → Codex Pass 2 → Pass 3 deploy + provisioning → Role-C to `1B-deployed`). No `theo_*` schema is added for either route.
```

### AFTER

```
Both Voice I/O routes execute as the signed-in user on `vaultgpt-func-chat`; the cognitive credential is held server-side by the Function's managed identity (keyless), never reaching the browser. `theo_transcribe_audio` is **DEPLOYED** (Voice-MS1, 2026-07-17; golden-verified); `theo_synthesize_speech` remains **PROPOSED** — its deployed contract (field shapes, status codes, default voice) is finalized by the Voice-MS2 VEP (Pass 1 → Codex Pass 2 → Pass 3 deploy + provisioning → Role-C to `1B-deployed`). No `theo_*` schema is added for either route.
```

---

## EDIT 3 — flip the HF-T6 status cell (`governance/THEO_GOLDEN_HANDLER_STANDARD.md` §6)

### BEFORE (verbatim; found EXACTLY ONCE)

```
| PROPOSED (Voice I/O tier; authored in the Voice VEPs) |
```

### AFTER

```
| PARTIAL — `theo_transcribe_audio` DEPLOYED 2026-07-17 (func-chat; Whisper, Switzerland North); `theo_synthesize_speech` PROPOSED (Voice-MS2) |
```

---

## EDIT 4 — mark Voice-MS1 DEPLOYED in the plan tier (`governance/THEO_PHASE_1B_BACKEND_PLAN.md` §7)

### BEFORE (verbatim; found EXACTLY ONCE)

```
  - **Voice-MS1 — `theo_transcribe_audio`** (HF-T6): a `vaultgpt-func-chat` handler that accepts a short audio clip and returns the transcript from the in-tenant Whisper deployment. Provisioning (executed **only after** Codex APPROVAL): deploy the `whisper` model + confirm the func-chat managed identity's Cognitive Services data role. Stateless — no schema change, no migration.
```

### AFTER

```
  - **Voice-MS1 — `theo_transcribe_audio`** (HF-T6): a `vaultgpt-func-chat` handler that accepts a short audio clip and returns the transcript from the in-tenant Whisper deployment. Provisioning (executed **only after** Codex APPROVAL): deploy the `whisper` model + confirm the func-chat managed identity's Cognitive Services data role. Stateless — no schema change, no migration. ✅ **DEPLOYED 2026-07-17** (VEP `d266866`, Codex-APPROVED; Whisper `001` on Switzerland North `wmans-mqxwlcdp-switzerlandnorth`; func-chat MI `Cognitive Services User`; golden-verified: 401/204/400×3/200 `{text}`).
```

---

## Notes

- Documentation-only Role-C landing recording DEPLOYED + golden-verified reality; no contract behavior changes. Whisper's in-tenant home is **Switzerland North** (not UK South — UK South lists whisper but offers no deployable SKU); the VEP's Gap G-ENDPOINT-RESOURCE anticipated the resource as a provisioning-time choice, and the handler is resource-agnostic (endpoint via `THEO_AOAI_AUDIO_ENDPOINT`).
- No Schema Role-C: Voice-MS1 is stateless; `spec/THEO_AZURE_POSTGRES_SCHEMA.md` is unchanged.
- After this lands, the FE voice-input pass (composer mic control) may cite the DEPLOYED §2.11 `theo_transcribe_audio` route.

## Codex activation note

Open your Role-C turn with a governance-bound GCR + Rule Anchor Table (Conformance §3–§5; Codex Review §4). Then apply EDIT 1–4 **verbatim**: locate each found-once BEFORE anchor and replace it with the AFTER text. Edit only `spec/THEO_API_SPEC.md`, `governance/THEO_GOLDEN_HANDLER_STANDARD.md`, and `governance/THEO_PHASE_1B_BACKEND_PLAN.md`; make no substantive additions of your own. **HALT** and report if any BEFORE anchor is not found exactly once. Verdict is APPROVED or REJECTED only.
