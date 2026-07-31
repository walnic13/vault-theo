# Theo Frontend — Nav-History Seam (VEP-1 of 2): internal back-stack + host seam (`onNavState` / `backNonce`): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (no component code lands until the CCT is approved). **VEP-1 of a two-VEP, Orbit-parity system-back feature** (Walter-directed 2026-07-31): make the browser/hardware Back button walk Theo's internal pages (open chat → project home → project list → … → exit Theo), with a visible top-left Back on every chat and the chat title shown for chats inside a project. This mirrors the EXISTING Orbit mechanism in vault-origin (`ShellFrame` same-URL `pushState` sentinel + `mobileLayer` peel + `closeMobileLayerRef` reducer; the on-screen `← Back` and the hardware Back are one behavior). Because Orbit is **host-owned**, the host must see Theo's internal nav level and be able to command Theo back — so:

- **VEP-1 (this pack, vault-theo):** Theo grows an internal nav-history stack + reports its state to the host (`onNavState({ depth, title })`) + accepts a back command from the host (`backNonce`). The existing desktop header Back rewires to the stack.
- **VEP-2 (next, vault-origin):** the host adds a Theo layer to its sentinel system keyed on `depth`, peels it by bumping `backNonce`, and renders the `title` + a Back button in the narrow top strip. VEP-2 consumes what VEP-1 deploys.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding parent (source baseline): `d2933b51865b944428657d34ebaa1a66140edf1c` (vault-theo, `development`) — this package is carried at a later reviewed commit named only in the Codex activation note; every currency anchor below is a tip-independent blob SHA
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§3 VEP/CCT; §6 build guardrails incl. no storage) | `Grep("MUST contain a **Component Contract Table**")` + `Grep("No \`localStorage\` / \`sessionStorage\`")` this turn | `3afec7ea4b13650ce2bf28bf32073179a35e7b24` |
| 2 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` (F-P1 currency; this is a Walter-directed nav extension) | carried grounding (blob-anchored) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 3 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchors; §6 T20/T25) | `Grep("MUST open with a table of the form:")` + `Grep("Component Contract Table row missing prop interface")` this turn | `4f2f42e799be5db31e1e35e523d656ff4c1c057e` |
| 4 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | carried grounding (blob-anchored) | `25cc488091d619d8f6642b10552df0d019a87933` |
| 5 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§2 mirror target; §4 prop conventions; §5 allowed deltas) | `Grep("select **exactly one** existing component file as the structural mirror target")` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 6 | ACTIVE seam — `src/theo/TheoSurface.tsx` (`TheoSurfaceProps`; the `newChatNonce` nonce-effect idiom; the `onNavigate` destination wiring) | `Read(TheoSurface.tsx, offset=54, limit=78)` this turn | `22fa7cb64ba008b88b91238aee06b4e7f2d1f68d` |
| 7 | ACTIVE state — `src/theo/useTheoState.ts` (`view`/`detailId`/`conversationId`; `go`/`openProject`/`selectRecent`/`newChat`/`startInProject`; return object) | `Read`(nav functions + return) this turn/program | `3ec703df534ce605c4748421965ab1eec493d9b9` |
| 8 | ACTIVE header — `src/theo/components/TheoMain.tsx` (`TheoMainProps`; the chat-header back-arrow added for SPW; the `IcBack` idiom) | `Read(TheoMain.tsx)` this turn/program | `bc696c187cc1d350bcf55965c0219780d96b5366` |
| 9 | Shared types — `src/theo/types.ts` (`View` union; where `NavState` is added) | `Grep("export type View")` this turn | `177cc3afac4ed9403addee23d587702a8714b9a0` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §3 | "MUST contain a **Component Contract Table**" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §2 | "select **exactly one** existing component file as the structural mirror target" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "wiring an inline call to the service-module/gateway abstraction" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |

Sub-phase track note: Pass-1 VEP walks F-P1–F-P7 below; the Rule Anchor Table carries the Conformance §3/§5/§6 anchors (F-P7), the Golden Component Pack mirror/prop/allowed-delta anchors (F-P4/F-P5), and the Governor CCT + no-storage guardrail anchors (F-P6). No backend contract (F-P3 = none).

---

## F-P1 — Feature identification

**Feature:** a browser-history-integrated "system Back" for Theo, plus the on-screen chrome that goes with it. On phone/desktop, the hardware/browser Back button (and a visible top-left `← Back`) walk Theo's internal locations one step per press — open chat → its project home → project list → any prior view — and only the **final** Back leaves Theo. The chat title is shown for chats inside a project. VEP-1 delivers the **Theo-side half**: the internal nav-history stack + the host seam (`onNavState` out, `backNonce` in). VEP-2 wires the host's sentinel + mobile strip to it.

**Currency (F-P1).** Walter-directed nav extension (2026-07-31), grounded against the deployed Orbit mechanism in vault-origin `ShellFrame` (host-owned same-URL sentinel + `mobileLayer` peel). No 1A-Plan entry — see Gap G-1A-PLAN.

**Role vocabulary.** Claude Code authors (Pass 1). Codex reviews (Pass 2). On APPROVED, Claude Code implements on `development` (Pass 3); **Walter validates on the dev SWA (mobile) — Visual/Behavioral Acceptance Evidence.**

---

## F-P2 — UI Authority Reconciliation

- **VA-T1** (the base Theo shell/header) governs the header. VEP-1's only visible change is behavioral: the chat-header `← Back` (added for SPW) rewires from "back to project" to "back one nav step" and shows whenever there is internal history (`canGoBack`), reusing the existing `IcBack` glyph + header idiom → **VISUAL-AUTHORITY-MATCH** (no new pixels; same control, broader trigger + stack-aware action).
- No new visual surface in VEP-1 (the mobile title + strip Back are VEP-2, host-side). No net-new component; no VA-id minted.
- No planned VISUAL-AUTHORITY-DEVIATION.

---

## F-P2.5 / Gap Disclosure

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-1A-PLAN | Not a 1A-Plan feature entry. | **PROCEED** | Walter-directed extension grounded on the deployed Orbit precedent. |
| G-RENAV | `goBack()` restores a prior location by RE-INVOKING the nav function (selectRecent/openProject/go/newChat), not by raw state-set. | **PROCEED** | Conversations paint instantly from the confirmed-principal cache (`getCachedConversation`) and projects are in state, so re-navigation is cheap + correct (loads the right messages/knowledge). A re-entrancy guard ref suppresses the forward-push while restoring. |
| G-PUSH-DEDUP | Not every nav call is "forward" (re-clicking the current view; the cold-open restore of the last chat). | **PROCEED** | `pushNav` records the LEAVING location only when it differs from the top of stack, and the cold-open restore path is guarded so it seeds no bogus back entry. |
| G-SEAM-SHAPE | The host must know Theo's depth (not just a boolean) to re-arm its per-level sentinel as Theo peels. | **PROCEED** | `onNavState` reports `{ depth: number; title: string | null }`; `depth` = stack length (host keys its sentinel + Back visibility on it), `title` = the chat title when inside a project (else null, per VO M1's mobile title policy). |
| G-BACKNONCE | Host→Theo back command. | **PROCEED** | `backNonce?: number` prop, identical idiom to the deployed `newChatNonce` (ref-held handler + nonce-diff effect; initial mount no-op). |
| G-NO-STORAGE | Governor §6 forbids `localStorage`/`sessionStorage`. | **PROCEED** | The nav stack is in-memory React state; no browser storage. History integration itself is host-side (VEP-2) — VEP-1 touches no `window.history`. |

Gap vocabulary closed (PROCEED/PRE-LAND/ESCALATE/NO-GAPS).

---

## F-P3 — Backend / contract grounding

**None.** VEP-1 is pure client state + a host FE seam. No handler, no API/Schema change, no gateway change.

---

## F-P4 — Component reference grounding

**Canonical Primary Reference = the ACTIVE files being modified.** Structural mirror target for the new host-signal plumbing (Golden Component Pack §2 "exactly one … structural mirror target") = the **deployed `newChatNonce` seam** in `TheoSurface.tsx` (a `number` prop + a ref-held handler + a nonce-diff effect) — `backNonce` is its exact twin. The nav-history stack is new internal logic in `useTheoState` (no visual component; no `PRIMARY REFERENCE: GREENFIELD` surface). The header change mirrors the existing `IcBack` control in `TheoMain`.

---

## F-P5 — Component Contract Table

### CCT-1 · `useTheoState` — ACTIVE (state hook), modified · n/a (state; VA-T1 behavior) · no backend; internal nav stack + host-facing nav state · **PROCEED**

The hook takes no arguments. New INTERNAL state/logic + these ADDED public return members (complete literal types; existing members unchanged):

```ts
// NEW public return members:
canGoBack: boolean;                 // navStack.length > 0 — an internal Back step exists
navDepth: number;                   // navStack.length — the host keys its history sentinel on this
navContextTitle: string | null;    // the open chat's title when it is inside a project, else null (mobile strip title)
goBack: () => void;                 // pop one internal location and re-navigate to it (no-op when the stack is empty)
```

Internal (non-contract) plumbing:
```ts
// restorable internal location (NOT a shared/exported type — lives in useTheoState):
type NavLoc =
  | { k: "view"; view: View }        // a top-level nav view (projects/artifacts/customize, or empty chats)
  | { k: "chat"; id: string }        // an open conversation
  | { k: "project"; id: string }     // a project home
  | { k: "newchat" };                // a fresh empty chat
