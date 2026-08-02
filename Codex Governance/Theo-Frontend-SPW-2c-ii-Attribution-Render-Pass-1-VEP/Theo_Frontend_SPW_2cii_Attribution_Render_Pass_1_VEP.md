# Theo Frontend — SPW Phase 2c-ii: attributed multi-party render: Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (no component code lands this turn; implementation is Pass 3 against the approved Component Contract Table). Renders **who wrote each message** in a shared conversation — a per-turn BYLINE (the author's roster photo + display name + an "Owner / You" tag) — drawn per the Walter-approved **VA-T12** (surface A). Each message carries `created_by` (deployed backend, API §2.1, 2b-3d) resolved to a person via the People roster (`theo_list_people`, §2.9). Bylines appear ONLY in a MULTI-AUTHOR thread; a private single-author conversation is unchanged (VA-T1). Plus the composer's "your reply posts as <you>" note in a shared thread. **Scope boundary:** the "Shared in this project" banner + the publish state ride with 2c-iii (which owns the published flag); this microstep is the attribution render only.

**Re-issue (v2) — addresses Codex Pass-2 REJECT (T13, runtime/byline contract mismatch for locally-created turns):** the rejected plan drove the byline off `Message.created_by` but the live send path (`useTheoState.send`, line 525) appends the local user turn WITHOUT `created_by`, so a just-sent turn had no author until reload and `multiParty` could stay false on the first member reply. **Fix:** (1) CCT-4 now **seeds the local user turn with the confirmed self OID** (`people.find(p => p.isSelf)?.id`) at send time, so live continuation is attributed immediately and the multi-author derivation flips correctly; (2) CCT-2 `AuthorByline` now takes `createdBy?: string` (optional — matches `Message.created_by?: string`), and the render passes the value type-safely with owner/self computed under `!!m.created_by` guards.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding parent (source baseline): `7646afde4c60363c9efc6539cd560f0e0e9f6b0f` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; every currency anchor below is a tip-independent blob SHA
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §6 build guardrails) | `Grep("MUST contain a **Component Contract Table**")` + `Grep("Keep the reference surface's inline-style approach")` this turn | `3afec7ea4b13650ce2bf28bf32073179a35e7b24` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (F-P1 currency; SPW is a Walter-directed extension) | carried grounding (this program; blob-anchored) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_get_conversation` — per-message `created_by`; §2.9 `theo_list_people` roster) | carried grounding (this program; blob-anchored; §2.1 created_by landed this program) | `fc0443eee2b598d8026cb40e073d4bc115a4a31e` |
| 4 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchors; §6 T20/T25; §4B VA-T12) | `Grep("| VA-T12 | Theo Shared Project Workspace Surfaces |")` this turn | `4f2f42e799be5db31e1e35e523d656ff4c1c057e` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | carried grounding (this program; blob-anchored) | `25cc488091d619d8f6642b10552df0d019a87933` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 Primary Reference/greenfield; §3 CCT; §4 prop conventions; §5 allowed deltas; §7 visual parity) | `Grep("A row missing any of the three locked surfaces is invalid")` + `Grep("declare \`PRIMARY REFERENCE: GREENFIELD\`")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | **VA-T12 reference surface** — `artifacts/theo-spw-surfaces-reference.jsx` (§4B VA-T12; surface A = the attributed byline + tags + "reply posts as you" note) | `Read`(this session — authored) + registered §4B entry this turn | `188061f9c043acf222f6f610903869438b30b8ba` (sha256 `03c2970c9e0f13b7fdc6d8868578a94c3db561a5d0a3fdd054bcb06f21d52c59`) |
| 8 | ACTIVE surface — `src/theo/components/ChatView.tsx` (message render + composer; complete `ChatViewProps` pasted in F-P5) | `Read(src/theo/components/ChatView.tsx, offset=20, limit=49)` this turn | `d165e6cfeb73f2760d6c1bf1cbe811febc746326` |
| 9 | ACTIVE state — `src/theo/useTheoState.ts` (`paintConversation` builds `Message[]` from `d.messages`; `send()` appends the local user turn at L525; owns the `people` roster + the self row L197/L294) | `Read(offset=448, limit=30)` + `Grep('role: "user"')`→L525 this turn | `9e0da180a6d23ac64b3cc6fe4fde7593e0567389` |
| 10 | ACTIVE wiring — `src/theo/components/TheoMain.tsx` (passes `people` to `ProjectDetail`; adds the same pass to `ChatView`) | `Grep("people=\|<ChatView")` this turn | `2a31c550655bba7407430099fdd104548e50dded` |
| 11 | Shared types — `src/theo/types.ts` (`Message`, `PersistedMessage`, `Person`) | `Read(src/theo/types.ts)` this turn | `07847946594d2162fa5f9c964ebf96dd973dff65` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "declare `PRIMARY REFERENCE: GREENFIELD`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "MUST contain a **Component Contract Table**" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Keep the reference surface's inline-style approach" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| spec/THEO_API_SPEC.md | §2.1 | "created_by" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

