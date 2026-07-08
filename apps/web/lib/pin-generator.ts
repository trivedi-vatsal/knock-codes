/**
 * PIN generation and snippet formatting for the site's own hash-generator
 * widget. Nothing here makes a network request — generation and snippet
 * formatting happen entirely in the browser, same guarantee as hashing
 * itself (`sha256Hex` from `@access-gate/core`).
 */

const AMBIGUOUS_CHARS = new Set(["0", "O", "1", "l", "I"]);

const DEFAULT_ALPHABET = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")
  .filter((ch) => !AMBIGUOUS_CHARS.has(ch))
  .join("");

export const DEFAULT_LENGTH = 20;
export const MIN_RECOMMENDED_LENGTH = 8;

/**
 * CSPRNG-backed passphrase generation (`crypto.getRandomValues`, never
 * `Math.random()`). Excludes visually-ambiguous characters (0/O, 1/l/I)
 * since a human may need to retype this from memory or a screenshot.
 */
export function generatePin(length: number = DEFAULT_LENGTH, alphabet: string = DEFAULT_ALPHABET): string {
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join("");
}

/** Non-blocking guidance only — flags the short, all-numeric anti-pattern, nothing broader. */
export function weaknessWarning(pin: string): string | null {
  if (pin.length === 0) return null;
  const isAllDigits = /^[0-9]+$/.test(pin);
  if (isAllDigits && pin.length < MIN_RECOMMENDED_LENGTH) {
    return `A ${pin.length}-digit numeric PIN's hash still ships in your client bundle — it can be brute-forced offline even though the comparison itself happens in the browser. Consider a longer passphrase instead.`;
  }
  return null;
}

export interface EnvSnippets {
  generic: string;
  vite: string;
  nextjs: string;
}

export function buildSnippets(hash: string): EnvSnippets {
  return {
    generic: `ACCESS_GATE_HASH=${hash}`,
    vite: `VITE_ACCESS_GATE_HASH=${hash}`,
    nextjs: `NEXT_PUBLIC_ACCESS_GATE_HASH=${hash}`,
  };
}
