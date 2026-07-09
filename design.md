# Design pass: motion.dev-inspired grammar for knock.codes

Working notes for the annotation/numbering, self-demonstrating feature grid, restrained
motion, AI-surface, and footer phases. Written before implementation; kept as a record of
what was decided and why. Source of truth for "why" — the code should stay comment-light.

## Constraints re-confirmed from CLAUDE.md before touching anything

- `packages/react/*.tsx` templates must stay single-file, zero-dependency. Any animation
  added there is a plain `<style>` tag with `@keyframes`, matching the existing shake-on-error
  pattern — never a Tailwind config keyframe, never an import.
- Editing any `packages/react/*.tsx` file requires `pnpm registry:build` afterward (it
  regenerates `apps/web/public/r/react/*.json`, which embeds file content) and
  `pnpm registry:check` to confirm no drift. `registry/react/registry.json` itself is
  path-only (verified: `getRegistryItemSource` reads straight off disk), so it only needs
  hand-editing if the file list or `registryDependencies` chain changes — not for in-place
  content edits.
- Don't hand-edit the root `registry.json` — regenerated only.
- `pnpm --filter web typecheck` after edits; no Playwright/dev-server verification unless
  asked.
- No new runtime dependency in `packages/*`. `apps/web` may add `motion`, but only if CSS
  can't do the job — evaluated per phase below, and in every case here it can, so **no new
  dependency is added**.

## Codebase facts that constrain the design (verified by reading source, not assumed)

- Real prop names, from `packages/react/types.ts` and `KnockCodesTemplate.tsx`:
  `expectedHash`, `verify` (a `VerifyFn`), `storage` (`"localStorage" | "sessionStorage" |
  "memory"`), `storageKey`, `timeout` (ms), `activityTracking`, and template-only `remember?:
  "session"`. **There is no `mode="server"` prop** — server mode is selected by passing
  `verify` instead of `expectedHash`. The feature-grid snippet for "server mode" will show
  `verify={verifyFn}`, not the spec's placeholder `mode="server"`, per the brief's own
  fallback instruction ("demo what does exist instead; do not invent API").
- **There is no attempts/rate-limit prop on the client.** Rate limiting is server-template-side
  only (Express/Hono/Next route handlers under `content/server-templates/`). The FIG.05 "wrong
  knock" card demos the real thing that exists: `error: KnockCodesError | null` returned from
  `useKnockCodes`, with `error.reason` and the default `invalidErrorMessage` copy.
- `useKnockCodes` (packages/react/useKnockCodes.ts) is already exported and already used
  directly by `apps/web/components/block-preview.tsx` for hand-built mini demos (see
  `NEVER_RESOLVES_VERIFY`, `useScriptedPreviewState`) — the feature grid reuses that exact
  pattern (headless hook + custom minimal UI) instead of inventing a new demo mechanism.
- No `prefers-reduced-motion` handling exists anywhere in the repo today (grep confirmed
  zero matches). All four full-page templates (`KnockCodesTemplate`, `MinimalAccessTemplate`,
  `BrandedAccessTemplate`, `ModalAccessTemplate`) and `plain-html-gate.html` independently
  define an unguarded shake `@keyframes`. This is a real gap against the acceptance criteria
  and gets fixed in every one of those five files as part of this pass, not just in
  newly-added site code.
- No single version source exists. `app/changelog/page.tsx` hardcodes `"1.0.0"` five times
  (once per template). New: `apps/web/lib/version.ts` exporting `TEMPLATE_SET_VERSION`,
  imported by the changelog table and the nav — one source, per the brief.
- Section eyebrows today are `→ {label}` (`components/section-header.tsx`) and `BlueprintFrame`
  renders a straddling corner tag also prefixed `→ {label}`. Per the brief, `→` should regain
  meaning as inline-link/list-marker punctuation. Decision: `SectionHeader` drops the arrow
  entirely; when a `number` prop is passed it renders `01 › Templates` (monospace, numeral +
  chevron, not literal `>` — reads cleaner than a bare greater-than in a sans/mono mix but is
  the same "numbered eyebrow" grammar the brief asks for). `BlueprintFrame`'s corner tag is a
  distinct visual element (a straddling plate, not a page-eyebrow) and is left alone — it isn't
  in the brief's numbered-section list, and rewriting every `BlueprintFrame` call site across
  the site is out of scope for an annotation pass. New `FigureLabel` component handles
  `FIG.01`-style tags instead, kept separate from both.

## Phase 1 — numbering & annotation

