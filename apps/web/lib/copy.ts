/** Shared verbatim copy so the homepage and template pages don't drift into two different wordings. */
export const VELVET_ROPE_LINE = "A velvet rope, with an optional real lock.";

export const THREAT_MODEL_COPY =
  "Knock Codes stops casual visitors, search engines, and forwarded links. Local mode does not stop " +
  "anyone who opens DevTools — the hash ships in your client bundle by design. Server mode (swap one " +
  "prop) hides the hash from the client; children you already bundled are still in the JavaScript, and a " +
  `forged session works unless you wire validateSession. ${VELVET_ROPE_LINE} Never marketed as more than that.`;
