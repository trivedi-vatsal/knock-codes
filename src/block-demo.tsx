/** MIT License — Copyright (c) 2026 Knock contributors. Consumer-owned demo state, no verification. */
import { useRef, useState, type ComponentType } from 'react';
import {
  ClientPreviewGate,
  type ClientPreviewGateProps,
} from '../registry/blocks/client-preview-gate';
import { QuickGate } from '../registry/blocks/quick-gate';
import { TeaserGate } from '../registry/blocks/teaser-gate';
import { GatedSection } from '../registry/blocks/gated-section';
import { ExpiredNotice } from '../registry/blocks/expired-notice';
import { RevokedNotice } from '../registry/blocks/revoked-notice';
import { CooldownScreen } from '../registry/blocks/cooldown-screen';
import { PreviewChrome } from '../registry/blocks/preview-chrome';
export const blocks: Record<string, ComponentType<ClientPreviewGateProps>> = {
  'Client preview gate': ClientPreviewGate,
  'Quick gate': QuickGate,
  'Teaser gate': TeaserGate,
  'Gated section': GatedSection,
  'Expired notice': ExpiredNotice,
  'Revoked notice': RevokedNotice,
  'Cooldown screen': CooldownScreen,
  'Preview chrome': PreviewChrome,
};
export const blockInfo: Record<
  string,
  { title: string; description: string; icon: string; contract: string }
