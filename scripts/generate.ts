/** MIT License — Copyright (c) 2026 Knock contributors. Build-time tooling only. */
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const base = (process.env.REGISTRY_BASE_URL ?? 'https://knock.codes').replace(/\/$/, '');
if (!/^https?:\/\//.test(base)) throw new Error('REGISTRY_BASE_URL must be an http(s) origin.');
const files = ['components', 'blocks'].flatMap((tier) =>
  readdirSync(`registry/${tier}`)
    .filter((f) => f.endsWith('.tsx'))
    .sort()
    .map((f) => `registry/${tier}/${f}`),
);
const sharedBlock = 'registry/shared/block.ts';
const program = ts.createProgram([...files, sharedBlock], {
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  skipLibCheck: true,
});
const checker = program.getTypeChecker();
const check = process.argv.includes('--check');
const changed: string[] = [];
function flattenShared(component: string, content: string) {
  if (!content.includes("'../shared/block'")) return content;
  const shared = readFileSync(sharedBlock, 'utf8');
  const body = shared.match(
    /export interface KnockBlockProps (\{[\s\S]*?\n\})\n\nexport const/,
  )?.[1];
  const skin = shared.match(/export const knockBlockSkin = (`[\s\S]*?`);/)?.[1];
  if (!body || !skin) throw new Error(`${sharedBlock} is malformed`);
  return content
    .replace(/import \{[^}]+\} from '\.\.\/shared\/block';\n/, '')
    .replace(/import \{([^}]+)\} from 'react';/, (_, spec: string) => {
      const names = spec
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
      if (!names.some((name) => name.includes('FormEvent'))) names.push('type FormEvent');
      if (!names.some((name) => name.includes('ReactNode'))) names.push('type ReactNode');
      return `import { ${names.join(', ')} } from 'react';`;
    })
    .replace(
      `export interface ${component}Props extends KnockBlockProps {}`,
      `export interface ${component}Props ${body}`,
    )
    .replace('<style>{knockBlockSkin}</style>', `<style>{${skin}}</style>`);
}
function emit(file: string, content: string) {
  if (check) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== content) changed.push(file);
  } else {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
}
function json(file: string, value: unknown) {
  emit(file, JSON.stringify(value, null, 2) + '\n');
}
const lifecycles = ['gate', 'unlocked', 'ended'];
const importsOf = (item: string) =>
  program
    .getSourceFile(item)!
    .statements.filter(ts.isImportDeclaration)
    .map((n) => (n.moduleSpecifier as ts.StringLiteral).text);
const dependencyMap = new Map(
  files.map((item) => [
    path.basename(item, '.tsx'),
    importsOf(item)
      .filter((i) => i !== 'react' && !i.includes('/shared/'))
      .map((i) => path.basename(i)),
  ]),
);
const unsupported = ['onSuccess', 'password', 'correctCode', 'attempts', 'maxAttempts', 'onUnlock'];
const catalog: any[] = [];
let full =
  '# Knock — the full library\n\nReact + Tailwind UI only. Consumers own authorization. No component verifies, persists, fetches, or unlocks by itself.\n\n';
