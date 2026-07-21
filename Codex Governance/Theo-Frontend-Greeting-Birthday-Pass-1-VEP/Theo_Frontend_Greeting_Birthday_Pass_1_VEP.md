# Theo Frontend — Greeting: drop generic starter chips + ephemeral Jake birthday banner (VA-T1): Pass-1 Frontend Verified Evidence Pack

Plan-only Frontend VEP (implementation is Pass 3 against the approved Component Contract Table). Walter-directed (2026-07-21). Two changes to the **general-chat landing** empty-state in `ChatView.tsx`: (1) **permanently remove the three generic starter chips** ("Draft a client onboarding email", "Make a 1446(f)…", "Summarize a K-1…") — they add no value; (2) **for today only**, in that spot, show a festive **"Happy Birthday, Jake!"** banner with a confetti animation, **auto-expiring at the user's local midnight** (rendered iff the browser's local date is 2026-07-21). After tonight the spot is simply empty (generic chips stay gone). Scope is the **general** landing only (`!reviewMode && !sigmaMode`); the review/sigma contextual starter pills are unchanged.

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Pass 1 — Frontend Verified Evidence Pack
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A

(Frontend sub-phase track = F-P1–F-P7 per Frontend Conformance §4A.1, walked below; the lint's P/I/E enumeration is the backend track, hence `N/A`.)

Turn issued against HEAD: `__STAMP__` (vault-theo, `development` — the commit that first contains this package; grounding reads performed against parent `80ccb616f79ca02ca25a6266789be2b04884091d`). Working tree also carried 4 untracked `artifacts/*.xlsx` template workbooks (Class B disclosed workbook dirt — not grounding).
Currency-anchor form: git blob SHA at HEAD.

| # | Document (name + absolute path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ------------------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo Frontend Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 guardrails — no storage; inline-style) | `Grep("No `localStorage` / `sessionStorage`")` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo Frontend Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3 GCR; §5 Rule Anchors; §6 T20; §4B VA registry) | `Read`/`Grep` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Codex Theo Frontend Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (§1A hard gates) | `Grep("Component Contract Table completeness")` this turn | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§4 prop conventions; §5 visual-deviation rule) | `Read(...THEO_GOLDEN_COMPONENT_PACK_STANDARD.md)` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | ACTIVE surface — `src/theo/components/ChatView.tsx` (general-chat empty-state greeting/subtitle/starters L412–416; complete `ChatViewProps`) | `Read`/`Grep(src/theo/components/ChatView.tsx)` this turn | `17379e0ef72fb1cd104968bd8b310e30f1bd4f1d` |

## Rule Anchor Table

| file | section | quote (literal substring at HEAD) |
| ---- | ------- | --------------------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3 | "MUST open with a table of the form:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "Every substantive turn MUST include, after the GCR, a Rule Anchor Table:" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §6 | "Component Contract Table row missing prop interface, VA-id citation, or contract dependency" |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4B | "citing a VA-id path not registered here is automatically invalid" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "Any visual change to the rendered surface must be classified VISUAL-AUTHORITY-DEVIATION with a Rule Anchor." |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §4 | "required props before optional; no `any`" |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "No `localStorage` / `sessionStorage`" |
| governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md | §1A | "Component Contract Table completeness" |
| src/theo/components/ChatView.tsx | general-landing | "How can I help with your work today?" |

---

## F-P1 — Feature identification
**Feature (Walter-directed 2026-07-21):** the general-chat landing empty-state. Currently (`ChatView.tsx` L414–416) it renders `starters.map(...)` as `vo-chip` buttons — the three generic `STARTERS` (general chat + project). Two changes, general landing only:
1. **Remove the generic starter chips** (permanent) — no value.
2. **Ephemeral birthday banner (today only):** in that spot, render "🎉 Happy Birthday, Jake! 🎂" with a confetti animation, **gated on the browser's local date being 2026-07-21** (`new Date()`; naturally false at local midnight). After expiry: nothing in that spot.

**Scope guard:** the change is confined to the general landing (`!reviewMode && !sigmaMode`). The review (`REVIEW_STARTERS`) and Sigma (`REVIEW_APP_STARTERS`) contextual pills are **unchanged** (they carry real review actions).

**Role vocabulary.** Claude Code authors (Pass 1); Codex reviews (Pass 2); on APPROVED Claude Code implements on `development` (Pass 3) + emits the SWA test plan; Walter validates on the dev SWA.

---

## F-P2 — UI Authority Reconciliation
- **VA-T1 (reference surface)** shows generic starter chips under the greeting. Removing them on the general landing + rendering an ephemeral birthday banner is a **VISUAL-AUTHORITY-DEVIATION** from VA-T1, **Walter-directed 2026-07-21**, classified + anchored per Golden Component Pack §5 (Rule Anchor 5). It is **narrow and reversible**: (a) permanent part = the generic chips are omitted from the general landing (the review/sigma pills, palette, greeting, subtitle, layout are all unchanged); (b) ephemeral part = a date-gated banner that self-removes at local midnight (no standing surface, no persistence).
- **No new VA-id** is registered: the birthday banner is a transient, self-expiring element (not a standing authority), so §4B is not amended (T21 N/A — no VA-id is *cited* for it; it is an anchored deviation, not a registered surface). The generic-chip removal is likewise a Walter-directed deviation, not a new surface.
- **Deferred (optional):** if Walter wants the VA-T1 reference artifact updated to drop the generic starter chips permanently, that is a later Role-C; this VEP does not edit the byte-sensitive reference — it lands the deviation as directed.

---

## Architecture & boundary reconciliation
FE-only, single file (`ChatView.tsx`), plus one new inline presentational component. No prop, contract, backend, route, service-module, or persisted-state change. The date gate uses the browser `Date` (client-side; **no storage**). No `corporate-reporting`/`reporting_*` involvement.

---

## F-P2.5 / Gap Disclosure
Vocabulary closed (`PROCEED` / `PRE-LAND` / `ESCALATE` / `NO-GAPS`) per Governor §5.

| # | Gap | Pivot | Note |
| - | --- | ----- | ---- |
| G-EXPIRY | The banner must vanish after Jake's birthday. | **PROCEED** | Hard date gate: rendered iff `new Date()` local date == 2026-07-21 (`getFullYear()==2026 && getMonth()==6 && getDate()==21`); goes false at local midnight. No server flag, no persistence — a page load after midnight shows the empty spot. |
| G-ALLUSERS | salmon-river serves dev + prod; the banner shows to **all** Theo users on 2026-07-21 local. | **PROCEED** | Intended — it's a team birthday shout-out (Jake uses prod Theo). Whimsical, non-sensitive, auto-expiring. |
| G-STARTERSPROP | `starters` prop still passed for the general landing but no longer rendered there. | **PROCEED** | Harmless (review/sigma still render their starters); a later tidy can stop passing `STARTERS` from `TheoMain`. Keeps this diff to one file for a tight same-day review. |

Per-surface real-in-1A vs true-in-1B: the greeting landing is **real** now; unchanged by the 1A/1B seam.

---

## F-P3 — Backend / contract grounding
**No contract change.** Presentation-only; the removed chips previously called `onSend(s)` — no backend interaction is added or removed at the contract level. The banner is inert (no click handler required).

---

## F-P4 — Component reference grounding
**Canonical Primary Reference: `src/theo/components/ChatView.tsx`** (the ACTIVE component; the empty-state greeting block L412–416 is the structural-mirror target). One new inline presentational component `BirthdayBanner` (mirrors the file's inline-component idiom — `MicButton`, `AddToChatSheet` — with a component-scoped `<style>` for keyframes, like `VOICE_KEYFRAMES`). No composite primary reference.

---

## F-P5 — Component Contract Table

### CCT-1 · `ChatView` — ACTIVE (Theo surface), modified · VA-T1 (general-landing deviation: generic chips removed; ephemeral banner) · no contract/handler dependency change · **PROCEED**

**No prop-interface change** — the change uses existing props (`reviewMode`, `sigmaMode`, `chatProject`) + the browser `Date`; no new/changed prop. The complete current `ChatViewProps` (unchanged; required-before-optional; no `any`) is locked here per T20:
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
  reviewFund?: string;
  reviewMode?: boolean;
  sigmaMode?: boolean;
}
```

**The change (illustrative — final at Pass 3):** the starters block becomes mode-gated —
```tsx
{(!reviewMode && !sigmaMode)
  ? ((() => { const d = new Date(); return d.getFullYear() === 2026 && d.getMonth() === 6 && d.getDate() === 21; })()
      ? <BirthdayBanner />           // today only; generic chips removed
      : null)
  : (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 520 }}>
      {starters.map((s) => <button key={s} className="vo-chip" onClick={() => onSend(s)} style={{ background: "#fff", border: `1px solid ${C.line2}`, borderRadius: 999, padding: "8px 15px", fontSize: 13, color: C.ink2, cursor: "pointer", fontFamily: SANS }}>{s}</button>)}
    </div>
  )}
