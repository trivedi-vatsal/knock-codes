import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, pathFor } from '../src/routes';
const names = ['Code field', 'Client preview gate'];
test('known routes resolve and unknown paths remain not found', () => {
  assert.equal(parseRoute('/', names).view, 'home');
  assert.equal(parseRoute('/library/', names).view, 'library');
  assert.equal(parseRoute('/docs/get-started', names).guide, 'get-started');
  assert.deepEqual(parseRoute('/playground/client-preview-gate', names), {
    selected: 'Client preview gate',
    view: 'playground',
  });
  assert.equal(pathFor(parseRoute('/docs/code-field', names)), '/docs/code-field');
  for (const path of [
    '/missing',
    '/docs/missing',
    '/playground/missing',
    '/library/extra',
    '/docs/code-field/extra',
    '/docs/toString',
    '//library',
  ]) {
    assert.equal(parseRoute(path, names).view, 'not-found', path);
  }
});
