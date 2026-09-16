'use client';
import { useState } from 'react';
import { RequestAccess } from '../../registry/components/request-access';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Request access example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <RequestAccess onRequestAccess={() => setMessage("Request access selected")} />
    <p role="status">{message}</p>
  </section>;
}
