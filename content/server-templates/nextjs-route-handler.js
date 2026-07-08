// @ts-check
/**
 * Access Gate — Next.js route handler server verification template.
 * Drop at app/api/verify-access/route.js (App Router).
 *
 * Set two env vars: ACCESS_GATE_SERVER_HASH, ACCESS_GATE_TOKEN_SECRET.
 *
 * Wire contract identical across all three server templates — see the
 * Cloudflare Worker template in this same folder for the full contract.
 */
import { createHash, createHmac } from "node:crypto";

const RATE_LIMIT_MAX_ATTEMPTS = 5; // adjust per deployment
const RATE_LIMIT_WINDOW_SECONDS = 60;
const TOKEN_TTL_MS = 5 * 60_000; // 5 minutes

// In-memory counter — acceptable ONLY for a single-instance/dev deployment.
// Vercel and most production hosts run multiple instances, so this counter
// would not be shared across them; swap in Redis or Vercel KV (a single
// shared store, same key scheme below) before deploying for real.
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

/** @param {Request} request */
export async function POST(request) {
  const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(identifier)) {
    return Response.json({ ok: false, reason: "network" }, { status: 429 });
  }

  /** @type {unknown} */
  let code;
  try {
    ({ code } = /** @type {{ code?: unknown }} */ (await request.json()));
  } catch {
    code = undefined;
  }
  if (typeof code !== "string") {
    return Response.json({ ok: false, reason: "network" }, { status: 500 });
  }

  if (sha256Hex(code) !== process.env.ACCESS_GATE_SERVER_HASH) {
    return Response.json({ ok: false, reason: "invalid" });
  }

  return Response.json({ ok: true, token: signToken(/** @type {string} */ (process.env.ACCESS_GATE_TOKEN_SECRET)) });
}
