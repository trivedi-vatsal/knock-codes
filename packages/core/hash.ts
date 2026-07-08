/**
 * Canonical hashing contract.
 *
 * Input is hashed exactly as given: UTF-8 encoded, no trimming, no
 * case-folding, no Unicode normalization. Output is lowercase hex SHA-256.
 * The hash generator, install docs, and any server template's comparison
 * logic must all produce the same hash for the same code string — that only
 * holds if every implementation follows this exact procedure.
 *
 * Uses Web Crypto (`crypto.subtle`), available unmodified in both browsers
 * and Node (>=19) — no import, no dependency.
 */
export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