Sub-phase track note: this Pass-1 VEP walks F-P1–F-P7 (below); the Rule Anchor Table carries the Conformance §3/§5/§6 anchors (F-P7), the §4B VA-T12 authority (F-P2), the Golden Component Pack CCT/greenfield/prop-convention anchors (F-P4/F-P5), the Governor CCT + inline-style + storage guardrail anchors (F-P6), and the API-Spec §2.1 `created_by` contract anchor (F-P3).

---

## F-P1 — Feature identification

**Feature:** the attributed multi-party render (VA-T12 surface A). In a SHARED conversation each turn shows a BYLINE — the author's roster photo (`Person.photo`; tinted initials fallback) + display name + an "Owner / You" tag — so a reader sees WHO wrote each message. Theo's own turns keep a coral spiral avatar + "Theo". A private single-author conversation is UNCHANGED (bylines suppressed; VA-T1). The composer gains a one-line "your reply posts as <you>" note in a shared thread. Attribution is driven by each message's `created_by` (deployed, API §2.1) resolved via the People roster (§2.9).

**Plan currency (F-P1).** SPW is a Walter-directed extension (design 2026-07-30; the FE program). Backends DEPLOYED + golden-curl-verified; VA-T12 is CURRENT in §4B (this program). See Gap G-1A-PLAN.

**Role vocabulary.** Claude Code authors (Pass 1). Codex reviews (Pass 2). On APPROVED, Claude Code implements on `development` (Pass 3) + emits the SWA test plan; **Walter validates the render on the dev SWA and accepts (Visual Acceptance Evidence).**

---

## F-P2 — UI Authority Reconciliation

- **VA-T12 (SPW Surfaces; §4B, landed 2026-07-30, sha256 `03c2970c…`)** surface A is the authority for the byline + tags + shared-thread composer note. The implementation reproduces it faithfully → **VISUAL-AUTHORITY-MATCH**.
- **VA-T1 (reference surface)** governs everything else and is **unchanged**: the message body layout, the composer, palette (`C`), fonts. In a private single-author thread the surface is byte-for-byte VA-T1 (bylines suppressed). The byline reuses the existing inline-style / `C`-palette idiom.
- No planned VISUAL-AUTHORITY-DEVIATION.

---

