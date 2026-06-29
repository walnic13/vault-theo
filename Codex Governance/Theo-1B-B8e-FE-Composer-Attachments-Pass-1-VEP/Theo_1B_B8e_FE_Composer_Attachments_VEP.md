# Theo 1B — B8e Composer Attachments + Paste-to-Attachment (Frontend) — Pass 1 VEP

> Pipeline: Vault Theo **frontend** regime. Author = Claude Code (Pass 1 Plan). Reviewer = **Codex** (Pass 2). This is the **plan** (Component Contract Table + prop interfaces + UI-authority reconciliation + gap disclosure); the component code is the Pass-3 Implementation Package. **Microstep:** Tier **B8e** — make the Theo composer Claude-exact for attachments: a **paperclip attach control** + **upload via the deployed B8b SAS flow** + **attachment chips** (status / remove / expandable preview), and **large-paste-to-attachment** — a paste over a threshold becomes a collapsed, expandable **"Pasted text"** chip instead of flooding the composer (Walter directive §WALTER-AUTH). Reuses the deployed B8b→B8d backend 100% (files and large pastes both ride `create_attachment_upload` → PUT-to-Blob → `finalize_attachment`, sent as `attachment_ids`). The implementation is **already drafted and `tsc`+`eslint`-clean** in `proposed-src/` (de-risks Pass 3). **Reload-parity** for historical threads is the B8f follow-on (needs a list endpoint).

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Turn issued against HEAD: `46948af80eafd88498fb3a92a406cd6751ece9ed` (vault-theo, `development`)
Detail: Pass 1 frontend VEP; the §4A.1 sub-phases F-P1, F-P2, F-P2.5, F-P4, F-P5, F-P7 are walked below. Primary Reference component (Golden Component Pack §2) = the **ACTIVE** deployed `src/theo/components/ChatView.tsx` (blob `5f996792`) — the structural mirror the B8e composer extends; the new presentational sub-components (`Chip`, `SentAttachments`, `Paperclip`) are GREENFIELD, governed by VA-T1's token system + the §WALTER-AUTH directive. The attach/chip/paste affordances are **additive beyond the captured VA-T1 surface** (which has no attach control) → classified **VISUAL-AUTHORITY-DEVIATION** (F-P2), authorized verbatim by Walter (§WALTER-AUTH), reusing VA-T1 tokens (`C.coral`/`C.line2`/`C.bubble`/`vo-chip`/`SANS`) so it stays visually consistent. Contract dependency = the deployed B8b/B8d endpoints (API Spec §2.8) through the single service boundary (`theoClient` → `gateway.live`); no surface-redesign of the existing composer. Implementation drafted + validated (`tsc --noEmit` + `eslint` clean) in `proposed-src/`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §4 UI reconciliation; §5 gap) | `Grep("Component Contract Table")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§2 defs; §3 GCR; §4A spine; §4B VA registry) | `Read(offset=1,limit=161)` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | `Grep("Component Contract Table\|approval")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary ref; §3 CCT; §4–§8 classification/greenfield) | `Grep("existing component file as the structural mirror target")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | `Grep("composer\|chat")` this turn | `d125cbdc4048a0b4120d3682bc8ecb76db134219` |
| 6 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§0.1 no-redesign; §2.3 service boundary; §3 real-1A/true-1B) | `Grep("reproduce faithfully\|service module")` this turn | `aad6396703b5a2b6d204986e5064504cec939895` |
| 7 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8 B8e) | `Grep("Composer attach control")` this turn | `ebdf4d73306190ab5b44f61fb2db08932b1f3638` |
| 8 | **Contract dependency** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 Attachments; §2.1 gateway) | `Grep("theo_create_attachment_upload")` this turn | `be621ba62396a12c8ddd873d4805e433bc1d82cc` |
| 9 | **VA-T1** Theo Frontend Reference Surface — `frontend/theo-frontend-reference.jsx` (composer L479–492; tokens) | `Read(offset=479,limit=14)` + `Grep("vo-send")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 10 | **Primary Reference component (ACTIVE)** — `src/theo/components/ChatView.tsx` | `Read(full)` this turn | `5f996792073761d8527641c7bf4dcd4a6fc3b4ee` |

No ChatGPT advisory cited. No `reporting_*` / `corporate-reporting` change. No backend/handler/schema change (B8b–B8d already deployed). No browser storage introduced (1A handover §2.5).

---

## §WALTER-AUTH — verbatim directive authorizing the Claude-pattern attachment UI (additive beyond VA-T1)
Walter, current feature directive (the authority for the attach/chip/paste affordances that extend the captured VA-T1 surface):
> "making it exactly like claude is the goal, including when a large text block is copied and pasted into the chat screen it shows as an attachment (expandable to read if the user wants) instead of taking up the space in the chat window."
This authorizes the additive composer affordances (paperclip + chips + large-paste-to-attachment) as a VISUAL-AUTHORITY-DEVIATION from the captured VA-T1 surface, reproduced in VA-T1's existing token system.

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "Component Contract Table" | §F-P5 — CCT for every in-scope component |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "existing component file as the structural mirror target" | §F-P4 — Primary Reference = ACTIVE ChatView.tsx |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §0.1 | "Do not redesign it." | §F-P2 — existing composer unchanged; additions classified VISUAL-AUTHORITY-DEVIATION |
| governance/THEO_PHASE_1B_BACKEND_PLAN.md | Tier B8 | "Composer attach control" | §F-P1 — the B8e composer microstep |
| spec/THEO_API_SPEC.md | §2.8 | "theo_create_attachment_upload" | §F-P5 — contract dependency (B8b/B8d endpoints) |
| frontend/theo-frontend-reference.jsx | composer | "vo-send" | §F-P2 — additions reuse VA-T1 composer tokens |

---

## §F-P1 — Feature identification
Tier **B8e** (Backend Plan §7 Tier B8: "Composer attach control + upload (SAS PUT) + attachment chips (Theo FE regime)"). Make the Theo composer Claude-exact for attachments:
- **Attach control** (paperclip, left of send) → file picker → each file uploaded via the deployed B8b SAS flow → chip.
- **Large paste → attachment** (§WALTER-AUTH): a paste `≥ PASTE_AS_ATTACHMENT_CHARS` (1,500) is intercepted and becomes a collapsed, expandable **"Pasted text"** chip (a `text/plain` "file" through the same flow) instead of flooding the composer.
- **Chips**: filename + size/status (Uploading…/Failed) + remove ×; pasted/text chips expand inline to a read-only preview. Chips also render (read-only) on the **sent** user bubble.
- **Send**: blocked while uploads are in flight; ready attachments go as `attachment_ids`; cleared after send; restored on error.
All interaction is real-in-1A presentationally; the upload/inject path is true-in-1B against the deployed B8b–B8d endpoints (already live + golden-verified).

## §F-P2 — UI Authority Reconciliation
- **VA-T1 (reference surface) — preserved, not redesigned.** The existing composer (textarea, send button `vo-send`, the white rounded box, the disclaimer line) is reproduced **unchanged** (1A handover §0.1 "Do not redesign it."). The send button's bottom row changes from `justify-content:flex-end` to `space-between` to seat the paperclip on the left — a layout-only adjustment within the existing box.
- **Additive affordances (VISUAL-AUTHORITY-DEVIATION, Walter-authorized §WALTER-AUTH).** The captured VA-T1 surface has **no** attach control or chips. B8e adds: the paperclip button, the composer chips row, the expandable pasted-text preview, and the sent-bubble chips. These are **additive** (they do not alter the existing rendered elements) and are built in VA-T1's own token system (`C.coral`, `C.line2`, `C.bubble`, `C.ink/ink2/ink3`, `SANS`, `vo-chip`-style rounding) so they read as the same surface. Classified VISUAL-AUTHORITY-DEVIATION per Governor §4; authority = §WALTER-AUTH (Claude-parity directive). No conversion of the inline-style system (that would be a prohibited DEVIATION, 1A handover §0.1) — all additions use the same inline-style idiom.

## §F-P2.5 — Gap Disclosure
Vocabulary `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **Blob CORS (PRE-LAND infra).** The browser PUTs bytes directly to `vaultgptstorage01` via the SAS; the storage account's Blob CORS must allow `PUT` (+ `OPTIONS` preflight) from the Origin/Theo SWA origin(s), allowed headers `x-ms-blob-type, Content-Type`. (Flagged in B8b G-2 as "needed for the FE PUT".) | **PRE-LAND** — Walter confirms/sets Blob CORS before the SWA build serves attachments; surfaced as an upload "Failed" chip if absent. |
| G-2 | **VISUAL-AUTHORITY-DEVIATION** — additive attach/chip/paste affordances beyond VA-T1. | **PROCEED** — Walter-authorized (§WALTER-AUTH); classified + token-consistent (F-P2). |
| G-3 | **Reload-parity (B8f follow-on).** Reloaded historical threads do not yet show their attachment chips — there is no list-attachments-by-conversation endpoint. Live compose + sent-bubble chips work now. | **PROCEED (future-trigger)** — B8f: a small `theo_list_conversation_attachments` endpoint + wire `selectRecent` to hydrate chips. Noted in `useTheoState.selectRecent`. |
| G-4 | **Standalone dev harness** (no live backend) cannot upload; `attachmentsAvailable` is false → the paperclip is disabled and large pastes fall through into the textarea (graceful). | **PROCEED** — degraded-but-safe; live SWA mount supplies the token provider → attachments enabled. |

