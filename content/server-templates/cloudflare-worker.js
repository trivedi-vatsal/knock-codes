// @ts-check
/**
 * Access Gate — Cloudflare Worker server verification template.
 *
 * Deploy: bind a KV namespace as RATE_LIMIT_KV, and set two secrets:
 *   wrangler kv namespace create RATE_LIMIT_KV
 *   wrangler secret put ACCESS_GATE_SERVER_HASH
 *   wrangler secret put ACCESS_GATE_TOKEN_SECRET
 *
 * Wire contract (identical across all three server templates):
 *   POST { code: string }
 *   -> 200 { ok: true, token } | 200 { ok: false, reason: "invalid" }
 *   -> 429/500 { ok: false, reason: "network" } (rate-limited or errored —
 *      deliberately the same body shape, so neither is distinguishable)
 */

const RATE_LIMIT_MAX_ATTEMPTS = 5; // adjust per deployment
const RATE_LIMIT_WINDOW_SECONDS = 60;
const TOKEN_TTL_MS = 5 * 60_000; // 5 minutes

/** @param {Uint8Array} bytes */
function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** @param {string} input */
async function sha256Hex(input) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** @param {string} secret */
async function signToken(secret) {
  const payload = base64Url(new TextEncoder().encode(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${base64Url(new Uint8Array(signature))}`;
}

/**
 * @param {{ get(key: string): Promise<string | null>, put(key: string, value: string, opts?: { expirationTtl: number }): Promise<void> }} kv
 * @param {string} identifier
 */
async function checkRateLimit(kv, identifier) {
  const windowStart = Math.floor(Date.now() / 1000 / RATE_LIMIT_WINDOW_SECONDS);
  const key = `ratelimit:${identifier}:${windowStart}`;
  const attempts = Number((await kv.get(key)) ?? "0");
  if (attempts >= RATE_LIMIT_MAX_ATTEMPTS) return false;
  await kv.put(key, String(attempts + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  return true;
}

export default {
  /**
   * @param {Request} request
   * @param {{ RATE_LIMIT_KV: Parameters<typeof checkRateLimit>[0], ACCESS_GATE_SERVER_HASH: string, ACCESS_GATE_TOKEN_SECRET: string }} env
   */
  async fetch(request, env) {
    if (request.method !== "POST") return new Response(null, { status: 405 });

    const identifier = request.headers.get("cf-connecting-ip") ?? "unknown";
    if (!(await checkRateLimit(env.RATE_LIMIT_KV, identifier))) {
      return Response.json({ ok: false, reason: "network" }, { status: 429 });
    }

    let code;
    try {
      ({ code } = /** @type {{ code?: unknown }} */ (await request.json()));
    } catch {
      code = undefined;
    }
    if (typeof code !== "string") {
      return Response.json({ ok: false, reason: "network" }, { status: 500 });
    }

    if ((await sha256Hex(code)) !== env.ACCESS_GATE_SERVER_HASH) {
      return Response.json({ ok: false, reason: "invalid" });
    }

    return Response.json({ ok: true, token: await signToken(env.ACCESS_GATE_TOKEN_SECRET) });
  },
};
