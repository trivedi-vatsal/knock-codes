Install and wire Blur veil (BlurVeil) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/blur-veil`, or from https://knock.codes/r/blur-veil.json. Read https://knock.codes/docs/blur-veil.md before editing.

Shows an inert blurred teaser beneath a prompt; blur is presentation, not security. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: unlocked: boolean; children: ReactNode; prompt: ReactNode.
Optional props and defaults:
- blur: number; default 8
- label: string; default 'Preview access'
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: A glimpse of the work should sit behind the invitation, so entering a code feels worth the effort.
Do not use it for: Protecting anything. The children stay in the DOM and travel to the browser; blur is a visual effect, not a boundary.
Common mistakes:
- Never pass genuinely protected content as children while locked. Pass a representative sample, and render the real preview only once `unlocked` is true.
- Locked children are inert and skipped by the keyboard. That is presentation, not authorization.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { BlurVeil } from '@/components/knock/blur-veil';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Blur veil example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <BlurVeil unlocked={unlocked} prompt={<button onClick={() => setUnlocked(true)}>Reveal demo</button>}><p>Demo content</p></BlurVeil>
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { BlurVeil } from '@/components/knock/blur-veil';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Blur veil example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <BlurVeil unlocked={unlocked} blur={8} label="Preview invitation" theme="light" prompt={<button onClick={() => setUnlocked(true)}>Reveal demo</button>}><button onClick={() => setMessage("Preview action")}>Explore preview</button></BlurVeil>
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
```
