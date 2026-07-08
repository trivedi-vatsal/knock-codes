import test from "node:test";
import assert from "node:assert/strict";
import { renderHook, act, cleanup } from "@testing-library/react";
import { useAccessGate } from "../useAccessGate.ts";
import { sha256Hex } from "../../core/hash.ts";

test.afterEach(cleanup);

test("starts idle with no existing session", async () => {
  const { result } = renderHook(() => useAccessGate({ expectedHash: "irrelevant", storage: "memory" }));
  assert.equal(result.current.state, "idle");
  assert.equal(result.current.session, null);
  assert.equal(result.current.error, null);
});

test("submit with a matching hash unlocks and writes a session with no token", async () => {
  const hash = await sha256Hex("correct-horse-battery-staple");
  const { result } = renderHook(() => useAccessGate({ expectedHash: hash, storage: "memory" }));

  await act(async () => {
    await result.current.submit("correct-horse-battery-staple");
  });

  assert.equal(result.current.state, "unlocked");
  assert.equal(result.current.error, null);
  assert.ok(result.current.session);
  assert.equal(typeof result.current.session?.unlockedAt, "number");
  assert.equal(typeof result.current.session?.expiresAt, "number");
  assert.equal("token" in (result.current.session ?? {}), false);
});

test("submit with a wrong code sets reason:invalid and stays idle", async () => {
  const hash = await sha256Hex("the-real-code");
  const { result } = renderHook(() => useAccessGate({ expectedHash: hash, storage: "memory" }));

  await act(async () => {
    await result.current.submit("wrong-code");
  });

  assert.equal(result.current.state, "idle");
  assert.equal(result.current.session, null);
  assert.deepEqual(result.current.error, { reason: "invalid" });
});

test("empty submit is a no-op — never calls the verify strategy", async () => {
  let calls = 0;
  const { result } = renderHook(() =>
    useAccessGate({
      verify: async () => {
        calls++;
        return { ok: true };
      },
      storage: "memory",
    })
  );

  await act(async () => {
    await result.current.submit("");
  });

  assert.equal(calls, 0);
  assert.equal(result.current.state, "idle");
});

test("a throwing verify() resolves to reason:network (ADR-0009)", async () => {
  const { result } = renderHook(() =>
    useAccessGate({
      verify: async () => {
        throw new Error("boom");
      },
      storage: "memory",
    })
  );

  await act(async () => {
    await result.current.submit("anything");
  });

  assert.deepEqual(result.current.error, { reason: "network" });
  assert.equal(result.current.state, "idle");
});

test("reason:'unknown' from verify() collapses into 'invalid' for the UI (ADR-0009)", async () => {
  const { result } = renderHook(() =>
    useAccessGate({
      verify: async () => ({ ok: false, reason: "unknown" }) as const,
      storage: "memory",
    })
  );

  await act(async () => {
    await result.current.submit("anything");
  });

  assert.deepEqual(result.current.error, { reason: "invalid" });
});

test("a server-mode token is stored verbatim on the session", async () => {
  const { result } = renderHook(() =>
    useAccessGate({
      verify: async () => ({ ok: true, token: "server-issued-token" }),
      storage: "memory",
    })
  );

  await act(async () => {
    await result.current.submit("anything");
  });

  assert.equal(result.current.session?.token, "server-issued-token");
});

test("logout clears the session and returns to idle", async () => {
  const hash = await sha256Hex("secret");
  const { result } = renderHook(() => useAccessGate({ expectedHash: hash, storage: "memory" }));

  await act(async () => {
    await result.current.submit("secret");
  });
  assert.equal(result.current.state, "unlocked");

  act(() => {
    result.current.logout();
  });

  assert.equal(result.current.state, "idle");
  assert.equal(result.current.session, null);
});

test("calling submit() again while one is already in flight is ignored (no concurrent verify calls)", async () => {
  let calls = 0;
  const { result } = renderHook(() =>
    useAccessGate({
      verify: async () => {
        calls++;
        await new Promise((resolve) => setTimeout(resolve, 30));
        return { ok: true };
      },
      storage: "memory",
    })
  );

  await act(async () => {
    const first = result.current.submit("code-a");
    const second = result.current.submit("code-b"); // fired before `first` resolves — must be a no-op
    await Promise.all([first, second]);
  });

  assert.equal(calls, 1);
  assert.equal(result.current.state, "unlocked");
});

