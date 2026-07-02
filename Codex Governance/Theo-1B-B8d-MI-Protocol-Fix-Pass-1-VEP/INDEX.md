# Codex Governance Package — Theo 1B B8d MI-Endpoint Protocol Fix (theo_message) — Pass 1

- **Main artifact:** `Theo_1B_B8d_MI_Protocol_Fix_VEP.md` — Pass-1 backend fix VEP (plan only).
- **Deploy file:** `theo_message.index.js` (== §H) + `theo_message.function.json` (unchanged).
- **Fix:** theo_message's requestUrl was https-only, but the managed-identity IDENTITY_ENDPOINT is http:// → MI token fetch threw → attachment injection degraded to "could not be loaded" for every file. Made requestUrl/requestBinary protocol-aware (add http require + `lib = url.protocol==="http:"?http:https`), an EXACT mirror of the deployed B8c requestUrl. 3-line delta.
- **Evidence:** §FINDING — regression+negatives passed; both PDF+XLSX payoff returned the catch note (MI token failure). Root cause = confirmed code diff vs working B8c.
- **Scope:** theo_message only; no migration/dependency/env.
- **Supersedes:** the theo_message handler in Theo-1B-B8d-Gateway-Attachment-Injection (blob da15fe3a).
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Deploy = Walter (Pass 3); Claude Code re-runs the payoff golden round-trip.
- **HEAD:** vault-theo `cdbb892b4b589916de73c0599c63a0c19baf534f`.
- **Lint:** PASS (exit 0).