Per-surface status (1A handover §3): all composer interaction is **real-in-1A** presentationally; the upload/inject round-trip is **true-in-1B** against the deployed B8b–B8d endpoints (live + verified).

## §F-P4 — Component reference grounding
Primary Reference (Golden Component Pack §2, "existing component file as the structural mirror target") = the **ACTIVE** `src/theo/components/ChatView.tsx` (blob `5f996792`) — the composer the feature extends; structural mirror target. New sub-components `Chip` / `SentAttachments` / `Paperclip` are **GREENFIELD** (§8) governed by VA-T1 (token system) + §WALTER-AUTH. Service-boundary changes route through the single `theoClient` → `gateway.live` boundary (1A handover §2.3), consuming the deployed B8b/B8d contracts (API Spec §2.8) — no new service module, no surface bypass.

## §F-P5 — Component Contract Table
Prop interfaces are the literal TypeScript (required-before-optional; **no `any`**), as implemented + `tsc`-validated in `proposed-src/`.

### CCT-1 — `ChatView` (ACTIVE; extended)
- **Ownership:** Theo surface, ACTIVE (extended). **VA-id:** VA-T1 (composer L479–492; the existing box/textarea/`vo-send` reproduced unchanged; additive affordances per §F-P2 VISUAL-AUTHORITY-DEVIATION).
- **Prop interface (literal):**
```ts
export interface ChatViewProps {
  messages: Message[];
  loading: boolean;
  error: string;
  draft: string;
  attachments: ComposerAttachment[];
  attachmentsAvailable: boolean;
  onDraftChange: (s: string) => void;
  onSend: (text?: string) => void;
  onAddFiles: (files: FileList | File[]) => void;
  onAddPastedText: (text: string) => boolean;
  onRemoveAttachment: (localId: string) => void;
  chatProject: Project | null;
  assistantName: string;
  greeting: string;
  starters: string[];
  renderAssistant: (content: string) => ReactNode;
}
```
- **Contract dependency:** drives `useTheoState` handlers `addFiles`/`addPastedText`/`removeAttachment`/`send`; on send, ready attachments flow to `theoClient.sendMessage({ …, attachment_ids })` → `POST /api/theo_message` (API Spec §2.8 / §2.1, B8d). Paste interception calls `onAddPastedText(text)` → returns `true` to `preventDefault`.

