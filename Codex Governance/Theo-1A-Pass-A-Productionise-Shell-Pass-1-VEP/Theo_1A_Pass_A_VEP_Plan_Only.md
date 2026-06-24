# Theo Phase 1A — Pass A — Productionise the Shell — Pass 1 Frontend VEP (PLAN-ONLY)

**Microstep:** productionise the canonical reference surface (`frontend/theo-frontend-reference.jsx`, VA-T1) into the `vault-theo` repo as a real, typed, component-structured **Theo** shell — faithfully reproduced — with every backend-bound call routed through a single service/contracts module and a **mocked gateway abstraction** (no direct browser→model call). Theo-branded (surgical).
**Pipeline pass:** Pass 1 — Frontend Verified Evidence Pack (plan-only). **No implementation in this turn.**
**Primary editable repo (authoring/grounding HEAD):** `walnic13/vault-theo` · `development` @ `451a4c687b0066a8f61f98bb970bd3c4a4e533f7`.
**Reviewer:** Codex (Pass 2).

> **GATE RESULT (preview): PROCEED** for Pass A = handover §2.1 (lift + componentize), §2.2 (mocked gateway abstraction), §2.3 (single service/contracts module), §2.5 (no browser storage), §5 (SWAP BLOCK, Theo-branded). **DEFERRED to Pass B (explicit, governed):** handover §2.4 the app-context chip + §4 the additive `vault-origin` context-broadcast/mount wiring. No surface is deferred — Chats/Recents/Projects/Project-knowledge/Artifacts/Customize are all built and interactive in Pass A; the app-context *layer* is the one added piece, scoped to Pass B because it also touches `vault-origin`.

## Grounding Conformance Receipt (Frontend Conformance §3)

```
Role: Claude Code
Turn-type: Pass 1 — Frontend Verified Evidence Pack (plan-only)
Turn issued against HEAD: vault-theo development 451a4c687b0066a8f61f98bb970bd3c4a4e533f7
Grounding mode: Full Baseline Grounding
```

