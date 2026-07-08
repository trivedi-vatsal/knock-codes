import type { KnockCodesSession } from "./session.ts";

/** Structural subset of the Web Storage API — avoids depending on DOM lib types. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Minimal shape of the native `storage` event, enough to filter by key. */
export interface MinimalStorageEvent {
  key: string | null;
}

/** Structural subset of an event target that can fire `storage` events (i.e. `window`). */
export interface StorageEventTarget {
  addEventListener(type: "storage", listener: (event: MinimalStorageEvent) => void): void;
  removeEventListener(type: "storage", listener: (event: MinimalStorageEvent) => void): void;
}

export type StorageMode = "localStorage" | "sessionStorage" | "memory";

/**
 * Unified interface all three storage backends implement.
 * `subscribe` fires `callback` when the session changes in another tab; it
 * is a real cross-tab mechanism only for `localStorage` (native `storage`
 * events). For `sessionStorage` and `memory` it never fires — that's
 * correct behavior, not a missing feature, since neither mode has anything
 * to sync across tabs to begin with.
 */
export interface SessionStore {
  get(): KnockCodesSession | null;
  set(session: KnockCodesSession): void;
  clear(): void;
  subscribe(callback: () => void): () => void;
}

export const DEFAULT_STORAGE_KEY = "knock-codes:session";

const NOOP_UNSUBSCRIBE = () => {};

function isValidSession(value: unknown): value is KnockCodesSession {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.unlockedAt === "number" && typeof v.expiresAt === "number";
}

export interface CreateSessionStoreOptions {
  storageKey?: string;
  /** Injectable for tests or non-global environments; defaults to the real global. Ignored for `"memory"`. */
  storage?: StorageLike;
  /** Injectable for tests; defaults to the real global. Ignored for `"memory"` and `"sessionStorage"` — see the `subscribe` note above. */
  eventTarget?: StorageEventTarget;
}

export function createSessionStore(mode: StorageMode, options: CreateSessionStoreOptions = {}): SessionStore {
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;

  if (mode === "memory") return createMemoryStore();

  const storage = options.storage ?? getGlobalStorage(mode);
  const eventTarget = mode === "localStorage" ? options.eventTarget ?? getGlobalEventTarget() : undefined;
  return createWebStorageStore(mode, storageKey, storage, eventTarget);
}

function createMemoryStore(): SessionStore {
  let current: KnockCodesSession | null = null;
  return {
    get: () => current,
    set: (session) => {
      current = session;
    },
    clear: () => {
      current = null;
    },
    subscribe: () => NOOP_UNSUBSCRIBE,
  };
}

function createWebStorageStore(
  mode: "localStorage" | "sessionStorage",
  storageKey: string,
  storage: StorageLike | undefined,
  eventTarget: StorageEventTarget | undefined
): SessionStore {
  function requireStorage(): StorageLike {
    if (!storage) {
      throw new Error(
        `Knock Codes: ${mode} is not available in this environment. Pass a \`storage\` implementation explicitly, or use \`storage: "memory"\`.`
      );
    }
    return storage;
  }

  return {
    get() {
      const raw = requireStorage().getItem(storageKey);
      if (raw === null) return null;
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return null; // corrupted entry reads as "no session", not a crash
      }
      return isValidSession(parsed) ? parsed : null;
    },
    set(session) {
      requireStorage().setItem(storageKey, JSON.stringify(session));
    },
    clear() {
      requireStorage().removeItem(storageKey);
    },
    subscribe(callback) {
      if (mode !== "localStorage" || !eventTarget) return NOOP_UNSUBSCRIBE;
      const handler = (event: MinimalStorageEvent) => {
        if (event.key === storageKey || event.key === null) callback();
      };
      eventTarget.addEventListener("storage", handler);
      return () => eventTarget.removeEventListener("storage", handler);
    },
  };
}

function getGlobalStorage(mode: "localStorage" | "sessionStorage"): StorageLike | undefined {
  const g = globalThis as unknown as { localStorage?: StorageLike; sessionStorage?: StorageLike };
  return mode === "localStorage" ? g.localStorage : g.sessionStorage;
}

function getGlobalEventTarget(): StorageEventTarget | undefined {
  const g = globalThis as unknown as Partial<StorageEventTarget>;
  if (typeof g.addEventListener !== "function" || typeof g.removeEventListener !== "function") return undefined;
  return g as StorageEventTarget;
}
