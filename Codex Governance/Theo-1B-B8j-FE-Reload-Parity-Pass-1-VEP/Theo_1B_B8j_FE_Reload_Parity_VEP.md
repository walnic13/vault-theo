# Theo 1B — B8j Reload-Parity (per-message attachment chips on reopened threads, Frontend) — Pass 1 VEP

> Pipeline: Vault Theo **frontend** regime. Author = Claude Code (Pass 1 Plan). Reviewer = **Codex** (Pass 2). This is the **plan** (Component Contract Table + UI-authority reconciliation + gap disclosure); the code is the Pass-3 Implementation Package. **Microstep:** Tier **B8j** — the FE consumer of the deployed B8i reload-parity backend. On reopening a persisted thread, hydrate each user turn's attachment chips from `theo_list_conversation_attachments`, grouped by `message_seq` (the seq of the user turn each file was sent with), so a reloaded chat shows its chips on the matching message — the Claude-style behaviour B8e set up for live sends. **Data-only**: it reuses the **already-landed B8e** `SentAttachments`/`Chip` rendering verbatim (`ChatView` line 147 already renders `m.attachments`); no component, prop, or visual change. Four files change (service/state/types): `gateway.live` (+`listConversationAttachments`), `theoClient` (passthrough), `types` (+`ConversationAttachment`), `useTheoState.selectRecent` (hydrate `message.attachments` by seq). Implementation **drafted + `tsc`+`eslint`-clean** in `proposed-src/` (de-risks Pass 3). Closes the B8e G-3 reload-parity follow-on.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Turn issued against HEAD: `977331295c21851861546c742ab0b478e98cb63b` (vault-theo, `development`)
Detail: Pass 1 frontend VEP; §4A.1 sub-phases F-P1, F-P2, F-P2.5, F-P4, F-P5, F-P7 walked below. Primary Reference component (Golden Component Pack §2) = the **ACTIVE** deployed `src/theo/components/ChatView.tsx` (blob `fa429fff`) — which **already** renders `m.attachments` via the landed B8e `SentAttachments`/`Chip` (line 147); B8j changes **no** component and adds **no** visual surface, so there is **no** new VISUAL-AUTHORITY-DEVIATION (the chips are the B8e-authorized affordance, now hydrated on reload). The change is confined to the service boundary + state + types (`gateway.live`/`theoClient`/`useTheoState`/`types`), routed through the single `theoClient` → `gateway.live` boundary, consuming the deployed B8i endpoint (API Spec §2.8 `theo_list_conversation_attachments`). Implementation drafted + validated this turn (`npm run typecheck` + `eslint` on the 4 files → clean) in `proposed-src/`. No browser storage (1A handover §2.5).

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §4 UI reconciliation; §5 gap) | `Grep("Component Contract Table")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §4A spine; §5 gap) | `Grep("MUST open with a Grounding Conformance Receipt")` this turn | `1055b8b35043fe40a1c4cf1559585514ec30e789` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited; unchanged blob @ HEAD | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary ref; §3 CCT) | `Grep("existing component file as the structural mirror target")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo 1A Frontend Handover — `governance/THEO_1A_FRONTEND_HANDOVER.md` (§0.1 no-redesign; §2.3 service boundary; §2.5 no storage) | `Grep("Do not redesign it")` this turn | `aad6396703b5a2b6d204986e5064504cec939895` |
| 6 | **Microstep source** — Theo Phase 1B Backend Plan — `governance/THEO_PHASE_1B_BACKEND_PLAN.md` (§7 Tier B8 reload-parity follow-on) | `Grep("reload")` this turn | `54f22fe12b5bc0c6e3c089be2474ff0226d1497c` |
| 7 | **Contract dependency** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.8 `theo_list_conversation_attachments`) | `Grep("theo_list_conversation_attachments")` this turn | `1f166aad5f56635fb850f0e2376bda9f2adc8bc2` |
| 8 | **VA-T1** Theo Frontend Reference Surface — `frontend/theo-frontend-reference.jsx` (composer/bubble tokens) | `Grep("vo-send")` this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 9 | **Primary Reference component (ACTIVE)** — `src/theo/components/ChatView.tsx` (renders `m.attachments` L147) | `Read(full)` this turn | `fa429fff1206426a579e043277ee22da9bf09812` |
| 10 | ACTIVE service/state under change — `src/theo/useTheoState.ts` (`selectRecent`) | `Read(full)` this turn | `8b280ad42e25dcc4e414c433a9614b22135901b9` |
| 11 | ACTIVE service under change — `src/theo/services/gateway.live.ts` (`getConversation` mirror) | `Read(full)` this turn | `e4dde7edb2f7979b5cc7aa408d979294b9d68b7d` |
| 12 | ACTIVE service under change — `src/theo/services/theoClient.ts` (single boundary) | `Read(full)` this turn | `ccbbcff97bdf5e201a15c8750c1117853a6972ea` |
| 13 | ACTIVE types under change — `src/theo/types.ts` (`SentAttachment`/`ConversationDetail`) | `Read(full)` this turn | `e123c902cfa600fce52e99469d61e950575f3934` |

