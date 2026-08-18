# platform-correctness-and-ux — Make the library honest and the site a shorter path to paste

Branch: `feature/library-session-honesty` (this PR). Site work is a **second** PR on `feature/site-ux-spine` after this lands. No new architecture: optional callback + context consumption.

## PRs

1. **Library** (this branch) — pieces 1–3, registry, README, server templates, changelog.
2. **Site** (follow-up) — pieces 4–8 (homepage, nav, previews, getting-started, a11y). `/security` copy alignment lives in PR 2 so this PR stays in `packages/*` + registry + root README.

## Readiness matrix

| Piece | Status | Reason |
|---|---|---|
| Shared session (gates read provider) | Ready | Confirmed: gates call `useKnockCodes` themselves; context already exists (`AUDIT.md`). |
| Server-mode restore + docs honesty | Ready | Token is write-only; README "DevTools: No" is false. Additive `validateSession` is the existing-pattern fix. |
| Hydration `ready` flag | Ready | Session starts `null`; effect reads storage. Additive field on `UseKnockCodesResult`. |
| Homepage spine | Ready | `page.tsx` section list and unused `LiveGate` / `FeatureGrid` confirmed. |
| Nav / IA | Ready | Header/footer/gallery CTAs confirmed. |
| Detail previews + install | Ready | `preview-panel.tsx`, dual demo codes, install panel confirmed. |
| Getting-started tighten | Ready | Five-step restatement vs homepage three-step + generator confirmed. |
| A11y / mobile | Ready | FAQ, mobile nav, ticker `aria-hidden` confirmed. |
| Delete shipped thin blocks | Out of scope | Copy-owned breaking change. Document as "use `<KnockCodes variant>`" in block MDX only if we touch those pages. |
| Change default storage / React 18 peer | Out of scope | Breaking; not required for this pass. |
| Mandatory server token verification | Doesn't exist | Optional callback only. Content behind the gate stays client-rendered unless the consumer fetches after unlock. |

Full verification detail is in `AUDIT.md`.

## 1. Shared session

**What changes:** `packages/react/KnockCodesProvider.tsx`, `KnockCodes.tsx`, `ProtectedCard.tsx`, `ProtectedModal.tsx`, `ProtectedRoute.tsx`, `packages/react/test/*`, matching `content/blocks/*.mdx` if the composition story changes. Then `pnpm registry:build`.

**Approach:** Export a non-throwing `useOptionalKnockCodesContext()` (or equivalent) that returns `UseKnockCodesResult | null`. Every visible gate that currently calls `useKnockCodes(config)` uses context when present, otherwise the hook. If both provider and per-gate `config` are passed, prefer context and ignore the duplicate config (document that). `ProtectedRoute` `FallbackGate` must not spin a second hook. Templates stay standalone (they are single-file by design and do not import the provider).

This is a bugfix for the composition the provider docs already describe. Changelog: bugfix, not a breaking API change.

## 2. Server-mode restore + threat-model copy

**What changes:** `packages/react/types.ts`, `useKnockCodes.ts`, hook tests, `content/server-templates/nextjs-route-handler.js` (and siblings as a short comment + example `validate` fetch), `README.md` comparison table, `apps/web/app/security/page.tsx` / `apps/web/lib/copy.ts`, `apps/web/components/mode-comparison-table.tsx`, `apps/web/components/faq-section.tsx` (already honest about bundle contents — keep it, align the tables).

**Approach:** Additive optional `validateSession?: (session: KnockCodesSession) => boolean | Promise<boolean>` on `KnockCodesConfig`. Call it on the initial storage read and on subscribe. If it returns false / throws, `store.clear()` and stay idle. Server templates gain a 5-line "on restore, POST the token" example; they do not become a second product.

Copy change (required even if the callback ships): server mode **hides the hash**, it does **not** hide client-rendered children or stop a forged session unless `validateSession` is wired. Root README "Bypassable via DevTools: No" becomes something like "Hash is not in the bundle; content still is unless you fetch after unlock." Package vs root README: one sentence that distribution is the registry, not npm.

Do not add a public `"restoring"` state (would break exhaustive switches). See piece 3.

## 3. Hydration `ready` flag

**What changes:** `packages/react/types.ts`, `useKnockCodes.ts`, gate renderers (`KnockCodes`, card, modal, templates), hook tests.

**Approach:** `UseKnockCodesResult.ready: boolean`, `false` until the first `store.get()` effect runs. Gates: if `!ready`, render `null` (or children-sized placeholder with no PIN). After `ready`, existing idle/unlocked behavior. Additive; default consumers that ignore `ready` still work, they just keep today's flash until they upgrade.

Templates need the same `if (!ready) return null` — they call the hook directly.

## 4. Homepage spine

