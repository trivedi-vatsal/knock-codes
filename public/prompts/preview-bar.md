Install and wire Preview bar (PreviewBar) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/preview-bar`, or from https://knock.codes/r/preview-bar.json. Read https://knock.codes/docs/preview-bar.md before editing.

Keeps build identity, expiry, feedback and relocking available after unlock. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: buildLabel: string; onRelock: () => void.
Optional props and defaults:
- expiresAt: string; default omitted
- feedbackHref: string; default omitted
- onFeedback: () => void; default omitted
- labels: { navigation?: string; preview?: string; expires?: string; invalidExpiry?: string; feedback?: string; relock?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: After unlock, build identity, remaining lifetime, feedback and relock should stay reachable without covering the work.
Do not use it for: The locked state. Use a gate block for that; this is post-unlock chrome. For relock alone inside chrome you already have, use the Relock control.
Common mistakes:
- `onRelock` only calls back. The bar hides nothing: set your own `unlocked` to false and move focus yourself.
- Omitting `onRelock` omits the relock control rather than rendering an action that does nothing.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewBar } from '@/components/knock/preview-bar';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview bar example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewBar buildLabel="v1" onRelock={() => setUnlocked(false)} />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewBar } from '@/components/knock/preview-bar';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview bar example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewBar buildLabel="acme-v1" expiresAt="2030-01-01T12:00:00Z" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ navigation: "Preview controls", preview: "Draft", expires: "Expires", invalidExpiry: "Ask the owner", feedback: "Feedback", relock: "Relock" }} />
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
```
