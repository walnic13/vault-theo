# Walter Authorization — HF-T6 in-tenant audio gateway (new external system)

Golden Handler Standard §4 requires that a **new-external-system helper** classified as an ALLOWED DELTA carry "either an EXACT mirror against a deployed handler containing that helper, or a Walter authorization quoted verbatim and predating the VEP." The HF-T6 audio broker calls a **new external system** (in-tenant Azure Cognitive Services — Azure OpenAI Whisper for speech-to-text). No deployed handler contains an EXACT mirror of a cognitive-audio call, so this file records the predating Walter authorization.

## Verbatim Walter direction (this session, 2026-07-17 — predates this VEP)

> "the audio 'tap to hold or record' feature similar to claude so the user can record their message instead of typing has been requested, is this possible to replicate claude's capabilities into theo. our employees have asked for the claude voices to read back theo's responses, just the way claude does this, is this possible?"

> "let's stay in tenant"

> "let's go with what you recommend, highest quality, enterprise level choices"

> "and i give you the authroity to make the changes using az"

> "remember to follow our theo governnace where we need codex sign off before any deployments"

## Scope authorized

- A keyless, managed-identity **audio gateway broker** (Golden Handler §6 HF-T6) on `vaultgpt-func-chat` that calls **in-tenant** Azure Cognitive Services — Azure OpenAI **Whisper** (speech-to-text; this microstep, Voice-MS1) and Azure AI Speech neural voices (text-to-speech; Voice-MS2, separate VEP).
- No third-party voice service; no client audio leaves the Vault tenant.
- This authorization is governance-recorded as **DR-T8** in `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1B (Codex-APPROVED + landed 2026-07-17, commit `f466ffd`), which predates this VEP.

## Standing gates that remain in force (not waived by this authorization)

- **Codex sign-off before any deployment** (Walter, verbatim above). The Whisper model deployment and the func-chat managed-identity Cognitive Services role grant are executed by Claude Code (az authority granted verbatim above) **only after** this VEP is Codex-APPROVED (Pass 2) — never before.
- Deploy target is `vaultgpt-func-chat` only (DR-T7 / Orchestration §1E). The monolith and streaming sidecar remain read-only. DB writes/migrations remain Walter-only (n/a here — this microstep is stateless).
