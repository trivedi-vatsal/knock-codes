Install and wire Preview ribbon (PreviewRibbon) from https://knock.codes/r/preview-ribbon.json in a React + Tailwind project. Read https://knock.codes/docs/preview-ribbon.md before editing.

Keeps a draft label visible within preview screenshots. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: none.
Optional props and defaults:
- labels: { draft?: string; description?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: Draft status should travel with the work, including into the screenshots that leave the review.
Do not use it for: A dismissible banner. There is no dismiss action by design: a ribbon that can be closed is absent from the screenshot that needed it.
Common mistakes:
- Position belongs to you. Without sticky or fixed positioning from your own className, the ribbon scrolls away with the page.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewRibbon } from '@/components/knock/preview-ribbon';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview ribbon example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewRibbon />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewRibbon } from '@/components/knock/preview-ribbon';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview ribbon example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewRibbon theme="light" labels={{ draft: "Draft preview", description: "For review only." }} className="sticky top-0" />
    <p role="status">{message}</p>
  </section>;
}
```
