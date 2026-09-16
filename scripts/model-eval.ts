/** MIT License — Copyright (c) 2026 Knock contributors. CI-only agent installation eval. */
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import ts from 'typescript';
import { createServer } from 'node:http';

// Model setup docs: https://developers.openai.com/api/docs/guides/function-calling
// This command fails closed without credentials. It never silently skips a model eval.
const key = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL;
if (!key || !model)
  throw new Error(
    'Model eval requires OPENAI_API_KEY and OPENAI_MODEL. Deterministic checks are separate; no model eval has run.',
  );
const root = process.cwd();
const catalog = JSON.parse(readFileSync('public/catalog.json', 'utf8')) as {
  name: string;
  title: string;
  tier: string;
}[];
const selected = process.env.EVAL_ITEM
  ? catalog.filter((c) => c.name === process.env.EVAL_ITEM)
  : catalog;
if (!selected.length) throw new Error('Unknown EVAL_ITEM');
const results: unknown[] = [];
const schema = (properties: Record<string, unknown>, required: string[]) => ({
  type: 'object',
  properties,
  required,
  additionalProperties: false,
});
const tools = [
  {
    type: 'function',
    name: 'read_document',
    description:
      'Read a registry documentation URL or /llms-full.txt using only the local published library.',
    parameters: schema({ url: { type: 'string' } }, ['url']),
    strict: true,
  },
  {
    type: 'function',
    name: 'install',
    description:
      'Install a registry item by its slug using the real shadcn CLI. Components land at @/components/knock/<slug>.',
    parameters: schema({ name: { type: 'string' } }, ['name']),
    strict: true,
  },
  {
    type: 'function',
    name: 'write_app',
    description:
      'Write src/App.tsx. Export default App, import React hooks as needed. Use installed components and controlled demo state. No network, authorization implementation or storage. The evaluator compiles and renders the result.',
    parameters: schema({ source: { type: 'string' } }, ['source']),
    strict: true,
  },
  {
    type: 'function',
    name: 'finish',
    description:
      'Finish the integration. The external evaluator will validate without offering repair hints.',
    parameters: schema({}, []),
    strict: true,
  },
];
function run(
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv = { PATH: process.env.PATH, CI: 'true' },
) {
  return new Promise<string>((resolve, reject) => {
    let output = '';
    const child = spawn(process.execPath, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.on('data', (d) => (output += d));
    child.stderr.on('data', (d) => (output += d));
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve(output) : reject(new Error(output))));
  });
}
const server = createServer((req, res) => {
  const name = new URL(req.url ?? '/', 'http://localhost').pathname.match(
    /^\/r\/([a-z-]+)\.json$/,
  )?.[1];
  if (!catalog.some((c) => c.name === name)) {
    res.writeHead(404).end();
    return;
  }
  const item = JSON.parse(readFileSync(`public/r/${name}.json`, 'utf8'));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No port');
  item.registryDependencies = item.registryDependencies.map(
    (u: string) => `http://localhost:${address.port}/r/${u.split('/').at(-1)}`,
  );
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(item));
});
await new Promise<void>((resolve) => server.listen(0, 'localhost', resolve));
try {
  for (const item of selected) {
    const dir = mkdtempSync(path.join(tmpdir(), 'knock-agent-eval-'));
    let wrote = false;
    const installed = new Set<string>();
    try {
      mkdirSync(path.join(dir, 'src'), { recursive: true });
      symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'), 'dir');
      writeFileSync(
        path.join(dir, 'package.json'),
        JSON.stringify({
          name: 'knock-agent-eval',
          type: 'module',
          private: true,
          dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0' },
          devDependencies: { vite: '^6.0.0', tailwindcss: '^4.0.0' },
        }),
      );
      writeFileSync(path.join(dir, 'index.html'), '<div id="root"></div>');
      writeFileSync(path.join(dir, 'src/index.css'), '@import "tailwindcss";');
      writeFileSync(
        path.join(dir, 'components.json'),
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
        }),
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
            baseUrl: '.',
            paths: { '@/*': ['src/*'] },
          },
          include: ['src'],
        }),
      );
      // The model initially gets only the public index and the task. Documentation is tool-fetched.
      const input: any[] = [
        {
          role: 'user',
          content: `Task: Install and wire ${item.title} into an accessible React demo using the library below. Show meaningful content and working consumer-controlled interactions appropriate to the item. Do not verify codes or store credentials. Export default App from src/App.tsx. Use installed source, not a rewritten substitute.\n\n${readFileSync('public/llms.txt', 'utf8')}`,
        },
      ];
      let finished = false;
      for (let turn = 0; turn < 12 && !finished; turn++) {
        const response = await fetch('https://api.openai.com/v1/responses', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, store: false, input, tools, max_output_tokens: 6000 }),
          signal: AbortSignal.timeout(120000),
        });
        if (!response.ok) throw new Error(`OpenAI eval request failed: HTTP ${response.status}`);
        const body = (await response.json()) as { output: any[] };
        input.push(...body.output);
        const calls = body.output.filter((o) => o.type === 'function_call');
        if (!calls.length) throw new Error('Model ended without finish');
        for (const call of calls) {
          const args = JSON.parse(call.arguments);
          let output = '';
          if (call.name === 'read_document') {
            const pathname = new URL(args.url, 'http://localhost').pathname;
            if (
              !/^\/(?:llms(?:-full)?\.txt|(?:docs|prompts)\/[a-z-]+\.md|r\/[a-z-]+\.json)$/.test(
                pathname,
              )
            )
              throw new Error('Unsupported documentation URL');
            output = readFileSync(path.join(root, 'public', pathname), 'utf8');
          } else if (call.name === 'install') {
            if (!catalog.some((c) => c.name === args.name))
              throw new Error('Unknown registry item');
            const address = server.address();
            if (!address || typeof address === 'string') throw new Error('No port');
            await run(
              [
                path.join(root, 'node_modules/shadcn/dist/index.js'),
                'add',
                `http://localhost:${address.port}/r/${args.name}.json`,
                '--yes',
                '--overwrite',
              ],
              dir,
              { ...process.env, OPENAI_API_KEY: undefined, CI: 'true' },
            );
            installed.add(args.name);
            output = 'Installed.';
          } else if (call.name === 'write_app') {
            const source = String(args.source);
            const ast = ts.createSourceFile(
              'App.tsx',
              source,
              ts.ScriptTarget.Latest,
              true,
              ts.ScriptKind.TSX,
            );
            const inspect = (node: ts.Node) => {
              if (ts.isImportDeclaration(node)) {
                const from = (node.moduleSpecifier as ts.StringLiteral).text;
                if (from !== 'react' && !/^@\/components\/knock\/[a-z-]+$/.test(from))
                  throw new Error('Only React and installed Knock imports are allowed');
              }
              if (
                ts.isIdentifier(node) &&
                [
                  'process',
                  'globalThis',
                  'require',
                  'eval',
                  'Function',
                  'fetch',
                  'localStorage',
                  'sessionStorage',
                  'XMLHttpRequest',
                  'WebSocket',
                ].includes(node.text)
              )
                throw new Error('Integration must remain UI-only');
              if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword)
                throw new Error('Dynamic imports not allowed in eval output');
              ts.forEachChild(node, inspect);
            };
            inspect(ast);
            if (!source.includes(`@/components/knock/${item.name}`))
              throw new Error('Model did not use the requested installed item');
            writeFileSync(path.join(dir, 'src/App.tsx'), source);
            wrote = true;
            output = 'App saved.';
          } else if (call.name === 'finish') {
            finished = true;
            output = 'Integration submitted.';
          } else throw new Error('Unknown eval tool');
          input.push({ type: 'function_call_output', call_id: call.call_id, output });
        }
      }
      if (!finished || !wrote || !installed.has(item.name))
        throw new Error('Incomplete installation/integration');
      await run([path.join(root, 'node_modules/typescript/bin/tsc'), '--noEmit'], dir);
      const renderCheck = readFileSync(path.join(root, 'scripts/eval-render-check.tsx'), 'utf8');
      writeFileSync(path.join(dir, 'check.tsx'), renderCheck);
      await run(
        ['--import', path.join(root, 'node_modules/tsx/dist/loader.mjs'), 'check.tsx'],
        dir,
      );
      results.push({ item: item.name, model, passed: true });
      console.log(`Integration validated: ${item.name}`);
    } catch (error) {
      results.push({ item: item.name, model, passed: false, error: String(error) });
      throw error;
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
} finally {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  mkdirSync('artifacts', { recursive: true });
  writeFileSync(
    process.env.EVAL_REPORT_PATH ?? 'artifacts/model-evals.json',
    JSON.stringify(results, null, 2) + '\n',
  );
}
