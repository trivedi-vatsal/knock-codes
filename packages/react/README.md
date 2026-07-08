# @access-gate/react

The React blocks and templates — `<AccessGate>`, `useAccessGate`, PIN Input, Protected
Route/Layout/Modal/Card, Session Provider, Access Gate/Branded/Minimal/Modal templates, and everything else
in the gallery — built on [`@access-gate/core`](../core).

Not published to npm. This package is copy-owned: it's distributed by copying the source files (via the
[shadcn-compatible registry](../../registry/react/registry.json) or by hand), not via `npm install`. See
the root [`README.md`](../../README.md) for the project pitch, [`/getting-started`](../../apps/web/app/getting-started)
for the setup walkthrough, and [`CONTRIBUTING.md`](../../CONTRIBUTING.md) for how to add a block or
template.

## Contents

- `useAccessGate.ts` — the headless hook every visible block either wraps or composes on.
- `AccessGate.tsx`, `StandaloneGate.tsx`, `EmbeddedGate.tsx`, `ProtectedRoute.tsx`, `ProtectedLayout.tsx`,
  `ProtectedCard.tsx`, `ProtectedModal.tsx` — gate shapes for different placements.
- `PinInput.tsx`, `UnlockDialog.tsx`, `GateWrapper.tsx`, `VerificationLoader.tsx`,
  `AccessDeniedScreen.tsx` — presentational pieces the gates above compose on, also usable standalone.
- `AccessGateProvider.tsx`, `useAccessGate.ts`'s context counterpart, `LogoutButton.tsx`,
  `SessionTimeoutBanner.tsx` — for sharing one session across multiple components.
- `AccessGateTemplate.tsx`, `BrandedAccessTemplate.tsx`, `MinimalAccessTemplate.tsx`,
  `ModalAccessTemplate.tsx` — complete, single-file screens (the Templates gallery).

## Develop

```
pnpm --filter @access-gate/react test
pnpm --filter @access-gate/react typecheck
```
