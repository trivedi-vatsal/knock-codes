/** MIT License — Copyright (c) 2026 Knock contributors. */
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { ComponentDemo, componentInfo } from './component-demo';
import { BlockDemo, blockInfo, blocks } from './block-demo';
import { DocsIndex, DocsPage, useCatalog, guides } from './docs-view';
import { Library } from './library-view';
import { Home } from './home-view';
const itemInfo = { ...componentInfo, ...blockInfo };
import { parseRoute, pathFor, slugOf, pageMetadata, type Route, type View } from './routes';
const readRoute = () => parseRoute(location.pathname, Object.keys(itemInfo));

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    copy: (
      <>
        <rect x="8" y="8" width="12" height="13" rx="2" />
        <path d="M16 8V3H3v13h5" />
      </>
    ),
    code: (
      <>
        <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 20" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
    moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    reset: (
      <>
        <path d="M4 9a8 8 0 1 1 0 6M4 3v6h6" />
      </>
    ),
    book: (
      <>
        <path d="M12 5v16M3 3c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2Z" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    diamond: <path d="m12 2 10 10-10 10L2 12Z" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
    key: (
      <>
        <circle cx="8" cy="9" r="5" />
        <path d="m12 13 8 8m-5-5 3-3m-1 5 3-3" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.diamond}
    </svg>
  );
}
function App() {
  const [{ selected, view, guide = 'introduction' }, setRoute] = useState<Route>(readRoute);
  const hasSidebar = ['playground', 'docs', 'guide'].includes(view);
  const { items, failed } = useCatalog();
  const documented = items?.find((item) => item.name === slugOf(selected));
  useEffect(() => {
    const meta = pageMetadata({ selected, view, guide });
    document.title = meta.title;
    for (const [selector, content] of [
      ['meta[name="description"]', meta.description],
      ['meta[property="og:title"]', meta.title],
      ['meta[property="og:description"]', meta.description],
      ['meta[property="og:url"]', meta.url],
      ['meta[name="twitter:title"]', meta.title],
      ['meta[name="twitter:description"]', meta.description],
      ['meta[name="robots"]', view === 'not-found' ? 'noindex, follow' : 'index, follow'],
    ])
      document.querySelector(selector)?.setAttribute('content', content);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (view === 'not-found') canonical?.removeAttribute('href');
    else canonical?.setAttribute('href', meta.url);
  }, [selected, view, guide]);
  useEffect(() => {
    const initial = readRoute();
    if (initial.view !== 'not-found' && location.pathname + location.search !== pathFor(initial))
      history.replaceState(null, '', pathFor(initial));
    const sync = () => setRoute(readRoute());
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, []);
  const navigate = (nextView: View, nextSelected = selected) => {
    const next = { selected: nextSelected, view: nextView };
    setRoute(next);
    setMobileNav(false);
    window.scrollTo(0, 0);
    history.pushState(null, '', pathFor(next));
  };
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => {
    if (!mobileNav) return;
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setMobileNav(false);
    addEventListener('keydown', close);
    return () => removeEventListener('keydown', close);
  }, [mobileNav]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);
  const [copyFallback, setCopyFallback] = useState('');
  const [announcement, setAnnouncement] = useState('');
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFallback('');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyFallback(text);
      setAnnouncement(
        'Clipboard unavailable. The text is shown below the page title for manual copying.',
      );
    }
  }
  return (
    <div
      className={`app ${view === 'not-found' ? 'library-app not-found-app' : view === 'home' ? 'library-app home-app' : view === 'library' ? 'library-app' : view === 'playground' ? 'playground-app' : 'docs-app'}`}
    >
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <a href="/" className="brand" aria-label="Knock home">
          <span className="brandmark">
            <i />
            <i />
            <i />
          </span>
          knock<span className="brand-period">.</span>
        </a>
        <div className="header-divider" />
        <span className="header-caption">
          {view === 'not-found'
            ? 'Page not found'
            : view === 'playground'
              ? 'Playground'
              : view === 'home'
                ? 'UI for private previews'
                : view === 'library'
                  ? 'The UI collection'
                  : 'Documentation'}
        </span>
        <div className="header-right">
          <nav className="primary-nav" aria-label="Main navigation">
            <a href="/library" aria-current={view === 'library' ? 'page' : undefined}>
              {view === 'playground' ? '← All items' : 'Library'}
            </a>
            <a href="/docs" aria-current={view === 'guide' || view === 'docs' ? 'page' : undefined}>
              Docs
            </a>
          </nav>
          <button
            className="mobile-menu"
            hidden={!hasSidebar}
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
            aria-expanded={mobileNav}
            aria-controls="library-navigation"
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
      {mobileNav && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}
      {hasSidebar && (
        <aside
          id="library-navigation"
          aria-label={view === 'playground' ? 'Component catalog' : 'Documentation navigation'}
          className={`sidebar ${mobileNav ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}
        >
          <div className="sidebar-heading">
            <span>Navigation</span>
            <button
              className="sidebar-collapse"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!sidebarCollapsed}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name="chevron" size={15} />
            </button>
          </div>
          {view !== 'playground' ? (
            <>
              <div className="nav-heading">GETTING STARTED</div>
              {Object.entries(guides).map(([slug, label], index) => (
                <a
                  key={slug}
                  className={`nav-item nav-button guide-nav-item ${view === 'guide' && guide === slug ? 'active' : ''}`}
                  aria-current={view === 'guide' && guide === slug ? 'page' : undefined}
                  title={label}
                  href={slug === 'introduction' ? '/docs' : `/docs/${slug}`}
                >
                  <Icon name={['book', 'download', 'sun', 'code'][index]} size={16} />
                  {label}
                </a>
              ))}
              <div className="guide-nav-footer">
                <a href="/library">
                  Browse components <span>↗</span>
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="nav-heading">
                COMPONENTS <span>{String(Object.keys(componentInfo).length).padStart(2, '0')}</span>
              </div>
              {Object.keys(componentInfo).map((item) => (
                <a
                  key={item}
                  href={pathFor({ selected: item, view: 'playground' })}
                  title={item}
                  className={`nav-item nav-button ${selected === item ? 'active' : ''}`}
                  aria-current={selected === item ? 'page' : undefined}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    navigate('playground', item);
                  }}
                >
                  <Icon name={componentInfo[item].icon} size={16} />
                  {item}
                  {selected === item && <span className="live-dot" />}
                </a>
              ))}
              <div className="nav-heading blocks-heading">
                BLOCKS <span>{String(Object.keys(blocks).length).padStart(2, '0')}</span>
              </div>
              {Object.keys(blocks).map((item) => (
                <a
                  href={pathFor({ selected: item, view: 'playground' })}
                  title={item}
                  className={`nav-item nav-button block-item ${selected === item ? 'active' : ''}`}
                  key={item}
                  aria-current={selected === item ? 'page' : undefined}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    navigate('playground', item);
                  }}
                >
                  <span className="block-symbol">▦</span>
                  {item}
                </a>
              ))}
            </>
          )}
        </aside>
      )}
      <main id="main" className={hasSidebar && sidebarCollapsed ? 'sidebar-collapsed' : ''}>
        {view === 'not-found' ? (
          <section className="not-found">
            <span className="eyebrow">404 / A CLOSED DOOR</span>
            <h1>This page stepped out.</h1>
            <p>
              The link may have changed, or the page never lived here.
              <br />
              There’s still plenty to explore.
            </p>
            <div className="home-actions">
              <a className="home-primary" href="/library">
                Explore the library ↗
              </a>
              <a href="/">Back home</a>
            </div>
          </section>
        ) : view === 'home' ? (
          <Home />
        ) : view === 'library' ? (
          <Library />
        ) : view !== 'playground' ? (
          failed ? (
            <p className="docs-loading">
              The generated catalog could not be loaded. Run <code>npm run generate</code> and
              reload.
            </p>
          ) : !items ? (
            <p className="docs-loading">Loading the generated catalog…</p>
          ) : view === 'guide' || !documented ? (
            <DocsIndex items={items} page={guide} />
          ) : (
            <DocsPage item={documented} />
          )
        ) : (
          <>
            <div className="playground-heading">
              <div>
                <span className="eyebrow">{blocks[selected] ? 'BLOCK' : 'COMPONENT'}</span>
                <h1>{selected}</h1>
              </div>
              <div className="playground-actions">
                <a href={`/docs/${slugOf(selected)}`}>Usage & API ↗</a>
                {documented && (
                  <button
                    className="install-action"
                    onClick={() => copy(`npx shadcn@latest add ${documented.registryUrl}`)}
                  >
                    {copied ? 'Copied ✓' : 'Copy install command'}
                  </button>
                )}
              </div>
            </div>
            {copyFallback && (
              <div className="copy-fallback">
                <p>Clipboard unavailable. Select and copy:</p>
                <pre tabIndex={0}>{copyFallback}</pre>
              </div>
            )}
            {blocks[selected] ? (
              <BlockDemo compact key={selected} name={selected} theme={theme} setTheme={setTheme} />
            ) : (
              <ComponentDemo
                compact
                key={selected}
                name={selected}
                theme={theme}
                setTheme={setTheme}
              />
            )}
          </>
        )}
        <div role="status" className="announcement">
          {announcement}
        </div>
        <footer className="page-footer site-footer">
          <div>
            <span className="footer-signoff">Thoughtful at the threshold.</span>
            <p>Knock · copy-paste UI for private previews · MIT licensed</p>
          </div>
          <nav aria-label="Knock">
            <a href="/docs">Docs</a>
            <a href="https://github.com/trivedi-vatsal/knock-codes">GitHub ↗</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
if (import.meta.env.DEV && location.pathname === '/audit') {
  import('./browser-audit').then(({ default: BrowserAudit }) =>
    createRoot(document.getElementById('root')!).render(<BrowserAudit />),
  );
} else {
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
