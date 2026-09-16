'use client';
import { useState } from 'react';
import { OpenInvitation } from '../../registry/blocks/open-invitation';

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
