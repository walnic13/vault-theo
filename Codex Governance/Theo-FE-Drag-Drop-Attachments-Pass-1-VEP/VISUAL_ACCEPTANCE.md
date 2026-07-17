# Drag-and-Drop Attachments — Pass-3 Visual Acceptance Evidence (F-E1)

Closes the Theo FE drag-and-drop attachments microstep (Akshay feedback #3). Codex-APPROVED VEP `8e229d0`; implemented `91194fb`.

- **Surface vs authority:** cites **VA-T1** (the composer surface). No new persistent element — a transient "Drop files to attach" overlay (coral-tinted wash + centered pill with the VA-T1 `Paperclip` glyph, `C` palette, inline-style, no animation) appears only while a file drag is over the chat panel and is removed on drop/leave. Attachment chips, textarea, paperclip, and action row are unchanged.
- **Walter acceptance (2026-07-17):** "that looks good." Dragging a file over the Theo chat panel shows the overlay; dropping attaches it via the existing upload path (uploading → ready chip) exactly like the paperclip; text drags are ignored.
- **Behavior verified:** drop routes into `ChatView.onAddFiles` → `useTheoState.addFiles` → `theo_create_attachment_upload` (DEPLOYED, unchanged); gated on `attachmentsAvailable` + a `dataTransfer` "Files" type; enter/leave depth counter prevents flicker over child elements.
- **Topology:** served from vault-theo-dev `salmon-river`, which serves Theo to all Origin surfaces (standalone + federated-in-Origin), so this reached all users on the dev-SWA rebuild. `main` is the record-only promotion.
- **F-E2 (Role-C):** **NO-DRIFT** — no governed document changes. VA-T1 is unchanged (transient drag-state, no new VA); no API Spec / plan / registry edit. FE-only; captured in code + this evidence record.
