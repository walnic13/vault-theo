# Codex Governance Package — Theo 1B B8b SAS-Signature Fix (theo_create_attachment_upload) — Pass 1

- **Main artifact:** `Theo_1B_B8b_SAS_Signature_Fix_VEP.md` — Pass-1 backend fix VEP (plan only).
- **Deploy file:** `theo_create_attachment_upload.index.js` (== §H1-FIXED) + `theo_create_attachment_upload.function.json` (unchanged).
- **Fix:** create's user-delegation SAS string-to-sign omitted the `signedEncryptionScope` (`ses`) field (canonical addition in service version 2020-12-06). With `sv=2022-11-02` this misplaced `rsct` -> `403 AuthenticationFailed` on every Blob PUT. Rebuilt as an explicit 24-field array incl. `ses`. Proven: OLD 5-empty -> AuthenticationFailed; NEW 6-empty -> signature validates.
- **Scope:** redeploy `theo_create_attachment_upload` ONLY; finalize/delete unchanged (deployed, correct).
- **Supersedes:** the create handler in `Theo-1B-B8b-Attachment-Upload-Handlers-Pass-1-VEP` (approved `1e99ca7a`, blob `ed24354d`).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Deploy = Walter (Pass 3, create only); Claude Code re-runs the golden-curl round-trip.
- **HEAD:** vault-theo `1e99ca7a9ee9fdda61649594b1bfa635afe30752`.
- **Lint:** PASS (exit 0).