- `SectionHeader` gets an optional `number` prop. Homepage sections get 01–06 in the order
  the brief lists them: **01 Templates, 02 How it works, 03 Local vs. server, 04 Threat
  model, 05 Use cases, 06 FAQ.** This reorders the current homepage (which currently runs
  Templates → How it works → Local vs. server → Use cases → Threat model → FAQ) by swapping
  Use Cases and Threat model. Recorded here because it's a content-order change, not just a
  label change — the changelog entry added for this pass calls it out explicitly.
- `FigureLabel` (new, `components/figure-label.tsx`): renders `FIG.01` etc., monospace,
  absolutely positioned top-left of a preview canvas. Applied to: `HeroPreview` (FIG.01),
  each of the 5 new feature-grid cards (FIG.01–FIG.05, matching the brief's own numbering),
  `TemplatePreview` (FIG.01 — one live preview per template page), `BlockPreview` (FIG.01 —
  same reasoning). Not applied to every template-gallery thumbnail; those aren't live demos,
  they're static cards (hover micro-behavior instead, see Phase 3).
- Nav: `SiteHeader` gets `// Open Source // MIT` plus `TEMPLATE_SET_VERSION`, both monospace,
  version linking to `/changelog`.

## Phase 2 — feature grid (`components/feature-grid.tsx`, new, replaces nothing — inserted
into the existing "How it works" section alongside the 4-step strip, since the steps explain
process and the grid demonstrates capability; removing the steps wasn't asked for)

Five cards, each: `FigureLabel`, one-line title, a `<code>` snippet of the real prop, a live
mini demo built on `useKnockCodes` directly (not `<KnockCodesTemplate>` — too heavy visually
for a card), reusing `@knock-codes/react`'s exported `PinInput` where an input is needed.

1. **FIG.01 Local mode** — `useKnockCodes({ expectedHash })`. Snippet: `expectedHash={hash}`.
2. **FIG.02 Server mode** — `useKnockCodes({ verify: verifyFn })` where `verifyFn` is a real
   `async` function with a deliberate ~1.2s delay before resolving, so the "Checking…"
   (`submitting`) state is a genuine network-shaped wait, not a hardcoded visual. Snippet:
   `verify={verifyFn}`.
3. **FIG.03 Session memory** — a toggle switches `storage` between `"memory"` and
   `"sessionStorage"` (a distinct `storageKey` so the demo never touches a real session), plus
   a "simulate reload" button that remounts the subtree — with `sessionStorage` selected the
   demo stays unlocked after "reload"; with `memory` it resets. Real behavior, not a canned
   before/after image. Snippet: `remember="session"` (the actual template-level prop name;
   the hook-level demo reimplements what that prop does under the hood, but the snippet shown
   is the real public API).
4. **FIG.04 Timeout** — `useKnockCodes({ timeout: 8000 })`, a countdown read from
   `session.expiresAt - Date.now()` on a `setInterval`, auto-relocks via the hook's own expiry
   polling. Snippet: `timeout={8000}`.
5. **FIG.05 Wrong knock** — a "Knock wrong code" button calls `submit("0000")` against a real
   hash, producing the real `error.reason === "invalid"` state; a shared CSS shake (new
   `.kc-shake` utility in `globals.css`, reduced-motion-guarded) plays on the card, and the
   real default copy (`"That code didn't work. Try again."`) is shown. Snippet: `error.reason`.

## Phase 3 — motion, CSS-only throughout (no `motion` package)

- Template unlock: `KnockCodesTemplate.tsx`'s existing two-phase success panel (checkmark →
  children after 550ms) gets a fade+slide-in on the checkmark panel and a fade-in on the
  revealed children, both via the same inline-`<style>` keyframe pattern already used for the
  shake, each wrapped in `@media (prefers-reduced-motion: no-preference)` so the animation
  name simply doesn't resolve to anything under reduced motion (no JS branch needed). Same
  treatment applied to the shake keyframes in all four templates + the HTML gate, which today
  have no reduced-motion guard at all.
- Section entrances: new `components/reveal.tsx`, a small client component wrapping children
  in an `IntersectionObserver` that adds an "in-view" class once (`triggerOnce`), driving a
  `translateY(8px)→0` + `opacity 0→1` transition, ≤350ms, transform/opacity only. Under
  `prefers-reduced-motion: reduce` the CSS starts the element fully visible (no transform), so
  reduced-motion users never see a delayed reveal either. Applied to each homepage section.
- Template gallery cards (`TemplateCard`/`AccessPanelCard`): hover micro-behavior is already
  partially there (corner ticks brighten). Extending it — decided against inventing a
  per-template-specific "signature" hover (blur-unblur / digit-fill) for all four templates in
  one shot, since it would mean bespoke CSS per template thumbnail with no live component
  backing it (`TemplateCard` renders static copy, not a live preview) and risks looking like
  invented chrome rather than a real demonstration. Instead: a single, consistent hover
  treatment across all cards (subtle lift via `translateY(-2px)`, border/accent brighten,
  arrow nudge — the arrow nudge already exists) — restrained, on-brand, and honest about what
  the card actually is (a link, not a live gate).
