'use client';
import { useState } from 'react';
import { RelockControl } from '../../registry/components/relock-control';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Relock control example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RelockControl onRelock={() => setUnlocked(false)} />
    <p role="status">{message}</p>
  </section>;
}
