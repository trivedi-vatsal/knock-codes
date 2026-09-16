'use client';
import { useState } from 'react';
import { CooldownNotice } from '../../registry/components/cooldown-notice';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Cooldown notice example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CooldownNotice cooldownUntil="2030-01-01T12:00:00Z" />
    <p role="status">{message}</p>
  </section>;
}
