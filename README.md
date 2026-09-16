# Knock

A copy-paste demo-gate UI library: nine components and eight blocks. React 18/19 + Tailwind CSS 4, with no other runtime dependencies. All code is MIT licensed. The previous version lives on the [`v1`](https://github.com/trivedi-vatsal/knock-codes/tree/v1) branch.

## Run

```sh
npm ci
npm run dev
```

Open http://localhost:5173. The home route `/` introduces Knock with an interactive example. `/library` opens the visual collection, with search and filters for blocks and components. Playground routes (`/playground/<item>`) have the component catalog and interactive workbench. Docs have separate guide navigation: `/docs`, `/docs/get-started`, `/docs/styling`, and `/docs/ai-agents`. Compact usage and expandable API references live at `/docs/<item>`. The full Markdown reference at `/docs/<item>.md` is available for agents and offline reading.

## Install

Knock is listed in the shadcn directory. In a React/Tailwind project that already has `components.json`:

```sh
npx shadcn@latest registry add @knock-codes
pnpm dlx shadcn@latest registry add @knock-codes
yarn dlx shadcn@latest registry add @knock-codes
bunx --bun shadcn@latest registry add @knock-codes
```

Then install an item by name:

```sh
npx shadcn@latest add @knock-codes/client-preview-gate
```

Direct item URLs also work:

```sh
npx shadcn@latest add https://knock.codes/r/client-preview-gate.json
```

The block and its component dependencies install into your configured components folder under `knock/`. Every published item is one self-contained file. Components import only React; blocks import components.

## Controlled contract

All blocks share `value`, `onChange`, `onSubmit`, `status`, `unlocked`, `children`, lifecycle timestamps, access recovery callbacks/links, branding slots, labels, theme and className. `unlocked` is the only content visibility decision. `status="success"` never unlocks. Countdown completion never submits. Relock only calls the consumer callback.

No authentication, code verification, sessions, storage, fetch, cryptography or middleware exists in the library. Teaser/blur content is inert while locked but remains in the DOM; blur is not a security boundary. Consumer components must own protected data delivery and authorization.

## Included

Components: Code field, Cooldown notice, Recipient line, Expiry pill, Request access, Preview ribbon, Preview bar, Relock control, Blur veil.

Blocks: Client preview gate, Quick gate, Teaser gate, Gated section, Expired notice, Revoked notice, Cooldown screen, Preview chrome.

The workbench uses explicit demo consumer state. Submission reports an event; use its Reveal control to change visibility. Preview chrome keeps a draft ribbon and a bottom bar around unlocked content. Without `onRelock`, it omits the interactive bar rather than presenting a broken action. Notice blocks honor `unlocked` just like the other blocks; select the notice appropriate to your application’s lifecycle.

## Generated distribution

```sh
npm run generate
npm run check:generated
npm run check:examples
npm run build
```

Public URLs default to `https://knock.codes`. Set `REGISTRY_BASE_URL` to override the origin for local registry testing.

The TypeScript compiler API reads source interfaces, JSDoc, defaults, JSX label mappings, versions and examples. It emits:

- `/r/<item>.json`: shadcn payload, dependency URLs, prop schemas, defaults, slots, a11y notes, source hash and version. The same payload is published at `/r/react/<item>.json` so the official shadcn directory URL `https://knock.codes/r/react/{name}.json` keeps resolving.
- `/r/registry.json` and `/r/react/registry.json`: the shadcn catalog (no file `content`). Root `registry.json` is the same catalog for GitHub `owner/repo/item` installs.
- `/docs/<item>.md`: Markdown documentation — contract, when to use, what it is not for, props, label defaults, common mistakes, related items, accessibility and source.
- `/catalog.json`: every item's contract, props, guidance and dependency graph. The app renders its documentation pages from this file.
- `/prompts/<item>.md`: agent prompt and anti-hallucination contract.
- `/source/<item>.tsx`: original self-contained source.
- `/llms.txt` and `/llms-full.txt`: index and the full library in one fetch.

Generated files are never maintained by hand. Documentation content lives in the source header: `@whenToUse`, `@notFor`, one or more `@pitfall` entries and `@lifecycle` (`gate`, `unlocked` or `ended`) are required, and generation fails without them. Edit the item’s source and JSDoc, bump its version when changing its public behavior, and regenerate. Both minimal and full examples compile in CI. The build emits route-specific HTML in `dist/` with canonical, Open Graph and Twitter metadata, plus `sitemap.xml`, `robots.txt` and `404.html`. Serve each route’s directory index and configure your host to serve `404.html` with HTTP 404 for unknown paths; do not use a blanket rewrite to the homepage. Vite development and preview already follow this behavior. Documentation pages are rendered by the app from `catalog.json`; asset URLs such as a mistyped `/docs/….md` or `/r/….json` must keep returning a real 404.

## Theming and accessibility

Set `theme="light"` / `"dark"` or omit it for system preference. Set `--knock-bg`, `--knock-ink`, `--knock-muted`, `--knock-accent`, `--knock-on-accent`, `--knock-border`, and `--knock-error` on a parent to restyle without editing markup. Code field’s existing `--kc-*` tokens remain fallback values. Verify contrast after overrides.

Single-input digit entry preserves native selection, backspace, arrows, password masking and one-time-code autofill. Errors are announced, cooldown seconds are quiet, expiry state changes are announced, and focus moves after unlock. Blocks are regions, not modal dialogs; background page controls remain usable in Gated section. No focus trap is required by these nonmodal compositions. Reduced-motion is respected.

## Checks and CI

```sh
npm run check
npm run check:registry
npm run format:check
npm run test:install
npm run test:pages
npm run test:docs
npm run test:react18
npm run test:eval-runner
```

Use `/audit` in development for the rendered browser a11y audit, including contrast. It is excluded from the production build. Browser testing uses Codex browser controls, not Playwright.

CI runs public-source, generated-output, example compilation, hydration, structural accessibility, documentation rendering, shadcn registry validation and real installation checks against React 18 and 19. The model-installation job gives the configured model only `llms.txt` and a task, provides bounded documentation/install/write tools, then independently compiles and renders its integration and runs axe. Failed integrations fail the job; correct the source/docs/API rather than relaxing the eval.

Configure the GitHub secret `OPENAI_API_KEY` and repository variable `OPENAI_MODEL` to run `npm run eval:model` in CI. The model job is skipped when `OPENAI_MODEL` is unset so deterministic checks can stay green. Missing credentials still fail `npm run eval:model` locally. `EVAL_ITEM=<slug>` limits a local diagnostic run; the CI default evaluates all 17. The offline runner self-test does not claim model performance. See `docs/VERIFICATION.md` for executed checks and remaining external requirements.
