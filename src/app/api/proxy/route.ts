
import { NextRequest, NextResponse } from "next/server";

// Optional: whitelist domains you trust. Remove or leave empty to allow all.
const ALLOWED_DOMAINS: string[] = [
  // "www.lianputeaart.com",
  // "api.example.com",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  // ── Validate ────────────────────────────────────────────────────────────────
  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing `url` query parameter" },
      { status: 400 }
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL format" },
      { status: 400 }
    );
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json(
      { error: "Only http/https URLs are allowed" },
      { status: 400 }
    );
  }

  if (
    ALLOWED_DOMAINS.length > 0 &&
    !ALLOWED_DOMAINS.includes(parsed.hostname)
  ) {
    return NextResponse.json(
      { error: `Domain "${parsed.hostname}" is not whitelisted` },
      { status: 403 }
    );
  }

  // ── Forward optional headers from client (e.g. Authorization) ───────────────
  const forwardHeaders: Record<string, string> = {
    Accept: "application/json",
  };
  const auth = req.headers.get("x-proxy-authorization");
  if (auth) forwardHeaders["Authorization"] = auth;

  // ── Proxy the request ────────────────────────────────────────────────────────
  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      headers: forwardHeaders,
      next: { revalidate: 60 }, // ISR cache — set to 0 for always-fresh
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to reach upstream: ${(err as Error).message}` },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  const body = await upstream.text(); // read as text first — works for any type

  // Return JSON parsed if the upstream is JSON, otherwise raw text
  if (contentType.includes("application/json")) {
    try {
      return NextResponse.json(JSON.parse(body), {
        status: upstream.status,
      });
    } catch {
      // malformed JSON from upstream — return as text
    }
  }

  return new NextResponse(body, {
    status: upstream.status,
    headers: { "Content-Type": contentType || "text/plain" },
  });
}