import test from "node:test";
import assert from "node:assert/strict";
import { sha256Hex } from "../hash.ts";

test("matches known SHA-256 test vectors", async () => {
  assert.equal(
    await sha256Hex(""),
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  );
  assert.equal(
    await sha256Hex("abc"),
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
  );
  assert.equal(
    await sha256Hex("hello"),
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
  );
});

test("output is 64 lowercase hex characters", async () => {
  const hash = await sha256Hex("some PIN");
  assert.match(hash, /^[0-9a-f]{64}$/);
});

test("is deterministic for the same input", async () => {
  assert.equal(await sha256Hex("repeat-me"), await sha256Hex("repeat-me"));
});

test("does not trim leading/trailing whitespace (ADR-0009)", async () => {
  const a = await sha256Hex("1234");
  const b = await sha256Hex(" 1234 ");
  assert.notEqual(a, b);
});

test("does not case-fold (ADR-0009)", async () => {
  const a = await sha256Hex("Passphrase");
  const b = await sha256Hex("passphrase");
  assert.notEqual(a, b);
});

test("distinguishes visually similar but distinct inputs", async () => {
  const a = await sha256Hex("0000");
  const b = await sha256Hex("00000");
  assert.notEqual(a, b);
});
