'use client';
import { useState } from 'react';
import { PreviewBar } from '../../registry/components/preview-bar';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview bar example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewBar buildLabel="acme-v1" expiresAt="2030-01-01T12:00:00Z" onRelock={() => setUnlocked(false)} onFeedback={() => setMessage("Feedback selected")} theme="light" labels={{ navigation: "Preview controls", preview: "Draft", expires: "Expires", invalidExpiry: "Ask the owner", feedback: "Feedback", relock: "Relock" }} />
    <button type="button" onClick={() => setUnlocked(current => !current)}>Toggle demo visibility</button>
    <p role="status">{message}</p>
  </section>;
}
