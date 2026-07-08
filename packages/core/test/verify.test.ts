import test from "node:test";
import assert from "node:assert/strict";
import { sha256Hex } from "../hash.ts";
import { createLocalHashVerifier, resolveVerifyFn, type VerifyFn } from "../verify.ts";

test("createLocalHashVerifier: resolves ok:true on a matching hash", async () => {
  const expectedHash = await sha256Hex("correct-pin");
  const verify = createLocalHashVerifier(expectedHash);
  assert.deepEqual(await verify("correct-pin"), { ok: true });
});

test("createLocalHashVerifier: resolves ok:false, reason:invalid on a mismatch", async () => {
  const expectedHash = await sha256Hex("correct-pin");
  const verify = createLocalHashVerifier(expectedHash);
  assert.deepEqual(await verify("wrong-pin"), { ok: false, reason: "invalid" });
});

test("createLocalHashVerifier: never produces a token", async () => {
  const expectedHash = await sha256Hex("correct-pin");
  const verify = createLocalHashVerifier(expectedHash);
  const result = await verify("correct-pin");
  assert.equal(result.ok, true);
  assert.ok(!("token" in result) || result.token === undefined);
});

test("resolveVerifyFn: expectedHash alone builds a local-hash verifier", async () => {
  const expectedHash = await sha256Hex("1234");
  const verify = resolveVerifyFn({ expectedHash });
  assert.deepEqual(await verify("1234"), { ok: true });
});

test("resolveVerifyFn: verify alone passes through unchanged", async () => {
  const custom: VerifyFn = async (code) =>
    code === "server-code" ? { ok: true, token: "abc" } : { ok: false, reason: "network" };
  const resolved = resolveVerifyFn({ verify: custom });
  assert.equal(resolved, custom);
  assert.deepEqual(await resolved("server-code"), { ok: true, token: "abc" });
  assert.deepEqual(await resolved("other"), { ok: false, reason: "network" });
});

test("resolveVerifyFn: throws when both expectedHash and verify are supplied", () => {
  assert.throws(
    () => resolveVerifyFn({ expectedHash: "x", verify: async () => ({ ok: false }) }),
    /supply either `expectedHash` or `verify`, not both/
  );
});

test("resolveVerifyFn: throws when neither is supplied", () => {
  assert.throws(() => resolveVerifyFn({}), /no implicit default verification strategy/);
});
