# Theo Frontend — SPW Phase 2c-iii-fe + 2c-iv: publish control + "Shared in this project" list: Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (no component code lands this turn; implementation is Pass 3 against the approved Component Contract Table). Completes the visible Shared Project Workspace loop, drawn per the Walter-approved **VA-T12** (surfaces B + A banner + C):
- **2c-iii-fe — publish control (VA-T12 B + A banner):** a "Publish to project" / "Unpublish" item in the chat-header menu (shown ONLY on a conversation the caller OWNS that is linked to a project), a "Shared in <project>" header chip when published, and a "Shared in this project" banner atop the thread. Wired to the DEPLOYED `theo_publish_conversation` / `theo_unpublish_conversation` (§2.2) via the already-shipped service methods (2c-i); the owner + published state come from the newly-exposed `theo_get_conversation` conversation fields `created_by` + `published_to_project` (2c-iii-be, §2.1).
- **2c-iv — "Shared in this project" list (VA-T12 C):** a project-home section listing the project's published conversations (`theo_list_project_conversations`, §2.2) with each author's roster photo/name; a row opens the conversation (the existing `onSelectChat` = `selectRecent`).

The service/gateway/type layer (`publishConversation` / `unpublishConversation` / `listPublishedProjectConversations` + `PublishedConversation`) already shipped (2c-i, `f2f5f1f`); this microstep adds the state, handlers, and UI.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding parent (source baseline): `6e3dbc74380a8b22c92d08f37c93791d7e2e53ec` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; every currency anchor below is a tip-independent blob SHA
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §6 build guardrails) | `Grep("MUST contain a **Component Contract Table**")` + `Grep("Keep the reference surface's inline-style approach")` this turn | `3afec7ea4b13650ce2bf28bf32073179a35e7b24` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (F-P1 currency; SPW is a Walter-directed extension) | carried grounding (this program; blob-anchored) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_get_conversation` conversation `created_by`+`published_to_project`; §2.2 publish contracts; §2.9 roster) | `Grep("published_to_project")` this turn | `ccab715b326ab365551e2e13db7292a1ba1d7dd4` |
| 4 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchors; §6 T20/T25; §4B VA-T12) | `Grep("| VA-T12 | Theo Shared Project Workspace Surfaces |")` this turn | `4f2f42e799be5db31e1e35e523d656ff4c1c057e` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | carried grounding (this program; blob-anchored) | `25cc488091d619d8f6642b10552df0d019a87933` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 primary reference/greenfield; §3 CCT; §4 prop conventions; §5 allowed deltas; §7 visual parity) | `Grep("A row missing any of the three locked surfaces is invalid")` + `Grep("declare \`PRIMARY REFERENCE: GREENFIELD\`")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | **VA-T12 reference surface** — `artifacts/theo-spw-surfaces-reference.jsx` (§4B VA-T12; surfaces B publish control, A banner, C shared list) | registered §4B entry (`Grep` this turn) + authored this program | `188061f9c043acf222f6f610903869438b30b8ba` (sha256 `03c2970c9e0f13b7fdc6d8868578a94c3db561a5d0a3fdd054bcb06f21d52c59`) |
| 8 | ACTIVE menu — `src/theo/components/ConvMenu.tsx` (`ConvMenuItems` — the shared item list) + `ChatMenu.tsx` | `Read(ConvMenu.tsx, offset=15, limit=21)` this turn | `b2bdb99ddb5229a9ef8e4bdec1e7be3c71444a6d` (ConvMenu; ChatMenu `349669a44ee7f01fa0a0efc3309869c8fcac7b0e`) |
| 9 | ACTIVE state — `src/theo/useTheoState.ts` (`paintConversation`/`selectRecent`; `projectChatsState` keyed pattern; `setProjectVisibility` optimistic-handler template; `openProject`) | `Read`(paint/select + projectChatsState + setProjectVisibility) this program/turn | `06b21b5c92072ba45e27e31686d620a560a3320d` |
| 10 | ACTIVE surfaces — `src/theo/components/ChatView.tsx` (thread banner) + `ProjectDetail.tsx` (chats section + `Section` helper) + `TheoMain.tsx` (header chip + wiring) | `Read`(ProjectDetail props/section, TheoMain header) this turn | ChatView `08fe6bdae1108f4e4140b1d9a24a51c110fb6205`; ProjectDetail `e66936164051e9e6e344c1059c6fa3952b479bc8`; TheoMain `f38c6836ed8fa9d5f0128e981b2ac7a2f43addba` |
| 11 | Shared types — `src/theo/types.ts` (`ConversationDetail`, `ConversationSummary`, `PublishedConversation`, `Person`) | `Read(src/theo/types.ts)` this turn | `0c5b943a27168d2e01f5669f321c57b395534e65` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "A VA-id not registered in §4B is invalid as a citation." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "MUST contain a **Component Contract Table**" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "Keep the reference surface's inline-style approach" |
| spec/THEO_API_SPEC.md | §2.2 | "theo_publish_conversation" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

