# Knock

Copy-paste demo-gate UI for React 18/19 + Tailwind CSS 4. No authentication, verification, storage, fetch, or sessions.

Read https://knock.codes/llms-full.txt for the whole library in one fetch (contracts, examples and source).
Required values and callbacks are documented per item. Status success does not unlock: consumers own unlocked. Never invent onSuccess/password/correctCode/attempts/maxAttempts/onUnlock.

## Items

- [Blur veil](https://knock.codes/docs/blur-veil.md): components, gate; A glimpse of the work should sit behind the invitation, so entering a code feels worth the effort. Install https://knock.codes/r/blur-veil.json
- [Code field](https://knock.codes/docs/code-field.md): components, gate; You are building your own gate layout and need only the entry field, with codes pasted out of an email tidied on the way in. Install https://knock.codes/r/code-field.json
- [Cooldown notice](https://knock.codes/docs/cooldown-notice.md): components, gate; A retry window is running and the gate should stay on screen, with the wait stated calmly beside the code field. Install https://knock.codes/r/cooldown-notice.json
- [Expiry pill](https://knock.codes/docs/expiry-pill.md): components, gate; A preview's remaining lifetime belongs next to the gate, or inside the bar that stays after unlock. Install https://knock.codes/r/expiry-pill.json
- [Preview bar](https://knock.codes/docs/preview-bar.md): components, unlocked; After unlock, build identity, remaining lifetime, feedback and relock should stay reachable without covering the work. Install https://knock.codes/r/preview-bar.json
- [Preview ribbon](https://knock.codes/docs/preview-ribbon.md): components, unlocked; Draft status should travel with the work, including into the screenshots that leave the review. Install https://knock.codes/r/preview-ribbon.json
- [Recipient line](https://knock.codes/docs/recipient-line.md): components, gate; A preview was prepared for a named person or company and the screen should say so before any code is entered. Install https://knock.codes/r/recipient-line.json
- [Relock control](https://knock.codes/docs/relock-control.md): components, unlocked; One deliberate way to put the preview away on a shared screen, inside chrome you have already built. Install https://knock.codes/r/relock-control.json
- [Request access](https://knock.codes/docs/request-access.md): components, gate; Recipients arrive without a working code — a forwarded invitation, a link that sat too long — and need a route back to the owner. Install https://knock.codes/r/request-access.json
- [Client preview gate](https://knock.codes/docs/client-preview-gate.md): blocks, gate; The full client-facing ceremony: your logo, the recipient's name, remaining lifetime, code entry, a route back to you, and chrome around the work after unlock. Install https://knock.codes/r/client-preview-gate.json
- [Cooldown screen](https://knock.codes/docs/cooldown-screen.md): blocks, gate; Attempts have run out and the whole screen should become the pause, rather than a line of text under the field. Install https://knock.codes/r/cooldown-screen.json
- [Expired notice](https://knock.codes/docs/expired-notice.md): blocks, ended; The invitation window has passed, and the recipient deserves a clear ending plus a way to ask for a fresh link. Install https://knock.codes/r/expired-notice.json
- [Gated section](https://knock.codes/docs/gated-section.md): blocks, gate; One region of an otherwise open page is reserved — pricing, a case study, the next chapter — while everything around it stays readable. Install https://knock.codes/r/gated-section.json
- [Preview chrome](https://knock.codes/docs/preview-chrome.md): blocks, unlocked; Content is already unlocked and needs its context kept with it: a draft ribbon above, and build identity, feedback and relock below. Install https://knock.codes/r/preview-chrome.json
- [Quick gate](https://knock.codes/docs/quick-gate.md): blocks, gate; Internal, staging or short-lived previews: one field, one action, no ceremony. Install https://knock.codes/r/quick-gate.json
- [Revoked notice](https://knock.codes/docs/revoked-notice.md): blocks, ended; Sharing has been withdrawn, and the message should say that plainly rather than suggest that waiting will help. Install https://knock.codes/r/revoked-notice.json
- [Teaser gate](https://knock.codes/docs/teaser-gate.md): blocks, gate; The work itself should do the persuading, with a blurred, inert sample behind the invitation. Install https://knock.codes/r/teaser-gate.json

## Theme

Set theme to light/dark or omit for system preference. Override --knock-bg, --knock-ink, --knock-muted, --knock-accent, --knock-border, --knock-error on a parent. Check contrast after customizing.
