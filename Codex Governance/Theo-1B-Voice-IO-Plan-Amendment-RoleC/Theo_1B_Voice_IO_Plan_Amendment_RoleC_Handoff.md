# Theo 1B — Voice I/O: Plan-Amendment Role-C Verbatim-Edit Handoff (Pass 4)

Gives the Walter-directed (2026-07-17) **Voice I/O** feature a governed home so its per-microstep VEPs have a Phase-1B-Plan feature entry to identify against (Conformance §4A.1 P1) and can declare the audio broker greenfield against a registered API-Spec surface. **Four verbatim edits, four target docs, zero behavior change** — this is a *planning* amendment: it adds a new tier (PROPOSED), two PROPOSED API-Spec contract rows, one Golden-Handler family row (HF-T6, PROPOSED), and one Decision-Register entry (DR-T8). No handler, no schema, no migration lands here. **Codex executes the edits verbatim; Claude Code authors only.**

## Grounding Conformance Receipt

Role: Claude Code (Role-C authoring)
Turn Type: Documentation-update package (Role-C Verbatim-Edit Handoff)
Turn issued against HEAD: `27ff1373cd5ec985e073b827f4a36a7c4d8c460f` (vault-theo, `development`)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 4
Sub-phase Track: N/A

Targeted grounding is authorized for a documentation-update package by Conformance §4 (Claude Code | Documentation-update package → Targeted Current-Turn Grounding). This turn edits four governed docs (Theo Phase 1B Backend Plan, Theo API Spec, Theo Golden Handler Standard, Theo Execution Orchestration Standard); each is read this turn and carried as a GCR row.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 tier list — edit target; §4 HF families; §10 microstep cadence) | `Read(governance/THEO_PHASE_1B_BACKEND_PLAN.md)` this turn | `b1d38efbaef112dcec0fccf93d7eacada99e948e` |
| 2 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2 conventions/status labels; §2.10 house style; §3 Boundary — insertion point) | `Read(spec/THEO_API_SPEC.md)` this turn | `36bdb2ebd8db37e5395cb6c7851955042512c118` |
| 3 | Theo Golden Handler Standard — `governance/THEO_GOLDEN_HANDLER_STANDARD.md` (§6 Handler Family Registry + append rule — edit target) | `Read(governance/THEO_GOLDEN_HANDLER_STANDARD.md)` this turn | `865afc9fab567fd2ace06f4c26b9ee0203be38b8` |
| 4 | Theo Execution Orchestration Standard — `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` (§1B Decision Register + append rule — edit target; §1E/DR-T7 func-chat deploy authority) | `Read(governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md)` this turn | `5f950e6e4b628357c3f1ff7d1e8a5795f470aa9d` |
| 5 | Claude Code Theo Backend Governor Standard — `governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md` (§11 Verbatim-Edit Handoff / Pending Role-C — authorizes this handoff shape) | `Read(governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md)` this turn | `ddfb4ae112ac204b28fdc64c200538cb0bc15658` |
| 6 | Theo Grounding Conformance Standard — `governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md` (§4 Documentation-update turn-type; §4C Pass 4 Role-C) | `Read(governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md)` this turn | `7c0d902bdff3b6c0af475b483e31ed796214e57b` |
| 7 | Codex Theo Backend Review Standard — `governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md` (§4 Role-C Inline Execution — verbatim edit discipline) | `Read(governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md)` this turn | `d2e1b9881b6e2ed7d77921a055feffb0852257fd` |
| 8 | Theo Architecture and Structure — `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (§2.4 carried constraints — Foundry-Claude inference locus, supports the DR-T8 in-tenant distinction) | `Read(governance/THEO_ARCHITECTURE_AND_STRUCTURE.md)` this turn | `07451ce9d912830b3c15fedf74761d00c59f97b2` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/CLAUDE_CODE_THEO_BACKEND_GOVERNOR_STANDARD.md | §11 | "emits a Role-C Verbatim-Edit Handoff (exact before/after text for each edit)" |
| governance/THEO_GROUNDING_CONFORMANCE_STANDARD.md | §4C | "Role-C documentation-update pass" |
| governance/CODEX_THEO_BACKEND_REVIEW_STANDARD.md | §4 | "Codex executes the directed edits **verbatim** (exact before/after text)" |
| governance/THEO_GOLDEN_HANDLER_STANDARD.md | §6 | "new families are added with a monotonically increasing `HF-Tn` id by a Walter-approved Role-C landing" |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §Status | "It is a *living* plan: each backend microstep updates the three Theo backend authority docs" |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | §7 | "VEP Codex-APPROVED → Implementation Package" |
| spec/THEO_API_SPEC.md | §1 | "Route naming: `theo_<operation>_<entity>`" |
| spec/THEO_API_SPEC.md | §2.10 | "is the VC-1.2 fast-follow." |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1B | "New entries require Walter approval + a Role-C landing." |
| governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md | §1E | "Walter-granted 2026-07-04." |
| governance/THEO_ARCHITECTURE_AND_STRUCTURE.md | §2.4 | "Foundry-Claude inference runs on Anthropic-hosted infrastructure, not Azure-tenant-native" |

> Section-number note: this amendment adds a **new** tier ("Tier Voice") to the Phase 1B Backend Plan §7, a new subsection **§2.11** to the Theo API Spec, a new row **HF-T6** to the Golden Handler Standard §6 registry, and a new row **DR-T8** to the Execution Orchestration Standard §1B Decision Register. Each is a pure insertion after a found-exactly-once anchor line; no existing text is modified or removed.

---

## EDIT 1 — append the `HF-T6` family row to `governance/THEO_GOLDEN_HANDLER_STANDARD.md` §6

Target file: `governance/THEO_GOLDEN_HANDLER_STANDARD.md`, section §6 (Handler Family Registry), the `| HF-id | Family | Scope | Status |` table. Insert **one new table row** immediately after the existing `HF-T5` row (the last row of the table, before the blank line that precedes the "Append rule:" paragraph). House style mirrored from the sibling rows.

### BEFORE (verbatim; found EXACTLY ONCE — the `HF-T5` row)

```
| HF-T5 | Blob upload SAS broker | Server-side issuance of short-lived, single-blob, owner-scoped managed-identity **user-delegation** write SAS for direct-to-Blob upload into `theo-content`, plus managed-identity data-plane blob HEAD (actual size/type) and DELETE (reclaim); no `@azure/storage-blob` dependency (managed-identity token → user delegation key → manually-signed SAS) | DEPLOYED 2026-06-29 (B8b; `theo_create_attachment_upload`; the blob-side of `theo_finalize_attachment` / `theo_delete_attachment`) |
```

### AFTER (the same anchor row, immediately followed by the new `HF-T6` row on the next line)

```
| HF-T5 | Blob upload SAS broker | Server-side issuance of short-lived, single-blob, owner-scoped managed-identity **user-delegation** write SAS for direct-to-Blob upload into `theo-content`, plus managed-identity data-plane blob HEAD (actual size/type) and DELETE (reclaim); no `@azure/storage-blob` dependency (managed-identity token → user delegation key → manually-signed SAS) | DEPLOYED 2026-06-29 (B8b; `theo_create_attachment_upload`; the blob-side of `theo_finalize_attachment` / `theo_delete_attachment`) |
| HF-T6 | Audio gateway broker | Server-side keyless (managed-identity) broker for speech I/O: **speech-to-text** (transcribe a user-supplied audio clip → text via an in-tenant Azure OpenAI **Whisper** deployment) and **text-to-speech** (synthesize Theo response text → audio via in-tenant **Azure AI Speech** neural voices); holds the cognitive credential server-side (managed identity, keyless; scope `https://cognitiveservices.azure.com/.default`), leaks no credential/endpoint to the browser, and returns only transcript text / synthesized audio bytes. Stateless (no `theo_*` table). Deploys to `vaultgpt-func-chat` (DR-T7). | PROPOSED (Voice I/O tier; authored in the Voice VEPs) |
```

---

## EDIT 2 — insert §2.11 into `spec/THEO_API_SPEC.md` (after §2.10, before §3 Boundary)

Target file: `spec/THEO_API_SPEC.md`. Insert a **new `### §2.11` subsection** between the closing summary paragraph of §2.10 and the `## §3 Boundary` heading. The insertion anchors on the last sentence of the §2.10 summary paragraph (found exactly once); the new subsection is appended after it (preceded by one blank line).

