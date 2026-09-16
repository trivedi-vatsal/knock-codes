import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { parseRoute, pathFor, metadataHtml } from './src/routes';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  appType: 'mpa',
  plugins: [
    {
      name: 'clean-app-routes',
      configureServer(server) {
        server.middlewares.use(async (request, response, next) => {
          const pathname = new URL(request.url!, 'http://localhost').pathname;
          if (
            pathname.startsWith('/@') ||
            pathname.includes('.') ||
            pathname.startsWith('/node_modules/') ||
            pathname.startsWith('/src/')
          )
            return next();
          if (pathname === '/audit') {
            request.url = '/';
            return next();
          }
          try {
            const names = JSON.parse(readFileSync('public/catalog.json', 'utf8')).map(
              (item: { title: string }) => item.title,
            );
            const route = parseRoute(pathname, names);
            const template = readFileSync('index.html', 'utf8').replace(
              /<!--page-meta:start-->[\s\S]*?<!--page-meta:end-->/,
              metadataHtml(route),
            );
            const html = await server.transformIndexHtml(pathname, template);
            response.statusCode = route.view === 'not-found' ? 404 : 200;
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end(html);
          } catch (error) {
            next(error);
          }
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          const pathname = new URL(request.url!, 'http://localhost').pathname;
          if (pathname.includes('.')) return next();
          try {
            const names = JSON.parse(readFileSync('dist/catalog.json', 'utf8')).map(
              (item: { title: string }) => item.title,
            );
            const route = parseRoute(pathname, names);
            const file =
              route.view === 'not-found'
                ? 'dist/404.html'
                : `dist${pathFor(route) === '/' ? '' : pathFor(route)}/index.html`;
            response.statusCode = route.view === 'not-found' ? 404 : 200;
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end(readFileSync(file));
          } catch (error) {
            next(error);
          }
        });
      },
    },
    {
      name: 'workbench-client-boundaries',
      apply: 'build',
      enforce: 'pre',
      transform(code, id) {
        // Vite is client-only. The generated registry and ?raw source retain this directive.
        if (/\/registry\/.*\.tsx$/.test(id))
          return { code: code.replace(/^(['"])use client\1;?$/m, ''), map: null };
      },
    },
    tailwindcss(),
  ],
});
