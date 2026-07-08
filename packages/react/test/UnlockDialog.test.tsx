import test from "node:test";
import assert from "node:assert/strict";
import { useState } from "react";
import { render, cleanup, screen } from "@testing-library/react";
import { UnlockDialog } from "../UnlockDialog.tsx";

test.afterEach(cleanup);

function Harness({ open = true }: { open?: boolean }) {
  const [value, setValue] = useState("");
  return (
    <UnlockDialog
      open={open}
      value={value}
      onChange={setValue}
      onSubmit={() => {}}
      submitting={false}
      error={null}
    />
  );
}

test("renders nothing when closed", () => {
  render(<Harness open={false} />);
  assert.equal(screen.queryByRole("dialog"), null);
});

test("role=dialog + aria-modal + aria-labelledby pointing at the heading", () => {
  render(<Harness />);
  const dialog = screen.getByRole("dialog");
  assert.equal(dialog.getAttribute("aria-modal"), "true");
  const headingId = dialog.getAttribute("aria-labelledby");
  assert.ok(headingId);
  assert.equal(document.getElementById(headingId as string)?.tagName, "H2");
});

test("focus lands on the access-code input on open, not the dialog panel", () => {
  render(<Harness />);
  const input = screen.getByLabelText("Access code");
  assert.equal(document.activeElement, input);
});