### BEFORE (verbatim; found EXACTLY ONCE — the tail of the §2.10 summary paragraph)

```
Post-hoc channel membership editing (`theo_chat_add_member` / `theo_chat_remove_member`) is the VC-1.2 fast-follow.
```

### AFTER (the same anchor sentence, then the new §2.11 subsection)

```
Post-hoc channel membership editing (`theo_chat_add_member` / `theo_chat_remove_member`) is the VC-1.2 fast-follow.

### §2.11 Voice I/O (Tier Voice) — backs dictation input + read-aloud output
| Contract | Status | Backing |
|----------|--------|---------|
| transcribe an audio clip → text (dictation) | `1B-PROPOSED` — `POST /api/theo_transcribe_audio` on `vaultgpt-func-chat`: a short audio clip in (proposed body `{ audio_base64, content_type }`, `content_type` ∈ a closed audio allow-list, e.g. `audio/webm|audio/mp4|audio/mpeg|audio/wav|audio/ogg`, enforced per-clip byte cap) → `{ text }`. The handler base64-decodes and brokers to an in-tenant Azure OpenAI **Whisper** deployment (`/audio/transcriptions`) with the Function's **managed identity** (keyless; scope `https://cognitiveservices.azure.com/.default`), returning only the transcript. Executes as the signed-in user (EasyAuth `x-ms-client-principal` → OID). **Stateless** — no `theo_*` table, no persistence. Field shapes (inline body vs. reuse of the B8 upload SAS for larger clips) are finalized in the voice-input VEP. | HF-T6 audio gateway broker (Whisper) |
| synthesize response text → speech audio (read-aloud) | `1B-PROPOSED` — `POST /api/theo_synthesize_speech` on `vaultgpt-func-chat`: proposed body `{ text, voice? }` → synthesized audio (proposed `{ audio_base64, content_type }` or an `audio/mpeg` stream). The handler brokers to in-tenant **Azure AI Speech** neural voices with the Function's **managed identity** (keyless), default voice = an Azure neural HD voice; no third-party TTS, no audio leaves the tenant. Executes as the signed-in user. **Stateless** — no `theo_*` table, no persistence. Field shapes (default voice, streaming vs. buffered delivery) are finalized in the read-aloud VEP. | HF-T6 audio gateway broker (Azure AI Speech) |

