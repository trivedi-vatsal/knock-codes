# Code field

Version 0.2.0 · components · gate

Displays controlled demo-code entry, normalizing pasted message artifacts. Does not verify codes, unlock content, store values, or make network requests. Contract: value and onChange are required; the consumer owns all state.

## When to use

You are building your own gate layout and need only the entry field, with codes pasted out of an email tidied on the way in.

## Not for

A complete gate screen. Use the Quick gate or Client preview gate block, which already compose this field with a heading, a submit action and lifecycle notices.

## Install

`npx shadcn@latest add https://knock.codes/r/code-field.json`

Requires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.

[Live demo](https://knock.codes/playground/code-field) · [Registry JSON](https://knock.codes/r/code-field.json) · [Source](https://knock.codes/source/code-field.tsx)

## Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| value | `string` | yes | — | Current code; required. Never interpreted as authorization. |
| onChange | `(value: string) => void` | yes | — | Receives the normalized value; required. |
| mode | `'digits' \| 'passphrase'` | no | 'digits' | Input presentation. |
| length | `number` | no | 8 | Maximum digit count, from 1 to 16. Ignored for passphrases. |
| masked | `boolean` | no | false | Uses a native password input and masked segments. |
| status | `'idle' \| 'pending' \| 'error' \| 'success'` | no | 'idle' | Visual state only; pending disables editing. |
| error | `ReactNode` | no | — | Announced error text supplied by the consumer. |
| label | `string` | no | 'Access code' | Visible and accessible field name. |
| description | `ReactNode` | no | — | Optional hint connected to the input. |
| placeholder | `string` | no | — | Optional passphrase placeholder. |
| autoFocus | `boolean` | no | true | Focus after mount. |
| name | `string` | no | 'code' | Native form field name. |
| theme | `'light' \| 'dark'` | no | — | Explicit theme; omitted follows system preference. |
| className | `string` | no | '' | Additional wrapper classes. |

### Label defaults

See individual label/description props.

## Common mistakes

- `length` is a display and autofill hint, not validation. The field never rejects input and never reports whether a code is correct.
- `status="success"` only styles the field. Revealing content is your own `unlocked` state, decided after your own server check.
- `autoFocus` moves focus on mount. Leave it off when the field sits below other content or inside a long page.

## Related

Used by: client-preview-gate, gated-section, preview-chrome, quick-gate, teaser-gate.

## Accessibility

Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

## Agent instructions and anti-hallucination contract

Install and wire Code field (CodeField) from https://knock.codes/r/code-field.json in a React + Tailwind project. Read https://knock.codes/docs/code-field.md before editing.

Displays controlled demo-code entry, normalizing pasted message artifacts. Does not verify codes, unlock content, store values, or make network requests. Contract: value and onChange are required; the consumer owns all state.

Required props: value: string; onChange: (value: string) => void.
Optional props and defaults:
- mode: 'digits' | 'passphrase'; default 'digits'
- length: number; default 8
- masked: boolean; default false
- status: 'idle' | 'pending' | 'error' | 'success'; default 'idle'
- error: ReactNode; default omitted
- label: string; default 'Access code'
- description: ReactNode; default omitted
- placeholder: string; default omitted
- autoFocus: boolean; default true
- name: string; default 'code'
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: You are building your own gate layout and need only the entry field, with codes pasted out of an email tidied on the way in.
Do not use it for: A complete gate screen. Use the Quick gate or Client preview gate block, which already compose this field with a heading, a submit action and lifecycle notices.
Common mistakes:
- `length` is a display and autofill hint, not validation. The field never rejects input and never reports whether a code is correct.
- `status="success"` only styles the field. Revealing content is your own `unlocked` state, decided after your own server check.
- `autoFocus` moves focus on mount. Leave it off when the field sits below other content or inside a long page.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { CodeField } from '@/components/knock/code-field';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Code field example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CodeField value={value} onChange={setValue} />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { CodeField } from '@/components/knock/code-field';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Code field example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CodeField value={value} onChange={setValue} mode="digits" length={8} masked status="error" error="Check your invitation code." label="Your code" description="Paste from your invitation." autoFocus name="preview-code" theme="light" className="max-w-sm" />
    <p role="status">{message}</p>
  </section>;
}
```


## Source

```tsx
/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Displays controlled demo-code entry, normalizing pasted message artifacts.
 * Does not verify codes, unlock content, store values, or make network requests.
 * Contract: value and onChange are required; the consumer owns all state.
 * @version 0.2.0
 * @minimalExample <CodeField value={value} onChange={setValue} />
 * @fullExample <CodeField value={value} onChange={setValue} mode="digits" length={8} masked status="error" error="Check your invitation code." label="Your code" description="Paste from your invitation." autoFocus name="preview-code" theme="light" className="max-w-sm" />
 * @lifecycle gate
 * @whenToUse You are building your own gate layout and need only the entry field, with codes pasted out of an email tidied on the way in.
 * @notFor A complete gate screen. Use the Quick gate or Client preview gate block, which already compose this field with a heading, a submit action and lifecycle notices.
 * @pitfall `length` is a display and autofill hint, not validation. The field never rejects input and never reports whether a code is correct.
 * @pitfall `status="success"` only styles the field. Revealing content is your own `unlocked` state, decided after your own server check.
 * @pitfall `autoFocus` moves focus on mount. Leave it off when the field sits below other content or inside a long page.
 * @a11y Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.
 */
