/** MIT License — Copyright (c) 2026 Knock contributors. */

const bentoItems = [
  {
    className: 'home-bento-gate',
    graphic: 'quick-gate',
    href: '/playground/quick-gate',
    name: 'Quick gate',
    kind: 'Block',
    note: 'One field. For staging and internal links.',
  },
  {
    className: 'home-bento-code',
    graphic: 'code-field',
    href: '/playground/code-field',
    name: 'Code field',
    kind: 'Component',
    note: 'Digit or passphrase entry. Paste from email.',
  },
  {
    className: 'home-bento-cool',
    graphic: 'cooldown',
    href: '/playground/cooldown-notice',
    name: 'Cooldown notice',
    kind: 'Component',
    note: 'A retry countdown. It never submits or locks you out.',
  },
  {
    className: 'home-bento-chrome',
    graphic: 'preview-chrome',
    href: '/playground/preview-chrome',
    name: 'Preview chrome',
    kind: 'Block',
    note: 'Draft ribbon and bar around unlocked work.',
  },
  {
    className: 'home-bento-ended',
    graphic: 'expired-invitation',
    href: '/playground/expired-notice',
    name: 'Expired notice',
    kind: 'Block',
    note: 'The invitation window has closed. Ask for a new link.',
  },
];

function HomeBento() {
  return (
    <section className="home-bento-section" aria-labelledby="home-bento-title">
      <div className="home-registry-heading">
        <div>
          <h2 id="home-bento-title">
            Small details.
            <br />A complete entrance.
          </h2>
        </div>
        <div>
          <p>
            From the first code to the final review.
            <br />
            Start with the pieces your project needs.
          </p>
          <a href="/library">View all 19 items</a>
        </div>
      </div>
      <div className="home-bento">
        {bentoItems.map((item) => (
          <a key={item.href} className={`home-bento-tile ${item.className}`} href={item.href}>
            <div className="home-bento-art">
              <img
                src={`/graphics/${item.graphic}.svg`}
                alt=""
                width={
                  item.graphic === 'preview-chrome'
                    ? 640
                    : item.graphic === 'expired-invitation'
                      ? 360
                      : 480
                }
                height={
                  item.graphic === 'quick-gate'
                    ? 300
                    : item.graphic === 'preview-chrome' || item.graphic === 'expired-invitation'
                      ? 220
                      : 160
                }
                loading="lazy"
              />
            </div>
            <span>{item.kind}</span>
            <strong>{item.name}</strong>
            <p>{item.note}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export function Home() {
  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-copy">
          <h1 id="home-title">
            Your work.
            <br />A little more
            <br />
            private.
          </h1>
          <p className="home-lead">
            React components for work you’re not ready to make public. Add access screens,
            invitations, and draft labels. Keep the source in your project.
          </p>
          <div className="home-actions">
            <a className="home-primary" href="/library">
              Explore the library
            </a>
            <a href="/docs/get-started">Get started</a>
          </div>
          <p className="home-hero-note">Your code. Your branding. Your app handles access.</p>
        </div>
        <figure className="home-hero-art">
          <img
            src="/graphics/private-entrance.svg"
            alt=""
            width="560"
            height="520"
            fetchPriority="high"
          />
          <figcaption>Access screens and draft chrome</figcaption>
        </figure>
        <div className="home-hero-specs">
          <span>
            <strong>19</strong> blocks &amp; components
          </span>
          <span>React + Tailwind</span>
          <span>Install with shadcn</span>
          <span>MIT licensed</span>
        </div>
      </section>
      <HomeBento />
      <section className="home-how" aria-labelledby="home-how-title">
        <div className="home-section-heading">
          <div>
            <h2 id="home-how-title">
              Nine blocks.
              <br />
              Ten components.
              <br />
              Make them yours.
            </h2>
          </div>
          <div className="home-how-intro">
            <p>
              A complete screen or just the missing piece. Bring it into your project, make it fit,
              and share the work in progress.
            </p>
            <a href="/docs/get-started">Start building</a>
          </div>
        </div>
        <ol className="home-steps">
          <li>
            <div className="home-step-label">
              <span>01</span> The starting point
            </div>
            <img src="/graphics/choose-screen.svg" alt="" width="320" height="160" loading="lazy" />
            <h3>Pick your pieces</h3>
            <p>
              A ready-made client gate, a staging screen, or individual components for a flow of
              your own.
            </p>
            <a href="/library">Explore the library</a>
          </li>
          <li>
            <div className="home-step-label">
              <span>02</span> In your codebase
            </div>
            <img src="/graphics/edit-source.svg" alt="" width="320" height="160" loading="lazy" />
            <h3>Make it feel like you</h3>
            <p>
              Install with shadcn. The source lives in your project—ready for your colors, copy, and
              branding.
            </p>
            <a href="/docs/styling">Make it your own</a>
          </li>
          <li>
            <div className="home-step-label">
              <span>03</span> Ready for feedback
            </div>
            <img src="/graphics/review-draft.svg" alt="" width="320" height="160" loading="lazy" />
            <h3>Give the draft context</h3>
            <p>
              Keep draft labels, build names, feedback, and relock controls alongside the work being
              reviewed.
            </p>
            <a href="/playground/preview-chrome">Try preview chrome</a>
          </li>
        </ol>
      </section>
      <aside className="home-contract">
        <div>
          <h2>Knock is UI only</h2>
          <p>
            Knock provides controlled UI. Your application verifies codes and decides who can see
            the preview.
          </p>
        </div>
        <a href="/docs">How access works</a>
      </aside>
    </div>
  );
}
