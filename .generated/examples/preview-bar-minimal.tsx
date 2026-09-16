'use client';
import { useState } from 'react';
import { PreviewBar } from '../../registry/components/preview-bar';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview bar example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewBar buildLabel="v1" onRelock={() => setUnlocked(false)} />
    <p role="status">{message}</p>
  </section>;
}
