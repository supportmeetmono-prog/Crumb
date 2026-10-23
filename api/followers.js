"use strict";

/**
 * CRUMB X follower-count endpoint.
 * Only server-side code sees X_BEARER_TOKEN. The visitor receives public numbers.
 * Vercel Edge Cache reduces billable X API lookups to roughly one request per
 * five minutes per active CDN cache (not one lookup per visitor).
 */
const USERNAME = "realcrumb_";
const GOAL = 1000000;
const UPSTREAM_TIMEOUT_MS = 8000;

export default async function followersHandler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.setHeader("Cache-Control", "no-store");
    return res.status(405).json({ status: "method_not_allowed" });
  }

  // The environment secret must be configured only in Vercel Production.
  const token = process.env.X_BEARER_TOKEN;
  if (typeof token !== "string" || !token.trim()) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).json({ status: "unavailable", reason: "not_configured" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const url = "https://api.x.com/2/users/by/username/" +
      encodeURIComponent(USERNAME) + "?user.fields=public_metrics";
    const reply = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.trim(),
        Accept: "application/json"
      },
      signal: controller.signal
    });

    if (!reply.ok) {
      // Do not expose upstream error bodies, tokens, headers or account data.
      const reasons = {
        401: "invalid_credentials",
        402: "credits_required",
        403: "access_denied",
        404: "account_unavailable",
        429: "rate_limited"
      };
      const reason = reasons[reply.status] || "upstream_error";
      console.warn("X follower lookup blocked: HTTP " + reply.status);
      res.setHeader("Cache-Control", "no-store");
      return res.status(503).json({ status: "unavailable", reason });
    }

    const json = await reply.json();
    const user = json && json.data;
    const count = user && user.public_metrics && user.public_metrics.followers_count;
    if (!user || String(user.username).toLowerCase() !== USERNAME ||
        !Number.isSafeInteger(count) || count < 0) {
      console.warn("X follower lookup returned unexpected data");
      res.setHeader("Cache-Control", "no-store");
      return res.status(503).json({ status: "unavailable", reason: "invalid_response" });
    }

    // Do not cache access problems. Success response is safe to share among visitors.
    res.setHeader("Cache-Control", "public, max-age=30");
    res.setHeader("Vercel-CDN-Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({
      status: "ok",
      source: "X API",
      username: USERNAME,
      followers: count,
      goal: GOAL,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn("X follower lookup failed:", error && error.name === "AbortError" ? "timeout" : "network");
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).json({
      status: "unavailable",
      reason: error && error.name === "AbortError" ? "timeout" : "network_error"
    });
  } finally {
    clearTimeout(timeout);
  }
};
