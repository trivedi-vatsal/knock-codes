/** MIT License — Copyright (c) 2026 Knock contributors. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdirSync } from 'node:fs';
import React, { act, type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import { JSDOM } from 'jsdom';
test('all public files hydrate without recoverable errors', async () => {
  const files = ['components', 'blocks'].flatMap((tier) =>
    readdirSync(`registry/${tier}`)
      .filter((f) => f.endsWith('.tsx'))
      .map((f) => `../registry/${tier}/${f}`),
  );
  for (const file of files) {
    const exports = await import(file);
    const Component = Object.entries(exports).find(
      ([name, value]) => /^[A-Z]/.test(name) && typeof value === 'function',
    )![1] as ComponentType<any>;
    const element = (
      <Component
        value=""
        onChange={() => {}}
        onSubmit={(event: React.FormEvent) => event.preventDefault()}
        status="idle"
        unlocked={false}
        recipient="Acme"
        expiresAt="2030-01-01T12:00:00Z"
        cooldownUntil="2030-01-01T12:00:00Z"
        buildLabel="v1"
        onRelock={() => {}}
        onRequestAccess={() => {}}
        autoFocus={false}
        prompt={<button>Preview invitation</button>}
      >
        <p>Preview content</p>
      </Component>
    );
    const dom = new JSDOM(
      `<!doctype html><html><body><main id="root">${renderToString(element)}</main></body></html>`,
      { pretendToBeVisual: true },
    );
    Object.assign(globalThis, {
      window: dom.window,
      document: dom.window.document,
      HTMLElement: dom.window.HTMLElement,
      IS_REACT_ACT_ENVIRONMENT: true,
    });
    const { hydrateRoot } = await import('react-dom/client');
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(document.getElementById('root')!, element, {
        onRecoverableError: (error) => errors.push(error),
      });
    });
    assert.deepEqual(errors, [], file);
    await act(async () => root!.unmount());
    dom.window.close();
  }
});
