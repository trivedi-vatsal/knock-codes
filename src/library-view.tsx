/** MIT License — Copyright (c) 2026 Knock contributors. Visual catalog using the published UI. */
import { useState, type HTMLAttributes } from 'react';
import { blocks, blockInfo } from './block-demo';
import { componentInfo } from './component-demo';
import { CodeField } from '../registry/components/code-field';
import { CooldownNotice } from '../registry/components/cooldown-notice';
import { RecipientLine } from '../registry/components/recipient-line';
import { ExpiryPill } from '../registry/components/expiry-pill';
import { RequestAccess } from '../registry/components/request-access';
import { PreviewRibbon } from '../registry/components/preview-ribbon';
import { PreviewBar } from '../registry/components/preview-bar';
import { RelockControl } from '../registry/components/relock-control';
import { BlurVeil } from '../registry/components/blur-veil';
const noop = () => {};
const blockNames = [
  'Client preview gate',
  ...Object.keys(blockInfo).filter((name) => name !== 'Client preview gate'),
];
const entries = [...blockNames, ...Object.keys(componentInfo)];
const slugOf = (name: string) => name.toLowerCase().replaceAll(' ', '-');
function SampleWork() {
  return (
    <div className="collection-draft">
      <span>ATELIER / COLLECTION 01</span>
      <h3>A new perspective.</h3>
      <div className="collection-art">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
function Thumbnail({ name, deadline, expiry }: { name: string; deadline: string; expiry: string }) {
  const Block = blocks[name];
  if (Block)
    return (
      <Block
        value=""
        onChange={noop}
        onSubmit={(event) => event.preventDefault()}
        status="idle"
        unlocked={name === 'Preview chrome'}
        theme="light"
        recipient={name === 'Client preview gate' ? 'Acme Co.' : undefined}
        expiresAt={expiry}
        cooldownUntil={name === 'Cooldown screen' ? deadline : undefined}
        onRequestAccess={noop}
        onRelock={noop}
        onFeedback={noop}
        logo={
          name === 'Client preview gate' ? (
            <strong className="thumbnail-brand">atelier</strong>
          ) : undefined
        }
      >
        <SampleWork />
      </Block>
    );
  switch (name) {
    case 'Code field':
      return (
        <div className="thumbnail-field">
          <CodeField
            value="4821"
            onChange={noop}
            theme="light"
            label="Your access code"
            autoFocus={false}
          />
        </div>
      );
    case 'Cooldown notice':
      return <CooldownNotice cooldownUntil={deadline} theme="light" />;
    case 'Recipient line':
      return <RecipientLine recipient="Acme Co." theme="light" />;
    case 'Expiry pill':
      return <ExpiryPill expiresAt={expiry} theme="light" />;
    case 'Request access':
      return <RequestAccess onRequestAccess={noop} theme="light" />;
    case 'Preview ribbon':
      return (
        <div>
          <PreviewRibbon theme="light" />
          <SampleWork />
        </div>
      );
    case 'Preview bar':
      return (
        <div>
          <SampleWork />
          <PreviewBar buildLabel="acme-v2" onRelock={noop} onFeedback={noop} theme="light" />
        </div>
      );
    case 'Relock control':
      return <RelockControl onRelock={noop} theme="light" />;
    case 'Blur veil':
      return (
        <BlurVeil unlocked={false} theme="light" prompt={<strong>Your first look awaits.</strong>}>
          <SampleWork />
        </BlurVeil>
      );
  }
}
export function Library() {
  const [filter, setFilter] = useState('All items');
  const [query, setQuery] = useState('');
  const [deadline] = useState(() => new Date(Date.now() + 15 * 60000).toISOString());
  const [expiry] = useState(() => new Date(Date.now() + 3 * 86400000).toISOString());
  const shown = entries.filter(
    (name) =>
      (filter === 'All items' || Boolean(blocks[name]) === (filter === 'Blocks')) &&
      name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className="collection">
      <div className="collection-heading">
        <div>
          <span className="eyebrow">THE KNOCK LIBRARY</span>
          <h1>A better first look.</h1>
          <p>Copy-paste UI for the invitation, the preview, and everything after.</p>
        </div>
        <a className="collection-guide" href="/docs/get-started">
          Start building <span>↗</span>
        </a>
      </div>
      <div className="collection-toolbar">
        <div className="collection-filters" aria-label="Filter library">
          {['All items', 'Blocks', 'Components'].map((label) => (
            <button key={label} aria-pressed={filter === label} onClick={() => setFilter(label)}>
              {label}
              <span>
                {label === 'All items'
                  ? entries.length
                  : label === 'Blocks'
                    ? blockNames.length
                    : Object.keys(componentInfo).length}
              </span>
            </button>
          ))}
        </div>
        <label className="collection-search">
          <span className="sr-only">Search library</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="6" />
            <path d="m15 15 5 5" />
          </svg>
          <input
            type="search"
            placeholder="Find a component…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <p className="collection-count" role="status">
        {shown.length} {shown.length === 1 ? 'item' : 'items'}{' '}
        <span>Choose one to explore and customize</span>
      </p>
      <div className="collection-grid">
        {shown.map((name) => (
          <article className="collection-card" key={name}>
            <div
              className={`collection-preview ${blocks[name] ? 'block-thumbnail' : 'component-thumbnail'}`}
              aria-hidden="true"
              {...({ inert: true } as HTMLAttributes<HTMLDivElement>)}
            >
              <div className="thumbnail-content">
                <Thumbnail name={name} deadline={deadline} expiry={expiry} />
              </div>
            </div>
            <a className="collection-item-link" href={`/playground/${slugOf(name)}`}>
              <span>
                <small>{blocks[name] ? 'BLOCK' : 'COMPONENT'}</small>
                <h2>{name}</h2>
              </span>
              <span className="collection-open" aria-hidden="true">
                ↗
              </span>
            </a>
          </article>
        ))}
      </div>
      {!shown.length && (
        <div className="collection-empty">
          <h2>No matching items.</h2>
          <p>Try another name, or browse the whole collection.</p>
          <button
            onClick={() => {
              setQuery('');
              setFilter('All items');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
