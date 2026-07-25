# Theo 1B — Chat Media Persistence FE (restore fetched images/videos on reload) — Pass 1 Frontend VEP (PLAN ONLY)

> Pipeline: Vault Theo frontend regime. Author = Claude Code (Pass 1). Reviewer = **Codex** (Pass 2). Plan-only (FE Governor §2); on APPROVAL, Pass 3 commits the listed source (verified `tsc`/`eslint`/`build` green — validated this turn against `src`, reverted) to `development` and the Theo dev SWA serves it (Walter accepts). **Microstep:** the FE half of Chat Media Persistence — when a conversation reloads, re-render the images/videos each assistant turn was fetched with. `theo_get_conversation` now returns `messages[].media` (Part 3, deployed premium via DR-T15); this VEP threads it onto the reloaded message so the existing inline image/video render fires. No rendered-surface change (the render path already exists for live turns). **Backend Parts 1–3 (schema `theo_messages.media` + `theo_message_stream` persist + `theo_get_conversation` read) are DEPLOYED + end-to-end verified;** this FE re-renders the returned media. Null-safe: a turn with no `media` renders text-only, exactly as today.

---

## GROUNDING CONFORMANCE RECEIPT
Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Turn issued against HEAD: `ee255758383a7df263ee0ab4b1f1060ec5ea7e87` (vault-theo, `development`)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Detail: Pass 1 — Frontend Verified Evidence Pack (FE Conformance §4 matrix). Real-in-1B FE wiring. Frontend sub-phases F-P1…F-P7 walked; the backend P/I/E track does not apply → `N/A`. The registered VA-T1 artifact is read this turn: `frontend/theo-frontend-reference.jsx` (the chat message surface — inline image/video render already exists, no visual change here). The consumed contract (`theo_get_conversation` returning `messages[].media`) is the Chat Media Persistence Part 3 handler + its companion API Spec §2.1 Role-C — both Codex-APPROVED and the §2.1 Role-C is now APPLIED (API Spec §2.1 documents `messages[].media` at the blob cited below). Parts 1–3 are DEPLOYED + end-to-end verified this program (a fetched image persisted on send and re-rendered on reload). The two proposed files were applied to `src` this turn and pass `npm run typecheck` (`tsc --noEmit`, exit 0) + `eslint` (exit 0; one **pre-existing** `react-hooks/exhaustive-deps` *warning* at `useTheoState.ts:226`, unchanged by this VEP) + `npm run build` (vite; TheoSurface 297.54 kB / 86.68 kB gzip, exit 0); `src` reverted so the package carries only `proposed-src/`.
Currency anchors: blob SHA (captured this turn via `git rev-parse HEAD:<path>`); verifiable via `git cat-file -p <sha>`.

