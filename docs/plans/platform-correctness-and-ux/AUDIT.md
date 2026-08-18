# platform-correctness-and-ux — Audit trail

Written before PLAN.md. Grounded in files read in-session (2026-08-18), not in a live browser pass. No Playwright; site behavior inferred from source.

## Confirmed working

| Thing | Check | Result |
|---|---|---|
| Copy-owned core contract | `docs/adr/0001-current-knock-codes-architecture.md`, `packages/core/{hash,verify,session,storage}.ts` | Hash / verify-xor / session-without-code / three storage backends all exist and match the ADR. |
| Headless hook | `packages/react/useKnockCodes.ts` | Resolves verify once, reads storage in an effect, polls expiry, throttles activity, guards `submit` with a ref. |
| Hook tests | `packages/react/test/useKnockCodes.test.tsx` | Covers unlock, invalid, empty submit, network, token storage, logout, re-entrancy, activity throttle, expiry, cross-tab `storage` event. |
| Provider + consumers | `KnockCodesProvider.tsx`, `LogoutButton.tsx`, `SessionTimeoutBanner.tsx`, `AccessReceipt.tsx` | Provider wraps one hook instance. Logout / banner / receipt call `useKnockCodesContext()` (throws outside provider). |
| Registry pipeline | `scripts/build-registry.mjs`, `scripts/check-registry.mjs`, `.github/workflows/ci.yml` | CI runs typecheck, test, lint, `registry:check`. Deploy workflow builds the web app separately. |
| Site visual system | `apps/web/app/layout.tsx`, `apps/web/app/globals.css` | Always-dark (`html.dark`), amber primary, Geist + Geist Mono. No light-mode toggle for the marketing chrome. |
| Live template previews | `apps/web/components/template-preview.tsx` | Passes `theme={dark ? "dark" : "light"}` from `usePreviewDark()`, isolating templates from `html.dark`. Demo code is `demo1234`. |
| Hash generator | `apps/web/components/hash-generator.tsx`, `apps/web/lib/pin-generator.ts` | Uses `@knock-codes/core` `sha256Hex`. Embedded on `/getting-started` and template security sections. |
| Unused live-demo components | grep `FeatureGrid` / `LiveGate` / `WorkspaceSimulator` under `apps/web` | `LiveGate` (`apps/web/components/live-gate.tsx`) and `FeatureGrid` exist and are **not imported**. Homepage hero uses `WorkspaceSimulator` only. `LiveGate` uses `DEMO_CODE` `"4242"` from `apps/web/lib/demo-hash.ts`. |

## Confirmed broken / blocked

