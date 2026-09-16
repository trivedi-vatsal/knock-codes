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
      <p className="guide-kicker">{page === 'introduction' ? 'INTRODUCTION' : 'GETTING STARTED'}</p>
      <h1>
        {page === 'introduction' ? 'Thoughtful UI for the space before access.' : guides[page]}
      </h1>
      {page === 'introduction' && (
        <>
          <p>
            Knock is a copy-paste React and Tailwind library for private previews, launch links, and
            gated work. It handles the interface; your application keeps every access decision.
          </p>
          <div className="docs-stats" aria-label={`${items.length} library items`}>
            <span>
              <strong>{items.filter((item) => item.tier === 'blocks').length}</strong> ready-made
              blocks
            </span>
            <span>
              <strong>{items.filter((item) => item.tier === 'components').length}</strong> focused
              components
            </span>
            <span>
              <strong>0</strong> runtime dependencies
            </span>
          </div>
          <Section title="Start where you need">
            <div className="guide-links">
              <a href="/docs/get-started">
                <strong>
                  Install Knock <span>↗</span>
                </strong>
                <span>Add your first component with the shadcn CLI.</span>
              </a>
              <a href="/library">
                <strong>
                  Explore the library <span>↗</span>
                </strong>
                <span>Try blocks and components, then copy the code.</span>
              </a>
            </div>
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
          <Section title="2. Install an item">
            <Snippet code={`npx shadcn@latest add ${starter.registryUrl}`} label="terminal" />
            <p>
              The registry installs the block and its component dependencies into your project.
              Choose another item in the playground to get its install command.
            </p>
          </Section>
          <Section title="3. Connect your state">
            <p>
              Pass the input value, callbacks, and visibility from your application. Verify access
              on your server before revealing protected content.
            </p>
            <a className="docs-link" href="/docs/client-preview-gate">
              View usage and API ↗
            </a>
          </Section>
        </>
      )}
      {page === 'styling' && (
        <>
          <p className="guide-lead">Make it feel like your product.</p>
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
              <strong>llms.txt ↗</strong>
              <span>A compact index of the library.</span>
            </a>
            <a href="/llms-full.txt">
              <strong>llms-full.txt ↗</strong>
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
            Read the full item prompt ↗
          </a>
        </>
      )}
    </article>
  );
}

export function DocsPage({
  item,
  onIndex,
}: {
  item: CatalogItem;
  items?: CatalogItem[];
  onIndex: () => void;
}) {
  return (
    <article className="docs guide-page reference-page">
      <button className="docs-link" onClick={onIndex}>
        Documentation
      </button>
      <h1>{item.title}</h1>
      <p className="guide-lead">{item.meta.whenToUse}</p>
      <div className="docs-resource-links">
        <a href={`/playground/${item.name}`}>Open playground ↗</a>
        <a href={`/docs/${item.name}.md`}>Markdown ↗</a>
        <a href={`/source/${item.name}.tsx`}>Source ↗</a>
      </div>
      <Section title="Installation">
        <Snippet code={`npx shadcn@latest add ${item.registryUrl}`} label="terminal" />
      </Section>
      <Section title="Usage">
        <Snippet code={item.meta.examples.minimal} />
        <details>
          <summary>Complete example</summary>
          <Snippet code={item.meta.examples.full} />
        </details>
      </Section>
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
      </details>
      <details className="reference-details">
        <summary>Behavior & accessibility</summary>
        <p>{item.meta.contract}</p>
        <p>{item.meta.a11y}</p>
        <ul>
          {item.meta.pitfalls.map((pitfall) => (
            <li key={pitfall}>{pitfall}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}
