/** MIT License — Copyright (c) 2026 Knock contributors. */
import { useEffect, useState, type ReactNode } from 'react';
export interface CatalogProp {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  description: string;
}
export interface CatalogItem {
  name: string;
  title: string;
  tier: 'components' | 'blocks';
  version: string;
  component: string;
  props: CatalogProp[];
  dependencies: string[];
  registryUrl: string;
  meta: {
    lifecycle: 'gate' | 'unlocked' | 'ended';
    whenToUse: string;
    notFor: string;
    pitfalls: string[];
    usedBy: string[];
    contract: string;
    a11y: string;
    defaults: Record<string, string>;
    unsupportedProps: string[];
    examples: { minimal: string; full: string };
  };
}
import { guides, type Guide } from './routes';
export { guides, type Guide } from './routes';

/** Loads the generated catalog once. Tests and the index pass items in directly instead. */
export function useCatalog() {
  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    fetch('/catalog.json')
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((data) => live && setItems(data))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);
  return { items, failed };
}

/** One source of truth for section ids, so the page nav can never point at a missing anchor. */
const anchor = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="docs-section" id={anchor(title)}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Snippet({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="docs-snippet">
      <div>
        <span>{label ?? 'tsx'}</span>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export function DocsIndex({
  items,
  page = 'introduction',
}: {
  items: CatalogItem[];
  page?: Guide;
}) {
  const starter = items.find((item) => item.name === 'client-preview-gate')!;
  return (
    <article className={`docs guide-page ${page === 'introduction' ? 'docs-index' : ''}`}>
      <div className="breadcrumb">Documentation</div>
      <h1>{page === 'introduction' ? 'Knock' : guides[page]}</h1>
      {page === 'introduction' && (
        <>
          <p>
            Knock is a copy-paste React and Tailwind library for private previews, launch links, and
            gated work. It handles the interface; your application keeps every access decision.
          </p>
          <div className="docs-stats" aria-label={`${items.length} library items`}>
            <span>
              <strong>{items.filter((item) => item.tier === 'blocks').length}</strong> blocks
            </span>
            <span>
              <strong>{items.filter((item) => item.tier === 'components').length}</strong>{' '}
              components
            </span>
            <span>
              <strong>0</strong> runtime dependencies
            </span>
          </div>
          <Section title="Install or browse">
            <div className="guide-links">
              <a href="/docs/get-started">
                <strong>Install Knock</strong>
                <span>Add your first component with the shadcn CLI.</span>
              </a>
              <a href="/library">
                <strong>Browse the library</strong>
                <span>Open a playground, then copy the source.</span>
              </a>
            </div>
          </Section>
          <Section title="Choose a screen">
            {(
              [
                ['gate', 'Before access'],
                ['unlocked', 'After unlock'],
                ['ended', 'After it ends'],
              ] as const
            ).map(([lifecycle, label]) => (
              <div key={lifecycle} className="gate-chooser">
                <p className="chooser-label">{label}</p>
                <div className="guide-links">
                  {items
                    .filter((item) => item.meta.lifecycle === lifecycle)
                    .map((item) => (
                      <a key={item.name} href={`/docs/${item.name}`}>
                        <strong>{item.title}</strong>
                        <span>{item.meta.whenToUse}</span>
                      </a>
                    ))}
                </div>
              </div>
            ))}
          </Section>
          <p className="guide-note">
            Your application verifies access and owns the state. Knock provides the interface.
          </p>
        </>
      )}
      {page === 'get-started' && (
        <>
          <p className="guide-lead">Add the source directly to your project.</p>
          <Section title="1. Prepare your project">
            <p>Use React 18 or 19, Tailwind CSS 4, and a configured shadcn project.</p>
          </Section>
          <Section title="2. Add the Knock registry">
            <p>
              Knock is listed in the shadcn directory as <code>@knock-codes</code>. Add it once, in
              a project that already has <code>components.json</code>:
            </p>
            <Snippet
              label="terminal"
              code={`npx shadcn@latest registry add @knock-codes
pnpm dlx shadcn@latest registry add @knock-codes
yarn dlx shadcn@latest registry add @knock-codes
bunx --bun shadcn@latest registry add @knock-codes`}
            />
          </Section>
          <Section title="3. Install an item">
            <Snippet code={`npx shadcn@latest add @knock-codes/${starter.name}`} label="terminal" />
            <p>Or install from the item URL:</p>
            <Snippet code={`npx shadcn@latest add ${starter.registryUrl}`} label="terminal" />
            <p>
              The registry installs the block and its component dependencies into your project.
              Choose another item in the playground to get its install command.
            </p>
          </Section>
          <Section title="4. Verify on the server, then set unlocked">
            <p>
              Knock never checks a code. Submit reports the attempt. Your server decides. Then you
              set <code>unlocked</code>. <code>status=&quot;success&quot;</code> only styles the
              form.
            </p>
            <Snippet
              label="actions.ts"
              code={`'use server';

export async function checkPreviewCode(code: string) {
  const invite = await loadInvite(code);
  if (!invite) return { ok: false as const, reason: 'invalid' as const };
  if (invite.expired) return { ok: false as const, reason: 'expired' as const };
  if (invite.revoked) return { ok: false as const, reason: 'revoked' as const };
  return { ok: true as const };
}`}
            />
            <Snippet
              code={`'use client';
import { useState, type FormEvent } from 'react';
import { ClientPreviewGate } from '@/components/knock/client-preview-gate';
import { ExpiredNotice } from '@/components/knock/expired-notice';
import { RevokedNotice } from '@/components/knock/revoked-notice';
import { checkPreviewCode } from './actions';

export function Preview() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');
  const [ended, setEnded] = useState<'expired' | 'revoked' | null>(null);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('pending');
    const result = await checkPreviewCode(value);
    if (result.ok) {
      setStatus('success');
      setUnlocked(true);
      return;
    }
    setStatus('error');
    if (result.reason === 'expired' || result.reason === 'revoked') setEnded(result.reason);
  }
  if (ended === 'expired') return <ExpiredNotice value={value} onChange={setValue} onSubmit={onSubmit} status={status} unlocked={false} />;
  if (ended === 'revoked') return <RevokedNotice value={value} onChange={setValue} onSubmit={onSubmit} status={status} unlocked={false} />;
  return (
    <ClientPreviewGate value={value} onChange={setValue} onSubmit={onSubmit} status={status} unlocked={unlocked}>
      <YourPreview />
    </ClientPreviewGate>
  );
}`}
            />
          </Section>
          <Section title="5. These are not props">
            <p>
              Do not invent <code>onSuccess</code>, <code>password</code>, <code>correctCode</code>,{' '}
              <code>attempts</code>, <code>maxAttempts</code>, or <code>onUnlock</code>. Never put
              the expected code in the client. Expired and revoked are screens you choose after your
              own check, not timers inside Knock.
            </p>
            <a className="docs-link" href="/docs/client-preview-gate">
              Usage and API
            </a>
          </Section>
        </>
      )}
      {page === 'styling' && (
        <>
          <p className="guide-lead">Change theme and CSS variables.</p>
          <Section title="Theme">
            <p>
              Set the component’s theme to light or dark, or omit it to follow the system
              preference.
            </p>
            <Snippet code={'<CodeField value={code} onChange={setCode} theme="dark" />'} />
          </Section>
          <Section title="Colors">
            <p>
              Override the shared CSS variables on a parent. Keep text and controls legible when
              changing colors.
            </p>
            <Snippet
              label="css"
              code={
                '.preview {\n  --knock-bg: #fffefa;\n  --knock-ink: #30342d;\n  --knock-muted: #69725f;\n  --knock-accent: #a84d35;\n  --knock-border: #dedfd4;\n  --knock-error: #b42318;\n}'
              }
            />
          </Section>
          <p>
            You own the installed source. Edit its layout, copy, and styles to fit your project.
          </p>
        </>
      )}
      {page === 'ai-agents' && (
        <>
          <p className="guide-lead">Give your agent the actual library.</p>
          <p>
            Share the index below so your agent can find an item, read its API, and install its
            registry source.
          </p>
          <div className="guide-links">
            <a href="/llms.txt">
              <strong>llms.txt</strong>
              <span>A compact index of the library.</span>
            </a>
            <a href="/llms-full.txt">
              <strong>llms-full.txt</strong>
              <span>All contracts, examples, and source.</span>
            </a>
          </div>
          <Section title="Example task">
            <Snippet
              label="prompt"
              code={`Install Client preview gate from ${starter.registryUrl}. Read its Markdown documentation before editing. Connect my app's state using only its documented props.`}
            />
          </Section>
          <a className="docs-link" href="/prompts/client-preview-gate.md">
            Item prompt
          </a>
        </>
      )}
    </article>
  );
}

export function DocsPage({ item }: { item: CatalogItem }) {
  const related = [...item.dependencies, ...item.meta.usedBy];
  const labelDefaults = Object.entries(item.meta.defaults).filter(([name]) =>
    name.startsWith('labels.'),
  );
  return (
    <article className="docs guide-page reference-page">
      <a className="docs-link" href="/docs">
        Documentation
      </a>
      <h1>{item.title}</h1>
      <p className="guide-lead">{item.meta.whenToUse}</p>
      <div className="docs-resource-links">
        <a href={`/playground/${item.name}`}>Playground</a>
        <a href={`/docs/${item.name}.md`}>Markdown</a>
        <a href={`/source/${item.name}.tsx`}>Source</a>
      </div>
      <Section title="Not for">
        <p>{item.meta.notFor}</p>
      </Section>
      <Section title="Installation">
        <Snippet code={`npx shadcn@latest add @knock-codes/${item.name}`} label="terminal" />
        <Snippet code={`npx shadcn@latest add ${item.registryUrl}`} label="terminal" />
      </Section>
      <Section title="Usage">
        <Snippet code={item.meta.examples.minimal} />
        <details>
          <summary>Complete example</summary>
          <Snippet code={item.meta.examples.full} />
        </details>
      </Section>
      {related.length > 0 && (
        <Section title="Related">
          <ul>
            {item.dependencies.map((name) => (
              <li key={`dep-${name}`}>
                Installs <a href={`/docs/${name}`}>{name}</a>
              </li>
            ))}
            {item.meta.usedBy.map((name) => (
              <li key={`used-${name}`}>
                Used by <a href={`/docs/${name}`}>{name}</a>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <details className="reference-details">
        <summary>
          API reference <span>{item.props.length} props</span>
        </summary>
        <div className="docs-table">
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {item.props.map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code>{prop.name}</code>
                    {prop.required && <em className="docs-required">required</em>}
                  </td>
                  <td>
                    <code>{prop.type}</code>
                  </td>
                  <td>{prop.default ?? '—'}</td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {labelDefaults.length > 0 && (
          <ul>
            {labelDefaults.map(([name, value]) => (
              <li key={name}>
                <code>{name}</code> {value}
              </li>
            ))}
          </ul>
        )}
      </details>
      <details className="reference-details">
        <summary>Behavior & accessibility</summary>
        <p>{item.meta.contract}</p>
        <p>{item.meta.a11y}</p>
        <p>These are not props: {item.meta.unsupportedProps.join(', ')}.</p>
        <ul>
          {item.meta.pitfalls.map((pitfall) => (
            <li key={pitfall}>{pitfall}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}
