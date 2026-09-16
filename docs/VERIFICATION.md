# Verification

## Executed locally

- All 17 registry items installed with the real shadcn CLI into a fresh React/Tailwind project; all resolved dependencies and installed TypeScript compiled.
- Browser-rendered axe audit: 170 cases, zero violations. Each of 17 items was tested in light/dark themes and idle/pending/error/success/unlocked states. Rules include WCAG A/AA and rendered color contrast. Reproduce at `/audit` in the development server.
- React 18.3.1 and React 18 types: strict compilation, public contract tests and hydration checks pass in an isolated temporary project.
- React 19: strict compilation, server rendering, hydration, state and interaction checks pass.
- The model eval runner passed its offline protocol self-test: read docs, real shadcn install, write integration, compile, render, and structural axe checks. This is explicitly not a model-backed result.

- Final production build is clean. Thirty-four generated examples compile; all eleven test groups pass. All static resources plus every clean docs/playground route return the expected content over HTTP, and mistyped asset URLs still return 404. Generated-output and formatting checks pass.
- Documentation pages moved from generated HTML into the application, rendered from `catalog.json`. The registry test asserts that every item carries the guidance the pages render (`lifecycle`, `whenToUse`, `notFor`, `pitfalls`) and that `usedBy` is the exact reverse of `dependencies`.
- `npm run test:docs` renders the documentation index and all 17 item pages through Vite's SSR loader and runs structural axe checks on each: 18 pages, zero violations. Every documented prop, install command and guidance sentence is asserted present in the rendered output, and every page-nav anchor is asserted to resolve to a heading with matching text. Rendered colour contrast for the documentation chrome is not covered there; it needs the browser pass at `/audit` or a manual check.

## External execution still required

The live model eval requires `OPENAI_API_KEY` and `OPENAI_MODEL`. Neither is configured locally. `npm run eval:model` exits with a clear error rather than silently passing. Configure the GitHub Actions secret and variable to run real model tests for all 17 items. Fork PRs cannot access secrets and need a trusted-branch run after review. No GitHub workflow has been executed from this local directory.

No public hosting URL is configured. The complete `dist/` output is static; set `REGISTRY_BASE_URL` to the intended origin before building for deployment. Local install URLs work while the dev server is running.

Automated accessibility checks are not a claim of complete screen-reader or mobile autofill certification. Native keyboard behavior, paste, unlock focus and relock interactions were also checked manually in the browser.