| # | Document (repo · path) | Section read this turn | Currency anchor (verbatim substring / hash) |
|---|---|---|---|
| 1 | vault-theo · `frontend/theo-frontend-reference.jsx` (VA-T1) | full (528 lines) | sha256 `fe473eed3364505824639d3ef0c9fd0059f2d1ae164ae22976fc3268aed33f2a`; `const ASSISTANT_NAME = "Claude";` |
| 2 | vault-theo · `governance/THEO_1A_FRONTEND_HANDOVER.md` (VA-T3) | full (§0–§8) | "isolate every backend-bound call behind a service boundary now." |
| 3 | vault-theo · `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` | §4A.1 (F-P1–F-P7); §4B (VA registry); §6 (triggers) | "the §4A.1 sub-phase walk F-P1–F-P7" |
| 4 | vault-theo · `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | §2–§6 (gates, CCT, UI authority, gap disclosure, build guardrails) | "Every backend-bound call (chat, projects, artifacts, settings, retrieval) routes through one services/contracts module" |
| 5 | vault-theo · `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` | §2–§7 (primary reference, CCT format, prop conventions, deltas, mirror, parity) | "converting the inline-style system to Tailwind/CSS-in-JS in 1A is a **DEVIATION** and prohibited" |
| 6 | vault-theo · `spec/THEO_API_SPEC.md` | §1–§3 (contract surface 1A→1B) | "Standard Anthropic Messages API (`model`, `max_tokens`, `system`, `messages[]`)" |
| 7 | vault-theo · `governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` (VA-T2) | §2 (gateway), §8.1–§8.3 (frontend-first, substrate) | "the frontend builds against **contracts**, not handlers" |

## Rule Anchor Table (Frontend Conformance §5)

| # | Source doc | Clause | Verbatim quote | Applied in output at |
|---|---|---|---|---|
| 1 | VA-T3 1A Handover | §2.1 | "split the monolith into components (`Sidebar`, `ChatView`, `ProjectsView`, `ProjectDetail`, `ArtifactsView`, `Customize`, `ArtifactPanel`, shared `Formatted`/icons)" | §2 Component Contract Table decomposition |
| 2 | VA-T3 1A Handover | §0.1 | "do not convert the styling to Tailwind or a CSS-in-JS library during 1A" | §2 (all rows: AD-visual = inline-style preserved); §6 guardrails |
| 3 | VA-T3 1A Handover | §2.2 | "replace it with a call to the vault-theo server-side gateway … In 1A the gateway can be a **mock/stub**" | §3 service module + mocked gateway |
| 4 | VA-T3 1A Handover | §2.3 | "route them through a single contracts/services module (not scattered inline)" | §3 single service module |
| 5 | VA-T3 1A Handover | §2.2 | "Preserve the artifact-marker parsing (`parseArtifacts`, the `[[ARTIFACT ...]]` protocol) exactly" | §3 (parseArtifacts preserved verbatim) |
| 6 | VA-T3 1A Handover | §2.5 | "no `localStorage` / `sessionStorage`" | §6 guardrails; CCT contract-dependency = in-memory |
| 7 | VA-T3 1A Handover | §5 | "flip to `ASSISTANT_NAME = "Theo"`" | §4 branding (surgical) |
| 8 | FE Golden Component Pack | §3 | "One row per component in scope. Each row locks three surfaces" | §2 Component Contract Table format |
| 9 | FE Golden Component Pack | §2 | "the named substrate is `frontend/theo-frontend-reference.jsx`" | §2 PRIMARY REFERENCE = VA-T1 (not greenfield) |
| 10 | FE Golden Component Pack | §4 | "no `any` (use a precise type or a discriminated union)" | §2 prop interfaces; §2A shared types |
| 11 | FE Governor | §6.1 | "The model call routes through a gateway abstraction (mock in 1A), never a direct browser→Anthropic/Foundry call" | §3 mocked gateway |
| 12 | FE Governor | §4 | "reproduce it faithfully, do not redesign" | §2 (all rows VISUAL-AUTHORITY-MATCH); §5 acceptance |
| 13 | FE Conformance | §4B | VA-T1 row "CURRENT — landed byte-preserving; sha256 verified" | §2 VA-id citations (registered) |
| 14 | Theo API Spec | §2.1 | "`1A-contract` (mock gateway) / `1B-deployed` (`POST /api/theo/message`)" | §3 chat contract dependency |
| 15 | VA-T2 Architecture | §2.2 | "The gateway is the **only** component that holds model credentials." | §3 (browser never holds credential; mock has none) |

## Pass / Sub-Phase Walk (F-P1–F-P7)

- **F-P1 Feature identification** — §1 below; Theo Phase 1A per VA-T3 handover; this is Pass A of the 1A productionisation. (Theo Phase 1A Frontend Plan as a standalone doc is not yet authored; VA-T3 handover is the governing 1A scope authority — see Gap Disclosure.)
- **F-P2 UI authority reconciliation** — §2/§5; reconciled against VA-T1 (reference surface), VA-T2 (architecture §2/§8), VA-T3 (handover). No visual deviation planned (faithful reproduction); zero VISUAL-AUTHORITY-DEVIATION rows.
- **F-P2.5 Gap disclosure** — §5 Gap Disclosure (PROCEED, with the app-context layer scoped to Pass B; "Theo Phase 1A Frontend Plan" doc gap noted).
- **F-P3 Backend/contract grounding** — §3; Theo API Spec §2.1–§2.4; all `1A-contract` (mocked); gateway uses the Anthropic Messages API shape.
- **F-P4 Component reference grounding** — PRIMARY REFERENCE = VA-T1 `frontend/theo-frontend-reference.jsx` (full-read this turn; sha-verified), per Golden Component Pack §2 (not greenfield — the substrate exists).
- **F-P5 Component Contract Table assembly** — §2 (canonical Golden Component Pack §3 format; prop interface + VA-id + contract dependency per row).
- **F-P6 Repository & active-surface grounding** — §6; target = `vault-theo/src/` (the active Vite+React+TS scaffold); no deprecated code; no browser storage; inline-style surface preserved (no Tailwind conversion).
- **F-P7 VEP assembly** — this document (GCR §3 + Rule Anchor Table §5 + CCT §2 per FE Governor §3 / FE Conformance §4A.1).

---

## 1. Feature identification + scope

**Microstep:** Pass A of Theo Phase 1A — productionise the reference surface (VA-T1) into `vault-theo` as `TheoShell`, faithfully reproduced, typed (TSX), component-split, with a single service/contracts module + mocked gateway, Theo-branded. Lands in `vault-theo/src/` on a dedicated dev branch (handover §1).

**In scope (Pass A):** handover §2.1, §2.2, §2.3, §2.5, §5 → acceptance criteria §7 items 1, 2, 3, 4, 6, 7.
**Deferred to Pass B (governed):** handover §2.4 (app-context chip) + §4 (`vault-origin` context-broadcast + Theo mount point) → acceptance criterion §7 item 5. Reason: the app-context layer is an added piece that also requires an additive change in a second repo (`vault-origin`); isolating it keeps Pass A a single-repo faithful-reproduction unit.

## 2. Component Contract Table (canonical — Golden Component Pack §3)

```
COMPONENT CONTRACT TABLE
Microstep: Theo 1A Pass A — Productionise the Shell (PLAN-ONLY)
PRIMARY REFERENCE: VA-T1 frontend/theo-frontend-reference.jsx (substrate; NOT greenfield — Golden Component Pack §2)
```

**§2A Shared types (TS; mirror the reference's in-memory shapes exactly; no `any`):**
```ts
type Role = 'user' | 'assistant';
interface Message { role: Role; content: string }
interface Knowledge { id: string; title: string; content: string }
interface Project { id: string; name: string; desc: string; updated: string; instructions: string; knowledge: Knowledge[] }
type ArtifactType = 'document' | 'code' | 'html';
interface ArtifactVersion { content: string; ts: number }
interface Artifact { id: string; title: string; type: ArtifactType; versions: ArtifactVersion[] }
interface Style { key: 'normal' | 'concise' | 'explanatory' | 'formal'; label: string; desc: string; mod: string }
interface OpenArtifact { id: string; v: number }   // v < 0 ⇒ latest version
type View = 'chats' | 'projects' | 'project' | 'artifacts' | 'customize';
```

| # | Component (ownership) | Prop / input interface (TS) | Visual authority (VA-id + region) | Data/contract dependency (status) | Impl eligibility |
|---|---|---|---|---|---|
| 1 | `TheoShell` (root container; ACTIVE-from-substrate) | `{}` (root; owns app state or a store hook `useTheoState()`) | VA-T1 whole surface (`VaultOriginShell` return, jsx L276–528) | services module (#10) | PROCEED |
| 2 | `Sidebar` (NEW from substrate) | `{ collapsed: boolean; onToggleCollapse: () => void; view: View; onNavigate: (v: View) => void; nav: {key: View; label: string; Icon: IconComponent}[]; search: string; onSearch: (s: string) => void; recents: string[]; onNewChat: () => void; workspaceName: string; productName: string }` | VA-T1 sidebar (jsx L297–328) | none (presentational; recents from chat service in 1B) | PROCEED |
| 3 | `ChatView` (NEW from substrate) | `{ messages: Message[]; loading: boolean; error: string; draft: string; onDraftChange: (s: string) => void; onSend: (text?: string) => void; chatProject: Project \| null; onClearProject: () => void; activeStyleLabel: string \| null; modelLabel: string; assistantName: string; productName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode }` | VA-T1 chats region + composer (jsx L350–377, L479–492) | chat service `sendMessage` (mock gateway) — `1A-contract` | PROCEED |
| 4 | `ProjectsView` (NEW from substrate) | `{ projects: Project[]; npOpen: boolean; np: {name:string;desc:string;instructions:string}; onNpChange: (p)=>void; onToggleNp: ()=>void; onCreate: ()=>void; onOpenProject: (id: string)=>void }` | VA-T1 projects (jsx L380–401) | projects service — `1A-contract` (in-memory) | PROCEED |
| 5 | `ProjectDetail` (NEW from substrate) | `{ project: Project; kdraft: {title:string;content:string}; onKdraftChange: (k)=>void; onAddKnowledge: ()=>void; onRemoveKnowledge: (kid: string)=>void; onPatchInstructions: (text: string)=>void; onStartChat: ()=>void; onBack: ()=>void }` | VA-T1 project detail (jsx L404–431) | projects service — `1A-contract` | PROCEED |
| 6 | `ArtifactsView` (NEW from substrate) | `{ artifacts: Artifact[]; onOpenArtifact: (id: string)=>void }` | VA-T1 artifacts gallery (jsx L434–455) | artifacts service — `1A-contract` | PROCEED |
| 7 | `ArtifactPanel` (NEW from substrate) | `{ artifact: Artifact; openVersion: number; onSelectVersion: (v: number)=>void; onCopy: ()=>void; copied: boolean; onClose: ()=>void }` | VA-T1 artifact side panel (jsx L496–523) | artifacts service — `1A-contract` | PROCEED |
| 8 | `Customize` (NEW from substrate) | `{ styles: Style[]; styleKey: Style['key']; onSelectStyle: (k: Style['key'])=>void; custom: string; onCustomChange: (s: string)=>void; onSave: ()=>void; saved: boolean; productName: string }` | VA-T1 customize (jsx L458–475) | settings service — `1A-contract` | PROCEED |
| 9 | Shared render/util: `Formatted`, `inline`, `Burst`, `Ic*` icons, `greeting` (NEW from substrate) | `Formatted: { text: string }`; `Burst: { size?: number; color?: string }`; `Ic*: { s?: number }`; `greeting(): string` | VA-T1 (jsx L41–88) | none (pure) | PROCEED |
| 10 | `services/theoClient` — single service/contracts module (NEW) | `sendMessage(req: {model:string;max_tokens:number;system:string;messages:Message[]}): Promise<{content:{type:string;text?:string}[]}>` (mocked gateway); `projects.list()/create()/patchInstructions()/addKnowledge()/removeKnowledge()`; `artifacts.upsertFromReply()/list()/getVersion()`; `settings.read()/write()` | VA-T2 architecture §2 (gateway); VA-T3 §2.2/§2.3 | Theo API Spec §2.1–§2.4 — all `1A-contract` (mock/in-memory) / `1B-deployed` | PROCEED |
| 11 | `swapBlock` constants module (ACTIVE-from-substrate) | `ASSISTANT_NAME='Theo'`, `WORKSPACE_NAME`, `PRODUCT_NAME`, `MODEL='claude-sonnet-4-6'`, `MODEL_LABEL`, `BASE_PROMPT`, `ARTIFACT_RULES` | VA-T1 SWAP BLOCK (jsx L8–28) | none | PROCEED (surgical branding — §4) |
| D1 | App-context chip + Origin wiring | — | VA-T3 §2.4 / §4 | `1A-contract` (presentational) | **DEFERRED — Pass B** |

**Distinctions:** rows 1–11 PROCEED (Pass A, single-repo, faithful reproduction + service boundary). D1 DEFERRED to Pass B (adds the app-context layer + the additive `vault-origin` change). No row is greenfield (the substrate VA-T1 exists); no row plans a visual deviation; no `any` in any prop interface; no contract invents a deployed shape (all `1A-contract` mocked).

## 3. Service module + mocked gateway (handover §2.2/§2.3; Theo API Spec §2)

- **`src/theo/services/theoClient.ts`** — the single boundary for every backend-bound call. 1A implementations are in-memory/mock; 1B swaps each for a real call with no surface change (handover §2.3).
- **Chat / gateway:** `sendMessage()` calls a **mocked gateway** (`src/theo/services/gateway.mock.ts`) that returns a deterministic stub reply in the **standard Anthropic Messages API shape** (`{ content: [{ type: 'text', text }] }`) — **no network call, no `api.anthropic.com`, no credential** (FE Governor §6.1; architecture §2.2). The reference's response handling is preserved verbatim: `data.content` → filter `type === 'text'` → join; then `parseArtifacts` (the `[[ARTIFACT …]]` protocol, including the ` ` sentinels) is reproduced **exactly** (handover §2.2). The mock occasionally emits an artifact marker so the side panel + versioning are exercisable.
- **Projects / Artifacts / Settings:** in-memory mock implementations behind the same module, seeded with the reference's `INIT_PROJECTS`; versioning-by-reused-title (`upsert`) preserved.
- The `buildSystemPrompt` helper (style + custom + project knowledge injection) is preserved; in 1A it feeds the mock; in 1B it feeds the real gateway/system-prompt assembly seam.

## 4. Branding (surgical — handover §5; Walter-confirmed scope)

- `ASSISTANT_NAME = "Theo"` → visible assistant name everywhere it renders ("{Theo} in Origin"; composer placeholder "Message Theo…"; disclaimer "Theo can make mistakes…"; `BASE_PROMPT` "You are Theo, the assistant inside Vault Origin…").
- **NOT changed:** `MODEL = "claude-sonnet-4-6"` (the real Foundry deployment id — engine, not brand). `MODEL_LABEL` retained as the **engine identity** shown in the model selector ("Claude Sonnet 4.6") — this legitimately names the powering model; **flag for Walter:** one-line adjustable if you prefer it relabeled/hidden. The Claude-powered / Foundry facts in architecture/handover are untouched.

## 5. Per-surface real-in-1A vs true-in-1B + Gap Disclosure

**Per-surface (handover §3) — Pass A delivers the "real in 1A" column for:** Chats (UI/composer/loading/markdown/starters/greeting), Recents (list/search/click), Projects (CRUD + start-chat), Project knowledge (add/remove/list + mock prompt inject), Artifacts (marker-parsed/versioned/gallery/panel/copy), Customize (styles/custom/save → system prompt). All "true in 1B" items (persistence, RAG, RLS, live gateway) remain 1B.

**Gap Disclosure (FE Governor §5; F-P2.5):**
- **PROCEED** — Pass A is fully grounded in VA-T1/T2/T3 + the deployed-in-repo standards + Theo API Spec contract surface; nothing blocks faithful productionisation against mocks.
- **PROCEED (scoped)** — the **app-context chip + Origin wiring** (handover §2.4/§4) is scoped to **Pass B** (added layer + second-repo additive change). Not a deferred *surface*.
- **Note (not a blocker)** — a standalone **"Theo Phase 1A Frontend Plan"** doc (named in FE Conformance §4A.1 F-P1) is **not yet authored**; VA-T3 (the 1A handover) is the governing 1A scope authority and is CURRENT in §4B. Recommend the Phase-1A plan be authored as living documentation alongside the passes (architecture §8.5). This VEP proceeds on VA-T3 authority.
- **NO other gaps.**

## 6. Acceptance plan (Pass 3) + guardrails

**Build/verify (Pass 3 implementation):** `tsc --noEmit -p tsconfig.app.json` clean; `eslint` on changed files clean; `vite build` OK. **SWA visual-parity (F-I5 / Walter):** render `TheoShell` in the dev SWA and confirm faithful parity with VA-T1 across all surfaces + states (loading/empty/error/selected/hover/focus), per Golden Component Pack §7. **Guardrails (FE Governor §6 / handover §6):** gateway abstraction only (no direct browser→model call); single service module; no `localStorage`/`sessionStorage`; inline-style surface preserved (no Tailwind conversion); no `corporate-reporting` change; `vault-origin` untouched in Pass A.

## 7. Out of scope / boundaries

No implementation in this turn (plan-only). No `corporate-reporting` change; no `reporting_*` access. No `vault-origin` change in Pass A. No real persistence/RAG/RLS/live gateway (1B). No Tailwind/CSS-in-JS conversion. No browser storage. No redesign of the surface. No backend handler authoring (1B). No merge to `main`.

## 8. Requested Codex verdict

Claude Code requests **Codex Pass 2 APPROVED / REJECTED** on this plan-only Pass A VEP: the PROCEED-eligible scope (lift + componentize + single service module + mocked gateway + surgical Theo branding), the Component Contract Table, and the explicit Pass-B deferral of the app-context layer. No `vault-theo` runtime source was changed by this package.
