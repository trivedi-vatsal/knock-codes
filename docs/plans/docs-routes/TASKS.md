# Docs routes — Tasks

- [x] Add `@lifecycle`, `@whenToUse`, `@notFor` and `@pitfall` to all 17 `registry/**/*.tsx` headers; `generate.ts` now fails without them.
- [x] Emit `lifecycle`, `whenToUse`, `notFor`, `pitfalls`, `dependencies` and `usedBy` into `catalog.json`, the registry payloads, the Markdown twins, the agent prompts and `llms*.txt`.
- [x] Build `src/docs-view.tsx`: fetch `catalog.json`, render the page anatomy, reuse `ComponentDemo`/`BlockDemo` and the existing raw-source globs.
- [x] Build the docs index: visual gate chooser, tier and lifecycle grouping, dependency counts.
- [x] Wire `/docs`, `/docs/<slug>` and `/playground/<slug>` into `main.tsx`; share the sidebar across both; support browser back/forward.
- [x] Delete the HTML page templates, `public/docs/styles.css`, `public/docs/*.html`, `public/docs/<slug>/`, the `embed=1` branch and the `.embedded` CSS.
- [x] Repoint the workbench links in `src/block-demo.tsx` to `/docs/<slug>`.
- [x] Update `scripts/pages-check.ts`: Markdown assertions, a computed URL count, and 404s asserted for `/docs/missing.md` and `/r/missing.json`.
- [x] Update `tests/registry.test.tsx` to assert the guidance fields and that `usedBy` is the exact reverse of `dependencies`.
- [x] Add `scripts/docs-check.ts` (`npm run test:docs`): renders the index and all 17 pages through Vite's SSR loader and runs structural axe on each. Wired into CI.
- [x] Add the second nav a docs page needs: a sticky "On this page" section nav and a previous/next pager, both generated from the section list and the catalog order.
- [x] Update `README.md` and `docs/VERIFICATION.md`.
- [x] `npm run check`, `test:pages`, `test:docs`, `test:install`, `test:react18`, `test:eval-runner`, `format:check`.

## Close-out

No per-page `.html` is generated: `/docs`, `/docs/<slug>` and `/playground/<slug>` render through the app shell. The iframe, the second CSS file and the duplicated page writes are gone; `generate.ts` lost its two page templates and the stylesheet string.

Guidance is single-sourced in the registry headers, so the docs view, the Markdown twins, the agent prompts and `llms-full.txt` cannot disagree. Static resources went from 88 to 72 and all return the expected content; 72 URLs verified over HTTP, 18 documentation pages rendered and audited, 11 test groups and both React versions pass.

Each page carries two navs: the shared sidebar for choosing an item, and its own section nav. Section ids are derived from section titles by one function, and `test:docs` asserts every nav anchor resolves to a heading with the same text, so a renamed section cannot leave a dead link behind.

Not covered: rendered colour contrast for the documentation chrome, which needs the browser pass at `/audit`.
