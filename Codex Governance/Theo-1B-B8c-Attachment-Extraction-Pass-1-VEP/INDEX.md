# Codex Governance Package — Theo 1B B8c Attachment Extraction-at-Upload — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B8c_Attachment_Extraction_VEP.md` — Pass-1 backend VEP (plan only).
- **Deploy files:** `b8c_addendum.sql` (== §DDL; additive ALTER: ingestion_class + extracted_text_path) + `b8c_verify.sql` (== §VERIFY); `theo_finalize_attachment.index.js` (== §H; extends the deployed finalize) + `theo_finalize_attachment.function.json` (unchanged).
- **Microstep:** Tier B8c — extract-class (Excel/Word/PPT/CSV/TXT) text extraction at finalize: download blob → extract (xlsx/mammoth/officeparser/native) → store sibling `.extracted.md` → record ingestion_class + extracted_text_path. Native (PDF/image) unchanged. Extraction non-fatal.
- **Walter authorization (Golden §3/T12)** for the new-domain extraction libs quoted verbatim in §WALTER-AUTH ("path a is the way to go").
- **PRE-LAND:** G-1 migration (pgadmin_vault); G-2 Kudu `npm install xlsx mammoth officeparser` (same mechanism as pg).
- **Primary Reference:** deployed `theo_finalize_attachment` (handler `23112e4a` + function.json `9fdd3c54`).
- **Scope:** finalize only; create/delete unchanged.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Deploy = Walter (Pass 3); Claude Code re-runs golden curls + §VERIFY.
- **HEAD:** vault-theo `2583040c29aaac78ca5ad8e7ff5c9fff5cdadc69`.
- **Lint:** PASS (exit 0).
