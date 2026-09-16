# Relock control

Version 0.2.0 · components · unlocked

Lets the consumer hide a preview on a shared screen. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

## When to use

One deliberate way to put the preview away on a shared screen, inside chrome you have already built.

## Not for

Previews that already use Preview bar or Preview chrome. Both include this control, and two relock buttons is the usual duplication.

## Install

The registry is listed in the shadcn directory as `@knock-codes`.

```
npx shadcn@latest registry add @knock-codes
npx shadcn@latest add @knock-codes/relock-control
```

Direct URL:

`npx shadcn@latest add https://knock.codes/r/relock-control.json`

Requires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.

[Live demo](https://knock.codes/playground/relock-control) · [Registry JSON](https://knock.codes/r/relock-control.json) · [Source](https://knock.codes/source/relock-control.tsx)

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| onRelock | `() => void` | yes | — | Called on activation. Consumer must hide content and end access as appropriate; required. |
| disabled | `boolean` | no | false | Disable while the consumer is processing. |
| labels | `{ action?: string; description?: string; }` | no | — | Localized label and explanation. |
| theme | `'light' \| 'dark'` | no | — | Explicit theme; omitted follows the system preference. |
| className | `string` | no | '' | Additional wrapper classes. |

### Label defaults

- labels.action: `'Relock preview'`
- labels.description: `'Stepping away? Keep this preview private.'`

## Common mistakes

- Activating calls `onRelock` and does nothing else. Hiding the content, and returning focus to the gate, remain yours.

## Related

Self-contained; no other item installs with it.

## Accessibility

Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

## Agent instructions and anti-hallucination contract

Install and wire Relock control (RelockControl) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/relock-control`, or from https://knock.codes/r/relock-control.json. Read https://knock.codes/docs/relock-control.md before editing.

Lets the consumer hide a preview on a shared screen. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: onRelock: () => void.
Optional props and defaults:
- disabled: boolean; default false
- labels: { action?: string; description?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: One deliberate way to put the preview away on a shared screen, inside chrome you have already built.
Do not use it for: Previews that already use Preview bar or Preview chrome. Both include this control, and two relock buttons is the usual duplication.
Common mistakes:
- Activating calls `onRelock` and does nothing else. Hiding the content, and returning focus to the gate, remain yours.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { RelockControl } from '@/components/knock/relock-control';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Relock control example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RelockControl onRelock={() => setUnlocked(false)} />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { RelockControl } from '@/components/knock/relock-control';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Relock control example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RelockControl onRelock={() => setUnlocked(false)} disabled={false} theme="light" labels={{ action: "Relock", description: "Hide this preview before stepping away." }} />
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
```


## Source

```tsx
/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Lets the consumer hide a preview on a shared screen.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: the consumer owns lifecycle timestamps and action callbacks.
 * @version 0.2.0
 * @minimalExample <RelockControl onRelock={() => setUnlocked(false)} />
 * @fullExample <RelockControl onRelock={() => setUnlocked(false)} disabled={false} theme="light" labels={{ action: "Relock", description: "Hide this preview before stepping away." }} />
 * @lifecycle unlocked
 * @whenToUse One deliberate way to put the preview away on a shared screen, inside chrome you have already built.
 * @notFor Previews that already use Preview bar or Preview chrome. Both include this control, and two relock buttons is the usual duplication.
 * @pitfall Activating calls `onRelock` and does nothing else. Hiding the content, and returning focus to the gate, remain yours.
 * @a11y Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.
 */
'use client';

export interface RelockControlProps {
  /** Called on activation. Consumer must hide content and end access as appropriate; required. */
  onRelock: () => void;
  /** Disable while the consumer is processing. @default false */
  disabled?: boolean;
  /** Localized label and explanation. */
  labels?: {
    /** Localized action. */
    action?: string;

    /** Localized description. */
    description?: string;
  };

  /** Explicit theme; omitted follows the system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}
export function RelockControl({
  onRelock,
  disabled = false,
  labels,
  theme,
  className = '',
}: RelockControlProps) {
  return (
    <div
      data-knock-item="relock"
      data-theme={theme}
      className={`inline-flex flex-col items-start gap-2 ${className}`}
    >
      <style>{`[data-knock-item]{--knock-surface:#fffefa;--knock-text:#30382c;--knock-secondary:#65705b;--knock-line:#d8dece;--knock-highlight:#a3462d;color:var(--knock-ink,var(--knock-text));color-scheme:light}[data-knock-item][data-theme=dark]{--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-item]:not([data-theme=light]){--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}}[data-knock-item] a:focus-visible,[data-knock-item] button:focus-visible,[data-knock-item] [tabindex]:focus-visible{outline:2px solid var(--knock-accent,var(--knock-highlight));outline-offset:4px}[data-knock-item] button,[data-knock-item] a{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){[data-knock-item] *{animation:none!important;transition:none!important}}`}</style>
      <button
        type="button"
        onClick={onRelock}
        disabled={disabled}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--knock-border,var(--knock-line))] bg-[var(--knock-bg,var(--knock-surface))] px-4 text-sm font-medium disabled:cursor-wait disabled:opacity-60"
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        {labels?.action ?? 'Relock preview'}
      </button>
      <span className="text-xs text-[var(--knock-muted,var(--knock-secondary))]">
        {labels?.description ?? 'Stepping away? Keep this preview private.'}
      </span>
    </div>
  );
}

```
