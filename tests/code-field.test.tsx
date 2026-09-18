/** MIT License — Copyright (c) 2026 Knock contributors. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import React, { act } from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { CodeField, normalizeCode } from '../registry/components/code-field';

test('normalizes email and Slack codes without losing leading zeroes', () => {
  for (const input of [
    'Code: 4821-9930',
    ' “4821 9930” ',
    '\u200B4821\u200D9930\uFEFF',
    'Access code: ‘4821-9930’',
  ])
    assert.equal(normalizeCode(input), '48219930');
  assert.equal(normalizeCode('Code: 0021-9930'), '00219930');
  assert.equal(normalizeCode('123456789'), '12345678');
  assert.equal(normalizeCode('no digits'), '');
  assert.equal(normalizeCode('Passphrase: “Open  Sesame!”', 'passphrase'), 'Open  Sesame!');
  assert.equal(normalizeCode("it's a draft", 'passphrase'), "it's a draft");
});

test('server render is deterministic for every status, theme and mode', () => {
  for (const status of ['idle', 'pending', 'error', 'success'] as const) {
    for (const theme of ['light', 'dark'] as const) {
      for (const mode of ['digits', 'passphrase'] as const) {
        const element = (
          <CodeField
            value="1234"
            onChange={() => {}}
            status={status}
            mode={mode}
            theme={theme}
            error="Please check the code."
            masked
          />
        );
        const html = renderToString(element);
        assert.equal(html, renderToString(element));
        assert.match(html, /type="password"/);
        assert.match(html, /autoComplete="one-time-code"/);
        assert.equal(html.includes('disabled=""'), status === 'pending');
        assert.equal(html.includes('Please check the code.'), status === 'error');
      }
    }
  }
});

test('controlled paste, focus, error association and structural accessibility', async () => {
  const dom = new JSDOM(
    '<!doctype html><html lang="en"><head><title>Code field test</title></head><body><main id="root"></main></body></html>',
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
  let value = '';
  await act(async () =>
    root.render(
      <CodeField
        value=""
        onChange={(next) => {
          value = next;
        }}
        description="Paste your code"
      />,
    ),
  );
  const label = Array.from(document.getElementsByTagName('label')).find(
    (node) => node.textContent === 'Access code',
  )!;
  const input = document.getElementById(label.htmlFor) as HTMLInputElement;
  assert.equal(document.activeElement, input);
  assert.equal(input.inputMode, 'numeric');
  const paste = new dom.window.Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(paste, 'clipboardData', { value: { getData: () => 'Code: “4821-9930”' } });
  await act(async () => {
    input.dispatchEvent(paste);
  });
  assert.equal(value, '48219930');
  assert.equal(input.value, '', 'consumer must update the controlled value');
  for (const status of ['idle', 'pending', 'error', 'success'] as const) {
    await act(async () =>
      root.render(
        <CodeField
          value={value}
          onChange={() => {}}
          status={status}
          error="Check your code"
          autoFocus={false}
        />,
      ),
    );
    const result = await axe.run(host, { rules: { 'color-contrast': { enabled: false } } });
    assert.deepEqual(
      result.violations.map((v) => v.id),
      [],
    );
  }
  await act(async () => root.unmount());
  dom.window.close();
});

test('length renders that many digit slots', () => {
  const html = renderToString(
    <CodeField value="12" onChange={() => {}} length={4} autoFocus={false} />,
  );
  assert.equal([...html.matchAll(/class="kc-slot/g)].length, 4);
});

test('clicking a digit slot places the caret on that slot', async () => {
  const dom = new JSDOM(
    '<!doctype html><html lang="en"><head><title>Code field caret</title></head><body><main id="root"></main></body></html>',
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
  const host = document.getElementById('root')!;
  const root = createRoot(host);
  await act(async () =>
    root.render(<CodeField value="12345678" onChange={() => {}} autoFocus={false} />),
  );
  const input = host.querySelector('input') as HTMLInputElement;
  const boxes = [...host.querySelectorAll('.kc-slot')];
  boxes.forEach((box, i) => {
    box.getBoundingClientRect = () => ({
      x: i * 40,
      y: 0,
      left: i * 40,
      right: i * 40 + 40,
      top: 0,
      bottom: 40,
      width: 40,
      height: 40,
      toJSON() {},
    });
  });
  await act(async () => {
    input.dispatchEvent(
      new dom.window.MouseEvent('pointerdown', {
        clientX: 90,
        button: 0,
        bubbles: true,
        cancelable: true,
      }),
    );
  });
  assert.equal(input.selectionStart, 2);
  assert.equal(input.selectionEnd, 2);
  assert.equal(boxes[2].getAttribute('data-active'), 'true');
  await act(async () => root.unmount());
  dom.window.close();
});
