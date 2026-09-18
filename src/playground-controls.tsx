/** MIT License — Copyright (c) 2026 Knock contributors. Playground chrome only. */
import { useEffect, useId, useRef } from 'react';

export const statusOptions = [
  { value: 'idle', label: 'Idle / ready' },
  { value: 'pending', label: 'Pending' },
  { value: 'error', label: 'Error' },
  { value: 'success', label: 'Success' },
] as const;

export type DigitPreset = '4' | '6' | '8' | 'custom';

export function lengthFrom(preset: DigitPreset, custom: string) {
  if (preset !== 'custom') return Number(preset);
  const n = Number.parseInt(custom, 10);
  return n >= 1 && n <= 16 ? n : 8;
}

export function Select({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  const root = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) root.current.open = false;
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <details
      ref={root}
      className="menu"
      name="playground-menu"
      onKeyDown={(event) => {
        if (event.key === 'Escape') root.current?.removeAttribute('open');
      }}
    >
      <summary id={id}>{options.find((option) => option.value === value)?.label ?? value}</summary>
      <div>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => {
              onChange(option.value);
              if (root.current) root.current.open = false;
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </details>
  );
}

export function DigitLength({
  preset,
  custom,
  onPreset,
  onCustom,
}: {
  preset: DigitPreset;
  custom: string;
  onPreset: (preset: DigitPreset) => void;
  onCustom: (custom: string) => void;
}) {
  const id = useId();
  return (
    <>
      <div className="control-label">Digits</div>
      <div className="segmented">
        {(['4', '6', '8', 'custom'] as const).map((item) => (
          <button key={item} aria-pressed={preset === item} onClick={() => onPreset(item)}>
            {item === 'custom' ? 'Custom' : item}
          </button>
        ))}
      </div>
      {preset === 'custom' && (
        <>
          <label className="control-label" htmlFor={id}>
            Custom length
            <span>1–16</span>
          </label>
          <input
            id={id}
            inputMode="numeric"
            value={custom}
            onChange={(event) => {
              const raw = event.target.value.replace(/\D/g, '').slice(0, 2);
              const n = Number.parseInt(raw, 10);
              onCustom(n > 16 ? '16' : raw);
            }}
          />
        </>
      )}
    </>
  );
}