```

### CCT-2 · `BirthdayBanner` — NEW/GREENFIELD (inline in ChatView) · VA-T1 deviation (ephemeral, Walter-directed) · presentational, no contract · **PROCEED**

Zero-prop presentational component (required-before-optional trivially satisfied; no `any`):
```ts
// BirthdayBanner takes no props — self-contained festive banner. (interface omitted / {}.)
function BirthdayBanner(): JSX.Element
```
Renders a centered festive banner: "🎉 Happy Birthday, Jake! 🎂" in the `SERIF` face, coral (`C.coral`), with a **pop-in + gentle wiggle**, over a light **confetti** animation — a set of small coral / `C.coralDk` / warm-gold / sand pieces that fall + rotate on a loop within the greeting area (absolutely positioned, staggered delays). Zero-dependency, inline-style, a component-scoped `<style>` for the `@keyframes` (the `VOICE_KEYFRAMES` idiom); no Tailwind, no storage, `prefers-reduced-motion` respected (motion reduced to a static banner). Palette stays on-brand (VA-T1 `C` + festive accents only inside the banner).

---

## F-P6 — Repository & active-surface grounding
- Target file (read this turn): `src/theo/components/ChatView.tsx`, empty-state greeting block (greeting L412, subtitle L413, starters L414–416).
- **Guardrails honored (Governor §6 / Conformance §6 T26):** **no `localStorage`/`sessionStorage`** (the date gate reads `new Date()` only); **inline-style preserved** (+ a component-scoped `<style>` for keyframes, the existing idiom); no Tailwind/CSS-in-JS; no direct browser→model call; no `corporate-reporting`/`reporting_*` change; `[[ARTIFACT]]`/SWAP BLOCK untouched.

---

## F-P7 — Visual-parity + SWA test plan (Pass-3 obligations, previewed)
- **No VA-registry edit** (F-P2): a Walter-directed VA-T1 deviation (anchored), not a new registered surface.
- **SWA test plan (F-I5):** on `development` deploy, Walter (today, 2026-07-21 local): (1) open a fresh general Theo chat → **no generic starter chips**; in their place the **"Happy Birthday, Jake!"** banner with confetti; (2) a review/Sigma landing still shows its contextual pills (unchanged); (3) simulate post-expiry (set the device clock to 2026-07-22, or confirm via code review the gate) → the banner is gone and the spot is empty. Screenshot of the banner = Pass-3 Visual Acceptance Evidence. (Because it self-expires at local midnight, the acceptance window is today.)

## Mechanical lint
Run this turn against the committed repo root (`node tools/lint_microstep_submission.mjs <submission> --repo-root .`), verbatim:

```
__LINT__
```

Codex re-runs the linter independently and rejects on any discrepancy.

## Codex activation note
Open your Pass-2 turn with a GCR + Rule Anchor Table (Frontend Conformance §3–§5; Codex Frontend Review §2). Hard gates: CCT completeness (T20 — CCT-1 pastes the complete literal `ChatViewProps`, no prop change; CCT-2 is a zero-prop presentational component), VA-id (T21 — no VA-id cited/registered; this is a Walter-directed anchored **deviation** from VA-T1, not a new registered surface), contract (T22 — none), artifact presence (T25), GCR/Rule-Anchor (T1/T5). Substance: a Walter-directed VA-T1 general-landing deviation (Golden Component Pack §5) — permanent removal of the generic starter chips + an **ephemeral, hard-date-gated (local 2026-07-21, self-expiring at local midnight)** birthday banner + confetti; scope-guarded to `!reviewMode && !sigmaMode`; guardrails T26 (inline-style, no storage, no Tailwind, `prefers-reduced-motion`). **Time-sensitive: the banner only has value if landed today.** Verdict APPROVED or REJECTED only.
