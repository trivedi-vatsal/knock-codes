'use client';
import { useState } from 'react';
import { ExpiredNotice } from '../../registry/blocks/expired-notice';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Expired notice example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <ExpiredNotice value={value} onChange={setValue} onSubmit={event => { event.preventDefault(); setMessage("Demo submitted"); }} status="idle" unlocked={unlocked}><p>Preview content</p></ExpiredNotice>
    <p role="status">{message}</p>
  </section>;
}