Sub-phase track note: this Pass-1 VEP walks F-P1–F-P7 (below); the Rule Anchor Table carries the Conformance §3/§5/§6 anchors (F-P7), the §4B VA-T12 authority (F-P2), the Golden Component Pack CCT/primary-reference/allowed-delta/prop-convention anchors (F-P4/F-P5), the Governor CCT + inline-style + storage guardrail anchors (F-P6), and the API-Spec §2.2 contract anchor (F-P3).

---

## F-P1 — Feature identification

**Feature:** the publish control + the "Shared in this project" list — the two surfaces that make a published thread reachable + shareable (VA-T12 B/A/C). 2c-iii-fe: publish/unpublish a project-linked conversation you own (chat-menu item + header chip + thread banner). 2c-iv: list a project's published conversations on the project home. Both consume already-deployed backends (§2.2 publish contracts; §2.1 conversation `created_by`/`published_to_project`) through the already-shipped service methods (2c-i).

**Plan currency (F-P1).** SPW is a Walter-directed extension (design 2026-07-30). Backends DEPLOYED + golden-curl-verified; VA-T12 CURRENT in §4B. See Gap G-1A-PLAN.

**Role vocabulary.** Claude Code authors (Pass 1). Codex reviews (Pass 2). On APPROVED, Claude Code implements on `development` (Pass 3); **Walter validates the render on the dev SWA and accepts (Visual Acceptance Evidence).**

---

## F-P2 — UI Authority Reconciliation

- **VA-T12 (SPW Surfaces; §4B, landed, sha256 `03c2970c…`)** is the authority: surface **B** (the "Publish to project" chat-menu item + the "Shared in <project>" header chip), surface **A** (the "Shared in this project" thread banner), surface **C** (the "Shared in this project" project-home list). The implementation reproduces them faithfully → **VISUAL-AUTHORITY-MATCH**.
- **VA-T1** governs everything else and is **unchanged**: the chat menu's existing items, the header, the composer, ProjectDetail's existing sections; the new elements reuse the inline-style / `C`-palette idiom (the menu-item button style, the `chatProject` chip idiom, the `Section` + chat-row idioms).
- No planned VISUAL-AUTHORITY-DEVIATION.

---

