/**
 * Canonical hashing contract — ADR-0009.
 *
 * Input is hashed exactly as given: UTF-8 encoded, no trimming, no
 * case-folding, no Unicode normalization. Output is lowercase hex SHA-256.
 * The generator, agent install specs, and any server template's comparison
 * logic must all produce the same hash for the same PIN string — that only
 * holds if every implementation follows this exact procedure.
 *
 * Uses Web Crypto (`crypto.subtle`), available unmodified in both browsers
 * and Node (>=19) — no import, no dependency, per the rationale in
 * docs/security/threat-model.md § Hash Generation.
 */
export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
