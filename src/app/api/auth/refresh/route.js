import jwt from "jsonwebtoken";
import {
  getSecretKey,
  extractToken,
  verifyToken,
  jsonResponse,
} from "@/app/api/auth/_authUtils";

/**
 * POST /api/auth/refresh
 * Exchanges a valid token for a fresh one (1h). Frontend
 * `authLogin.renewToken()` relies on this.
 */
export async function POST(req) {
  const token = extractToken(req);
  if (!token) {
    return jsonResponse({ message: "No token provided" }, 401);
  }

  const payload = verifyToken(token);
  if (!payload) {
    return jsonResponse({ message: "Invalid or expired token" }, 401);
  }

  // Issue a new token with the same identity, without inherited iat/exp.
  const freshToken = jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    getSecretKey(),
    { expiresIn: "1h" }
  );

  return jsonResponse({ message: "Token refreshed", token: freshToken }, 200);
}
