# Cooldown notice

Version 0.2.0 · components · gate

Displays a calm countdown without enforcing a retry policy. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

## When to use

A retry window is running and the gate should stay on screen, with the wait stated calmly beside the code field.

## Not for

A full screen that replaces the gate during the pause. Use the Cooldown screen block.

## Install

`npx shadcn@latest add https://knock.codes/r/cooldown-notice.json`

Requires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.

[Live demo](https://knock.codes/playground/cooldown-notice) · [Registry JSON](https://knock.codes/r/cooldown-notice.json) · [Source](https://knock.codes/source/cooldown-notice.tsx)

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| cooldownUntil | `string` | yes | — | Retry deadline as ISO 8601 with timezone; required. Invalid values show unavailable text. |
| labels | `{ heading?: string; description?: string; ready?: string; waiting?: string; unavailable?: string; countdown?: (seconds: number) => string; }` | no | — | Localized visible text and countdown formatter. |
| theme | `'light' \| 'dark'` | no | — | Explicit theme; omitted follows the system preference. |
| className | `string` | no | '' | Additional wrapper classes. |

### Label defaults

- labels.heading: `'A little breathing room.'`
- labels.description: `'A few tries didn’t quite match. Take a moment, then try the code from your email again.'`
- labels.unavailable: `'Retry time is unavailable. Please contact the preview owner.'`
- labels.ready: `'Ready when you are. You can try again.'`
- labels.waiting: `'Your preview will be right here.'`

## Common mistakes

- Reaching zero announces readiness and nothing else. It never submits, never re-enables your submit button and never clears the cooldown.
- `cooldownUntil` is a timestamp you own. A value already in the past renders the ready state immediately; the component counts no attempts.

## Related

Used by: client-preview-gate, cooldown-screen, expired-notice, gated-section, preview-chrome, quick-gate, revoked-notice, teaser-gate.

## Accessibility

Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

## Agent instructions and anti-hallucination contract

Install and wire Cooldown notice (CooldownNotice) from https://knock.codes/r/cooldown-notice.json in a React + Tailwind project. Read https://knock.codes/docs/cooldown-notice.md before editing.

Displays a calm countdown without enforcing a retry policy. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: cooldownUntil: string.
Optional props and defaults:
- labels: { heading?: string; description?: string; ready?: string; waiting?: string; unavailable?: string; countdown?: (seconds: number) => string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: A retry window is running and the gate should stay on screen, with the wait stated calmly beside the code field.
Do not use it for: A full screen that replaces the gate during the pause. Use the Cooldown screen block.
Common mistakes:
- Reaching zero announces readiness and nothing else. It never submits, never re-enables your submit button and never clears the cooldown.
- `cooldownUntil` is a timestamp you own. A value already in the past renders the ready state immediately; the component counts no attempts.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { CooldownNotice } from '@/components/knock/cooldown-notice';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Cooldown notice example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CooldownNotice cooldownUntil="2030-01-01T12:00:00Z" />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { CooldownNotice } from '@/components/knock/cooldown-notice';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Cooldown notice example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CooldownNotice cooldownUntil="2030-01-01T12:00:00Z" theme="light" labels={{ heading: "Take a moment.", description: "Your preview will be here.", waiting: "Please wait a little.", ready: "You can try again.", unavailable: "Ask the preview owner.", countdown: seconds => `${seconds}s` }} />
    <p role="status">{message}</p>
  </section>;
}
```


## Source

```tsx
/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Displays a calm countdown without enforcing a retry policy.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: the consumer owns lifecycle timestamps and action callbacks.
 * @version 0.2.0
 * @minimalExample <CooldownNotice cooldownUntil="2030-01-01T12:00:00Z" />
 * @fullExample <CooldownNotice cooldownUntil="2030-01-01T12:00:00Z" theme="light" labels={{ heading: "Take a moment.", description: "Your preview will be here.", waiting: "Please wait a little.", ready: "You can try again.", unavailable: "Ask the preview owner.", countdown: seconds => `${seconds}s` }} />
 * @lifecycle gate
 * @whenToUse A retry window is running and the gate should stay on screen, with the wait stated calmly beside the code field.
 * @notFor A full screen that replaces the gate during the pause. Use the Cooldown screen block.
 * @pitfall Reaching zero announces readiness and nothing else. It never submits, never re-enables your submit button and never clears the cooldown.
 * @pitfall `cooldownUntil` is a timestamp you own. A value already in the past renders the ready state immediately; the component counts no attempts.
 * @a11y Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.
 */
'use client';

import { useEffect, useState } from 'react';
export interface CooldownNoticeProps {
  /** Retry deadline as ISO 8601 with timezone; required. Invalid values show unavailable text. */
  cooldownUntil: string;
  /** Localized visible text and countdown formatter. */
  labels?: {
    /** Localized heading. */
    heading?: string;

    /** Localized description. */
    description?: string;

    /** Localized ready. */
    ready?: string;

    /** Localized waiting. */
    waiting?: string;

    /** Localized unavailable. */
    unavailable?: string;

    /** Localized countdown formatter. */
    countdown?: (seconds: number) => string;
  };

  /** Explicit theme; omitted follows the system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}
export function CooldownNotice({
  cooldownUntil,
  labels,
  theme,
  className = '',
}: CooldownNoticeProps) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [cooldownUntil]);
  const deadline = Date.parse(cooldownUntil);
  const valid = Number.isFinite(deadline);
  const seconds = now === null || !valid ? null : Math.max(0, Math.ceil((deadline - now) / 1000));
  const ready = seconds === 0;
  const countdown =
    seconds === null
      ? '—:—'
      : (labels?.countdown?.(seconds) ??
        `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`);
  return (
    <section
      data-knock-item="cooldown"
      data-theme={theme}
      className={`rounded-xl border border-[var(--knock-border,var(--knock-line))] bg-[var(--knock-bg,var(--knock-surface))] p-6 ${className}`}
    >
      <style>{`[data-knock-item]{--knock-surface:#fffefa;--knock-text:#30382c;--knock-secondary:#65705b;--knock-line:#d8dece;--knock-highlight:#a3462d;color:var(--knock-ink,var(--knock-text));color-scheme:light}[data-knock-item][data-theme=dark]{--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-item]:not([data-theme=light]){--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}}[data-knock-item] a:focus-visible,[data-knock-item] button:focus-visible,[data-knock-item] [tabindex]:focus-visible{outline:2px solid var(--knock-accent,var(--knock-highlight));outline-offset:4px}[data-knock-item] button,[data-knock-item] a{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){[data-knock-item] *{animation:none!important;transition:none!important}}`}</style>
      <div className="mb-4 flex items-center justify-between gap-4">
        <svg
          aria-hidden="true"
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-2xl text-[var(--knock-accent,var(--knock-highlight))]"
        >
          <path d="M4 9a8 8 0 1 1 0 6M4 3v6h6" />
        </svg>
        <span role="timer" aria-live="off" className="font-mono text-2xl tabular-nums">
          {countdown}
        </span>
      </div>
      <h3 className="text-lg font-medium">{labels?.heading ?? 'A little breathing room.'}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--knock-muted,var(--knock-secondary))]">
        {labels?.description ??
          'A few tries didn’t quite match. Take a moment, then try the code from your email again.'}
      </p>
      <p role="status" aria-live="polite" className="mt-4 text-sm font-medium">
        {!valid
          ? (labels?.unavailable ?? 'Retry time is unavailable. Please contact the preview owner.')
          : ready
            ? (labels?.ready ?? 'Ready when you are. You can try again.')
            : (labels?.waiting ?? 'Your preview will be right here.')}
      </p>
    </section>
  );
}

```