### CCT-2 — `Chip` (NEW / GREENFIELD; sub-component of ChatView)
- **Ownership:** Theo surface, NEW. **VA-id:** GREENFIELD (VA-T1 token system; §WALTER-AUTH).
- **Prop interface (literal):**
```ts
function Chip(props: {
  name: string;
  kind: "file" | "pasted";
  byteSize: number;
  status?: ComposerAttachment["status"];   // "uploading" | "ready" | "error"
  previewText?: string;
  onRemove?: () => void;                    // present ⇒ composer chip (removable); absent ⇒ sent-bubble (read-only)
}): JSX.Element
```
- **Contract dependency:** none (presentational); rendered from `ComposerAttachment` (composer) / `SentAttachment` (sent bubble). Expandable when `previewText` is non-empty.

### CCT-3 — `SentAttachments` (NEW / GREENFIELD; sub-component of ChatView)
- **Ownership:** Theo surface, NEW. **VA-id:** GREENFIELD (§WALTER-AUTH).
- **Prop interface (literal):**
```ts
function SentAttachments(props: { items: SentAttachment[] }): JSX.Element
```
- **Contract dependency:** none; reads `Message.attachments` (the read-only record carried on a sent user turn).

### CCT-4 — `Paperclip` (NEW / GREENFIELD; inline icon)
- **Ownership:** Theo surface, NEW. **VA-id:** GREENFIELD (icon; matches the existing inline-SVG idiom).
- **Prop interface (literal):**
```ts
function Paperclip(props: { size?: number }): JSX.Element
```
- **Contract dependency:** none.

