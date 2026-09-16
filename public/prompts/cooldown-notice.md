Install and wire Cooldown notice (CooldownNotice) from https://knock.codes/r/cooldown-notice.json in a React + Tailwind project. Read https://knock.codes/docs/cooldown-notice.md before editing.

Displays a calm countdown without enforcing a retry policy. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: cooldownUntil: string.
Optional props and defaults:
- labels: { heading?: string; description?: string; ready?: string; waiting?: string; unavailable?: string; countdown?: (seconds: number) => string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: A retry window is running and the gate should stay on screen, with the wait stated calmly beside the code field.
Do not use it for: A full screen that replaces the gate during the pause. Use the Cooldown screen block.
Common mistakes:
- Reaching zero announces readiness and nothing else. It never submits, never re-enables your submit button and never clears the cooldown.
- `cooldownUntil` is a timestamp you own. A value already in the past renders the ready state immediately; the component counts no attempts.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { CooldownNotice } from '@/components/knock/cooldown-notice';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Cooldown notice example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CooldownNotice cooldownUntil="2030-01-01T12:00:00Z" />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { CooldownNotice } from '@/components/knock/cooldown-notice';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Cooldown notice example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CooldownNotice cooldownUntil="2030-01-01T12:00:00Z" theme="light" labels={{ heading: "Take a moment.", description: "Your preview will be here.", waiting: "Please wait a little.", ready: "You can try again.", unavailable: "Ask the preview owner.", countdown: seconds => `${seconds}s` }} />
    <p role="status">{message}</p>
  </section>;
}
```
