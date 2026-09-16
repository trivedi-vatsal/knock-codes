/** MIT License — Copyright (c) 2026 Knock contributors. Demo fixtures only. */
import { useRef, useState } from 'react';
import { CooldownNotice } from '../registry/components/cooldown-notice';
import { RecipientLine } from '../registry/components/recipient-line';
import { ExpiryPill } from '../registry/components/expiry-pill';
import { RequestAccess } from '../registry/components/request-access';
import { PreviewRibbon } from '../registry/components/preview-ribbon';
import { PreviewBar } from '../registry/components/preview-bar';
import { RelockControl } from '../registry/components/relock-control';
import { BlurVeil } from '../registry/components/blur-veil';

export const componentInfo: Record<
  string,
  { title: string; description: string; icon: string; contract: string }
> = {
  'Code field': {
    title: 'Let good work in.',
    description:
      'A code field built for the way clients actually arrive.\nPasted from an email. A little extra whitespace. All welcome.',
    icon: 'key',
    contract: 'You own the code and all access decisions.',
  },
  'Cooldown notice': {
    title: 'Leave a little room.',
    description:
      'A pause should feel like patience, not a punishment.\nA calm countdown that welcomes the next try.',
    icon: 'reset',
    contract: 'The deadline is yours. Reaching zero never submits a code.',
  },
  'Recipient line': {
    title: 'Make it personal.',
    description:
      'A name turns a screen into an invitation.\nPrepared with care. Addressed to the right people.',
    icon: 'globe',
    contract: 'A recipient is presentation, never proof of identity.',
  },
  'Expiry pill': {
    title: 'Good things have a window.',
    description:
      'Set expectations before a preview disappears.\nAvailable, ending soon, or time to ask for another look.',
    icon: 'sun',
    contract: 'The expiry is visual. Your application enforces access.',
  },
  'Request access': {
    title: 'Keep the door open.',
    description:
      'Invitations get forwarded. Codes get lost.\nGive every visitor a clear way to reach the right person.',
    icon: 'arrow',
    contract: 'A link or a callback. No messages are sent by the component.',
  },
  'Preview ribbon': {
    title: 'A draft, beautifully stated.',
    description:
      'Keep the context attached to the work.\nEspecially when a screenshot leaves the room.',
    icon: 'diamond',
    contract: 'Always visible within its rendered area; no dismiss action.',
  },
  'Preview bar': {
    title: 'Context that stays.',
    description:
      'The welcome does not end at unlock.\nKeep the build, its lifetime, and the next action close.',
    icon: 'menu',
    contract: 'Feedback and relock actions are owned by your application.',
  },
  'Relock control': {
    title: 'Step away with confidence.',
    description:
      'A shared screen needs a graceful ending.\nOne deliberate action to put the preview away.',
    icon: 'shield',
    contract: 'Activating calls onRelock. The consumer must hide the content.',
  },
  'Blur veil': {
    title: 'Just enough to intrigue.',
    description:
      'A glimpse of the work, with a clear invitation.\nVisible behind the prompt. Inert until you reveal it.',
    icon: 'copy',
    contract: 'Blur is visual, not security. Content remains in the DOM.',
  },
};
const sources = import.meta.glob('../registry/components/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
export const getSource = (name: string) =>
  sources[`../registry/components/${name.toLowerCase().replaceAll(' ', '-')}.tsx`];

function DraftContent({ onAction }: { onAction: () => void }) {
  return (
    <div className="draft-content">
      <div className="draft-nav">
        <span>atelier / objects</span>
        <span>COLLECTION 001</span>
      </div>
      <div className="draft-hero">
        <span className="draft-object" aria-hidden="true" />
        <div>
          <span className="eyebrow">LESS, BUT CONSIDERED</span>
          <h3>
            Objects for
            <br />a slower day.
          </h3>
          <button onClick={onAction}>Explore the collection ↗</button>
        </div>
      </div>
      <div className="draft-detail">
        Natural materials. Lasting impressions.<span>EST. 2026</span>
      </div>
    </div>
  );
}
export function ComponentDemo({
  name,
  theme,
  setTheme,
  compact,
}: {
  name: string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  /** Inside the documentation page the surrounding marketing section is redundant. */
  compact?: boolean;
}) {
  const [tab, setTab] = useState('Preview');
  const [recipient, setRecipient] = useState('Acme Co.');
  const [deadline, setDeadline] = useState(() => new Date(Date.now() + 90000).toISOString());
  const [expiry, setExpiry] = useState(() => new Date(Date.now() + 3 * 86400000).toISOString());
  const [expiryState, setExpiryState] = useState('fine');
  const [unlocked, setUnlocked] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [draftLabel, setDraftLabel] = useState('Work in progress');
  const [build, setBuild] = useState('acme-v0.8.2');
  const [destination, setDestination] = useState('callback');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const restore = useRef<HTMLButtonElement>(null);
  const openContent = useRef<HTMLDivElement>(null);
  const info = componentInfo[name];
  const action = () => setMessage('Demo action received. Your app handles what happens next.');
  const relock = () => {
    setUnlocked(false);
    setMessage('The demo consumer hid the preview.');
    requestAnimationFrame(() => restore.current?.focus());
  };
  const show = () => {
    setUnlocked(true);
    setMessage('Preview restored for this demo.');
    requestAnimationFrame(() => openContent.current?.focus());
  };
  const code: Record<string, string> = {
    'Cooldown notice': `<CooldownNotice\n  cooldownUntil={retryDeadline}\n/>`,
    'Recipient line': `<RecipientLine\n  recipient=${JSON.stringify(recipient)}\n/>`,
    'Expiry pill': `<ExpiryPill\n  expiresAt={previewExpiry}\n/>`,
    'Request access':
      destination === 'callback'
        ? '<RequestAccess\n  onRequestAccess={openAccessRequest}\n/>'
        : `<RequestAccess\n  requestAccessHref=${JSON.stringify(destination === 'mailto' ? 'mailto:studio@example.com?subject=Preview%20access' : '/?request=preview')}\n/>`,
    'Preview ribbon': `<PreviewRibbon\n  labels={{ draft: ${JSON.stringify(draftLabel)} }}\n/>`,
    'Preview bar': `<PreviewBar\n  buildLabel=${JSON.stringify(build)}\n  expiresAt={previewExpiry}\n  onRelock={handleRelock}\n  onFeedback={openFeedback}\n/>`,
    'Relock control': '<RelockControl\n  onRelock={handleRelock}\n/>',
    'Blur veil':
      '<BlurVeil\n  unlocked={unlocked}\n  prompt={<YourAccessPrompt />}\n>\n  <YourPreview />\n</BlurVeil>',
  };
  async function copySource() {
    try {
      await navigator.clipboard.writeText(getSource(name));
      setCopied(true);
    } catch {
      setMessage('Clipboard unavailable. Select the source in the Code tab.');
      setTab('Code');
    }
  }
  return (
    <>
      <section className="workbench component-workbench" aria-label={`${name} playground`}>
        <div className="bench-header">
          <div className="tabs" aria-label="Component view">
            {['Preview', 'Code'].map((t) => (
              <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>
                {t === 'Preview' ? '◇' : '‹/›'} {t}
              </button>
            ))}
          </div>
          <div className="bench-tools">
            <span className="live-caption">LIVE PLAYGROUND</span>
            <button
              aria-label="Light theme"
              aria-pressed={theme === 'light'}
              onClick={() => setTheme('light')}
            >
              ☼
            </button>
            <button
              aria-label="Dark theme"
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme('dark')}
            >
              ☾
            </button>
          </div>
        </div>
        <div className="bench-body">
          <div className={`preview-stage lifecycle-stage ${theme}`}>
            <div className="stage-caption">
              <span className="stage-dot" />
              EVERY PART OF THE PREVIEW
            </div>
            {tab === 'Code' ? (
              <div className="full-source">
                <div>{name.toLowerCase().replaceAll(' ', '-')}.tsx</div>
                <pre tabIndex={0} aria-label={`${name} source`}>
                  {getSource(name)}
                </pre>
              </div>
            ) : (
              <div
                className={`lifecycle-example ${['Preview ribbon', 'Preview bar', 'Blur veil'].includes(name) ? 'wide-example' : ''}`}
              >
                {name === 'Cooldown notice' && (
                  <CooldownNotice cooldownUntil={deadline} theme={theme} />
                )}
                {name === 'Recipient line' && (
                  <div className="invitation-fixture">
                    <div className="sample-brand">
                      <span className="studio-symbol">a</span>atelier
                    </div>
                    <div className="envelope-rule" />
                    <span className="eyebrow">A PRIVATE FIRST LOOK</span>
                    <h2>
                      Made with you
                      <br />
                      in mind.
                    </h2>
                    <RecipientLine recipient={recipient || 'Your client'} theme={theme} />
                    <div className="invitation-signature">
                      From our studio, to your next chapter.
                    </div>
                  </div>
                )}
                {name === 'Expiry pill' && (
                  <div className="invitation-fixture">
                    <span className="eyebrow">A MOMENT TO EXPLORE</span>
                    <h2>
                      Your preview
                      <br />
                      has a little time.
                    </h2>
                    <ExpiryPill expiresAt={expiry} theme={theme} />
                    <p className="fixture-note">
                      The work is yours to look around.
                      <br />
                      We’ll keep the timeline clear.
                    </p>
                  </div>
                )}
                {name === 'Request access' && (
                  <div className="invitation-fixture">
                    <span className="eyebrow">YOU’RE IN THE RIGHT PLACE</span>
                    <h2>
                      Let’s get you
                      <br />a first look.
                    </h2>
                    <p className="fixture-note">
                      Your invitation might be a few emails back.
                      <br />
                      There’s always a way to reach us.
                    </p>
                    <RequestAccess
                      theme={theme}
                      onRequestAccess={destination === 'callback' ? action : undefined}
                      requestAccessHref={
                        destination === 'mailto'
                          ? 'mailto:studio@example.com?subject=Preview%20access'
                          : destination === 'link'
                            ? '/?request=preview'
                            : undefined
                      }
                    />
                  </div>
                )}
                {name === 'Preview ribbon' && (
                  <div className="preview-document">
                    <PreviewRibbon labels={{ draft: draftLabel }} theme={theme} />
                    <DraftContent onAction={action} />
                  </div>
                )}
                {name === 'Preview bar' &&
                  (unlocked ? (
                    <div className="preview-document" ref={openContent} tabIndex={-1}>
                      <DraftContent onAction={action} />
                      <PreviewBar
                        buildLabel={build}
                        expiresAt={expiry}
                        onFeedback={action}
                        onRelock={relock}
                        theme={theme}
                      />
                    </div>
                  ) : (
                    <div className="invitation-fixture">
                      <span className="eyebrow">ALL TUCKED AWAY</span>
                      <h2>Until next time.</h2>
                      <p className="fixture-note">This demo’s content is now hidden.</p>
                      <button className="source-button" ref={restore} onClick={show}>
                        Restore demo preview ↗
                      </button>
                    </div>
                  ))}
                {name === 'Relock control' && (
                  <div className="invitation-fixture" ref={openContent} tabIndex={-1}>
                    {unlocked ? (
                      <>
                        <span className="eyebrow">BEFORE YOU GO</span>
                        <h2>
                          A little privacy.
                          <br />A little peace of mind.
                        </h2>
                        <RelockControl onRelock={relock} theme={theme} />
                      </>
                    ) : (
                      <>
                        <span className="eyebrow">PREVIEW HIDDEN</span>
                        <h2>See you soon.</h2>
                        <button className="source-button" ref={restore} onClick={show}>
                          Restore demo preview ↗
                        </button>
                      </>
                    )}
                  </div>
                )}
                {name === 'Blur veil' && (
                  <div className="preview-document">
                    <BlurVeil
                      unlocked={revealed}
                      theme={theme}
                      prompt={
                        <>
                          <span className="eyebrow">AN INVITATION TO LOOK CLOSER</span>
                          <h2 className="veil-heading">
                            Something good
                            <br />
                            is taking shape.
                          </h2>
                          <p className="fixture-note">Your preview starts on the other side.</p>
                          <button className="preview-submit" onClick={() => setRevealed(true)}>
                            Reveal demo ↗
                          </button>
                        </>
                      }
                    >
                      <DraftContent onAction={action} />
                    </BlurVeil>
                  </div>
                )}
              </div>
            )}
            <div className="stage-bottom">
              <span>CRAFTED TO FEEL PERSONAL</span>
              <span>{name.toUpperCase()}</span>
            </div>
          </div>
          <aside className="controls" aria-label={`${name} settings`}>
            <div className="control-title">
              Make it yours <span>↙</span>
            </div>
            <p className="control-intro">One detail. A better experience.</p>
            {name === 'Recipient line' && (
              <>
                <label className="control-label" htmlFor="recipient">
                  Prepared for
                </label>
                <input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </>
            )}
            {name === 'Cooldown notice' && (
              <>
                <div className="control-label">Try a timeline</div>
                <div className="lifecycle-buttons">
                  <button onClick={() => setDeadline(new Date(Date.now() + 90000).toISOString())}>
                    90 seconds
                  </button>
                  <button onClick={() => setDeadline(new Date(Date.now() + 5000).toISOString())}>
                    5-second test
                  </button>
                  <button onClick={() => setDeadline(new Date(Date.now() - 1000).toISOString())}>
                    Ready to retry
                  </button>
                </div>
                <p className="fixture-note">
                  The timer updates quietly. Readiness is announced once.
                </p>
              </>
            )}
            {name === 'Expiry pill' && (
              <>
                <label className="control-label" htmlFor="expiry">
                  Preview lifetime
                </label>
                <select
                  id="expiry"
                  value={expiryState}
                  onChange={(e) => {
                    setExpiryState(e.target.value);
                    setExpiry(
                      new Date(
                        Date.now() +
                          (e.target.value === 'fine'
                            ? 3 * 86400000
                            : e.target.value === 'soon'
                              ? 2 * 3600000
                              : -1000),
                      ).toISOString(),
                    );
                  }}
                >
                  <option value="fine">Fine · 3 days left</option>
                  <option value="soon">Expiring soon · 2 hours</option>
                  <option value="expired">Expired</option>
                </select>
              </>
            )}
            {name === 'Request access' && (
              <>
                <label className="control-label" htmlFor="destination">
                  Resolve to
                </label>
                <select
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="callback">Callback</option>
                  <option value="mailto">Email / mailto</option>
                  <option value="link">Relative link</option>
                </select>
                <p className="fixture-note">
                  Callback mode stays in the demo. Links use their native browser behavior.
                </p>
              </>
            )}
            {name === 'Preview ribbon' && (
              <>
                <label className="control-label" htmlFor="draft-label">
                  Draft label
                </label>
                <input
                  id="draft-label"
                  value={draftLabel}
                  onChange={(e) => setDraftLabel(e.target.value)}
                />
                <p className="fixture-note">
                  Keep it inside the screenshot. Place the ribbon alongside the work you share.
                </p>
              </>
            )}
            {name === 'Preview bar' && (
              <>
                <label className="control-label" htmlFor="build-label">
                  Build identifier
                </label>
                <input id="build-label" value={build} onChange={(e) => setBuild(e.target.value)} />
                <p className="fixture-note">
                  Try feedback, then relock. The demo consumer hides the content and moves focus.
                </p>
              </>
            )}
            {name === 'Relock control' && (
              <p className="fixture-note">
                Activate the control to see the consumer hide the preview. Restore it to try again.
              </p>
            )}
            {name === 'Blur veil' && (
              <>
                <div className="control-label">Consumer state</div>
                <div className="lifecycle-buttons">
                  <button aria-pressed={!revealed} onClick={() => setRevealed(false)}>
                    Locked
                  </button>
                  <button aria-pressed={revealed} onClick={() => setRevealed(true)}>
                    Unlocked
                  </button>
                </div>
                <p className="fixture-note">
                  Try Tab while locked: the content behind the prompt is skipped.
                </p>
              </>
            )}
            <div className="try-paste">
              <div>THE COMPONENT CONTRACT</div>
              <p>{info.contract}</p>
            </div>
            <button className="source-button" onClick={copySource}>
              {copied ? 'Copied ✓' : 'Copy component ↗'}
            </button>
          </aside>
        </div>
        <div className="bench-footer">
          <span>
            React + Tailwind <i />
            Keyboard accessible <i />
            Consumer controlled
          </span>
          <span>One file. Entirely yours.</span>
        </div>
      </section>
      <p className="announcement" role="status" aria-live="polite">
        {message}
      </p>
      {!compact && (
        <section className="usage" id="usage">
          <div>
            <div className="eyebrow">SMALL DETAILS. FULLY CONSIDERED.</div>
            <h2>
              Fits your preview.
              <br />
              Feels like your brand.
            </h2>
            <p>{info.contract}</p>
            <p>
              Copy the self-contained source from the Code tab.
              <br />
              Install with shadcn from the generated docs.
            </p>
          </div>
          <div className="usage-code">
            <div>{name.toLowerCase().replaceAll(' ', '-')}.tsx</div>
            <pre>{code[name]}</pre>
          </div>
        </section>
      )}
    </>
  );
}
