# Access Gate

A copy-paste "enter a code to continue" screen for demos, staging links, internal tools, and client
previews — not a login system, not an auth provider.

Pick a template, paste it into your project, drop in a hash of your access code. That's the whole
integration: no account, no backend, and no package living in your `node_modules` unless you want one.
Every line you ship is yours to read, edit, and own — inspired by [shadcn/ui](https://ui.shadcn.com) and
[Tremor Blocks](https://blocks.tremor.so).

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

## Structure

- `packages/core` — framework-agnostic hash/session/storage/verify logic, no UI.
- `packages/react` — the React blocks (`<AccessGate>`, `useAccessGate`, PIN Input, Protected
  Route/Layout/Modal/Card, Session Provider, and the ready-made templates), built on `packages/core`.
- `registry/react/registry.json` — shadcn-compatible registry entries. Rebuild with
  `node scripts/build-registry.mjs` after editing.
- `content/blocks/*.mdx` — block metadata/docs (frontmatter: category, tags, props, accessibility,
  customization) — drives the Blocks gallery.
- `content/templates/*.mdx` — same shape, for Templates (complete, single-file screens) — kept separate
  from Blocks, not mixed in.
- `content/server-templates` — reference server-mode verify implementations (Next.js route handler,
  Cloudflare Worker, Azure Function).
- `apps/web` — the site: block/template gallery, live previews, copy-paste source, and docs.

## Get started

Read [`apps/web/app/getting-started`](apps/web/app/getting-started) (the site's `/getting-started` page)
for the full walkthrough (hash a code, copy a template, wire `expectedHash`, choose storage/timeout,
upgrade to server verification later). The short version:

```
pnpm install
pnpm dev
```

Then open `localhost:3000/getting-started`.

## Develop

```
pnpm install
pnpm dev        # site + packages, watch mode
pnpm typecheck  # turbo run typecheck across the workspace
pnpm test       # turbo run test across the workspace
```

## Publishing the registry

`registry/react/registry.json` is the source of truth. Building turns it into per-item JSON files under
`apps/web/public/r/react`, which the site serves at a stable URL for `shadcn add`:

```
pnpm registry:build   # rebuild apps/web/public/r/react from registry.json
pnpm registry:check   # verify the two are still in sync — run in CI
```

Always run `registry:build` (and commit the result) after editing `registry/react/registry.json`, then run
`registry:check` before pushing — there's no build step that does this for you automatically.

Installing a block or template with the shadcn CLI:

```
# Against a local dev server (pnpm dev running on localhost:3000)
npx shadcn@latest add http://localhost:3000/r/react/access-gate-template.json

# Against a deployed docs site
npx shadcn@latest add https://your-deployed-site.example.com/r/react/access-gate-template.json
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. in `apps/web/.env.local` or your host's env config) to your deployed
site's origin, and every install command shown on the site switches from the localhost example to that URL
automatically.
