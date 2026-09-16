/** MIT License — Copyright (c) 2026 Knock contributors. Crawlable metadata for static hosting. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { guides, parseRoute, metadataHtml } from '../src/routes';
const catalog = JSON.parse(readFileSync('public/catalog.json', 'utf8')) as {
  name: string;
  title: string;
}[];
const names = catalog.map((item) => item.title);
const routes = [
  '/',
  '/library',
  '/docs',
  ...Object.keys(guides)
    .filter((key) => key !== 'introduction')
    .map((key) => `/docs/${key}`),
  ...catalog.flatMap((item) => [`/docs/${item.name}`, `/playground/${item.name}`]),
];
const template = readFileSync('dist/index.html', 'utf8');
for (const route of [...routes, '/404', '/docs/introduction']) {
  const metadata = metadataHtml(parseRoute(route, names));
  let html = template.replace(/<!--page-meta:start-->[\s\S]*?<!--page-meta:end-->/, metadata);
  if (route === '/404')
    html = html.replace(
      '<div id="root"></div>',
      '<div id="root"><main><h1>Page not found</h1><p>This page could not be found.</p><a href="/library">Explore the library</a></main></div>',
    );
  const output = route === '/404' ? 'dist/404.html' : path.join('dist', route, 'index.html');
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, html);
}
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>https://knock.codes${route}</loc></url>`).join('')}</urlset>`,
);
writeFileSync(
  'dist/robots.txt',
  'User-agent: *\nAllow: /\nSitemap: https://knock.codes/sitemap.xml\n',
);
console.log(`Built metadata for ${routes.length} routes, a 404 page, and sitemap.`);
