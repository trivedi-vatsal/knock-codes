# platform-correctness-and-ux — Tasks

Flat checkbox list grouped by piece, closed out against a single PR. Check items off as they're actually done. Leave blocked items unchecked with a one-line reason — don't check off work that didn't happen.

## Plan folder

- [x] Write `docs/plans/platform-correctness-and-ux/{AUDIT,PLAN,TASKS}.md`

## 1. Shared session

- [x] Add `useOptionalKnockCodesContext()` (null outside a provider; keep throwing `useKnockCodesContext` for logout/banner/receipt)
- [x] `<KnockCodes>`, `<ProtectedCard>`, `<ProtectedModal>` use context when present, else `useKnockCodes(config)`
- [x] `ProtectedRoute` `FallbackGate` shares one hook instance (no second `useKnockCodes`)
- [x] Tests: provider + gate + logout in the same tab actually relocks
- [x] Tests: standalone `<KnockCodes>` still works with no provider
- [x] Update `content/blocks/session-provider.mdx` (and knock-codes / protected-* if the composition paragraph is wrong)
- [x] Changelog: bugfix, same-tab shared session

## 2. Server-mode restore + threat-model copy

- [x] Add optional `validateSession` to `KnockCodesConfig`; call on initial read + subscribe; clear on false/throw
- [x] Hook tests: restore rejected → idle + store cleared; omitted callback preserves today's expiry-only behavior
- [x] One server template (Next.js) shows a restore/`validateSession` fetch example; others get a one-line pointer
- [x] Rewrite README local-vs-server "Bypassable via DevTools" row; note registry (not npm) as distribution
- [ ] Align `apps/web/app/security/page.tsx`, `mode-comparison-table.tsx`, `THREAT_MODEL_COPY` with "hides the hash, not the children" — site PR
- [x] Changelog: additive prop + copy correction

## 3. Hydration `ready` flag

- [x] Add `ready: boolean` to `UseKnockCodesResult`; flip true after first `store.get()`
- [x] Gates and all four React templates: `if (!ready) return null` (no PIN flash)
- [x] Hook test: before the effect, `ready === false`; after, session restored or idle without a flash path
- [x] Changelog: additive field

## Registry (after pieces 1–3)

- [x] `pnpm registry:build`
- [x] `pnpm registry:check`

## 4. Homepage spine

- [ ] Hero: one primary CTA, drop stacked snippet + simulator + "under 100 lines"
- [ ] Mount `LiveGate` as the hero demo; one demo code (`4242`)
- [ ] Put hash generator on the how-it-works section (no bounce to getting-started for the tool itself)
- [ ] Drop or fold problem section + static bento; keep one honest local/server table
- [ ] Stop repeating 1-file/0-deps in ticker + stats + checkmarks (say it once)
- [ ] Remove `WorkspaceSimulator` from the homepage; delete the file if unreferenced
- [ ] Badge / subtitle copy matches CLI-or-paste reality (zero runtime deps, not "one 100-line file")

## 5. Nav / IA

- [ ] Primary nav: Templates, Getting Started, Security (`aria-current` on active)
- [ ] Blocks: footer + template-page link, not a peer in the header
- [ ] Templates index: gallery first; contract snippet not above the fold
- [ ] Remove mirrored templates↔blocks bottom CTA ping-pong

## 6. Detail previews + install

- [ ] Default preview dark; toggle labeled light/dark
- [ ] Shorter default canvas; optional expand if full-page templates clip
- [ ] Single demo code from `lib/demo-hash.ts` in hero + template preview
- [ ] Install: one recommended command; other methods collapsed
- [ ] Hash generator only on getting-started; template pages link there

## 7. Getting started

- [ ] Single column: generator → command → framework tabs → server-mode link
- [ ] Remove five BlueprintFrame restatements (or shrink to a compact numbered list)

## 8. A11y / mobile / CI

- [ ] FAQ `<summary>` chevron / open-state affordance
- [ ] Mobile nav: Changelog, focus trap, scroll lock
- [ ] Proof ticker: no focusable link inside `aria-hidden`
- [ ] Skip-to-content in `layout.tsx`
- [ ] CI: add `pnpm --filter web build` unless it is too slow (note why if skipped)

## Blocked (outside our control)

- [x] Split library vs site into two PRs — library is this branch; site is a follow-up PR.
- [ ] Site PR (`feature/site-ux-spine`, pieces 4–8) — after this library PR lands.

## Close-out

- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm lint`
- [ ] `pnpm registry:check`
- [ ] `pnpm --filter web typecheck` (and web build if added to CI)
- [ ] Changelog entry for library changes
- [ ] PR opened (only after the user's explicit go-ahead)
