'use client';
import { useState } from 'react';
import { ClientPreviewGate } from '../../registry/blocks/client-preview-gate';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Client preview gate example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <ClientPreviewGate value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></ClientPreviewGate>
    <p role="status">{message}</p>
  </section>;
}