## F-P2.5 / Gap Disclosure

Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-1A-PLAN | SPW is not a 1A-Plan feature entry. | **PROCEED** | Walter-directed extension; backends DEPLOYED; VA-T12 registered. |
| G-SHARED-SIGNAL | "Is this thread shared?" — the FE derives it as **multi-author** (`new Set(messages.map(m => m.created_by)).size > 1`), NOT from a published flag (`theo_get_conversation` does not yet return `published_to_project`). | **PROCEED** | Correct + self-contained for the ATTRIBUTION render: bylines are meaningful exactly when ≥2 authors exist. The "Shared in this project" BANNER (which needs the published flag even before a second author posts) is deferred to **2c-iii**, which exposes + owns the publish state. |
| G-OWNER-DERIV | The "Owner" tag = the author of the seq-0 message (the thread starter). | **PROCEED** | `theo_get_conversation` returns messages ordered by seq; message[0].created_by is the conversation's owner (the creator's first turn). Self is `Person.isSelf`. Both → "Owner · you". No new backend. |
| G-LOCAL-SEED | A just-SENT local user turn (before reload) must carry an author or the byline/multiParty is wrong for live continuation (Codex T13). | **PROCEED** | `send()` seeds the local user turn with the confirmed self OID (`people.find(p => p.isSelf)?.id`; the hook already binds this principal at mount) — CCT-4. So live continuation is attributed instantly; the reload path (`paintConversation`) supplies the persisted `created_by`. If the roster hasn't loaded yet (`selfOid` undefined), the turn is unseeded and the byline degrades to "(unknown)" under the `!!m.created_by` guards — no crash, no mistag. |
| G-UNKNOWN-PERSON | A `created_by` OID not in the loaded roster. | **PROCEED** | Falls back to initials from a shortened OID / "(unknown)" — the roster resolution is best-effort (mirrors `ProjectDetail`'s `people.find(...) ?? memberOid`). |
| G-BANNER-NOTE | The "Shared in this project" banner is NOT in this microstep. | **PROCEED (future-trigger)** | 2c-iii (publish control) adds the banner + publish state. |

Per-surface real-in-1A vs true-in-1B: the byline is **live 1B** (real `created_by` + roster); the standalone mock harness has single-author seeds, so bylines never trigger there (multi-author derivation = false) — the harness surface is unchanged.

---

## F-P3 — Backend / contract grounding

No new backend. Consumes deployed contracts:
- **`theo_get_conversation`** (API §2.1) — `messages: [{ id, seq, role, created_by, content, model, citations, media, created_at }]`; `created_by` is the author's Entra OID (landed 2b-3d, this program).
- **`theo_list_people`** (API §2.9) — the roster `Person[]` (`id` = Entra OID, `displayName`, `photo`, `isSelf`), already loaded into `useTheoState.people` at mount. The byline joins `message.created_by` → `people.find(p => p.id === created_by)`.

No service-module change (the data already arrives through the existing gateway). The FE `PersistedMessage` type gains `created_by` (the field is already in the deployed response).

---

## F-P4 — Component reference grounding

**Canonical Primary Reference: `src/theo/components/ChatView.tsx`** (the ACTIVE component being modified) — the message-render region is the structural-mirror target. The new inline **`AuthorByline`** sub-component is **`PRIMARY REFERENCE: GREENFIELD`** — governed by **VA-T12** (surface A) — following ChatView's existing inline-component idiom (`Paperclip`, `MicButton`, `ReadAloudButton`, the avatar idioms) and the `C`-palette inline-style approach. No composite primary reference.

---

## F-P5 — Component Contract Table

One entry per in-scope surface; each locks the three surfaces (complete literal TypeScript prop/input interface — required-before-optional, no `any`; VA-id citation; data/contract dependency) + impl eligibility.

### CCT-1 · `ChatView` — ACTIVE (Theo surface), modified · VA-T12 (surface A byline) + VA-T1 (unchanged chrome) · consumes `Message.created_by` + `people: Person[]` · **PROCEED**

Complete modified prop interface (existing props preserved verbatim; ONE new required prop `people` inserted before the existing optional tail to keep required-before-optional):

```ts
export interface ChatViewProps {
  messages: Message[];
  loading: boolean;
  conversationId: string | null;
  error: string;
  draft: string;
  attachments: ComposerAttachment[];
  attachmentsAvailable: boolean;
  onDraftChange: (s: string) => void;
  onSend: (text?: string) => void;
  onStop: () => void;
  queuedText: string | null;
  onCancelQueued: () => void;
  onAddFiles: (files: FileList | File[]) => void;
  onAddPastedText: (text: string) => boolean;
  onRemoveAttachment: (localId: string) => void;
  chatProject: Project | null;
  assistantName: string;
  greeting: string;
  starters: string[];
  renderAssistant: (content: string) => ReactNode;
  voiceAvailable: boolean;
  recording: boolean;
  transcribing: boolean;
  recordingSeconds: number;
  onStartDictation: () => void;
  onStopDictation: () => void;
  onCancelDictation: () => void;
  playingIdx: number | null;
  synthesizingIdx: number | null;
  onReadAloud: (idx: number, text: string) => void;
  onStopReadAloud: () => void;
  people: Person[];   // NEW — the roster (theo_list_people); resolves each user turn's Message.created_by → Person for the byline
  reviewFund?: string;
  reviewMode?: boolean;
  sigmaMode?: boolean;
  restoring?: boolean;
}
```

Render behaviour (VA-T12 surface A): compute `multiParty = new Set(messages.map(m => m.created_by).filter(Boolean)).size > 1` — because the send path now SEEDS the local user turn with the self OID (CCT-4), this flips true the instant a second author posts, without a reload. If NOT multiParty → no bylines (VA-T1 unchanged). If multiParty: above each USER turn render `<AuthorByline person={m.created_by ? (people.find(p => p.id === m.created_by) ?? null) : null} createdBy={m.created_by} owner={!!m.created_by && m.created_by === messages[0]?.created_by} self={!!m.created_by && (people.find(p => p.id === m.created_by)?.isSelf ?? false)} />` (all guards under `!!m.created_by`, so an unseeded turn degrades gracefully rather than mis-tagging); ASSISTANT turns render the existing Theo byline. In a multiParty thread the composer shows a muted note "You're continuing a shared thread — your reply posts as `{people.find(p => p.isSelf)?.displayName}`".

### CCT-2 · `AuthorByline` — NEW/GREENFIELD (inline in ChatView) · VA-T12 (surface A: 26px roster-photo avatar [initials fallback] + name + "Owner / You" tag) · presentational (no contract) · **PROCEED**

```ts
interface AuthorBylineProps {
  person: Person | null;   // resolved roster person (null → not in the loaded roster, or an unseeded local turn → initials/(unknown) fallback)
  createdBy?: string;      // the message.created_by (OPTIONAL — matches Message.created_by?: string; drives the fallback label when person is null; a still-unseeded local turn → "(unknown)")
  owner: boolean;          // author of the seq-0 turn (the thread starter) → "Owner" tag
  self: boolean;           // Person.isSelf → "You" tag (both owner+self → "Owner · you")
}
```

### CCT-3 · `Message` + `PersistedMessage` — ACTIVE shared types (`src/theo/types.ts`), additive · VA n/a (types) · `theo_get_conversation` messages[].created_by (API §2.1, deployed) · **PROCEED**

Complete literal additions (both additive; `PersistedMessage.created_by` required — the deployed response always includes it; `Message.created_by` optional — locally-built/streaming messages lack it until reload):

```ts
export interface Message { role: Role; content: string; runs?: CitedRun[]; attachments?: SentAttachment[]; thinking?: string; reasoning?: string; tools?: AgentToolCall[]; download?: FileDownload; image?: InlineImage; video?: InlineVideo; tokens?: number; streaming?: boolean; created_by?: string }
export interface PersistedMessage {
  id: string; seq: number; role: Role; content: string;
  created_by: string;   // NEW — the author's Entra OID (theo_get_conversation, §2.1); resolved to a Person for the byline
  model: string | null;
  citations: { url?: string; title?: string; cited_text?: string }[] | null;
  media?: { image?: InlineImage; video?: InlineVideo } | null;
  created_at: string;
}
```

### CCT-4 · `useTheoState` — ACTIVE (state hook), modified · n/a (state, not a rendered surface) · maps `PersistedMessage.created_by` → `Message.created_by` in `paintConversation`; SEEDS the local send turn with the self OID; already owns `people` · **PROCEED**

The hook takes no arguments; its public return contract is UNCHANGED (both `messages: Message[]` and `people: Person[]` already exist on it). Two internal-only changes, both to attribution plumbing:
1. **Reload path** — `paintConversation` (which builds `Message[]` from `d.messages`) additionally maps `created_by: m.created_by` onto each message (both the assistant and user branches).
2. **Live send path (T13 fix)** — `send()` seeds the appended local user turn with the confirmed self OID so a just-sent turn is attributed immediately (no reload) and `multiParty` flips true on the first member reply. Deployed line (blob `9e0da18`, line 525): `const next: Message[] = [...messages, { role: "user", content: userContent, ...(sentAtts.length ? { attachments: sentAtts } : {}) }];` → seed `created_by`: compute `const selfOid = people.find((p) => p.isSelf)?.id;` (the same self row the hook already uses at lines 197/294–297 + `bindPrincipal(self.id)`) and add `...(selfOid ? { created_by: selfOid } : {})` to that user-turn object. The appended assistant placeholder (`{ role: "assistant", content: "" }`) is unchanged (assistant turns render the Theo byline, not `created_by`).

No new return member; the existing `people` is threaded to `ChatView` by `TheoMain` (F-P6).

Every entry locks the three surfaces (complete literal interface, VA-id [VA-T12 or n/a for type/state], contract dependency) + impl eligibility. No `any`.

---

## F-P6 — Repository & active-surface grounding

- Target files are all on the **active surface** (read this turn): `ChatView.tsx`, `useTheoState.ts`, `types.ts`, `TheoMain.tsx`. No deprecated/orphaned code.
- **`TheoMain` wiring (one prop):** the `<ChatView … />` invocation gains `people={t.people}` (the hook already exposes `t.people`; it is already passed to `<ProjectDetail>`). No change to `TheoMain`'s own props.
- **Guardrails honored (Governor §6 / Conformance §6 T26):** the byline is pure render off already-loaded state (no new fetch, no service-module change, no direct backend call); **no `localStorage`/`sessionStorage`**; **inline-style preserved** (the byline uses inline styles + the `C` palette + roster-photo `<img>` / initials, mirroring VA-T12 / ChatView — no Tailwind); no change to `corporate-reporting`/`reporting_*`; `[[ARTIFACT]]` / SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)

