# Access Gate

Copy-owned access-control components for demos, previews, staging, and internal tools — inspired by Tremor Blocks and shadcn/ui.

You own every line. No runtime dependency, no vendor lock-in.

## Structure

- `apps/web` — the site (block gallery, live previews, copy-paste source)
- `packages/core` — framework-agnostic verification/session/storage logic
- `packages/react` — `<AccessGate>`, `useAccessGate`, PIN input
- `registry/react` — the shadcn-compatible block registry
- `content/blocks` — block metadata/docs that drive the gallery

## Develop

```
pnpm install
pnpm dev
```
