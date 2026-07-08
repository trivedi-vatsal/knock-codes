# AGENTS.md

Guidance for working in this repo.

## Structure

- `packages/core` — framework-agnostic hash/session/storage/verify logic, no UI.
- `packages/react` — the 16 React blocks (Access Gate, PIN Input, Protected Route/Layout/Modal/Card, Session Provider, etc.), built on `packages/core`.
- `registry/react/registry.json` — shadcn-compatible registry entries. Build with `node scripts/build-registry.mjs`.
- `content/blocks/*.mdx` — block metadata/docs (frontmatter: category, tags, props, accessibility, customization) — drives the Blocks gallery.
- `content/templates/*.mdx` — same shape, for Templates (complete single-file screens). Kept in a separate section from Blocks, not mixed in.
- `apps/web` — the site (Next.js). Free to use real npm dependencies (Fumadocs-style content loading, shadcn/ui, etc.) — the copy-owned/no-runtime-dependency rule only applies to what ships to consumers (`packages/*`, the registry), not to the site itself.

## Key flows

- **Hash** — `packages/core/hash.ts` (`sha256Hex`). Canonical contract: UTF-8 encode, no trim/case-fold/normalization, lowercase hex SHA-256 via Web Crypto. No dependency; same code path in browser and Node.
- **Verify** — `packages/core/verify.ts` (`resolveVerifyFn`). Picks exactly one of `{ expectedHash, verify }`: local-hash (`createLocalHashVerifier`, hashes the entered code and compares) or a custom server-mode `VerifyFn`. Both or neither throws — no implicit default.
- **Session** — `packages/core/session.ts`. `createSession(result, timeoutMs)` → `{ unlockedAt, expiresAt, token? }`; `isExpired`; `touchExpiry` rewrites `expiresAt` for the opt-in sliding-timeout model. Never carries the raw code or hash.
- **Storage** — `packages/core/storage.ts` (`createSessionStore`). Three backends behind one `SessionStore` interface (`get`/`set`/`clear`/`subscribe`): `localStorage`, `sessionStorage`, `memory`. Cross-tab sync only actually fires for `localStorage` (native `storage` event) — the other two modes are correctly inert, not incomplete.
- **Unlock (React)** — `packages/react/useAccessGate.ts`. The headless hook wiring the four above: resolves `verifyFn` once per config identity, reads the initial session inside an effect (SSR-safe — never assumes storage during render), polls expiry on an interval + tab focus, subscribes to cross-tab changes, and throttles sliding-timeout writes on activity if `activityTracking` is on. `submit()` guards re-entrancy with a ref, not state, so a double-click before React re-renders can't race two verifications. `<AccessGate>` is a thin renderer over this hook; `AccessGateProvider` shares one instance across a tree via context — only needed when 2+ components (a gate, a `LogoutButton`, a `SessionTimeoutBanner`) must share one session.
- **Registry build** — `node scripts/build-registry.mjs` (`pnpm registry:build`) runs `shadcn build` against `registry/react/registry.json` and writes `apps/web/public/r/react/*.json`, the files `shadcn add <url>` actually serves. Items chain via `registryDependencies` (e.g. `access-gate-hook` → `access-gate-types` → `access-gate-core`) — changing what a block imports usually means editing `registry.json` too, not just the `.tsx`.

## Search tooling

- `ast-grep` is a root devDependency for structural/AST search — matches code shape, not text, so it beats regex grep on JSX/TSX. `pnpm exec ast-grep run -p '<pattern>' --lang tsx <path>`, e.g. `-p 'useEffect($$$)'` to find every effect.

## Blocks vs. Templates — where to edit

- **Blocks** (`packages/react/*.tsx`, one `content/blocks/*.mdx` each) are composable primitives — `<AccessGate>`, `<ProtectedRoute>`, `<PinInput>`, etc.
- **Templates** (`packages/react/*Template.tsx`, `content/templates/*.mdx`) are complete, single-file screens that call `useAccessGate` directly instead of importing block components — self-contained on purpose, so installing one doesn't pull in the whole block set.
- Changing a prop touches three places: the `.tsx`, the matching `content/{blocks,templates}/*.mdx` frontmatter (`props`/`customization`/`accessibility` — drives the gallery), and — if the file list or dependency chain changed — `registry/react/registry.json`, followed by `registry:build`.

## Validation commands

- `pnpm typecheck` / `pnpm lint` / `pnpm test` / `pnpm build` — turbo-orchestrated (`test`/`typecheck` depend on `^build` per `turbo.json`).
- `pnpm registry:build` — regenerate `apps/web/public/r/react` from `registry/react/registry.json`.
- `pnpm registry:check` — diffs the committed `apps/web/public/r/react` against a fresh `registry:build` output, byte-for-byte. Run this rather than trusting the build was re-run before commit — it's the actual guard against registry drift.

## Pitfalls

- **Registry drift** — editing a block/template's files or `registry.json` without re-running `registry:build` leaves `apps/web/public/r/react` stale. `registry:check` catches it.
- **ADR/docs citations** — code comments used to cite ADR numbers and doc paths (`docs/architecture/overview.md`, `docs/ux/flows.md`, etc.) that never existed in git history; those citations have been removed from comments. The real source of truth for architecture decisions now lives in `docs/adr/` (start at `docs/adr/0001-current-access-gate-architecture.md`) — cite that going forward instead of inventing new doc paths.

## Don't verify with Playwright unless explicitly asked

Typecheck (`pnpm --filter web typecheck`) after edits is fine — it's cheap and catches outright breakage. But do **not** proactively launch the dev server, drive it with Playwright, or take screenshots as a matter of course. Make the change, typecheck it, stop there. Only reach for a browser-driven check when the user explicitly asks for verification.

When verification IS requested, here's what actually worked this session:

1. Make sure the dev server is running (`pnpm --filter web dev`, `localhost:3000`).
2. Drive it with a small Playwright script — click through the actual interaction (unlock flow, tab switches, resets), not just a page load. Take a screenshot and actually look at it; several real bugs were only caught this way (a `min-h-[100dvh]` blowing out a nested preview, a Fragment exploding into a flex row instead of stacking, a mislabeled "Unlocked" panel that was actually still locked, a preview floating inside a padded window instead of filling it).
3. Don't trust `isVisible()`/`getByText()` assertions blindly if a result looks surprising — Playwright's default text matching is case-insensitive and substring-based, which can produce false positives against text that's technically in the DOM but hidden (e.g. source code shown in a hidden tab). When a locator-based check disagrees with a screenshot, believe the screenshot; check raw `innerHTML` occurrence counts if you need to confirm why.
4. Playwright isn't installed as a project dependency (keeps it out of the shipped registry). Run it via a scratch script from a scratchpad directory that has `playwright` installed locally (`npm install playwright` there once), not from inside this repo.
