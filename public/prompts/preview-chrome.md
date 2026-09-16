Install and wire Preview chrome (PreviewChrome) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/preview-chrome`, or from https://knock.codes/r/preview-chrome.json. Read https://knock.codes/docs/preview-chrome.md before editing.

Enter your invitation code to see the draft. Does not verify codes, persist state, or grant or revoke access. Contract: all blocks share controlled input and visibility props. The consumer owns unlocked.

Required props: value: string; onChange: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; status: 'idle' | 'pending' | 'error' | 'success'; unlocked: boolean.
Optional props and defaults:
- children: ReactNode; default omitted
- error: ReactNode; default labels?.fallbackError
- recipient: ReactNode; default omitted
- expiresAt: string; default omitted
- cooldownUntil: string; default omitted
- onRequestAccess: () => void; default omitted
- requestAccessHref: string; default omitted
- logo: ReactNode; default omitted
- heading: ReactNode; default 'Your private preview.'
- description: ReactNode; default 'Enter your invitation code to see the draft.'
- labels: { submit?: string; pending?: string; success?: string; code?: string; hint?: string; recipient?: string; requestDescription?: string; requestAction?: string; requestUnavailable?: string; draft?: string; draftDescription?: string; build?: string; relock?: string; feedback?: string; navigation?: string; expires?: string; expiryPending?: string; expiryFine?: string; expirySoon?: string; expired?: string; expiryUnavailable?: string; expiryRemaining?: (seconds: number) => string; cooldownHeading?: string; cooldownDescription?: string; cooldownReady?: string; cooldownWaiting?: string; cooldownUnavailable?: string; countdown?: (seconds: number) => string; previewAccess?: string; fallbackError?: string; footer?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''
- mode: 'digits' | 'passphrase'; default 'digits'
- length: number; default 8
- masked: boolean; default false
- buildLabel: string; default labels?.build
- onRelock: () => void; default omitted
- onFeedback: () => void; default omitted
- feedbackHref: string; default omitted

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: Content is already unlocked and needs its context kept with it: a draft ribbon above, and build identity, feedback and relock below.
Do not use it for: The gate itself. This block never asks for a code.
Common mistakes:
- Without `onRelock`, the interactive bar is omitted rather than shown with an action that does nothing.
- Relock calls back only. Setting `unlocked` to false stays with the consumer.

Accessibility: Native forms and controls, polite error and cooldown announcements, visible focus, focus transfer after unlock. This block is a region, not a modal. Locked children are not rendered.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewChrome } from '@/components/knock/preview-chrome';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview chrome example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewChrome value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></PreviewChrome>
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { PreviewChrome } from '@/components/knock/preview-chrome';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview chrome example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewChrome value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted; your authorization belongs outside this UI."); }} status="idle" unlocked={unlocked} recipient="Acme Co." expiresAt="2030-01-01T12:00:00Z" logo={<strong>Atelier</strong>} heading="Your private preview" description="A first look at the work." onRequestAccess={() => setMessage("Request access selected")} buildLabel="acme-v1" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ submit: "Open preview", code: "Access code", footer: "A draft, prepared for you." }}><p>Preview content</p></PreviewChrome>
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
```
