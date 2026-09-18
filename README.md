<div align="center">
  <img src="public/graphics/private-entrance.svg" alt="An open arched door with a code field and a draft preview" width="320" />
  <h1>Knock</h1>
  <p><strong>Your work. A little more private.</strong></p>
  <p>Copy-paste React UI for access screens, invitations, and the work behind them.</p>
  <p>
    <a href="https://knock.codes">Website</a> ·
    <a href="https://knock.codes/library">Explore the library</a> ·
    <a href="https://knock.codes/docs/get-started">Get started</a> ·
    <a href="https://knock.codes/docs">Documentation</a>
  </p>
  <p>React 18 &amp; 19 · Tailwind CSS 4 · shadcn registry · MIT licensed</p>
</div>

---

Knock provides the interface around a private preview: the code field, the recipient’s name, the expired invitation, and the draft labels that stay with the work after access is granted.

Start with one of **9 complete blocks**, or assemble your own screen from **10 individual components**. Install the source into your project and change the copy, colors, and layout there. No additional runtime dependencies beyond React and React DOM.

**Knock handles presentation. Your application handles authorization.** It does not verify codes, create sessions, or protect data on the server.

## Install

Use a React 18 or 19 project with Tailwind CSS 4 and a configured shadcn `components.json`.

Register Knock once, then add a block:

```sh
npx shadcn@latest registry add @knock-codes
npx shadcn@latest add @knock-codes/client-preview-gate
```

Or install directly by URL:

```sh
npx shadcn@latest add https://knock.codes/r/client-preview-gate.json
```

Files are copied into your configured components directory under `knock/`. Blocks bring their component dependencies with them. You own and edit the installed source; there is no Knock runtime package to import.

