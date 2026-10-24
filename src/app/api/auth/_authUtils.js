import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

// ─── Shared auth helpers for /api/auth/* routes ───────────────────────────

const uri = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB;

export function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return secret;
}

/**
 * Extract the JWT from either:
 *   Authorization: Bearer <token>   (header)
 *   authToken=<token>               (cookie)
 * Returns the raw token string, or null if none found.
 */
export function extractToken(req) {
  const header = req.headers.get("authorization") || "";
  const bearer = header.match(/^Bearer\s+(.+)$/i);
  if (bearer) return bearer[1].trim();

  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)authToken=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);

  return null;
}

/** Verify a JWT; returns the decoded payload or null if invalid/expired. */
export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecretKey());
  } catch {
    return null;
  }
}

// ─── MongoDB (connection pooled per module) ───────────────────────────────

let cachedClient = null;

async function connectDb() {
  if (cachedClient) return cachedClient.db(dbName);

  if (!uri || !dbName) {
    throw new Error("Please define MONGODB_URL and MONGODB_DB environment variables");
  }

  const client = new MongoClient(uri);
  cachedClient = await client.connect();
  return cachedClient.db(dbName);
}

/** Fetch a Users document by its string/ObjectId id, or null. */
export async function getUserById(id) {
  const { ObjectId } = await import("mongodb");
  if (!id || !ObjectId.isValid(id)) return null;

  const db = await connectDb();
  return db.collection("Users").findOne({ _id: new ObjectId(id) });
}

/** Shape a stored user document into a client-safe object. */
export function serializeUser(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}
