/** MIT License — Copyright (c) 2026 Knock contributors. */
import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';
import type { CatalogItem } from '../src/docs-view';

const catalog = JSON.parse(readFileSync('public/catalog.json', 'utf8')) as CatalogItem[];
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const view = await server.ssrLoadModule('/src/docs-view.tsx');
  const home = await server.ssrLoadModule('/src/home-view.tsx');
  const library = await server.ssrLoadModule('/src/library-view.tsx');
  const dom = new JSDOM(
    '<!doctype html><html lang="en"><head><title>Documentation</title></head><body><main></main></body></html>',
  );
  const host = dom.window.document.querySelector('main')!;
  const pages: { name: string; html: string; item?: CatalogItem }[] = [
    { name: 'home', html: renderToString(React.createElement(home.Home)) },
    ...Object.keys(view.guides).map((page) => ({
      name: page,
      html: renderToString(React.createElement(view.DocsIndex, { items: catalog, page })),
    })),
    ...catalog.map((item) => ({
      name: item.name,
      html: renderToString(React.createElement(view.DocsPage, { item })),
      item,
    })),
  ];
  const gallery = renderToString(React.createElement(library.Library));
  host.innerHTML = gallery;
  assert.equal(host.querySelectorAll('.collection-item-link').length, catalog.length);
  assert.equal(
    host.querySelectorAll('.collection-preview[inert][aria-hidden="true"]').length,
    catalog.length,
  );
  for (const item of catalog)
    assert.ok(
      host.querySelector(`a[href="/playground/${item.name}"]`),
      `Gallery links to ${item.name}`,
    );
  pages.push({ name: 'library', html: gallery });
  for (const page of pages) {
    host.innerHTML = page.html;
    assert.equal(host.querySelectorAll('h1').length, 1, `${page.name}: one page title`);
    if (page.name === 'get-started') {
      for (const command of [
        'npx shadcn@latest registry add @knock-codes',
        'pnpm dlx shadcn@latest registry add @knock-codes',
        'yarn dlx shadcn@latest registry add @knock-codes',
        'bunx --bun shadcn@latest registry add @knock-codes',
        'npx shadcn@latest add @knock-codes/client-preview-gate',
      ])
        assert.ok(host.textContent!.includes(command), command);
      for (const phrase of [
        'checkPreviewCode',
        'onUnlock',
        'These are not props',
        'ExpiredNotice',
        'RevokedNotice',
      ])
        assert.ok(host.textContent!.includes(phrase), phrase);
    }
    if (page.name === 'introduction') {
      assert.ok(host.textContent!.includes('Choose a screen'));
      assert.ok(host.querySelector('a[href="/docs/client-preview-gate"]'));
      assert.ok(host.querySelector('a[href="/docs/open-invitation"]'));
    }
    if (page.item) {
      assert.ok(host.textContent!.includes(`npx shadcn@latest add @knock-codes/${page.item.name}`));
      assert.ok(host.textContent!.includes(`npx shadcn@latest add ${page.item.registryUrl}`));
      assert.ok(
        host.querySelector(`a[href="/playground/${page.name}"]`),
        'preview is linked, not duplicated',
      );
      assert.equal(host.querySelector('.workbench'), null);
      const api = host.querySelector('.reference-details')!;
      assert.ok(!api.hasAttribute('open'), 'API starts collapsed');
      for (const prop of page.item.props) assert.ok(api.textContent!.includes(prop.name));
      assert.ok(host.textContent!.includes(page.item.meta.notFor), `${page.name} notFor`);
    }
    for (const link of host.querySelectorAll('a[href^="#"]'))
      assert.ok(host.querySelector(link.getAttribute('href')!), 'section links resolve');
    const result = await axe.run(host as unknown as Element, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    assert.deepEqual(
      result.violations.map((v) => `${page.name}: ${v.id}`),
      [],
    );
  }
  console.log(
    `${pages.length} guide and reference pages pass content and structural accessibility checks.`,
  );
} finally {
  await server.close();
}
