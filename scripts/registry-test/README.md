# registry-test

A minimal Vite + React + Tailwind v4 project, pre-initialized with `shadcn init`, that exists for one
reason: to run `npx shadcn add` against this repo's own registry and check the result — install
resolution, cross-item `registryDependencies`, the `@knock-codes` named registry — the same class of bug
fixed in `scripts/registry-dependencies.mjs` (bare dependency names 404ing against `ui.shadcn.com`
instead of resolving within this registry). It is not part of the pnpm workspace (`pnpm-workspace.yaml`
only globs `apps/*` and `packages/*`) and is never built or shipped.

## One-time setup

```
cd scripts/registry-test
npm install
```

Deliberately `npm`, not `pnpm` — this keeps its dependency tree fully isolated from the root
`pnpm-lock.yaml`.

## Testing a change

1. Serve the registry locally:

   ```
   pnpm --filter web dev
   ```

   By default, cross-item `registryDependencies` in the committed `apps/web/public/r/react` still point
   at `https://knock.codes` (production) — fine for testing the *item you're installing*, but it means
   local edits to one of that item's *dependencies* won't show up. To test the full chain against
   localhost, rebuild pointing deps at the dev server first (and revert before committing):

   ```
   node scripts/build-registry.mjs --base-url=http://localhost:3000
   # ...test...
   git checkout apps/web/public/r/react registry.json
   ```

2. From this folder, install something:

   ```
   npx shadcn@latest add http://localhost:3000/r/react/knock-codes-template.json
   # or, using the named registry already configured in components.json:
   npx shadcn@latest add @knock-codes/knock-codes-template
   ```

3. Inspect what landed under `src/components/knock-codes/` — did every dependency in the chain resolve
   and get written, not just the top-level item?

4. Reset before the next run (installed output is gitignored, but stays on disk otherwise):

   ```
   rm -rf src/components/knock-codes src/components/ui
   ```

`npm run dev` (Vite, port 5173 by default) will actually render `src/App.tsx` if you want to eyeball
something visually, but that's rarely the point — the CLI's own success/failure output and the resulting
file tree are the real signal.
