'use client';
import { useState } from 'react';
import { RelockControl } from '../../registry/components/relock-control';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Relock control example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RelockControl onRelock={() => setUnlocked(false)} disabled={false} theme="light" labels={{ action: "Relock", description: "Hide this preview before stepping away." }} />
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
