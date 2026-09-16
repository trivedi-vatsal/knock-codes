Install and wire Recipient line (RecipientLine) from https://knock.codes/r/recipient-line.json in a React + Tailwind project. Read https://knock.codes/docs/recipient-line.md before editing.

Addresses a private preview to its intended recipient. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: recipient: ReactNode.
Optional props and defaults:
- label: string; default 'Prepared for'
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: A preview was prepared for a named person or company and the screen should say so before any code is entered.
Do not use it for: Proof of identity. A recipient shown here is presentation, and it is visible to anyone holding the link.
Common mistakes:
- This text is readable before unlocking. Use a company or first name, never an email address or anything you would not put in the invitation itself.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { RecipientLine } from '@/components/knock/recipient-line';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Recipient line example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RecipientLine recipient="Acme Co." />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { RecipientLine } from '@/components/knock/recipient-line';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Recipient line example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RecipientLine recipient={<strong>Acme Co.</strong>} label="Prepared for" theme="light" className="mb-4" />
    <p role="status">{message}</p>
  </section>;
}
```
