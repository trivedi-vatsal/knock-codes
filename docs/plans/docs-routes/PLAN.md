# Docs routes — Plan

Docs become a view inside the existing React app. No `.html` is generated. Markdown, prompts, registry JSON and `llms*.txt` stay exactly as they are — they are the agent surface and CI asserts them.

## Routing

`/docs` for the index, `/docs/<slug>` for an item, and `/playground/<slug>` for its live workbench. The app uses the History API and the host serves `index.html` for extensionless routes. Static asset typos such as `/r/typo.json` still return 404.

## Page anatomy (shadcn reference)

Shared sidebar with the playground, per item: contract → Install (copy `npx shadcn@latest add …`) → Preview/Code tabs rendering the real `ComponentDemo`/`BlockDemo` inline, no iframe → Usage (minimal, then fully wired) → Props table → Label defaults → Accessibility → When to use / Not for → Common mistakes → These are not props → Dependencies and Used by → Source in `<details>` → links to `.md`, `.json`, `.tsx`, prompt.

## Content, generated not hand-written

Three new required JSDoc header tags per registry file, validated by the same `throw` that already guards `@version`/`@a11y`:

- `@whenToUse` — the situation this item is for.
- `@notFor` — the neighbour it gets confused with, and which item to use instead.
- `@pitfall` (repeatable) — a real wiring mistake, e.g. treating `status="success"` as unlock.

They flow to `catalog.json`, `/docs/<slug>.md`, `llms-full.txt` and the docs view from one place. Generator also computes `usedBy` (reverse of `dependencies`) and a lifecycle group per item (`gate` / `unlocked` / `ended`).

## Index

Docs index (`/docs`) groups by tier, then by lifecycle, and leads with a visual gate chooser — the one thing seventeen prop tables cannot tell a reader.

## Deleted

`public/docs/<slug>.html`, `public/docs/<slug>/index.html`, `public/docs/index.html`, `public/docs/styles.css`, the two page template literals and the CSS string in `generate.ts`, the `embed=1` branch in `main.tsx`, and `.embedded` in `src/styles.css`.

## Data

The docs view `fetch('/catalog.json')` on first open — already a published static file, keeps it out of the workbench bundle. No new build input.

## Risk

The iframe removal is the behaviour change: demos render in the docs view's own React tree, so demo state resets on item change (already true via `key={selected}`) and the axe audit at `/audit` must cover the docs view too.
