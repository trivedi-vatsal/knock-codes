/** MIT License — Copyright (c) 2026 Knock contributors. Verify the built static distribution over HTTP. */
import { preview } from 'vite';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
const catalog = JSON.parse(readFileSync('public/catalog.json', 'utf8')) as {
  name: string;
  title: string;
}[];
let checked = 0;
const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
try {
  const address = server.httpServer.address();
  if (!address || typeof address === 'string') throw new Error('Missing preview address');
  const origin = `http://127.0.0.1:${address.port}`;
  for (const item of catalog) {
    for (const suffix of [
      `docs/${item.name}.md`,
      `prompts/${item.name}.md`,
      `r/${item.name}.json`,
      `source/${item.name}.tsx`,
    ]) {
      const response = await fetch(`${origin}/${suffix}`);
      assert.equal(response.status, 200, suffix);
      const body = await response.text();
      if (suffix.startsWith('docs/')) assert.ok(body.startsWith(`# ${item.title}`), suffix);
      checked += 1;
    }
  }
  for (const url of ['/docs/index.md', '/catalog.json', '/llms.txt', '/llms-full.txt']) {
    assert.equal((await fetch(origin + url)).status, 200, url);
    checked += 1;
  }
  for (const url of [
    '/',
    '/library',
    '/docs',
    '/docs/get-started',
    '/docs/styling',
    '/docs/ai-agents',
    ...catalog.flatMap((item) => [`/docs/${item.name}`, `/playground/${item.name}`]),
  ]) {
    const response = await fetch(origin + url, { headers: { accept: 'text/html' } });
    assert.equal(response.status, 200, url);
    const html = await response.text();
    assert.ok(html.includes('<div id="root"></div>'), url);
    const document = new JSDOM(html).window.document;
    assert.equal(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      `https://knock.codes${url}`,
      url,
    );
    assert.ok(document.querySelector('meta[property="og:title"]')?.getAttribute('content'), url);
    assert.equal(
      document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      'https://knock.codes/og.png',
    );
    if (url === '/docs/code-field')
      assert.equal(document.title, 'Code field documentation — Knock');
    checked += 1;
  }
  for (const url of [
    '/unknown',
    '/docs/unknown',
    '/playground/unknown',
    '/docs/code-field/extra',
  ]) {
    const response = await fetch(origin + url);
    assert.equal(response.status, 404, url);
    const html = await response.text();
    assert.ok(html.includes('Page not found'), url);
    assert.ok(html.includes('noindex, follow'), url);
    assert.ok(!html.includes('rel="canonical" href='), url);
  }
  for (const url of ['/og.png', '/favicon.svg', '/sitemap.xml', '/robots.txt'])
    assert.equal((await fetch(origin + url)).status, 200, url);
  const png = Buffer.from(await (await fetch(origin + '/og.png')).arrayBuffer());
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  // Asset URLs with an extension must still 404 rather than returning the app shell.
  for (const url of ['/docs/missing.md', '/r/missing.json'])
    assert.equal((await fetch(origin + url)).status, 404, url);
  console.log(
    `All ${checked} published documentation, registry, source and index URLs returned the expected static resources.`,
  );
} finally {
  await new Promise<void>((resolve) => server.httpServer.close(() => resolve()));
}
