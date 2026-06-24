# Theo Phase 1A — Pass A — Productionise the Shell — Pass 1 Frontend VEP (PLAN-ONLY)

**Microstep:** productionise the canonical reference surface (`frontend/theo-frontend-reference.jsx`, VA-T1) into the `vault-theo` repo as a real, typed, component-structured **Theo** shell — faithfully reproduced — with every backend-bound call routed through a single service/contracts module and a **mocked gateway abstraction** (no direct browser→model call). Theo-branded (surgical).
**Pipeline pass:** Pass 1 — Frontend Verified Evidence Pack (plan-only). **No implementation in this turn.**
**Primary editable repo (authoring/grounding HEAD):** `walnic13/vault-theo` · `development` @ `451a4c687b0066a8f61f98bb970bd3c4a4e533f7`.
**Reviewer:** Codex (Pass 2).

> **Correction reissue (this revision):** Codex Pass-2 REJECTED the prior commit `0928d65f9779e3d802e192d6788edcfdbca08b15` on three triggers — **T2** (GCR used a "Section read this turn" column instead of the §3 "Read tool invocation this turn" column, and omitted the required `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` row), **T7** (Rule-Anchor rows not literal contiguous substrings — bolded/non-contiguous source), **T20** (CCT rows used untyped callback params and a deferred row had no prop interface). This reissue: (a) the GCR uses the §3 column with real `Read(...)` invocations executed this turn and adds the Codex review standard row; (b) every Rule-Anchor quote is a literal contiguous substring verified this turn; (c) all CCT prop interfaces are fully typed (no `any`, no untyped params) and the deferred app-context row is removed from the CCT (the deferral is documented in §1/§5, not as a CCT row). Substantive product direction unchanged.

> **GATE RESULT (preview): PROCEED** for Pass A = handover §2.1 (lift + componentize), §2.2 (mocked gateway abstraction), §2.3 (single service/contracts module), §2.5 (no browser storage), §5 (SWAP BLOCK, Theo-branded). **DEFERRED to Pass B (explicit, governed):** the app-context chip + the additive `vault-origin` context-broadcast/mount wiring. No surface is deferred — Chats/Recents/Projects/Project-knowledge/Artifacts/Customize are all built and interactive in Pass A; the app-context *layer* is the one added piece, scoped to Pass B (it also touches `vault-origin`).

## Grounding Conformance Receipt (Frontend Conformance §3)

