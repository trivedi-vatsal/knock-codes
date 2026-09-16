# Docs routes — Audit

## Confirmed working

- `scripts/generate.ts` is the single source of truth: TypeScript compiler API reads `registry/**/*.tsx` and emits `/r`, `/source`, `/docs/*.md`, `/prompts`, `/llms*.txt`, `catalog.json`, `registry.json`.
- `public/catalog.json` (276 KB) already carries every field a docs page needs: title, tier, version, component, contract, props (type/required/default/description), defaults, slots, a11y, examples, dependencies, registryUrl.
- `src/component-demo.tsx` and `src/block-demo.tsx` already export live demos plus raw source via `import.meta.glob('?raw')`; `main.tsx` selects from the URL path.
- Sidebar nav, theme toggle, Preview/Code tabs and copy behaviour already exist in `main.tsx` and are reusable by a docs view.

## Confirmed broken or blocked

- Every doc page is written twice: `public/docs/<slug>.html` and `public/docs/<slug>/index.html` (generate.ts:279-280) — identical bytes, 34 files.
- The old doc page's iframe re-booted the whole workbench per page, and `.embedded` in `src/styles.css:1531-1550` existed only to hide chrome inside it.
- Page markup and `public/docs/styles.css` are two unescaped template literals inside the generator (generate.ts:273, 307, 311) — a second, hand-maintained design system beside `src/styles.css`.
- Doc content is a prop dump. No guidance on which block to choose, no wiring pitfalls, no links between a block and the components it installs — though `dependencies` is already computed and discarded.
- `.html` URLs are referenced from `src/main.tsx:153`, `src/block-demo.tsx:239,318,344`, `scripts/pages-check.ts:16,25,31,34`, `tests/registry.test.tsx:17`, `README.md:12,50`, `docs/VERIFICATION.md` ("88 static resources", also hardcoded in pages-check.ts:37).

## Open questions

- None blocking. Routing decision recorded in PLAN.md.

## Assumptions still unverified

- Docs view bundle cost of fetching `catalog.json` on demand; measure after step 2.
- Whether removing `embed=1` breaks nothing else — grep before deleting `.embedded`.
