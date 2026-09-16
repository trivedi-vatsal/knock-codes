/** MIT License — Copyright (c) 2026 Knock contributors. Development-only rendered a11y audit. */
import { useEffect, useRef, useState, type ComponentType } from 'react';
import axe from 'axe-core';
const modules = import.meta.glob('../registry/**/*.tsx', { eager: true }) as Record<
  string,
  Record<string, unknown>
>;
const cases = Object.entries(modules).flatMap(([file, exports]) => {
  const entry = Object.entries(exports).find(
    ([name, value]) => /^[A-Z]/.test(name) && typeof value === 'function',
  );
  if (!entry) return [];
  return (['light', 'dark'] as const).flatMap((theme) =>
    (['idle', 'pending', 'error', 'success', 'unlocked'] as const).map((status) => ({
      name: entry[0],
      Component: entry[1] as ComponentType<any>,
      theme,
      status,
      file,
    })),
  );
});
export default function BrowserAudit() {
  const [index, setIndex] = useState(-1);
  const [results, setResults] = useState<
    { name: string; theme: string; status: string; violations: unknown[] }[]
  >([]);
  const host = useRef<HTMLDivElement>(null);
  const item = cases[index];
  useEffect(() => {
    if (!item || !host.current) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const report = await axe.run(host.current!, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      });
      if (cancelled) return;
      setResults((previous) => [
        ...previous,
        {
          name: item.name,
          theme: item.theme,
          status: item.status,
          violations: report.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.map((n) => ({ html: n.html, message: n.failureSummary })),
          })),
        },
      ]);
      setIndex((current) => current + 1);
    }, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [index]);
  const failures = results.filter((r) => r.violations.length);
  return (
    <main style={{ margin: 0, padding: 30 }}>
      <h1>Rendered accessibility audit</h1>
      <p>
        WCAG A / AA checks, including browser-rendered color contrast. Every registry item, both
        themes, every visual state and unlocked content.
      </p>
      <button
        className="source-button"
        disabled={index >= 0 && index < cases.length}
        onClick={() => {
          setResults([]);
          setIndex(0);
        }}
      >
        Run browser audit
      </button>
      <p role="status">
        {results.length} / {cases.length} checked. {failures.length} failures.{' '}
        {index >= cases.length ? 'Audit complete.' : ''}
      </p>
      {item && (
        <div
          ref={host}
          style={{
            background: item.theme === 'dark' ? '#293028' : '#fffefa',
            padding: 30,
            maxWidth: 650,
          }}
        >
          <item.Component
            value="48219930"
            onChange={() => {}}
            onSubmit={(event: React.FormEvent) => event.preventDefault()}
            status={item.status === 'unlocked' ? 'idle' : item.status}
            unlocked={item.status === 'unlocked'}
            theme={item.theme}
            error="Please check your code."
            label="Access code"
            autoFocus={false}
            recipient="Acme Co."
            expiresAt="2030-01-01T12:00:00Z"
            cooldownUntil={
              item.name === 'CooldownScreen' || item.name === 'CooldownNotice'
                ? '2030-01-01T12:00:00Z'
                : undefined
            }
            buildLabel="v1"
            onRelock={() => {}}
            onFeedback={() => {}}
            onRequestAccess={() => {}}
            prompt={<button className="source-button">Reveal preview</button>}
          >
            <p style={{ color: item.theme === 'dark' ? '#f0f3e9' : '#30382c' }}>
              The preview content.
            </p>
          </item.Component>
        </div>
      )}
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
        {JSON.stringify(failures, null, 2)}
      </pre>
    </main>
  );
}