| Thing | Check | Result |
|---|---|---|
| Gates ignore the provider | grep `useKnockCodes(` in `packages/react` | `<KnockCodes>`, `<ProtectedCard>`, `<ProtectedModal>`, templates, and `ProtectedRoute`'s `FallbackGate` each call `useKnockCodes(config)` themselves. Same-tab logout from `<LogoutButton>` cannot flip those gates: `storage` events do not fire in the originating tab. |
| Server token is write-only | grep `token` in `packages/` | Token is stored on success (`createSession`) and never read on restore. `useKnockCodes` restore path is `store.get()` + `isExpired` only. No `validateSession`. |
| README oversells server mode | `README.md` local-vs-server table | Row "Bypassable via DevTools" is **Yes** / **No**. Server mode still leaves content in the client bundle and a forgeable `{unlockedAt,expiresAt}` session. Package READMEs correctly say packages are not on npm; root README still frames `@knock-codes/core` / `@knock-codes/react` as the distribution. |
| First paint is always locked | `useKnockCodes.ts` lines 40–50 | `session` starts `null`; storage is read in an effect. Returning visitors flash the PIN UI. |
| Homepage says "under 100 lines" | `apps/web/app/page.tsx` hero checkmarks | `packages/react/KnockCodesTemplate.tsx` is ~300 lines. Install panel lists a dependency chain (hook, types, core). |
| Homepage density | `apps/web/app/page.tsx` | Hero: badge + 96px title + subtitle + audience + 2 CTAs + security link + snippet + `WorkspaceSimulator` + 4 checkmarks. Then proof ticker, 01 how-it-works (3 steps), 02 problem, 03 bento (static fake PIN, not live) + comparison, 04 templates, 05 stats (repeats 1 file / 0 deps), 06 FAQ, 07 CTA. Seven sections at `py-[120px]`. |
| Getting-started duplicates homepage | `apps/web/app/getting-started/page.tsx` vs `how-it-works-section.tsx` | Homepage: 3 steps, hash generator is a link to `/getting-started#generator`. Getting started: 5 BlueprintFrame steps, then the generator, then framework tabs. |
| Dual demo codes | `apps/web/lib/demo-hash.ts` vs `template-preview.tsx` | Hero/LiveGate: `4242`. Template detail previews: `demo1234`. |
| Preview canvas | `apps/web/components/preview-panel.tsx` | `min-h-[44rem]` / `h-[44rem]`. Dark toggle `useState(false)` so first paint is light while the site is always dark. |
| FAQ affordance | `apps/web/components/faq-section.tsx` | `<summary className="list-none … marker:content-none">` — no chevron, does not look expandable. |
| Mobile nav | `apps/web/components/mobile-nav.tsx` | No focus trap, no scroll lock, no Changelog link. Proof ticker marks the whole marquee `aria-hidden` including the `/llms.txt` link. |
| Nav current state | `apps/web/components/site-header.tsx` | No `aria-current`. Blocks is a peer of Templates. |
| Thin block wrappers | `StandaloneGate.tsx`, `EmbeddedGate.tsx`, `ProtectedLayout.tsx`, `ProtectedRoute.tsx` | Wrappers around `<KnockCodes>` (`variant="inline"`, `header`/`footer`, `unauthorizedFallback`). Catalog noise, but already shipped via registry — removing them is a copy-owned breaking change. |
| CI does not build the site | `.github/workflows/ci.yml` vs `deploy.yml` | CI: typecheck / test / lint / `registry:check`. `pnpm --filter web build` only on deploy. |
| Dirty working tree | git status at conversation start | Many already-modified files (`apps/web` components, registry JSON, `AGENTS.md` / `CLAUDE.md` / `README.md`). This plan must not be mixed into that uncommitted work until it is committed or discarded. |

## Open questions

1. **PR shape** — skill default is one branch / one PR. Library correctness and site UX are independently shippable. Confirm whether to keep them on one branch or split after the library slice.
2. **`validateSession` vs docs-only** — an optional restore callback is additive and honest; it still does not hide client-rendered children. Confirm we ship the callback in this pass (recommended) rather than docs-only.
3. **Existing dirty tree** — who owns the in-progress registry / `adapt-prompt` / `live-gate` / `workspace-simulator` edits? Branch for this plan should start from a clean `main` (or that work, if it lands first).
4. **Hero replacement** — `LiveGate` is already a real `useKnockCodes` 4-box demo on `4242`. Confirm we promote it and delete or demote `WorkspaceSimulator`, rather than restyling the simulator.

## Assumptions still unverified

- Visual identity (always-dark marketing chrome, amber, mono labels) stays; this pass does not add a site-wide light theme.
- No Playwright / no new runtime deps in `packages/*`. Site may reuse existing components (`LiveGate`, `HashGenerator`, `FeatureGrid`).
- Public hook state machine stays `"idle" \| "submitting" \| "unlocked"`. Hydration flash is fixed with an additive `ready: boolean`, not a new `KnockCodesState`.
- Default `storage: "localStorage"` and React `^19` peer are **not** changed (breaking for copy-paste consumers).
- Thin registry aliases (`StandaloneGate`, `EmbeddedGate`, …) stay; we do not delete shipped items.
- `AGENTS.md` / `CLAUDE.md` duplication is in-scope only as a one-line sync if we touch docs; not a docs rewrite.
