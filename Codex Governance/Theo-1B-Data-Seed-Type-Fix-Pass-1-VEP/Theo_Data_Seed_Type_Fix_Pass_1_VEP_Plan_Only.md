# Theo INIT_PROJECTS Seed Type Fix (typecheck green) — FE Pass 1 VEP (Plan Only)

> Theo FE regime. Pass 1 Verified Evidence Pack, plan-only. Author = Claude Code. Reviewer = **Codex**. Authority = Walter (2026-07-08 — "knock out the typecheck cleanup"). A build-health type fix: `src/theo/data.ts` `INIT_PROJECTS` is typed `Omit<Project, "visibility" | "isOwner">[]`, but `Project` gained `sharedWithMe` + `memberCount` during B5 sharing and the `Omit` was not extended, so `tsc --noEmit` reports 3 errors at HEAD. The mock gateway (`gateway.mock.ts:78`) already supplies all four fields on load, so the correct fix is to extend the `Omit` — a **type-annotation-only** change with **zero runtime / rendered-surface change**.

## Grounding Conformance Receipt
Turn Type: Pass 1 — Frontend Verified Evidence Pack (plan-only)
Grounding Mode: Targeted Current-Turn Grounding
Pass: Pass 1
Sub-phase Track: N/A
Repo / HEAD: vault-theo `development` @ `2736cc9`

Documents grounded this turn:
- `src/theo/types.ts` — the `Project` interface (requires `sharedWithMe`, `memberCount`)
- `src/theo/data.ts` — the `INIT_PROJECTS` seed (TARGET — `Omit` to extend)
- `src/theo/services/gateway.mock.ts` — the mock load that already adds all four fields (proves no runtime change)
- Backend baseline: N/A — mock harness constant; no gateway/contract/endpoint.

## Rule Anchor Table

| file | section | quote |
| ---- | ------- | ----- |
| src/theo/types.ts | Project interface | "sharedWithMe: boolean;" |
| src/theo/types.ts | Project interface | "memberCount: number;" |
| src/theo/data.ts | INIT_PROJECTS | "export const INIT_PROJECTS: Omit<Project," |
| src/theo/services/gateway.mock.ts | mock load | "sharedWithMe: false, memberCount: 0" |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "without rendered-surface change" |

## Architecture & boundary reconciliation

`Project` (types.ts, anchors 1–2) requires `sharedWithMe: boolean` and `memberCount: number`. The seed `INIT_PROJECTS` (anchor 3) omits only `visibility | isOwner`; the mock gateway map (anchor 4) already adds **all four** (`visibility`, `isOwner`, `sharedWithMe`, `memberCount`) when producing `Project[]` at load. So the seed never needs the two fields at runtime — the omission is a stale type annotation from before B5 added them. Extending the `Omit` aligns the annotation to reality with no runtime change. Per Golden Component Pack §5 (anchor 5) this is an allowed delta — a change **without rendered-surface change** (no component, no prop, no visual authority involved). No VISUAL-AUTHORITY-DEVIATION; VA-T1 surface untouched.

## Gap Disclosure

**NO-GAPS.** Behavior-neutral (gateway.mock already supplies the fields); build already succeeds; this only turns `npm run typecheck` green. No downstream trigger.

## Component Contract Table

COMPONENT CONTRACT TABLE
Microstep: Theo INIT_PROJECTS seed type fix

| # | Component | Prop interface | VA-id citation | Contract dependency |
|---|-----------|----------------|----------------|---------------------|
| 1 | N/A — no rendered component | No prop interface changed. Target is the `INIT_PROJECTS` constant (a mock-harness data seed in `data.ts`), not a component; no rendered surface, prop, state, or handler is added/removed/retyped. | N/A — no visual authority (no rendered-surface change; Golden Pack §5) | None — mock-harness constant; no gateway/contract/endpoint |

## Plan body (for Pass 3) — one type annotation edit to `src/theo/data.ts`

Extend the seed's `Omit` to cover the two fields the mock gateway adds on load, and refresh the adjacent comment:

- **Before (line 28–29):** comment `// B5a: the harness seed omits visibility/isOwner; gateway.mock adds them (private + owned) on load.` then `export const INIT_PROJECTS: Omit<Project, "visibility" | "isOwner">[] = [`
- **After:** comment `// B5a/B5c/B5d: the harness seed omits visibility/isOwner/sharedWithMe/memberCount; gateway.mock adds all four on load.` then `export const INIT_PROJECTS: Omit<Project, "visibility" | "isOwner" | "sharedWithMe" | "memberCount">[] = [`

No object literal changes; no runtime change. `npm run typecheck` goes from 3 errors → 0; `npm run build` remains ✓.

**Boundary.** One file (`data.ts`), one type annotation + one comment. No component, prop, surface, gateway, or contract change.

**Pass-3 plan.** `npm run typecheck` clean (0 errors); `npm run build` ✓; no SWA visual test needed (no rendered-surface change) — a build-health fix only.