'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

export interface CodeFieldProps {
  /** Current code; required. Never interpreted as authorization. */
  value: string;
  /** Receives the normalized value; required. */
  onChange: (value: string) => void;
  /** Input presentation. @default "digits" */
  mode?: 'digits' | 'passphrase';
  /** Maximum digit count, from 1 to 16. Ignored for passphrases. @default 8 */
  length?: number;
  /** Uses a native password input and masked segments. @default false */
  masked?: boolean;
  /** Visual state only; pending disables editing. @default "idle" */
  status?: 'idle' | 'pending' | 'error' | 'success';
  /** Announced error text supplied by the consumer. */
  error?: ReactNode;
  /** Visible and accessible field name. @default "Access code" */
  label?: string;
  /** Optional hint connected to the input. */
  description?: ReactNode;
  /** Optional passphrase placeholder. */
  placeholder?: string;
  /** Focus after mount. @default true */
  autoFocus?: boolean;
  /** Native form field name. @default "code" */
  name?: string;
  /** Explicit theme; omitted follows system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}

/** Removes message wrappers, invisible formatting and digit separators. */
export function normalizeCode(
  value: string,
  mode: 'digits' | 'passphrase' = 'digits',
  length = 8,
): string {
  let clean = value
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
    .trim()
    .replace(/^(?:access\s+code|code|passphrase)\s*:\s*/i, '');
  if (/^["“‘'].*["”’']$/s.test(clean)) clean = clean.slice(1, -1).trim();
  return mode === 'digits'
    ? clean.replace(/[^0-9]/g, '').slice(0, Math.max(1, Math.min(16, Math.floor(length) || 8)))
    : clean;
}

export function CodeField({
  value,
  onChange,
  mode = 'digits',
  length = 8,
  masked = false,
  status = 'idle',
  error,
  label = 'Access code',
  description,
  placeholder,
  autoFocus = true,
  name = 'code',
  theme,
  className = '',
}: CodeFieldProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState(0);
  const [focused, setFocused] = useState(false);
  const count = Math.max(1, Math.min(16, Math.floor(length) || 8));
  useEffect(() => {
    if (autoFocus) input.current?.focus();
  }, [autoFocus]);
  return (
    <div data-knock-code="" data-theme={theme} className={`w-full ${className}`}>
      <style>{`
      [data-knock-code]{--kc-bg:#fffefa;--kc-ink:#292b27;--kc-muted:#666960;--kc-border:#d4d5cc;--kc-accent:#a3462d;--kc-error:#a42c28;color:var(--knock-ink,var(--kc-ink));color-scheme:light}
      [data-knock-code][data-theme=dark]{--kc-bg:#272a27;--kc-ink:#f4f2eb;--kc-muted:#b3b7ac;--kc-border:#60665d;--kc-accent:#f1a187;--kc-error:#ffa69e;color-scheme:dark}
      @media(prefers-color-scheme:dark){[data-knock-code]:not([data-theme=light]){--kc-bg:#272a27;--kc-ink:#f4f2eb;--kc-muted:#b3b7ac;--kc-border:#60665d;--kc-accent:#f1a187;--kc-error:#ffa69e;color-scheme:dark}}
      [data-knock-code] .kc-native:focus-visible{outline:2px solid var(--knock-accent,var(--kc-accent));outline-offset:5px}
      [data-knock-code] .kc-slot{background:var(--knock-bg,var(--kc-bg));border:1px solid var(--knock-border,var(--kc-border))}
      [data-knock-code] .kc-slot[data-active=true]{border-color:var(--knock-accent,var(--kc-accent));box-shadow:0 0 0 3px color-mix(in srgb,var(--knock-accent,var(--kc-accent)) 12%,transparent)}
      [data-knock-code][data-error=true] .kc-slot{border-color:var(--knock-error,var(--kc-error))}
    `}</style>
      <label htmlFor={id} className="mb-3 block text-[13px] font-medium">
        {label}
      </label>
      <div className="relative" data-error={status === 'error' || undefined}>
        {mode === 'digits' && (
          <div aria-hidden="true" className="flex gap-1.5 sm:gap-2">
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                data-active={focused && i === Math.min(position, count - 1)}
                className="kc-slot flex h-14 min-w-0 flex-1 items-center justify-center rounded-lg font-mono text-xl"
                style={{
                  marginLeft: count === 8 && i === 4 ? 8 : 0,
                  borderColor:
                    status === 'error' ? 'var(--knock-error,var(--kc-error))' : undefined,
                }}
              >
                {value[i] ? (
                  masked ? (
                    '•'
                  ) : (
                    value[i]
                  )
                ) : (
                  <span className="h-1 w-1 rounded-full bg-[var(--knock-border,var(--kc-border))]" />
                )}
              </span>
            ))}
          </div>
        )}
        <input
          ref={input}
          id={id}
          name={name}
          type={masked ? 'password' : 'text'}
          value={value}
          placeholder={placeholder}
          autoComplete="one-time-code"
          inputMode={mode === 'digits' ? 'numeric' : 'text'}
          spellCheck={false}
          autoCapitalize="none"
          disabled={status === 'pending'}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={
            [description ? `${id}-hint` : '', error ? `${id}-error` : '']
              .filter(Boolean)
              .join(' ') || undefined
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSelect={(e) => setPosition(e.currentTarget.selectionStart ?? 0)}
          onChange={(e) =>
            onChange(
              mode === 'digits' ? normalizeCode(e.target.value, mode, count) : e.target.value,
            )
          }
          onPaste={(e) => {
            e.preventDefault();
            const field = e.currentTarget;
            const pasted = normalizeCode(e.clipboardData.getData('text'), mode, count);
            const start = field.selectionStart ?? value.length;
            const end = field.selectionEnd ?? start;
            const next =
              mode === 'digits' && pasted.length >= count
                ? pasted
                : value.slice(0, start) + pasted + value.slice(end);
            onChange(mode === 'digits' ? next.slice(0, count) : next);
            const caret =
              mode === 'digits' && pasted.length >= count
                ? count
                : Math.min(start + pasted.length, mode === 'digits' ? count : next.length);
            requestAnimationFrame(() => {
              field.setSelectionRange(caret, caret);
              setPosition(caret);
            });
          }}
          className={
            mode === 'digits'
              ? 'kc-native absolute inset-0 h-full w-full rounded-lg border-0 bg-transparent text-transparent caret-transparent selection:bg-transparent disabled:cursor-wait'
              : 'kc-native h-14 w-full rounded-lg border border-[var(--knock-border,var(--kc-border))] bg-[var(--knock-bg,var(--kc-bg))] px-4 text-base text-[var(--knock-ink,var(--kc-ink))] disabled:cursor-wait'
          }
        />
      </div>
      {description && (
        <div id={`${id}-hint`} className="mt-3 text-xs text-[var(--knock-muted,var(--kc-muted))]">
          {description}
        </div>
      )}
      <div
        id={`${id}-error`}
        role="status"
        aria-live="polite"
        className="mt-2 text-xs text-[var(--knock-error,var(--kc-error))]"
      >
        {status === 'error' ? error : null}
      </div>
    </div>
  );
}

```
