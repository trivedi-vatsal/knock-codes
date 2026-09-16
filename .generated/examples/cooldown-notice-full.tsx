'use client';
import { useState } from 'react';
import { CooldownNotice } from '../../registry/components/cooldown-notice';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Cooldown notice example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <CooldownNotice cooldownUntil="2030-01-01T12:00:00Z" theme="light" labels={{ heading: "Take a moment.", description: "Your preview will be here.", waiting: "Please wait a little.", ready: "You can try again.", unavailable: "Ask the preview owner.", countdown: seconds => `${seconds}s` }} />
    <p role="status">{message}</p>
  </section>;
}
