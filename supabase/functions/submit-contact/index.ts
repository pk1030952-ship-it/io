// Public contact form endpoint; only this server-side function may insert contact messages.
// The publishable key is NOT authentication. Privileged database calls use a server-only key.
const allowedOrigins = new Set([
  "https://pk1030952-ship-it.github.io",
  "https://pk1048030-glitch.github.io",
]);
const standardHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Vary": "Origin",
};

function response(status: number, body: Record<string, unknown>, origin = "") {
  const headers: Record<string, string> = { ...standardHeaders };
  if (allowedOrigins.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return new Response(JSON.stringify(body), { status, headers });
}

function getSecretKey() {
  let named: Record<string, string> = {};
  try { named = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}"); } catch { /* legacy fallback */ }
  return named.default || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

async function ipFingerprint(ip: string, serverKey: string) {
  // Domain-separated key; no raw visitor IP address enters the database or logs.
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.digest(
    "SHA-256", encoder.encode("pj-contact-fingerprint:v1:" + serverKey)
  );
  const key = await crypto.subtle.importKey(
    "raw", keyMaterial, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(ip));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") {
    return allowedOrigins.has(origin)
      ? new Response(null, { status: 204, headers: { ...standardHeaders, "Access-Control-Allow-Origin": origin } })
      : new Response(null, { status: 403, headers: { Vary: "Origin" } });
  }
  if (req.method !== "POST") return response(405, { error: "Method not allowed" }, origin);
  if (!allowedOrigins.has(origin)) return response(403, { error: "Origin not allowed" });

  const expected = Deno.env.get("PORTFOLIO_PUBLISHABLE_KEY") || "";
  if (!expected || req.headers.get("apikey") !== expected) {
    return response(401, { error: "Unauthorized" }, origin);
  }

  let body: Record<string, unknown>;
  try {
    if (Number(req.headers.get("content-length") || 0) > 10000) {
      return response(413, { error: "Message too large" }, origin);
    }
    const raw = await req.text();
    if (raw.length > 10000) return response(413, { error: "Message too large" }, origin);
    body = JSON.parse(raw);
    if (!body || Array.isArray(body) || typeof body !== "object") throw Error();
  } catch {
    return response(400, { error: "Invalid request" }, origin);
  }

  const honeypot = String(body.website || "").trim();
  if (honeypot) return response(400, { error: "Message could not be sent" }, origin);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (name.length < 1 || name.length > 100 || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      subject.length > 180 || message.length < 5 || message.length > 5000) {
    return response(400, { error: "Please check the form fields" }, origin);
  }

  const projectUrl = Deno.env.get("SUPABASE_URL") || "";
  const secretKey = getSecretKey();
  if (!projectUrl || !secretKey) {
    console.error("Contact endpoint missing server-side database configuration.");
    return response(503, { error: "Service temporarily unavailable" }, origin);
  }

  // Gateway-injected forwarding headers are best-effort; IP-only limiting is
  // not a substitute for bot challenges or a gateway-level protection plan.
  const ip = req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const fingerprint = await ipFingerprint(ip, secretKey);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "apikey": secretKey,
    };
    // Legacy service_role key is a JWT; new sb_secret keys are not.
    if (!secretKey.startsWith("sb_secret_")) headers.Authorization = "Bearer " + secretKey;
    const dbResponse = await fetch(
      projectUrl.replace(/\/$/, "") + "/rest/v1/rpc/submit_portfolio_contact",
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          p_name: name, p_email: email, p_subject: subject || null,
          p_message: message, p_fingerprint: fingerprint,
        }),
        signal: AbortSignal.timeout(12000),
      }
    );
    if (!dbResponse.ok) {
      const result = await dbResponse.json().catch(() => ({}));
      if (result?.message === "contact_rate_limited") {
        return response(429, { error: "Please try again later" }, origin);
      }
      console.error("Contact database request failed, status:", dbResponse.status);
      return response(503, { error: "Message could not be sent now" }, origin);
    }
    return response(200, { ok: true }, origin);
  } catch {
    return response(503, { error: "Message service temporarily unavailable" }, origin);
  }
});
