# Quick gate

Version 0.1.0 · blocks · gate

Enter your preview code to continue. Does not verify codes, persist state, or grant or revoke access. Contract: all blocks share controlled input and visibility props. The consumer owns unlocked.

## When to use

Internal, staging or short-lived previews: one field, one action, no ceremony.

## Not for

A client-facing first impression. Use Client preview gate, which carries branding, recipient and lifecycle.

## Install

The registry is listed in the shadcn directory as `@knock-codes`.

```
npx shadcn@latest registry add @knock-codes
npx shadcn@latest add @knock-codes/quick-gate
```

Direct URL:

`npx shadcn@latest add https://knock.codes/r/quick-gate.json`

Requires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.

[Live demo](https://knock.codes/playground/quick-gate) · [Registry JSON](https://knock.codes/r/quick-gate.json) · [Source](https://knock.codes/source/quick-gate.tsx)

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| value | `string` | yes | — | Controlled code value; required. No code is verified here. |
| onChange | `(value: string) => void` | yes | — | Receives code edits; required. |
| onSubmit | `(event: FormEvent<HTMLFormElement>) => void` | yes | — | Consumer submit handler; required. No access decision is made by this block. |
| status | `'idle' \| 'pending' \| 'error' \| 'success'` | yes | — | Controlled visual state; required. Success does not unlock. |
| unlocked | `boolean` | yes | — | Consumer-controlled visibility; required. Takes precedence over notice presentation. |
| children | `ReactNode` | no | — | Content revealed when unlocked. Teaser gate also renders it inert while locked. |
| error | `ReactNode` | no | labels?.fallbackError | Announced error content supplied by the consumer. |
| recipient | `ReactNode` | no | — | Intended recipient name or organization. |
| expiresAt | `string` | no | — | Preview expiry as ISO 8601 with timezone. Presentation only. |
| cooldownUntil | `string` | no | — | Retry deadline as ISO 8601 with timezone. Disables the form visually until elapsed. |
| onRequestAccess | `() => void` | no | — | Callback used when no access URL is supplied. |
| requestAccessHref | `string` | no | — | Native http(s), relative, or mailto destination; takes precedence over callback. |
| logo | `ReactNode` | no | — | Optional brand mark. |
| heading | `ReactNode` | no | 'A quick way in.' | Overrides the default heading. |
| description | `ReactNode` | no | 'Enter your preview code to continue.' | Overrides the default description. |
| labels | `{ submit?: string; pending?: string; success?: string; code?: string; hint?: string; recipient?: string; requestDescription?: string; requestAction?: string; requestUnavailable?: string; draft?: string; draftDescription?: string; build?: string; relock?: string; feedback?: string; navigation?: string; expires?: string; expiryPending?: string; expiryFine?: string; expirySoon?: string; expired?: string; expiryUnavailable?: string; expiryRemaining?: (seconds: number) => string; cooldownHeading?: string; cooldownDescription?: string; cooldownReady?: string; cooldownWaiting?: string; cooldownUnavailable?: string; countdown?: (seconds: number) => string; previewAccess?: string; fallbackError?: string; footer?: string; }` | no | — | Localized text and time formatters for all built-in copy. |
| theme | `'light' \| 'dark'` | no | — | Explicit theme; omitted follows system preference. |
| className | `string` | no | '' | Additional root classes; public --knock-* CSS variables can be set on any parent. |
| mode | `'digits' \| 'passphrase'` | no | 'digits' | Code input presentation. |
| length | `number` | no | 8 | Number of digits. |
| masked | `boolean` | no | false | Native password masking. |
| buildLabel | `string` | no | — | Preview build identifier. |
| onRelock | `() => void` | no | — | Consumer callback that must hide content and end access as appropriate. |
| onFeedback | `() => void` | no | — | Consumer feedback callback. |
| feedbackHref | `string` | no | — | Native feedback destination; takes precedence over callback. |

### Label defaults

- labels.code: `'Your access code'`
- labels.hint: `'Paste it straight from your invitation.'`
- labels.pending: `'Please wait…'`
- labels.success: `'Code received'`
- labels.submit: `'Open the preview'`
- labels.cooldownHeading: `'A little breathing room.'`
- labels.cooldownDescription: `'A few tries didn’t quite match. Take a moment, then try the code from your email again.'`
- labels.cooldownReady: `'Ready when you are. You can try again.'`
- labels.cooldownWaiting: `'Your preview will be right here.'`
- labels.cooldownUnavailable: `'Retry time is unavailable. Please contact the preview owner.'`
- labels.requestDescription: `'Missing your invitation?'`
- labels.requestAction: `'Request access'`
- labels.requestUnavailable: `'Contact the preview owner for a code.'`
- labels.recipient: `'Prepared for'`

## Common mistakes

- `unlocked` is the only visibility decision. A submit that ends in `status="success"` still shows nothing.
- Being the minimal block does not make it less controlled: value, status and unlocked are all yours to hold.

## Related

Installs alongside: code-field, recipient-line, expiry-pill, request-access, cooldown-notice.

## Accessibility

Native forms and controls, polite error and cooldown announcements, visible focus, focus transfer after unlock. This block is a region, not a modal. Locked children are not rendered.

## Agent instructions and anti-hallucination contract

Install and wire Quick gate (QuickGate) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/quick-gate`, or from https://knock.codes/r/quick-gate.json. Read https://knock.codes/docs/quick-gate.md before editing.

Enter your preview code to continue. Does not verify codes, persist state, or grant or revoke access. Contract: all blocks share controlled input and visibility props. The consumer owns unlocked.

Required props: value: string; onChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; status: 'idle' | 'pending' | 'error' | 'success'; unlocked: boolean.
Optional props and defaults:
- children: ReactNode; default omitted
- error: ReactNode; default labels?.fallbackError
- recipient: ReactNode; default omitted
- expiresAt: string; default omitted
- cooldownUntil: string; default omitted
- onRequestAccess: () => void; default omitted
- requestAccessHref: string; default omitted
- logo: ReactNode; default omitted
- heading: ReactNode; default 'A quick way in.'
- description: ReactNode; default 'Enter your preview code to continue.'
- labels: { submit?: string; pending?: string; success?: string; code?: string; hint?: string; recipient?: string; requestDescription?: string; requestAction?: string; requestUnavailable?: string; draft?: string; draftDescription?: string; build?: string; relock?: string; feedback?: string; navigation?: string; expires?: string; expiryPending?: string; expiryFine?: string; expirySoon?: string; expired?: string; expiryUnavailable?: string; expiryRemaining?: (seconds: number) => string; cooldownHeading?: string; cooldownDescription?: string; cooldownReady?: string; cooldownWaiting?: string; cooldownUnavailable?: string; countdown?: (seconds: number) => string; previewAccess?: string; fallbackError?: string; footer?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''
- mode: 'digits' | 'passphrase'; default 'digits'
- length: number; default 8
- masked: boolean; default false
- buildLabel: string; default omitted
- onRelock: () => void; default omitted
- onFeedback: () => void; default omitted
- feedbackHref: string; default omitted

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: Internal, staging or short-lived previews: one field, one action, no ceremony.
Do not use it for: A client-facing first impression. Use Client preview gate, which carries branding, recipient and lifecycle.
Common mistakes:
- `unlocked` is the only visibility decision. A submit that ends in `status="success"` still shows nothing.
- Being the minimal block does not make it less controlled: value, status and unlocked are all yours to hold.

Accessibility: Native forms and controls, polite error and cooldown announcements, visible focus, focus transfer after unlock. This block is a region, not a modal. Locked children are not rendered.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { QuickGate } from '@/components/knock/quick-gate';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Quick gate example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <QuickGate value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></QuickGate>
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { QuickGate } from '@/components/knock/quick-gate';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Quick gate example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <QuickGate value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted; your authorization belongs outside this UI."); }} status="idle" unlocked={unlocked} recipient="Acme Co." expiresAt="2030-01-01T12:00:00Z" logo={<strong>Atelier</strong>} heading="Your private preview" description="A first look at the work." onRequestAccess={() => setMessage("Request access selected")} buildLabel="acme-v1" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ submit: "Open preview", code: "Access code", footer: "A draft, prepared for you." }}><p>Preview content</p></QuickGate>
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
```


## Source

```tsx
/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Enter your preview code to continue.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: all blocks share controlled input and visibility props. The consumer owns unlocked.
 * @version 0.1.0
 * @minimalExample <QuickGate value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></QuickGate>
 * @fullExample <QuickGate value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted; your authorization belongs outside this UI."); }} status="idle" unlocked={unlocked} recipient="Acme Co." expiresAt="2030-01-01T12:00:00Z" logo={<strong>Atelier</strong>} heading="Your private preview" description="A first look at the work." onRequestAccess={() => setMessage("Request access selected")} buildLabel="acme-v1" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ submit: "Open preview", code: "Access code", footer: "A draft, prepared for you." }}><p>Preview content</p></QuickGate>
 * @lifecycle gate
 * @whenToUse Internal, staging or short-lived previews: one field, one action, no ceremony.
 * @notFor A client-facing first impression. Use Client preview gate, which carries branding, recipient and lifecycle.
 * @pitfall `unlocked` is the only visibility decision. A submit that ends in `status="success"` still shows nothing.
 * @pitfall Being the minimal block does not make it less controlled: value, status and unlocked are all yours to hold.
 * @a11y Native forms and controls, polite error and cooldown announcements, visible focus, focus transfer after unlock. This block is a region, not a modal. Locked children are not rendered.
 */
'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CodeField } from '../components/code-field';
import { RecipientLine } from '../components/recipient-line';
import { ExpiryPill } from '../components/expiry-pill';
import { RequestAccess } from '../components/request-access';
import { CooldownNotice } from '../components/cooldown-notice';

export interface QuickGateProps {
  /** Controlled code value; required. No code is verified here. */
  value: string;
  /** Receives code edits; required. */
  onChange: (value: string) => void;
  /** Consumer submit handler; required. No access decision is made by this block. */
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /** Controlled visual state; required. Success does not unlock. */
  status: 'idle' | 'pending' | 'error' | 'success';
  /** Consumer-controlled visibility; required. Takes precedence over notice presentation. */
  unlocked: boolean;
  /** Content revealed when unlocked. Teaser gate also renders it inert while locked. */
  children?: ReactNode;
  /** Announced error content supplied by the consumer. */
  error?: ReactNode;
  /** Intended recipient name or organization. */
  recipient?: ReactNode;
  /** Preview expiry as ISO 8601 with timezone. Presentation only. */
  expiresAt?: string;
  /** Retry deadline as ISO 8601 with timezone. Disables the form visually until elapsed. */
  cooldownUntil?: string;
  /** Callback used when no access URL is supplied. */
  onRequestAccess?: () => void;
  /** Native http(s), relative, or mailto destination; takes precedence over callback. */
  requestAccessHref?: string;
  /** Optional brand mark. */
  logo?: ReactNode;
  /** Overrides the default heading. */
  heading?: ReactNode;
  /** Overrides the default description. */
  description?: ReactNode;
  /** Localized text and time formatters for all built-in copy. */
  labels?: {
    /** Localized submit. */
    submit?: string;

    /** Localized pending. */
    pending?: string;

    /** Localized success. */
    success?: string;

    /** Localized code. */
    code?: string;

    /** Localized hint. */
    hint?: string;
    /** Localized recipient. */
    recipient?: string;

    /** Localized request description. */
    requestDescription?: string;

    /** Localized request action. */
    requestAction?: string;

    /** Localized request unavailable. */
    requestUnavailable?: string;
    /** Localized draft. */
    draft?: string;

    /** Localized draft description. */
    draftDescription?: string;

    /** Localized build. */
    build?: string;

    /** Localized relock. */
    relock?: string;

    /** Localized feedback. */
    feedback?: string;
    /** Localized navigation. */
    navigation?: string;

    /** Localized expires. */
    expires?: string;

    /** Localized expiry pending. */
    expiryPending?: string;

    /** Localized expiry fine. */
    expiryFine?: string;

    /** Localized expiry soon. */
    expirySoon?: string;
    /** Localized expired. */
    expired?: string;

    /** Localized expiry unavailable. */
    expiryUnavailable?: string;

    /** Localized expiry remaining formatter. */
    expiryRemaining?: (seconds: number) => string;
    /** Localized cooldown heading. */
    cooldownHeading?: string;

    /** Localized cooldown description. */
    cooldownDescription?: string;

    /** Localized cooldown ready. */
    cooldownReady?: string;
    /** Localized cooldown waiting. */
    cooldownWaiting?: string;

    /** Localized cooldown unavailable. */
    cooldownUnavailable?: string;

    /** Localized countdown formatter. */
    countdown?: (seconds: number) => string;
    /** Localized preview access. */
    previewAccess?: string;

    /** Localized fallback error. */
    fallbackError?: string;

    /** Localized footer. */
    footer?: string;
  };
  /** Explicit theme; omitted follows system preference. */
  theme?: 'light' | 'dark';
  /** Additional root classes; public --knock-* CSS variables can be set on any parent. */
  className?: string;
  /** Code input presentation. @default "digits" */
  mode?: 'digits' | 'passphrase';
  /** Number of digits. @default 8 */
  length?: number;
  /** Native password masking. @default false */
  masked?: boolean;
  /** Preview build identifier. */
  buildLabel?: string;
  /** Consumer callback that must hide content and end access as appropriate. */
  onRelock?: () => void;
  /** Consumer feedback callback. */
  onFeedback?: () => void;
  /** Native feedback destination; takes precedence over callback. */
  feedbackHref?: string;
}
export function QuickGate({
  value,
  onChange,
  onSubmit,
  status,
  unlocked,
  children,
  error,
  recipient,
  expiresAt,
  cooldownUntil,
  onRequestAccess,
  requestAccessHref,
  logo,
  heading,
  description,
  labels,
  theme,
  className = '',
  mode = 'digits',
  length = 8,
  masked = false,
  buildLabel,
  onRelock,
  onFeedback,
  feedbackHref,
}: QuickGateProps) {
  const id = useId();
  const content = useRef<HTMLDivElement>(null);
  const lockedRegion = useRef<HTMLDivElement>(null);
  const wasUnlocked = useRef(unlocked);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!cooldownUntil) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [cooldownUntil]);
  useEffect(() => {
    if (unlocked && !wasUnlocked.current) content.current?.focus();
    if (!unlocked && !lockedRegion.current?.querySelector('input:not(:disabled)'))
      lockedRegion.current?.focus();
    wasUnlocked.current = unlocked;
  }, [unlocked]);
  const cooling =
    Boolean(cooldownUntil) &&
    (now === null ||
      !Number.isFinite(Date.parse(cooldownUntil!)) ||
      Date.parse(cooldownUntil!) > now);
  const cooldown = cooldownUntil ? (
    <CooldownNotice
      cooldownUntil={cooldownUntil}
      theme={theme}
      labels={{
        heading: labels?.cooldownHeading,
        description: labels?.cooldownDescription,
        ready: labels?.cooldownReady,
        waiting: labels?.cooldownWaiting,
        unavailable: labels?.cooldownUnavailable,
        countdown: labels?.countdown,
      }}
    />
  ) : null;
  const request = (
    <RequestAccess
      onRequestAccess={onRequestAccess}
      requestAccessHref={requestAccessHref}
      theme={theme}
      labels={{
        description: labels?.requestDescription,
        action: labels?.requestAction,
        unavailable: labels?.requestUnavailable,
      }}
    />
  );
  const form = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (status !== 'pending' && !cooling) onSubmit(event);
      }}
      aria-busy={status === 'pending'}
    >
      {cooling ? (
        cooldown
      ) : (
        <CodeField
          value={value}
          onChange={onChange}
          mode={mode}
          length={length}
          masked={masked}
          status={status}
          error={
            error ??
            labels?.fallbackError ??
            'That didn’t quite match. Please check your invitation.'
          }
          label={labels?.code ?? 'Your access code'}
          description={labels?.hint ?? 'Paste it straight from your invitation.'}
          theme={theme}
        />
      )}
      <button type="submit" className="kb-submit" disabled={status === 'pending' || cooling}>
        {status === 'pending'
          ? (labels?.pending ?? 'Please wait…')
          : status === 'success'
            ? (labels?.success ?? 'Code received')
            : (labels?.submit ?? 'Open the preview')}
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
    </form>
  );
  const panel = (
    <div ref={lockedRegion} tabIndex={-1} className="kb-panel" role="region" aria-labelledby={id}>
      {logo && <div className="mb-5">{logo}</div>}
      {recipient && <RecipientLine recipient={recipient} label={labels?.recipient} theme={theme} />}
      <h2 id={id} className="kb-heading">
        {heading ?? 'A quick way in.'}
      </h2>
      <p className="kb-description">{description ?? 'Enter your preview code to continue.'}</p>
      {form}
      {(onRequestAccess || requestAccessHref) && <div className="mt-5">{request}</div>}
      {labels?.footer && <p className="kb-footer">{labels.footer}</p>}
    </div>
  );
  return (
    <div
      data-knock-block="quick-gate"
      data-theme={theme}
      className={`flex w-full justify-center ${className}`}
    >
      <style>{`[data-knock-block]{--kb-bg:#fffefa;--kb-ink:#30382c;--kb-muted:#65705b;--kb-line:#d8dece;--kb-accent:#a3462d;color:var(--knock-ink,var(--kb-ink));color-scheme:light}[data-knock-block][data-theme=dark]{--kb-bg:#293028;--kb-ink:#f0f3e9;--kb-muted:#b6c2ab;--kb-line:#59654f;--kb-accent:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-block]:not([data-theme=light]){--kb-bg:#293028;--kb-ink:#f0f3e9;--kb-muted:#b6c2ab;--kb-line:#59654f;--kb-accent:#f1a187;color-scheme:dark}}[data-knock-block] .kb-panel{background:var(--knock-bg,var(--kb-bg));border:1px solid var(--knock-border,var(--kb-line));border-radius:12px;padding:clamp(22px,5vw,36px);width:100%;max-width:480px;box-shadow:0 12px 30px #28301c0d}[data-knock-block] .kb-heading{font-family:Georgia,serif;font-size:clamp(26px,4vw,34px);font-weight:400;letter-spacing:-.8px;line-height:1.2;margin:16px 0 12px}[data-knock-block] .kb-description{font-size:13px;line-height:1.8;color:var(--knock-muted,var(--kb-muted));margin:0 0 24px}[data-knock-block] .kb-submit{display:flex;align-items:center;justify-content:center;gap:12px;min-height:44px;width:100%;border:1px solid var(--knock-accent,var(--kb-accent));border-radius:7px;background:var(--knock-accent,var(--kb-accent));color:var(--knock-on-accent,#fffefa);font-size:13px;font-weight:500;margin-top:14px}[data-knock-block][data-theme=dark] .kb-submit{color:var(--knock-on-accent,#293028)}@media(prefers-color-scheme:dark){[data-knock-block]:not([data-theme=light]) .kb-submit{color:var(--knock-on-accent,#293028)}}[data-knock-block] :focus-visible{outline:2px solid var(--knock-accent,var(--kb-accent));outline-offset:5px}[data-knock-block] .kb-submit:disabled{opacity:.6;cursor:wait}[data-knock-block] .kb-footer{border-top:1px solid var(--knock-border,var(--kb-line));padding-top:18px;margin-top:24px;font-size:11px;color:var(--knock-muted,var(--kb-muted))}@media(prefers-reduced-motion:reduce){[data-knock-block] *{animation:none!important;transition:none!important}}`}</style>
      {unlocked ? (
        <div ref={content} tabIndex={-1} className="w-full">
          {children}
        </div>
      ) : (
        panel
      )}
    </div>
  );
}

```
