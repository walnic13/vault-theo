# B8e — Pass 3 Visual Acceptance Evidence

**Implementation:** committed to `development` @ `39cae492` (6 src files; `tsc`+`eslint`+`vite build` clean).

## Visual acceptance (vs VA-T1)
Walter SWA screenshot (2026-06-29): the composer renders per VA-T1 tokens — the paperclip attach
control (left of send), attachment **chips** with filename + size + remove ×, and the existing
composer box/textarea/send unchanged. Multiple chips render correctly (a 42 KB doc, a 5.7 MB PDF,
a 1 MB Output Template). The additive affordances match the Walter-directed Claude pattern in the
VA-T1 token system (VISUAL-AUTHORITY-DEVIATION as approved).

## Functional acceptance
- **Uploads: PASS.** After the Blob CORS trailing-slash fix on `vaultgptstorage01`, all attachments
  upload (chips go Uploading… → ready; no "Failed"). Browser direct-to-Blob SAS PUT works.
- **Read path: PASS (verified).** A realistic 5.5 MB PDF round-trips through `theo_message` in ~5 s
  (HTTP 200) and Theo answers grounded in it ("Da Vinci Fund III LP — net income $42,000").
- **Paste-to-attachment / chips / remove / send-disabled-while-uploading:** implemented + validated.

## Known limitation (next microstep — NOT a B8e defect)
Sending **multiple very large, text-dense** documents in ONE message (e.g. a 5.7 MB LP agreement +
two more) can exceed the synchronous Azure Functions HTTP window / model input budget → the request
times out → "Couldn't reach the assistant." Root cause is token VOLUME, not file size (a low-text
5.5 MB PDF returns in 5 s). Tracked as the **large-document handling** microstep (gateway input
budgeting + large-PDF text-extraction; streaming flagged separately — see chat). Single/moderate
attachments work today.

**Status:** B8e composer ACCEPTED (uploads + composer + read verified). Large-multi-doc send is a
sequenced follow-on.