const allExamples: string[] = [];
const defaultsOf = (source: ts.SourceFile) => {
  const defaults: Record<string, string> = {};
  const walk = (node: ts.Node) => {
    if (ts.isParameter(node) && ts.isObjectBindingPattern(node.name))
      for (const e of node.name.elements)
        if (e.initializer) defaults[e.name.getText(source)] = e.initializer.getText(source);
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
    ) {
      const name = node.left.getText(source);
      if (ts.isIdentifier(node.left)) defaults[name] = node.right.getText(source);
      if (/^labels\?\.[\w]+$/.test(name))
        defaults[name.replace('?.', '.')] = node.right.getText(source);
    }
    ts.forEachChild(node, walk);
  };
  walk(source);
  return defaults;
};
for (const file of files) {
  const source = program.getSourceFile(file)!;
  const content = readFileSync(file, 'utf8');
  const header = content.match(/^\/\*\*([\s\S]*?)\*\//)?.[1] ?? '';
  const tag = (name: string) => header.match(new RegExp(`@${name} ([^\\n]+)`))?.[1]?.trim();
  const version = tag('version'),
    minimal = tag('minimalExample'),
    wired = tag('fullExample'),
    a11y = tag('a11y'),
    lifecycle = tag('lifecycle'),
    whenToUse = tag('whenToUse'),
    notFor = tag('notFor');
  const pitfalls = [...header.matchAll(/@pitfall ([^\n]+)/g)].map((m) => m[1].trim());
  if (
    !version ||
    !minimal ||
    !wired ||
    !a11y ||
    !whenToUse ||
    !notFor ||
    !pitfalls.length ||
    !header.includes('MIT License')
  )
    throw new Error(`${file}: missing source metadata`);
  if (!lifecycle || !lifecycles.includes(lifecycle))
    throw new Error(`${file}: @lifecycle must be one of ${lifecycles.join(', ')}`);
  const declaration = source.statements.find(
    (n) => ts.isInterfaceDeclaration(n) && n.name.text.endsWith('Props'),
  ) as ts.InterfaceDeclaration | undefined;
  if (!declaration) throw new Error(`${file}: missing public Props interface`);
  const component = declaration.name.text.replace(/Props$/, '');
  const slug = path.basename(file, '.tsx');
  const title = slug
    .split('-')
    .map((s, i) => (i ? s : s[0].toUpperCase() + s.slice(1)))
    .join(' ');
  const tier = file.includes('/blocks/') ? 'blocks' : 'components';
  const defaults = defaultsOf(source);
  const importedDefaults: Record<string, Record<string, string>> = {};
  for (const statement of source.statements.filter(ts.isImportDeclaration)) {
    const moduleName = (statement.moduleSpecifier as ts.StringLiteral).text;
    if (!moduleName.startsWith('../components/')) continue;
    const dependency = program.getSourceFile(
      path.normalize(path.join(path.dirname(file), moduleName + '.tsx')),
    );
    const bindings = statement.importClause?.namedBindings;
    if (dependency && bindings && ts.isNamedImports(bindings))
      for (const binding of bindings.elements)
        importedDefaults[binding.name.text] = defaultsOf(dependency);
  }
  const resolveLabels = (node: ts.Node) => {
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const childDefaults = importedDefaults[node.tagName.getText(source)];
      if (childDefaults)
        for (const attribute of node.attributes.properties) {
          if (
            ts.isJsxAttribute(attribute) &&
            attribute.initializer &&
            ts.isJsxExpression(attribute.initializer) &&
            attribute.initializer.expression
          ) {
            const label = attribute.initializer.expression
              .getText(source)
              .match(/^labels\?\.([A-Za-z]+)$/)?.[1];
            const fallback = childDefaults[attribute.name.getText(source)];
            if (label && fallback) defaults['labels.' + label] = fallback;
          }
          if (
            !ts.isJsxAttribute(attribute) ||
            attribute.name.getText(source) !== 'labels' ||
            !attribute.initializer ||
            !ts.isJsxExpression(attribute.initializer) ||
            !attribute.initializer.expression ||
            !ts.isObjectLiteralExpression(attribute.initializer.expression)
          )
            continue;
          for (const property of attribute.initializer.expression.properties)
            if (ts.isPropertyAssignment(property)) {
              const target = property.initializer
                .getText(source)
                .match(/^labels\?\.([A-Za-z]+)$/)?.[1];
              const fallback = childDefaults['labels.' + property.name.getText(source)];
              if (target && fallback) defaults['labels.' + target] = fallback;
            }
        }
    }
    ts.forEachChild(node, resolveLabels);
  };
  resolveLabels(source);
  const props = checker
    .getTypeAtLocation(declaration)
    .getProperties()
    .map((symbol) => {
      const prop = symbol.getDeclarations()?.find(ts.isPropertySignature);
      if (!prop?.type) throw new Error(`${file}: ${symbol.getName()} is not a typed property`);
      const name = symbol.getName();
      const description = ts.displayPartsToString(symbol.getDocumentationComment(checker));
      if (!description) throw new Error(`${file}: ${name} lacks JSDoc`);
      const tags = symbol.getJsDocTags(checker);
      const explicit = tags
        .find((t) => t.name === 'default')
        ?.text?.map((x) => x.text)
        .join('');
      const origin = prop.getSourceFile();
      return {
        name,
        type: prop.type
          .getText(origin)
          .replace(/\/\*\*[\s\S]*?\*\//g, '')
          .replace(/\s+/g, ' '),
        required: !prop.questionToken,
        default: defaults[name] ?? explicit ?? null,
        description,
        ...(ts.isTypeLiteralNode(prop.type)
          ? {
              properties: prop.type.members.filter(ts.isPropertySignature).map((member) => ({
                name: member.name.getText(origin),
                type: member.type?.getText(origin),
                required: !member.questionToken,
                default: defaults[name + '.' + member.name.getText(origin)] ?? null,
              })),
            }
          : {}),
      };
    });
  if (tier === 'components' && importsOf(file).some((i) => i !== 'react'))
    throw new Error(`${file}: components may import only React`);
  const dependencies = dependencyMap.get(slug)!;
  const usedBy = [...dependencyMap]
    .filter(([, items]) => items.includes(slug))
    .map(([name]) => name)
    .sort();
  for (const dependency of dependencies)
    if (!files.some((f) => f === `registry/components/${dependency}.tsx`))
      throw new Error(`${file}: invalid component dependency ${dependency}`);
  const slots = props.filter((p) => p.type.includes('ReactNode')).map((p) => p.name);
  const wrap = (example: string) =>
    `'use client';\nimport { useState } from 'react';\nimport { ${component} } from '@/components/knock/${slug}';\n\nexport default function Example() {\n  const [value, setValue] = useState('');\n  const [unlocked, setUnlocked] = useState(false);\n  const [message, setMessage] = useState('');\n  return <section aria-label="${title} example">\n    {/* Demo consumer state only. Integrate your authorization outside this UI. */}\n    ${example}\n    <p role="status">{message}</p>\n  </section>;\n}\n`;
  const examples = {
    minimal: wrap(minimal),
    full: wrap(
      wired +
        (props.some((p) => p.name === 'unlocked' || p.name === 'onRelock')
          ? '\n    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>'
          : ''),
    ),
  };
  for (const [kind, example] of Object.entries(examples)) {
    const exampleFile = `.generated/examples/${slug}-${kind}.tsx`;
    emit(
      exampleFile,
      example.replace(`@/components/knock/${slug}`, `../../${file.replace(/\.tsx$/, '')}`),
    );
    allExamples.push(exampleFile);
  }
  const standalone = flattenShared(component, content).replace(
    /from ['"]\.\.\/components\/([^'"]+)['"]/g,
    "from './$1'",
  );
  const contract = header
    .split('\n')
    .filter((l) => !l.includes('@') && !l.includes('MIT License'))
    .map((l) => l.replace(/^\s*\* ?/, '').trim())
    .filter(Boolean)
    .join(' ');
  const meta = {
    version,
    lifecycle,
    whenToUse,
    notFor,
    pitfalls,
    dependencies,
    usedBy,
    sourceHash: createHash('sha256').update(standalone).digest('hex'),
    component,
    contract,
    props,
    defaults,
    slots,
    a11y,
    unsupportedProps: unsupported,
    examples,
  };
  const propTable =
    '| Prop | Type | Required | Default | Description |\n|---|---|---|---|---|\n' +
    props
      .map(
        (p) =>
          `| ${p.name} | \`${p.type.replaceAll('|', '\\|').replaceAll('\n', ' ')}\` | ${p.required ? 'yes' : 'no'} | ${p.default ?? '—'} | ${p.description.replaceAll('|', '\\|')} |`,
      )
      .join('\n');
  const agentPrompt = `Install and wire ${title} (${component}) with \`npx shadcn@latest registry add @knock-codes\` then \`npx shadcn@latest add @knock-codes/${slug}\`, or from ${base}/r/${slug}.json. Read ${base}/docs/${slug}.md before editing.\n\n${contract}\n\nRequired props: ${
    props
      .filter((p) => p.required)
      .map((p) => p.name + ': ' + p.type)
      .join('; ') || 'none'
  }.\nOptional props and defaults:\n${props
    .filter((p) => !p.required)
    .map((p) => `- ${p.name}: ${p.type}; default ${p.default ?? 'omitted'}`)
    .join(
      '\n',
    )}\n\nThese are NOT props: ${unsupported.join(', ')}.\nNever put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.\n\nUse it when: ${whenToUse}\nDo not use it for: ${notFor}\nCommon mistakes:\n${pitfalls.map((p) => '- ' + p).join('\n')}\n\nAccessibility: ${a11y}\n\nMinimal example:\n\`\`\`tsx\n${examples.minimal}\`\`\`\n\nFully wired example:\n\`\`\`tsx\n${examples.full}\`\`\`\n`;
  const markdown = `# ${title}\n\nVersion ${version} · ${tier} · ${lifecycle}\n\n${contract}\n\n## When to use\n\n${whenToUse}\n\n## Not for\n\n${notFor}\n\n## Install\n\nThe registry is listed in the shadcn directory as \`@knock-codes\`.\n\n\`\`\`\nnpx shadcn@latest registry add @knock-codes\nnpx shadcn@latest add @knock-codes/${slug}\n\`\`\`\n\nDirect URL:\n\n\`npx shadcn@latest add ${base}/r/${slug}.json\`\n\nRequires React 18 or 19 and Tailwind CSS 4. No other runtime dependencies.\n\n[Live demo](${base}/playground/${slug}) · [Registry JSON](${base}/r/${slug}.json) · [Source](${base}/source/${slug}.tsx)\n\n## Props\n\n${propTable}\n\n### Label defaults\n\n${
    Object.entries(defaults)
      .filter(([k]) => k.startsWith('labels.'))
      .map(([k, v]) => `- ${k}: \`${v}\``)
      .join('\n') || 'See individual label/description props.'
  }\n\n## Common mistakes\n\n${pitfalls.map((p) => '- ' + p).join('\n')}\n\n## Related\n\n${
    [
      dependencies.length ? 'Installs alongside: ' + dependencies.join(', ') + '.' : '',
      usedBy.length ? 'Used by: ' + usedBy.join(', ') + '.' : '',
    ]
      .filter(Boolean)
      .join(' ') || 'Self-contained; no other item installs with it.'
  }\n\n## Accessibility\n\n${a11y}\n\n## Agent instructions and anti-hallucination contract\n\n${agentPrompt}\n\n## Source\n\n\`\`\`tsx\n${standalone}\n\`\`\`\n`;
  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: slug,
    type: tier === 'blocks' ? 'registry:block' : 'registry:component',
    title,
    description: contract,
    registryDependencies: dependencies.map((d) => `${base}/r/${d}.json`),
    files: [
      {
        path: file,
        type: 'registry:component',
        target: `@components/knock/${slug}.tsx`,
        content: standalone,
      },
    ],
    meta,
    docs: `UI only. Read ${base}/docs/${slug}.md. Consumers own authorization.`,
  };
  json(`public/r/${slug}.json`, registry);
  json(`public/r/react/${slug}.json`, registry);
  emit(`public/source/${slug}.tsx`, standalone);
  emit(`public/docs/${slug}.md`, markdown);
  emit(`public/prompts/${slug}.md`, agentPrompt);
  full += markdown + '\n\n---\n\n';
  catalog.push({
    name: slug,
    title,
    tier,
    version,
    component,
    props,
    dependencies,
    meta,
    registryUrl: `${base}/r/${slug}.json`,
  });
}
json('public/catalog.json', catalog);
const published = catalog.map((c) => {
  const item = JSON.parse(readFileSync(`public/r/${c.name}.json`, 'utf8'));
  const { $schema: _schema, ...rest } = item;
  return {
    ...rest,
    files: rest.files.map(({ content: _content, ...file }: { content?: string }) => file),
  };
});
const indexPayload = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'knock-codes',
  homepage: base,
  items: published,
};
json('registry.json', indexPayload);
json('public/r/registry.json', indexPayload);
json('public/r/react/registry.json', indexPayload);
const index = `# Knock\n\nCopy-paste demo-gate UI for React 18/19 + Tailwind CSS 4. No authentication, verification, storage, fetch, or sessions.\n\nThe registry is listed in the shadcn directory. Add it once with \`npx shadcn@latest registry add @knock-codes\`, then install items as \`@knock-codes/<name>\`.\n\nRead ${base}/llms-full.txt for the whole library in one fetch (contracts, examples and source).\nRequired values and callbacks are documented per item. Status success does not unlock: consumers own unlocked. Never invent onSuccess/password/correctCode/attempts/maxAttempts/onUnlock.\n\n## Items\n\n${catalog.map((c) => `- [${c.title}](${base}/docs/${c.name}.md): ${c.tier}, ${c.meta.lifecycle}; ${c.meta.whenToUse} Install \`@knock-codes/${c.name}\` or ${base}/r/${c.name}.json`).join('\n')}\n\n## Theme\n\nSet theme to light/dark or omit for system preference. Override --knock-bg, --knock-ink, --knock-muted, --knock-accent, --knock-border, --knock-error on a parent. Check contrast after customizing.\n`;
emit('public/llms.txt', index);
emit('public/llms-full.txt', full);
emit('public/docs/index.md', index);
json('.generated/tsconfig.json', {
  extends: '../tsconfig.json',
  include: ['examples/*.tsx', '../registry/**/*.tsx', '../registry/**/*.ts'],
});
if (changed.length) throw new Error(`Generated files are stale:\n${changed.join('\n')}`);
console.log(
  `${check ? 'Checked' : 'Generated'} ${catalog.length} items, ${allExamples.length} examples, Markdown docs, registry and agent indexes.`,
);
