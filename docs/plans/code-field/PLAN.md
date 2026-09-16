# Code field — UI-first checkpoint

## Readiness
- Runtime: ready, per AUDIT.md.
- Application/component: does not exist, per AUDIT.md.
- Registry publishing: later milestone; keep a self-contained registry/components source now.

## Implementation
Build a React/Tailwind component workbench with a warm editorial design. Implement a controlled, accessible single native input with visual digit segments so paste, autofill, selection, arrows and backspace retain browser semantics. Keep passphrase and masked modes in the same file. No verification or storage in the component. Add normalization and DOM/a11y checks. Inspect using the browser, not Playwright.

## Scope
Stop after Code field. Remaining components, blocks and registry/doc generation await their checkpoints. No PR requested.
