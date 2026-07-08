// Preloaded via `node --import ./scripts/preload.mjs --test` (package.json
// `test` script). Node's test runner applies `--import` to every subprocess
// it spawns per test file, so this registers once per file, before that
// file's own imports run. Lives under scripts/ (not test/), and is named
// without a `test-`/`.test.` marker, because Node's default test-file
// discovery globs both "any file directly inside a directory literally named
// `test`" and "any file named `test-*`/`*.test.*` anywhere" — either would
// make Node try to run this preload script itself as a test.
import { register } from "node:module";
import { JSDOM } from "jsdom";

register("./tsx-loader.mjs", import.meta.url);

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

const { window } = dom;

globalThis.window = window;
globalThis.document = window.document;
// Node already defines a getter-only global `navigator` (its own, unrelated
// one) since v21 — a plain assignment throws, so redefine the property.
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
  writable: true,
});
globalThis.HTMLElement = window.HTMLElement;
globalThis.Element = window.Element;
globalThis.Node = window.Node;
globalThis.getComputedStyle = window.getComputedStyle.bind(window);
globalThis.requestAnimationFrame = window.requestAnimationFrame;
globalThis.cancelAnimationFrame = window.cancelAnimationFrame;

// `addEventListener`/`removeEventListener` (mirroring a real browser, where
// `window` *is* `globalThis`) so the React surface's cross-tab-sync test can
// dispatch native `storage` events. Deliberately NOT wiring up
// `globalThis.localStorage`/`sessionStorage` here: test/core/storage.test.ts
// has a test that specifically asserts createSessionStore throws when no
// global storage is available at all, and this file's --import applies to
// every test file's subprocess, core included. The one React test that needs
// a real global localStorage sets it up (and tears it down) itself.
globalThis.addEventListener = window.addEventListener.bind(window);
globalThis.removeEventListener = window.removeEventListener.bind(window);
globalThis.dispatchEvent = window.dispatchEvent.bind(window);

// React's test-mode act() wrapping expects this flag; without it React logs
// "not wrapped in act(...)" warnings even when @testing-library/react does
// wrap correctly.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
