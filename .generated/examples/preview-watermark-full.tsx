'use client';
import { useState } from 'react';
import { PreviewWatermark } from '../../registry/components/preview-watermark';

export default function Example() {
  const [value, setValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  return <section aria-label="Preview watermark example">
    {/* Demo consumer state only. Integrate your authorization outside this UI. */}
    <PreviewWatermark recipient="Acme Co." buildLabel="acme-v1" theme="light" labels={{ mark: "Private preview" }}><p>Preview content</p></PreviewWatermark>
    <p role="status">{message}</p>
  </section>;
}