### Contract/state surfaces changed (non-visual; service boundary + types)
| File | Change | Contract |
| --- | --- | --- |
| `src/theo/types.ts` | +`AttachmentKind`/`SentAttachment`/`ComposerAttachment`/`AttachmentStatus`/`AttachmentUpload`; `Message.attachments?`; `GatewayRequest.attachment_ids?` | shapes only |
| `src/theo/services/gateway.live.ts` | +`createAttachmentUpload` / `uploadToBlob` / `finalizeAttachment` / `deleteAttachment` / `attachmentsAvailable`; `attachment_ids` added to the `sendMessage` body | `POST theo_create_attachment_upload`, `PUT <SAS>` (no Bearer), `POST theo_finalize_attachment`, `POST theo_delete_attachment`, `POST theo_message` (API Spec §2.8/§2.1) |
| `src/theo/services/theoClient.ts` | +`uploadAttachment` (create→PUT→finalize orchestration), `deleteAttachment`, `attachmentsAvailable` passthrough | single service boundary (1A handover §2.3) |
| `src/theo/useTheoState.ts` | +`attachments` state + `addFiles`/`addPastedText`/`removeAttachment` + upload orchestration + `attachment_ids` on `send` + clear-on-send/restore-on-error + `PASTE_AS_ATTACHMENT_CHARS` | in-memory only (no browser storage) |
| `src/theo/components/TheoMain.tsx` | pass the 5 new props to `<ChatView>` | wiring only |

## §F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) + §WALTER-AUTH open the pack; F-P1/F-P2/F-P2.5/F-P4/F-P5/F-P7 walked; UI-authority reconciliation done (VA-T1 preserved; additions classified VISUAL-AUTHORITY-DEVIATION, Walter-authorized); Gap Disclosure present (G-1 PRE-LAND Blob CORS; G-2 deviation PROCEED; G-3 reload-parity B8f PROCEED; G-4 dev-harness PROCEED); Component Contract Table with literal prop interfaces (CCT-1..4) + the contract/state surfaces. **Implementation drafted + validated** — see §IMPL. On Codex APPROVAL → Pass 3 Implementation Package (the code in `proposed-src/`, Component Structural Mirror + visual checklist + SWA test plan) → Walter merges + SWA-tests → Pass 3 Visual Acceptance Evidence (screenshot vs VA-T1 + acceptance note).

## §IMPL — drafted + validated implementation (Pass-3 payload, in `proposed-src/`)
The six changed files are written and **validated against the live repo toolchain this turn**: `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`) → **clean**; `eslint` on all six → **clean (exit 0)**. They are staged in `Codex Governance/Theo-1B-B8e-FE-Composer-Attachments-Pass-1-VEP/proposed-src/` (5 full files + the `TheoMain` ChatView-block edit) and are NOT yet applied to `src/` (applied at Pass 3 on approval). Region classification (Golden Component Pack §4): existing composer elements = **VISUAL-AUTHORITY-MATCH** (unchanged); the bottom-row `flex-end`→`space-between` = **AD-visual** (layout only); paperclip + chips + pasted-preview + sent-chips = **VISUAL-AUTHORITY-DEVIATION** (additive, §WALTER-AUTH); service/state/types = **ALLOWED DELTA** (service-boundary wiring + contract types, 1A handover §2.3).

## §DEPLOY / Pass-3 path
1. Codex Pass 2 reviews this VEP + CCT. 2. On APPROVAL, Pass 3 applies `proposed-src/` to `src/`, re-runs `typecheck`+`eslint`, emits the Component Structural Mirror + SWA test plan. 3. Walter confirms **Blob CORS** (G-1) + merges + SWA-tests (attach a PDF/Excel + paste a large block → expandable chip → Theo answers grounded). 4. Pass 3 Visual Acceptance Evidence (screenshot vs VA-T1 + acceptance). 5. **B8f** follow-on: reload-parity list endpoint.

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B8e Composer Attachments Pass-1 Frontend VEP (plan).*