```
Role: Claude Code
Turn-type: Pass 1 — Frontend Verified Evidence Pack (plan-only; correction reissue)
Turn issued against HEAD: vault-theo development 451a4c687b0066a8f61f98bb970bd3c4a4e533f7
Grounding mode: Full Baseline Grounding
```

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (verbatim substring at HEAD) |
|---|---|---|---|
| 1 | VA-T1 reference surface · `vault-theo/frontend/theo-frontend-reference.jsx` | `Read(file_path=".../frontend/theo-frontend-reference.jsx", offset=1, limit=40)` | `const ASSISTANT_NAME = "Claude";` (also sha256 `fe473eed3364505824639d3ef0c9fd0059f2d1ae164ae22976fc3268aed33f2a`) |
| 2 | VA-T3 1A Handover · `vault-theo/governance/THEO_1A_FRONTEND_HANDOVER.md` | `Read(file_path=".../governance/THEO_1A_FRONTEND_HANDOVER.md", offset=33, limit=50)` | `isolate every backend-bound call behind a service boundary now.` |
| 3 | VA-T2 Architecture · `vault-theo/governance/THEO_ARCHITECTURE_AND_STRUCTURE.md` | `Read(file_path=".../governance/THEO_ARCHITECTURE_AND_STRUCTURE.md", offset=40, limit=20)` | `The **frontend** — the full Claude-for-Teams replica surface plus the app-context layer.` |
| 4 | FE Conformance Standard · `vault-theo/governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` | `Read(file_path=".../governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md", offset=51, limit=52)` | §3 `Read tool invocation this turn`; §4 Pass-1 row `Codex Theo Frontend Review Standard; Theo Golden Component Pack Standard` |
| 5 | FE Governor Standard · `vault-theo/governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` | `Read(file_path=".../governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md", offset=33, limit=9)` | `Every backend-bound call (chat, projects, artifacts, settings, retrieval) routes through one services/contracts module` |
| 6 | Golden Component Pack Standard · `vault-theo/governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` | `Read(file_path=".../governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md")` (full) | `One row per component in scope. Each row locks three surfaces:` |
| 7 | Codex FE Review Standard · `vault-theo/governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | `Read(file_path=".../governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md")` (full) | `A Pass 1 VEP MUST carry a Component Contract Table with, per row, the prop interface, the VA-id citation, and the data/contract dependency.` |
| 8 | Theo API Spec · `vault-theo/spec/THEO_API_SPEC.md` | `Read(file_path=".../spec/THEO_API_SPEC.md", offset=20, limit=8)` | ``Standard Anthropic Messages API (`model`, `max_tokens`, `system`, `messages[]`)`` |

**Required-doc note (FE Conformance §4 Pass-1 row):** the §4 row also lists "Theo Phase 1A Frontend Plan." That doc is **not present at this ref** (authored on a separate branch, PR #4, not yet merged into `development`); citing an absent file would fail T25. Its absence is disclosed in §5 Gap Disclosure; this VEP proceeds on VA-T3 (the 1A handover) as the governing 1A scope authority. The `§4B Visual Authority Registry` and the VA-ids (VA-T1/T2/T3) are present at this ref and registered CURRENT.

## Rule Anchor Table (Frontend Conformance §5 — every quote a literal contiguous substring at HEAD)

| # | Source doc | Clause | Verbatim quote | Applied in output at |
|---|---|---|---|---|
| 1 | VA-T3 1A Handover | §2.1 | "split the monolith into components (`Sidebar`, `ChatView`, `ProjectsView`, `ProjectDetail`, `ArtifactsView`, `Customize`, `ArtifactPanel`, shared `Formatted`/icons)" | §2 CCT decomposition (rows 2–9) |
| 2 | Golden Component Pack | §5 | "converting the inline-style system to Tailwind/CSS-in-JS in 1A is a" | §2 (AD-visual: inline-style preserved); §6 guardrails |
| 3 | VA-T3 1A Handover | §2.2 | "the gateway can be a **mock/stub** returning canned or proxied responses" | §3 mocked gateway |
| 4 | VA-T3 1A Handover | §2.3 | "route them through a single contracts/services module" | §3 single service module |
| 5 | VA-T3 1A Handover | §2.2 | "Preserve the artifact-marker parsing (`parseArtifacts`, the `[[ARTIFACT ...]]` protocol) exactly" | §3 (parseArtifacts preserved) |
| 6 | VA-T3 1A Handover | §2.5 | "no `localStorage` / `sessionStorage`." | §6 guardrails; CCT contract-dependency = in-memory |
| 7 | VA-T1 reference surface | SWAP BLOCK | "const ASSISTANT_NAME = \"Claude\";" | §4 branding (surgical flip to "Theo") |
| 8 | Golden Component Pack | §3 | "One row per component in scope. Each row locks three surfaces:" | §2 CCT format |
| 9 | Golden Component Pack | §2 | "the named substrate is `frontend/theo-frontend-reference.jsx`" | §2 PRIMARY REFERENCE = VA-T1 (not greenfield) |
| 10 | Golden Component Pack | §4 | "no `any` (use a precise type or a discriminated union)" | §2A shared types; §2 prop interfaces |
| 11 | FE Governor | §6 | "The model call routes through a gateway abstraction (mock in 1A), never a direct browser→Anthropic/Foundry call." | §3 mocked gateway |
| 12 | FE Governor | §6 | "Every backend-bound call (chat, projects, artifacts, settings, retrieval) routes through one services/contracts module" | §3 single service module |
| 13 | FE Conformance | §4 | "Codex Theo Frontend Review Standard; Theo Golden Component Pack Standard" | GCR required-doc set (rows 6,7) |
| 14 | Theo API Spec | §2.1 | "`1A-contract` (mock gateway) / `1B-deployed` (`POST /api/theo/message`)" | §3 chat contract dependency |
| 15 | VA-T2 Architecture | §1.1 | "The **frontend** — the full Claude-for-Teams replica surface plus the app-context layer." | §1 scope; §5 app-context = a layer (Pass B) |

## Pass / Sub-Phase Walk (F-P1–F-P7)

- **F-P1 Feature identification** — §1; Theo Phase 1A, Pass A. (Standalone "Theo Phase 1A Frontend Plan" not present at this ref — see §5; VA-T3 handover governs 1A scope.)
- **F-P2 UI authority reconciliation** — §2/§5; reconciled against VA-T1, VA-T2, VA-T3 (all CURRENT in §4B). Faithful reproduction; **zero VISUAL-AUTHORITY-DEVIATION** rows.
- **F-P2.5 Gap disclosure** — §5 (PROCEED; app-context layer → Pass B; Phase-1A-plan-doc gap noted).
- **F-P3 Backend/contract grounding** — §3; Theo API Spec §2.1–§2.4; all `1A-contract` (mocked); gateway = Anthropic Messages API shape.
- **F-P4 Component reference grounding** — PRIMARY REFERENCE = VA-T1 (full-read this turn; sha-verified), per Golden Component Pack §2 (substrate exists — not greenfield).
- **F-P5 Component Contract Table assembly** — §2 (Golden Component Pack §3 format; prop interface + VA-id + contract dependency per row).
- **F-P6 Repository & active-surface grounding** — §6; target `vault-theo/src/` (active Vite+React+TS scaffold); no deprecated code; no browser storage; inline-style preserved (no Tailwind conversion).
- **F-P7 VEP assembly** — this document (GCR §3 + Rule Anchor Table §5 + CCT §2 per FE Governor §3 / FE Conformance §4A.1).

---

## 1. Feature identification + scope

Pass A of Theo Phase 1A — productionise the reference surface (VA-T1) into `vault-theo/src/` as `TheoShell`, faithfully reproduced, typed (TSX), component-split, with a single service/contracts module + mocked gateway, Theo-branded. **In scope:** handover §2.1, §2.2, §2.3, §2.5, §5 → acceptance criteria §7 items 1, 2, 3, 4, 6, 7. **Deferred to Pass B (governed):** the app-context chip (handover §2.4) + the additive `vault-origin` context-broadcast + Theo mount point (handover §4) → acceptance criterion §7 item 5. Reason: the app-context layer is an added piece that also requires an additive change in a second repo (`vault-origin`); isolating it keeps Pass A a single-repo faithful-reproduction unit.

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
interface OpenArtifact { id: string; v: number }            // v < 0 ⇒ latest version
type View = 'chats' | 'projects' | 'project' | 'artifacts' | 'customize';
interface NavItem { key: View; label: string; Icon: (p: { s?: number }) => JSX.Element }
interface NpDraft { name: string; desc: string; instructions: string }   // new-project draft
interface KDraft { title: string; content: string }                       // knowledge draft
interface GatewayRequest { model: string; max_tokens: number; system: string; messages: Message[] }
interface GatewayResponse { content: { type: string; text?: string }[] }
interface Settings { styleKey: Style['key']; custom: string }
```