Both Voice I/O routes execute as the signed-in user on `vaultgpt-func-chat`; the cognitive credential is held server-side by the Function's managed identity (keyless), never reaching the browser. Both are **PROPOSED** — the deployed contract (request/response field shapes, status codes, caps, default voice) is finalized by the per-microstep Voice VEPs (Pass 1 → Codex Pass 2 → Pass 3 deploy + provisioning → Role-C to `1B-deployed`). No `theo_*` schema is added for either route.
```

---

## EDIT 3 — add "Tier Voice" to `governance/THEO_PHASE_1B_BACKEND_PLAN.md` §7 (after the Tier B8 completion bullet)

Target file: `governance/THEO_PHASE_1B_BACKEND_PLAN.md`, section §7 (Execution sequence). Insert a **new tier subsection** immediately after the Tier B8 `Completion` bullet (which ends "…See the streaming assessment."), before the `---` that closes §7. The insertion anchors on the found-exactly-once tail of that bullet.

### BEFORE (verbatim; found EXACTLY ONCE — the tail of the Tier B8 Completion bullet)

```
**B9 backend DEPLOYED + golden-verified (2026-06-30)** through Easy-Auth; **B9-FE** (live tokens + rotating status words + collapsible Thinking panel, Foundry `thinking_delta` passthrough verified) in Codex review. See the streaming assessment.
```

### AFTER (the same anchor sentence, then the new Tier Voice subsection)

```
**B9 backend DEPLOYED + golden-verified (2026-06-30)** through Easy-Auth; **B9-FE** (live tokens + rotating status words + collapsible Thinking panel, Foundry `thinking_delta` passthrough verified) in Codex review. See the streaming assessment.

