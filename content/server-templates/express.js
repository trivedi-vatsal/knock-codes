// @ts-check
/**
 * Knock Codes — Express server verification template.
 * Mount at, e.g., app.post("/api/verify-access", verifyAccess) — requires
 * express.json() body-parsing middleware upstream so req.body is populated.
 *
 * Set two env vars: KNOCK_CODES_SERVER_HASH, KNOCK_CODES_TOKEN_SECRET.
 *
 * Wire contract identical across all server templates — see the
 * Cloudflare Worker template in this same folder for the full contract.
 */
import { createHash, createHmac } from "node:crypto";

const RATE_LIMIT_MAX_ATTEMPTS = 5; // adjust per deployment
const RATE_LIMIT_WINDOW_SECONDS = 60;
const TOKEN_TTL_MS = 5 * 60_000; // 5 minutes

// In-memory counter — acceptable ONLY for a single-instance/dev deployment.
// Most production hosts run multiple instances, so this counter would not
// be shared across them; swap in Redis or the equivalent (same key scheme
// below) before deploying for real.
/** @type {Map<string, number>} */
const attemptsByKey = new Map();

/** @param {string} input */
function sha256Hex(input) {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/** @param {string} secret */
function signToken(secret) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

/** @param {string} identifier */
function checkRateLimit(identifier) {
  const windowStart = Math.floor(Date.now() / 1000 / RATE_LIMIT_WINDOW_SECONDS);
  const key = `${identifier}:${windowStart}`;
  const attempts = attemptsByKey.get(key) ?? 0;
  if (attempts >= RATE_LIMIT_MAX_ATTEMPTS) return false;
  attemptsByKey.set(key, attempts + 1);
  return true;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export function verifyAccess(req, res) {
  const identifier = String(req.headers["x-forwarded-for"] ?? "").split(",")[0]?.trim() || req.ip || "unknown";
  if (!checkRateLimit(identifier)) {
    return res.status(429).json({ ok: false, reason: "network" });
  }

  const code = req.body?.code;
  if (typeof code !== "string") {
    return res.status(500).json({ ok: false, reason: "network" });
  }

  if (sha256Hex(code) !== process.env.KNOCK_CODES_SERVER_HASH) {
    return res.json({ ok: false, reason: "invalid" });
  }

  return res.json({ ok: true, token: signToken(/** @type {string} */ (process.env.KNOCK_CODES_TOKEN_SECRET)) });
}