| # | Component (ownership) | Prop / input interface (TS; no `any`) | Visual authority (VA-id + region) | Data/contract dependency (status) | Impl eligibility |
|---|---|---|---|---|---|
| 1 | `TheoShell` (root container; ACTIVE-from-substrate) | `{}` (root; owns app state via a `useTheoState()` hook) | VA-T1 whole surface (jsx L276–528) | services module (#10) | PROCEED |
| 2 | `Sidebar` (NEW from substrate) | `{ collapsed: boolean; onToggleCollapse: () => void; view: View; onNavigate: (v: View) => void; nav: NavItem[]; search: string; onSearch: (s: string) => void; recents: string[]; onSelectRecent: (r: string) => void; onNewChat: () => void; workspaceName: string; productName: string }` | VA-T1 sidebar (jsx L297–328) | none (presentational; recents from chat service in 1B) | PROCEED |
| 3 | `ChatView` (NEW from substrate) | `{ messages: Message[]; loading: boolean; error: string; draft: string; onDraftChange: (s: string) => void; onSend: (text?: string) => void; chatProject: Project \| null; onClearProject: () => void; activeStyleLabel: string \| null; modelLabel: string; assistantName: string; productName: string; greeting: string; starters: string[]; renderAssistant: (content: string) => ReactNode }` | VA-T1 chats + composer (jsx L350–377, L479–492) | chat service `sendMessage` (mock gateway) — `1A-contract` | PROCEED |
| 4 | `ProjectsView` (NEW from substrate) | `{ projects: Project[]; npOpen: boolean; np: NpDraft; onNpChange: (next: NpDraft) => void; onToggleNp: () => void; onCreate: () => void; onOpenProject: (id: string) => void }` | VA-T1 projects (jsx L380–401) | projects service — `1A-contract` (in-memory) | PROCEED |
| 5 | `ProjectDetail` (NEW from substrate) | `{ project: Project; kdraft: KDraft; onKdraftChange: (next: KDraft) => void; onAddKnowledge: () => void; onRemoveKnowledge: (kid: string) => void; onPatchInstructions: (text: string) => void; onStartChat: () => void; onBack: () => void }` | VA-T1 project detail (jsx L404–431) | projects service — `1A-contract` | PROCEED |
| 6 | `ArtifactsView` (NEW from substrate) | `{ artifacts: Artifact[]; onOpenArtifact: (id: string) => void }` | VA-T1 artifacts gallery (jsx L434–455) | artifacts service — `1A-contract` | PROCEED |
| 7 | `ArtifactPanel` (NEW from substrate) | `{ artifact: Artifact; openVersion: number; onSelectVersion: (v: number) => void; onCopy: () => void; copied: boolean; onClose: () => void }` | VA-T1 artifact side panel (jsx L496–523) | artifacts service — `1A-contract` | PROCEED |
| 8 | `Customize` (NEW from substrate) | `{ styles: Style[]; styleKey: Style['key']; onSelectStyle: (k: Style['key']) => void; custom: string; onCustomChange: (s: string) => void; onSave: () => void; saved: boolean; productName: string }` | VA-T1 customize (jsx L458–475) | settings service — `1A-contract` | PROCEED |
| 9 | Shared render/util: `Formatted`, `inline`, `Burst`, `Ic*` icons, `greeting` (NEW from substrate) | `Formatted: (p: { text: string }) => JSX.Element`; `Burst: (p: { size?: number; color?: string }) => JSX.Element`; `Ic*: (p: { s?: number }) => JSX.Element`; `greeting: () => string` | VA-T1 (jsx L41–88) | none (pure) | PROCEED |
| 10 | `services/theoClient` — single service/contracts module (NEW) | `sendMessage(req: GatewayRequest): Promise<GatewayResponse>` (mock gateway); `listProjects(): Project[]`; `createProject(d: NpDraft): Project`; `patchInstructions(id: string, instructions: string): void`; `addKnowledge(id: string, k: KDraft): void`; `removeKnowledge(id: string, kid: string): void`; `upsertArtifactsFromReply(reply: string): { clean: string; ids: string[] }`; `listArtifacts(): Artifact[]`; `getArtifactVersion(id: string, v: number): ArtifactVersion`; `readSettings(): Settings`; `writeSettings(s: Settings): void` | VA-T2 architecture §2 (gateway); VA-T3 §2.2/§2.3 | Theo API Spec §2.1–§2.4 — all `1A-contract` (mock/in-memory) / `1B-deployed` | PROCEED |
| 11 | `swapBlock` constants module (ACTIVE-from-substrate) | `ASSISTANT_NAME: 'Theo'; WORKSPACE_NAME: string; PRODUCT_NAME: string; MODEL: 'claude-sonnet-4-6'; MODEL_LABEL: string; BASE_PROMPT: string; ARTIFACT_RULES: string` (all `const`; typed string literals) | VA-T1 SWAP BLOCK (jsx L8–28) | none | PROCEED (surgical branding — §4) |

**Distinctions:** all 11 rows PROCEED (Pass A; single-repo faithful reproduction + service boundary + mocked gateway + surgical branding). No row is greenfield (the substrate VA-T1 exists). No row plans a visual deviation (faithful reproduction; zero VISUAL-AUTHORITY-DEVIATION). Every prop interface is fully typed (no `any`, no untyped callback params). No contract invents a deployed shape (all `1A-contract` mocked). **The app-context chip + Origin wiring are NOT a CCT row here** — they are deferred to Pass B (§1, §5); per Golden Component Pack §3 the CCT is "one row per component **in scope**," and the app-context component is out of Pass A scope.

## 3. Service module + mocked gateway (handover §2.2/§2.3; Theo API Spec §2)

- **`src/theo/services/theoClient.ts`** — the single boundary for every backend-bound call (FE Governor §6). 1A implementations are in-memory/mock; 1B swaps each for a real call with no surface change.
- **Chat / gateway:** `sendMessage()` calls a **mocked gateway** (`src/theo/services/gateway.mock.ts`) returning a deterministic stub reply in the **standard Anthropic Messages API shape** (`GatewayResponse`) — **no network call, no `api.anthropic.com`, no credential** (FE Governor §6). The reference's response handling is preserved verbatim (`data.content` → filter `type === 'text'` → join); `parseArtifacts` (the `[[ARTIFACT …]]` protocol, incl. the ` ` sentinels) is reproduced **exactly** (handover §2.2). The mock occasionally emits an artifact marker so the side panel + versioning are exercisable.
- **Projects / Artifacts / Settings:** in-memory mock implementations behind the same module, seeded with the reference's `INIT_PROJECTS`; versioning-by-reused-title (`upsert`) preserved.
- `buildSystemPrompt` (style + custom + project-knowledge injection) preserved; in 1A feeds the mock; in 1B feeds the real gateway/system-prompt assembly seam.

## 4. Branding (surgical — Walter-confirmed scope)

- `ASSISTANT_NAME = "Theo"` → visible assistant name everywhere it renders ("Theo in Origin"; composer placeholder "Message Theo…"; disclaimer "Theo can make mistakes…"; `BASE_PROMPT` "You are Theo, the assistant inside Vault Origin…").
- **NOT changed:** `MODEL = "claude-sonnet-4-6"` (the real Foundry deployment id — engine, not brand). `MODEL_LABEL` retained as the engine identity shown in the model selector ("Claude Sonnet 4.6") — **flag for Walter:** one-line adjustable if you prefer it relabeled/hidden. The Claude-powered / Foundry facts are untouched.

## 5. Per-surface real-in-1A vs true-in-1B + Gap Disclosure

**Per-surface (handover §3) — Pass A delivers the "real in 1A" column for:** Chats, Recents, Projects, Project knowledge, Artifacts, Customize. All "true in 1B" items (persistence, RAG, RLS, live gateway) remain 1B.

**Gap Disclosure (FE Governor §5; F-P2.5):**
- **PROCEED** — Pass A is fully grounded in VA-T1/T2/T3 + the deployed-in-repo standards + the Theo API Spec contract surface; nothing blocks faithful productionisation against mocks.
- **PROCEED (scoped)** — the **app-context chip + Origin wiring** (handover §2.4/§4) is scoped to **Pass B** (added layer + second-repo additive change). Not a deferred *surface*.
- **Note (not a blocker)** — the standalone **"Theo Phase 1A Frontend Plan"** doc (named in FE Conformance §4 / §4A.1 F-P1) is **not present at this ref** (authored on PR #4, not yet merged). VA-T3 (the 1A handover) is the governing 1A scope authority and is CURRENT in §4B; this VEP proceeds on it. Once the Plan merges, future-pass VEPs cite it directly.
- **NO other gaps.**

## 6. Acceptance plan (Pass 3) + guardrails

**Build/verify (Pass 3):** `tsc --noEmit -p tsconfig.app.json` clean; `eslint` on changed files clean; `vite build` OK. **SWA visual-parity (F-I5 / Walter):** render `TheoShell` in the dev SWA; confirm faithful parity with VA-T1 across all surfaces + states (loading/empty/error/selected/hover/focus) per Golden Component Pack §7. **Guardrails (FE Governor §6 / handover §6):** gateway abstraction only (no direct browser→model call); single service module; no `localStorage`/`sessionStorage`; inline-style surface preserved (no Tailwind conversion); no `corporate-reporting` change; `vault-origin` untouched in Pass A.

## 7. Out of scope / boundaries

No implementation in this turn (plan-only). No `corporate-reporting` change; no `reporting_*` access. No `vault-origin` change in Pass A. No real persistence/RAG/RLS/live gateway (1B). No Tailwind/CSS-in-JS conversion. No browser storage. No surface redesign. No backend handler authoring (1B). No merge to `main`.

## 8. Requested Codex verdict

Claude Code requests **Codex Pass 2 APPROVED / REJECTED** on this corrected plan-only Pass A VEP: the PROCEED-eligible scope (lift + componentize + single service module + mocked gateway + surgical Theo branding), the fully-typed Component Contract Table, and the explicit Pass-B deferral of the app-context layer. No `vault-theo` runtime source was changed by this package.
