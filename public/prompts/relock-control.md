Install and wire Relock control (RelockControl) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/relock-control`, or from https://knock.codes/r/relock-control.json. Read https://knock.codes/docs/relock-control.md before editing.

Lets the consumer hide a preview on a shared screen. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: onRelock: () => void.
Optional props and defaults:
- disabled: boolean; default false
- labels: { action?: string; description?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: One deliberate way to put the preview away on a shared screen, inside chrome you have already built.
Do not use it for: Previews that already use Preview bar or Preview chrome. Both include this control, and two relock buttons is the usual duplication.
Common mistakes:
- Activating calls `onRelock` and does nothing else. Hiding the content, and returning focus to the gate, remain yours.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { RelockControl } from '@/components/knock/relock-control';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Relock control example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RelockControl onRelock={() => setUnlocked(false)} />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { RelockControl } from '@/components/knock/relock-control';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Relock control example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RelockControl onRelock={() => setUnlocked(false)} disabled={false} theme="light" labels={{ action: "Relock", description: "Hide this preview before stepping away." }} />
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
```