test("resolveVerifyFn's mutual-exclusivity throw surfaces from the hook (ADR-0009/0011)", () => {
  assert.throws(() => {
    renderHook(() => useAccessGate({ expectedHash: "x", verify: async () => ({ ok: true }), storage: "memory" }));
  }, /supply either `expectedHash` or `verify`, not both/);
});

test("activity tracking disabled (default): interaction does not touch expiresAt", async () => {
  const hash = await sha256Hex("secret");
  const { result } = renderHook(() => useAccessGate({ expectedHash: hash, storage: "memory", timeout: 60_000 }));

  await act(async () => {
    await result.current.submit("secret");
  });
  const before = result.current.session?.expiresAt;

  await act(async () => {
    window.dispatchEvent(new window.Event("keydown"));
  });

  assert.equal(result.current.session?.expiresAt, before);
});

test("activity tracking enabled: rapid repeated interaction only touches once (throttled)", async () => {
  const hash = await sha256Hex("secret");
  const { result } = renderHook(() =>
    useAccessGate({ expectedHash: hash, storage: "memory", timeout: 60_000, activityTracking: true })
  );

  await act(async () => {
    await result.current.submit("secret");
  });

  await act(async () => {
    window.dispatchEvent(new window.Event("keydown"));
  });
  const sessionAfterFirst = result.current.session;

  await act(async () => {
    window.dispatchEvent(new window.Event("keydown"));
  });

  assert.equal(result.current.session, sessionAfterFirst, "second immediate interaction must not rewrite the session again");
});

test("activity tracking enabled: interaction after the throttle window extends expiresAt (sliding model)", async () => {
  const hash = await sha256Hex("secret");
  const { result } = renderHook(() =>
    useAccessGate({ expectedHash: hash, storage: "memory", timeout: 60_000, activityTracking: true })
  );

  await act(async () => {
    await result.current.submit("secret");
  });
  const before = result.current.session?.expiresAt;

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1100));
    window.dispatchEvent(new window.Event("keydown"));
  });

  assert.ok((result.current.session?.expiresAt ?? 0) > (before ?? 0));
});

test("expiry is detected on window focus (fixed-timeout model)", async () => {
  const hash = await sha256Hex("secret");
  const { result } = renderHook(() => useAccessGate({ expectedHash: hash, storage: "memory", timeout: 10 }));

  await act(async () => {
    await result.current.submit("secret");
  });
  assert.equal(result.current.state, "unlocked");

  await new Promise((resolve) => setTimeout(resolve, 25));
  await act(async () => {
    window.dispatchEvent(new window.Event("focus"));
  });

  assert.equal(result.current.state, "idle");
  assert.equal(result.current.session, null);
});

test("expiry is detected by the background poll even without a focus event", async () => {
  const hash = await sha256Hex("secret");
  const { result } = renderHook(() => useAccessGate({ expectedHash: hash, storage: "memory", timeout: 10 }));

  await act(async () => {
    await result.current.submit("secret");
  });

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1150));
  });

  assert.equal(result.current.state, "idle");
  assert.equal(result.current.session, null);
});

test("default storage is localStorage, and cross-tab changes propagate via the storage event (ADR-0008/0011)", async () => {
  // src/core/storage.ts's default (no options-injected) path reads
  // `globalThis.localStorage`/`addEventListener` directly, mirroring a real
  // browser where `window` *is* `globalThis`. Scoped to this one test (not
  // the shared preload) because test/core/storage.test.ts specifically
  // asserts createSessionStore throws when no global storage exists at all.
  globalThis.localStorage = window.localStorage;
  try {
    const hash = await sha256Hex("secret");
    const storageKey = `access-gate:test:${Math.random().toString(36).slice(2)}`;
    const { result } = renderHook(() => useAccessGate({ expectedHash: hash, storageKey }));

    assert.equal(result.current.state, "idle");

    const foreignSession = { unlockedAt: Date.now(), expiresAt: Date.now() + 60_000 };
    window.localStorage.setItem(storageKey, JSON.stringify(foreignSession));
    await act(async () => {
      window.dispatchEvent(new window.StorageEvent("storage", { key: storageKey }));
    });

    assert.equal(result.current.state, "unlocked");
    assert.deepEqual(result.current.session, foreignSession);

    window.localStorage.removeItem(storageKey);
  } finally {
    delete (globalThis as { localStorage?: unknown }).localStorage;
  }
});