## F-P2.5 / Gap Disclosure

Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-1A-PLAN | SPW is not a 1A-Plan feature entry. | **PROCEED** | Walter-directed extension; backends DEPLOYED; VA-T12 registered. |
| G-MENU-SCOPE | `ConvMenuItems` is SHARED by `ChatMenu` (header) AND `RowMenu` (sidebar row). | **PROCEED** | The publish item is gated on OPTIONAL props (`onTogglePublish` + `canPublish` + `published`) that ONLY `ChatMenu` passes (it has the open-conversation owner/published state); `RowMenu` passes none, so the item renders ONLY in the header menu — never the sidebar (which lacks the state to gate it). |
| G-OWNER-GATE | The control is owner-only + project-linked-only. | **PROCEED** | `canPublish = (openConvMeta.created_by === self.id) && (chatProject != null)`; self = `people.find(p => p.isSelf)?.id`. The server independently enforces owner-only on `theo_publish_conversation` (2b-1, 403), so this is UX gating. |
| G-OPEN-META | The open conversation's owner + published state are not held in state today (`currentConversation` is the recents row, which lacks both). | **PROCEED** | A new `openConvMeta: { id, created_by, published_to_project } | null` is captured in `paintConversation` from `d.conversation` (which now carries both fields, 2c-iii-be); publish/unpublish optimistically flip `openConvMeta.published_to_project`. |
| G-OPTIMISTIC | Publish/unpublish are optimistic (the gateway methods return `void`). | **PROCEED** | Mirror `setProjectVisibility`: an in-flight `Set` ref + a `publishPending` state + optimistic flip + rollback-on-catch. No server echo to resync. |
| G-PEOPLE-LOAD | The shared-list authors + the byline resolve `created_by`→`Person` via the roster, but `loadPeople()` currently fires in `openProject` only for OWNER projects. | **PROCEED** | `openProject` will call `loadPeople()` UNCONDITIONALLY (a member opening a shared project also needs author names); the avatar falls back to a raw-OID initial if a person is missing (the members-list idiom). |
| G-BANNER-VS-2cii | 2c-ii already derives multi-author bylines; this adds the "published" BANNER (which shows even before a second author posts). | **PROCEED** | Distinct signals: bylines = multi-author (2c-ii); banner = `published_to_project` (this microstep). Both faithful to VA-T12 A. |

Per-surface real-in-1A vs true-in-1B: **live 1B** (real publish calls + roster). The standalone mock harness returns `[]`/no-ops for the three methods (2c-i) and seeds no published conversations, so the new surfaces are inert there.

---

## F-P3 — Backend / contract grounding

No new backend. Consumes deployed contracts through the already-shipped service methods (2c-i):
- **`theo_publish_conversation` / `theo_unpublish_conversation`** (API §2.2) — `theoClient.publishConversation(id)` / `unpublishConversation(id)` → `Promise<void>` (owner-only server-side; idempotent).
- **`theo_list_project_conversations`** (API §2.2) — `theoClient.listPublishedProjectConversations(projectId)` → `PublishedConversation[]`.
- **`theo_get_conversation`** conversation object (API §2.1) — now carries `created_by` (owner) + `published_to_project` (bool) (2c-iii-be, DEPLOYED). The FE `ConversationDetail.conversation` type gains the two fields (the runtime already returns them; `getConversation` passes `json.data` through unmodified).
- **`theo_list_people`** (API §2.9) — the roster resolves `created_by`/`published_by` → `Person`.

No service-module change (2c-i shipped it).

---

## F-P4 — Component reference grounding

**Canonical Primary Reference: the ACTIVE components being modified** — `ConvMenu.tsx` (the menu-item idiom, structural-mirror target for the publish item — mirrors the Star toggle), `TheoMain.tsx` (the `chatProject` header-chip idiom, mirror for the "Shared" chip), `ProjectDetail.tsx` (the "Chats in this project" section + `Section` helper, mirror for the "Shared in this project" section). No net-new standalone component is a **`PRIMARY REFERENCE: GREENFIELD`**; the small inline additions follow existing inline idioms + VA-T12. No composite primary reference.

---

## F-P5 — Component Contract Table

One entry per in-scope surface; each locks the three surfaces (complete literal TypeScript prop/input interface — required-before-optional, no `any`; VA-id citation; data/contract dependency) + impl eligibility.

### CCT-1 · `ConvMenuItems` — ACTIVE (`src/theo/components/ConvMenu.tsx`), modified · VA-T12 B (publish item; mirrors the Star toggle idiom) · calls `onTogglePublish` (→ `theoClient.publish/unpublishConversation`, API §2.2) · **PROCEED**

