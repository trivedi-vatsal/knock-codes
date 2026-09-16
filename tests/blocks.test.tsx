/** MIT License — Copyright (c) 2026 Knock contributors. */
import assert from 'node:assert/strict';
import type { AxeResults } from 'axe-core';
import { test } from 'node:test';
import { readdirSync } from 'node:fs';
import React, { act, type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import type { ClientPreviewGateProps } from '../registry/blocks/client-preview-gate';
const items = await Promise.all(
  readdirSync('registry/blocks')
    .filter((f) => f.endsWith('.tsx'))
    .map(async (file) => ({
      name: file,
      Block: Object.values(await import(`../registry/blocks/${file}`)).find(
        (v) => typeof v === 'function',
      ) as ComponentType<ClientPreviewGateProps>,
    })),
);
const noop = () => {};
const base: ClientPreviewGateProps = {
  value: '',
  onChange: noop,
  onSubmit: noop,
  status: 'idle',
  unlocked: false,
};
test('every block renders every state in both themes; success alone never unlocks', () => {
  for (const { name, Block } of items)
    for (const status of ['idle', 'pending', 'error', 'success'] as const)
      for (const theme of ['light', 'dark'] as const) {
        const element = (
          <Block {...base} theme={theme} status={status} error="Check the invitation">
            UNLOCKED-CONTENT
          </Block>
        );
        const html = renderToString(element);
        assert.equal(html, renderToString(element), name);
        if (name === 'teaser-gate.tsx') {
          assert.match(html, /inert=""/);
          assert.match(html, /aria-hidden="true"/);
        } else assert.doesNotMatch(html, /UNLOCKED-CONTENT/, name);
        const revealed = renderToString(
          <Block {...base} theme={theme} status={status} unlocked>
            UNLOCKED-CONTENT
          </Block>,
        );
        assert.match(revealed, /UNLOCKED-CONTENT/, name);
        assert.doesNotMatch(revealed, /inert=""/);
      }
});
test('all blocks pass structural a11y and transfer focus when unlocked', async () => {
  const dom = new JSDOM(
    '<!doctype html><html lang="en"><head><title>Blocks</title></head><body><main id="root"></main></body></html>',
    { pretendToBeVisual: true },
  );
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    requestAnimationFrame: (cb: () => void) => {
      cb();
      return 0;
    },
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const { createRoot } = await import('react-dom/client');
  const axe = (await import('axe-core')).default;
  const host = document.getElementById('root')!;
  const root = createRoot(host);
  for (const { name, Block } of items) {
    for (const status of ['idle', 'pending', 'error', 'success'] as const) {
      await act(async () =>
        root.render(
          <Block
            {...base}
            key={name}
            status={status}
            heading="Preview invitation"
            error="Check your code"
            recipient="Acme"
            onRequestAccess={noop}
            onRelock={noop}
          >
            <h2>Revealed work</h2>
          </Block>,
        ),
      );
      let result!: AxeResults;
      await act(async () => {
        result = await axe.run(host, { rules: { 'color-contrast': { enabled: false } } });
      });
      assert.deepEqual(
        result.violations.map((v) => v.id),
        [],
        `${name} ${status}`,
      );
    }
    await act(async () =>
      root.render(
        <Block {...base} key={name} unlocked onRelock={noop}>
          <h2>Revealed work</h2>
          <button>Explore the work</button>
        </Block>,
      ),
    );
    assert.ok(document.activeElement?.textContent?.includes('Revealed work'), name);
    let result!: AxeResults;
    await act(async () => {
      result = await axe.run(host, { rules: { 'color-contrast': { enabled: false } } });
    });
    assert.deepEqual(
      result.violations.map((v) => v.id),
      [],
      name,
    );
  }
  await act(async () => root.unmount());
  dom.window.close();
});
test('all form blocks notify the consumer and suppress submit while pending or cooling', async () => {
  const dom = new JSDOM('<!doctype html><html><body><main id="root"></main></body></html>', {
    pretendToBeVisual: true,
  });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const { createRoot } = await import('react-dom/client');
  const root = createRoot(document.getElementById('root')!);
  for (const { name, Block } of items.filter(
    (i) => !['expired-notice.tsx', 'revoked-notice.tsx', 'cooldown-screen.tsx'].includes(i.name),
  )) {
    let submits = 0;
    for (const scenario of ['idle', 'pending', 'cooling']) {
      await act(async () =>
        root.render(
          <Block
            {...base}
            key={name}
            status={scenario === 'pending' ? 'pending' : 'idle'}
            cooldownUntil={scenario === 'cooling' ? '2099-01-01T00:00:00Z' : undefined}
            onSubmit={() => {
              submits++;
            }}
          />,
        ),
      );
      const form = document.getElementsByTagName('form')[0];
      assert.ok(form, name);
      await act(async () => {
        form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
      });
      assert.equal(submits, 1, `${name} ${scenario}`);
    }
  }
  await act(async () => root.unmount());
  dom.window.close();
});
