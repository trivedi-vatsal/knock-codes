'use client';
import { useState } from 'react';
import { CodeField } from '../../registry/components/code-field';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Code field example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CodeField value={value} onChange={setValue} mode="digits" length={8} masked status="error" error="Check your invitation code." label="Your code" description="Paste from your invitation." autoFocus name="preview-code" theme="light" className="max-w-sm" />
    <p role="status">{message}</p>
  </section>;
}
