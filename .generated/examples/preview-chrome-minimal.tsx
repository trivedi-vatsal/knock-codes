'use client';
import { useState } from 'react';
import { PreviewChrome } from '../../registry/blocks/preview-chrome';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview chrome example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewChrome value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></PreviewChrome>
    <p role="status">{message}</p>
  </section>;
}
