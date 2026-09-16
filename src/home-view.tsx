/** MIT License — Copyright (c) 2026 Knock contributors. */
import { useEffect, useRef, useState } from 'react';
import { ClientPreviewGate } from '../registry/blocks/client-preview-gate';

export function Home() {
  const demo = useRef<HTMLDivElement>(null);
  const [demoActive, setDemoActive] = useState(false);
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    if (demoActive) demo.current?.querySelector('input')?.focus({ preventScroll: true });
  }, [demoActive]);
  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-copy">
          <p className="eyebrow">UI FOR PRIVATE PREVIEWS</p>
          <h1 id="home-title">
            Good work deserves
            <br />a thoughtful welcome.
          </h1>
          <p className="home-lead">
            Give your next client preview a front door that feels like you. Copy-paste React
            components for access screens, invitations, and the draft on the other side.
          </p>
          <div className="home-actions">
            <a className="home-primary" href="/library">
              Explore the library <span>↗</span>
            </a>
            <a href="/docs/get-started">Get started</a>
          </div>
          <p className="home-facts">
            React + Tailwind <span>·</span> Install with shadcn <span>·</span> Yours to customize
          </p>
        </div>
        <div className="home-example">
          <div className="home-example-label">
            <span>THE FIRST IMPRESSION</span>
            <span>01 / CLIENT PREVIEW</span>
          </div>
          <div ref={demo} inert={!demoActive}>
            <ClientPreviewGate
              value={value}
              onChange={setValue}
              onSubmit={(event) => {
                event.preventDefault();
                setUnlocked(true);
              }}
              status="idle"
              unlocked={unlocked}
              theme="light"
              recipient="Acme Co."
              logo={<strong className="home-studio">atelier</strong>}
              heading="A first look, just for you."
              description="Your next chapter is ready. Come take a look."
              requestAccessHref="/docs/get-started"
              onRelock={() => {
                setUnlocked(false);
                setValue('');
              }}
              buildLabel="Concept 01"
              labels={{
                hint: 'Try any code to explore this example.',
                submit: 'Open the preview',
                footer: 'Prepared with care. Shared in confidence.',
              }}
            >
              <div className="home-open-preview">
                <span>ACME / CONCEPT 01</span>
                <h2>
                  Room for
                  <br />
                  what comes next.
                </h2>
                <p>
                  You’re looking at a draft. A place to explore, discuss, and shape the next
                  direction together.
                </p>
                <button
                  onClick={() => {
                    setUnlocked(false);
                    setValue('');
                  }}
                >
                  Relock this example ↗
                </button>
              </div>
            </ClientPreviewGate>
          </div>
          <div className="home-demo-note">
            {demoActive ? (
              'Interactive example. Any code opens this demo.'
            ) : (
              <button onClick={() => setDemoActive(true)}>Try the interactive example ↗</button>
            )}
          </div>
        </div>
      </section>
      <section className="home-how" aria-labelledby="home-how-title">
        <div className="home-section-heading">
          <p className="eyebrow">FROM FIRST HELLO TO FINAL REVIEW</p>
          <h2 id="home-how-title">A small library for the whole preview.</h2>
        </div>
        <div className="home-steps">
          <div>
            <span>01 / CHOOSE</span>
            <h3>Start with the screen.</h3>
            <p>
              Use a complete client gate, a quick staging screen, or individual components to build
              your own.
            </p>
          </div>
          <div>
            <span>02 / MAKE IT YOURS</span>
            <h3>Bring your own identity.</h3>
            <p>
              Install the source with shadcn. Change the colors, copy, and branding directly in your
              project.
            </p>
          </div>
          <div>
            <span>03 / KEEP THE CONTEXT</span>
            <h3>Go beyond the unlock.</h3>
            <p>
              Keep draft labels, build details, feedback, and relock controls alongside the work
              being reviewed.
            </p>
          </div>
        </div>
      </section>
      <aside className="home-contract">
        <div>
          <h2>The interface is ours. Access is yours.</h2>
          <p>
            Knock provides controlled UI. Your application verifies codes and decides who can see
            the preview.
          </p>
        </div>
        <a href="/docs">How Knock fits your app ↗</a>
      </aside>
    </div>
  );
}
