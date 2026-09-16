/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Enter your invitation code to see the draft.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: all blocks share controlled input and visibility props. The consumer owns unlocked.
 * @version 0.1.0
 * @minimalExample <PreviewChrome value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></PreviewChrome>
 * @fullExample <PreviewChrome value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted; your authorization belongs outside this UI."); }} status="idle" unlocked={unlocked} recipient="Acme Co." expiresAt="2030-01-01T12:00:00Z" logo={<strong>Atelier</strong>} heading="Your private preview" description="A first look at the work." onRequestAccess={() => setMessage("Request access selected")} buildLabel="acme-v1" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ submit: "Open preview", code: "Access code", footer: "A draft, prepared for you." }}><p>Preview content</p></PreviewChrome>
 * @lifecycle unlocked
 * @whenToUse Content is already unlocked and needs its context kept with it: a draft ribbon above, and build identity, feedback and relock below.
 * @notFor The gate itself. This block never asks for a code.
 * @pitfall Without `onRelock`, the interactive bar is omitted rather than shown with an action that does nothing.
 * @pitfall Relock calls back only. Setting `unlocked` to false stays with the consumer.
 * @a11y Native forms and controls, polite error and cooldown announcements, visible focus, focus transfer after unlock. This block is a region, not a modal. Locked children are not rendered.
 */
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { type KnockBlockProps, knockBlockSkin } from '../shared/block';
import { CodeField } from '../components/code-field';
import { PreviewRibbon } from '../components/preview-ribbon';
import { PreviewBar } from '../components/preview-bar';
import { RequestAccess } from '../components/request-access';
import { CooldownNotice } from '../components/cooldown-notice';

export interface PreviewChromeProps extends KnockBlockProps {}
export function PreviewChrome({
  value,
  onChange,
  onSubmit,
  status,
  unlocked,
  children,
  error,
  recipient,
  expiresAt,
  cooldownUntil,
  onRequestAccess,
  requestAccessHref,
  logo,
  heading,
  description,
  labels,
  theme,
  className = '',
  mode = 'digits',
  length = 8,
  masked = false,
  buildLabel,
  onRelock,
  onFeedback,
  feedbackHref,
}: PreviewChromeProps) {
  const id = useId();
  const content = useRef<HTMLDivElement>(null);
  const lockedRegion = useRef<HTMLDivElement>(null);
  const wasUnlocked = useRef(unlocked);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!cooldownUntil) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [cooldownUntil]);
  useEffect(() => {
    if (unlocked && !wasUnlocked.current) content.current?.focus();
    if (!unlocked && !lockedRegion.current?.querySelector('input:not(:disabled)'))
      lockedRegion.current?.focus();
    wasUnlocked.current = unlocked;
  }, [unlocked]);
  const cooling =
    Boolean(cooldownUntil) &&
    (now === null ||
      !Number.isFinite(Date.parse(cooldownUntil!)) ||
      Date.parse(cooldownUntil!) > now);
  const cooldown = cooldownUntil ? (
    <CooldownNotice
      cooldownUntil={cooldownUntil}
      theme={theme}
      labels={{
        heading: labels?.cooldownHeading,
        description: labels?.cooldownDescription,
        ready: labels?.cooldownReady,
        waiting: labels?.cooldownWaiting,
        unavailable: labels?.cooldownUnavailable,
        countdown: labels?.countdown,
      }}
    />
  ) : null;
  const request = (
    <RequestAccess
      onRequestAccess={onRequestAccess}
      requestAccessHref={requestAccessHref}
      theme={theme}
      labels={{
        description: labels?.requestDescription,
        action: labels?.requestAction,
        unavailable: labels?.requestUnavailable,
      }}
    />
  );
  const form = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (status !== 'pending' && !cooling) onSubmit(event);
      }}
      aria-busy={status === 'pending'}
    >
      {cooling ? (
        cooldown
      ) : (
        <CodeField
          value={value}
          onChange={onChange}
          mode={mode}
          length={length}
          masked={masked}
          status={status}
          error={
            error ??
            labels?.fallbackError ??
            'That didn’t quite match. Please check your invitation.'
          }
          label={labels?.code ?? 'Your access code'}
          description={labels?.hint ?? 'Paste it straight from your invitation.'}
          theme={theme}
        />
      )}
      <button type="submit" className="kb-submit" disabled={status === 'pending' || cooling}>
        {status === 'pending'
          ? (labels?.pending ?? 'Please wait…')
          : status === 'success'
            ? (labels?.success ?? 'Code received')
            : (labels?.submit ?? 'Open the preview')}
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
    </form>
  );
  const panel = (
    <div ref={lockedRegion} tabIndex={-1} className="kb-panel" role="region" aria-labelledby={id}>
      {logo && <div className="mb-5">{logo}</div>}
      <h2 id={id} className="kb-heading">
        {heading ?? 'Your private preview.'}
      </h2>
      <p className="kb-description">
        {description ?? 'Enter your invitation code to see the draft.'}
      </p>
      {form}
      <div className="mt-5">{request}</div>
      <p className="kb-footer">{labels?.footer ?? 'A private preview. A work in progress.'}</p>
    </div>
  );
  return (
    <div
      data-knock-block="preview-chrome"
      data-theme={theme}
      className={`flex w-full justify-center ${className}`}
    >
      <style>{knockBlockSkin}</style>
      {unlocked ? (
        <div ref={content} tabIndex={-1} className="w-full">
          <div className="sticky top-0 z-20">
            <PreviewRibbon
              theme={theme}
              labels={{ draft: labels?.draft, description: labels?.draftDescription }}
            />
          </div>
          <div>{children}</div>
          {onRelock ? (
            <div className="sticky bottom-0 z-20">
              <PreviewBar
                buildLabel={buildLabel ?? labels?.build ?? 'Preview'}
                expiresAt={expiresAt}
                onRelock={onRelock}
                onFeedback={onFeedback}
                feedbackHref={feedbackHref}
                theme={theme}
                labels={{
                  navigation: labels?.navigation,
                  preview: labels?.draft,
                  expires: labels?.expires,
                  invalidExpiry: labels?.expiryUnavailable,
                  feedback: labels?.feedback,
                  relock: labels?.relock,
                }}
              />
            </div>
          ) : (
            <div className="kb-footer">{buildLabel ?? labels?.build ?? 'Preview'}</div>
          )}
        </div>
      ) : (
        panel
      )}
    </div>
  );
}
