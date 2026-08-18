// @ts-check
/**
 * Knock Codes — Next.js route handler server verification template.
 * Drop at app/api/verify-access/route.js (App Router).
 *
 * Set two env vars: KNOCK_CODES_SERVER_HASH, KNOCK_CODES_TOKEN_SECRET.
 *
 * Wire contract identical across all server templates — see the
 * Cloudflare Worker template in this same folder for the full contract.
 *
 * Session restore (pair with `validateSession` on useKnockCodes / the
 * provider). A stored `{ unlockedAt, expiresAt }` in localStorage is not
 * proof of unlock — check the token:
 *
 *   validateSession: async (session) => {
 *     if (!session.token) return false;
 *     const res = await fetch("/api/verify-access", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ token: session.token }),
 *     });
 *     const body = await res.json();
 *     return body.ok === true;
 *   }
 *
 * Server mode hides the hash from the client bundle. It does not hide
 * client-rendered children — fetch protected data only after unlock.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

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

/** @param {string} actual @param {string | undefined} expected */
function hashesMatch(actual, expected) {
  if (typeof expected !== "string") return false;
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** @param {string} secret */
function signToken(secret) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

/** @param {string} token @param {string} secret */
function verifyToken(token, secret) {
  const dot = token.lastIndexOf(".");
  if (dot < 1) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
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

  /** @type {{ code?: unknown, token?: unknown }} */
  let body;
  try {
    body = /** @type {{ code?: unknown, token?: unknown }} */ (await request.json());
  } catch {
    body = {};
  }

  const secret = process.env.KNOCK_CODES_TOKEN_SECRET;
  if (typeof body.token === "string") {
    const ok = typeof secret === "string" && verifyToken(body.token, secret);
    return Response.json(ok ? { ok: true, token: body.token } : { ok: false, reason: "invalid" });
  }

  if (typeof body.code !== "string") {
    return Response.json({ ok: false, reason: "network" }, { status: 500 });
  }

  if (!hashesMatch(sha256Hex(body.code), process.env.KNOCK_CODES_SERVER_HASH)) {
    return Response.json({ ok: false, reason: "invalid" });
  }

  return Response.json({ ok: true, token: signToken(/** @type {string} */ (secret)) });
}
