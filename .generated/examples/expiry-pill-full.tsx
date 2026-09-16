'use client';
import { useState } from 'react';
import { ExpiryPill } from '../../registry/components/expiry-pill';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Expiry pill example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <ExpiryPill expiresAt="2030-01-01T12:00:00Z" soonThreshold={3600} theme="light" labels={{ fine: "Available", soon: "Ending soon", expired: "Expired", pending: "Expiry", unavailable: "Ask the owner", remaining: seconds => `${seconds}s` }} />
    <p role="status">{message}</p>
  </section>;
}
