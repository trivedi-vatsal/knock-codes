Install and wire Code field (CodeField) from https://knock.codes/r/code-field.json in a React + Tailwind project. Read https://knock.codes/docs/code-field.md before editing.

Displays controlled demo-code entry, normalizing pasted message artifacts. Does not verify codes, unlock content, store values, or make network requests. Contract: value and onChange are required; the consumer owns all state.

Required props: value: string; onChange: (value: string) => void.
Optional props and defaults:
- mode: 'digits' | 'passphrase'; default 'digits'
- length: number; default 8
- masked: boolean; default false
- status: 'idle' | 'pending' | 'error' | 'success'; default 'idle'
- error: ReactNode; default omitted
- label: string; default 'Access code'
- description: ReactNode; default omitted
- placeholder: string; default omitted
- autoFocus: boolean; default true
- name: string; default 'code'
- theme: 'light' | 'dark'; default omitted
- className: string; default ''

These are NOT props: onSuccess, password, correctCode, attempts, maxAttempts, onUnlock.
Never put credentials or correct codes into these components. Status success is visual; unlocked is consumer-owned. Timer completion does not grant access.

Use it when: You are building your own gate layout and need only the entry field, with codes pasted out of an email tidied on the way in.
Do not use it for: A complete gate screen. Use the Quick gate or Client preview gate block, which already compose this field with a heading, a submit action and lifecycle notices.
Common mistakes:
- `length` is a display and autofill hint, not validation. The field never rejects input and never reports whether a code is correct.
- `status="success"` only styles the field. Revealing content is your own `unlocked` state, decided after your own server check.
- `autoFocus` moves focus on mount. Leave it off when the field sits below other content or inside a long page.

Accessibility: Native controls, visible focus, localized labels; lifecycle messages use polite announcements. No modal dialog is created.

Minimal example:
```tsx
'use client';
import { useState } from 'react';
import { CodeField } from '@/components/knock/code-field';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Code field example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CodeField value={value} onChange={setValue} />
    <p role="status">{message}</p>
  </section>;
}
```

Fully wired example:
```tsx
'use client';
import { useState } from 'react';
import { CodeField } from '@/components/knock/code-field';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Code field example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CodeField value={value} onChange={setValue} mode="digits" length={8} masked status="error" error="Check your invitation code." label="Your code" description="Paste from your invitation." autoFocus name="preview-code" theme="light" className="max-w-sm" />
    <p role="status">{message}</p>
  </section>;
}
```
