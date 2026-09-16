Install and wire Open invitation (OpenInvitation) with `npx shadcn@latest registry add @knock-codes` then `npx shadcn@latest add @knock-codes/open-invitation`, or from https://knock.codes/r/open-invitation.json. Read https://knock.codes/docs/open-invitation.md before editing.

This look is for you. Continue when you are ready. Does not verify codes, persist state, or grant or revoke access. Contract: all blocks share controlled input and visibility props. The consumer owns unlocked.

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
- heading: ReactNode; default 'This look is for you.'
- description: ReactNode; default 'Continue when you are ready. Your application decides what opens.'
- labels: { submit?: string; pending?: string; success?: string; code?: string; hint?: string; recipient?: string; requestDescription?: string; requestAction?: string; requestUnavailable?: string; draft?: string; draftDescription?: string; build?: string; relock?: string; feedback?: string; navigation?: string; expires?: string; expiryPending?: string; expiryFine?: string; expirySoon?: string; expired?: string; expiryUnavailable?: string; expiryRemaining?: (seconds: number) => string; cooldownHeading?: string; cooldownDescription?: string; cooldownReady?: string; cooldownWaiting?: string; cooldownUnavailable?: string; countdown?: (seconds: number) => string; previewAccess?: string; fallbackError?: string; footer?: string; }; default omitted
- theme: 'light' | 'dark'; default omitted
- className: string; default ''
- mode: 'digits' | 'passphrase'; default "digits"
- length: number; default 8
- masked: boolean; default false
- buildLabel: string; default omitted
- onRelock: () => void; default omitted
- onFeedback: () => void; default omitted
- feedbackHref: string; default omitted

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: The invitation is the access: a named recipient and a continue action, with no code to type.
Do not use it for: When a typed code is the proof. Use Client preview gate or Quick gate.
Common mistakes:
- Continue only reports `onSubmit`. Set `unlocked` from your server, never from the click alone.
- `value` and `onChange` stay on the shared block contract so this file installs like the others. They are unused because there is no field.

Accessibility: Native forms and controls, polite error and cooldown announcements, visible focus, focus transfer after unlock. This block is a region, not a modal. Locked children are not rendered.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { OpenInvitation } from '@/components/knock/open-invitation';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Open invitation example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <OpenInvitation value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></OpenInvitation>
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { OpenInvitation } from '@/components/knock/open-invitation';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Open invitation example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <OpenInvitation value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted; your authorization belongs outside this UI."); }} status="idle" unlocked={unlocked} recipient="Acme Co." expiresAt="2030-01-01T12:00:00Z" logo={<strong>Atelier</strong>} heading="This look is for you." description="Continue when you are ready." onRequestAccess={() => setMessage("Request access selected")} buildLabel="acme-v1" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ submit: "Open this invitation", footer: "A draft, prepared for you." }}><p>Preview content</p></OpenInvitation>
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
```
