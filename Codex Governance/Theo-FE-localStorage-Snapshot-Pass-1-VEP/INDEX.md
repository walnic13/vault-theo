# Theo Frontend — localStorage snapshot persistence (instant cold-launch: recents + last-opened conversation + self-identity) — Pass-1 Frontend Verified Evidence Pack

Plan-only VEP. Theo's FE persists **nothing** today, so every cold launch is a full network round-trip: `TheoSurface`'s mount effect fires `loadRecents` (`theo_list_conversations`, which blocks the restore gate via `recentsLoaded`), then the restore effect serially `selectRecent(recentsList[0].id)` → `theo_get_conversation` for the last chat, and `loadPeople` for the greeting's self-identity (a visible name-flash until it lands). This microstep persists an **instant-paint seed** — (a) the recents list, (b) the last-opened conversation's first page, (c) the self-identity row — to **`localStorage`**, per authenticated principal, under the now-live **Theo Snapshot Storage Exception** (Governor item 3, landed `4a2132a`). The seed paints the last state instantly on relaunch; the existing loaders (`theo_list_conversations` / `theo_get_conversation` / `listPeople`) still always fetch fresh and overwrite (stale-while-revalidate) — so every real read remains an attributable governed `theo_*` API call and the "singular audit story" holds (Exception §3b). At-rest isolation is the per-principal namespace (`vault-theo:v1:<oid>:*`) plus an active purge of foreign-principal namespaces on mount (Theo has no logout seam). Scope: NEW `src/theo/services/theoSnapshot.ts` + edits to `src/theo/useTheoState.ts` (seed/persist seams) + `src/theo/TheoSurface.tsx` (mount: resolve principal + purge). No component/visual redesign, no new API/route/contract. Back-compat (try/guarded; localStorage-unavailable or standalone-mock → today's in-memory behavior). Reviewer: Codex (Theo frontend review).

## Grounding Conformance Receipt

Role: Claude Code
Turn Type: Verified Evidence Pack (frontend plan)
Grounding Mode: Full Baseline Grounding
Pass: Pass 1
Sub-phase Track: N/A
Reviewer: Codex (Theo frontend review).
Turn issued against HEAD: vault-theo `4a2132adc2b25d317f7bcd2697975e707a38b073`. Cited source unmodified at HEAD; this is a plan-only VEP (the new module is shown in full in §6; Pass-3 lands all edits).

Documents read this turn (Full Baseline Grounding — the Theo FE baseline set), each with its blob SHA at HEAD:
- `governance/CLAUDE_CODE_THEO_FRONTEND_GOVERNOR_STANDARD.md` (item 3 — the Theo Snapshot Storage Exception, the storage authority) — blob `3afec7ea4b13650ce2bf28bf32073179a35e7b24`.
- `governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md` (§5 Rule-Anchor obligation; §6 T20 CCT; F-P6 + T26 exception carve-out; §4B VA registry) — blob `1e6213e404dbd16f70798f701ae1df36cbc9af25`.
- `governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md` (§3/§4/§6 CCT format; §5 visual-deviation rule) — blob `0035a1d9fed103d07bf420b957c3727ec47fcc6b`.
- `governance/CODEX_THEO_FRONTEND_REVIEW_STANDARD.md` (Pass-2 rubric) — blob `25cc488091d619d8f6642b10552df0d019a87933`.
- `Codex Governance/Theo-Snapshot-Storage-Exception-Role-C/INDEX.md` (the live exception, landed `4a2132a`).
- `src/theo/useTheoState.ts` — blob `18389a7b13a7a421336a5fd26724dbf3aca1e333`.
- `src/theo/TheoSurface.tsx` — blob `ca28086a810e9036baaeb4be2569c48c736ce27c`.
- `src/theo/services/theoClient.ts` — blob `5db2e68c253985beb6359b15ac283b1fcdedb0f2`.
- `src/theo/services/gateway.live.ts` — blob `7c5aa141f6ce2575b0320437e7628b1dceff4b01`.
- `src/theo/types.ts` — blob `bc2654bb2ce6b4dacb26e48e5bef3d57448a645b`.

Currency note: the storage authority (Governor item 3 / Conformance F-P6 + T26) is CURRENT at HEAD `4a2132a` — the commit that landed the exception; the source blobs above are unmodified at that HEAD.

## Rule Anchor Table

| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | F-P6 | "except the Theo Snapshot Storage Exception (Governor item 3, Walter-authorized 2026-07-29 — scoped recents/first-page/self-identity snapshot, per-principal, always revalidated)" | §2 — the storage permission this VEP relies on; the persisted set (recents + first page + self-identity) is exactly the exception's scope |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | T26 | "which does NOT trigger T26" | §2 — the localStorage use here is the authorized exception, not a T26 trigger |
| governance/THEO_FRONTEND_GROUNDING_CONFORMANCE_STANDARD.md | §5 | "MUST be backed by at least one Rule Anchor" | §2 classification is anchored (this table) |
| governance/THEO_GOLDEN_COMPONENT_PACK_STANDARD.md | §5 | "VISUAL-AUTHORITY-DEVIATION" | §2 — classified BEHAVIORAL, not a visual deviation: the seed paints the SAME registered surfaces sooner, no pixel change |

## §1 — Feature Identification + Architecture & boundary reconciliation
Microstep: add a per-principal `localStorage` instant-paint seed for the three cold-launch round-trips (recents, last-opened conversation first page, self-identity) WITHOUT changing any rendered surface, contract, or the authoritative read path. **Architecture & boundary reconciliation:** the governed loaders remain the sole authoritative reads — the seed is written from their success paths and always overwritten by the next fetch (SWR); per Exception §3b a revalidation-preserving seed is not a "snapshot lane bypassing the authority regime". Boundary: the gateway / `theo_*` handlers / API Spec / schema are unchanged (no new route/param/field); the only new surface is `theoSnapshot.ts` (browser-storage helpers) + seed/persist calls at the existing `useTheoState` seams. OID for the namespace is derived from the access-token `oid` claim (the same Bearer the gateway already sends), reconciled against `listPeople().self.id`; no new identity dependency.

## §2 — Classification
**BEHAVIORAL (instant-paint seed), not a VISUAL-AUTHORITY-DEVIATION.** The seed renders the SAME registered surfaces — the recents list, the restored chat (VA-T1 chat surface), and the greeting self-name (VA-T11 build-once greeting) — only sooner; no pixels, tokens, layout, or copy change. Storage authority: the Theo Snapshot Storage Exception (Conformance F-P6 / T26 carve-out; Governor item 3), whose scope is exactly (recents + last-opened first page + self-identity). Liveness: every mount still calls the governed loaders, which overwrite the seed. No visual deviation to register.

## §3 — Component Contract Table

| # | Component (ownership; NEW/ACTIVE) | Prop interface | Visual authority (VA-id) | API dependency |
|---|---|---|---|---|
| CT-1 | `theoSnapshot` service (`src/theo/services/theoSnapshot.ts`; **NEW**, non-visual) | Full exported API (literal — see §6): `bindPrincipal(oid: string): void` · `isPrincipalBound(): boolean` · `resolvePrincipal(getAccessToken?: (() => Promise<string \| null>) \| null): Promise<string \| null>` · `getCachedRecents(): ConversationSummary[] \| null` · `setCachedRecents(list: ConversationSummary[]): void` · `getCachedConversation(id: string): ConversationDetail \| null` · `setCachedConversation(id: string, detail: ConversationDetail): void` · `getCachedSelf(): Person \| null` · `setCachedSelf(self: Person): void`. No `any`. Getters/setters are **inert until `bindPrincipal`** (confirmed principal) has run — no un-namespaced pointer. | N/A — non-visual service | Serializes `ConversationSummary[]` / `ConversationDetail` / `Person` (types.ts); confirms OID from the access-token `oid` claim. No network. |
| CT-2 | `useTheoState` (Theo state hook; **ACTIVE**, modify — non-visual) | Hook signature unchanged: `export function useTheoState(): { … }` (large returned state object; **no shape / callback change**). Delta is internal and **has NO initial-useState seeding**: `loadRecents`/`selectRecent`/`loadPeople` seed from the CONFIRMED-principal namespace (the mount flow runs them only after `resolvePrincipal` binds + purges) then persist after each revalidating fetch. | N/A — non-visual hook | Revalidation targets (unchanged): `theo_list_conversations`, `theo_get_conversation`, `theo_list_people` |
| CT-3 | `TheoSurface` (Theo root; **ACTIVE**, modify — mount effect only, non-visual) | Prop interface — full literal, **UNCHANGED**: <br>`export interface TheoSurfaceProps {`<br>`  appContext?: AppContext;`<br>`  navSlot?: HTMLElement \| null;`<br>`  mainSlot?: HTMLElement \| null;`<br>`  getAccessToken?: () => Promise<string \| null>;`<br>`  suppressNarrowHeader?: boolean;`<br>`  newChatNonce?: number;`<br>`  onNavigate?: () => void;`<br>`}` <br>Delta: the mount `useEffect` **awaits** `theoSnapshot.resolvePrincipal(getAccessToken)` (confirm principal + bind + purge foreign namespaces) BEFORE calling the two seeding loaders (`loadRecents`/`loadPeople`). No render/JSX change. | VA-T11 greeting / VA-T1 chat surface — VISUAL-AUTHORITY-MATCH (same surfaces, painted sooner) | `getAccessToken` (existing prop) — token `oid` claim only |

## §4 — Gap Register
**NO-GAPS.** Authority present + CURRENT (the Theo Snapshot Storage Exception, Governor item 3 / Conformance F-P6+T26, landed `4a2132a`, anchored above); persisted scope is exactly the exception's (recents + first page + self-identity — never tokens/secrets/deep history); no contract/render/prop change. **Cross-principal safety (resolves the prior Codex T13/T26):** the cache is INERT until the current principal is confirmed from the live server-issued token — there is no un-namespaced pointer, and the mount flow AWAITS `resolvePrincipal` (bind + foreign-purge) before any seeding loader runs, so no prior-principal recents/conversation/self can be read or rendered on a shared device. **Pre-existing (untouched):** the `react-hooks/exhaustive-deps` warning on the restore effect (`selectRecent` intentionally omitted from deps — the QuietOpen VEP's G-3) is not modified; the `theoClient.ts` L1–5 / `useTheoState` L224–225 "NO browser storage" doc-comments are corrected for accuracy (T13 comment-sweep) as part of Pass-3.

