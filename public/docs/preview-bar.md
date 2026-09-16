# Preview bar

Version 0.2.0 · components · unlocked

Keeps build identity, expiry, feedback and relocking available after unlock. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

## When to use

After unlock, build identity, remaining lifetime, feedback and relock should stay reachable without covering the work.

## Not for

The locked state. Use a gate block for that; this is post-unlock chrome. For relock alone inside chrome you already have, use the Relock control.

## Install

`npx shadcn@latest add https://knock.codes/r/preview-bar.json`

Requires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.

[Live demo](https://knock.codes/playground/preview-bar) · [Registry JSON](https://knock.codes/r/preview-bar.json) · [Source](https://knock.codes/source/preview-bar.tsx)

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| buildLabel | `string` | yes | — | Build or version identifier; required. |
| expiresAt | `string` | no | — | ISO 8601 expiry timestamp with timezone. Displayed deterministically in UTC. |
| onRelock | `() => void` | yes | — | Called when the consumer should relock the preview; required. |
| feedbackHref | `string` | no | — | Feedback destination. Takes precedence over callback; relative, http(s), or mailto. |
| onFeedback | `() => void` | no | — | Feedback callback when no destination URL is supplied. |
| labels | `{ navigation?: string; preview?: string; expires?: string; invalidExpiry?: string; feedback?: string; relock?: string; }` | no | — | Localized visible and accessible labels. |
| theme | `'light' \| 'dark'` | no | — | Explicit theme; omitted follows the system preference. |
| className | `string` | no | '' | Additional wrapper classes. |

### Label defaults

- labels.navigation: `'Preview controls'`
- labels.preview: `'Draft preview'`
- labels.expires: `'Expires'`
- labels.invalidExpiry: `'Expiry unavailable'`
- labels.feedback: `'Send feedback'`
- labels.relock: `'Relock preview'`

## Common mistakes

- `onRelock` only calls back. The bar hides nothing: set your own `unlocked` to false and move focus yourself.
- Omitting `onRelock` omits the relock control rather than rendering an action that does nothing.

## Related

Used by: preview-chrome.

## Accessibility

Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

## Agent instructions and anti-hallucination contract

Install and wire Preview bar (PreviewBar) from https://knock.codes/r/preview-bar.json in a React + Tailwind project. Read https://knock.codes/docs/preview-bar.md before editing.

Keeps build identity, expiry, feedback and relocking available after unlock. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: buildLabel: string; onRelock: () => void.
Optional props and defaults:
- expiresAt: string; default omitted
- feedbackHref: string; default omitted
- onFeedback: () => void; default omitted
- labels: { navigation?: string; preview?: string; expires?: string; invalidExpiry?: string; feedback?: string; relock?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: After unlock, build identity, remaining lifetime, feedback and relock should stay reachable without covering the work.
Do not use it for: The locked state. Use a gate block for that; this is post-unlock chrome. For relock alone inside chrome you already have, use the Relock control.
Common mistakes:
- `onRelock` only calls back. The bar hides nothing: set your own `unlocked` to false and move focus yourself.
- Omitting `onRelock` omits the relock control rather than rendering an action that does nothing.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewBar } from '@/components/knock/preview-bar';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview bar example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewBar buildLabel="v1" onRelock={() => setUnlocked(false)} />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewBar } from '@/components/knock/preview-bar';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview bar example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewBar buildLabel="acme-v1" expiresAt="2030-01-01T12:00:00Z" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ navigation: "Preview controls", preview: "Draft", expires: "Expires", invalidExpiry: "Ask the owner", feedback: "Feedback", relock: "Relock" }} />
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
```


## Source

```tsx
/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Keeps build identity, expiry, feedback and relocking available after unlock.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: the consumer owns lifecycle timestamps and action callbacks.
 * @version 0.2.0
 * @minimalExample <PreviewBar buildLabel="v1" onRelock={() => setUnlocked(false)} />
 * @fullExample <PreviewBar buildLabel="acme-v1" expiresAt="2030-01-01T12:00:00Z" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ navigation: "Preview controls", preview: "Draft", expires: "Expires", invalidExpiry: "Ask the owner", feedback: "Feedback", relock: "Relock" }} />
 * @lifecycle unlocked
 * @whenToUse After unlock, build identity, remaining lifetime, feedback and relock should stay reachable without covering the work.
 * @notFor The locked state. Use a gate block for that; this is post-unlock chrome. For relock alone inside chrome you already have, use the Relock control.
 * @pitfall `onRelock` only calls back. The bar hides nothing: set your own `unlocked` to false and move focus yourself.
 * @pitfall Omitting `onRelock` omits the relock control rather than rendering an action that does nothing.
 * @a11y Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.
 */
