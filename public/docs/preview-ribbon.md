# Preview ribbon

Version 0.2.0 · components · unlocked

Keeps a draft label visible within preview screenshots. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

## When to use

Draft status should travel with the work, including into the screenshots that leave the review.

## Not for

A dismissible banner. There is no dismiss action by design: a ribbon that can be closed is absent from the screenshot that needed it.

## Install

The registry is listed in the shadcn directory as `@knock-codes`.

```
npx shadcn@latest registry add @knock-codes
npx shadcn@latest add @knock-codes/preview-ribbon
```

Direct URL:

`npx shadcn@latest add https://knock.codes/r/preview-ribbon.json`

Requires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.

[Live demo](https://knock.codes/playground/preview-ribbon) · [Registry JSON](https://knock.codes/r/preview-ribbon.json) · [Source](https://knock.codes/source/preview-ribbon.tsx)

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| labels | `{ draft?: string; description?: string; }` | no | — | Localized draft label and supporting context. |
| theme | `'light' \| 'dark'` | no | — | Explicit theme; omitted follows the system preference. |
| className | `string` | no | '' | Additional wrapper classes. |

### Label defaults

- labels.draft: `'Work in progress'`
- labels.description: `'A private preview, not the finished thing.'`

## Common mistakes

- Position belongs to you. Without sticky or fixed positioning from your own className, the ribbon scrolls away with the page.

## Related

Used by: preview-chrome.

## Accessibility

Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

## Agent instructions and anti-hallucination contract

Install and wire Preview ribbon (PreviewRibbon) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/preview-ribbon`, or from https://knock.codes/r/preview-ribbon.json. Read https://knock.codes/docs/preview-ribbon.md before editing.

Keeps a draft label visible within preview screenshots. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: none.
Optional props and defaults:
- labels: { draft?: string; description?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: Draft status should travel with the work, including into the screenshots that leave the review.
Do not use it for: A dismissible banner. There is no dismiss action by design: a ribbon that can be closed is absent from the screenshot that needed it.
Common mistakes:
- Position belongs to you. Without sticky or fixed positioning from your own className, the ribbon scrolls away with the page.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewRibbon } from '@/components/knock/preview-ribbon';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview ribbon example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewRibbon />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewRibbon } from '@/components/knock/preview-ribbon';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview ribbon example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewRibbon theme="light" labels={{ draft: "Draft preview", description: "For review only." }} className="sticky top-0" />
    <p role="status">{message}</p>
  </section>;
}
```


## Source

```tsx
/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Keeps a draft label visible within preview screenshots.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: the consumer owns lifecycle timestamps and action callbacks.
 * @version 0.2.0
 * @minimalExample <PreviewRibbon />
 * @fullExample <PreviewRibbon theme="light" labels={{ draft: "Draft preview", description: "For review only." }} className="sticky top-0" />
 * @lifecycle unlocked
 * @whenToUse Draft status should travel with the work, including into the screenshots that leave the review.
 * @notFor A dismissible banner. There is no dismiss action by design: a ribbon that can be closed is absent from the screenshot that needed it.
 * @pitfall Position belongs to you. Without sticky or fixed positioning from your own className, the ribbon scrolls away with the page.
 * @a11y Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.
 */
'use client';

export interface PreviewRibbonProps {
  /** Localized draft label and supporting context. */
  labels?: {
    /** Localized draft. */
    draft?: string;

    /** Localized description. */
    description?: string;
  };

  /** Explicit theme; omitted follows the system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}
export function PreviewRibbon({ labels, theme, className = '' }: PreviewRibbonProps) {
  return (
    <div
      data-knock-item="ribbon"
      data-theme={theme}
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-y border-[var(--knock-border,var(--knock-line))] bg-[var(--knock-bg,var(--knock-surface))] px-4 py-2 text-xs ${className}`}
    >
      <style>{`[data-knock-item]{--knock-surface:#fffefa;--knock-text:#30382c;--knock-secondary:#65705b;--knock-line:#d8dece;--knock-highlight:#a3462d;color:var(--knock-ink,var(--knock-text));color-scheme:light}[data-knock-item][data-theme=dark]{--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-item]:not([data-theme=light]){--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}}[data-knock-item] a:focus-visible,[data-knock-item] button:focus-visible,[data-knock-item] [tabindex]:focus-visible{outline:2px solid var(--knock-accent,var(--knock-highlight));outline-offset:4px}[data-knock-item] button,[data-knock-item] a{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){[data-knock-item] *{animation:none!important;transition:none!important}}`}</style>
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-[var(--knock-accent,var(--knock-highlight))]"
      >
        <path d="M12 3v18M3 12h18M5 5l14 14M5 19 19 5" />
      </svg>
      <strong className="font-semibold uppercase tracking-widest">
        {labels?.draft ?? 'Work in progress'}
      </strong>
      <span className="text-[var(--knock-muted,var(--knock-secondary))]">
        {labels?.description ?? 'A private preview, not the finished thing.'}
      </span>
    </div>
  );
}

```