## §5 — Verification (Pass-3)
`npx tsc --noEmit` clean; `npm run build` (vite) green; standalone-harness/mock path unaffected (writes try-guarded + no-op when unconfigured). Manual: on a returning principal, fully relaunch → after the cheap cached-token resolve (covered by the restore splash) recents + last chat + greeting name paint from the confirmed namespace, then revalidate; a different principal on the same device → the cache stays inert until THEIR token OID is confirmed, then their namespace binds and the prior principal's namespace is purged BEFORE any seed renders (verify no prior-principal flash); privacy-mode/quota / unresolved principal → falls back to today's cold load.

## §6 — Plan body (Pass-3, on APPROVAL)
**NEW `src/theo/services/theoSnapshot.ts`** (full source):
```ts
import type { ConversationSummary, ConversationDetail, Person } from '../types';

// Theo Snapshot Storage Exception (Governor item 3, Walter-authorized 2026-07-29): a per-principal
// localStorage instant-paint seed for the three cold-launch round-trips — recents, the last-opened
// conversation's first page, and the self-identity row. Always revalidated by the governed loaders
// (theo_list_conversations / theo_get_conversation / listPeople), so it is a seed, never an
// authoritative read (Exception §3b — not a snapshot lane). NEVER tokens/secrets/deep history.
//
// SECURITY BOUNDARY (Exception §2, binding): the cache is read/written ONLY under the CONFIRMED
// current principal's namespace vault-theo:v1:<oid>:*. The principal is confirmed by decoding the
// Entra `oid` claim of the live, server-issued access token; bindPrincipal() then purges every OTHER
// principal's namespace. Until bindPrincipal has run, ALL reads/writes are DISABLED (return null /
// no-op) — so no prior-principal state can ever be read or rendered before the current principal is
// confirmed. There is deliberately NO un-namespaced pointer that could seed a namespace before
// confirmation (a prior "last-oid" design was a cross-principal leak; removed). All access try/guarded.

const PREFIX = 'vault-theo:v1:';

let principal: string | null = null; // set ONLY by bindPrincipal, after the token oid is confirmed

function nsKey(oid: string, k: string): string { return `${PREFIX}${oid}:${k}`; }
function get<T>(k: string): T | null {
  if (!principal) return null;                          // disabled until the current principal is confirmed
  try { const raw = localStorage.getItem(nsKey(principal, k)); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
}
function set(k: string, v: unknown): void {
  if (!principal) return;                               // disabled until the current principal is confirmed
  try { localStorage.setItem(nsKey(principal, k), JSON.stringify(v)); } catch { /* quota/privacy — in-memory remains */ }
}

// Decode the Entra OID from a JWT payload without verifying (namespace key only; auth is server-side).
function oidFromJwt(token: string): string | null {
  try {
    const p = token.split('.'); if (p.length !== 3) return null;
    const json = JSON.parse(decodeURIComponent(escape(atob(p[1].replace(/-/g, '+').replace(/_/g, '/')))));
    return (json.oid as string) || (json['http://schemas.microsoft.com/identity/claims/objectidentifier'] as string) || null;
  } catch { return null; }
}

// Bind the CONFIRMED principal and purge every OTHER principal's namespace (the active foreign-purge,
// Exception §2). Idempotent. After this, get/set operate under this principal only.
export function bindPrincipal(oid: string): void {
  if (!oid) return;
  principal = oid;
  try {
    const keep = `${PREFIX}${oid}:`;
    const drop: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX) && !key.startsWith(keep)) drop.push(key);
    }
    for (const key of drop) localStorage.removeItem(key);
  } catch { /* ignore */ }
}
export function isPrincipalBound(): boolean { return principal !== null; }

// Resolve + CONFIRM the principal from the live access token, then bind (+ purge). MUST resolve before
// any cache read (callers await it before seeding). Returns the confirmed oid, or null (⇒ cache stays
// disabled → today's cold load, safe). No un-namespaced state is ever consulted.
export async function resolvePrincipal(getAccessToken?: (() => Promise<string | null>) | null): Promise<string | null> {
  if (!getAccessToken) return null;
  try {
    const tok = await getAccessToken();
    const oid = tok ? oidFromJwt(tok) : null;
    if (oid) { bindPrincipal(oid); return oid; }
  } catch { /* ignore */ }
  return null;
}

export function getCachedRecents(): ConversationSummary[] | null { return get<ConversationSummary[]>('recents'); }
export function setCachedRecents(list: ConversationSummary[]): void { set('recents', list); }
export function getCachedConversation(id: string): ConversationDetail | null { return get<ConversationDetail>(`conv:${id}`); }
export function setCachedConversation(id: string, detail: ConversationDetail): void { set(`conv:${id}`, detail); }
export function getCachedSelf(): Person | null { return get<Person>('self'); }
export function setCachedSelf(self: Person): void { set('self', self); }
```

