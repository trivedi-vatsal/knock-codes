# Changelog

This project is distributed copy-paste (via the shadcn-compatible registry), not as a published npm
package — see [`CONTRIBUTING.md`](./CONTRIBUTING.md#versioning-registry-changes) for what "breaking" means
in that model. Dates are release dates of this repository, not npm publishes.

## 2026-07-08

### Added
- Homepage hero is now a live, working demo (`Try code 4242`) that renders on first paint with no loading
  state, plus a proof strip (file count, dependency count, license, file size) computed at build time.
- A client-side hash generator widget (code in, hash out, nothing leaves the browser), now embedded on the
  homepage and `/getting-started` in addition to template detail pages.
- Express and Hono reference server-verification templates, alongside the existing Next.js/Cloudflare/
  Azure ones — same request/response contract across all five. `/getting-started` now has a tabbed
  reference-implementations section.
- Segmented code entry (`KnockCodesTemplate`) gets `autoComplete="one-time-code"` and `inputMode="text"`.
- All four full-page templates: a shake on a failed attempt, a brief "Access granted" transition on
  success instead of an instant swap, and an optional `remember="session"` prop (sessionStorage-backed,
  off by default, documented as client-side-only on `/security`).
- **Plain HTML Gate** — a new template: one static `.html` file with an inline `<script>`, no React, no
  build step, no npm install. Same canonical hashing contract as every other template.
- `/changelog` (this page) and a footer linking to it, the GitHub repo, the MIT license, and the author.
- FAQ section on the homepage, with `FAQPage` JSON-LD.
- An OG image and refreshed page metadata (title, description, `summary_large_image` Twitter card).

### Changed
- Landing page section order: Hero → Templates → How it works → Local vs. server mode → Use cases →
  Threat model → final CTA. Tightened hero copy and deduplicated repeated phrasing across the page.
- Template descriptions now lead with their differentiator (split-screen brand panel, segmented dark
  card, single masked field, blur-overlay dialog) instead of all opening the same way.

### Template versions
| Template | Version |
| --- | --- |
| `knock-codes-template` | 1.0.0 |
| `branded-access-template` | 1.0.0 |
| `minimal-access-template` | 1.0.0 |
| `modal-access-template` | 1.0.0 |
| `plain-html-gate` | 1.0.0 |

## Unreleased

### Changed
- Rebranded the public site and docs to **Knock Codes** at `https://knock.codes`. Internal package names
  (`@knock-codes/core`, `@knock-codes/react`), component APIs (`<KnockCodes>`, `useKnockCodes`, etc.),
  registry item names, and storage keys are unchanged.

### Added
- `/security` — a dedicated security/threat-model page: local-mode vs. server-mode comparison, appropriate
  vs. inappropriate use cases, the reference server-verification templates, and rate-limiting/logging
  guidance.
- Homepage: three use-case panels (client preview, staging app, internal dashboard) and a compact local-vs-
  server comparison table, linking through to `/security`.
- `/getting-started`: a fifth step covering the upgrade to server verification, Next.js/Vite/plain-React
  usage tabs, and an explicit warning against shipping a plaintext code.
- `bestUsedFor` frontmatter field on every block and template, shown on its detail page.
- `useCase`, `complexity`, and `mode` frontmatter fields on templates, shown as badges on template cards
  and detail pages.
- "Compose with" framing (previously "Related blocks") on block/template detail pages.
- `scripts/check-registry.mjs` (`pnpm registry:check`) — verifies `apps/web/public/r/react` is byte-for-
  byte what `registry/react/registry.json` would currently build, run in CI.
- `InstallationPanel` now supports a deployed registry URL via `NEXT_PUBLIC_SITE_URL`, alongside the local
  dev command, plus a clearer manual-copy fallback.
- CI workflow (typecheck, test, lint, registry integrity check).
- `CONTRIBUTING.md` (adding a block/template, versioning guidance, accessibility checklist, release
  checklist) and package-level READMEs for `packages/core` and `packages/react`.
- Tests: `useKnockCodes` re-entrant `submit()` calls, `KnockCodes` clearing its field after a failed
  attempt, `UnlockDialog` dialog semantics and initial focus.

### Fixed
- `useKnockCodes`'s `submit()` now guards against re-entrant calls (via a ref, not state, to avoid a stale-
  closure race) instead of allowing two concurrent verifications if called twice in the same tick.
- `UnlockDialog` no longer moves focus to the dialog panel `div` after the code input's own `autoFocus` has
  already placed focus there — previously the panel-focus effect ran second and silently stole focus back
  to a non-interactive container.

### Changed
- Standardized terminology: the visitor-facing secret is consistently called an "access code" (or "code")
  in prose and UI copy; "PIN" is now reserved for the `PinInput`/"PIN Input" component name itself, and
  "passphrase" is used only when explicitly contrasting numeric vs. non-numeric input.
- Rewrote `README.md`: a 30-second pitch, explicit "When to use this" / "When not to use this" sections,
  and registry publishing docs.
