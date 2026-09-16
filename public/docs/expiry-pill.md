# Expiry pill

Version 0.2.0 · components · gate

Shows a preview lifetime as fine, expiring soon, or expired. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

## When to use

A preview's remaining lifetime belongs next to the gate, or inside the bar that stays after unlock.

## Not for

Enforcing the deadline. The pill reaches its expired state and changes nothing about what your application serves.

## Install

`npx shadcn@latest add https://knock.codes/r/expiry-pill.json`

Requires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.

[Live demo](https://knock.codes/playground/expiry-pill) · [Registry JSON](https://knock.codes/r/expiry-pill.json) · [Source](https://knock.codes/source/expiry-pill.tsx)

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| expiresAt | `string` | yes | — | Expiry timestamp as ISO 8601 with timezone; required. |
| soonThreshold | `number` | no | 86400 | Duration considered expiring soon, in seconds. |
| labels | `{ pending?: string; fine?: string; soon?: string; expired?: string; unavailable?: string; remaining?: (seconds: number) => string; }` | no | — | Localized states and remaining-time formatter. |
| theme | `'light' \| 'dark'` | no | — | Explicit theme; omitted follows the system preference. |
| className | `string` | no | '' | Additional wrapper classes. |

### Label defaults

- labels.pending: `'Preview expiry'`
- labels.unavailable: `'Expiry unavailable'`
- labels.expired: `'Preview expired'`
- labels.soon: `'Expiring soon'`
- labels.fine: `'Preview available'`

## Common mistakes

- Rendering the expired state hides nothing. Your own check decides whether the preview is still available.
- `soonThreshold` is in seconds, not milliseconds. The default window is one hour.

## Related

Used by: client-preview-gate, cooldown-screen, expired-notice, gated-section, quick-gate, revoked-notice, teaser-gate.

## Accessibility

Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

## Agent instructions and anti-hallucination contract

Install and wire Expiry pill (ExpiryPill) from https://knock.codes/r/expiry-pill.json in a React + Tailwind project. Read https://knock.codes/docs/expiry-pill.md before editing.

Shows a preview lifetime as fine, expiring soon, or expired. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: expiresAt: string.
Optional props and defaults:
- soonThreshold: number; default 86400
- labels: { pending?: string; fine?: string; soon?: string; expired?: string; unavailable?: string; remaining?: (seconds: number) => string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: A preview's remaining lifetime belongs next to the gate, or inside the bar that stays after unlock.
Do not use it for: Enforcing the deadline. The pill reaches its expired state and changes nothing about what your application serves.
Common mistakes:
- Rendering the expired state hides nothing. Your own check decides whether the preview is still available.
- `soonThreshold` is in seconds, not milliseconds. The default window is one hour.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { ExpiryPill } from '@/components/knock/expiry-pill';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Expiry pill example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <ExpiryPill expiresAt="2030-01-01T12:00:00Z" />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { ExpiryPill } from '@/components/knock/expiry-pill';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Expiry pill example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <ExpiryPill expiresAt="2030-01-01T12:00:00Z" soonThreshold={3600} theme="light" labels={{ fine: "Available", soon: "Ending soon", expired: "Expired", pending: "Expiry", unavailable: "Ask the owner", remaining: seconds => `${seconds}s` }} />
    <p role="status">{message}</p>
  </section>;
}
```


## Source

```tsx
/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Shows a preview lifetime as fine, expiring soon, or expired.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: the consumer owns lifecycle timestamps and action callbacks.
 * @version 0.2.0
 * @minimalExample <ExpiryPill expiresAt="2030-01-01T12:00:00Z" />
 * @fullExample <ExpiryPill expiresAt="2030-01-01T12:00:00Z" soonThreshold={3600} theme="light" labels={{ fine: "Available", soon: "Ending soon", expired: "Expired", pending: "Expiry", unavailable: "Ask the owner", remaining: seconds => `${seconds}s` }} />
 * @lifecycle gate
 * @whenToUse A preview's remaining lifetime belongs next to the gate, or inside the bar that stays after unlock.
 * @notFor Enforcing the deadline. The pill reaches its expired state and changes nothing about what your application serves.
 * @pitfall Rendering the expired state hides nothing. Your own check decides whether the preview is still available.
 * @pitfall `soonThreshold` is in seconds, not milliseconds. The default window is one hour.
 * @a11y Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.
 */
'use client';

import { useEffect, useState } from 'react';
export interface ExpiryPillProps {
  /** Expiry timestamp as ISO 8601 with timezone; required. */
  expiresAt: string;
  /** Duration considered expiring soon, in seconds. @default 86400 */
  soonThreshold?: number;
  /** Localized states and remaining-time formatter. */
  labels?: {
    /** Localized pending. */
    pending?: string;

    /** Localized fine. */
    fine?: string;

    /** Localized soon. */
    soon?: string;

    /** Localized expired. */
    expired?: string;

    /** Localized unavailable. */
    unavailable?: string;

    /** Localized remaining formatter. */
    remaining?: (seconds: number) => string;
  };

  /** Explicit theme; omitted follows the system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}
export function getExpiryState(
  expiresAt: string,
  now: number,
  soonThreshold = 86400,
): 'fine' | 'soon' | 'expired' | 'invalid' {
  const remaining = Date.parse(expiresAt) - now;
  return !Number.isFinite(remaining)
    ? 'invalid'
    : remaining <= 0
      ? 'expired'
      : remaining <= Math.max(0, soonThreshold) * 1000
        ? 'soon'
        : 'fine';
}
export function ExpiryPill({
  expiresAt,
  soonThreshold = 86400,
  labels,
  theme,
  className = '',
}: ExpiryPillProps) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);
  const state = now === null ? 'pending' : getExpiryState(expiresAt, now, soonThreshold);
  const seconds = now === null ? 0 : Math.max(0, Math.ceil((Date.parse(expiresAt) - now) / 1000));
  const remaining =
    state !== 'fine' && state !== 'soon'
      ? ''
      : (labels?.remaining?.(seconds) ??
        (seconds >= 86400
          ? `${Math.ceil(seconds / 86400)}d`
          : seconds >= 3600
            ? `${Math.ceil(seconds / 3600)}h`
            : `${Math.max(1, Math.ceil(seconds / 60))}m`));
  const text =
    state === 'pending'
      ? (labels?.pending ?? 'Preview expiry')
      : state === 'invalid'
        ? (labels?.unavailable ?? 'Expiry unavailable')
        : state === 'expired'
          ? (labels?.expired ?? 'Preview expired')
          : `${state === 'soon' ? (labels?.soon ?? 'Expiring soon') : (labels?.fine ?? 'Preview available')} · ${remaining}`;
  return (
    <span
      data-knock-item="expiry"
      data-theme={theme}
      data-state={state}
      className={`inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--knock-border,var(--knock-line))] bg-[var(--knock-bg,var(--knock-surface))] px-3 py-1.5 text-xs ${className}`}
    >
      <style>{`[data-knock-item]{--knock-surface:#fffefa;--knock-text:#30382c;--knock-secondary:#65705b;--knock-line:#d8dece;--knock-highlight:#a3462d;color:var(--knock-ink,var(--knock-text));color-scheme:light}[data-knock-item][data-theme=dark]{--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-item]:not([data-theme=light]){--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}}[data-knock-item] a:focus-visible,[data-knock-item] button:focus-visible,[data-knock-item] [tabindex]:focus-visible{outline:2px solid var(--knock-accent,var(--knock-highlight));outline-offset:4px}[data-knock-item] button,[data-knock-item] a{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){[data-knock-item] *{animation:none!important;transition:none!important}}`}</style>
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d={state === 'expired' ? 'm8 8 8 8m0-8-8 8' : 'M12 6v6l4 2'} />
      </svg>
      <span>{text}</span>
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'expired'
          ? (labels?.expired ?? 'Preview expired')
          : state === 'soon'
            ? (labels?.soon ?? 'Expiring soon')
            : ''}
      </span>
    </span>
  );
}

```
