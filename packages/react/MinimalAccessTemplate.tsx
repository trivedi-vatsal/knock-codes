// Minimal Access Template v1.0.0
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import { DEFAULT_LABELS, type KnockCodesConfig, type KnockCodesLabels } from "./types.ts";
import { cx } from "./cx.ts";

// Shakes the card on a failed attempt — inlined via a plain `<style>` tag
// (not a Tailwind config keyframe) so this file works standalone in a host
// project that has no matching keyframe of its own.
// Wrapped in the reduced-motion query rather than toggled from JS: under
// `prefers-reduced-motion: reduce` this keyframe name simply doesn't exist,
// so the `animation: minimal-access-shake …` utility below resolves to no
// visual effect.
const MINIMAL_ACCESS_SHAKE_KEYFRAMES = `@media (prefers-reduced-motion: no-preference) {
  @keyframes minimal-access-shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-4px); }
    40%, 60% { transform: translateX(4px); }
  }
}`;

export interface MinimalAccessTemplateLabels extends KnockCodesLabels {
  description?: string;
  supportLabel?: string;
  footerText?: ReactNode;
}

export interface MinimalAccessTemplateProps extends KnockCodesConfig {
  children: ReactNode;
  /** Rendered above the heading — your own logo/wordmark. Omitted entirely if not passed. */
  logo?: ReactNode;
  labels?: MinimalAccessTemplateLabels;
  /** Renders "Contact support" as a link. Ignored if `onContactSupport` is also set. */
  supportHref?: string;
  /** Renders "Contact support" as a button instead of a link. */
  onContactSupport?: () => void;
  /** Set false to embed this somewhere other than a real page root. @default true */
  fullPage?: boolean;
  /** Forces light or dark presentation, independent of any ancestor ".dark" class. Omit to follow one if it exists. */
  theme?: "light" | "dark";
  /**
   * Persist the unlocked session across reloads within the same tab via
   * sessionStorage. Not a security boundary — clearable from DevTools or a
   * private window, same as any other client-side storage. @default undefined (off)
   */
  remember?: "session";
  autoFocus?: boolean;
  className?: string;
}

const TEMPLATE_LABELS: Required<MinimalAccessTemplateLabels> = {
  ...DEFAULT_LABELS,
  heading: "Enter access code",
  description: "This page is private.",
  supportLabel: "Contact support",
  footerText: "",
};

/**
 * The leanest possible restricted-access screen — a single masked field, a
 * small plain card, no segmented boxes and no default footer copy. Same
 * `useKnockCodes` contract as every other block, just the smallest possible
 * presentation. For segmented code entry, use `<KnockCodesTemplate>` instead.
 */
export function MinimalAccessTemplate({
  children,
  logo,
  labels,
  supportHref,
  onContactSupport,
  fullPage = true,
  theme,
  remember,
  autoFocus = true,
  className,
  ...config
}: MinimalAccessTemplateProps) {
  const merged = { ...TEMPLATE_LABELS, ...labels };
  const { state, error, submit } = useKnockCodes({
    ...config,
    storage: remember === "session" ? "sessionStorage" : config.storage,
  });
  const [code, setCode] = useState("");
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [shakeSeed, setShakeSeed] = useState(0);
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    if (state === "idle" && error) inputRef.current?.focus();
  }, [error, state]);

  useEffect(() => {
    if (error) setShakeSeed((seed) => seed + 1);
  }, [error]);

  // Holds the unlock screen visible for a beat so success has a visible
  // transition instead of an instant swap to `children`.
  useEffect(() => {
    if (state !== "unlocked") {
      setShowChildren(false);
      return;
    }
    const timer = setTimeout(() => setShowChildren(true), 550);
    return () => clearTimeout(timer);
  }, [state]);

