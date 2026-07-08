# B8L — Accept .xlsm / .xlsb Excel attachments

Pass 1 VEP · Theo backend · Reviewer Codex · Lint PASS · HEAD c13ab70.

Adds .xlsm (application/vnd.ms-excel.sheet.macroenabled.12) + .xlsb (…binary.macroenabled.12) as extract-class to theo_create_attachment_upload (allowlist that rejected the upload) + theo_finalize_attachment (allowlist + SheetJS routing). Keys lowercase (normalizeContentType lowercases). Both on premium → Walter copy-paste; Claude runs golden curls. node --check clean; diff vs live = only the additions.
