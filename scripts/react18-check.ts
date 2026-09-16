/** MIT License — Copyright (c) 2026 Knock contributors. Isolated React 18 compatibility check. */
import { mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
const dir = mkdtempSync(path.join(tmpdir(), 'knock-react18-'));
function run(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd: dir, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command}: ${code}`))));
  });
}
try {
  cpSync('registry', path.join(dir, 'registry'), { recursive: true });
  cpSync('tests', path.join(dir, 'tests'), { recursive: true });
  cpSync('public', path.join(dir, 'public'), { recursive: true });
  writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({ name: 'knock-react18-check', type: 'module', private: true }),
  );
  writeFileSync(
    path.join(dir, 'tsconfig.json'),
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
        esModuleInterop: true,
      },
      include: ['registry', 'tests'],
    }),
  );
  await run('npm', [
    'install',
    '--no-audit',
    '--no-fund',
    'react@18.3.1',
    'react-dom@18.3.1',
    '@types/react@18',
    '@types/react-dom@18',
    '@types/node@22',
    'jsdom@26',
    '@types/jsdom@21',
    'axe-core@4',
    'tsx@4',
    'typescript@5',
  ]);
  await run(process.execPath, [path.join(dir, 'node_modules/typescript/bin/tsc'), '--noEmit']);
  await run(process.execPath, [
    '--import',
    path.join(dir, 'node_modules/tsx/dist/loader.mjs'),
    '--test',
    ...['blocks', 'components', 'code-field', 'registry', 'hydration'].map(
      (n) => `tests/${n}.test.tsx`,
    ),
  ]);
  console.log(
    'React 18.3.1 + React 18 types: compilation, hydration and all public contract tests passed.',
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
