# Preview watermark

Version 0.1.0 · components · unlocked

Marks unlocked work with a light recipient or build overlay for screenshots. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

## When to use

Unlocked work should carry who it was prepared for, including into screenshots that leave the review.

## Not for

A draft status strip. Use Preview ribbon when the label should sit above the work rather than across it.

## Install

The registry is listed in the shadcn directory as `@knock-codes`.

```
npx shadcn@latest registry add @knock-codes
npx shadcn@latest add @knock-codes/preview-watermark
```

Direct URL:

`npx shadcn@latest add https://knock.codes/r/preview-watermark.json`

Requires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.

[Live demo](https://knock.codes/playground/preview-watermark) · [Registry JSON](https://knock.codes/r/preview-watermark.json) · [Source](https://knock.codes/source/preview-watermark.tsx)

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| children | `ReactNode` | yes | — | Work shown under the mark; required. |
| recipient | `string` | no | — | Intended recipient name or organization. |
| buildLabel | `string` | no | — | Preview build identifier. |
| labels | `{ mark?: string; }` | no | — | Localized mark text when recipient and build are omitted. |
| theme | `'light' \| 'dark'` | no | — | Explicit theme; omitted follows the system preference. |
| className | `string` | no | '' | Additional wrapper classes. |

### Label defaults

See individual label/description props.

## Common mistakes

- The overlay is visual. It does not prevent copies, and it is not authorization.

## Related

Self-contained; no other item installs with it.

## Accessibility

Native controls, visible focus, localized labels; the repeating mark is decorative and hidden from assistive technology. No modal dialog is created.

## Agent instructions and anti-hallucination contract

Install and wire Preview watermark (PreviewWatermark) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/preview-watermark`, or from https://knock.codes/r/preview-watermark.json. Read https://knock.codes/docs/preview-watermark.md before editing.

Marks unlocked work with a light recipient or build overlay for screenshots. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: children: ReactNode.
Optional props and defaults:
- recipient: string; default omitted
- buildLabel: string; default omitted
- labels: { mark?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: Unlocked work should carry who it was prepared for, including into screenshots that leave the review.
Do not use it for: A draft status strip. Use Preview ribbon when the label should sit above the work rather than across it.
Common mistakes:
- The overlay is visual. It does not prevent copies, and it is not authorization.

Accessibility: Native controls, visible focus, localized labels; the repeating mark is decorative and hidden from assistive technology. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewWatermark } from '@/components/knock/preview-watermark';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview watermark example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewWatermark><p>Preview content</p></PreviewWatermark>
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewWatermark } from '@/components/knock/preview-watermark';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview watermark example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewWatermark recipient="Acme Co." buildLabel="acme-v1" theme="light" labels={{ mark: "Private preview" }}><p>Preview content</p></PreviewWatermark>
    <p role="status">{message}</p>
  </section>;
}
```


## Source

```tsx
/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Marks unlocked work with a light recipient or build overlay for screenshots.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: the consumer owns lifecycle timestamps and action callbacks.
 * @version 0.1.0
 * @minimalExample <PreviewWatermark><p>Preview content</p></PreviewWatermark>
 * @fullExample <PreviewWatermark recipient="Acme Co." buildLabel="acme-v1" theme="light" labels={{ mark: "Private preview" }}><p>Preview content</p></PreviewWatermark>
 * @lifecycle unlocked
 * @whenToUse Unlocked work should carry who it was prepared for, including into screenshots that leave the review.
 * @notFor A draft status strip. Use Preview ribbon when the label should sit above the work rather than across it.
 * @pitfall The overlay is visual. It does not prevent copies, and it is not authorization.
 * @a11y Native controls, visible focus, localized labels; the repeating mark is decorative and hidden from assistive technology. No modal dialog is created.
 */
'use client';

import { type ReactNode } from 'react';

export interface PreviewWatermarkProps {
  /** Work shown under the mark; required. */
  children: ReactNode;
  /** Intended recipient name or organization. */
  recipient?: string;
  /** Preview build identifier. */
  buildLabel?: string;
  /** Localized mark text when recipient and build are omitted. */
  labels?: {
    /** Localized repeating mark. */
    mark?: string;
  };
  /** Explicit theme; omitted follows the system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}
export function PreviewWatermark({
  children,
  recipient,
  buildLabel,
  labels,
  theme,
  className = '',
}: PreviewWatermarkProps) {
  const mark =
    [recipient, buildLabel].filter(Boolean).join(' · ') || labels?.mark || 'Private preview';
  return (
    <div
      data-knock-item="watermark"
      data-theme={theme}
      className={`relative overflow-hidden ${className}`}
    >
      <style>{`[data-knock-item]{--knock-surface:#fffefa;--knock-text:#30382c;--knock-secondary:#65705b;--knock-line:#d8dece;--knock-highlight:#a3462d;color:var(--knock-ink,var(--knock-text));color-scheme:light}[data-knock-item][data-theme=dark]{--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-item]:not([data-theme=light]){--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}}[data-knock-item] a:focus-visible,[data-knock-item] button:focus-visible,[data-knock-item] [tabindex]:focus-visible{outline:2px solid var(--knock-accent,var(--knock-highlight));outline-offset:4px}[data-knock-item] button,[data-knock-item] a{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){[data-knock-item] *{animation:none!important;transition:none!important}}`}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 select-none overflow-hidden text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--knock-muted,var(--knock-secondary))] opacity-25"
      >
        <div className="flex h-[200%] w-[200%] origin-center -translate-x-1/4 -translate-y-1/4 -rotate-12 flex-wrap content-start gap-x-16 gap-y-10 p-6">
          {Array.from({ length: 24 }, (_, index) => (
            <span key={index}>{mark}</span>
          ))}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

```