**EDIT `src/theo/useTheoState.ts`** — **NO initial-useState seeding** (the cache is inert until the principal is confirmed, so `recentsList` / `recentsLoaded` / `people` keep their existing empty initial state). All seeding happens inside the loaders below, which the mount flow calls ONLY AFTER `resolvePrincipal` has confirmed + bound + purged:
1. `loadRecents` (L200–214): as its first step (principal now bound), if `isPrincipalBound()` and `getCachedRecents()` returns a list, `setRecentsList(seed)` + `setRecentsLoaded(true)` BEFORE the `await` (instant recents + resolves the restore gate on the cached last chat); after the successful `list.sort(...)`, `setCachedRecents(list)` + `setRecentsList(list)` (revalidate/overwrite).
2. `selectRecent` (L423–475): extract the existing message-mapping (L454–471) into a local `applyConversation(id, d)` helper; before the `await`, if `getCachedConversation(id)` returns a cached detail, `applyConversation(id, cached)` (instant paint — the principal is already confirmed via the mount flow); after `theoClient.getConversation(id)`, `setCachedConversation(id, d)` then `applyConversation(id, d)` (revalidate/overwrite). Persist the RAW `ConversationDetail` (the mapping is re-run from it, so no shape drift).
3. `loadPeople`: before its `await`, if `getCachedSelf()` is present and `people` is empty, `setPeople([cachedSelf])` (the greeting self-name paints immediately, no flash); after the fetch, `setCachedSelf(people.find(p => p.isSelf))` when present, and if the roster self `.id` differs from the token-derived OID call `bindPrincipal(self.id)` (authoritative re-key + re-purge — a defensive no-op when they match).
4. Correct the L224–225 "No browser storage" doc-comment (T13 sweep).

