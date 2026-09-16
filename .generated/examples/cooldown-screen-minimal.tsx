'use client';
import { useState } from 'react';
import { CooldownScreen } from '../../registry/blocks/cooldown-screen';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Cooldown screen example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CooldownScreen value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></CooldownScreen>
    <p role="status">{message}</p>
  </section>;
}
