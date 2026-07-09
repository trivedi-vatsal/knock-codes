// Knock Codes Template v1.0.0
"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ClipboardEvent, type ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import { DEFAULT_LABELS, type KnockCodesConfig, type KnockCodesLabels } from "./types.ts";
import { cx } from "./cx.ts";

// Shake on a failed attempt, fade+slide on unlock — inlined via a plain
// `<style>` tag (not a Tailwind config keyframe) so this file works
// standalone in a host project that has no matching keyframe of its own.
// Both keyframes are wrapped in the reduced-motion media query rather than
// toggled from JS: under `prefers-reduced-motion: reduce`, the referenced
// keyframe names simply don't exist, so `animation: knock-codes-shake …`
// resolves to no visual effect — no separate JS branch to keep in sync.
const KNOCK_CODES_MOTION_KEYFRAMES = `@media (prefers-reduced-motion: no-preference) {
  @keyframes knock-codes-shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-4px); }
    40%, 60% { transform: translateX(4px); }
  }
  @keyframes knock-codes-reveal {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
}`;

export interface KnockCodesTemplateLabels extends KnockCodesLabels {
  description?: string;
  accessCodeLabel?: string;
  supportLabel?: string;
  footerText?: ReactNode;
}

export interface KnockCodesTemplateProps extends KnockCodesConfig {
  children: ReactNode;
  /** Rendered above the heading — your own logo/wordmark. Omitted entirely if not passed. */
  logo?: ReactNode;
  labels?: KnockCodesTemplateLabels;
  /** Total code length, split into groups of `groupSize` with a dash between. @default 8 */
  codeLength?: number;
  /** @default 4 */
  groupSize?: number;
  /** Renders "Contact Support" as a link. Ignored if `onContactSupport` is also set. */
  supportHref?: string;
  /** Renders "Contact Support" as a button instead of a link. */
  onContactSupport?: () => void;
  /** Set false to embed this somewhere other than a real page root (a demo, a docs preview) — drops the full-viewport (100dvh) sizing. @default true */
  fullPage?: boolean;
  /**
   * Forces light or dark presentation on its own, independent of any
   * ancestor ".dark" class — this is a single, standalone file, and
   * shouldn't need the host app to already have dark-mode wiring (e.g.
   * next-themes) in place just to show its dark variant. Omit to follow
   * the nearest ".dark" ancestor if one happens to exist.
   */
  theme?: "light" | "dark";
  /**
   * Persist the unlocked session across reloads within the same tab via
   * sessionStorage. Not a security boundary — clearable from DevTools or a
   * private window, same as any other client-side storage. @default undefined (off)
   */
  remember?: "session";
  className?: string;
}

const TEMPLATE_LABELS: Required<KnockCodesTemplateLabels> = {
  ...DEFAULT_LABELS,
  heading: "Restricted Access",
  submitLabel: "Unlock Access",
  description: "This feature is currently protected. Enter your access code to continue.",
  accessCodeLabel: "Access code",
  supportLabel: "Contact Support",
  footerText: "Don't have an access code? Contact your administrator or support team for assistance.",
};

/**
 * A complete, single-drop-in "restricted access" screen — full-page dark
 * backdrop, centered card, segmented code entry, support link, and footer
 * help text, all in one file. Built on the same `useKnockCodes`
 * session/verification contract as every other block, just with a
 * different presentation (segmented boxes instead of a masked text field —
 * for that, use `<KnockCodes>` + `<PinInput>` instead).
 */
