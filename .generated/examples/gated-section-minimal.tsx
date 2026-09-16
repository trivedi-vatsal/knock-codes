'use client';
import { useState } from 'react';
import { GatedSection } from '../../registry/blocks/gated-section';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Gated section example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <GatedSection value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></GatedSection>
    <p role="status">{message}</p>
  </section>;
}