Complete modified prop interface (existing required props preserved; three OPTIONAL publish props appended after the existing tail so required-before-optional holds; the publish item renders only when `onTogglePublish && canPublish`):

```ts
export function ConvMenuItems({ conversation, projects, onToggleStar, onAddToProject, onDelete, onStartRename, close, published, canPublish, onTogglePublish }: {
  conversation: ConversationSummary;
  projects: Project[];
  onToggleStar: (id: string, starred: boolean) => void;
  onAddToProject: (id: string, projectId: string) => void;
  onDelete: (id: string) => void;
  onStartRename: () => void;
  close: () => void;
  published?: boolean;                                   // NEW — current publish state (from the open conversation)
  canPublish?: boolean;                                  // NEW — owner AND project-linked; the item shows only when true
  onTogglePublish?: (id: string, publish: boolean) => void;  // NEW — publish (true) / unpublish (false)
}): JSX.Element;
```

Render: when `onTogglePublish && canPublish`, add a menu button (Star-idiom) `{published ? "Unpublish" : "Publish to project"}` that calls `close(); onTogglePublish(conversation.id, !published);`.

### CCT-2 · `ChatMenu` — ACTIVE (`src/theo/components/ChatMenu.tsx`), modified · VA-T12 B · threads the publish props to `ConvMenuItems` · **PROCEED**

Complete modified prop interface (three optional publish props appended; passed straight to `ConvMenuItems`):

```ts
export function ChatMenu({ conversation, projects, onRename, onDelete, onToggleStar, onAddToProject, published, canPublish, onTogglePublish }: {
  conversation: ConversationSummary;
  projects: Project[];
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string, starred: boolean) => void;
  onAddToProject: (id: string, projectId: string) => void;
  published?: boolean;                                   // NEW
  canPublish?: boolean;                                  // NEW
  onTogglePublish?: (id: string, publish: boolean) => void;  // NEW
}): JSX.Element;
```

### CCT-3 · `ChatView` — ACTIVE, modified · VA-T12 A (thread banner) + VA-T1 (unchanged) · consumes a `sharedProjectName` signal · **PROCEED**

