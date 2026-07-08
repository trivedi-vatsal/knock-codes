# 0001. Current Knock Codes architecture

## Status

Accepted. Describes the architecture as implemented, not as originally planned — this ADR was written retroactively to give the codebase a real source of truth after prior code comments were found citing ADR numbers and doc paths (`docs/architecture/overview.md`, `docs/security/threat-model.md`, `docs/ux/flows.md`, ADR-0004/0005/0008/0009/0011) that do not exist anywhere in git history. Those citations have been removed from comments; this document is what they should have pointed to.

## Context

Knock Codes ships PIN/access-code-gated UI as copy-owned source, in the shadcn distribution model: consumers run `shadcn add <registry-url>` and get the actual `.tsx`/`.ts` files in their own repo, not an npm dependency they import. That constrains the whole design — `packages/core` and `packages/react` can use no runtime dependencies beyond React itself and the Web platform, because every file in them is a file some consumer's codebase will own outright.

## Decision

### Copy-owned distribution model

`packages/core` and `packages/react` are not published to npm. They are the canonical source for a shadcn-compatible registry (`registry/react/registry.json`), built into static JSON (`apps/web/public/r/react/*.json`) that `shadcn add` fetches and writes directly into a consumer's project. Consequences:

- No runtime dependencies in `packages/*` beyond React and Web Crypto/Storage APIs — a dependency there becomes a dependency in every consumer's app.
- `apps/web` (the marketing/docs site) is exempt from that constraint and freely uses real npm packages (Fumadocs-style content loading, shadcn/ui, etc.), since it never ships to consumers.
- Registry items chain via `registryDependencies` (e.g. `knock-codes` → `knock-codes-hook` → `knock-codes-types` → `knock-codes-core`). Changing what a block imports means editing `registry.json`, not just the `.tsx`.

### `packages/core` responsibilities

Framework-agnostic, no UI:

- **Hashing** (`hash.ts`, `sha256Hex`) — canonical contract: UTF-8 encode the input, no trim/case-fold/normalization, lowercase hex SHA-256 via `crypto.subtle`. Every implementation that needs to agree on a hash (the site's hash generator, install docs, a consumer's server template) must follow this exact procedure or hashes won't match.
- **Verification** (`verify.ts`, `resolveVerifyFn`) — resolves a `{ expectedHash, verify }` config into a single `VerifyFn`. Supplying both or neither throws; there is no implicit default strategy. `createLocalHashVerifier` implements the local-hash case by hashing the entered code and comparing.
- **Session lifecycle** (`session.ts`) — `KnockCodesSession = { unlockedAt, expiresAt, token? }`. `createSession` builds one from a verify result; `isExpired` checks it; `touchExpiry` rewrites `expiresAt` for the opt-in sliding-timeout model. The raw code and its hash are never part of this record.
- **Storage** (`storage.ts`, `createSessionStore`) — one `SessionStore` interface (`get`/`set`/`clear`/`subscribe`) behind three backends: `localStorage`, `sessionStorage`, `memory`. `subscribe` is a real cross-tab mechanism only for `localStorage` (native `storage` events); for the other two modes it's correctly a no-op, not a missing feature, since neither has anything to sync across tabs.

### `packages/react` responsibilities

- **`useKnockCodes`** — the headless hook wiring all four core pieces together: resolves `verifyFn` once per config identity (throws synchronously on misconfiguration), reads the initial session inside an effect (never during render, so SSR/first-paint markup never depends on storage that may not exist), polls expiry on an interval and on tab focus, subscribes to cross-tab store changes, and throttles sliding-timeout writes on user activity when `activityTracking` is on. `submit()` guards re-entrancy with a ref rather than state, so a double-click before React re-renders can't fire two verifications.
- **`<KnockCodes>`** — a thin renderer over the hook: renders `children` when unlocked, otherwise the PIN entry UI. No separate "mount loading" state.
- **`KnockCodesProvider`** — shares one `useKnockCodes` instance across a tree via context, for when multiple components (a gate, a `LogoutButton`, a `SessionTimeoutBanner`) need to observe the same session.
- **Blocks** (`packages/react/*.tsx`, one per `content/blocks/*.mdx`) — composable primitives: `<KnockCodes>`, `<PinInput>`, `<ProtectedRoute>`, `<ProtectedLayout>`, `<ProtectedModal>`, `<ProtectedCard>`, `<SessionTimeoutBanner>`, `<LogoutButton>`, `<AccessDeniedScreen>`, `<VerificationLoader>`, `<AccessReceipt>`, `<GateWrapper>`, etc.
- **Templates** (`packages/react/*Template.tsx`, one per `content/templates/*.mdx`) — complete single-file screens that call `useKnockCodes` directly instead of importing block components. Deliberately self-contained so installing a template doesn't pull in the whole block set.

