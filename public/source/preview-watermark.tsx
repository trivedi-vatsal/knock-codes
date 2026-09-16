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
