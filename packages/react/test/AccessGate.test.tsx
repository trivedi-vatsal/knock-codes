import test from "node:test";
import assert from "node:assert/strict";
import { render, cleanup, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { AccessGate } from "../AccessGate.tsx";
import { sha256Hex } from "../../core/hash.ts";

test.afterEach(cleanup);

test("renders the PIN entry UI in place of children when locked", async () => {
  const hash = await sha256Hex("secret");
  render(
    <AccessGate expectedHash={hash} storage="memory">
      <div>Protected content</div>
    </AccessGate>
  );

  assert.ok(screen.getByText("This page is protected"));
  assert.ok(screen.getByLabelText("Access code"));
  assert.equal(screen.queryByText("Protected content"), null);
});

test("renders children immediately (no reload) once unlocked with the correct code", async () => {
  const user = userEvent.setup();
  const hash = await sha256Hex("secret");
  render(
    <AccessGate expectedHash={hash} storage="memory">
      <div>Protected content</div>
    </AccessGate>
  );

  await user.type(screen.getByLabelText("Access code"), "secret{Enter}");

  assert.ok(await screen.findByText("Protected content"));
  assert.equal(screen.queryByLabelText("Access code"), null);
});

test("wrong code shows the invalid-code inline error and stays locked", async () => {
  const user = userEvent.setup();
  const hash = await sha256Hex("secret");
  render(
    <AccessGate expectedHash={hash} storage="memory">
      <div>Protected content</div>
    </AccessGate>
  );

  await user.type(screen.getByLabelText("Access code"), "wrong{Enter}");

  assert.ok(await screen.findByText("That code didn't work. Try again."));
  assert.equal(screen.queryByText("Protected content"), null);
});

test("a network-mode failure shows the distinct network error, not the invalid-code copy", async () => {
  const user = userEvent.setup();
  render(
    <AccessGate verify={async () => ({ ok: false, reason: "network" })} storage="memory">
      <div>Protected content</div>
    </AccessGate>
  );

  await user.type(screen.getByLabelText("Access code"), "anything{Enter}");

  assert.ok(await screen.findByText("Couldn't reach the server. Try again."));
});

test("labels prop overrides default copy (localization) — docs/ux/flows.md § Accessibility Requirements", async () => {
  const hash = await sha256Hex("secret");
  render(
    <AccessGate expectedHash={hash} storage="memory" labels={{ heading: "Entrez le code", inputLabel: "Code d'accès" }}>
      <div>Protected content</div>
    </AccessGate>
  );

  assert.ok(screen.getByText("Entrez le code"));
  assert.ok(screen.getByLabelText("Code d'accès"));
});

test("mutual exclusivity of expectedHash and verify throws at mount (ADR-0009/0011)", () => {
  assert.throws(() => {
    render(
      <AccessGate expectedHash="x" verify={async () => ({ ok: true })} storage="memory">
        <div>Protected content</div>
      </AccessGate>
    );
  }, /supply either `expectedHash` or `verify`, not both/);
});
