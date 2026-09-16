/** MIT License — Copyright (c) 2026 Knock contributors. */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
const catalog = JSON.parse(readFileSync('public/catalog.json', 'utf8'));
test('all 17 registry payloads include source-derived contracts and resolvable dependencies', () => {
  assert.equal(catalog.length, 17);
  for (const item of catalog) {
    const registry = JSON.parse(readFileSync(`public/r/${item.name}.json`, 'utf8'));
    assert.equal(registry.name, item.name);
    assert.ok(registry.meta.sourceHash);
    assert.match(registry.files[0].content, /MIT License/);
    assert.match(registry.files[0].content, /'use client'/);
    assert.ok(registry.meta.examples.minimal);
    assert.ok(registry.meta.examples.full);
    assert.equal(registry.meta.unsupportedProps.length, 6);
    const markdown = readFileSync(`public/docs/${item.name}.md`, 'utf8');
    assert.ok(markdown.includes('These are NOT props'));
    // The docs view renders these fields; missing guidance must fail here, not in the browser.
    for (const section of ['## When to use', '## Not for', '## Common mistakes', '## Related'])
      assert.ok(markdown.includes(section), `${item.name} markdown ${section}`);
    assert.ok(['gate', 'unlocked', 'ended'].includes(registry.meta.lifecycle), item.name);
    assert.ok(registry.meta.whenToUse, item.name);
    assert.ok(registry.meta.notFor, item.name);
    assert.ok(registry.meta.pitfalls.length, item.name);
    assert.deepEqual(registry.meta.dependencies, item.dependencies);
    for (const user of registry.meta.usedBy)
      assert.ok(
        catalog.find((c: { name: string }) => c.name === user).dependencies.includes(item.name),
        `${item.name} is used by ${user}`,
      );
    for (const dep of registry.registryDependencies)
      assert.ok(catalog.some((c: { name: string }) => dep.endsWith(`/r/${c.name}.json`)));
    const alias = JSON.parse(readFileSync(`public/r/react/${item.name}.json`, 'utf8'));
    assert.deepEqual(alias, registry);
  }
  const blocks = catalog.filter((c: { tier: string }) => c.tier === 'blocks');
  for (const block of blocks)
    assert.deepEqual(
      block.props.map((p: { name: string; type: string; required: boolean }) => ({
        name: p.name,
        type: p.type,
        required: p.required,
      })),
      blocks[0].props.map((p: { name: string; type: string; required: boolean }) => ({
        name: p.name,
        type: p.type,
        required: p.required,
      })),
      `${block.name} has the same prop contract`,
    );
});
test('published catalogs match the shadcn directory: named knock-codes, no file content', () => {
  for (const file of ['registry.json', 'public/r/registry.json', 'public/r/react/registry.json']) {
    const registry = JSON.parse(readFileSync(file, 'utf8'));
    assert.equal(registry.name, 'knock-codes');
    assert.equal(registry.homepage, 'https://knock.codes');
    assert.equal(registry.items.length, 17);
    for (const item of registry.items) {
      assert.equal(item.$schema, undefined);
      assert.ok(item.files[0].path);
      assert.equal(item.files[0].content, undefined);
    }
  }
});