export function KnockCodesTemplate({
  children,
  logo,
  labels,
  codeLength = 8,
  groupSize = 4,
  supportHref,
  onContactSupport,
  fullPage = true,
  theme,
  remember,
  className,
  ...config
}: KnockCodesTemplateProps) {
  const merged = { ...TEMPLATE_LABELS, ...labels };
  const { state, error, submit } = useKnockCodes({
    ...config,
    storage: remember === "session" ? "sessionStorage" : config.storage,
  });
  const [digits, setDigits] = useState<string[]>(() => Array(codeLength).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [shakeSeed, setShakeSeed] = useState(0);
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    if (state === "idle" && error) inputRefs.current[0]?.focus();
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

  if (state === "unlocked") {
    if (!showChildren) {
      const successPanel = (
        <div className="flex h-full min-h-[26rem] w-full items-center justify-center bg-[var(--ag-canvas-bg,#e5e7eb)] p-6 dark:bg-[var(--ag-canvas-bg-dark,#0b1220)]">
          <style>{KNOCK_CODES_MOTION_KEYFRAMES}</style>
          <div className="flex flex-col items-center gap-2 text-center animate-[knock-codes-reveal_0.3s_ease-out]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Access granted</p>
          </div>
        </div>
      );
      return theme === "dark" ? <div className="dark h-full w-full">{successPanel}</div> : successPanel;
    }
    return (
      <div className="animate-[knock-codes-reveal_0.35s_ease-out]">
        <style>{KNOCK_CODES_MOTION_KEYFRAMES}</style>
        {children}
      </div>
    );
  }

  const code = digits.join("");
  const filled = code.length === codeLength && digits.every((d) => d !== "");

  const setDigit = (index: number, value: string) => {
    setDigits((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!filled || state === "submitting") return;
    await submit(code);
    setDigits(Array(codeLength).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const char = value.slice(-1);
    setDigit(index, char);
    if (char && index < codeLength - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, "");
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (event.key === "Enter") {
      void handleSubmit();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").trim().slice(0, codeLength);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(codeLength).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, codeLength - 1)]?.focus();
  };

  const errorMessage = error ? (error.reason === "network" ? merged.networkErrorMessage : merged.invalidErrorMessage) : null;

  // Tailwind's `dark:` utilities only activate for descendants of a ".dark"
  // ancestor — never for the element carrying that class itself — so
  // forcing a theme needs this extra wrapper, not just a class on the root
  // below. Omitting `theme` renders exactly as before (whatever ambient
  // ".dark" ancestor happens to exist, or none).
  const content = (
    <div
      className={cx(
        "flex w-full items-center justify-center bg-[var(--ag-canvas-bg,#e5e7eb)] p-6 dark:bg-[var(--ag-canvas-bg-dark,#0b1220)]",
        // Real page-root usage wants the full viewport; embedded usage
        // (a demo, a docs preview) wants to fill whatever height its own
        // container was given instead — the container providing a real,
        // definite height is that container's job, not this component's.
        fullPage ? "min-h-[100dvh]" : "h-full",
        className
      )}
    >
      <div
        style={{ fontFamily: "var(--ag-font, inherit)" }}
        className="w-full max-w-[27rem] rounded-[var(--ag-radius,1rem)] bg-[var(--ag-card,#ffffff)] p-8 shadow-2xl dark:bg-[var(--ag-card-dark,#030712)]"
      >
        <style>{KNOCK_CODES_MOTION_KEYFRAMES}</style>
        {logo && <div className="mb-6">{logo}</div>}

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{merged.heading}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{merged.description}</p>

        <div className="mt-6">
          <span className="mb-2 block text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
            {merged.accessCodeLabel}
          </span>
          <div
            key={shakeSeed}
            role="group"
            aria-label={merged.accessCodeLabel}
            className={cx("flex items-center gap-1.5", shakeSeed > 0 && "animate-[knock-codes-shake_0.4s_ease-in-out]")}
          >
            {Array.from({ length: codeLength }, (_, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {index > 0 && index % groupSize === 0 && <span className="text-gray-300">–</span>}
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  value={digits[index]}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  disabled={state === "submitting"}
                  maxLength={1}
                  autoComplete="one-time-code"
                  inputMode="text"
                  aria-label={`${merged.accessCodeLabel} character ${index + 1} of ${codeLength}`}
                  aria-invalid={error ? true : undefined}
                  className="h-11 w-10 rounded-[var(--ag-radius,0.5rem)] border border-[var(--ag-border,#d1d5db)] text-center text-sm font-medium text-gray-900 focus:border-[var(--ag-primary,#3b82f6)] focus:ring-2 focus:ring-[var(--ag-primary,#3b82f6)]/30 focus:outline-none disabled:opacity-60 dark:border-[var(--ag-border-dark,#374151)] dark:bg-[var(--ag-card-dark,#111827)] dark:text-gray-50"
                />
              </div>
            ))}
          </div>
          <div role="status" aria-live="polite" className="mt-2 min-h-[1.1rem] text-xs text-red-600 dark:text-red-400">
            {state === "submitting" ? merged.submittingLabel : (errorMessage ?? "")}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!filled || state === "submitting"}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ag-primary,#2563eb)] px-4 py-2.5 text-sm font-semibold text-[var(--ag-primary-fg,#ffffff)] transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === "submitting" ? merged.submittingLabel : merged.submitLabel} →
        </button>

        {(supportHref || onContactSupport) && (
          <div className="mt-3 text-center">
            {onContactSupport ? (
              <button
                type="button"
                onClick={onContactSupport}
                className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
              >
                {merged.supportLabel}
              </button>
            ) : (
              <a href={supportHref} className="text-sm font-medium text-red-600 hover:underline dark:text-red-400">
                {merged.supportLabel}
              </a>
            )}
          </div>
        )}

        <hr className="my-5 border-gray-200 dark:border-gray-800" />

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">{merged.footerText}</p>
      </div>
    </div>
  );

  // A plain sized wrapper, not `display: contents` — `contents` has
  // cross-browser quirks around passing percentage sizing through to
  // children, which broke the fill-the-canvas behavior above.
  return theme === "dark" ? <div className="dark h-full w-full">{content}</div> : content;
}
