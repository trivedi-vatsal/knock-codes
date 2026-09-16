'use client';
import { useState } from 'react';
import { TeaserGate } from '../../registry/blocks/teaser-gate';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Teaser gate example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <TeaserGate value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></TeaserGate>
    <p role="status">{message}</p>
  </section>;
}
