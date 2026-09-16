/** MIT License — Copyright (c) 2026 Knock contributors. Offline protocol self-test, not a model eval. */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
process.env.OPENAI_API_KEY = 'offline-protocol-fixture';
process.env.OPENAI_MODEL = 'offline-fixture-not-a-model';
process.env.EVAL_ITEM = 'client-preview-gate';
process.env.EVAL_REPORT_PATH = 'artifacts/runner-self-test.json';
const item = JSON.parse(readFileSync('public/r/client-preview-gate.json', 'utf8'));
const calls = [
  { name: 'read_document', arguments: JSON.stringify({ url: '/docs/client-preview-gate.md' }) },
  { name: 'install', arguments: JSON.stringify({ name: 'client-preview-gate' }) },
  {
    name: 'write_app',
    arguments: JSON.stringify({
      source: item.meta.examples.full.replace('function Example()', 'function App()'),
    }),
  },
  { name: 'finish', arguments: '{}' },
];
let count = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, options) => {
  assert.equal(String(input), 'https://api.openai.com/v1/responses');
  const request = JSON.parse(String(options?.body));
  assert.equal(request.store, false);
  if (count === 0) {
    assert.equal(request.input.length, 1);
    assert.match(request.input[0].content, /# Knock/);
    assert.doesNotMatch(request.input[0].content, /export interface/);
  }
  const call = calls[count++];
  assert.ok(call, 'Unexpected extra model call');
  return new Response(
    JSON.stringify({ output: [{ type: 'function_call', call_id: `offline-${count}`, ...call }] }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
try {
  await import('./model-eval');
  assert.equal(count, 4);
  console.log('Offline eval runner self-test passed. This is not a model-backed result.');
} finally {
  globalThis.fetch = realFetch;
}
