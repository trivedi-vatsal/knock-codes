/**
 * MIT License — Copyright (c) 2026 Knock contributors.
 * This look is for you. Continue when you are ready.
 * Does not verify codes, persist state, or grant or revoke access.
 * Contract: all blocks share controlled input and visibility props. The consumer owns unlocked.
 * @version 0.1.0
 * @minimalExample <OpenInvitation value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></OpenInvitation>
 * @fullExample <OpenInvitation value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted; your authorization belongs outside this UI."); }} status="idle" unlocked={unlocked} recipient="Acme Co." expiresAt="2030-01-01T12:00:00Z" logo={<strong>Atelier</strong>} heading="This look is for you." description="Continue when you are ready." onRequestAccess={() => setMessage("Request access selected")} buildLabel="acme-v1" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ submit: "Open this invitation", footer: "A draft, prepared for you." }}><p>Preview content</p></OpenInvitation>
 * @lifecycle gate
 * @whenToUse The invitation is the access: a named recipient and a continue action, with no code to type.
 * @notFor When a typed code is the proof. Use Client preview gate or Quick gate.
 * @pitfall Continue only reports `onSubmit`. Set `unlocked` from your server, never from the click alone.
 * @pitfall `value` and `onChange` stay on the shared block contract so this file installs like the others. They are unused because there is no field.
 * @a11y Native forms and controls, polite error and cooldown announcements, visible focus, focus transfer after unlock. This block is a region, not a modal. Locked children are not rendered.
 */
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { type KnockBlockProps, knockBlockSkin } from '../shared/block';
import { RecipientLine } from '../components/recipient-line';
import { ExpiryPill } from '../components/expiry-pill';
import { RequestAccess } from '../components/request-access';
import { CooldownNotice } from '../components/cooldown-notice';

export interface OpenInvitationProps extends KnockBlockProps {}
export function OpenInvitation({
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
}: OpenInvitationProps) {
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
        <p className="kb-description">
          {labels?.hint ?? 'You already have the link. Continue when you are ready.'}
        </p>
      )}
      {status === 'error' && (
        <p role="status">{error ?? labels?.fallbackError ?? 'Please contact the preview owner.'}</p>
      )}
      <button type="submit" className="kb-submit" disabled={status === 'pending' || cooling}>
        {status === 'pending'
          ? (labels?.pending ?? 'Please wait…')
          : status === 'success'
            ? (labels?.success ?? 'Invitation received')
            : (labels?.submit ?? 'Open this invitation')}
      </button>
    </form>
  );
  const panel = (
    <div ref={lockedRegion} tabIndex={-1} className="kb-panel" role="region" aria-labelledby={id}>
      {logo && <div className="mb-5">{logo}</div>}
      {recipient && <RecipientLine recipient={recipient} label={labels?.recipient} theme={theme} />}
      <h2 id={id} className="kb-heading">
        {heading ?? 'This look is for you.'}
      </h2>
      <p className="kb-description">
        {description ?? 'Continue when you are ready. Your application decides what opens.'}
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
      {(onRequestAccess || requestAccessHref) && <div className="mt-5">{request}</div>}
      {labels?.footer && <p className="kb-footer">{labels.footer}</p>}
    </div>
  );
  return (
    <div
      data-knock-block="open-invitation"
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
