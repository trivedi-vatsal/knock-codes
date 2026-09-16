/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Shows an inert blurred teaser beneath a prompt; blur is presentation, not security.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: the consumer owns lifecycle timestamps and action callbacks.
 * @version 0.2.0
 * @minimalExample <BlurVeil unlocked={unlocked} prompt={<button onClick={() => setUnlocked(true)}>Reveal demo</button>}><p>Demo content</p></BlurVeil>
 * @fullExample <BlurVeil unlocked={unlocked} blur={8} label="Preview invitation" theme="light" prompt={<button onClick={() => setUnlocked(true)}>Reveal demo</button>}><button onClick={() => setMessage("Preview action")}>Explore preview</button></BlurVeil>
 * @lifecycle gate
 * @whenToUse A glimpse of the work should sit behind the invitation, so entering a code feels worth the effort.
 * @notFor Protecting anything. The children stay in the DOM and travel to the browser; blur is a visual effect, not a boundary.
 * @pitfall Never pass genuinely protected content as children while locked. Pass a representative sample, and render the real preview only once `unlocked` is true.
 * @pitfall Locked children are inert and skipped by the keyboard. That is presentation, not authorization.
 * @a11y Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.
 */
'use client';

import { useEffect, useRef, version, type ReactNode } from 'react';
export interface BlurVeilProps {
  /** Consumer-controlled access state; required. True removes the veil. */
  unlocked: boolean;
  /** Preview content; required. Locked content remains in the DOM and is not secure. */
  children: ReactNode;
  /** Prompt rendered above the inert preview while locked; required. */
  prompt: ReactNode;
  /** Blur radius in pixels, clamped to 0–30. @default 8 */
  blur?: number;
  /** Accessible label for the prompt region. @default "Preview access" */
  label?: string;

  /** Explicit theme; omitted follows the system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}
export function BlurVeil({
  unlocked,
  children,
  prompt,
  blur = 8,
  label = 'Preview access',
  theme,
  className = '',
}: BlurVeilProps) {
  const content = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const wasUnlocked = useRef(unlocked);
  useEffect(() => {
    if (!unlocked) overlay.current?.focus();
    else if (!wasUnlocked.current) content.current?.focus();
    wasUnlocked.current = unlocked;
  }, [unlocked]);
  // React 18 serializes inert as a string; React 19 treats it as a boolean.
  const inertProps = { inert: unlocked ? undefined : version.startsWith('18.') ? '' : true } as {
    inert?: boolean;
  };
  return (
    <div data-knock-item="veil" data-theme={theme} className={`relative isolate ${className}`}>
      <style>{`[data-knock-item]{--knock-surface:#fffefa;--knock-text:#30382c;--knock-secondary:#65705b;--knock-line:#d8dece;--knock-highlight:#a3462d;color:var(--knock-ink,var(--knock-text));color-scheme:light}[data-knock-item][data-theme=dark]{--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-item]:not([data-theme=light]){--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}}[data-knock-item] a:focus-visible,[data-knock-item] button:focus-visible,[data-knock-item] [tabindex]:focus-visible{outline:2px solid var(--knock-accent,var(--knock-highlight));outline-offset:4px}[data-knock-item] button,[data-knock-item] a{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){[data-knock-item] *{animation:none!important;transition:none!important}}`}</style>
      <div
        ref={content}
        tabIndex={-1}
        {...inertProps}
        aria-hidden={!unlocked || undefined}
        className="rounded-lg"
        style={{
          filter: unlocked
            ? undefined
            : `blur(${Math.max(0, Math.min(30, Number.isFinite(blur) ? blur : 8))}px)`,
          pointerEvents: unlocked ? undefined : 'none',
          userSelect: unlocked ? undefined : 'none',
        }}
      >
        {children}
      </div>
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center overflow-auto rounded-lg bg-[var(--knock-bg,var(--knock-surface))]/40 p-5">
          <div
            ref={overlay}
            tabIndex={-1}
            role="region"
            aria-label={label}
            className="max-h-full w-full max-w-sm rounded-xl border border-[var(--knock-border,var(--knock-line))] bg-[var(--knock-bg,var(--knock-surface))] p-6 shadow-lg"
          >
            {prompt}
          </div>
        </div>
      )}
    </div>
  );
}
