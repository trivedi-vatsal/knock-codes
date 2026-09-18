# Recipient line

Version 0.2.0 · components · gate

Addresses a private preview to its intended recipient. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

## When to use

A preview was prepared for a named person or company and the screen should say so before any code is entered.

## Not for

Proof of identity. A recipient shown here is presentation, and it is visible to anyone holding the link.

## Install

The registry is listed in the shadcn directory as `@knock-codes`.

```
npx shadcn@latest registry add @knock-codes
npx shadcn@latest add @knock-codes/recipient-line
```

Direct URL:

`npx shadcn@latest add https://knock.codes/r/recipient-line.json`

Requires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.

[Live demo](https://knock.codes/playground/recipient-line) · [Registry JSON](https://knock.codes/r/recipient-line.json) · [Source](https://knock.codes/source/recipient-line.tsx)

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| recipient | `ReactNode` | yes | — | Recipient name or organization; required. |
| label | `string` | no | 'Prepared for' | Localized prefix. |
| theme | `'light' \| 'dark'` | no | — | Explicit theme; omitted follows the system preference. |
| className | `string` | no | '' | Additional wrapper classes. |

### Label defaults

See individual label/description props.

## Common mistakes

- This text is readable before unlocking. Use a company or first name, never an email address or anything you would not put in the invitation itself.

## Related

Used by: client-preview-gate, cooldown-screen, expired-notice, gated-section, open-invitation, quick-gate, revoked-notice, teaser-gate.

## Accessibility

Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

## Agent instructions and anti-hallucination contract

Install and wire Recipient line (RecipientLine) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/recipient-line`, or from https://knock.codes/r/recipient-line.json. Read https://knock.codes/docs/recipient-line.md before editing.

Addresses a private preview to its intended recipient. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: recipient: ReactNode.
Optional props and defaults:
- label: string; default 'Prepared for'
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: A preview was prepared for a named person or company and the screen should say so before any code is entered.
Do not use it for: Proof of identity. A recipient shown here is presentation, and it is visible to anyone holding the link.
Common mistakes:
- This text is readable before unlocking. Use a company or first name, never an email address or anything you would not put in the invitation itself.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { RecipientLine } from '@/components/knock/recipient-line';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Recipient line example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RecipientLine recipient="Acme Co." />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { RecipientLine } from '@/components/knock/recipient-line';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Recipient line example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RecipientLine recipient={<strong>Acme Co.</strong>} label="Prepared for" theme="light" className="mb-4" />
    <p role="status">{message}</p>
  </section>;
}
```


## Source

```tsx
/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Addresses a private preview to its intended recipient.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: the consumer owns lifecycle timestamps and action callbacks.
 * @version 0.2.0
 * @minimalExample <RecipientLine recipient="Acme Co." />
 * @fullExample <RecipientLine recipient={<strong>Acme Co.</strong>} label="Prepared for" theme="light" className="mb-4" />
 * @lifecycle gate
 * @whenToUse A preview was prepared for a named person or company and the screen should say so before any code is entered.
 * @notFor Proof of identity. A recipient shown here is presentation, and it is visible to anyone holding the link.
 * @pitfall This text is readable before unlocking. Use a company or first name, never an email address or anything you would not put in the invitation itself.
 * @a11y Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.
 */
'use client';

import type { ReactNode } from 'react';
export interface RecipientLineProps {
  /** Recipient name or organization; required. */
  recipient: ReactNode;
  /** Localized prefix. @default "Prepared for" */
  label?: string;

  /** Explicit theme; omitted follows the system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}
export function RecipientLine({
  recipient,
  label = 'Prepared for',
  theme,
  className = '',
}: RecipientLineProps) {
  return (
    <div
      data-knock-item="recipient"
      data-theme={theme}
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${className}`}
    >
      <style>{`[data-knock-item]{--knock-surface:#fffefa;--knock-text:#30382c;--knock-secondary:#65705b;--knock-line:#d8dece;--knock-highlight:#a3462d;color:var(--knock-ink,var(--knock-text));color-scheme:light}[data-knock-item][data-theme=dark]{--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-item]:not([data-theme=light]){--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}}[data-knock-item] a:focus-visible,[data-knock-item] button:focus-visible,[data-knock-item] [tabindex]:focus-visible{outline:2px solid var(--knock-accent,var(--knock-highlight));outline-offset:4px}[data-knock-item] button,[data-knock-item] a{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){[data-knock-item] *{animation:none!important;transition:none!important}}`}</style>
      <span className="text-[var(--knock-muted,var(--knock-secondary))]">{label}</span>
      <strong className="font-medium">{recipient}</strong>
    </div>
  );
}

```
