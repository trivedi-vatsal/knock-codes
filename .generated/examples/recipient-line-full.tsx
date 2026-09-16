'use client';
import { useState } from 'react';
import { RecipientLine } from '../../registry/components/recipient-line';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Recipient line example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RecipientLine recipient={<strong>Acme Co.</strong>} label="Prepared for" theme="light" className="mb-4" />
    <p role="status">{message}</p>
  </section>;
}