> = {
  'Quick gate': {
    title: 'Straight to the work.',
    description: 'One field. One clear next step.',
    icon: 'diamond',
    contract: 'A minimal gate for internal previews and staging.',
  },
  'Teaser gate': {
    title: 'A glimpse worth opening.',
    description: 'Let the work make the first move. Keep interaction on the invitation.',
    icon: 'diamond',
    contract: 'A blurred, inert preview behind a controlled invitation.',
  },
  'Gated section': {
    title: 'One page. A little more.',
    description: 'Keep the conversation open, with one region reserved for invited eyes.',
    icon: 'diamond',
    contract: 'A regional gate that leaves the surrounding page usable.',
  },
  'Expired notice': {
    title: 'Every preview has its moment.',
    description: 'A thoughtful ending, and a clear way to ask for another look.',
    icon: 'diamond',
    contract: 'An expired invitation with a route back to the owner.',
  },
  'Revoked notice': {
    title: 'A considered close.',
    description: 'When sharing stops, keep the message clear and the tone human.',
    icon: 'diamond',
    contract: 'A withdrawn preview, distinct from a timed expiry.',
  },
  'Cooldown screen': {
    title: 'A moment, not a dead end.',
    description: 'A calm pause before the next try. The work will still be here.',
    icon: 'diamond',
    contract: 'A full retry notice without accusations or enforcement logic.',
  },
  'Preview chrome': {
    title: 'The context stays with it.',
    description: 'Keep draft status, build identity, feedback, and relock alongside the work.',
    icon: 'diamond',
    contract: 'Draft ribbon and persistent controls around an unlocked preview.',
  },

  'Client preview gate': {
    title: 'Your work. Their first look.',
    description:
      'A branded invitation, with every thoughtful detail in place.\nPrepared for a person. Ready for a first impression.',
    icon: 'diamond',
    contract: 'Controlled code entry, addressed invitation, expiry and access recovery.',
  },
};
const sources = import.meta.glob('../registry/blocks/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
function PreviewContent() {
  return (
    <div className="block-draft">
      <div className="draft-nav">
        <span>atelier / acme</span>
        <span>PRIVATE DESIGN REVIEW</span>
      </div>
      <p className="eyebrow">THE NEXT CHAPTER</p>
      <h2>
        Room for
        <br />
        something remarkable.
      </h2>
      <div className="block-art" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="fixture-note">
        A first direction. A shared conversation.
        <br />
        Built around what comes next.
      </p>
      <button
        className="source-button"
        onClick={(event) => {
          event.currentTarget.textContent = 'Thanks for exploring ✓';
        }}
      >
        Explore the concept ↗
      </button>
    </div>
  );
}
export const getBlockSource = (slug: string) => sources[`../registry/blocks/${slug}.tsx`];
export function BlockDemo({
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
  const Block = blocks[name];
  const slug = name.toLowerCase().replaceAll(' ', '-');
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(name === 'Preview chrome');
  const [status, setStatus] = useState<ClientPreviewGateProps['status']>('idle');
  const [mode, setMode] = useState<'digits' | 'passphrase'>('digits');
  const [recipient, setRecipient] = useState('Acme Co.');
  const [message, setMessage] = useState('');
  const [view, setView] = useState('Preview');
  const [copied, setCopied] = useState(false);
  const [expiresAt] = useState(() => new Date(Date.now() + 3 * 86400000).toISOString());
  const [cooldownUntil, setCooldownUntil] = useState<string | undefined>(
    name === 'Cooldown screen' ? new Date(Date.now() + 90000).toISOString() : undefined,
  );
  const [masked, setMasked] = useState(false);
  const control = useRef<HTMLButtonElement>(null);
  const props: ClientPreviewGateProps = {
    value,
    onChange: setValue,
    onSubmit: (event) => {
      event.preventDefault();
      setMessage('Demo submit received. Use Reveal in the settings to change consumer state.');
    },
    status,
    unlocked,
    recipient: name === 'Quick gate' ? undefined : recipient,
    expiresAt,
    cooldownUntil,
    mode,
    masked,
    theme,
    logo:
      name === 'Quick gate' ? undefined : (
        <div className="sample-brand">
          <span className="studio-symbol">a</span>atelier<span>DESIGN STUDIO</span>
        </div>
      ),
    onRequestAccess: () => setMessage('Access request callback received.'),
    onRelock: () => {
      setUnlocked(false);
      setMessage('The consumer relocked the demo.');
    },
    onFeedback: () => setMessage('Feedback callback received.'),
    buildLabel: 'acme-v0.8.2',
    error: 'That didn’t quite match. Give your invitation another look.',
  };
  const source = sources[`../registry/blocks/${slug}.tsx`];
  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
    } catch {
      setView('Code');
      setMessage('Select the source below to copy it.');
    }
  }
  return (
    <>
      <section className="workbench" aria-label={`${name} playground`}>
        <div className="bench-header">
          <div className="tabs">
            {['Preview', 'Code'].map((t) => (
              <button key={t} aria-pressed={view === t} onClick={() => setView(t)}>
                {t === 'Preview' ? '◇' : '‹/›'} {t}
              </button>
            ))}
          </div>
          <div className="bench-tools">
            <span className="live-caption">COMPOSED WITH KNOCK</span>
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
          <div className={`preview-stage block-stage ${theme}`}>
            <div className="stage-caption">
              <span className="stage-dot" />
              AN INVITATION TO WHAT’S NEXT
            </div>
            {view === 'Code' ? (
              <div className="full-source">
                <div>{slug}.tsx</div>
                <pre tabIndex={0} aria-label={`${name} source`}>
                  {source}
                </pre>
              </div>
            ) : (
              <div className="block-example">
                {name === 'Gated section' && (
                  <div className="section-surround">
                    <span className="eyebrow">THE PUBLIC PART</span>
                    <h3>A shared starting point.</h3>
                    <p>This part stays available to everyone.</p>
                  </div>
                )}
                <Block {...props}>
                  <PreviewContent />
                </Block>
                {name === 'Gated section' && (
                  <div className="section-surround">
                    <a href="/docs/gated-section">Explore the project notes ↗</a>
                  </div>
                )}
              </div>
            )}
            <div className="stage-bottom">
              <span>YOUR BRAND. YOUR LOGIC.</span>
              <span>{name.toUpperCase()}</span>
            </div>
          </div>
          <aside className="controls" aria-label={`${name} settings`}>
            <div className="control-title">
              Make it yours <span>↙</span>
            </div>
            <p className="control-intro">Everything stays in your hands.</p>
            <div className="control-label">Consumer visibility</div>
            <div className="segmented">
              <button ref={control} aria-pressed={!unlocked} onClick={() => setUnlocked(false)}>
                Locked
              </button>
              <button aria-pressed={unlocked} onClick={() => setUnlocked(true)}>
                Reveal
              </button>
            </div>
            <label className="control-label" htmlFor="block-state">
              Visual status
            </label>
            <select
              id="block-state"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              {['idle', 'pending', 'error', 'success'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <label className="control-label" htmlFor="block-recipient">
              Recipient
            </label>
            <input
              id="block-recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <label className="control-label" htmlFor="block-mode">
              Code mode
            </label>
            <select
              id="block-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as typeof mode)}
            >
              <option value="digits">Digits</option>
              <option value="passphrase">Passphrase</option>
            </select>
            <div className="mask-row">
              <label htmlFor="block-mask">Mask code</label>
              <button
                id="block-mask"
                role="switch"
                aria-checked={masked}
                onClick={() => setMasked(!masked)}
              >
                <span />
              </button>
            </div>
            <div className="lifecycle-buttons" style={{ marginTop: 18 }}>
              <button onClick={() => setCooldownUntil(new Date(Date.now() + 5000).toISOString())}>
                Try 5-second cooldown
              </button>
              <button onClick={() => setCooldownUntil(undefined)}>Clear cooldown</button>
            </div>
            <div className="try-paste">
              <div>CONTROLLED, ALL THE WAY</div>
              <p>Submit never unlocks. Reveal changes the demo consumer’s state.</p>
            </div>
            <button className="source-button" onClick={copy}>
              {copied ? 'Copied ✓' : 'Copy block ↗'}
            </button>
            <a className="source-button" href={`/docs/${slug}`}>
              Props & installation ↗
            </a>
          </aside>
        </div>
        <div className="bench-footer">
          <span>
            Composed from components <i />
            No verification <i />
            Accessible controls
          </span>
          <span>One file. Yours to adapt.</span>
        </div>
      </section>
      <p className="announcement" role="status">
        {message}
      </p>
      {!compact && (
        <section className="usage" id="usage">
          <div>
            <div className="eyebrow">A COMPLETE FIRST IMPRESSION</div>
            <h2>
              One block.
              <br />
              Your entire welcome.
            </h2>
            <p>{blockInfo[name].contract}</p>
            <a href={`/docs/${slug}`} className="source-button">
              Read the generated documentation ↗
            </a>
          </div>
          <div className="usage-code">
            <div>{slug}.tsx</div>
            <pre>{`<${Block.name}\n  value={value}\n  onChange={setValue}\n  onSubmit={handleSubmit}\n  status={status}\n  unlocked={unlocked}\n  recipient="Acme Co."\n>\n  <YourPreview />\n</${Block.name}>`}</pre>
          </div>
        </section>
      )}
    </>
  );
}
