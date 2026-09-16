'use client';
import { useState } from 'react';
import { BlurVeil } from '../../registry/components/blur-veil';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Blur veil example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <BlurVeil unlocked={unlocked} blur={8} label="Preview invitation" theme="light" prompt={<button onClick={() => setUnlocked(true)}>Reveal demo</button>}><button onClick={() => setMessage("Preview action")}>Explore preview</button></BlurVeil>
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
