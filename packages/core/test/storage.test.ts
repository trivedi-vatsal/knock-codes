import test from "node:test";
import assert from "node:assert/strict";
import { createSessionStore, DEFAULT_STORAGE_KEY, type MinimalStorageEvent, type StorageLike } from "../storage.ts";
import type { AccessGateSession } from "../session.ts";

const SESSION: AccessGateSession = { unlockedAt: 1, expiresAt: 2 };

function createMockStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

function createMockEventTarget() {
  const listeners = new Set<(event: MinimalStorageEvent) => void>();
  return {
    addEventListener: (_type: "storage", listener: (event: MinimalStorageEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_type: "storage", listener: (event: MinimalStorageEvent) => void) => {
      listeners.delete(listener);
    },
    dispatch: (event: MinimalStorageEvent) => {
      for (const listener of listeners) listener(event);
    },
  };
}

test("memory: get/set/clear round-trip, no global storage needed", () => {
  const store = createSessionStore("memory");
  assert.equal(store.get(), null);
  store.set(SESSION);
  assert.deepEqual(store.get(), SESSION);
  store.clear();
  assert.equal(store.get(), null);
});

test("memory: subscribe never fires", () => {
  const store = createSessionStore("memory");
  let fired = false;
  const unsubscribe = store.subscribe(() => {
    fired = true;
  });
  store.set(SESSION);
  assert.equal(fired, false);
  unsubscribe(); // must be callable without throwing
});

test("localStorage (mocked): get/set/clear round-trip via the injected storage", () => {
  const storage = createMockStorage();
  const store = createSessionStore("localStorage", { storage });
  store.set(SESSION);
  assert.equal(storage.getItem(DEFAULT_STORAGE_KEY), JSON.stringify(SESSION));
  assert.deepEqual(store.get(), SESSION);
  store.clear();
  assert.equal(storage.getItem(DEFAULT_STORAGE_KEY), null);
});

test("localStorage (mocked): corrupted JSON reads as no session, not a crash", () => {
  const storage = createMockStorage();
  storage.setItem(DEFAULT_STORAGE_KEY, "{not json");
  const store = createSessionStore("localStorage", { storage });
  assert.equal(store.get(), null);
});

test("localStorage (mocked): valid JSON with the wrong shape reads as no session", () => {
  const storage = createMockStorage();
  storage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify({ notASession: true }));
  const store = createSessionStore("localStorage", { storage });
  assert.equal(store.get(), null);
});

test("localStorage: throws a clear error when no storage is available (no global, none injected)", () => {
  const store = createSessionStore("localStorage");
  assert.throws(() => store.set(SESSION), /localStorage is not available in this environment/);
  assert.throws(() => store.get(), /localStorage is not available in this environment/);
  assert.throws(() => store.clear(), /localStorage is not available in this environment/);
});

test("localStorage (mocked): subscribe fires on a matching-key storage event, not on a different key", () => {
  const storage = createMockStorage();
  const eventTarget = createMockEventTarget();
  const store = createSessionStore("localStorage", { storage, eventTarget });

  let fireCount = 0;
  const unsubscribe = store.subscribe(() => {
    fireCount++;
  });

  eventTarget.dispatch({ key: "some-other-key" });
  assert.equal(fireCount, 0);

  eventTarget.dispatch({ key: DEFAULT_STORAGE_KEY });
  assert.equal(fireCount, 1);

  eventTarget.dispatch({ key: null }); // null key = storage was cleared entirely
  assert.equal(fireCount, 2);

  unsubscribe();
  eventTarget.dispatch({ key: DEFAULT_STORAGE_KEY });
  assert.equal(fireCount, 2, "no further calls after unsubscribe");
});

test("sessionStorage (mocked): subscribe never fires, even if an eventTarget is supplied", () => {
  const storage = createMockStorage();
  const eventTarget = createMockEventTarget();
  const store = createSessionStore("sessionStorage", { storage, eventTarget });

  let fired = false;
  store.subscribe(() => {
    fired = true;
  });
  eventTarget.dispatch({ key: DEFAULT_STORAGE_KEY });
  assert.equal(fired, false);
});

test("storageKey option overrides the default key", () => {
  const storage = createMockStorage();
  const store = createSessionStore("localStorage", { storage, storageKey: "custom:key" });
  store.set(SESSION);
  assert.equal(storage.getItem("custom:key"), JSON.stringify(SESSION));
  assert.equal(storage.getItem(DEFAULT_STORAGE_KEY), null);
});
