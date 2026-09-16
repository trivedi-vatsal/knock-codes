/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Routes a recipient without a code to the preview owner.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: the consumer owns lifecycle timestamps and action callbacks.
 * @version 0.2.0
 * @minimalExample <RequestAccess onRequestAccess={() => setMessage("Request access selected")} />
 * @fullExample <RequestAccess requestAccessHref="mailto:studio@example.com?subject=Preview%20access" theme="light" labels={{ description: "Missing your invitation?", action: "Ask the studio", unavailable: "Contact the owner." }} />
 * @lifecycle gate
 * @whenToUse Recipients arrive without a working code — a forwarded invitation, a link that sat too long — and need a route back to the owner.
 * @notFor Sending the request. Nothing leaves the browser: you supply a link or a callback and deliver the message yourself.
 * @pitfall With neither `requestAccessHref` nor `onRequestAccess` set, the component renders its unavailable label rather than a dead control. Supply one of them.
 * @a11y Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.
 */
'use client';

export interface RequestAccessProps {
  /** Destination URL or mailto address. Takes precedence over callback. Only relative, http(s), and mailto URLs are supported. */
  requestAccessHref?: string;
  /** Called when requesting access without a destination URL. */
  onRequestAccess?: () => void;
  /** Localized context and action. */
  labels?: {
    /** Localized description. */
    description?: string;

    /** Localized action. */
    action?: string;

    /** Localized unavailable. */
    unavailable?: string;
  };

  /** Explicit theme; omitted follows the system preference. */
  theme?: 'light' | 'dark';
  /** Additional wrapper classes. */
  className?: string;
}
export function RequestAccess({
  requestAccessHref,
  onRequestAccess,
  labels,
  theme,
  className = '',
}: RequestAccessProps) {
  const href =
    requestAccessHref && /^(?:https?:\/\/|mailto:|\/(?!\/)|#|\.\.?\/)/i.test(requestAccessHref)
      ? requestAccessHref
      : undefined;
  const action = labels?.action ?? 'Request access';
  const classes =
    'inline-flex min-h-10 items-center gap-2 font-medium underline decoration-[var(--knock-border,var(--knock-line))] underline-offset-4';
  return (
    <div
      data-knock-item="request"
      data-theme={theme}
      className={`flex flex-wrap items-center gap-x-2 text-sm ${className}`}
    >
      <style>{`[data-knock-item]{--knock-surface:#fffefa;--knock-text:#30382c;--knock-secondary:#65705b;--knock-line:#d8dece;--knock-highlight:#a3462d;color:var(--knock-ink,var(--knock-text));color-scheme:light}[data-knock-item][data-theme=dark]{--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-item]:not([data-theme=light]){--knock-surface:#293028;--knock-text:#f0f3e9;--knock-secondary:#b6c2ab;--knock-line:#59654f;--knock-highlight:#f1a187;color-scheme:dark}}[data-knock-item] a:focus-visible,[data-knock-item] button:focus-visible,[data-knock-item] [tabindex]:focus-visible{outline:2px solid var(--knock-accent,var(--knock-highlight));outline-offset:4px}[data-knock-item] button,[data-knock-item] a{overflow-wrap:anywhere}@media(prefers-reduced-motion:reduce){[data-knock-item] *{animation:none!important;transition:none!important}}`}</style>
      <span className="text-[var(--knock-muted,var(--knock-secondary))]">
        {labels?.description ?? 'Missing your invitation?'}
      </span>
      {href ? (
        <a className={classes} href={href}>
          {action}
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
      ) : onRequestAccess ? (
        <button type="button" className={classes} onClick={onRequestAccess}>
          {action}
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
      ) : (
        <span>{labels?.unavailable ?? 'Contact the preview owner for a code.'}</span>
      )}
    </div>
  );
}
