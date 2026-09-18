/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * This part of the preview was prepared for invited reviewers.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: all blocks share controlled input and visibility props. The consumer owns unlocked.
 * @version 0.1.0
 * @minimalExample <GatedSection value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></GatedSection>
 * @fullExample <GatedSection value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted; your authorization belongs outside this UI."); }} status="idle" unlocked={unlocked} recipient="Acme Co." expiresAt="2030-01-01T12:00:00Z" logo={<strong>Atelier</strong>} heading="Your private preview" description="A first look at the work." onRequestAccess={() => setMessage("Request access selected")} buildLabel="acme-v1" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ submit: "Open preview", code: "Access code", footer: "A draft, prepared for you." }}><p>Preview content</p></GatedSection>
 * @lifecycle gate
 * @whenToUse One region of an otherwise open page is reserved — pricing, a case study, the next chapter — while everything around it stays readable.
 * @notFor Gating a whole page. Use Client preview gate or Quick gate.
 * @pitfall The surrounding page stays usable by design. This is a region, not a modal, and no focus trap is applied.
 * @pitfall `unlocked` is the only visibility decision; the section reveals nothing on its own.
 * @a11y Native forms and controls, polite error and cooldown announcements, visible focus, focus transfer after unlock. This block is a region, not a modal. Locked children are not rendered.
 */
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { type KnockBlockProps, knockBlockSkin } from '../shared/block';
import { CodeField } from '../components/code-field';
import { RecipientLine } from '../components/recipient-line';
import { ExpiryPill } from '../components/expiry-pill';
import { RequestAccess } from '../components/request-access';
import { CooldownNotice } from '../components/cooldown-notice';

export interface GatedSectionProps extends KnockBlockProps {}
export function GatedSection({
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
}: GatedSectionProps) {
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
      </button>
    </form>
  );
  const panel = (
    <div ref={lockedRegion} tabIndex={-1} className="kb-panel" role="region" aria-labelledby={id}>
      {logo && <div className="mb-5">{logo}</div>}
      {recipient && <RecipientLine recipient={recipient} label={labels?.recipient} theme={theme} />}
      <h2 id={id} className="kb-heading">
        {heading ?? 'A little more to explore.'}
      </h2>
      <p className="kb-description">
        {description ?? 'This part of the preview was prepared for invited reviewers.'}
      </p>
      {expiresAt && (
        <div className="mb-5">
          <ExpiryPill
            expiresAt={expiresAt}
            theme={theme}
            labels={{
              pending: labels?.expiryPending,
              fine: labels?.expiryFine,
              soon: labels?.expirySoon,
              expired: labels?.expired,
              unavailable: labels?.expiryUnavailable,
              remaining: labels?.expiryRemaining,
            }}
          />
        </div>
      )}
      {form}
      <div className="mt-5">{request}</div>
      <p className="kb-footer">{labels?.footer ?? 'A private preview. A work in progress.'}</p>
    </div>
  );
  return (
    <div
      data-knock-block="gated-section"
      data-theme={theme}
      className={`flex w-full justify-center ${className}`}
    >
      <style>{knockBlockSkin}</style>
      {unlocked ? (
        <div ref={content} tabIndex={-1} className="w-full">
          {children}
        </div>
      ) : (
        panel
      )}
    </div>
  );
}
