'use client';
import { useState } from 'react';
import { PreviewRibbon } from '../../registry/components/preview-ribbon';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview ribbon example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewRibbon theme="light" labels={{ draft: "Draft preview", description: "For review only." }} className="sticky top-0" />
    <p role="status">{message}</p>
  </section>;
}
