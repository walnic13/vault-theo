# Codex Governance Package — Theo 1B B8b Attachment Upload Handlers — Pass 1 Backend VEP

- **Main artifact:** `Theo_1B_B8b_Attachment_Upload_Handlers_VEP.md` — Pass-1 Backend VEP (plan only).
- **Deploy files:** `theo_create_attachment_upload.{index.js,function.json}`, `theo_finalize_attachment.{index.js,function.json}`, `theo_delete_attachment.{index.js,function.json}` (== §H1–§H3 / §FJ1–§FJ3).
- **Microstep:** Tier B8b — D-8-resolved SAS direct-to-Blob upload over the deployed `theo_attachments` table: create issues an owner-scoped 15-min write SAS; finalize HEADs the blob for actual size, enforces 10/50 MB caps + ingestion-class allow-list, inserts the owner-scoped row; delete removes the row + reclaims the blob. SAS technique mirrors deployed `axis/artifacts-upload-url`; mutation idiom mirrors `reporting_create_entity`.
- **Scope:** storage + upload only. Extraction (B8c) + gateway injection (B8d) + FE (B8e) follow.
- **Infra (G-2, PRE-LAND):** Theo Function MI needs Storage Blob Data Contributor on vaultgptstorage01 + Blob CORS for the SWA origin.
- **Pipeline:** Author = Claude Code (Pass 1). Reviewer = Codex (Pass 2). Deploy = Walter (Pass 3); Claude Code runs the golden-curl round-trip.
- **HEAD:** vault-theo `5cc9e5dc5abdf0421b86e913b8487e63fba4ca66`.
- **Lint:** PASS (exit 0).