Prefer to copy by hand? Each item has a [playground](https://knock.codes/library), documentation, and a downloadable source file.

## Use it in your app

The block receives the code, visual status, and visibility state from your application. This example connects the submit action to an application-provided verifier; the parent supplies `authorized` from its own access state.

```tsx
'use client';

import { useState, type ReactNode } from 'react';
import { ClientPreviewGate } from '@/components/knock/client-preview-gate';

type PreviewEntranceProps = {
  authorized: boolean;
  verifyCode: (code: string) => Promise<void>;
  children: ReactNode;
};

export function PreviewEntrance({ authorized, verifyCode, children }: PreviewEntranceProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');

  return (
    <ClientPreviewGate
      value={code}
      onChange={setCode}
      status={status}
      unlocked={authorized}
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus('pending');
        try {
          await verifyCode(code);
          setStatus('success');
        } catch {
          setStatus('error');
        }
      }}
      error="We couldn’t open this preview. Check your code and try again."
      heading="A first look at what’s next."
      recipient="Acme Studio"
      logo={<strong>Atelier</strong>}
      theme="light"
    >
      {children}
    </ClientPreviewGate>
  );
}
```

Adjust the import alias to match your project. `verifyCode` is your function: it should reject on failure and update the parent’s access state after successful verification. Knock does not provide an endpoint or authentication implementation.

Fetch and deliver protected content only after server-side authorization. Passing content to a React component is not a substitute for controlling who can receive it.

### The controlled contract

- **`unlocked` controls visibility.** Setting `status="success"` does not reveal content.
- **`status` controls presentation:** `idle`, `pending`, `error`, or `success`.
- **Callbacks report intent.** Your app handles submissions, access requests, feedback, and relocking.
- **Timestamps describe state.** Expiry and cooldown UI do not enforce server rules. A finished countdown never submits a form.
- **Blur is visual only.** Teaser gate and Blur veil keep their teaser content in the DOM. Use a safe sample while locked, not protected data.

See each item’s [API reference](https://knock.codes/library) for required props, lifecycle behavior, and examples.

## The collection

### Blocks

Complete compositions for common preview flows.

| Block                                                                     | Use it for                                                              |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [Client preview gate](https://knock.codes/playground/client-preview-gate) | A branded entrance with recipient, code entry, and preview context      |
| [Quick gate](https://knock.codes/playground/quick-gate)                   | A compact access screen for staging and internal links                  |
| [Teaser gate](https://knock.codes/playground/teaser-gate)                 | A safe glimpse of the work behind a code prompt                         |
| [Gated section](https://knock.codes/playground/gated-section)             | A reserved section within an otherwise open page                        |
| [Open invitation](https://knock.codes/playground/open-invitation)         | A named recipient and a continue action, without code entry             |
| [Preview chrome](https://knock.codes/playground/preview-chrome)           | Draft labels, build identity, feedback, and relock around unlocked work |
| [Cooldown screen](https://knock.codes/playground/cooldown-screen)         | A full-screen retry countdown                                           |
| [Expired notice](https://knock.codes/playground/expired-notice)           | An ended invitation with a path to request another                      |
| [Revoked notice](https://knock.codes/playground/revoked-notice)           | A clear explanation that access has been withdrawn                      |

### Components

Individual pieces for layouts of your own.

| Component                                                             | Purpose                                                       |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Code field](https://knock.codes/playground/code-field)               | Controlled digit or passphrase entry                          |
| [Recipient line](https://knock.codes/playground/recipient-line)       | Show who the preview was prepared for                         |
| [Expiry pill](https://knock.codes/playground/expiry-pill)             | Display remaining invitation lifetime                         |
| [Cooldown notice](https://knock.codes/playground/cooldown-notice)     | Show retry timing beside a form                               |
| [Request access](https://knock.codes/playground/request-access)       | Give recipients a recovery action or link                     |
| [Preview ribbon](https://knock.codes/playground/preview-ribbon)       | Mark work as a draft                                          |
| [Preview bar](https://knock.codes/playground/preview-bar)             | Keep build details, feedback, and relock available            |
| [Relock control](https://knock.codes/playground/relock-control)       | Let the user request that the preview be hidden again         |
| [Blur veil](https://knock.codes/playground/blur-veil)                 | Visually obscure a non-sensitive teaser                       |
| [Preview watermark](https://knock.codes/playground/preview-watermark) | Carry recipient identity into the preview and its screenshots |

## Make it yours

Set `theme="light"` or `theme="dark"`, or omit `theme` to follow the system preference. Override the shared CSS variables on a parent:

```css
.preview {
  --knock-bg: #fffefa;
  --knock-ink: #30342d;
  --knock-muted: #69725f;
  --knock-accent: #a84d35;
  --knock-on-accent: #ffffff;
  --knock-border: #dedfd4;
  --knock-error: #b42318;
}
```

Use `logo`, `heading`, `description`, and `labels` to adapt branding and built-in copy. Edit the installed source for layout changes. Check contrast after overriding colors.

[Theming guide →](https://knock.codes/docs/styling)

## Accessibility

Code entry uses a single native input to preserve selection, keyboard editing, masking, paste, and one-time-code autofill. Errors and expiry changes are announced; countdown ticks remain quiet. Blocks move focus after unlocking and respect reduced-motion preferences.

Blocks are **regions, not modal dialogs**. They do not trap focus or disable the surrounding page. Automated checks cover structural accessibility and hydration; the development `/audit` route adds rendered browser checks, including contrast. Customizations still need testing in their final context.

## Using an AI coding agent?

Give it the item’s documentation before asking it to wire up the component:

- [llms.txt](https://knock.codes/llms.txt) — library index.
- [llms-full.txt](https://knock.codes/llms-full.txt) — contracts, examples, and source in one file.
- `/docs/<item>.md` — an item’s props, defaults, pitfalls, and accessibility notes.
- `/prompts/<item>.md` — an item-specific integration prompt.
- `/source/<item>.tsx` — its published source.

For example: [Client preview gate reference](https://knock.codes/docs/client-preview-gate.md) and [integration prompt](https://knock.codes/prompts/client-preview-gate.md).

## Develop locally

Use **Node.js 22**, matching CI.

```sh
git clone https://github.com/trivedi-vatsal/knock-codes.git
cd knock-codes
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173). The site includes the homepage, searchable library, individual playgrounds, and documentation. `/audit` is available only in development.

```text
registry/components/   Individual component source
registry/blocks/       Composed block source
registry/shared/       Shared implementation used during generation
src/                   Website, playgrounds, and documentation UI
scripts/               Generation, build, and validation tooling
public/                Published registry, docs, source, and site assets
tests/                 Contract, interaction, hydration, and accessibility checks
```

### Source and generated files

Edit library items in `registry/`. Their TypeScript interfaces and JSDoc are the source of truth for the public distribution. Keep `@whenToUse`, `@notFor`, `@pitfall`, and `@lifecycle` guidance current, and bump the item version when changing public behavior.

```sh
npm run generate         # Regenerate registry payloads, docs, source, and examples
npm run check:generated  # Detect stale generated output
npm run check:examples   # Typecheck the generated usage examples
```

Do not hand-edit generated registry JSON, catalogs, item docs, prompts, or published source. Set `REGISTRY_BASE_URL` when generating against a different origin; it defaults to `https://knock.codes`.

The distribution includes `/r/<item>.json`, the compatible `/r/react/<item>.json` paths, catalog indexes, Markdown docs, prompts, and source. Root `registry.json` supports GitHub-based shadcn installation. Website documentation reads the generated `catalog.json`.

### Validate changes

```sh
npm run check          # Generated output, registry validation, build, and tests
npm run format:check   # Source formatting
npm run test:install   # Real shadcn installation smoke test
npm run test:pages     # Built routes, metadata, assets, and HTTP behavior
npm run test:docs      # Rendered documentation checks
npm run test:react18   # React 18 compatibility check
```

CI validates generated output, examples, hydration, accessibility structure, docs, and installation against React 18 and 19. For UI changes, also inspect the relevant playground at desktop and mobile sizes and test keyboard interaction.

### Build

```sh
npm run build
```

The static site is written to `dist/`, including route-specific metadata, `sitemap.xml`, `robots.txt`, and `404.html`. Use this locally or in CI. Production hosting is on Vercel: connected branches deploy automatically from `vercel.json`.

## Contributing

Issues and pull requests are welcome. For a new item or behavior change, include a concrete use case, update the source documentation, regenerate the distribution, and run the relevant checks above. Keep the controlled contract explicit: access decisions belong to the consuming application.

## License

[MIT](LICENSE) — use, modify, and ship the code in your own projects.

Looking for the previous version? It is preserved on the [`v1` branch](https://github.com/trivedi-vatsal/knock-codes/tree/v1).
