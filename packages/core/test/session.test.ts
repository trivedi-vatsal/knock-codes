import test from "node:test";
import assert from "node:assert/strict";
import { createSession, isExpired, touchExpiry } from "../session.ts";

const NOW = 1_700_000_000_000;

test("createSession: sets unlockedAt/expiresAt from now + timeout", () => {
  const session = createSession({}, 60_000, NOW);
  assert.equal(session.unlockedAt, NOW);
  assert.equal(session.expiresAt, NOW + 60_000);
});

test("createSession: omits token entirely when the verify result has none", () => {
  const session = createSession({}, 60_000, NOW);
  assert.equal("token" in session, false);
});

test("createSession: includes token verbatim when the verify result has one", () => {
  const session = createSession({ token: "server-token" }, 60_000, NOW);
  assert.equal(session.token, "server-token");
});

test("isExpired: false before expiresAt", () => {
  const session = createSession({}, 60_000, NOW);
  assert.equal(isExpired(session, NOW + 59_999), false);
});

test("isExpired: true at and after expiresAt", () => {
  const session = createSession({}, 60_000, NOW);
  assert.equal(isExpired(session, NOW + 60_000), true);
  assert.equal(isExpired(session, NOW + 60_001), true);
});

test("touchExpiry: rewrites expiresAt relative to the new now, leaves unlockedAt and token alone", () => {
  const session = createSession({ token: "t" }, 60_000, NOW);
  const touched = touchExpiry(session, 60_000, NOW + 30_000);
  assert.equal(touched.unlockedAt, NOW);
  assert.equal(touched.expiresAt, NOW + 30_000 + 60_000);
  assert.equal(touched.token, "t");
});

test("touchExpiry: does not mutate the original session object", () => {
  const session = createSession({}, 60_000, NOW);
  const originalExpiresAt = session.expiresAt;
  touchExpiry(session, 60_000, NOW + 30_000);
  assert.equal(session.expiresAt, originalExpiresAt);
});
