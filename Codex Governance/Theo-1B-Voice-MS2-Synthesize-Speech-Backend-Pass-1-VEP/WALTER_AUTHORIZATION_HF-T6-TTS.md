# Walter Authorization — HF-T6 in-tenant Azure AI Speech (TTS, new external system)

Golden Handler Standard §4 requires a **new-external-system helper** classified ALLOWED DELTA to carry an EXACT deployed mirror OR a verbatim Walter authorization predating the VEP. The HF-T6 audio broker's text-to-speech call reaches a **new external system** (in-tenant Azure AI Speech neural voices). No deployed handler contains an EXACT mirror of an Azure AI Speech call, so this file records the predating Walter authorization.

## Verbatim Walter direction (this session, 2026-07-17 — predates this VEP)

> "our employees have asked for the claude voices to read back theo's responses, just the way claude does this, is this possible?"

> "let's stay in tenant"

> "let's go with what you recommend, highest quality, enterprise level choices"

> "and i give you the authroity to make the changes using az"

> "before we offer a selection of voices, if that's possible, let me know if that's too much for the first version, i'd rather it be simple and high quality to start"

## Scope authorized

- The HF-T6 audio broker's **text-to-speech** leg on `vaultgpt-func-chat`: a keyless managed-identity call to **in-tenant Azure AI Speech** neural voices (`{region}.tts.speech.microsoft.com/cognitiveservices/v1`, SSML, AAD `aad#{resourceId}#{token}` auth).
- No third-party TTS; no text/audio leaves the Vault tenant.
- **v1 posture (Walter, verbatim above): simple + high quality — ONE premium default voice, no picker.** The handler accepts an optional validated `voice` override against a curated allow-list so a voice picker is later a FE-only change; v1 exposes only the default.
- Governance-recorded as **DR-T8** in `governance/THEO_EXECUTION_ORCHESTRATION_STANDARD.md` §1B (Codex-APPROVED + landed 2026-07-17, commit `f466ffd`), which predates this VEP. The DEPLOYED Voice-MS1 authorization file (`Codex Governance/Theo-1B-Voice-MS1-Transcribe-Audio-Backend-Pass-1-VEP/WALTER_AUTHORIZATION_HF-T6-AUDIO.md`) already named "Azure AI Speech neural voices (text-to-speech; Voice-MS2)" in scope.

## Standing gates that remain in force

- **Codex sign-off before any deployment.** The three `vaultgpt-func-chat` app settings (`THEO_TTS_ENDPOINT`, `THEO_TTS_RESOURCE_ID`, `THEO_TTS_DEFAULT_VOICE`) are set + the handler deployed by Claude Code **only after** this VEP is Codex-APPROVED. No new MI role or model deployment is required — the func-chat MI already holds `Cognitive Services User` on the Switzerland North resource (granted for Voice-MS1), which covers Speech data-plane.
- Deploy target `vaultgpt-func-chat` only (DR-T7). DB writes/migrations Walter-only (n/a — stateless).
