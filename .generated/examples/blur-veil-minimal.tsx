'use client';
import { useState } from 'react';
import { BlurVeil } from '../../registry/components/blur-veil';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Blur veil example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <BlurVeil unlocked={unlocked} prompt={<button onClick={() => setUnlocked(true)}>Reveal demo</button>}><p>Demo content</p></BlurVeil>
    <p role="status">{message}</p>
  </section>;
}
