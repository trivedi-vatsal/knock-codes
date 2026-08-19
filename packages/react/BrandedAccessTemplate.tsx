// Branded Access Template v1.0.0
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import { PinInput } from "./PinInput.tsx";
import { DEFAULT_LABELS, type KnockCodesConfig, type KnockCodesLabels } from "./types.ts";
import { cx } from "./cx.ts";

// Shakes the form column on a failed attempt — inlined via a plain
// `<style>` tag (not a Tailwind config keyframe) so this file works
// standalone in a host project that has no matching keyframe of its own.
// Wrapped in the reduced-motion query rather than toggled from JS: under
// `prefers-reduced-motion: reduce` this keyframe name simply doesn't exist,
// so the `animation: branded-access-shake …` utility below resolves to no
// visual effect.
const BRANDED_ACCESS_SHAKE_KEYFRAMES = `@media (prefers-reduced-motion: no-preference) {
  @keyframes branded-access-shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-4px); }
    40%, 60% { transform: translateX(4px); }
  }
}`;

export interface BrandedAccessTemplateLabels extends KnockCodesLabels {
  description?: string;
  supportLabel?: string;
  footerText?: ReactNode;
}

export interface BrandedAccessTemplateProps extends KnockCodesConfig {
  children: ReactNode;
  /** Rendered on the brand panel, above the tagline — your own logo/wordmark. */
  logo?: ReactNode;
  /** Short line under the logo on the brand panel. */
  tagline?: ReactNode;
  labels?: BrandedAccessTemplateLabels;
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

const TEMPLATE_LABELS: Required<BrandedAccessTemplateLabels> = {
  ...DEFAULT_LABELS,
  heading: "Welcome back",
  description: "Enter your access code to continue to your workspace.",
  submitLabel: "Continue",
  supportLabel: "Contact support",
  footerText: "Don't have a code? Contact your administrator or support team for assistance.",
};

function SuccessPanel({ theme }: { theme?: "light" | "dark" }) {
  const panel = (
    <div className="flex h-full min-h-[26rem] w-full items-center justify-center bg-[var(--ag-card,#ffffff)] p-6 dark:bg-[var(--ag-card-dark,#030712)]">
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

/**
 * A split-screen, logo-forward access screen — brand panel on
 * one side, code entry on the other. The brand panel collapses on small
 * screens so the form stays the only thing visible on mobile. Same
 * `useKnockCodes` contract as every other block.
 */
export function BrandedAccessTemplate({
  children,
  logo,
  tagline,
  labels,
  supportHref,
  onContactSupport,
  fullPage = true,
  theme,
  remember,
  autoFocus = true,
  className,
  ...config
}: BrandedAccessTemplateProps) {
  const merged = { ...TEMPLATE_LABELS, ...labels };
  const { state, error, submit, ready } = useKnockCodes({
    ...config,
    storage: remember === "session" ? "sessionStorage" : config.storage,
  });
  const [code, setCode] = useState("");
  const [shakeSeed, setShakeSeed] = useState(0);
  const [showChildren, setShowChildren] = useState(false);

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

  if (!ready) return null;

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

  const content = (
    <div className={cx("grid w-full lg:grid-cols-2", fullPage ? "min-h-[100dvh]" : "h-full", className)}>
      <div className="hidden flex-col justify-center bg-gradient-to-br from-[var(--ag-primary,#2563eb)] to-[var(--ag-accent,#3730a3)] p-12 text-white lg:flex">
        {logo && <div className="mb-6">{logo}</div>}
        {tagline && <p className="max-w-sm text-lg text-white/80">{tagline}</p>}
      </div>

      <div className="flex items-center justify-center bg-[var(--ag-card,#ffffff)] p-6 dark:bg-[var(--ag-card-dark,#030712)] lg:p-12">
        <div
          key={shakeSeed}
          style={{ fontFamily: "var(--ag-font, inherit)" }}
          className={cx("w-full max-w-sm", shakeSeed > 0 && "animate-[branded-access-shake_0.4s_ease-in-out]")}
        >
          <style>{BRANDED_ACCESS_SHAKE_KEYFRAMES}</style>
          {logo && <div className="mb-6 lg:hidden">{logo}</div>}

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{merged.heading}</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{merged.description}</p>

          <div className="mt-6">
            <PinInput
              value={code}
              onChange={setCode}
              onSubmit={() => void handleSubmit()}
              submitting={state === "submitting"}
              error={error}
              labels={labels}
              autoFocus={autoFocus}
            />
          </div>

          {(supportHref || onContactSupport) && (
            <div className="mt-3 text-center">
              {onContactSupport ? (
                <button type="button" onClick={onContactSupport} className="text-sm font-medium text-[var(--ag-primary,#2563eb)] hover:underline dark:text-[var(--ag-primary-dark,#60a5fa)]">
                  {merged.supportLabel}
                </button>
              ) : (
                <a href={supportHref} className="text-sm font-medium text-[var(--ag-primary,#2563eb)] hover:underline dark:text-[var(--ag-primary-dark,#60a5fa)]">
                  {merged.supportLabel}
                </a>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">{merged.footerText}</p>
        </div>
      </div>
    </div>
  );

  return theme === "dark" ? <div className="dark h-full w-full">{content}</div> : content;
}
