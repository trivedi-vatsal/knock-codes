/** MIT License — Copyright (c) 2026 Knock contributors. Real shadcn integration check. */
import { createServer } from 'node:http';
import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  symlinkSync,
  existsSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const root = process.cwd();
const temporary = mkdtempSync(path.join(tmpdir(), 'knock-install-'));
const catalog = JSON.parse(readFileSync('public/catalog.json', 'utf8')) as { name: string }[];
function run(command: string, args: string[], cwd = temporary) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env, CI: 'true' },
    });
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)),
    );
  });
}
const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No server port');
  const origin = `http://localhost:${address.port}`;
  if (pathname === '/r/registry.json' || pathname === '/r/react/registry.json') {
    response.setHeader('Content-Type', 'application/json');
    response.end(readFileSync(path.join(root, 'public/r/registry.json')));
    return;
  }
  const name = pathname.match(/^\/r\/(?:react\/)?([a-z-]+)\.json$/)?.[1];
  if (!name || !catalog.some((c) => c.name === name)) {
    response.writeHead(404).end();
    return;
  }
  const json = JSON.parse(readFileSync(path.join(root, `public/r/${name}.json`), 'utf8'));
  json.registryDependencies = json.registryDependencies.map(
    (url: string) => `${origin}/r/${url.split('/').at(-1)}`,
  );
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(json));
});
await new Promise<void>((resolve) => server.listen(0, 'localhost', resolve));
try {
  mkdirSync(path.join(temporary, 'src'), { recursive: true });
  writeFileSync(
    path.join(temporary, 'package.json'),
    JSON.stringify({
      name: 'knock-install-check',
      private: true,
      type: 'module',
      dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' },
      devDependencies: { tailwindcss: '^4.0.0', vite: '^6.0.0' },
    }),
  );
  writeFileSync(
    path.join(temporary, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        baseUrl: '.',
        paths: { '@/*': ['./src/*'] },
      },
      include: ['src'],
    }),
  );
  writeFileSync(path.join(temporary, 'index.html'), '<div id="root"></div>');
  writeFileSync(path.join(temporary, 'src/index.css'), '@import "tailwindcss";');
  writeFileSync(
    path.join(temporary, 'components.json'),
    JSON.stringify({
      $schema: 'https://ui.shadcn.com/schema.json',
      style: 'new-york',
      rsc: false,
      tsx: true,
      tailwind: { config: '', css: 'src/index.css', baseColor: 'neutral', cssVariables: true },
      aliases: {
        components: '@/components',
        ui: '@/components/ui',
        utils: '@/lib/utils',
        lib: '@/lib',
        hooks: '@/hooks',
      },
      iconLibrary: 'lucide',
    }),
  );
  symlinkSync(path.join(root, 'node_modules'), path.join(temporary, 'node_modules'), 'dir');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No server port');
  const origin = `http://localhost:${address.port}`;
  await run(process.execPath, [
    path.join(root, 'node_modules/shadcn/dist/index.js'),
    'add',
    `${origin}/r/client-preview-gate.json`,
    '--yes',
  ]);
  for (const name of [
    'client-preview-gate',
    'code-field',
    'recipient-line',
    'expiry-pill',
    'request-access',
    'cooldown-notice',
  ])
    assert.ok(
      existsSync(path.join(temporary, `src/components/knock/${name}.tsx`)),
      `Dependency installed: ${name}`,
    );
  await run(process.execPath, [
    path.join(root, 'node_modules/shadcn/dist/index.js'),
    'add',
    ...catalog
      .filter(
        (c) =>
          ![
            'client-preview-gate',
            'code-field',
            'recipient-line',
            'expiry-pill',
            'request-access',
            'cooldown-notice',
          ].includes(c.name),
      )
      .map((c) => `${origin}/r/${c.name}.json`),
    '--yes',
    '--overwrite',
  ]);
  for (const { name } of catalog)
    assert.ok(existsSync(path.join(temporary, `src/components/knock/${name}.tsx`)), name);
  const components = JSON.parse(readFileSync(path.join(temporary, 'components.json'), 'utf8')) as {
    registries?: Record<string, string>;
  };
  await run(process.execPath, [
    path.join(root, 'node_modules/shadcn/dist/index.js'),
    'registry',
    'add',
    `@knock-codes=${origin}/r/react/{name}.json`,
  ]);
  const updated = JSON.parse(readFileSync(path.join(temporary, 'components.json'), 'utf8')) as {
    registries?: Record<string, string>;
  };
  assert.equal(updated.registries?.['@knock-codes'], `${origin}/r/react/{name}.json`);
  assert.equal(components.registries?.['@knock-codes'], undefined);
  await run(process.execPath, [
    path.join(root, 'node_modules/shadcn/dist/index.js'),
    'add',
    '@knock-codes/quick-gate',
    '--yes',
    '--overwrite',
  ]);
  assert.ok(existsSync(path.join(temporary, 'src/components/knock/quick-gate.tsx')));
  await run(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'), '--noEmit']);
  console.log(
    `Installed and compiled all ${catalog.length} registry items with the real shadcn CLI, including @knock-codes namespace add. No additional runtime dependencies requested.`,
  );
} finally {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  if (process.env.KEEP_INSTALL_CHECK) console.log(temporary);
  else rmSync(temporary, { recursive: true, force: true });
}
