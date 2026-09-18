/** MIT License — Copyright (c) 2026 Knock contributors. Authoring-only; generate.ts inlines this into each published block. */
import { type FormEvent, type ReactNode } from 'react';

export interface KnockBlockProps {
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

export const knockBlockSkin = `[data-knock-block]{--kb-bg:#fffefa;--kb-ink:#30382c;--kb-muted:#65705b;--kb-line:#d8dece;--kb-accent:#a3462d;color:var(--knock-ink,var(--kb-ink));color-scheme:light}[data-knock-block][data-theme=dark]{--kb-bg:#293028;--kb-ink:#f0f3e9;--kb-muted:#b6c2ab;--kb-line:#59654f;--kb-accent:#f1a187;color-scheme:dark}@media(prefers-color-scheme:dark){[data-knock-block]:not([data-theme=light]){--kb-bg:#293028;--kb-ink:#f0f3e9;--kb-muted:#b6c2ab;--kb-line:#59654f;--kb-accent:#f1a187;color-scheme:dark}}[data-knock-block] .kb-panel{background:var(--knock-bg,var(--kb-bg));border:1px solid var(--knock-border,var(--kb-line));border-radius:12px;padding:clamp(22px,5vw,36px);width:100%;max-width:480px;box-shadow:0 12px 30px #28301c0d}[data-knock-block] .kb-heading{font-family:Georgia,serif;font-size:clamp(26px,4vw,34px);font-weight:400;letter-spacing:-.8px;line-height:1.2;margin:16px 0 12px}[data-knock-block] .kb-description{font-size:13px;line-height:1.8;color:var(--knock-muted,var(--kb-muted));margin:0 0 24px}[data-knock-block] .kb-submit{display:flex;align-items:center;justify-content:center;min-height:44px;width:100%;border:1px solid var(--knock-accent,var(--kb-accent));border-radius:7px;background:var(--knock-accent,var(--kb-accent));color:var(--knock-on-accent,#fffefa);font-size:13px;font-weight:500;margin-top:14px}[data-knock-block][data-theme=dark] .kb-submit{color:var(--knock-on-accent,#293028)}@media(prefers-color-scheme:dark){[data-knock-block]:not([data-theme=light]) .kb-submit{color:var(--knock-on-accent,#293028)}}[data-knock-block] :focus-visible{outline:2px solid var(--knock-accent,var(--kb-accent));outline-offset:5px}[data-knock-block] .kb-submit:disabled{opacity:.6;cursor:wait}[data-knock-block] .kb-footer{border-top:1px solid var(--knock-border,var(--kb-line));padding-top:18px;margin-top:24px;font-size:11px;color:var(--knock-muted,var(--kb-muted))}@media(prefers-reduced-motion:reduce){[data-knock-block] *{animation:none!important;transition:none!important}}`;
