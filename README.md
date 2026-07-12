<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  <img src="https://img.shields.io/badge/node-%3E%3D22.6.0-brightgreen" alt="Node >=22.6.0" />
  <img src="https://img.shields.io/badge/package%20manager-pnpm-orange" alt="pnpm" />
  <a href="https://github.com/trivedi-vatsal/knock-codes/actions/workflows/ci.yml"><img src="https://github.com/trivedi-vatsal/knock-codes/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
</p>

# Knock Codes

Knock Codes is a copy-paste "enter a code to continue" screen for private previews, staging links,
internal tools, and client review pages. It is **not** a login system or auth provider.

Pick a template, paste it into your project, drop in a hash of your access code, and ship. That's the
whole integration: no account, no backend, and no package living in your `node_modules` unless you want
one. Every line you ship is yours to read, edit, and own — inspired by [shadcn/ui](https://ui.shadcn.com)
and [Tremor Blocks](https://blocks.tremor.so).

Knock Codes ships components like `<KnockCodes>` and `useKnockCodes`, distributed under the
`@knock-codes/core` and `@knock-codes/react` packages — see [Structure](#structure) below.

## When to use this

- Keeping a client preview or staging deploy off search engines and unlisted-but-guessable links.
- A soft gate in front of an internal tool or dashboard that doesn't need real user accounts.
- A "coming soon" or private-beta screen you want gone in five minutes, not five hours.
- Friction for casual visitors and forwarded links — a velvet rope, not a vault door.

## When not to use this

- Protecting paid content, private user data, or anything with per-user permissions — this has no
  concept of a "user," only a shared code.
- Admin authorization or anything gating a real write path — pair with real auth instead.
- Compliance-sensitive data (health records, financial data, PII at rest) — local mode's hash ships in
  the client bundle by design; anyone can read it in DevTools.
- Anywhere the cost of someone bypassing the gate is high. If that's true for you, use server mode
  instead of local mode, or skip this entirely for a real auth provider.

See [`apps/web/app/security`](apps/web/app/security) (the site's `/security` page) for the full threat
model, including what server mode changes and doesn't.

## Quickstart

1. **Hash an access code.** `sha256Hex` from `@knock-codes/core` (or the generator on `/getting-started`)
   turns a plaintext code into a hex hash. Only the hash ever goes in your source or env vars — never the
   plaintext.
2. **Copy a template** — pick one from [Templates](#templates) below and either paste the file or install
   it with the shadcn CLI:

   ```
   npx shadcn@latest add https://knock.codes/r/react/knock-codes-template.json
   ```

   Installing more than one item, or from a script? Register `@knock-codes` once in your project's
   `components.json` and install by short name from then on — no listing on the shadcn registry
   directory required, this talks straight to `knock.codes`:

   ```json
   {
     "registries": {
       "@knock-codes": "https://knock.codes/r/react/{name}.json"
     }
   }
   ```

   ```
   npx shadcn@latest add @knock-codes/knock-codes-template
   ```
3. **Wire the hash** through a public env var (`NEXT_PUBLIC_KNOCK_CODES_HASH`, `VITE_KNOCK_CODES_HASH`, …):

   ```tsx
   import { KnockCodesTemplate } from "@/components/knock-codes/react/KnockCodesTemplate";

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <body>
           <KnockCodesTemplate expectedHash={process.env.NEXT_PUBLIC_KNOCK_CODES_HASH}>
             {children}
           </KnockCodesTemplate>
         </body>
       </html>
     );
   }
   ```
4. **Choose storage and timeout behavior** — memory, `localStorage`, or `sessionStorage`, and a fixed or
   sliding session timeout. Every template defaults to something reasonable; override via props.
5. **Upgrade to server verification when it matters.** Swap `expectedHash` for a `verify` function
   pointing at a small endpoint — same component, one prop different. Reference implementations for
   Next.js, Cloudflare Workers, Azure Functions, Express, and Hono live in
   [`content/server-templates`](content/server-templates).

The full walkthrough, with a live hash generator, is at
[`apps/web/app/getting-started`](apps/web/app/getting-started) (the site's `/getting-started` page).

## What's inside

### Templates

Complete, single-file screens — call `useKnockCodes` directly, no other block imports required.

| Template | Description | Use case | Mode |
| --- | --- | --- | --- |
| Knock Codes | Segmented dark card — full-page backdrop, eight-box code entry, support link, footer help text. | Client preview | local + server |
| Branded Access | Split-screen brand panel next to the code field — logo-forward, doubles as a first impression. | Client preview | local + server |
| Minimal Access | A single masked field in a small plain card — the leanest gate. | Internal dashboard | local + server |
| Modal Access | Blur-overlay dialog over one section of an already-visible page — content stays mounted behind it. | Staging app | local + server |
| Plain HTML Gate | One static `.html` file with an inline `<script>` — no React, no build step, no npm install. | Client preview | local only |

### Blocks

Composable primitives for building a custom gate instead of using a full-page template.

| Block | Description |
| --- | --- |
| `<KnockCodes>` | The main gate — renders children when unlocked, otherwise an access-code prompt. |
| `<StandaloneGate>` | The fastest path to a working gate: wrap your app, pass a hash, done. |
| `<ProtectedRoute>` | Knock Codes shaped for route-level guarding, with an optional custom unauthorized state. |
| `<ProtectedLayout>` | Knock Codes shaped for a full-page shell — header/footer stay visible even while locked. |
| `<ProtectedCard>` | A card-shaped gate for protecting one section of a page rather than the whole viewport. |
| `<ProtectedModal>` | Content stays mounted and blurred behind a modal Unlock Dialog instead of being replaced. |
| `<EmbeddedGate>` | Knock Codes fixed to the inline shell — sits naturally inside an existing layout. |
| `<GateWrapper>` | The shared outer-positioning primitive every visible block composes on. |
| `<UnlockDialog>` | A non-dismissable modal access-code prompt — no backdrop click, no Escape-to-close. |
| `<PinInput>` | Masked access-code input (PIN or passphrase) with paste support and accessible loading/error states. |
| `<VerificationLoader>` | A small presentational spinner + label for the in-flight verification moment. |
| `<AccessDeniedScreen>` | A static "you don't have access" view — no access-code form in it at all. |
| `<AccessReceipt>` | A small session audit strip shown after unlock — timestamp, storage mode, timeout, verification strategy. |
| `KnockCodesProvider` / Session Provider | Shares one `useKnockCodes` session across a tree, so multiple components stay in sync. |
| `<LogoutButton>` | Reads the shared session from a Session Provider and clears it on click. |
| `<SessionTimeoutBanner>` | Warns before the shared session expires, with a one-click way to log out immediately. |

Browse live, interactive previews and copy-paste source for every block and template at
[knock.codes](https://knock.codes).

## Local vs. server mode

| | Local (`expectedHash`) | Server (`verify`) |
| --- | --- | --- |
| Backend required | No | Yes (any small endpoint) |
| Where the check runs | In the browser, against a hash in the client bundle | On your server |
| Bypassable via DevTools | Yes — the hash is public by design | No |
| Good for | Casual friction on low-stakes links | Anything where a bypass actually matters |

Both modes render the same component with the same markup — only the prop differs. See
[`apps/web/app/security`](apps/web/app/security) for the full comparison and rate-limiting guidance.

## Structure

- `packages/core` — framework-agnostic hash/session/storage/verify logic, no UI.
- `packages/react` — the React blocks (`<KnockCodes>`, `useKnockCodes`, PIN Input, Protected
  Route/Layout/Modal/Card, Session Provider, and the ready-made templates), built on `packages/core`.
- `registry/react/registry.json` — shadcn-compatible registry entries. Rebuild with
  `node scripts/build-registry.mjs` after editing.
- `content/blocks/*.mdx` — block metadata/docs (frontmatter: category, tags, props, accessibility,
  customization) — drives the Blocks gallery.
- `content/templates/*.mdx` — same shape, for Templates (complete, single-file screens) — kept separate
  from Blocks, not mixed in.
- `content/server-templates` — reference server-mode verify implementations (Next.js route handler,
  Cloudflare Worker, Azure Function, Express, Hono).
- `apps/web` — the site: block/template gallery, live previews, copy-paste source, and docs.

## Develop

```
pnpm install
pnpm dev        # site + packages, watch mode — apps/web on localhost:3000
pnpm typecheck  # turbo run typecheck across the workspace
pnpm test       # turbo run test across the workspace
pnpm lint       # turbo run lint across the workspace
```

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for adding a new block or template, the versioning model for
registry changes, and the accessibility checklist every interactive component is held to.

## Publishing the registry

`registry/react/registry.json` is the source of truth. Building turns it into per-item JSON files under
`apps/web/public/r/react`, which the site serves at a stable URL for `shadcn add`:

```
pnpm registry:build   # rebuild apps/web/public/r/react and the root registry.json
pnpm registry:check   # verify both are still in sync with registry/react/registry.json — run in CI
```

Always run `registry:build` (and commit the result) after editing `registry/react/registry.json`, then run
`registry:check` before pushing — there's no build step that does this for you automatically.

Installing a block or template with the shadcn CLI:

```
# Against a local dev server (pnpm dev running on localhost:3000) — cross-item
# registryDependencies still resolve against https://knock.codes by default,
# so a plain local rebuild won't reflect local edits to a *dependency* of the
# item you're installing. For that, rebuild pointing deps at localhost too:
#   node scripts/build-registry.mjs --base-url=http://localhost:3000
# (don't commit that — git checkout apps/web/public/r/react afterward)
npx shadcn@latest add http://localhost:3000/r/react/knock-codes-template.json

# Against the deployed docs site
npx shadcn@latest add https://knock.codes/r/react/knock-codes-template.json

# Via the GitHub owner/repo/item shorthand, no site required
npx shadcn@latest add trivedi-vatsal/knock-codes/knock-codes-template
```

Set `NEXT_PUBLIC_SITE_URL=https://knock.codes` (e.g. in `apps/web/.env.local` or your host's env config) to
your deployed site's origin, and every install command shown on the site switches from the localhost
example to that URL automatically.

## License

[MIT](./LICENSE) © [Vatsal Trivedi](https://github.com/trivedi-vatsal)
