# CLAUDE.md

Guidance for working in this repo.

## Structure

- `packages/core` — framework-agnostic hash/session/storage/verify logic, no UI.
- `packages/react` — the 16 React blocks (Access Gate, PIN Input, Protected Route/Layout/Modal/Card, Session Provider, etc.), built on `packages/core`.
- `registry/react/registry.json` — shadcn-compatible registry entries. Build with `node scripts/build-registry.mjs`.
- `content/blocks/*.mdx` — block metadata/docs (frontmatter: category, tags, props, accessibility, customization) — drives the Blocks gallery.
- `content/templates/*.mdx` — same shape, for Templates (complete single-file screens). Kept in a separate section from Blocks, not mixed in.
- `apps/web` — the site (Next.js). Free to use real npm dependencies (Fumadocs-style content loading, shadcn/ui, etc.) — the copy-owned/no-runtime-dependency rule only applies to what ships to consumers (`packages/*`, the registry), not to the site itself.

## Don't verify with Playwright unless explicitly asked

Typecheck (`pnpm --filter web typecheck`) after edits is fine — it's cheap and catches outright breakage. But do **not** proactively launch the dev server, drive it with Playwright, or take screenshots as a matter of course. Make the change, typecheck it, stop there. Only reach for a browser-driven check when the user explicitly asks for verification.

When verification IS requested, here's what actually worked this session:

1. Make sure the dev server is running (`pnpm --filter web dev`, `localhost:3000`).
2. Drive it with a small Playwright script — click through the actual interaction (unlock flow, tab switches, resets), not just a page load. Take a screenshot and actually look at it; several real bugs were only caught this way (a `min-h-[100dvh]` blowing out a nested preview, a Fragment exploding into a flex row instead of stacking, a mislabeled "Unlocked" panel that was actually still locked, a preview floating inside a padded window instead of filling it).
3. Don't trust `isVisible()`/`getByText()` assertions blindly if a result looks surprising — Playwright's default text matching is case-insensitive and substring-based, which can produce false positives against text that's technically in the DOM but hidden (e.g. source code shown in a hidden tab). When a locator-based check disagrees with a screenshot, believe the screenshot; check raw `innerHTML` occurrence counts if you need to confirm why.
4. Playwright isn't installed as a project dependency (keeps it out of the shipped registry). Run it via a scratch script from a scratchpad directory that has `playwright` installed locally (`npm install playwright` there once), not from inside this repo.
