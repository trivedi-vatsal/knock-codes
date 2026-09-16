Install and wire Preview watermark (PreviewWatermark) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/preview-watermark`, or from https://knock.codes/r/preview-watermark.json. Read https://knock.codes/docs/preview-watermark.md before editing.

Marks unlocked work with a light recipient or build overlay for screenshots. Does not verify codes, persist state, or grant or revoke access. Contract: the consumer owns lifecycle timestamps and action callbacks.

Required props: children: ReactNode.
Optional props and defaults:
- recipient: string; default omitted
- buildLabel: string; default omitted
- labels: { mark?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: Unlocked work should carry who it was prepared for, including into screenshots that leave the review.
Do not use it for: A draft status strip. Use Preview ribbon when the label should sit above the work rather than across it.
Common mistakes:
- The overlay is visual. It does not prevent copies, and it is not authorization.

Accessibility: Native controls, visible focus, localized labels; the repeating mark is decorative and hidden from assistive technology. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewWatermark } from '@/components/knock/preview-watermark';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview watermark example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewWatermark><p>Preview content</p></PreviewWatermark>
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewWatermark } from '@/components/knock/preview-watermark';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview watermark example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewWatermark recipient="Acme Co." buildLabel="acme-v1" theme="light" labels={{ mark: "Private preview" }}><p>Preview content</p></PreviewWatermark>
    <p role="status">{message}</p>
  </section>;
}
```