function SuccessPanel({ theme }: { theme?: "light" | "dark" }) {
  const panel = (
    <div className="flex h-full min-h-[26rem] w-full items-center justify-center bg-[var(--ag-canvas-bg,#f9fafb)] p-6 dark:bg-[var(--ag-canvas-bg-dark,#0b1220)]">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Access granted</p>
      </div>
    </div>
  );
  return theme === "dark" ? <div className="dark h-full w-full">{panel}</div> : panel;
}

  if (state === "unlocked") {
    if (!showChildren) {
      return <SuccessPanel theme={theme} />;
    }
    return <>{children}</>;
  }

  const handleSubmit = async () => {
    if (!code || state === "submitting") return;
    await submit(code);
    setCode("");
  };

  const errorMessage = error ? (error.reason === "network" ? merged.networkErrorMessage : merged.invalidErrorMessage) : null;

  const content = (
    <div
      className={cx(
        "flex w-full items-center justify-center bg-[var(--ag-canvas-bg,#f9fafb)] p-6 dark:bg-[var(--ag-canvas-bg-dark,#0b1220)]",
        fullPage ? "min-h-[100dvh]" : "h-full",
        className
      )}
    >
      <div
        key={shakeSeed}
        style={{ fontFamily: "var(--ag-font, inherit)" }}
        className={cx(
          "w-full max-w-sm rounded-[var(--ag-radius,0.75rem)] border border-[var(--ag-border,#e5e7eb)] bg-[var(--ag-card,#ffffff)] p-7 dark:border-[var(--ag-border-dark,#1f2937)] dark:bg-[var(--ag-card-dark,#030712)]",
          shakeSeed > 0 && "animate-[minimal-access-shake_0.4s_ease-in-out]"
        )}
      >
        <style>{MINIMAL_ACCESS_SHAKE_KEYFRAMES}</style>
        {logo && <div className="mb-5">{logo}</div>}

        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{merged.heading}</h1>
        {merged.description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{merged.description}</p>}

        <div className="mt-5">
          <label htmlFor="minimal-access-code" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
            {merged.inputLabel}
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="minimal-access-code"
              type={revealed ? "text" : "password"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={merged.placeholder}
              autoComplete="off"
              autoFocus={autoFocus}
              disabled={state === "submitting"}
              aria-invalid={error ? true : undefined}
              className="h-10 w-full rounded-[var(--ag-radius,0.5rem)] border border-[var(--ag-border,#d1d5db)] px-3 pr-16 text-sm text-gray-900 focus:border-[var(--ag-primary,#3b82f6)] focus:ring-2 focus:ring-[var(--ag-primary,#3b82f6)]/30 focus:outline-none disabled:opacity-60 dark:border-[var(--ag-border-dark,#374151)] dark:bg-[var(--ag-card-dark,#111827)] dark:text-gray-50"
            />
            <button
              type="button"
              onClick={() => setRevealed((r) => !r)}
              aria-label={revealed ? merged.hideCodeLabel : merged.showCodeLabel}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {revealed ? merged.hideCodeLabel : merged.showCodeLabel}
            </button>
          </div>
          <div role="status" aria-live="polite" className="mt-2 min-h-[1.1rem] text-xs text-red-600 dark:text-red-400">
            {state === "submitting" ? merged.submittingLabel : (errorMessage ?? "")}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!code || state === "submitting"}
          className="mt-3 w-full rounded-[var(--ag-radius,0.5rem)] bg-[var(--ag-primary,#111827)] px-4 py-2.5 text-sm font-semibold text-[var(--ag-primary-fg,#ffffff)] transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[var(--ag-primary-dark,#f9fafb)] dark:text-[var(--ag-primary-fg-dark,#111827)]"
        >
          {state === "submitting" ? merged.submittingLabel : merged.submitLabel}
        </button>

        {(supportHref || onContactSupport) && (
          <div className="mt-3 text-center">
            {onContactSupport ? (
              <button type="button" onClick={onContactSupport} className="text-xs font-medium text-gray-500 hover:underline dark:text-gray-400">
                {merged.supportLabel}
              </button>
            ) : (
              <a href={supportHref} className="text-xs font-medium text-gray-500 hover:underline dark:text-gray-400">
                {merged.supportLabel}
              </a>
            )}
          </div>
        )}

        {merged.footerText && <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">{merged.footerText}</p>}
      </div>
    </div>
  );

  return theme === "dark" ? <div className="dark h-full w-full">{content}</div> : content;
}
