import test from "node:test";
import assert from "node:assert/strict";
import { useState } from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PinInput } from "../PinInput.tsx";

test.afterEach(cleanup);

function Harness({
  initialValue = "",
  submitting = false,
  error = null,
}: {
  initialValue?: string;
  submitting?: boolean;
  error?: { reason: "invalid" | "network" } | null;
}) {
  const [value, setValue] = useState(initialValue);
  const [submitted, setSubmitted] = useState(0);
  return (
    <>
      <PinInput
        value={value}
        onChange={setValue}
        onSubmit={() => setSubmitted((n: number) => n + 1)}
        submitting={submitting}
        error={error}
      />
      {/* plain div, not <output> — <output>'s implicit ARIA role is also "status", which would collide with PinInput's own status region in role-based queries */}
      <div data-testid="submit-count">{submitted}</div>
    </>
  );
}

test("labeled distinctly as 'Access code', masked by default", () => {
  render(<Harness />);
  const input = screen.getByLabelText("Access code") as HTMLInputElement;
  assert.equal(input.type, "password");
});

test("typing calls onChange with the new value", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  const input = screen.getByLabelText("Access code");
  await user.type(input, "1234");
  assert.equal((input as HTMLInputElement).value, "1234");
});

test("paste is supported natively by the underlying text input", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  const input = screen.getByLabelText("Access code") as HTMLInputElement;
  input.focus();
  await user.paste("pasted-code");
  assert.equal(input.value, "pasted-code");
});

test("show/hide toggle switches the input between masked and revealed", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  const input = screen.getByLabelText("Access code") as HTMLInputElement;
  assert.equal(input.type, "password");

  await user.click(screen.getByRole("button", { name: "Show code" }));
  assert.equal(input.type, "text");

  await user.click(screen.getByRole("button", { name: "Hide code" }));
  assert.equal(input.type, "password");
});

test("submit is disabled when the value is empty, enabled once non-empty", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  const submitButton = screen.getByRole("button", { name: "Unlock" });
  assert.equal(submitButton.hasAttribute("disabled"), true);

  await user.type(screen.getByLabelText("Access code"), "x");
  assert.equal(submitButton.hasAttribute("disabled"), false);
});

test("pressing Enter with a non-empty value submits exactly once", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await user.type(screen.getByLabelText("Access code"), "1234{Enter}");
  assert.equal(screen.getByTestId("submit-count").textContent, "1");
});

test("Enter on an empty field does not submit", async () => {
  const user = userEvent.setup();
  render(<Harness />);
  await user.type(screen.getByLabelText("Access code"), "{Enter}");
  assert.equal(screen.getByTestId("submit-count").textContent, "0");
});

test("submitting state shows the busy label and disables input + submit button", () => {
  render(<Harness submitting />);
  assert.equal(screen.getByRole("status").textContent, "Checking...");
  assert.equal(screen.getByRole("button", { name: "Checking..." }).hasAttribute("disabled"), true);
  assert.equal(screen.getByLabelText("Access code").hasAttribute("disabled"), true);
});

test("invalid error is announced in the aria-live region", () => {
  render(<Harness error={{ reason: "invalid" }} />);
  assert.equal(screen.getByText("That code didn't work. Try again.").textContent, "That code didn't work. Try again.");
});

test("network error uses distinct copy from invalid (ADR-0009)", () => {
  render(<Harness error={{ reason: "network" }} />);
  assert.equal(screen.getByText("Couldn't reach the server. Try again.").textContent, "Couldn't reach the server. Try again.");
});