**EDIT `src/theo/TheoSurface.tsx`** (mount effect L85–91): gate the two SEEDING loaders behind the confirmed principal. After `configureGateway`, run an async IIFE that FIRST `await theoSnapshot.resolvePrincipal(getAccessToken)` (confirm the principal from the live token → bind → purge foreign namespaces) and ONLY THEN calls `loadRecents()` + `loadPeople()`; the non-caching `loadProjects()` / `loadGalleryArtifacts()` stay outside the gate (unchanged). This guarantees no cache read occurs before the current principal is confirmed. No JSX change. Correct any "no browser storage" comment if present.

**EDIT `src/theo/services/theoClient.ts`** (L1–5 docstring): correct the "NO browser storage (1A handover §2.5)" line to reference the Theo Snapshot Storage Exception (T13 comment-sweep). No code change.

## §7 — Out of scope
Projects / gallery-artifacts persistence (not on the cold-launch critical path); deep message history beyond the first page (still paged via the loaders); any gateway / `theo_*` handler / API Spec / schema change; any visual redesign.

## Mechanical lint
`node tools/lint_microstep_submission.mjs "Codex Governance/Theo-FE-localStorage-Snapshot-Pass-1-VEP/INDEX.md"` — expect PASS (GCR fields exact; Sub-phase Track N/A; Rule Anchor quotes are literal substrings at HEAD `4a2132a`).

## Requested action
Codex Pass-2 review against the Theo FE Conformance §6 + Golden Component Pack (storage authorized by the live Theo Snapshot Storage Exception; BEHAVIORAL classification; CCT completeness; per-principal namespace + foreign-purge boundary; liveness/revalidation preserved). Plan-only. On APPROVED, Claude Code executes Pass-3 per §6 on `development`, verifies (tsc/build), and the Theo remote publishes via its dev workflow.