- **Visual parity (F-I4):** at Pass 3 the byline reproduces VA-T12 surface A faithfully — the 26px roster-photo avatar (initials fallback), the display name (ink, 650), the "Owner / You" tag (coralSoft / bubble), the muted timestamp, and Theo's spiral byline — no redesign; a private thread is byte-for-byte VA-T1.
- **SWA test plan (F-I5):** on `development` deploy, Walter (dev SWA): (1) open a **private** chat → confirm NO bylines (unchanged VA-T1); (2) open a **shared/multi-author** conversation (owner + a member's turns) → confirm each turn shows the correct author photo + name, the owner tagged "Owner", your own turns tagged "You"; (3) confirm the composer's "your reply posts as <you>" note. Screenshot vs VA-T12 surface A + acceptance note = the Pass-3 Visual Acceptance Evidence.

## Mechanical lint

Mechanical lint run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission>`), verbatim output:

```
PASS  (see commit)
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note

Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Run the §1A hard gates: Component Contract Table completeness (T20 — CCT-1 pastes the complete modified `ChatViewProps` with the single new `people` prop; CCT-2 the full `AuthorByline` interface; CCT-3 the complete `Message` + `PersistedMessage` with the `created_by` additions; CCT-4 the `useTheoState` internal-only change), VA-id registration (T21 — VA-T12 in §4B at HEAD; the ONLY VA cited besides the unchanged VA-T1), contract existence (T22 — `created_by` in API §2.1, deployed; `theo_list_people` §2.9), artifact presence (T25 — this package carried at the HEAD in this note), GCR/Rule-Anchor (T1/T5). Then substance: VISUAL-AUTHORITY-MATCH to VA-T12 surface A; bylines multi-author-derived (a private thread is unchanged VA-T1); no `localStorage`; inline-style preserved; no service/backend change; Gap Disclosure present (T24 — the "Shared in this project" banner is disclosed as deferred to 2c-iii). Verdict APPROVED or REJECTED only.