### Tier Voice — Voice I/O: dictation + read-aloud (PROPOSED — Walter-directed 2026-07-17)
- **Purpose.** Give Theo the two voice capabilities employees have requested, matching the Claude-app experience but **fully in-tenant**: **tap / press-and-hold dictation** (speak a message instead of typing) and **read-aloud** of Theo's responses in natural neural voices. No third-party voice service; no client audio leaves the Vault tenant.
- **In-tenant posture (DR-T8).** Unlike the Claude *text* model (Anthropic-hosted, Sweden Central — Architecture §2.4 / §11 of this plan), the audio models are true in-tenant Azure Cognitive Services and can run in-region: **Whisper** (Azure OpenAI — speech-to-text) and **Azure AI Speech** neural voices (text-to-speech). Both are reached keyless with the Function's managed identity (scope `https://cognitiveservices.azure.com/.default`), mirroring the existing embeddings / SAS-broker managed-identity pattern.
- **Deliverables (two microsteps, one tier).**
  - **Voice-MS1 — `theo_transcribe_audio`** (HF-T6): a `vaultgpt-func-chat` handler that accepts a short audio clip and returns the transcript from the in-tenant Whisper deployment. Provisioning (executed **only after** Codex APPROVAL): deploy the `whisper` model + confirm the func-chat managed identity's Cognitive Services data role. Stateless — no schema change, no migration.
  - **Voice-MS2 — `theo_synthesize_speech`** (HF-T6): a `vaultgpt-func-chat` handler that accepts response text and returns synthesized audio from in-tenant Azure AI Speech neural voices. Provisioning (post-APPROVAL): confirm the func-chat managed identity's Cognitive Services Speech data role. Stateless — no schema change, no migration.
- **Deploy target.** `vaultgpt-func-chat` only (DR-T7 scoped deployment exception); the monolith `vaultgpt-func-premium` and streaming sidecar `vaultgpt-func-stream` are untouched. **Frontend** (composer mic dictation control + per-message read-aloud control) follows as Theo-FE passes under the frontend regime after each backend microstep lands.
- **Contracts.** Theo API Spec §2.11 (`theo_transcribe_audio`, `theo_synthesize_speech`; both PROPOSED until their VEPs land DEPLOYED). Handler family: Theo Golden Handler Standard §6 HF-T6. Decision: Execution Orchestration Standard §1B DR-T8.
- **Completion gate (per microstep).** VEP Codex-APPROVED → Claude Code provisions (model deploy / MI role) + deploys to func-chat → golden-curl-verified → Role-C updates the API Spec §2.11 row + the Golden Handler §6 HF-T6 status to DEPLOYED. No `theo_*` schema change in this tier.
```

---

## EDIT 4 — append the `DR-T8` row to `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1B

Target file: `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md`, section §1B (Theo Architecture Decision Register), the `| DR-id | Decision | Truth owner |` table. Insert **one new table row** immediately after the existing `DR-T7` row (the last row of the table). Per §1B, "New entries require Walter approval + a Role-C landing." — Walter directed this feature 2026-07-17; this Role-C landing records the decision.

