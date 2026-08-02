# Theo Frontend — SPW Phase 2c-i: publish-to-project service layer: Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (no component code lands this turn; implementation is Pass 3 against the approved Component Contract Table). Adds the **service-module plumbing** for the Shared Project Workspace publish feature — three methods on the single service seam (`theoClient` → `gateway.live` + `gateway.mock`) wired to the DEPLOYED `theo_publish_conversation` / `theo_unpublish_conversation` / `theo_list_project_conversations` backends (API §2.2, all deployed + golden-curl-verified this program) — plus one additive shared type (`PublishedConversation`). **No visual surface is touched** (VA-T1 unchanged) — this is the foundation the visual steps (2c-ii attribution, 2c-iii publish control, 2c-iv shared list) consume. Standalone harness stays green via mock stubs.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding parent (source baseline): `d8c0d9c03d172e6d6f47aaee98fa0d3144ab84b4` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; every currency anchor below is a tip-independent blob SHA unaffected by the carrying commit
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §6 build guardrails) | `Grep("MUST contain a **Component Contract Table**")` + `Grep("No \`localStorage\` / \`sessionStorage\`")` this turn | `3afec7ea4b13650ce2bf28bf32073179a35e7b24` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (F-P1 currency; SPW is a Walter-directed extension) | carried grounding (this program; blob-anchored) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 3 | Theo API Spec — `spec/THEO_API_SPEC.md` (§2.2 publish contracts — `theo_publish_conversation`/`theo_unpublish_conversation`/`theo_list_project_conversations`, all DEPLOYED) | `Grep("theo_publish_conversation")` + `Grep("conversations: [{ id, title, created_by, created_at, updated_at, published_at, published_by }]")` this turn | `fc0443eee2b598d8026cb40e073d4bc115a4a31e` |
| 4 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchors; §6 T20/T25; §4B VA registry) | `Grep("MUST open with a table of the form:")` + `Grep("citing a VA-id path not registered here is automatically invalid")` this turn | `1e6213e404dbd16f70798f701ae1df36cbc9af25` |
| 5 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `25cc488091d619d8f6642b10552df0d019a87933` |
| 6 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 Primary Reference/greenfield; §3 CCT; §4 prop conventions; §5 allowed deltas — service-module wiring) | `Grep("A row missing any of the three locked surfaces is invalid")` + `Grep("wiring an inline call to the service-module/gateway abstraction")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 7 | VA-T1 reference surface — `frontend/theo-frontend-reference.jsx` (§4B VA-T1; cited only as UNCHANGED — no visual surface in this microstep) | registered §4B entry (F-P2); no rendered surface touched | `433f6236344f6e8bdbc49db85a53036427610fed` |
| 8 | ACTIVE service seam — `src/theo/services/theoClient.ts` (the public boundary object; the 3 new methods are added beside `setConversationProject`/`listProjectConversations`) | `Read(src/theo/services/theoClient.ts, offset=90, limit=80)` this turn | `c262bd22abc6c94b4e8b94993a380cc7aabc2c56` |
| 9 | ACTIVE service impl — `src/theo/services/gateway.live.ts` (live HTTP; the 3 new free functions follow the `projectsBase` + `authHeaders()` idiom of `shareProject`/`setConversationProject`) | `Read(gateway.live.ts)` (this program: base-URL model + projectsBase methods) | `f0743643d59ff4905d2be188ed6f77b3e0eba9f0` |
| 10 | ACTIVE service mock — `src/theo/services/gateway.mock.ts` (standalone stubs; the 3 new methods stubbed like `listProjectConversations`→`[]` / `setConversationProject`→no-op) | `Read(gateway.mock.ts)` (this program: mock fallback pattern) | `a8dde065a9299c2ea100a0ca2d1c99addd453d7d` |
| 11 | Shared types — `src/theo/types.ts` (exact `ConversationSummary` shape; the additive `PublishedConversation` type) | `Read(src/theo/types.ts)` + `Grep("export interface ConversationSummary")` this turn | `bc2654bb2ce6b4dacb26e48e5bef3d57448a645b` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "declare `PRIMARY REFERENCE: GREENFIELD`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "A row missing any of the three locked surfaces is invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "MUST contain a **Component Contract Table**" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| spec/THEO_API_SPEC.md | §2.2 | "theo_publish_conversation" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

Sub-phase track note: this Pass-1 VEP walks F-P1–F-P7 (below); the Rule Anchor Table carries the Conformance §3/§5/§6 anchors (F-P7), the §4B VA authority (F-P2 — VA-T1 unchanged), the Golden Component Pack CCT/primary-reference/allowed-delta/prop-convention anchors (F-P4/F-P5), the Governor CCT + build-guardrail anchors (F-P6), and the API-Spec §2.2 contract anchor (F-P3).

---

## F-P1 — Feature identification

**Feature:** the FE **service layer** for Shared Project Workspace publish — a Walter-directed program (SPW, 2026-07-30). Three new methods on the single service seam:
- **`publishConversation(conversationId)`** → `POST /api/theo_publish_conversation` — an owner publishes their project-linked conversation into the project.
- **`unpublishConversation(conversationId)`** → `POST /api/theo_unpublish_conversation` — revert to private.
- **`listPublishedProjectConversations(projectId)`** → `GET /api/theo_list_project_conversations?projectId=` — the conversations published to a project, visible to any participant.

Plus one additive shared type — **`PublishedConversation`** — mirroring the deployed list row (the existing `ConversationSummary` lacks `created_by`/`published_at`/`published_by`, so a distinct type is required). **No rendered surface** in this microstep; it is the plumbing the visual steps consume (2c-ii/iii/iv).

**Plan currency (F-P1).** The SPW program is a Walter-directed extension (design 2026-07-30), same footing as the Sigma-FE / voice / mobile passes; its backends are DEPLOYED + golden-curl-verified this program (API §2.2). A 1A-Plan Role-C row is an optional documentation follow-up (Gap G-1A-PLAN).

**Role vocabulary.** Claude Code authors (Pass 1). Codex reviews (Pass 2). On APPROVED, Claude Code implements on `development` (Pass 3); since this microstep has **no visual surface**, its Pass-3 acceptance is a build-green + a standalone-harness smoke (no SWA screenshot — F-P7).

---

## F-P2 — UI Authority Reconciliation

- **No visual surface is touched.** This microstep adds service-module methods + one type only; it renders nothing. **VA-T1 (reference surface; §4B, landed, sha256 `fe473eed…`)** governs the surface and is **entirely unchanged** → VISUAL-AUTHORITY-MATCH (trivially — no rendered delta). No VA-id is cited in the CCT because there is no rendered component; per Conformance §4B, only a registered VA-id may be cited, and none is needed here.
- No planned VISUAL-AUTHORITY-DEVIATION.

---

## F-P2.5 / Gap Disclosure

Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-1A-PLAN | SPW is not a feature entry in the 1A Frontend Plan. | **PROCEED** | Walter-directed extension (design 2026-07-30); backends DEPLOYED (API §2.2). An optional plan Role-C row is a documentation follow-up. |
| G-PROJECTSBASE | The three endpoints are on `vaultgpt-func-projects`, reached via `projectsBase`. | **PROCEED** | `gateway.live` already routes every project-domain call (`shareProject`, `setConversationProject`, `listProjects`, …) through `projectsBase` + `authHeaders()` Bearer; the three new methods reuse exactly that base + auth. Publish/unpublish mirror `shareProject` (projectsBase POST, `{ conversation_id }` body); the list mirrors `listProjectMembers` (projectsBase GET `?projectId=`). |
| G-LISTNAME | An existing `listProjectConversations` maps to `theo_list_conversations?projectId` (the owner's OWN chats in a project). | **PROCEED** | The new method is named **`listPublishedProjectConversations`** to avoid the collision; it maps to the distinct `theo_list_project_conversations` (published/shared). |
| G-MOCK | Standalone harness (no token) uses `gateway.mock`. | **PROCEED** | The three methods are stubbed in `gateway.mock` (publish/unpublish → resolved `void`; `listPublishedProjectConversations` → `[]`), mirroring `listProjectConversations`→`[]` / `setConversationProject`→no-op, so the harness build + mock imports stay green. |
| G-VISUAL | The visible surfaces (publish control, shared list, attribution) are NOT in this microstep. | **PROCEED (future-trigger)** | 2c-ii (attribution render), 2c-iii (publish control), 2c-iv (shared-in-project list) are subsequent FE VEPs, each with its own VA-cited CCT + SWA Visual Acceptance Evidence. |

Per-surface real-in-1A vs true-in-1B: these are **live 1B** calls (DEPLOYED backends) through the service module; the standalone harness (no token) uses the mock stubs (mirroring `attachmentsAvailable()` / `listProjectConversations`).

---

## F-P3 — Backend / contract grounding

All three contracts DEPLOYED + golden-curl-verified this program (API Spec §2.2), called live through the service module (`theoClient` → `gateway.live`, `projectsBase` + Bearer):

- **`POST /api/theo_publish_conversation`** — `{ conversation_id }` → **200** `{ conversation_id, published: true }` (conversation-owner-only; 403 non-owner; 400 unlinked; 404 absent; 401 unauth).
- **`POST /api/theo_unpublish_conversation`** — `{ conversation_id }` → **200** `{ conversation_id, published: false }` (owner-only; idempotent).
- **`GET /api/theo_list_project_conversations?projectId=<uuid>`** — **200** `{ conversations: [{ id, title, created_by, created_at, updated_at, published_at, published_by }] }` (any participant; 404 no access).

The three new service-module methods (gateway abstraction; no scattered `fetch`) each delegate to a new `gateway.live` free function that `fetch`es `${projectsBase}/api/theo_*` with `authHeaders()`, mirroring `shareProject`/`listProjectMembers`; availability gates on `isLive()`. Consumed fields: publish/unpublish read nothing back (the FE tracks published state optimistically — 2c-iii); the list maps every returned field into `PublishedConversation` (F-P5 CCT-2).

---

## F-P4 — Component reference grounding

**Canonical Primary Reference: `src/theo/services/theoClient.ts` + `gateway.live.ts`** (the ACTIVE service seam being modified) — the structural-mirror targets are the deployed project-domain methods `shareProject` (projectsBase POST `{ … }` → `void`) and `listProjectMembers` (projectsBase GET `?projectId=` → mapped rows). The three new methods reproduce that exact idiom; **no greenfield component** (this is service code, not a rendered component — no `PRIMARY REFERENCE: GREENFIELD` needed). The additive `PublishedConversation` type mirrors the deployed `ConversationSummary` shape convention in `types.ts`.

---

## F-P5 — Component Contract Table

Service-seam microstep: the "components" are the service module + the shared type. Each entry locks the three surfaces (complete literal TypeScript interface — required-before-optional, no `any`; VA-id citation — n/a for service/type; data/contract dependency) + impl eligibility.

### CCT-1 · `theoClient` + `gateway.live` + `gateway.mock` — ACTIVE (single service seam), modified · VA n/a (service module, no rendered surface) · `POST /api/theo_publish_conversation` + `POST /api/theo_unpublish_conversation` + `GET /api/theo_list_project_conversations` (API §2.2, DEPLOYED), via `projectsBase` + `authHeaders()` · **PROCEED**

Complete new method interface added to the `theoClient` object (existing methods unchanged; each forwards to a same-named `gateway.live` free function, with a `gateway.mock` fallback via `isLive()`):

```ts
interface TheoClientPublishAdditions {
  publishConversation(conversationId: string): Promise<void>;
  unpublishConversation(conversationId: string): Promise<void>;
  listPublishedProjectConversations(projectId: string): Promise<PublishedConversation[]>;
}
```

`gateway.live` free-function signatures (added; `projectsBase` + `authHeaders()`; `isLive()`-gated with a `gateway.mock` fallback):

```ts
export async function publishConversation(conversationId: string): Promise<void>;         // POST ${projectsBase}/api/theo_publish_conversation { conversation_id }
export async function unpublishConversation(conversationId: string): Promise<void>;       // POST ${projectsBase}/api/theo_unpublish_conversation { conversation_id }
export async function listPublishedProjectConversations(projectId: string): Promise<PublishedConversation[]>;  // GET ${projectsBase}/api/theo_list_project_conversations?projectId= → maps data.conversations
```

`gateway.mock` stub signatures (added; standalone harness):

```ts
export async function publishConversation(conversationId: string): Promise<void>;         // no-op resolve
export async function unpublishConversation(conversationId: string): Promise<void>;       // no-op resolve
export async function listPublishedProjectConversations(projectId: string): Promise<PublishedConversation[]>;  // resolve []
```

### CCT-2 · `PublishedConversation` — NEW shared type (`src/theo/types.ts`), additive · VA n/a (type) · maps the deployed `theo_list_project_conversations` row (API §2.2) · **PROCEED**

Complete literal interface (additive; all fields required except the nullable publish provenance, mirroring the deployed row; no `any`):

```ts
export interface PublishedConversation {
  id: string;
  title: string | null;
  created_by: string;          // the author's Entra OID (FE resolves to a display name via the People roster in 2c-ii/2c-iv)
  created_at: string;
  updated_at: string;
  published_at: string | null; // publish provenance
  published_by: string | null; // who published it (Entra OID)
}
```

Every entry locks the three surfaces (complete literal interface, VA-id [n/a — service/type], contract dependency) + impl eligibility. No `any`.

---

## F-P6 — Repository & active-surface grounding

- Target files are all on the **active surface** (read this turn / this program): `src/theo/services/theoClient.ts`, `src/theo/services/gateway.live.ts`, `src/theo/services/gateway.mock.ts`, `src/theo/types.ts`. No deprecated/orphaned code.
- **Guardrails honored (Governor §6 / Conformance §6):** the three calls route through the **single service module** + gateway abstraction (no scattered `fetch`, no direct browser→backend call outside the gateway); **no `localStorage`/`sessionStorage`**; no visual/style change (no rendered surface); no change to `corporate-reporting`/`reporting_*`; `[[ARTIFACT]]` / SWAP BLOCK untouched. The mock stubs keep the standalone harness build green (the live functions reference the mock imports unconditionally).

---

## F-P7 — Visual-parity + acceptance plan (Pass-3 obligations, previewed)

- **No visual parity obligation** (F-I4 n/a): this microstep renders nothing; VA-T1 is unchanged.
- **Acceptance plan (F-I5, service-only):** at Pass 3 on `development`, acceptance = (1) `tsc` typecheck green (`tsc -p tsconfig.app.json`), (2) the dev-SWA build succeeds, (3) a standalone-harness smoke (the app still loads; mock stubs resolve). No SWA screenshot is required (no rendered surface). The visible SWA Visual Acceptance Evidence arrives with 2c-ii/iii/iv.

## Mechanical lint

Mechanical lint run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission>`), verbatim output:

```
PASS  (see commit)
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note

Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Run the §1A hard gates: Component Contract Table completeness (T20 — CCT-1 pastes the complete literal method interfaces for the service seam; CCT-2 the complete literal `PublishedConversation` type; VA-id is n/a for a service/type microstep, explicitly noted), contract existence (T22 — all three routes in API §2.2, DEPLOYED + golden-curl-verified this program), artifact presence (T25 — this package is carried at the HEAD named here; the package directory lands at the commit in this note), GCR/Rule-Anchor (T1/T5). Then substance: single-service-module + gateway abstraction (no scattered fetch); no `localStorage`; no visual surface touched (VA-T1 unchanged); Gap Disclosure present (T24). This is service plumbing only — the visible surfaces (attribution, publish control, shared list) are the subsequent 2c-ii/iii/iv VEPs. Verdict APPROVED or REJECTED only.