const [navStack, setNavStack] = useState<NavLoc[]>([]);
const navRestoringRef = useRef(false);   // set while goBack re-navigates → suppresses the forward push
function currentLoc(): NavLoc { /* derive from view/detailId/conversationId */ }
function pushNav() { /* if !navRestoringRef.current, push currentLoc() when it differs from the stack top */ }
```
`go` / `openProject` / `selectRecent` / `startInProject` / `newChat` call `pushNav()` at entry (recording the LEAVING location); the cold-open restore path sets `navRestoringRef` so it seeds no entry. `goBack()` pops the top, sets `navRestoringRef`, re-invokes the matching nav fn for that `NavLoc` (`go(view)` / `selectRecent(id)` / `openProject(id)` / `newChat()`), then clears the ref. `navDepth`/`navContextTitle` are derived from `navStack` + the current loc + `chatProject`/`currentConversation`.

### CCT-2 · `TheoSurface` — ACTIVE (`src/theo/TheoSurface.tsx`), modified · n/a (host seam) · consumes `useTheoState` nav members; no backend · **PROCEED**

Complete modified `TheoSurfaceProps` (two optional props appended after the existing optional tail so required-before-optional holds; the internal `onNavigate` destination wiring is unchanged):

```ts
export interface TheoSurfaceProps {
  appContext?: AppContext;
  navSlot?: HTMLElement | null;
  mainSlot?: HTMLElement | null;
  getAccessToken?: () => Promise<string | null>;
  suppressNarrowHeader?: boolean;
  newChatNonce?: number;
  onNavigate?: () => void;
  onNavState?: (s: NavState) => void;   // NEW — fired when Theo's internal location changes: { depth, title }. No-op when absent (standalone).
  backNonce?: number;                    // NEW — bumping this (host Back) pops one internal nav level via useTheoState.goBack(). No-op when absent.
}
```

Behavior: an effect fires `onNavState?.({ depth: t.navDepth, title: t.navContextTitle })` whenever `(t.navDepth, t.navContextTitle)` change; a `backNonce` nonce-diff effect (ref-held `t.goBack`, initial mount no-op — byte-identical idiom to the existing `newChatNonce` effect) calls `goBack()` on each bump.

### CCT-3 · `TheoMain` — ACTIVE (`src/theo/components/TheoMain.tsx`), modified · VA-T1 (unchanged pixels) · consumes `t.canGoBack`/`t.goBack` · **PROCEED**

Complete `TheoMainProps` interface — **UNCHANGED** by this microstep (pasted in full for T20; the edit is body-only wiring):

```ts
export interface TheoMainProps {
  t: ReturnType<typeof useTheoState>;
  mode: "full" | "panel";
  suppressNarrowHeader?: boolean;
}
```

Body change (chat-header `t.view === "chats"` branch): the SPW back-arrow — currently `{t.chatProject && <button onClick={() => t.openProject(t.chatProject!.id)} …><IcBack/></button>}` — is rewired to `{t.canGoBack && <button onClick={t.goBack} title="Back" …><IcBack/></button>}` (shows on any chat with internal history; walks one step). Same glyph/style (VA-T1). The title (ChatMenu) is unchanged.

### CCT-4 · `NavState` — NEW shared type (`src/theo/types.ts`), additive · n/a (type) · the seam payload · **PROCEED**

Complete literal addition (the seam DTO; the internal `NavLoc` deliberately stays private to `useTheoState`):

```ts
// The nav-state Theo reports to the Origin host (VEP-1 seam) so the host can drive its history
// sentinel + mobile Back/title (VEP-2). depth = internal back-steps available; title = the open
// chat's title when inside a project, else null.
export interface NavState {
  depth: number;
  title: string | null;
}
```

Every entry locks the three surfaces (complete literal interface/return members, VA-id [VA-T1 or n/a], contract dependency) + impl eligibility. No `any`.

---

## F-P6 — Repository & active-surface grounding

- Targets are all active-surface (read this turn/program): `useTheoState.ts`, `TheoSurface.tsx`, `TheoMain.tsx`, `types.ts`. No deprecated code.
- **Guardrails (Governor §6 / T26):** the nav stack is **in-memory React state — no `localStorage`/`sessionStorage`**; VEP-1 touches **no `window.history`** (history integration is host-side, VEP-2); no gateway/fetch change; inline-style preserved (the header reuses the existing `IcBack` button); `corporate-reporting`/`reporting_*` untouched.
- **Backward-compatible seam:** `onNavState`/`backNonce` are OPTIONAL — a host that doesn't wire them (or the standalone harness) is unaffected; today's mounted host simply ignores the new signals until VEP-2 lands. No regression to the current mount.

---

## F-P7 — Visual/behavioral-parity + test plan (Pass-3 obligations, previewed)

- **Parity:** the header `← Back` keeps VA-T1 pixels; the only change is it appears on any chat with history and steps back one level. No redesign.
- **Behavioral test (F-I5), desktop (VEP-1 alone):** open project → open a chat in it → the header `← Back` returns to the project home; a further `← Back` from the project list behaves per the stack. `onNavState`/`backNonce` are exercised end-to-end once VEP-2 wires the host (the full hardware-Back + mobile title/Back walk is the VEP-2 acceptance, on your phone).
- **Non-regression:** a standalone/unwired host sees no change; `newChat`/`selectRecent`/existing nav still work; the SPW publish/shared-list flow is unaffected.

## Mechanical lint

Mechanical lint run this turn (`node tools/lint_microstep_submission.mjs <submission>`), verbatim output recorded at commit:

```
PASS  Codex Governance/Theo-Frontend-Nav-History-Seam-Pass-1-VEP/Theo_Frontend_Nav_History_Seam_Pass_1_VEP.md
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note

Open your Pass-2 turn with a governance-bound GCR + Rule Anchor Table (Theo Frontend Grounding Conformance §3/§5; Codex Frontend Review §2). Re-run the mechanical linter independently. §1A gates: CCT completeness (T20 — CCT-1 state-only lists added return members + internal NavLoc/stack plumbing; CCT-2 pastes the full modified TheoSurfaceProps; CCT-3 pastes the full UNCHANGED TheoMainProps [body-only edit]; CCT-4 the full NavState), VA (n/a — VA-T1 behavior only, no VA-id minted; T21 satisfied vacuously), contract existence (T22 — no backend), artifact presence (T25 — pack carried at the HEAD in this note). Substance: the seam is Orbit-parity host-owned (Theo reports depth+title, accepts backNonce; the host — VEP-2 — owns window.history); backNonce mirrors the deployed newChatNonce idiom; goBack re-navigates via the existing nav fns under a re-entrancy guard; no localStorage/window.history in VEP-1; onNavState/backNonce OPTIONAL (no mount regression). Verdict APPROVED or REJECTED only.
