/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Displays controlled demo-code entry, normalizing pasted message artifacts.
 * Does not verify codes, unlock content, store values, or make network requests.
 * Contract: value and onChange are required; the consumer owns all state.
 * @version 0.2.1
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
  const slots = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const [focused, setFocused] = useState(false);
  const count = Math.max(1, Math.min(16, Math.floor(length) || 8));
  const placeCaret = (field: HTMLInputElement, index: number) => {
    const caret = Math.max(0, Math.min(index, value.length, count));
    field.setSelectionRange(caret, caret);
    setPosition(caret);
  };
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
      [data-knock-code] .kc-native.absolute:focus-visible{outline:none}
      [data-knock-code] .kc-slot{background:var(--knock-bg,var(--kc-bg));border:1px solid var(--knock-border,var(--kc-border))}
      [data-knock-code] .kc-slot[data-active=true]{border-color:var(--knock-accent,var(--kc-accent));box-shadow:0 0 0 3px color-mix(in srgb,var(--knock-accent,var(--kc-accent)) 12%,transparent)}
      [data-knock-code][data-error=true] .kc-slot{border-color:var(--knock-error,var(--kc-error))}
    `}</style>
      <label htmlFor={id} className="mb-3 block text-[13px] font-medium">
        {label}
      </label>
      <div className="relative" data-error={status === 'error' || undefined}>
        {mode === 'digits' && (
          <div ref={slots} aria-hidden="true" className="flex gap-1.5 sm:gap-2">
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                data-active={focused && i === Math.min(position, count - 1)}
                className="kc-slot flex h-14 min-w-0 flex-1 items-center justify-center rounded-lg font-mono text-xl"
                style={{
                  marginLeft: count >= 4 && count % 2 === 0 && i === count / 2 ? 8 : 0,
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
          onFocus={(e) => {
            setFocused(true);
            if (
              mode === 'digits' &&
              e.currentTarget.selectionStart !== e.currentTarget.selectionEnd
            )
              placeCaret(e.currentTarget, e.currentTarget.value.length);
          }}
          onBlur={() => setFocused(false)}
          onPointerDown={(e) => {
            if (mode !== 'digits' || e.button !== 0) return;
            e.preventDefault();
            const field = e.currentTarget;
            field.focus();
            const boxes = slots.current?.children;
            if (!boxes?.length) return;
            const index = Array.from(boxes).findIndex(
              (box) => e.clientX <= box.getBoundingClientRect().right,
            );
            placeCaret(field, index < 0 ? count : index);
          }}
          onSelect={(e) => {
            if (e.currentTarget.selectionStart === e.currentTarget.selectionEnd)
              setPosition(e.currentTarget.selectionStart ?? 0);
          }}
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
