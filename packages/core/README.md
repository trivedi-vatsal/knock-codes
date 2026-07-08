# @access-gate/core

Framework-agnostic hash/session/storage/verify logic for Access Gate — no UI, no React dependency.

Not published to npm. This package is copy-owned: it's distributed by copying the source files (via the
[shadcn-compatible registry](../../registry/react/registry.json) or by hand), not via `npm install`. See
the root [`README.md`](../../README.md) for the project pitch and [`CONTRIBUTING.md`](../../CONTRIBUTING.md)
for how to change it.

## Contents

- `hash.ts` — `sha256Hex`, the one hashing primitive every local-mode verification uses.
- `session.ts` — `createSession`/`isExpired`/`touchExpiry`, pure functions over a plain session object.
- `storage.ts` — `createSessionStore`, an adapter over `localStorage`/`sessionStorage`/in-memory storage.
- `verify.ts` — `resolveVerifyFn`, turning either `expectedHash` (local mode) or a custom `verify` function
  (server mode) into one common shape.

## Develop

```
pnpm --filter @access-gate/core test
pnpm --filter @access-gate/core typecheck
```