Complete modified prop interface (ONE new optional prop `sharedProjectName` appended after the existing optional tail; when a non-empty string, the thread renders the "Shared in {name}" banner at the top — VA-T12 A):

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
  people: Person[];
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
  reviewFund?: string;
  reviewMode?: boolean;
  sigmaMode?: boolean;
  restoring?: boolean;
  sharedProjectName?: string | null;   // NEW — SPW 2c-iii: when set, render the "Shared in {name}" banner atop the thread (VA-T12 A)
}
```

### CCT-4 · `ProjectDetail` — ACTIVE (`src/theo/components/ProjectDetail.tsx`), modified · VA-T12 C ("Shared in this project" list) · consumes `published: PublishedConversation[]` + `onSelectChat` · **PROCEED**

Complete modified prop interface (ONE new required prop `published` inserted before the existing optional/handler tail is unnecessary — all existing props stay; `published` appended as required since the list is always supplied, and empty-array renders the empty state):

```ts
export interface ProjectDetailProps {
  project: Project;
  chats: ConversationSummary[];
  kdraft: KDraft;
  onKdraftChange: (next: KDraft) => void;
  onAddKnowledge: () => void | Promise<void>;
  onAddKnowledgeFile: (file: File) => void | Promise<void>;
  onRemoveKnowledge: (kid: string) => void;
  onPatchInstructions: (text: string) => void;
  onStartChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onDeleteChat: (id: string) => void;
  onPatchDescription: (text: string) => void;
  onSetVisibility: (id: string, visibility: "private" | "group") => void;
  visibilityBusy: boolean;
  members: ProjectMember[];
  people: Person[];
  onShareMember: (projectId: string, memberOid: string) => void;
  onUnshareMember: (projectId: string, memberOid: string) => void;
  memberPendingKey: string | null;
  published: PublishedConversation[];   // NEW — SPW 2c-iv: the project's published conversations (theo_list_project_conversations). Renders the "Shared in this project" section; a row → onSelectChat(id).
}
```

Render: a "Shared in this project" block (mirroring the "Chats in this project" list idiom) — each row = the author's roster photo/name (`people.find(p => p.id === pub.created_by)`, fallback to a raw-OID initial) + the conversation title + a muted "shared / updated" meta; row click → `onSelectChat(pub.id)`. Empty `published` → a muted empty state.

### CCT-5 · `TheoMain` — ACTIVE (`src/theo/components/TheoMain.tsx`), modified · VA-T12 B (header "Shared in {project}" chip) · wires the new state/handlers · **PROCEED**

Complete `TheoMainProps` interface — **UNCHANGED** by this microstep (pasted in full for T20; the modifications are wiring-only inside the body, no prop added/removed):

```ts
export interface TheoMainProps {
  t: ReturnType<typeof useTheoState>;
  mode: "full" | "panel";              // "full" = 9/10 landing; "panel" = in-app right-docked panel (Origin host)
  suppressNarrowHeader?: boolean;      // Apps Phase B / B1 (VA-T6 §4.1): hide this view's 54px header on narrow viewports
}
```

Modifications (wiring only inside the body; the prop surface above is unchanged):
- The chat header gains a "Shared in {`t.chatProject.name`}" chip (VA-T12 B idiom = the existing `chatProject` chip) rendered when `t.chatPublished`.
- The `<ChatMenu … />` invocation gains `published={t.chatPublished} canPublish={t.chatCanPublish} onTogglePublish={t.togglePublishConversation}`.
- The `<ChatView … />` invocation gains `sharedProjectName={t.chatPublished ? (t.chatProject?.name ?? null) : null}`.
- The `<ProjectDetail … />` invocation gains `published={t.publishedConvs}`.

### CCT-6 · `useTheoState` — ACTIVE (state hook), modified · n/a (state) · optimistic publish (`theoClient.publish/unpublishConversation`) + `listPublishedProjectConversations`; open-conv meta from `theo_get_conversation` (§2.1) · **PROCEED**

The hook takes no arguments. New INTERNAL state + these ADDED public return members (complete literal types; existing members unchanged):

```ts
// NEW public return members:
chatPublished: boolean;                 // the open conversation is published_to_project (from openConvMeta)
chatCanPublish: boolean;                // owner (openConvMeta.created_by === self oid) AND project-linked (chatProject != null)
togglePublishConversation: (id: string, publish: boolean) => Promise<void>;   // optimistic publish/unpublish (mirrors setProjectVisibility)
publishedConvs: PublishedConversation[];    // the open project's published conversations (keyed to detailId, à la projectChats)
```

Internal (non-contract): `openConvMeta: { id: string; created_by: string | null; published_to_project: boolean } | null` captured in `paintConversation` from `d.conversation.created_by` / `d.conversation.published_to_project`; `publishReq: useRef<Set<string>>` + `publishPending` for the in-flight guard; `publishedConvsState: { projectId; conversations } | null` + `publishedConvsReq: useRef<string|null>` + `loadPublishedProjectConversations(id)` (mirrors `projectChatsState`/`loadProjectChats`); `openProject` additionally sets `publishedConvsReq.current = id; setPublishedConvsState(null); void loadPublishedProjectConversations(id);` and calls `loadPeople()` UNCONDITIONALLY (not only for owner projects). `togglePublishConversation` mirrors `setProjectVisibility` exactly (in-flight `Set` + optimistic flip of `openConvMeta.published_to_project` + rollback-on-catch), calling `theoClient.publishConversation` / `unpublishConversation`.

### CCT-7 · `ConversationDetail` — ACTIVE shared type (`src/theo/types.ts`), additive · VA n/a (type) · `theo_get_conversation` conversation `created_by` + `published_to_project` (API §2.1, DEPLOYED 2c-iii-be) · **PROCEED**

Complete literal addition (the two fields added to the `conversation` intersection; optional to tolerate any pre-migration/mock rows, though the deployed server always returns them; no mapper change — `getConversation` passes `json.data` through):

```ts
export interface ConversationDetail {
  conversation: ConversationSummary & { app_context?: Record<string, unknown> | null; created_by?: string; published_to_project?: boolean };
  messages: PersistedMessage[];
}
```

Every entry locks the three surfaces (complete literal interface, VA-id [VA-T12 or n/a for type/state], contract dependency) + impl eligibility. No `any`.

---

## F-P6 — Repository & active-surface grounding

- Target files are all on the **active surface** (read this turn / this program): `ConvMenu.tsx`, `ChatMenu.tsx`, `ChatView.tsx`, `ProjectDetail.tsx`, `TheoMain.tsx`, `useTheoState.ts`, `types.ts`. No deprecated/orphaned code. The service layer (`theoClient`/`gateway.live`/`gateway.mock`) is untouched (2c-i shipped it).
- **Guardrails honored (Governor §6 / Conformance §6 T26):** publish/unpublish route through the **single service module** (`theoClient.publish/unpublishConversation`; no scattered `fetch`); **no `localStorage`/`sessionStorage`**; **inline-style preserved** (menu item, chip, banner, list rows use inline styles + the `C` palette + roster-photo `<img>`/initials, mirroring VA-T12 / existing idioms — no Tailwind); no change to `corporate-reporting`/`reporting_*`; `[[ARTIFACT]]` / SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)

- **Visual parity (F-I4):** at Pass 3 the publish item, header chip, thread banner, and "Shared in this project" list reproduce VA-T12 (B/A/C) faithfully — palette, `SANS`, the menu-item + chip + section idioms, roster-photo avatars — no redesign; a non-owner / non-project / private conversation shows no publish item + no banner (VA-T1 unchanged).
- **SWA test plan (F-I5) — the end-to-end loop:** on `development` deploy, Walter (dev SWA) + one colleague (or a second login): (1) on a project-linked chat you own → the chat menu shows "Publish to project"; click → the header shows "Shared in {project}" + the thread shows the banner + the menu flips to "Unpublish"; (2) open the project home → the chat appears under "Shared in this project" with your photo/name; (3) the colleague (a project member) opens it from that list + replies → both see the attributed bylines (2c-ii) + the banner; (4) "Unpublish" → the chip/banner clear + it leaves the shared list. Screenshots vs VA-T12 + acceptance note = the Pass-3 Visual Acceptance Evidence.

## Mechanical lint

Mechanical lint run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission>`), verbatim output:

```
PASS  Codex Governance/Theo-Frontend-SPW-2c-iii-iv-Publish-Control-And-Shared-List-Pass-1-VEP/Theo_Frontend_SPW_2ciii_iv_Publish_Control_And_Shared_List_Pass_1_VEP.md
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note

Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Run the §1A hard gates: Component Contract Table completeness (T20 — CCT-1..CCT-7 paste complete literal interfaces/inputs; state-only CCT-6 lists the added return members with types + the internal open-conv-meta/publishedConvs plumbing), VA-id registration (T21 — VA-T12 in §4B at HEAD; the only VA cited besides unchanged VA-T1), contract existence (T22 — publish contracts §2.2 + conversation created_by/published_to_project §2.1, all DEPLOYED this program), artifact presence (T25 — this package carried at the HEAD in this note), GCR/Rule-Anchor (T1/T5). Then substance: VISUAL-AUTHORITY-MATCH to VA-T12 (B/A/C); owner+project gating for the publish item (canPublish); the publish item is gated to the header menu only (optional props ConvMenuItems shares with RowMenu, which passes none); optimistic publish mirrors setProjectVisibility (in-flight guard + rollback); publishedConvs mirrors projectChats (keyed to detailId, loaded unconditionally); loadPeople unconditional in openProject; no localStorage; inline-style; single service module (no new fetch). Gap Disclosure present (T24). Verdict APPROVED or REJECTED only.