- Buttons/links: `buttonVariants` already has focus-visible ring + active press state. Plain
  text links (footer, section "view all" links, FAQ) don't. Add a base-layer rule in
  `globals.css` for bare `a:focus-visible` (ring) and `a:active` (1px press), transition
  guarded under reduced-motion.

## Phase 4 — AI surface

- `apps/web/app/llms.txt/route.ts` — generated (not a static public file) so it can pull
  template/block titles, descriptions, and props from the same `lib/templates.ts` /
  `lib/blocks.ts` readers everything else uses, so it can't drift from the real prop tables.
  Includes a short security-model summary sourced from `lib/copy.ts`'s existing
  `THREAT_MODEL_COPY` (already the single source for that copy elsewhere).
- Template detail page: "Adapt with AI" `CopyButton` (reusing the existing component) whose
  copied text includes the registry source reference, the real props for that template, and
  an explicit instruction to preserve `expectedHash`/`verify` logic and never invent an
  `attempts` field or similar — i.e. the prompt itself stays honest about the threat model,
  matching the brief's requirement.
- Hero proof strip: one more row, `Built for AI`, linking to `/llms.txt`.

## Phase 5 — footer

Three columns (Product / Resources / Author) at the depth the site actually supports —
checked against real routes before writing them, no placeholder links:
- Product: Templates (`/templates`), Blocks (`/blocks`), Getting Started
  (`/getting-started`), Security (`/security`), Changelog (`/changelog`).
- Resources: llms.txt (`/llms.txt`), GitHub (repo), License (repo `LICENSE`).
- Author: vatsal.xyz, GitHub profile.
Monospace microtype consistent with Phase 1's nav treatment; version + copyright line at the
bottom, version pulled from the same `lib/version.ts` constant as the nav.

## Amendment — merged with concurrent work already on `main`

Mid-session, 5 commits landed on `main` from a separate, already-running session doing
overlapping "trust signal" work: nav Getting Started/GitHub links, footer author links,
per-page OG metadata (`lib/seo.ts`), a shared demo hash (`lib/demo-hash.ts`), live frozen
template-card preview thumbnails (`template-card-preview.tsx`), per-template `version`
frontmatter on every `content/templates/*.mdx`, and — already — the exact homepage section
reorder this plan called for (Threat model before Use Cases). Confirmed with the user to build
on top of it rather than redo it. Adjustments this causes to the plan above:

- **Version source**: per-template `version` now lives in each template's own mdx
  frontmatter (real source, not invented for this pass) but the changelog page still
  hardcodes a parallel `TEMPLATE_VERSIONS` array with the same five values — that's the actual
  "hardcoded twice" this pass needs to fix, more directly than adding a fourth counter would.
  `lib/version.ts` becomes `getTemplateSetVersion()`, reading the first template's frontmatter
  version (they're all in lockstep today) instead of holding its own literal string. Changelog's
  `TEMPLATE_VERSIONS` table is rebuilt from `getAllTemplates()` directly, removing the duplicate.
- **Nav**: GitHub link already present; adding `// Open Source // MIT` + the version-linked-to-
  `/changelog` badge alongside it, not replacing it.
- **Footer**: already has effectively-Resources and effectively-Author links in one flat row;
  restructuring into the three columns from Phase 5 reuses those same links/labels rather than
  rewriting the copy, and adds what's still missing (Templates/Blocks under Product, llms.txt
  under Resources, version + copyright line).
- **Template gallery hover**: cards now render a frozen, non-interactive live preview
  (`TemplateCardPreview`) instead of a text-only card. Per-template bespoke hover "signature
  micro-behavior" (blur-unblur / digit-fill) is still skipped for the reason already recorded
  below, but the hover treatment now also applies a subtle scale to that live thumbnail — it
  reads as "the demo waking up," not just a border/arrow change.
- Feature grid (Phase 2) is inserted after the existing 5-step "How it works" strip and hash
  generator, not replacing them — the steps narrate process, the grid demonstrates capability
  live; both are honest content, not duplicative.

## Explicitly out of scope for this pass

- `getting-started`, `security`, `blocks`, `templates` gallery pages are not renumbered with
  FIG/section numbers — the brief scopes the numbering system to the homepage, and template
  detail pages only get the FIG label + Adapt-with-AI addition called out explicitly.
- No Lighthouse before/after — no Lighthouse CI wiring exists in this repo to produce one;
  said so in the summary rather than fabricating numbers.
