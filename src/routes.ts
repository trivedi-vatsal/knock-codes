/** MIT License — Copyright (c) 2026 Knock contributors. Shared browser/build routing. */
export const guides = {
  introduction: 'Introduction',
  'get-started': 'Installation',
  styling: 'Styling',
  'ai-agents': 'AI agents',
};
export type Guide = keyof typeof guides;
export type View = 'playground' | 'docs' | 'guide' | 'library' | 'home' | 'not-found';
export type Route = { selected: string; view: View; guide?: Guide };
export const slugOf = (name: string) => name.toLowerCase().replaceAll(' ', '-');
export function parseRoute(path: string, names: string[]): Route {
  const clean = path === '/' ? path : path.replace(/\/$/, '');
  const fallback = { selected: 'Code field', view: 'not-found' as const };
  if (clean === '/') return { ...fallback, view: 'home' };
  if (clean === '/library') return { ...fallback, view: 'library' };
  if (clean === '/docs') return { ...fallback, view: 'guide', guide: 'introduction' };
  const match = clean.match(/^\/(docs|playground)\/([^/]+)$/);
  if (!match) return fallback;
  const [, section, slug] = match;
  if (section === 'docs' && Object.hasOwn(guides, slug))
    return { ...fallback, view: 'guide', guide: slug as Guide };
  const selected = names.find((name) => slugOf(name) === slug);
  return selected ? { selected, view: section as 'docs' | 'playground' } : fallback;
}
export const pathFor = ({ selected, view, guide }: Route) =>
  view === 'home'
    ? '/'
    : view === 'library'
      ? '/library'
      : view === 'guide'
        ? `/docs${guide && guide !== 'introduction' ? `/${guide}` : ''}`
        : view === 'not-found'
          ? '/404'
          : `/${view}/${slugOf(selected)}`;
export function pageMetadata(route: Route) {
  const title =
    route.view === 'not-found'
      ? 'Page not found — Knock'
      : route.view === 'home'
        ? 'Knock — Thoughtful UI for private previews'
        : route.view === 'library'
          ? 'Component library — Knock'
          : route.view === 'guide'
            ? `${guides[route.guide ?? 'introduction']} — Knock`
            : `${route.selected}${route.view === 'docs' ? ' documentation' : ' playground'} — Knock`;
  const description =
    route.view === 'home'
      ? 'Copy-paste React components for private previews. Thoughtful access screens, client invitations, and draft controls. React + Tailwind, ready for shadcn.'
      : route.view === 'library'
        ? 'Browse React components and blocks for private previews. Try live examples, customize the design, and install with shadcn.'
        : route.view === 'not-found'
          ? 'This page could not be found. Explore the Knock library or return home.'
          : route.view === 'guide'
            ? `Learn ${guides[route.guide ?? 'introduction'].toLowerCase()} for Knock, the copy-paste React UI library for private previews.`
            : `${route.view === 'docs' ? 'Installation, usage, and API reference' : 'Try and customize the live preview'} for ${route.selected.toLowerCase()}. Copy-paste React + Tailwind UI from Knock.`;
  return { title, description, url: `https://knock.codes${pathFor(route)}` };
}

export function metadataHtml(route: Route) {
  const meta = pageMetadata(route);
  const escape = (value: string) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  return `<title>${escape(meta.title)}</title>
<meta name="description" content="${escape(meta.description)}" />
<meta name="author" content="Knock" />
<meta name="robots" content="${route.view === 'not-found' ? 'noindex, follow' : 'index, follow'}" />
<link rel="canonical" ${route.view === 'not-found' ? '' : `href="${escape(meta.url)}"`} />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Knock" />
<meta property="og:title" content="${escape(meta.title)}" />
<meta property="og:description" content="${escape(meta.description)}" />
<meta property="og:url" content="${escape(meta.url)}" />
<meta property="og:image" content="https://knock.codes/og.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Knock — Thoughtful UI for private previews. React + Tailwind. Copy, customize, share." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escape(meta.title)}" />
<meta name="twitter:description" content="${escape(meta.description)}" />
<meta name="twitter:image" content="https://knock.codes/og.png" />
<meta name="twitter:image:alt" content="Knock — Thoughtful UI for private previews." />`;
}
