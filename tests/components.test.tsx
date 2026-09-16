/** MIT License — Copyright (c) 2026 Knock contributors. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { CooldownNotice } from '../registry/components/cooldown-notice';
import { RecipientLine } from '../registry/components/recipient-line';
import { ExpiryPill, getExpiryState } from '../registry/components/expiry-pill';
import { RequestAccess } from '../registry/components/request-access';
import { PreviewRibbon } from '../registry/components/preview-ribbon';
import { PreviewBar } from '../registry/components/preview-bar';
import { RelockControl } from '../registry/components/relock-control';
import { BlurVeil } from '../registry/components/blur-veil';

const deadline = '2030-01-02T12:00:00Z';
const now = Date.parse('2030-01-01T12:00:00Z');
const noop = () => {};

test('expiry boundaries and invalid input do not imply access', () => {
  assert.equal(getExpiryState(deadline, now - 1), 'fine');
  assert.equal(getExpiryState(deadline, now), 'soon');
  assert.equal(getExpiryState(deadline, Date.parse(deadline)), 'expired');
  assert.equal(getExpiryState('invalid', now), 'invalid');
});

test('every component supports deterministic server render in both themes', () => {
  for (const theme of ['light', 'dark'] as const) {
    const cases = [
      <CooldownNotice cooldownUntil={deadline} theme={theme} />,
      <RecipientLine recipient="Acme" theme={theme} />,
      <ExpiryPill expiresAt={deadline} theme={theme} />,
      <RequestAccess onRequestAccess={noop} theme={theme} />,
      <PreviewRibbon theme={theme} />,
      <PreviewBar buildLabel="v1" onRelock={noop} expiresAt={deadline} theme={theme} />,
      <RelockControl onRelock={noop} theme={theme} />,
      <BlurVeil unlocked={false} prompt="Invitation" theme={theme}>
        <button>Preview action</button>
      </BlurVeil>,
    ];
    for (const element of cases) assert.equal(renderToString(element), renderToString(element));
  }
  const locked = renderToString(
    <BlurVeil unlocked={false} prompt="Invitation">
      <button>Preview action</button>
    </BlurVeil>,
  );
  assert.match(locked, /inert=""/);
  assert.match(locked, /aria-hidden="true"/);
  const unlocked = renderToString(
    <BlurVeil unlocked prompt="Invitation">
      <button>Preview action</button>
    </BlurVeil>,
  );
  assert.doesNotMatch(unlocked, /inert|Invitation/);
  assert.match(unlocked, /Preview action/);
  assert.doesNotMatch(
    renderToString(<RequestAccess requestAccessHref="javascript:alert(1)" />),
    /href=/,
  );
  assert.match(
    renderToString(<PreviewBar buildLabel="v1" onRelock={noop} expiresAt="invalid" />),
    /Expiry unavailable/,
  );
});

test('actions, countdown transition, inert and focus transfer, and per-item structural a11y', async () => {
  const dom = new JSDOM(
    '<!doctype html><html lang="en"><head><title>Components</title></head><body><main id="root"></main></body></html>',
    { pretendToBeVisual: true },
  );
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const { createRoot } = await import('react-dom/client');
  const axe = (await import('axe-core')).default;
  const host = document.getElementById('root')!;
  const root = createRoot(host);
  let actions = 0;
  const action = () => {
    actions++;
  };
  const render = async (element: React.ReactNode) => {
    await act(async () => root.render(element));
  };
  const click = async (name: string) => {
    const button = Array.from(host.getElementsByTagName('button')).find((b) =>
      b.textContent?.includes(name),
    );
    assert.ok(button);
    await act(async () => button.click());
  };
  const audit = async () => {
    const result = await axe.run(host, { rules: { 'color-contrast': { enabled: false } } });
    assert.deepEqual(
      result.violations.map((v) => v.id),
      [],
    );
  };
  await render(<RequestAccess onRequestAccess={action} />);
  await click('Request access');
  assert.equal(actions, 1);
  await audit();
  await render(
    <RequestAccess requestAccessHref="mailto:studio@example.com" onRequestAccess={action} />,
  );
  assert.equal(
    host.getElementsByTagName('a')[0]?.getAttribute('href'),
    'mailto:studio@example.com',
  );
  assert.equal(host.getElementsByTagName('button').length, 0);
  await render(<RelockControl onRelock={action} />);
  await click('Relock preview');
  assert.equal(actions, 2);
  await audit();
  await render(<RelockControl onRelock={action} disabled />);
  await click('Relock preview');
  assert.equal(actions, 2);
  await render(<PreviewBar buildLabel="v2" onRelock={action} onFeedback={action} />);
  await click('Send feedback');
  await click('Relock preview');
  assert.equal(actions, 4);
  await audit();
  await render(<RecipientLine recipient="Acme" />);
  assert.match(host.textContent!, /Prepared forAcme/);
  await audit();
  await render(<PreviewRibbon labels={{ draft: 'Brouillon', description: 'Aperçu privé' }} />);
  assert.match(host.textContent!, /Brouillon/);
  await audit();
  const originalNow = Date.now;
  let time = now;
  Date.now = () => time;
  try {
    await render(<CooldownNotice cooldownUntil={new Date(now + 1000).toISOString()} />);
    assert.match(host.textContent!, /0:01/);
    await audit();
    time = now + 2000;
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1050));
    });
    assert.match(host.textContent!, /Ready when you are/);
    assert.equal(actions, 4, 'countdown cannot trigger consumer actions');
    await render(<CooldownNotice cooldownUntil="invalid" />);
    assert.match(host.textContent!, /Retry time is unavailable/);
    for (const offset of [3 * 86400000, 3600000, -1000]) {
      await render(<ExpiryPill key={offset} expiresAt={new Date(time + offset).toISOString()} />);
      assert.match(
        host.textContent!,
        offset < 0 ? /Preview expired/ : offset < 86400000 ? /Expiring soon/ : /Preview available/,
      );
      await audit();
    }
  } finally {
    Date.now = originalNow;
  }
  await render(
    <BlurVeil unlocked={false} prompt={<button>Reveal preview</button>}>
      <button>Hidden action</button>
    </BlurVeil>,
  );
  const region = host.querySelector('[role="region"]')!;
  assert.equal(document.activeElement, region);
  const hidden = Array.from(host.getElementsByTagName('button')).find(
    (b) => b.textContent === 'Hidden action',
  )!;
  assert.ok(hidden.closest('[inert]'));
  await audit();
  await render(
    <BlurVeil unlocked prompt={<button>Reveal preview</button>}>
      <button>Hidden action</button>
    </BlurVeil>,
  );
  assert.equal(host.querySelector('[inert]'), null);
  assert.ok(document.activeElement?.contains(host.getElementsByTagName('button')[0]));
  assert.doesNotMatch(host.textContent!, /Reveal preview/);
  await audit();
  await act(async () => root.unmount());
  dom.window.close();
});
