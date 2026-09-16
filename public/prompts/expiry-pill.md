Install and wire Expiry pill (ExpiryPill) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/expiry-pill`, or from https://knock.codes/r/expiry-pill.json. Read https://knock.codes/docs/expiry-pill.md before editing.

Shows a preview lifetime as fine, expiring soon, or expired. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: expiresAt: string.
Optional props and defaults:
- soonThreshold: number; default 86400
- labels: { pending?: string; fine?: string; soon?: string; expired?: string; unavailable?: string; remaining?: (seconds: number) => string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: A preview's remaining lifetime belongs next to the gate, or inside the bar that stays after unlock.
Do not use it for: Enforcing the deadline. The pill reaches its expired state and changes nothing about what your application serves.
Common mistakes:
- Rendering the expired state hides nothing. Your own check decides whether the preview is still available.
- `soonThreshold` is in seconds, not milliseconds. The default window is one hour.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { ExpiryPill } from '@/components/knock/expiry-pill';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Expiry pill example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <ExpiryPill expiresAt="2030-01-01T12:00:00Z" />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { ExpiryPill } from '@/components/knock/expiry-pill';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Expiry pill example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <ExpiryPill expiresAt="2030-01-01T12:00:00Z" soonThreshold={3600} theme="light" labels={{ fine: "Available", soon: "Ending soon", expired: "Expired", pending: "Expiry", unavailable: "Ask the owner", remaining: seconds => `${seconds}s` }} />
    <p role="status">{message}</p>
  </section>;
}
```