### BEFORE (verbatim; found EXACTLY ONCE — the tail of the `DR-T7` row)

```
| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ `function.json`) to the Walter-designated dedicated Theo Function App — `vaultgpt-func-chat` only — after a Codex-APPROVED VEP; the monolith (`vaultgpt-func-premium`) and streaming sidecar (`vaultgpt-func-stream`) remain READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (`SELECT`) verification SQL. Walter-granted 2026-07-04. | this standard §1E |
```

### AFTER (the same anchor row, immediately followed by the new `DR-T8` row on the next line)

```
| DR-T7 | **Scoped deployment exception**: Claude Code MAY deploy handler/function code (+ `function.json`) to the Walter-designated dedicated Theo Function App — `vaultgpt-func-chat` only — after a Codex-APPROVED VEP; the monolith (`vaultgpt-func-premium`) and streaming sidecar (`vaultgpt-func-stream`) remain READ-ONLY; DB writes/migrations/merges remain Walter-only; Claude Code runs only read-only (`SELECT`) verification SQL. Walter-granted 2026-07-04. | this standard §1E |
| DR-T8 | **In-tenant Voice I/O** (Walter-directed 2026-07-17): Theo gains speech-to-text (dictation) and text-to-speech (read-aloud) via a keyless managed-identity **audio gateway broker** (Golden Handler HF-T6) to in-tenant Azure Cognitive Services — Azure OpenAI **Whisper** (STT) and **Azure AI Speech** neural voices (TTS). No third-party voice service; no client audio leaves the tenant; distinct from the Anthropic-hosted Claude *text* model (architecture §2.4). Deploys to `vaultgpt-func-chat` (DR-T7); stateless (no `theo_*` table, no migration). | `THEO_PHASE_1B_BACKEND_PLAN.md` Tier Voice; Golden Handler Standard §6 HF-T6 |
```

---

## Notes

- **Planning-only, zero behavior change.** No handler, no `function.json`, no `theo_*` schema, no migration lands here. This amendment only registers the Voice I/O feature across the three living authority docs + the Decision Register so the subsequent per-microstep VEPs can (a) satisfy Conformance §4A.1 P1 feature-identification against a Plan tier, and (b) declare the HF-T6 audio broker greenfield against the registered API-Spec §2.11 surface + DR-T8 (avoiding a Golden Handler §4 / Conformance §10 T12 new-external-system reject).
- **Deploy target is DR-T7-compliant.** Both PROPOSED handlers target `vaultgpt-func-chat` — the only app Claude Code may deploy to (§1E / DR-T7). The monolith and stream sidecar are untouched.
- **Provisioning is post-APPROVAL.** The Whisper model deployment and the func-chat managed-identity Cognitive Services / Speech data-role grants are executed by Claude Code (Walter granted az authority 2026-07-17) **only after** each microstep's VEP is Codex-APPROVED — never before Pass 2, per DR-T7 / §1E and Walter's deployment-gate instruction.
- **No Schema Role-C bundled.** Voice I/O is stateless; `spec/THEO_AZURE_POSTGRES_SCHEMA.md` is unchanged.

## Codex activation note

Open your Role-C turn with a governance-bound GCR + Rule Anchor Table (Conformance §3–§5; Codex Review §4). Then apply EDIT 1–EDIT 4 **verbatim**: for each, locate the found-once BEFORE anchor in the named target file and replace it with the AFTER text (each is a pure insertion — the BEFORE text is preserved, the new row/subsection is added after it). Edit only the four named target docs (`governance/THEO_GOLDEN_HANDLER_STANDARD.md`, `spec/THEO_API_SPEC.md`, `governance/THEO_PHASE_1B_BACKEND_PLAN.md`, `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md`); make no substantive additions of your own. **HALT** and report if any BEFORE anchor is not found exactly once, or if any Rule Anchor quote is not a literal substring at HEAD. Verdict is APPROVED or REJECTED only.
