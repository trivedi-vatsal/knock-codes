# Contributing

## Setup

```
pnpm install
pnpm dev        # apps/web on localhost:3000
pnpm typecheck
pnpm test
pnpm lint
```

## Adding a new block

1. Add the component to `packages/react/YourBlock.tsx`, built on `packages/core` (no other runtime
   dependency — see the copy-owned rule in [`CLAUDE.md`](./CLAUDE.md)/[`AGENTS.md`](./AGENTS.md)).
2. Export it from `packages/react/index.ts`.
3. Add an entry to `registry/react/registry.json` (`name`, `type: "registry:block"`, `title`,
   `description`, `files`, and `registryDependencies` for anything it composes on).
4. Add `content/blocks/your-block.mdx` — frontmatter must match `BlockFrontmatter` in
   `apps/web/lib/blocks.ts`: `title`, `description`, `category`, `tags`, `registryName`, `props`,
   `accessibility`, `customization`, plus optional `relatedBlocks` and `bestUsedFor`. See an existing
   block's `.mdx` for the shape.
5. Add a live demo case to `apps/web/components/block-preview.tsx` (the `switch` in `BlockPreview`) — or
   accept the default "no live preview" fallback if a real interactive demo doesn't make sense.
6. Run `pnpm registry:build` and commit the generated files under `apps/web/public/r/react`, then
   `pnpm registry:check` to confirm they're actually in sync.
7. Add tests under `packages/react/test/` for any new behavior (see the accessibility checklist below for
   what to specifically check).

## Adding a new template

Templates are single-file, complete screens (Templates gallery), not composed pieces (Blocks gallery) —
keep them in their own section, not mixed into Blocks. Same steps as a block, plus:

- The component itself must stay copy-paste-able as one file — inline what you'd otherwise import from
  other blocks, don't compose on `<GateWrapper>`/`<PinInput>` etc. internally (say so explicitly in the
  MDX `customization` field, as the existing templates do).
- Add `useCase` (e.g. `"Client preview"`, `"Staging app"`, `"Internal dashboard"`), `complexity`
  (`"Simple" | "Standard" | "Advanced"`), and `mode` (`"local" | "server" | "both"`) to the frontmatter —
  these drive the template card's metadata badges.
- Add a live demo entry to the `PREVIEWS` map in `apps/web/components/template-preview.tsx`.

## Versioning registry changes

The registry is copy-owned: once someone has copied a file, this repo has no way to push them an update.
Treat every change to `registry/react/registry.json` or the files it points at as user-facing:

- A change that fixes a real bug (wrong ARIA attribute, broken keyboard flow, a race condition) is safe to
  ship without ceremony — copy-paste consumers won't get it automatically, but new installs will.
- A change to a prop's type, name, or default behavior is a breaking change for anyone who already copied
  the old version. Call it out clearly in the changelog entry, and prefer additive changes (a new optional
  prop) over renaming or repurposing an existing one where possible.
- Always run `pnpm registry:build` and commit the result in the same change as the source edit —
  `apps/web/public/r/react` must never drift from `registry/react/registry.json`. `pnpm registry:check`
  (also run in CI) fails the build if it does.

## Accessibility checklist

Run through this for any new or modified interactive component:

- [ ] Every input has a real `<label>` (via `htmlFor`/`id`), not just a placeholder.
- [ ] The full flow works keyboard-only: Tab reaches every interactive element in a sensible order, Enter
      submits a form, nothing requires a mouse.
- [ ] Focus lands somewhere useful on mount/open — the first focusable element (e.g. an input), not an
      inert wrapper `div`. If you add a `ref`-based focus effect, make sure it doesn't run *after* and
      undo a child's `autoFocus` (this was a real bug in `UnlockDialog` — check `git log -- packages/react/UnlockDialog.tsx`).
- [ ] Modal/dialog components use `role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing at a
      real heading, and are not dismissable by accident if dismissing them would bypass the gate.
- [ ] Loading and error states announce through a single shared `aria-live="polite"` status region — don't
      add a second live region that double-announces the same state change.
- [ ] A reveal/hide toggle button has an `aria-label` that flips with its state (e.g. "Show code" /
      "Hide code"), not a generic "Toggle".
- [ ] New user-facing strings are added to the relevant `*Labels` type and `DEFAULT_LABELS`, so they're
      overridable for localization like every existing string.
- [ ] Add or update the block/template's `accessibility` MDX field describing the above in one paragraph.

## Release checklist

- [ ] `pnpm typecheck`, `pnpm test`, and `pnpm lint` all pass.
- [ ] `pnpm registry:build` has been run and its output committed; `pnpm registry:check` passes.
- [ ] `CHANGELOG.md` has an entry for anything user-facing (new/changed block, template, or prop).
- [ ] Any breaking prop/behavior change is called out explicitly, per the versioning guidance above.
