'use client';
import { useState } from 'react';
import { QuickGate } from '../../registry/blocks/quick-gate';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Quick gate example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <QuickGate value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></QuickGate>
    <p role="status">{message}</p>
  </section>;
}
