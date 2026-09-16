'use client';
import { useState } from 'react';
import { CodeField } from '../../registry/components/code-field';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Code field example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CodeField value={value} onChange={setValue} />
    <p role="status">{message}</p>
  </section>;
}
