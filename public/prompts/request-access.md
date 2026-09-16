Install and wire Request access (RequestAccess) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/request-access`, or from https://knock.codes/r/request-access.json. Read https://knock.codes/docs/request-access.md before editing.

Routes a recipient without a code to the preview owner. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: none.
Optional props and defaults:
- requestAccessHref: string; default omitted
- onRequestAccess: () => void; default omitted
- labels: { description?: string; action?: string; unavailable?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: Recipients arrive without a working code — a forwarded invitation, a link that sat too long — and need a route back to the owner.
Do not use it for: Sending the request. Nothing leaves the browser: you supply a link or a callback and deliver the message yourself.
Common mistakes:
- With neither `requestAccessHref` nor `onRequestAccess` set, the component renders its unavailable label rather than a dead control. Supply one of them.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { RequestAccess } from '@/components/knock/request-access';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Request access example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RequestAccess onRequestAccess={() => setMessage("Request access selected")} />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { RequestAccess } from '@/components/knock/request-access';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Request access example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RequestAccess requestAccessHref="mailto:studio@example.com?subject=Preview%20access" theme="light" labels={{ description: "Missing your invitation?", action: "Ask the studio", unavailable: "Contact the owner." }} />
    <p role="status">{message}</p>
  </section>;
}
```
