import { cx } from "./cx.ts";

export interface VerificationLoaderProps {
  label?: string;
  className?: string;
}

/**
 * A small presentational spinner + label for the in-flight verification
 * moment — the same visual `<PinInput>` shows inline via its `submitting`
 * state, exposed standalone for a fully custom PIN form built directly on
 * `useKnockCodes`.
 */
export function VerificationLoader({ label = "Checking...", className }: VerificationLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cx("flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400", className)}
    >
      <span
        aria-hidden="true"
        className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-300"
      />
      {label}
    </div>
  );
}