'use client';

export interface PreviewBarProps {
  /** Build or version identifier; required. */
  buildLabel: string;
  /** ISO 8601 expiry timestamp with timezone. Displayed deterministically in UTC. */
  expiresAt?: string;
  /** Called when the consumer should relock the preview; required. */
  onRelock: () => void;
  /** Feedback destination. Takes precedence over callback; relative, http(s), or mailto. */
  feedbackHref?: string;
  /** Feedback callback when no destination URL is supplied. */
  onFeedback?: () => void;
  /** Localized visible and accessible labels. */
  labels?: {
    /** Localized navigation. */
    navigation?: string;

    /** Localized preview. */
    preview?: string;

    /** Localized expires. */
    expires?: string;

    /** Localized invalid expiry. */
    invalidExpiry?: string;

    /** Localized feedback. */
    feedback?: string;

    /** Localized relock. */
    relock?: string;
  };

  /** Explicit theme; omitted follows the system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}
export function PreviewBar({
  buildLabel,
  expiresAt,
  onRelock,
  feedbackHref,
  onFeedback,
  labels,
  theme,
  className = '',
}: PreviewBarProps) {
  const href =
    feedbackHref && /^(?:https?:\/\/|mailto:|\/(?!\/)|#|\.\.?\/)/i.test(feedbackHref)
      ? feedbackHref
      : undefined;
  const valid = expiresAt && Number.isFinite(Date.parse(expiresAt));
  const date = valid
    ? new Date(expiresAt!).toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
    : '';
  const action = 'inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-xs font-medium';
  return (
    <nav
      aria-label={labels?.navigation ?? 'Preview controls'}
      data-knock-item="bar"
      data-theme={theme}
      className={`flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border border-[var(--knock-border,var(--knock-line))] bg-[var(--knock-bg,var(--knock-surface))] p-3 ${className}`}
    >
      <style>{`[data-knock-item]{--knock-surface:#fffefa;--knock-text:#30382c;--knock-secondary:#65705b;--knock-line:#d8dece;--knock-highlight:#a3462d;color:var(--knock-ink,var(--knock-text));color-scheme:light}[data-knock-item][data-theme=dark]{--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-item]:not([data-theme=light]){--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}}[data-knock-item] a:focus-visible,[data-knock-item] button:focus-visible,[data-knock-item] [tabindex]:focus-visible{outline:2px solid var(--knock-accent,var(--knock-highlight));outline-offset:4px}[data-knock-item] button,[data-knock-item] a{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){[data-knock-item] *{animation:none!important;transition:none!important}}`}</style>
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-xs font-medium uppercase tracking-widest">
          {labels?.preview ?? 'Draft preview'}
        </span>
        <span className="break-all font-mono text-xs text-[var(--knock-muted,var(--knock-secondary))]">
          {buildLabel}
        </span>
        {expiresAt && (
          <span className="text-xs text-[var(--knock-muted,var(--knock-secondary))]">
            {valid ? (
              <>
                {labels?.expires ?? 'Expires'} <time dateTime={expiresAt}>{date}</time>
              </>
            ) : (
              (labels?.invalidExpiry ?? 'Expiry unavailable')
            )}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {href ? (
          <a href={href} className={action}>
            {labels?.feedback ?? 'Send feedback'}
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        ) : onFeedback ? (
          <button type="button" onClick={onFeedback} className={action}>
            {labels?.feedback ?? 'Send feedback'}
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </button>
        ) : null}
        <button
          type="button"
          onClick={onRelock}
          className={`${action} border border-[var(--knock-border,var(--knock-line))]`}
        >
          {labels?.relock ?? 'Relock preview'}
        </button>
      </div>
    </nav>
  );
}

```