**What changes:** `apps/web/app/page.tsx`, `apps/web/components/live-gate.tsx` (promote), `workspace-simulator.tsx` (stop importing from home; delete only if nothing else uses it), `how-it-works-section.tsx` (embed `HashGenerator` or a compact variant instead of linking away), possibly `feature-grid.tsx` in place of the static bento mini-gate.

**Approach:** Keep always-dark / amber / type. Cut, don't restyle.

New order:

1. **See it** — shorter hero (title, one subtitle, one primary CTA `Get started`, secondary `Browse templates`). Replace snippet + simulator + checkmarks with `LiveGate` (real `4242` knock). Proof ticker can stay as a thin band or drop if it still repeats the same four claims.
2. **Get it** — existing 3 steps, with the hash generator **on the page** (reuse `HashGenerator` / `MiniHashGenerator`).
3. **Pick a look** — existing templates gallery.
4. **Know the limits** — one local vs server table (the honest one from piece 2) + link to `/security`. Drop or fold "the problem" cards and the static bento. Stats band is optional; do not repeat "1 file / 0 deps" if the ticker already said it.
5. FAQ + short CTA.

Remove the hero line "Under 100 lines of code." Badge copy: "Copy-paste. Zero runtime dependencies." — not "one single file" if CLI install pulls the chain.

Unused after this: `WorkspaceSimulator` (if unreferenced, delete), problem section if unused, static `MiniGatePreview` inside bento if the bento goes.

## 5. Nav / IA

**What changes:** `site-header.tsx`, `mobile-nav.tsx`, `site-footer.tsx`, `apps/web/app/templates/page.tsx`, `apps/web/app/blocks/page.tsx`.

**Approach:**

- Nav: Templates, Getting Started, Security. Blocks remains in the footer and as a text link from template pages ("Build from blocks"), not a peer in the primary nav. Changelog stays as the version chip.
- `aria-current="page"` on the active route.
- Templates gallery: cards first, contract snippet below or on the detail page.
- Drop the mirrored bottom CTAs that bounce templates ↔ blocks. One directional hint is enough.

## 6. Detail previews + install

**What changes:** `preview-panel.tsx`, `template-preview.tsx`, `apps/web/lib/demo-hash.ts` (single demo code), `installation-panel.tsx`, `template-installation-section.tsx`, hash-generator placement on template pages.

**Approach:**

- Default preview dark (`useState(true)`), label the toggle as "Light preview" / "Dark preview".
- Shorten default canvas (e.g. `h-[28rem]` or `min-h-[24rem]`) with an optional expand control if a full-page template clips.
- One demo code everywhere (`4242` from `demo-hash.ts`); print it once on the canvas (already started in `TemplatePreview`).
- Install: one recommended command visible; GitHub shorthand + hand-copy behind a collapsed "Other ways".
- Hash generator: keep on `/getting-started`; remove the duplicate from every template security section (link to `#generator` instead).

Theme Lab stays; do not expand it this pass. Optional: default-closed is fine.

## 7. Getting started

**What changes:** `apps/web/app/getting-started/page.tsx`.

**Approach:** Single column: hash generator → install command → Next/Vite/React snippet tabs → "when to use server mode" → link to `/security`. Drop the five BlueprintFrame restatements of the homepage steps (or keep them as a compact numbered list above the generator, not a second essay).

## 8. A11y / mobile / CI nits

**What changes:** `faq-section.tsx`, `mobile-nav.tsx`, `proof-ticker.tsx`, `site-header.tsx`, `.github/workflows/ci.yml` (add `pnpm --filter web build` or `pnpm build` if it is cheap enough).

**Approach:** FAQ chevron via `group-open:` rotate. Mobile nav: focus trap + body scroll lock + Changelog. Proof ticker: either drop `aria-hidden` on the link row or don't put a real link inside an `aria-hidden` marquee. Skip-to-content link in `layout.tsx`. CI web build: add unless it blows past runner time; deploy already builds it.

## Blocked / stubbed pieces

- **Existing dirty working tree** — do not start this branch until that work is settled. Tracked in AUDIT.md open question 3.
- **Mandatory token verification** — not in this pass. `validateSession` is the hook; consumers opt in.

## Sequencing on the single branch

1. This plan folder.
2. Piece 1 — shared session + tests.
3. Piece 2 — `validateSession` + honest copy (library + `/security` + README).
4. Piece 3 — `ready` flag + gate/template flash.
5. `pnpm registry:build` + `registry:check` (required after 1–3).
6. Piece 4 — homepage spine (`LiveGate`, cut sections).
7. Piece 5 — nav / IA.
8. Piece 6 — previews + install + one demo code.
9. Piece 7 — getting-started.
10. Piece 8 — a11y + CI.
11. `pnpm typecheck` / `test` / `lint` / `registry:check` / `pnpm --filter web typecheck`.
12. Changelog entry for library bugfix + additive props (`validateSession`, `ready`).