### Local hash mode vs. server verification mode

`KnockCodesConfig` accepts exactly one of `expectedHash` or `verify`:

- **Local hash mode** (`expectedHash`) — the SHA-256 hash ships in the client bundle; verification runs entirely in the browser via `createLocalHashVerifier`. Zero backend required, but the hash is visible to anyone who opens DevTools — guessing is limited only by compute, not by the app. Not appropriate for compliance-sensitive data.
- **Server verification mode** (`verify`) — a consumer-supplied `VerifyFn` that calls their own server/edge function; the real hash never reaches the client. Same components, one prop swapped.

Both strategies resolve to the same `VerifyResult` shape (`{ ok: true, token? } | { ok: false, reason? }`), so the rest of the session/storage/UI layer never needs to know which strategy is in play. A throwing `VerifyFn` is treated as `reason: "network"`; an `"unknown"`/omitted reason collapses into `"invalid"` for the UI — the UI only ever distinguishes "wrong code" from "couldn't verify," nothing finer.

### Session storage modes, timeout, and activity tracking

- Storage mode defaults to `localStorage`; `sessionStorage` and `memory` are opt-in via the `storage` prop.
- `timeout` (default 30 minutes) sets session lifetime in ms.
- `activityTracking` (default `false`) switches from a fixed TTL to a sliding-timeout model: `pointerdown`/`keydown`/`scroll` events rewrite `expiresAt`, throttled to at most once per second so activity doesn't cause a write storm.
- Expiry is enforced by polling on an interval plus a check on tab focus — there is no server-side or storage-native expiry mechanism to lean on.

### Registry flow

`registry/react/registry.json` is the hand-maintained source of truth for what each registry item is and depends on. `node scripts/build-registry.mjs` (`pnpm registry:build`) runs `shadcn build` against it and writes `apps/web/public/r/react/*.json` — the actual files `shadcn add <url>` serves to consumers. The built output is committed; `pnpm registry:check` diffs it byte-for-byte against a fresh build to catch drift when someone edits a block/template or `registry.json` without re-running the build.

### Docs/content model

- `content/blocks/*.mdx` — one file per block, frontmatter drives the Blocks gallery (category, tags, props, accessibility, customization).
- `content/templates/*.mdx` — same shape, for Templates, kept in a separate gallery section since templates are complete screens rather than composable pieces.
- Server templates (referenced from the security page/docs) show the server-verification-mode counterpart to a local-hash example, so consumers can see both modes side by side without guessing at the server-side code themselves.

### Web app role

`apps/web` (Next.js) is the product surface, not something that ships to consumers:

- **Gallery** (`/blocks`, `/templates`) — renders every block/template from its `content/*.mdx` metadata.
- **Previews** — live-rendered examples of each block/template inside the gallery.
- **Install docs** — per-item `shadcn add` command plus props/customization/accessibility notes sourced from the same `.mdx` frontmatter.
- **Security model** (`/security`) — explains the local-hash vs. server-verify trade-off in plain terms (what's exposed, what compliance profiles each mode suits, log-and-rotate guidance for server secrets).
- **Hash generator** (`components/hash-generator.tsx`, `lib/pin-generator.ts`) — lets a consumer generate the SHA-256 hash for a chosen code using the same `sha256Hex` contract as `packages/core/hash.ts`, so the value they paste into `expectedHash` is guaranteed to match.

### Validation expectations

- `pnpm typecheck` / `pnpm lint` / `pnpm test` / `pnpm build` — turbo-orchestrated; `test`/`typecheck` depend on `^build`.
- `pnpm registry:build` — regenerates `apps/web/public/r/react` from `registry/react/registry.json`.
- `pnpm registry:check` — the actual guard against registry drift; run instead of trusting that a build happened before commit.

### Known constraints

- **No Playwright unless explicitly requested.** Typecheck after edits is cheap and expected; launching the dev server, driving it with Playwright, or taking screenshots is reserved for when a user explicitly asks for browser-driven verification.
- **Registry output must not drift** from `registry/react/registry.json` — `registry:check` is the enforcement mechanism, not a suggestion.
- **Plaintext codes must never be written to storage, logs, or session records.** `KnockCodesSession` carries only `unlockedAt`, `expiresAt`, and an optional opaque `token` — never the code or its hash. Failed-attempt logging (server mode) should log a timestamp and identifier, never the submitted code or its hash.

## Consequences

- Future comments should describe local behavior directly rather than citing ADR numbers or doc paths that may not exist — if a decision needs a durable home, it belongs in an ADR under `docs/adr/`, added to and cross-checked the same way this one was.
- Anyone changing the hashing contract, the verify result shape, the session record shape, or the storage backend list should add a new ADR rather than editing this one, and update the citing code comments to match.