| # | Document (name + path) | Read tool invocation this turn | Currency anchor (blob SHA @ HEAD) |
| - | ---------------------- | ------------------------------ | --------------------------------- |
| 1 | Claude Code Theo FE Governor Standard — `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (§6 state/gateway) | `Grep` this turn | `b9c0e11d6e52aace2f97caec845a70e66372b713` |
| 2 | Theo FE Grounding Conformance Standard — `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§3–§5; §4 matrix; §4A; §4B) | `Read` this turn | `c614d51c49a0870bb7a4903e63f96ce2dbef314d` |
| 3 | Codex Theo FE Review Standard — `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` | cited (regime reviewer) | `e2b7e0ba91486371414da688ae3697f02a11e252` |
| 4 | Theo Golden Component Pack Standard — `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3 CCT; §5 deltas) | `Read` this turn | `0035a1d9fed103d07bf420b957c3727ec47fcc6b` |
| 5 | Theo Phase 1A Frontend Plan — `governance/THEO_PHASE_1A_FRONTEND_PLAN.md` | cited (surface authority) | `901271478e8bec29177d379fadbbf3d4701a90fe` |
| 6 | **Consumed contract** — Theo API Spec — `spec/THEO_API_SPEC.md` (§2.1 `theo_get_conversation` → `messages[].media` — LANDED: the §2.1 Role-C is applied at this blob) | `Grep` this turn | `a667f4174659b0d7b6e7aa54709047249627420a` |
| 7 | ACTIVE (modify) — `src/theo/types.ts` (`PersistedMessage`) | `Read(full)` this turn | `9bd13e72eac5c783eb395d9a08a7fa0291d10f08` |
| 8 | ACTIVE (modify) — `src/theo/useTheoState.ts` (state owner: `selectRecent` reload) | `Read(full)` this turn | `bcc17944281bc75c38899abd7dfc4b8dfc0aed0f` |
| 9 | **VA-T1 artifact** (registered §4B) — `frontend/theo-frontend-reference.jsx` (chat message surface; inline image/video) | `Grep`/read this turn | `433f6236344f6e8bdbc49db85a53036427610fed` |

No ChatGPT advisory cited (§6 T18). No `corporate-reporting`/`reporting_*` change. No `localStorage`/`sessionStorage`. No Tailwind/CSS-in-JS.

---

## Rule Anchor Table
| Source doc (repo-relative path) | Clause id | Verbatim clause text | Applied in output at |
| ------------------------------- | --------- | -------------------- | -------------------- |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §3–§5 | "MUST open with a Grounding Conformance Receipt" | GCR + Rule Anchor Table (this pack) |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §4 | "Full Baseline Grounding" | GCR grounding mode (Pass 1 FE VEP) |
| spec/THEO_API_SPEC.md | §2.1 | "Get conversation" | §F-P3 — `theo_get_conversation` returns `messages[].media` (Part 3 + §2.1 Role-C) |
| governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md | §6 | "gateway abstraction" | §F-P4 — `media` flows through the existing `getConversation` (no new call) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §3 | "three locked surfaces" | §F-P5 — CCT rows carry interface + VA-id + contract dependency |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "does not alter the rendered surface" | §F-P2 — reload-mapping change is invisible (VISUAL-AUTHORITY-MATCH) |

---

## F-P1 — Feature identification
**Microstep:** Chat Media Persistence **FE** — restore fetched images/videos on reload. The backend (Part 2 persist + Part 3 `theo_get_conversation` returns `messages[].media`) is the contract. This VEP:
1. **Type** — `PersistedMessage` gains `media?: { image?: InlineImage; video?: InlineVideo } | null` (the reloaded-message shape from `theo_get_conversation`; flows through untouched — `getConversation` returns `json.data` directly).
2. **Restore on reload** — `useTheoState.selectRecent`'s assistant-message reconstruction spreads the persisted `media` onto the message (`image`/`video`), so the **existing** inline image/video render path (VA-T1, already used for live turns) fires from persisted data. The two prior returns (with/without `runs`) are consolidated into one with conditional spreads (`runs`, `image`, `video`).

**Out of scope:** the render itself (unchanged — the live-turn image/video render already exists); download/export (short-TTL SAS, not persisted by Part 2).

## F-P2 — UI Authority Reconciliation
| VA-id | Reconciliation | Classification |
| --- | --- | --- |
| VA-T1 (chat message surface; inline image/video) | VA-T1 read this turn: an assistant message already renders `image`/`video` (set during streaming) via the existing inline treatment. This VEP sets those same fields on RELOAD from `m.media` — the rendered surface is byte-identical (a reloaded turn now shows what it showed live). No new/removed UI. | VISUAL-AUTHORITY-MATCH (no rendered-surface change) |
| State reconstruction (`selectRecent`) | The assistant-message mapping gains `media` restoration (mirrors the existing `citations → runs` restoration). Behavioural (what a reloaded message carries), not visual. | ALLOWED DELTA |

No `VISUAL-AUTHORITY-DEVIATION`. No component render change (`ChatView`/`Formatted`/media components untouched). No browser→model call.

## F-P2.5 — Gap Disclosure
| Gap | Description | Pivot |
| --- | --- | --- |
| **G-1** | **Backend dependency — SATISFIED.** `messages[].media` is populated by Parts 1–3, which are **deployed + end-to-end verified** (schema `media_addendum.sql` executed; `theo_message_stream` persists `media` on func-stream; `theo_get_conversation` returns `media` on premium; a fetched image persisted on send + returned on reload). A `null`/absent `media` (turns with no persisted media / pre-migration rows) → reload renders text-only (as today). | **PROCEED** — additive + null-safe (`m.media && typeof m.media === "object" ? … : null`); a missing/null `media` yields no image/video, exactly today's behaviour. The backend is live, so this FE completes the round-trip; it also degrades cleanly on any null `media`. |
| **G-2** | **Standalone dev harness** (mock `getConversation`) returns no `media`. | **PROCEED** — harness-only; the mock has no persisted media. Null-safe mapping → no media, unchanged harness. |
| **G-3** | **Download/export not restored.** Short-TTL SAS (`download`) is not persisted by Part 2 (dead link after TTL), so it is not restored. | **PROCEED (intended)** — only durable image/video (proxy/YouTube URLs) restore; a dead download card is worse than none. |
| **G-4** | **Pre-existing `exhaustive-deps` warning** at `useTheoState.ts:226` (`selectRecent` dep) is unchanged by this VEP (a warning, not an error; eslint exit 0). | **PROCEED (disclosed)** — not introduced here; left as-is. |

No other gaps. No `localStorage`/`sessionStorage`; no Tailwind/CSS-in-JS; no `reporting_*`/`corporate-reporting` change.

## F-P3 — Backend / contract grounding
- **`theo_get_conversation`** (Chat Media Persistence Part 3, premium via DR-T15): response `messages[]` gains an additive nullable `media` (`{ image?, video? }`), documented by the companion API Spec §2.1 Role-C. `getConversation` returns `json.data` directly, so the new field reaches `PersistedMessage` once the type includes it.
- **`InlineImage` / `InlineVideo`** (existing FE types) are the media element shapes — the SAME types set on a live-streamed message (`Message.image`/`Message.video`), so the reload path reuses the existing render with no new component.
- **Transport/auth:** the existing `${apiBase}/api/theo_get_conversation` GET with Bearer (unchanged); `media` is one more field on each returned message row.

## F-P4 — Component reference grounding
**PRIMARY REFERENCE:** the ACTIVE deployed FE modules (structural mirror = their current form); VA-T1 (`frontend/theo-frontend-reference.jsx`) is the surface authority (no surface change). **Types:** `src/theo/types.ts` — `PersistedMessage.media?`. **State owner:** `src/theo/useTheoState.ts` — `selectRecent` restores `media` onto the reloaded assistant message. `gateway.live.ts`/`gateway.mock.ts`/`theoClient.ts` **unchanged** (`getConversation` returns `json.data` directly — widening `PersistedMessage` carries `media` with no code change). Governing authority = the deployed Part 3 handler + API Spec §2.1.

## F-P5 — Component Contract Table
Format: Golden Pack §3. `no any`; every row: interface (full TS) + VA-id + contract dependency.

| # | Module (ownership; ACTIVE/NEW) | Interface change (TypeScript) | Visual authority | Data / contract dependency | Impl eligibility |
| - | --- | --- | --- | --- | --- |
| TC-1 | `types.ts` (Theo surface; **ACTIVE**, modify) | `PersistedMessage` gains `media?: { image?: InlineImage; video?: InlineVideo } \| null;` (additive optional; after `citations`). No other member changes. Full literal locked in §F-P5.1. | VA-T1 (no surface) | API Spec §2.1 `theo_get_conversation` (`messages[].media`) | PROCEED |
| TC-2 | `useTheoState` (Theo surface; **ACTIVE**, modify — state owner) | In `selectRecent`'s `d.messages.map`, the assistant branch consolidates its two returns into one and adds `const media = m.media && typeof m.media === "object" ? m.media : null;` then conditional spreads `...(cites.length ? { runs: … } : {})`, `...(media && media.image ? { image: media.image } : {})`, `...(media && media.video ? { video: media.video } : {})`. No signature/handler-name change; the `Message.image`/`Message.video` fields already exist. | VA-T1 (chat surface; unchanged render) | API Spec §2.1; Part 3 handler | PROCEED |

**Infra:** no `vite.config`/dependency change. `gateway.live.ts`/`gateway.mock.ts`/`theoClient.ts`/`ChatView.tsx`/media components **unchanged**.

## F-P5.1 — Locked interface literals (T20 — full literal CCT surfaces)
**`PersistedMessage`** (`src/theo/types.ts`) — full literal AFTER this VEP (the only change is the additive `media?` member):
```typescript
export interface PersistedMessage {
  id: string; seq: number; role: Role; content: string;
  model: string | null;
  citations: { url?: string; title?: string; cited_text?: string }[] | null;
  media?: { image?: InlineImage; video?: InlineVideo } | null;   // Chat Media Persistence: persisted inline media (theo_get_conversation returns it)
  created_at: string;
}
```
**`Message` media fields** (`src/theo/types.ts`) — UNCHANGED, consumed by the restore (the reload sets `image`/`video`, already present):
```typescript
export interface Message { role: Role; content: string; runs?: CitedRun[]; attachments?: SentAttachment[]; thinking?: string; reasoning?: string; tools?: AgentToolCall[]; download?: FileDownload; image?: InlineImage; video?: InlineVideo; tokens?: number; streaming?: boolean }
```
**`InlineImage` / `InlineVideo`** (`src/theo/types.ts`) — UNCHANGED, the media element shapes:
```typescript
export interface InlineImageItem { imageUrl: string; title?: string; source?: string; pageUrl?: string; license?: string; creator?: string }
export interface InlineImage { url: string; title?: string; source?: string; pageUrl?: string; license?: string; creator?: string; images?: InlineImageItem[] }
export interface InlineVideo { videoUrl: string; embedUrl?: string; title?: string; thumbnail?: string; source?: string; duration?: string; date?: string }
```

## F-P6 — Repository & active-surface grounding
Targets read this turn (proposed-src content-addressed blobs `types.ts`=`bc2654b`, `useTheoState.ts`=`d1b35ac` — byte-identical since first committed at `c450f97`; these blob SHAs are the HEAD-independent currency anchor, the reviewed-commit SHA is carried in the submission note; the `tsc`/`eslint`/`build` validation below ran at repo HEAD `0cfd77a`, historical): `types.ts` (+`PersistedMessage.media?`), `useTheoState.ts` (`selectRecent` restores media). Guardrails: gateway abstraction preserved; no browser→model call; no `localStorage`/`sessionStorage`; no Tailwind; no `reporting_*`/`corporate-reporting`. Validated: `tsc --noEmit` exit 0, `eslint` exit 0 (pre-existing warning only), `vite build` exit 0; `src` reverted (package carries only `proposed-src/`).

## F-P7 — VEP assembly
GCR (§3) + Rule Anchors (§5) open the pack; F-P1→F-P6 walked; Gap Disclosure present (G-1/G-2/G-3/G-4 PROCEED); CCT locked (2 ACTIVE modify rows + §F-P5.1 full literals). No implementation begun — but the two files were validated this turn (`tsc` + `eslint` exit 0 + `build` green, `src` reverted). On Codex APPROVAL, Pass 3 commits the two files to `development` (the Theo dev SWA serves it; Walter accepts) → **reloaded chats re-render their fetched images/videos** (Parts 1–3 are already deployed + end-to-end verified, so this is the last piece of the round-trip). Walter SWA acceptance = Visual Acceptance Evidence.

## Mechanical lint (Conformance T24)
```
$ node tools/lint_microstep_submission.mjs "Codex Governance/Theo-1B-MediaPersist-FE-Pass-1-VEP/Theo_1B_MediaPersist_FE_VEP.md" --repo-root .
PASS
```

*End of Chat Media Persistence FE Pass-1 Frontend VEP (plan only).*