No ChatGPT advisory cited. No `reporting_*` / `corporate-reporting` change. No backend/handler/schema change (B8i already deployed + golden-verified). No new component, prop, or visual surface. No browser storage introduced (1A handover §2.5).

## Rule Anchor Table

| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a Grounding Conformance Receipt (GCR) and a Rule Anchor Table" | GCR + Rule Anchor Table (this pack) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "Component Contract Table" | §F-P5 — CCT for the in-scope components |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "existing component file as the structural mirror target" | §F-P4 — Primary Reference = ACTIVE ChatView.tsx |
| governance/THEO_1A_FRONTEND_HANDOVER.md | §0.1 | "Do not redesign it." | §F-P2 — no component/visual change; chips reuse landed B8e rendering |
| spec/THEO_API_SPEC.md | §2.8 | "theo_list_conversation_attachments" | §F-P5 — contract dependency (B8i read endpoint) |
| frontend/theo-frontend-reference.jsx | composer | "vo-send" | §F-P2 — existing surface tokens unchanged |

---

## §F-P1 — Feature identification
Tier **B8j** (Backend Plan §7 Tier B8 reload-parity follow-on; the B8e G-3 gap). When a user reopens a persisted thread (Recents → `selectRecent`), the rehydrated messages currently carry **no** attachments (the `selectRecent` comment notes this explicitly), so the chips that appeared while composing/sending (B8e) vanish on reload. B8j fixes that: fetch the conversation's attachments via the deployed B8i `theo_list_conversation_attachments`, group them by `message_seq`, and attach a `SentAttachment[]` to each user `Message` whose `seq` matches — feeding the **existing** `ChatView` → `SentAttachments` → `Chip` rendering (B8e, line 147) so chips reappear on the matching message. Claude-exact: a reopened conversation shows the files each turn was sent with.

