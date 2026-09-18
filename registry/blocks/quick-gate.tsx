/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * Enter your preview code to continue.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: all blocks share controlled input and visibility props. The consumer owns unlocked.
 * @version 0.1.0
 * @minimalExample <QuickGate value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></QuickGate>
 * @fullExample <QuickGate value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted; your authorization belongs outside this UI."); }} status="idle" unlocked={unlocked} recipient="Acme Co." expiresAt="2030-01-01T12:00:00Z" logo={<strong>Atelier</strong>} heading="Your private preview" description="A first look at the work." onRequestAccess={() => setMessage("Request access selected")} buildLabel="acme-v1" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ submit: "Open preview", code: "Access code", footer: "A draft, prepared for you." }}><p>Preview content</p></QuickGate>
 * @lifecycle gate
 * @whenToUse Internal, staging or short-lived previews: one field, one action, no ceremony.
 * @notFor A client-facing first impression. Use Client preview gate, which carries branding, recipient and lifecycle.
 * @pitfall `unlocked` is the only visibility decision. A submit that ends in `status="success"` still shows nothing.
 * @pitfall Being the minimal block does not make it less controlled: value, status and unlocked are all yours to hold.
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

export interface QuickGateProps extends KnockBlockProps {}
export function QuickGate({
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
}: QuickGateProps) {
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
        {heading ?? 'A quick way in.'}
      </h2>
      <p className="kb-description">{description ?? 'Enter your preview code to continue.'}</p>
      {form}
      {(onRequestAccess || requestAccessHref) && <div className="mt-5">{request}</div>}
      {labels?.footer && <p className="kb-footer">{labels.footer}</p>}
    </div>
  );
  return (
    <div
      data-knock-block="quick-gate"
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
