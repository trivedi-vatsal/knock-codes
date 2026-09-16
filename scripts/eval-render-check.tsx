/** MIT License — Copyright (c) 2026 Knock contributors. Copied into an isolated eval fixture. */
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import assert from 'node:assert/strict';
const dom = new JSDOM(
  '<!doctype html><html lang="en"><head><title>Agent integration</title></head><body><main id="root"></main></body></html>',
  { pretendToBeVisual: true },
);
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: true,
});
const { createRoot } = await import('react-dom/client');
// @ts-ignore This file is copied to a temporary project next to src/App.tsx.
const { default: App } = await import('./src/App');
const axe = (await import('axe-core')).default;
const host = document.getElementById('root')!;
const root = createRoot(host);
await act(async () => root.render(<App />));
assert.ok(host.textContent?.trim(), 'Integration renders meaningful content');
const result = await axe.run(host, { rules: { 'color-contrast': { enabled: false } } });
assert.deepEqual(
  result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.failureSummary) })),
  [],
);
await act(async () => root.unmount());
dom.window.close();