## §F-P2 — UI Authority Reconciliation
- **VA-T1 (reference surface) — preserved; nothing redesigned.** B8j changes **no** component (1A handover §0.1 "Do not redesign it."). `ChatView`, `SentAttachments`, `Chip` are byte-unchanged; their props and rendering are exactly as landed in B8e.
- **No new VISUAL-AUTHORITY-DEVIATION.** The sent-bubble attachment chip is the **already-authorized** B8e affordance (Walter's "exactly like Claude" directive, classified + landed in B8e). B8j renders the **same** chip with the **same** tokens on reloaded turns — identical pixels, just hydrated from the server instead of from in-session state. So there is no new visual surface to classify; this VEP introduces only a service/state/types data path. On reload the chip shows filename · size (no expandable preview — the pasted-text body is not refetched; see G-1), which is the read-only sent-bubble chip B8e already renders.

## §F-P2.5 — Gap Disclosure
Vocabulary `PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`.
| Gap | Disclosure | Pivot |
| --- | --- | --- |
| G-1 | **No expandable preview on reload.** A reloaded chip shows name · size but not the inline pasted-text/extracted preview (the `previewText` is not refetched; the extracted text lives server-side). Live-compose chips still expand in-session. | **PROCEED** — matches Claude (a reopened thread shows the file chip, not a re-expanded paste); refetch-on-click is a future enhancement, not reload parity. |
| G-2 | **Pasted-text label on reload** is restored by the `filename === "pasted-text.txt"` convention (the exact finalize filename `addPastedText` uses) → re-labelled "Pasted text", kind `pasted`. A real upload literally named `pasted-text.txt` would render as a pasted chip. | **PROCEED** — cosmetic edge case; the coupling is to B8e's own upload convention. |
| G-3 | **Pre-B8i attachments** have `message_seq = NULL` (no backfill) → skipped in the per-message grouping, so historical pre-B8i uploads show no chip on reload. | **PROCEED** — matches the backend B8i G-4; only affects uploads sent before B8i deployed. New sends bind correctly. |
| G-4 | **Standalone dev harness** (no live backend) → `listConversationAttachments` returns `[]`, so reloaded mock threads show no chips. | **PROCEED** — degraded-but-safe (same posture as B8e G-4); the live SWA mount supplies the token provider → chips hydrate. |

Per-surface status (1A handover §3): the reload hydration is **true-in-1B** against the deployed + golden-verified B8i endpoint; the standalone harness degrades to no chips (safe).

## §F-P4 — Component reference grounding
Primary Reference (Golden Component Pack §2, "existing component file as the structural mirror target") = the **ACTIVE** `src/theo/components/ChatView.tsx` (blob `fa429fff`), which already renders `{m.attachments && m.attachments.length > 0 && <SentAttachments items={m.attachments} />}` (line 147) via the landed B8e `SentAttachments`/`Chip`. B8j adds **no** component and **no** prop — it only populates `Message.attachments` in the reload path. The new data call routes through the single `theoClient` → `gateway.live` boundary (1A handover §2.3), consuming the deployed B8i contract (API Spec §2.8) — `listConversationAttachments` is an EXACT mirror of the existing `getConversation` gateway method (same auth headers, same envelope handling, same mock-fallback shape). No new service module; no surface bypass.

## §F-P5 — Component Contract Table
No component prop interface changes in B8j. The in-scope rendering components (ACTIVE, **unchanged**) are listed with their literal interfaces per Governor §3; the actual edits are the service/state/types surfaces in the table that follows.

### CCT-1 — `ChatView` (ACTIVE; unchanged — consumes the hydrated data)
- **Ownership:** Theo surface, ACTIVE. **VA-id:** VA-T1 (composer + sent-bubble; the B8e chips are the landed VISUAL-AUTHORITY-DEVIATION). **Change in B8j:** none — `ChatView.tsx` is byte-unchanged; it already renders `m.attachments` (line 147). B8j only causes that array to be populated on reload.
- **Prop interface (literal, unchanged):**
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
- **Contract dependency:** consumes `Message.attachments` (`SentAttachment[]`), now hydrated on reload by `useTheoState.selectRecent`.

### CCT-2 — `SentAttachments` (ACTIVE; unchanged — sub-component of ChatView)
- **Ownership:** Theo surface, ACTIVE. **VA-id:** VA-T1 (sent-bubble region; landed B8e affordance). **Change in B8j:** none.
- **Prop interface (literal, unchanged):**
```ts
function SentAttachments(props: { items: SentAttachment[] }): JSX.Element
```
- **Contract dependency:** none (presentational); reads `Message.attachments`. On reload each item is built from a `ConversationAttachment` row (no `previewText` → non-expandable chip, per G-1).

### Contract/state surfaces changed (the B8j edits; non-visual; validated in `proposed-src/`)
| File | Change | Contract |
| --- | --- | --- |
| `src/theo/types.ts` | +`ConversationAttachment` (`{ id, filename, content_type, byte_size, ingestion_class, message_seq: number \| null, created_at }`) | shape only |
| `src/theo/services/gateway.live.ts` | +`listConversationAttachments(conversationId)` — EXACT mirror of `getConversation` (auth headers, envelope, mock-fallback → `[]`) | `GET /api/theo_list_conversation_attachments?conversationId=<uuid>` (API Spec §2.8, B8i) |
| `src/theo/services/theoClient.ts` | +`listConversationAttachments(id)` passthrough | single service boundary (1A handover §2.3) |
| `src/theo/useTheoState.ts` | `selectRecent`: fetch attachments (best-effort), group by `message_seq`, attach `SentAttachment[]` to the matching user `Message`; comment updated B8f→B8i | in-memory only (no browser storage); chat-send path unchanged |

## §F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1/F-P2/F-P2.5/F-P4/F-P5/F-P7 walked; UI-authority reconciliation done (VA-T1 preserved; **no** new deviation — reuses the landed B8e chips); Gap Disclosure present (G-1..G-4, all PROCEED; no PRE-LAND — the B8i backend is deployed + verified and Blob CORS was already resolved in B8e); Component Contract Table (CCT-1/CCT-2 ACTIVE-unchanged with literal interfaces + the changed service/state/types surfaces). **Implementation drafted + validated** — see §IMPL. On Codex APPROVAL → Pass 3 applies `proposed-src/` to `src/`, re-runs typecheck+eslint, emits the Component Structural Mirror + SWA test plan → Walter merges + SWA-tests (reopen a thread with attachments → chips appear on the right turns) → Pass 3 Visual Acceptance Evidence.

## §IMPL — drafted + validated implementation (Pass-3 payload, in `proposed-src/`)
The four changed files are written and **validated against the live repo toolchain this turn**: `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`) → **clean**; `eslint` on all four → **clean (exit 0)**. They are staged in `Codex Governance/Theo-1B-B8j-FE-Reload-Parity-Pass-1-VEP/proposed-src/theo/` (4 full files) and are **NOT** applied to `src/` (applied at Pass 3 on approval). Region classification (Golden Component Pack §4): rendering components (`ChatView`/`SentAttachments`/`Chip`) = **VISUAL-AUTHORITY-MATCH** (byte-unchanged); service/state/types = **ALLOWED DELTA** (service-boundary wiring + contract types + reload hydration, 1A handover §2.3); `listConversationAttachments` = EXACT mirror of the deployed `getConversation` gateway method.

## §DEPLOY / Pass-3 path
1. Codex Pass 2 reviews this VEP + CCT. 2. On APPROVAL, Pass 3 applies `proposed-src/` to `src/`, re-runs `typecheck`+`eslint`, emits the Component Structural Mirror + SWA test plan. 3. Walter merges + SWA-tests: send a message with a file + a large paste, reload the thread → chips reappear on the matching user turns (file chip + "Pasted text" chip); a multi-turn thread shows each turn's own attachments. 4. Pass 3 Visual Acceptance Evidence (screenshot of a reloaded thread with chips). No backend/infra step (B8i live; Blob CORS already set in B8e).

**Requested Pass 2 verdict:** Codex APPROVED or REJECTED.

*End of B8j Reload-Parity Pass-1 Frontend VEP (plan).*
